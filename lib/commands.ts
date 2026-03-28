export type OutputSegment =
  | { type: 'header'; text: string }
  | { type: 'text'; text: string }
  | { type: 'dim'; text: string }
  | { type: 'accent'; text: string }
  | { type: 'green'; text: string }
  | { type: 'link'; text: string; href: string }
  | { type: 'command-link'; text: string; command: string }
  | { type: 'tag'; text: string }
  | { type: 'blank' }
  | { type: 'divider' }
  | { type: 'error'; text: string }
  | { type: 'line'; segments: OutputSegment[] }

export type OutputBlock =
  | { kind: 'user'; text: string }
  | { kind: 'output'; segments: OutputSegment[]; id: string }
  | { kind: 'streaming'; text: string; id: string; done?: boolean }
  | { kind: 'thinking'; id: string }
  | { kind: 'system'; text: string }

function seg(...args: OutputSegment[]): OutputSegment[] {
  return args
}

const COMMANDS: Record<string, () => OutputSegment[]> = {
  help: () => [
    { type: 'header', text: 'Available commands' },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: '/about' }, { type: 'dim', text: 'who I am' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/projects' }, { type: 'dim', text: 'selected work' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/experience' }, { type: 'dim', text: 'work history' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/education' }, { type: 'dim', text: 'academic background' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/now' }, { type: 'dim', text: 'what I\'m working on' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/contact' }, { type: 'dim', text: 'get in touch' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/reading' }, { type: 'dim', text: 'books and papers' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/ask <question>' }, { type: 'dim', text: 'ask anything — AI powered' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/clear' }, { type: 'dim', text: 'clear terminal' }] },
    { type: 'blank' },
    { type: 'dim', text: 'Or just type a question — I\'ll answer it.' },
    { type: 'blank' },
    { type: 'dim', text: 'Questions are not stored.' },
  ],

  about: () => [
    { type: 'green', text: 'Yusuf Afifi' },
    { type: 'dim', text: 'Computer Science @ UCL · SWE/AI engineering' },
    { type: 'blank' },
    { type: 'text', text: 'Hackathon enthusiast and serial vibe coder (I prefer agentic engineering).' },
    { type: 'text', text: 'I build innovative software — AI and agentic solutions in the cloud,' },
    { type: 'text', text: 'and optimized inference for OSS models on hardware accelerators.' },
    { type: 'blank' },
    { type: 'text', text: 'UCL, London — BSc (Hons) Computer Science, minor in Applied' },
    { type: 'text', text: 'Mathematics, First Class expected (2026). Before that, IB at JESS Dubai.' },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'command-link', text: '/projects', command: '/projects' }, { type: 'dim', text: 'for projects' }] },
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'command-link', text: '/contact', command: '/contact' }, { type: 'dim', text: 'to get in touch' }] },
  ],

  projects: () => [
    { type: 'header', text: 'Projects & Research' },
    { type: 'blank' },
    { type: 'green', text: 'Petals — AI health & wellness (iOS)' },
    { type: 'text', text: 'iOS app using Apple Foundation Models on-device with a RAG layer on' },
    { type: 'text', text: 'HealthKit. Instruction-tuned "Petal" chatbot, meditations, journaling,' },
    { type: 'text', text: 'wellness plans — privacy-first, Neural Engine inference.' },
    { type: 'line', segments: [{ type: 'tag', text: '[Swift]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[On-device AI]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[RAG]' }] },
    {
      type: 'line',
      segments: [
        { type: 'accent', text: '→' },
        { type: 'link', text: 'App Store', href: 'https://apps.apple.com/us/app/petals-ai/id6749387193' },
        { type: 'dim', text: ' · ' },
        { type: 'link', text: 'Medium', href: 'https://medium.com/@yusuf.afifi/petals-ai-the-private-ai-revolution-e45ea6f3155f' },
      ],
    },
    { type: 'blank' },
    { type: 'green', text: 'StarPlex — startup intelligence platform' },
    { type: 'text', text: '2nd place, Perplexity London Hackathon. AI validates ideas and surfaces' },
    { type: 'text', text: 'markets, competitors, VCs, and demographics on an interactive 3D globe.' },
    { type: 'line', segments: [{ type: 'tag', text: '[Next.js]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[FastAPI]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[Perplexity Sonar]' }] },
    {
      type: 'line',
      segments: [
        { type: 'accent', text: '→' },
        { type: 'link', text: 'starplex.app', href: 'https://starplex.app' },
        { type: 'dim', text: ' · ' },
        { type: 'link', text: 'Perplexity showcase', href: 'https://docs.perplexity.ai/docs/cookbook/showcase/starplex' },
      ],
    },
    { type: 'blank' },
    { type: 'green', text: 'PolyWhisper — Polymarket from live audio (Chrome)' },
    { type: 'text', text: 'Extension that listens to podcasts, YouTube, Zoom, and other audio —' },
    { type: 'text', text: 'Deepgram realtime transcription and Grok topic detection spot when' },
    { type: 'text', text: 'prediction markets come up; sidebar shows live Polymarket odds. Audio not stored.' },
    { type: 'line', segments: [{ type: 'tag', text: '[Chrome]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[Deepgram]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[Polymarket]' }] },
    {
      type: 'line',
      segments: [
        { type: 'accent', text: '→' },
        {
          type: 'link',
          text: 'Chrome Web Store',
          href: 'https://chromewebstore.google.com/detail/polywhisper/cjjdmnjmlcddlconidalbdlblkcliken',
        },
      ],
    },
    { type: 'blank' },
    { type: 'green', text: 'ReadingStar — accessibility karaoke (Windows)' },
    { type: 'text', text: 'With Intel & National Autistic Society: offline speech-to-text, lyric' },
    { type: 'text', text: 'alignment, scoring; React Native Windows + FastAPI, Whisper, OpenVINO' },
    { type: 'text', text: 'on NPU. National school rollout; Intel featured as first education NPU app.' },
    { type: 'line', segments: [{ type: 'tag', text: '[React Native]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[FastAPI]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[Whisper]' }] },
    {
      type: 'line',
      segments: [
        { type: 'accent', text: '→' },
        {
          type: 'link',
          text: 'Intel showcase',
          href: 'https://www.intel.com/content/www/us/en/customer-spotlight/stories/university-college-london-customer-story.html',
        },
      ],
    },
    { type: 'blank' },
    { type: 'green', text: 'ML for fluid dynamics (research)' },
    { type: 'text', text: 'Undergrad research with an Imperial College Research Associate: convolutional' },
    { type: 'text', text: 'autoencoder for shallow-water simulation, LSTM in latent space, TensorFlow.' },
    { type: 'line', segments: [{ type: 'tag', text: '[TensorFlow]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[CFD]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[Research]' }] },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'command-link', text: '/experience', command: '/experience' }] },
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'link', text: 'github.com/afifi-yusuf', href: 'https://github.com/afifi-yusuf' }] },
  ],

  experience: () => [
    { type: 'header', text: 'Work Experience' },
    { type: 'blank' },
    { type: 'green', text: 'Software Development Engineer Intern — Gen AI' },
    { type: 'dim', text: 'Amazon Prime Video · Jun — Sep 2025 · London' },
    { type: 'text', text: 'Text-to-SQL agent for SVOD accounting: RAG on AWS Bedrock (Claude),' },
    { type: 'text', text: 'Kendra index, Redshift; cut ad-hoc query time about 75%.' },
    { type: 'text', text: 'Shipped internal React + Lambda/WebSocket API GW chat UI; AWS CDK & CI/CD;' },
    { type: 'text', text: 'IAM least-privilege; CloudWatch dashboards/alarms; 200+ weekly users globally.' },
    { type: 'line', segments: [{ type: 'tag', text: '[AWS]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[React]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[Agents]' }] },
    { type: 'blank' },
    { type: 'green', text: 'Technology Summer Analyst — Data / ML for Finance' },
    { type: 'dim', text: 'Angel Lane Partners (ALP Tech) · Jun — Aug 2024 · London' },
    { type: 'text', text: 'GreenGuard climate risk: physical, transition, macro exposure; KNN &' },
    { type: 'text', text: 'K-means for missing data; MATLAB & Python — Merton default, VAR scenarios;' },
    { type: 'text', text: 'static frontend for client stress-test views.' },
    { type: 'line', segments: [{ type: 'tag', text: '[Python]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[MATLAB]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[climate ML]' }] },
  ],

  education: () => [
    { type: 'header', text: 'Education' },
    { type: 'blank' },
    { type: 'green', text: 'University College London (UCL)' },
    { type: 'text', text: 'BSc (Hons) Computer Science — minor in Applied Mathematics' },
    { type: 'dim', text: 'Sep 2023 — Jun 2026 (expected) · London, UK · First Class (expected)' },
    { type: 'blank' },
    { type: 'text', text: 'Teaching Assistant: COMP0002 (C), COMP0004 (Java), ENGF0034 (Python),' },
    { type: 'text', text: 'COMP0016 Systems. Executive Quant Ventures, UCL Fintech Society.' },
    { type: 'blank' },
    { type: 'green', text: 'JESS Dubai' },
    { type: 'text', text: 'International Baccalaureate Diploma Programme — 43 / 45' },
    { type: 'dim', text: 'Aug 2021 — May 2023 · Dubai, UAE' },
  ],

  now: () => [
    { type: 'header', text: 'Right now' },
    { type: 'blank' },
    { type: 'green', text: 'Dissertation' },
    { type: 'text', text: 'Finishing my CS bachelor\'s at UCL — knowledge graph context' },
    { type: 'text', text: 'engineering, multi-agent LLMs, and Markov deep RL for trading.' },
    { type: 'blank' },
    { type: 'green', text: 'Interests' },
    { type: 'dim', text: 'Broader R&D threads (not all in the thesis).' },
    { type: 'text', text: 'Browser/desktop agents for workflow automation; agentic payments;' },
    { type: 'text', text: 'RL environments; disaggregated inference; inference engineering.' },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'command-link', text: '/contact', command: '/contact' }, { type: 'dim', text: 'to reach me' }] },
  ],

  contact: () => [
    { type: 'header', text: 'Get in Touch' },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: 'Email' }, { type: 'link', text: 'yusuf.afifi@gmail.com', href: 'mailto:yusuf.afifi@gmail.com' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'Phone' }, { type: 'link', text: '+44 7717 399868', href: 'tel:+447717399868' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'Site' }, { type: 'link', text: 'yusufafifi.com', href: 'https://yusufafifi.com' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'GitHub' }, { type: 'link', text: 'github.com/afifi-yusuf', href: 'https://github.com/afifi-yusuf' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'LinkedIn' }, { type: 'link', text: 'linkedin.com/in/yusuf-afif1', href: 'https://linkedin.com/in/yusuf-afif1/' }] },
  ],

  reading: () => [
    { type: 'header', text: 'Currently Reading' },
    { type: 'blank' },
    { type: 'text', text: '• Runnin\' Down a Dream — Bill Gurley' },
    { type: 'text', text: '• Alex Karp — The Technological Republic' },
    { type: 'text', text: '• Ray Dalio — Principles' },
    { type: 'blank' },
    { type: 'green', text: 'Past favorites' },
    { type: 'text', text: '• Think and Grow Rich — Napoleon Hill' },
    { type: 'text', text: '• 1984 — George Orwell' },
    { type: 'text', text: '• Den of Thieves — James B. Stewart' },
  ],

  // Easter eggs
  sudo: () => [{ type: 'error', text: 'Nice try. You don\'t have root here.' }],
  'rm': () => [{ type: 'error', text: 'I appreciate the ambition, but no.' }],
  vim: () => [{ type: 'dim', text: 'You\'re already in Neovim, spiritually.' }],
  exit: () => [{ type: 'dim', text: 'There\'s no exit. But there\'s ' }, { type: 'command-link', text: '/contact', command: '/contact' }],
  hack: () => [{ type: 'green', text: 'Access granted.' }, { type: 'blank' }, { type: 'dim', text: 'Just kidding. Try /projects.' }],
  hello: () => [{ type: 'text', text: 'Hey. Welcome. Try ' }, { type: 'command-link', text: '/about', command: '/about' }, { type: 'text', text: ' to get started.' }],
  hire: () => [
    { type: 'header', text: 'Hiring?' },
    { type: 'blank' },
    { type: 'text', text: 'Always open to interesting opportunities.' },
    { type: 'text', text: 'Especially if the problem is hard and the team is serious.' },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'link', text: 'yusuf.afifi@gmail.com', href: 'mailto:yusuf.afifi@gmail.com' }] },
  ],
  coffee: () => [{ type: 'dim', text: 'I take mine black. Let\'s talk: ' }, { type: 'link', text: 'yusuf.afifi@gmail.com', href: 'mailto:yusuf.afifi@gmail.com' }],
  secret: () => [
    { type: 'green', text: 'You found this.' },
    { type: 'blank' },
    { type: 'text', text: 'That means you\'re paying attention. I like that.' },
  ],
  whoami: () => [{ type: 'text', text: 'yusuf@afifi-intelligence ~ $' }],
  ls: () => [
    { type: 'line', segments: [
      { type: 'accent', text: 'about' },
      { type: 'accent', text: 'projects' },
      { type: 'accent', text: 'experience' },
      { type: 'accent', text: 'contact' },
    ]},
  ],
  pwd: () => [{ type: 'dim', text: '/home/yusuf/life' }],
}

