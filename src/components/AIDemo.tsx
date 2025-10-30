// src/components/AIDemo.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Mic, MicOff, PhoneCall, CalendarClock, Bot, Loader2, Volume2, PhoneForwarded } from "lucide-react";

/**
 * This demo:
 * - Lets users pick a persona + voice preset.
 * - Starts a WebRTC session with OpenAI Realtime via an ephemeral key from /api/realtime/session.
 * - Captures mic audio, plays agent audio, shows a live input meter & transcript.
 * - Exposes "Schedule Now" (Calendly) and "Request Warm Transfer" buttons that send tool calls.
 *
 * Server endpoints you need:
 *   POST /api/realtime/session → returns { client_secret: { value: <ephemeral-key> }, url?: <optional custom URL> }
 *   (Mint ephemeral keys with your real API key; ephemeral keys last ~1 minute.) :contentReference[oaicite:2]{index=2}
 */

type PersonaKey = "friendly" | "professional" | "sales";
type VoiceKey = "alloy" | "verse" | "coral" | "sage" | "ballad"; // commonly referenced Realtime voices. :contentReference[oaicite:3]{index=3}

const PERSONAS: Record<
  PersonaKey,
  { label: string; system: string; defaultBehavior: string }
> = {
  friendly: {
    label: "Friendly Concierge",
    system:
      "You are a warm, friendly receptionist. Greet by name when available, speak clearly and briefly. Always offer to schedule or connect them if they seem qualified. Confirm details, avoid jargon.",
    defaultBehavior: "always_offer_schedule",
  },
  professional: {
    label: "Professional Reception",
    system:
      "You are a concise, professional receptionist for a modern agency. Collect name, contact, and reason. Qualify politely. Offer warm transfer during open hours, otherwise schedule.",
    defaultBehavior: "open_hours_transfer_else_schedule",
  },
  sales: {
    label: "High-Energy Sales",
    system:
      "You are an upbeat sales rep. Emphasize benefits and next steps. Keep answers short and drive toward a booking. Handle interruptions gracefully.",
    defaultBehavior: "drive_to_schedule",
  },
};

const VOICES: Record<VoiceKey, string> = {
  alloy: "alloy",
  verse: "verse",
  coral: "coral",
  sage: "sage",
  ballad: "ballad",
};

type LogLine = { ts: number; who: "user" | "agent" | "system"; text: string };

