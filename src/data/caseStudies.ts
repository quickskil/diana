export type CaseStudy = {
  nicheKey: string;
  slug: string;
  title: string;
  overview: string;
  whyThisNiche: string;
  ourSolution: string[];
  proofIdeas: string[];
  interactivePrompt: string;
  ctaText: string;
  ctaLink: string;
  metaDescription: string;
};

export const caseStudies: CaseStudy[] = [
  {
    nicheKey: 'home-services',
    slug: '/case-study/home-services',
    title: 'Home Services Teams: Never Miss an Urgent Call',
    overview:
      'Roofing, HVAC, plumbing, and landscaping crews live on the phone — yet peak-season workloads mean up to 40% of those inbound calls still roll to voicemail. When that happens, homeowners simply dial the next provider and the job is gone.',
    whyThisNiche:
      'Home service buyers act fast when equipment fails or projects open up, so the first team to answer and schedule wins. Our system keeps you at the top of search, answers instantly, and routes hot jobs to the right tech.',
    ourSolution: [
      'Conversion-focused service pages that highlight financing, warranties, and rapid response promises.',
      'High-intent Google and Local Services ads with call scoring and tracking baked in.',
      'AI voice agent that greets every caller, qualifies the job, and books on your shared calendar 24/7.',
      'Warm transfers for emergencies plus instant text/email summaries for your dispatchers.',
    ],
    proofIdeas: [
      'Reduce missed-call rate from 38% to under 5% in the first month.',
      'Add 12-18 extra booked service calls per crew per month from reclaimed leads.',
      'Trim after-hours answering costs by 45% while keeping overnight coverage.',
    ],
    interactivePrompt: 'How many service calls go unanswered while your crews are on ladders or in crawl spaces?',
    ctaText: 'Reserve your $99 build now',
    ctaLink: '/onboarding?source=niche_home-services',
    metaDescription:
      'See how home service contractors use Business Booster AI to capture every call, book urgent jobs, and scale crews with a $99 kickoff.',
  },
  {
    nicheKey: 'healthcare-clinics',
    slug: '/case-study/healthcare-clinics',
    title: 'Healthcare Clinics: Fill the Schedule Without Adding Staff',
    overview:
      'Dental, med-spa, and therapy clinics juggle high call volumes, insurance questions, and appointment requests — and patients rarely leave voicemails when they hit a busy signal. Missed calls directly translate to empty chair time and lost lifetime value.',
    whyThisNiche:
      'Clinics need compliant intake, quick triage, and seamless scheduling so providers stay booked. Our funnel answers every inquiry within seconds and nudges patients to confirmed visits.',
    ourSolution: [
      'HIPAA-aware conversion pages that showcase providers, insurance, and before-and-after proof.',
      'Search and social campaigns optimized for high-intent service keywords and local radius targeting.',
      'AI voice agent that answers 24/7, pre-screens insurance, collects intake details, and books into your EHR-integrated calendar.',
      'Automated waitlist callbacks and warm transfers to front desk staff for complex cases.',
    ],
    proofIdeas: [
      'Cut new-patient response times from hours to under 60 seconds for every inquiry.',
      'Fill 8+ additional chair hours per provider each week with reclaimed phone leads.',
      'Lower staffing costs by 40-50% compared to adding a full-time receptionist.',
    ],
    interactivePrompt: 'How many first-time patients call after hours or during a procedure and never hear back?',
    ctaText: 'Lock in your $99 kickoff consult',
    ctaLink: '/onboarding?source=niche_healthcare-clinics',
    metaDescription:
      'Discover how healthcare and wellness clinics use AI call handling to book more patients, protect compliance, and launch with just a $99 kickoff.',
  },
  {
    nicheKey: 'real-estate',
    slug: '/case-study/real-estate',
    title: 'Real Estate & Property Management: Capture Every Lead',
    overview:
      'Prospective buyers, renters, and owners expect instant answers when they inquire about a property. Brokers and property managers constantly miss calls while on showings, letting competitors or listing marketplaces scoop the deal.',
    whyThisNiche:
      'Transactions move fast, and the agent who responds within minutes wins the relationship. Our system qualifies leads, schedules showings, and loops in your team before competitors call back.',
    ourSolution: [
      'High-converting listing and management proposal pages with neighborhood proof and fees spelled out.',
      'Paid search and social retargeting tuned to seller leads, relocation keywords, and investor segments.',
      'AI voice agent that answers branded lines, verifies budget and move timelines, and books tours or management consults 24/7.',
      'Immediate summaries sent to agents plus optional warm transfer for hot seller inquiries.',
    ],
    proofIdeas: [
      'Respond to every new lead within 30 seconds, improving qualification odds by 7×.',
      'Secure 10-15 more listing appointments per month from saved seller and landlord calls.',
      'Shrink after-hours answering service spend by 50% while maintaining 24/7 coverage.',
    ],
    interactivePrompt: 'Could instant follow-up turn more property inquiries into confirmed tours this month?',
    ctaText: 'Start your $99 market launch',
    ctaLink: '/onboarding?source=niche_real-estate',
    metaDescription:
      'Learn how real estate brokers and property managers automate lead capture, showing schedules, and follow-up with a $99 Business Booster kickoff.',
  },
  {
    nicheKey: 'legal-services',
    slug: '/case-study/legal-services',
    title: 'Legal Services: Secure High-Value Clients First',
    overview:
      'Personal injury and family law firms field urgent, emotional calls where minutes matter. When intake teams are busy or after hours, up to 40% of prospects ring another attorney and never return.',
    whyThisNiche:
      'The first empathetic voice to qualify and schedule a consultation usually wins the retainer. Our AI receptionist handles overflow, ensures compliance, and escalates priority cases instantly.',
    ourSolution: [
      'Trust-rich landing pages with verdict highlights, testimonials, and clear next steps for clients in crisis.',
      'Search and Local Services ads optimized for intent signals like “speak to a lawyer now.”',
      'AI voice agent that answers immediately, collects case facts, flags conflicts, and books consultations on your calendar.',
      'Warm hand-offs to on-call attorneys for time-sensitive matters plus secure call transcripts.',
    ],
    proofIdeas: [
      'Increase signed retainers by 20% through faster response and qualification.',
      'Reclaim 15-25 inbound leads per month that previously went unanswered.',
      'Reduce reliance on outsourced answering services by 60% while improving documentation.',
    ],
    interactivePrompt: 'How quickly can a new client speak to counsel when your intake specialist is on another call?',
    ctaText: 'Claim your $99 intake overhaul',
    ctaLink: '/onboarding?source=niche_legal-services',
    metaDescription:
      'See how legal firms use AI intake and conversion funnels to secure retainers faster — starting with a $99 kickoff.',
  },
  {
    nicheKey: 'auto-services',
    slug: '/case-study/auto-services',
    title: 'Auto Service Shops: Keep Bays Booked Solid',
    overview:
      'Repair, body, and detailing shops rely on steady phone flow to plan technicians and parts. Missed calls during rush hours lead to empty bays tomorrow and frustrated customers turning to national chains.',
    whyThisNiche:
      'Vehicle owners choose the shop that answers first with real availability. Our system captures every inquiry, prices common jobs, and fills the calendar without adding front-desk payroll.',
    ourSolution: [
      'Performance-focused service menus and estimate request pages with before/after proof.',
      'Search and map ads aimed at high-intent repair and maintenance keywords with call tracking.',
      'AI voice agent that answers branded lines, quotes standard services, and books drop-off times instantly.',
      'Automated reminders, reschedule handling, and warm transfers for complex repair questions.',
    ],
    proofIdeas: [
      'Boost booked appointments by 18-25% from recovered missed calls.',
      'Maintain 24/7 coverage while cutting overtime and answering costs by up to 50%.',
      'Fill cancellations within minutes using proactive callback sequences.',
    ],
    interactivePrompt: 'What would it mean if every voicemail turned into a confirmed drop-off time?',
    ctaText: 'Kick off for $99 today',
    ctaLink: '/onboarding?source=niche_auto-services',
    metaDescription:
      'Discover how auto repair, body, and detailing shops use AI reception and high-intent funnels to stay fully booked with a $99 start.',
  },
  {
    nicheKey: 'financial-insurance',
    slug: '/case-study/financial-insurance',
    title: 'Financial & Insurance Advisors: Respond Before Competitors Do',
    overview:
      'Prospects shopping for coverage or financial guidance expect clarity within minutes, yet advisors are often in meetings when leads call back. Slow response creates compliance risks and sends warm prospects to national call centers.',
    whyThisNiche:
      'High-value households reward the advisor who responds fast with authority and empathy. Our funnel educates, pre-qualifies, and routes serious opportunities straight to your desk.',
    ourSolution: [
      'Authority-building landing pages with calculators, compliance-friendly disclosures, and credibility assets.',
      'Targeted search and retargeting ads that filter for income, business owner, or life event triggers.',
      'AI voice agent that answers 24/7, captures financial goals, verifies qualification criteria, and books consultations.',
      'Instant summaries pushed to your CRM with warm transfers for urgent underwriting or policy changes.',
    ],
    proofIdeas: [
      'Lift consultation conversion rates by 22% through sub-60-second callbacks.',
      'Recapture 10-12 high-intent leads per month that previously stalled in voicemail.',
      'Reduce administrative call-handling costs by 40-65% compared to additional staff.',
    ],
    interactivePrompt: 'How fast does a new lead hear from you when you are in back-to-back review meetings?',
    ctaText: 'Secure your $99 launch workshop',
    ctaLink: '/onboarding?source=niche_financial-insurance',
    metaDescription:
      'Learn how financial advisors and insurance agencies automate call handling, qualification, and scheduling with a $99 Business Booster kickoff.',
  },
  {
    nicheKey: 'wellness-personal-care',
    slug: '/case-study/wellness-personal-care',
    title: 'Wellness & Personal Care: Fill Every Open Appointment',
    overview:
      'Salons, spas, and chiropractic clinics rely on a consistent flow of bookings, yet staff are often with clients when new inquiries arrive. Missed calls equal empty time slots and lost retail add-ons.',
    whyThisNiche:
      'Guests expect instant confirmation and frictionless rebooking. Our platform keeps your brand visible, your phones answered, and your calendar humming even after hours.',
    ourSolution: [
      'Stylish service landing pages with membership offers, reviews, and clear booking paths.',
      'Always-on ads targeting local intent, special occasions, and lapsed guest segments.',
      'AI voice agent that answers like your front desk, suggests upsells, and books or reschedules in real time.',
      'Automated reminders, no-show recovery sequences, and instant alerts for VIP clients.',
    ],
    proofIdeas: [
      'Improve show-up rates by 15% with proactive confirmations and reschedule flows.',
      'Recover 20+ missed appointment requests each month without adding staff hours.',
      'Boost membership or package sales by surfacing offers during every answered call.',
    ],
    interactivePrompt: 'Which time slots go unfilled today because no one could answer the phone?',
    ctaText: 'Launch for $99 and fill your calendar',
    ctaLink: '/onboarding?source=niche_wellness-personal-care',
    metaDescription:
      'See how salons, spas, and wellness clinics use AI scheduling and conversion funnels to fill every slot starting with a $99 kickoff.',
  },
  {
    nicheKey: 'education-coaching',
    slug: '/case-study/education-coaching',
    title: 'Education & Coaching: Enroll Faster With Instant Follow-Up',
    overview:
      'Tutors, test prep centers, and coaching programs field inquiries from motivated families and professionals who compare multiple providers. If your team waits hours to respond, the lead often commits elsewhere.',
    whyThisNiche:
      'Enrollment hinges on speedy consults and personalized guidance. Our system captures every call, qualifies the fit, and books consults before a competitor can reply.',
    ourSolution: [
      'Outcome-focused landing pages showcasing results, testimonials, and curriculum previews.',
      'Omnichannel ads targeting seasonal spikes, exam dates, and career-changing events.',
      'AI voice agent that answers questions, routes to the right program director, and books discovery sessions 24/7.',
      'Lead nurturing with recap emails, SMS nudges, and handoffs for high-ticket coaching prospects.',
    ],
    proofIdeas: [
      'Increase enrollment consultations by 25% through instant callbacks and scheduling.',
      'Re-engage 30% of previously lost leads with automated nurture sequences.',
      'Lower cost-per-enrollment by 18% with unified ads and follow-up.',
    ],
    interactivePrompt: 'How quickly can a new family or executive get a discovery call on the books?',
    ctaText: 'Book your $99 enrollment sprint',
    ctaLink: '/onboarding?source=niche_education-coaching',
    metaDescription:
      'Discover how education and coaching businesses convert more inquiries into enrollments with a $99 kickoff and AI-powered follow-up.',
  },
  {
    nicheKey: 'home-improvement',
    slug: '/case-study/home-improvement',
    title: 'Home Improvement & Remodeling: Protect Every Project Lead',
    overview:
      'Kitchen, bath, and remodeling firms juggle consultations, job sites, and supplier calls, so new project inquiries often get delayed responses. Homeowners ready to invest won’t wait after the third voicemail.',
    whyThisNiche:
      'Big-ticket projects demand fast, professional follow-up and clear next steps. Our funnel keeps you visible, qualifies scope and budget, and books design consultations before prospects shop around.',
    ourSolution: [
      'Portfolio-rich project pages with financing options, process walk-throughs, and credibility markers.',
      'Targeted ads hitting addition, renovation, and insurance restoration keywords within your service area.',
      'AI voice agent that captures project scope, confirms budget, and schedules showroom or in-home consultations 24/7.',
      'Instant recaps with call transcripts so sales teams walk into consults prepared.',
    ],
    proofIdeas: [
      'Lift consultation bookings by 20% by answering every inquiry within seconds.',
      'Save 10+ hours per week of owner time previously spent chasing voicemails.',
      'Reduce cost of acquisition by 30% through unified ads-to-voice attribution.',
    ],
    interactivePrompt: 'How many remodel-ready homeowners picked another contractor before you could respond?',
    ctaText: 'Schedule your $99 project kickoff',
    ctaLink: '/onboarding?source=niche_home-improvement',
    metaDescription:
      'See how remodeling and home improvement firms capture every project-ready lead with AI intake and a $99 kickoff.',
  },
];

export const caseStudyByKey = new Map(caseStudies.map((entry) => [entry.nicheKey, entry]));