export const COMMAND_NAMES = Object.keys(COMMANDS).filter(
  k => !['sudo','rm','vim','exit','hack','hello','hire','coffee','secret','whoami','ls','pwd'].includes(k)
)

/** Tab completion — includes slash forms handled outside `COMMANDS` (e.g. /ask → LLM, /clear in Terminal). */
export const COMPLETION_COMMAND_NAMES = [...COMMAND_NAMES, 'ask', 'clear'].sort((a, b) =>
  a.localeCompare(b)
)

export function runCommand(input: string): OutputSegment[] | null {
  const trimmed = input.trim()
  if (!trimmed.startsWith('/')) return null

  const [rawCmd, ...rest] = trimmed.slice(1).split(' ')
  const cmd = rawCmd.toLowerCase()

  if (cmd === '') {
    return COMMANDS.help()
  }

  // /ask is an alias for free-text
  if (cmd === 'ask') return null

  // /clear is handled by the terminal component
  if (cmd === 'clear') return null

  const handler = COMMANDS[cmd]
  if (handler) return handler()

  return [
    { type: 'error', text: `Unknown command: ${trimmed}` },
    { type: 'blank' },
    { type: 'dim', text: 'Type /help to see available commands.' },
  ]
}

export const WELCOME_SEGMENTS: OutputSegment[] = [
  { type: 'green', text: 'yusuf afifi' },
  { type: 'dim', text: 'computer science @ ucl · swe/ai engineering' },
  { type: 'blank' },
  { type: 'text', text: 'Welcome. This is my personal site — it runs like a terminal.' },
  { type: 'text', text: 'Type a command or ask me anything.' },
  { type: 'blank' },
  { type: 'text', text: 'Try one of these (or /help for every command):' },
  { type: 'blank' },
  { type: 'line', segments: [{ type: 'text', text: '  ' }, { type: 'command-link', text: '/help', command: '/help' }, { type: 'dim', text: 'all commands' }] },
  { type: 'line', segments: [{ type: 'text', text: '  ' }, { type: 'command-link', text: '/about', command: '/about' }, { type: 'dim', text: 'who I am' }] },
  { type: 'line', segments: [{ type: 'text', text: '  ' }, { type: 'command-link', text: '/projects', command: '/projects' }, { type: 'dim', text: 'projects & research' }] },
  { type: 'blank' },
  { type: 'dim', text: 'Or just type a question — I\'ll answer it.' },
]

