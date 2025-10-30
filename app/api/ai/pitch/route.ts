
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function POST(req: NextRequest) {
  try {
    const { company, tone, offer } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
    if (!apiKey) return NextResponse.json({ text: `(${company}) ${offer}: Unlock more revenue with modern funnels, blazing-fast websites, and AI receptionists.` });
    const r = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, input: `Write a ${tone} 2-sentence pitch for ${company} promoting ${offer}. Focus on outcomes, trust, and speed.` })
    });
    const data = await r.json();
    const text = data?.output_text || (Array.isArray(data?.output) ? data.output.map((x:any)=>x?.content?.[0]?.text || '').join('\n') : '');
    return NextResponse.json({ text });
  } catch (e:any) { return NextResponse.json({ error: e?.message || 'error' }, { status: 500 }); }
}