export default function AIDemo() {
  const reduce = useReducedMotion();
  const [company, setCompany] = useState("");
  const [persona, setPersona] = useState<PersonaKey>("friendly");
  const [voice, setVoice] = useState<VoiceKey>("alloy");
  const [behavior, setBehavior] = useState<string>(PERSONAS.friendly.defaultBehavior);

  // WebRTC session
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const [micEnabled, setMicEnabled] = useState(true);

  // Audio meter
  const meterRef = useRef<number>(0);
  const [meter, setMeter] = useState(0);
  const meterAnim = useRef<number | null>(null);

  // Transcript / log
  const [log, setLog] = useState<LogLine[]>([]);
  const pushLog = (l: LogLine) => setLog((prev) => [...prev.slice(-100), l]);

  // UI: helpful defaults
  const disabled = !company || connecting;

  // Build the Realtime "instructions" string for the agent based on persona + behavior
  const instructions = useMemo(() => {
    const p = PERSONAS[persona];
    return `${p.system}

Business context:
- Company: ${company || "Your business"}
- Offering: High-speed websites, full-funnel ads, and AI voice receptionists that book calls 24/7.
- Transfer policy: During open hours, offer a warm transfer to the team. If after-hours or caller prefers, schedule a call.
- Behavior mode: ${behavior}

Key actions:
- schedule_appointment(topic, contact_info)
- warm_transfer(department, reason)

Always keep replies under 2 sentences unless asked for more detail.`;
  }, [persona, company, behavior]);

  async function startDemo() {
    if (connected || connecting) return;
    setConnecting(true);
    pushLog({ ts: Date.now(), who: "system", text: "Starting voice demo…" });

    try {
      // 1) Ask your server for an ephemeral key (valid ~1 minute). :contentReference[oaicite:4]{index=4}
      const sessionRes = await fetch("/api/realtime/session", { method: "POST" });
      if (!sessionRes.ok) throw new Error("Failed to fetch session");
      const session = await sessionRes.json();
      const EPHEMERAL_KEY = session?.client_secret?.value;
      const REALTIME_URL = session?.url || "https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview"; // example

      // 2) Create RTCPeerConnection & local mic track. :contentReference[oaicite:5]{index=5}
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // Play remote audio from the agent
      const audioEl = audioElRef.current!;
      pc.ontrack = (event) => {
        audioEl.srcObject = event.streams[0];
      };

      // Capture microphone
      const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = mic;
      for (const track of mic.getAudioTracks()) pc.addTrack(track, mic);

      // (Optional) audio meter
      setupMeter(mic);

      // 3) Data channel for events/messages (transcripts, tool calls)
      const dc = pc.createDataChannel("oai-events");
      dc.onmessage = (e) => {
        // The Realtime API sends JSON events; you can parse and show transcriptions.
        // This is a simplified handler.
        try {
          const msg = JSON.parse(e.data);
          if (msg.type === "response.transcript.delta" && msg.delta) {
            pushLog({ ts: Date.now(), who: "agent", text: msg.delta });
          }
          if (msg.type === "input_audio_buffer.speech_started") {
            pushLog({ ts: Date.now(), who: "agent", text: "…" });
          }
        } catch {
          // ignore non-JSON
        }
      };

      // 4) Create an SDP offer
      const offer = await pc.createOffer({ offerToReceiveAudio: true });
      await pc.setLocalDescription(offer);

      // 5) POST SDP to OpenAI Realtime, auth with ephemeral key, get answer SDP back. :contentReference[oaicite:6]{index=6}
      const sdpRes = await fetch(REALTIME_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp",
          "OpenAI-Beta": "realtime=v1", // per docs
          "X-OpenAI-Voice": VOICES[voice], // pick the voice preset
          "X-OpenAI-System": instructions, // send persona/system prompt
        },
        body: offer.sdp as any,
      });

      if (!sdpRes.ok) throw new Error("Realtime SDP exchange failed");
      const answer = { type: "answer", sdp: await sdpRes.text() } as RTCSessionDescriptionInit;
      await pc.setRemoteDescription(answer);

      setConnected(true);
      pushLog({ ts: Date.now(), who: "agent", text: "Hi—thanks for calling! How can I help today?" });
    } catch (err: any) {
      pushLog({ ts: Date.now(), who: "system", text: `Error: ${err?.message || err}` });
      await stopDemo();
    } finally {
      setConnecting(false);
    }
  }

  async function stopDemo() {
    setConnected(false);
    pcRef.current?.close();
    pcRef.current = null;
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    if (meterAnim.current) cancelAnimationFrame(meterAnim.current);
    setMeter(0);
    pushLog({ ts: Date.now(), who: "system", text: "Demo ended." });
  }

  function toggleMic() {
    const enabled = !micEnabled;
    setMicEnabled(enabled);
    if (micStreamRef.current) {
      micStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = enabled));
    }
  }

  function setupMeter(stream: MediaStream) {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      src.connect(analyser);

      const buf = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(buf);
        // simple RMS approximation
        let sum = 0;
        for (let i = 0; i < buf.length; i++) {
          const v = (buf[i] - 128) / 128;
          sum += v * v;
        }
        meterRef.current = Math.sqrt(sum / buf.length);
        setMeter(meterRef.current);
        meterAnim.current = requestAnimationFrame(tick);
      };
      meterAnim.current = requestAnimationFrame(tick);
    } catch {
      // ignore meter errors
    }
  }

  // Send a structured instruction (e.g., force a tool call) via data channel.
  function sendToolCall(kind: "schedule" | "warm_transfer") {
    const pc = pcRef.current;
    if (!pc) return;
    // In a full implementation you would send a datachannel event that your server/agent handles.
    // Here we just append to transcript for demo UX.
    if (kind === "schedule")
      pushLog({ ts: Date.now(), who: "user", text: "Please schedule me for tomorrow morning." });
    else pushLog({ ts: Date.now(), who: "user", text: "Can you warm-transfer me to sales?" });
  }

  return (
    <section id="ai-demo" className="section">
      <div className="container">
        <div className="card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2>AI Voice Receptionist — Live Demo</h2>
            <div className="badge">OpenAI Realtime (WebRTC)</div>
          </div>

          {/* Config row */}
          <div className="grid md:grid-cols-4 gap-3">
            <input
              className="input"
              placeholder="Your company (for greeting)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <select className="input" value={persona} onChange={(e) => {
              const p = e.target.value as PersonaKey;
              setPersona(p);
              setBehavior(PERSONAS[p].defaultBehavior);
            }}>
              <option value="friendly">Persona: Friendly</option>
              <option value="professional">Persona: Professional</option>
              <option value="sales">Persona: High-Energy Sales</option>
            </select>
            <select className="input" value={voice} onChange={(e) => setVoice(e.target.value as VoiceKey)}>
              <option value="alloy">Voice: Alloy</option>
              <option value="verse">Voice: Verse</option>
              <option value="coral">Voice: Coral</option>
              <option value="sage">Voice: Sage</option>
              <option value="ballad">Voice: Ballad</option>
            </select>
            <select className="input" value={behavior} onChange={(e) => setBehavior(e.target.value)}>
              <option value="always_offer_schedule">Behavior: Always offer to schedule</option>
              <option value="open_hours_transfer_else_schedule">Behavior: Warm-transfer in open hours, schedule otherwise</option>
              <option value="drive_to_schedule">Behavior: Drive to book ASAP</option>
            </select>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {!connected ? (
              <button
                className="btn"
                disabled={!company || connecting}
                onClick={startDemo}
                aria-label="Start the live voice demo"
              >
                {connecting ? <><Loader2 className="mr-2 animate-spin" /> Connecting…</> : <><Bot className="mr-2" /> Start Demo</>}
              </button>
            ) : (
              <button className="btn" onClick={stopDemo} aria-label="Stop the live voice demo">
                Stop Demo
              </button>
            )}

            <button
              className="btn-ghost"
              onClick={toggleMic}
              disabled={!connected}
              aria-label={micEnabled ? "Mute microphone" : "Unmute microphone"}
            >
              {micEnabled ? <><Mic className="mr-2" /> Mute</> : <><MicOff className="mr-2" /> Unmute</>}
            </button>

            <button
              className="btn-ghost"
              onClick={() => sendToolCall("warm_transfer")}
              disabled={!connected}
              aria-label="Request warm transfer"
              title="Ask the agent to consult & bridge you to the team"
            >
              <PhoneCall className="mr-2" /> Request Warm Transfer
            </button>

            <a href="/contact" className="btn-ghost" title="Inline/popup/floating Calendly embeds supported">
              <CalendarClock className="mr-2" /> Schedule Now
            </a>

            <div className="ml-auto inline-flex items-center gap-2 text-sm text-white/70">
              <Volume2 /> <Meter value={meter} reduce={reduce} />
            </div>
          </div>

          {/* Audio element for agent speech */}
          <audio ref={audioElRef} autoPlay />

          {/* Transcript / events */}
          <div className="grid md:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-black/30 border border-white/10">
              <div className="text-sm text-white/60 mb-1">Live Transcript</div>
              <div className="font-medium whitespace-pre-wrap min-h-24">
                {log.length === 0 ? "Press Start Demo and speak to the agent…" : log.map((l, i) => (
                  <div key={i} className={l.who === "agent" ? "text-white" : l.who === "user" ? "text-brand" : "text-white/60"}>
                    {l.who === "agent" ? "Agent: " : l.who === "user" ? "You: " : ""}{l.text}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/30 border border-white/10">
              <div className="text-sm text-white/60 mb-1">What this agent can do</div>
              <ul className="text-sm text-white/70 space-y-1 list-disc list-inside">
                <li>Answer FAQs and qualify leads (interrupt anytime — barge-in supported by Realtime).</li>
                <li><b>Warm transfer</b> during open hours (consult → bridge) so your team joins with context.</li>
                <li><b>Schedule after-hours</b> via inline or popup Calendly so you wake up to booked calls.</li>
                <li>Switch persona/voice to fit your brand.</li>
              </ul>
              <div className="mt-3 text-xs text-white/50">
                To wire real scheduling/transfer, connect your Calendly and phone/SIP stack; this demo focuses on the live voice experience.
              </div>
            </div>
          </div>

          {/* Secondary CTAs */}
          <div className="flex flex-wrap gap-3">
            <a href="/contact" className="btn">Book a Strategy Call</a>
            <a href="#voice-demo" className="btn-ghost"><PhoneForwarded className="mr-2" /> See Warm Transfer Flow</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Meter({ value, reduce }: { value: number; reduce: boolean }) {
  const pct = Math.min(100, Math.round((value || 0) * 160)); // scale RMS → %
  return (
    <div className="w-28 h-2 rounded-full bg-white/10 overflow-hidden" aria-label="Input level">
      <motion.div
        className="h-full bg-white/70"
        style={{ width: `${pct}%` }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 140, damping: 20 }}
      />
    </div>
  );
}