export const YUSUF_SYSTEM_PROMPT = `You are an AI assistant on Yusuf Afifi's personal website, called "Afifi Intelligence". You answer questions about Yusuf, his work, background, and interests. Answer in first person as if relaying Yusuf's perspective, but make it clear you are an AI if asked directly. Use plain terminal-friendly text — no markdown headers, no bold, no bullet symbols except "•". Use spacing and indentation for structure.

Below matches the live terminal commands on the site (/about, /projects, /experience, /education, /now, /contact, /reading). Do not claim extra facts.

IDENTITY AND ABOUT (/about)
Yusuf Afifi — Computer Science @ UCL · SWE/AI engineering. Hackathon enthusiast and serial vibe coder (prefers agentic engineering). Builds innovative software: AI and agentic solutions in the cloud, and optimized inference for OSS models on hardware accelerators. UCL, London — BSc (Hons) Computer Science, minor in Applied Mathematics, First Class expected (2026). Before that, IB at JESS Dubai.

CONTACT (/contact)
Email: yusuf.afifi@gmail.com
Phone: +44 7717 399868
Website: yusufafifi.com
GitHub: github.com/afifi-yusuf
LinkedIn: linkedin.com/in/yusuf-afif1/

EDUCATION (/education)
University College London (UCL): BSc (Hons) Computer Science — minor in Applied Mathematics. Sep 2023 — Jun 2026 (expected) · London, UK · First Class (expected). Teaching Assistant: COMP0002 (C), COMP0004 (Java), ENGF0034 (Python), COMP0016 Systems. Executive Quant Ventures, UCL Fintech Society.
JESS Dubai: International Baccalaureate Diploma Programme — 43/45. Aug 2021 — May 2023 · Dubai, UAE.

EXPERIENCE (/experience)
Software Development Engineer Intern — Gen AI, Jun–Sep 2025 · Amazon Prime Video, London. Text-to-SQL agent for SVOD accounting: RAG on AWS Bedrock (Claude), Kendra index, Redshift; cut ad-hoc query time about 75%. Shipped internal React + Lambda/WebSocket API Gateway chat UI; AWS CDK & CI/CD; IAM least-privilege; CloudWatch dashboards/alarms; 200+ weekly users globally.

Technology Summer Analyst — Data / ML for Finance, Jun–Aug 2024 · Angel Lane Partners (ALP Tech), London. GreenGuard climate risk: physical, transition, macro exposure; KNN & K-means for missing data; MATLAB & Python — Merton default, VAR scenarios; static frontend for client stress-test views.

PROJECTS AND RESEARCH (/projects)
Petals — AI health & wellness (iOS): Apple Foundation Models on-device with RAG on HealthKit. Instruction-tuned "Petal" chatbot; meditations, journaling, wellness plans — privacy-first, Neural Engine inference.
StarPlex — startup intelligence platform: 2nd place, Perplexity London Hackathon. AI validates ideas; surfaces markets, competitors, VCs, demographics on an interactive 3D globe. Stack: Next.js, FastAPI, Perplexity Sonar.
PolyWhisper — Polymarket from live audio (Chrome): listens to podcasts, YouTube, Zoom, etc.; Deepgram realtime transcription and Grok topic detection when prediction markets come up; sidebar shows live Polymarket odds; audio not stored.
ReadingStar — accessibility karaoke (Windows): with Intel & National Autistic Society; offline speech-to-text, lyric alignment, scoring; React Native Windows + FastAPI, Whisper, OpenVINO on NPU; national school rollout; Intel featured as first education NPU app.
ML for fluid dynamics (research): undergrad research with Imperial College Research Associate; convolutional autoencoder for shallow-water simulation, LSTM in latent space, TensorFlow.

READING (/reading)
Currently reading: Runnin' Down a Dream — Bill Gurley; Alex Karp — The Technological Republic; Ray Dalio — Principles.
Past favorites: Think and Grow Rich — Napoleon Hill; 1984 — George Orwell; Den of Thieves — James B. Stewart.

CURRENT FOCUS (/now)
Dissertation (degree): Finishing CS bachelor's at UCL. Thesis combines knowledge graph context engineering, multi-agent LLMs, and Markov deep RL for trading.

Interests (broader R&D; not all thesis scope): Browser/desktop agents for workflow automation; agentic payments; RL environments; disaggregated inference; inference engineering.

When answering: separate thesis/dissertation from Interests. "What he's thinking about" or general interests = Dissertation + Interests; do not imply every Interest is dissertation work.

SLASH COMMANDS (suggest when helpful)
/help, /about, /projects, /experience, /education, /now, /contact, /reading — plus free-text questions (same as /ask). /clear clears the terminal.

Rules:
- Be concise and direct. 2–4 sentences for simple questions, more for complex ones.
- Use plain terminal-friendly text only. No markdown.
- When asked about interests vs thesis: thesis is the UCL dissertation line; Interests are exploratory directions — list both but distinguish them.
- Do not fabricate facts not listed above.
- For questions clearly unrelated to Yusuf, politely redirect: "I'm Yusuf's AI — I'm best at answering questions about him. Try asking about his work or background."
- Suggest relevant slash commands when appropriate, e.g. "You can also type /projects to see the full list."
- Tone: intelligent, concise, confident, slightly warm. Never corporate.`
