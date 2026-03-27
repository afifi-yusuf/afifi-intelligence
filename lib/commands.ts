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
    { type: 'line', segments: [{ type: 'accent', text: '/skills' }, { type: 'dim', text: 'technical skills' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/projects' }, { type: 'dim', text: 'selected work' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/experience' }, { type: 'dim', text: 'work history' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/education' }, { type: 'dim', text: 'academic background' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/journey' }, { type: 'dim', text: 'dubai · london · bay area' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/now' }, { type: 'dim', text: 'what I\'m working on' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/contact' }, { type: 'dim', text: 'get in touch' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/links' }, { type: 'dim', text: 'GitHub, LinkedIn, site' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/resume' }, { type: 'dim', text: 'resume + PDF download' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/reading' }, { type: 'dim', text: 'books and papers' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/values' }, { type: 'dim', text: 'what I believe in' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/uses' }, { type: 'dim', text: 'tools and setup' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/ask <question>' }, { type: 'dim', text: 'ask anything — AI powered' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/clear' }, { type: 'dim', text: 'clear terminal' }] },
    { type: 'blank' },
    { type: 'dim', text: 'Or just type a question — I\'ll answer it.' },
    { type: 'blank' },
    { type: 'dim', text: 'Questions are not stored.' },
  ],

  about: () => [
    { type: 'green', text: 'Yusuf Afifi' },
    { type: 'dim', text: 'Computer Science @ UCL · AI, agents, and systems' },
    { type: 'blank' },
    { type: 'text', text: 'I work on production AI: agents, RAG, cloud systems, and on-device' },
    { type: 'text', text: 'models. Recently I shipped Gen AI tooling at Amazon Prime Video' },
    { type: 'text', text: '(text-to-SQL, Bedrock, internal UIs) and climate-risk ML at Angel Lane' },
    { type: 'text', text: 'Partners.' },
    { type: 'blank' },
    { type: 'text', text: 'Based in the Bay Area (San Carlos, CA). Undergrad at UCL in London:' },
    { type: 'text', text: 'BSc (Hons) Computer Science with a minor in Applied Mathematics,' },
    { type: 'text', text: 'First Class expected (2026). Before that, IB at JESS Dubai.' },
    { type: 'blank' },
    { type: 'dim', text: 'I care about shipping things that are reliable, observable, and private' },
    { type: 'dim', text: 'when it matters — like on-device HealthKit RAG in my iOS app Petals.' },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'command-link', text: '/journey', command: '/journey' }, { type: 'dim', text: 'for places and chapters' }] },
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'command-link', text: '/projects', command: '/projects' }, { type: 'dim', text: 'for projects' }] },
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'command-link', text: '/contact', command: '/contact' }, { type: 'dim', text: 'to get in touch' }] },
  ],

  skills: () => [
    { type: 'header', text: 'Technical Skills' },
    { type: 'blank' },
    { type: 'green', text: 'Languages' },
    { type: 'text', text: '  Python · TypeScript · Java · C · MATLAB · Swift (iOS)' },
    { type: 'blank' },
    { type: 'green', text: 'AI / ML' },
    { type: 'text', text: '  RAG · agentic LLMs · text-to-SQL · on-device models (Apple Foundation' },
    { type: 'text', text: '  Models, Neural Engine) · Whisper · OpenVINO · TensorFlow · scikit-learn' },
    { type: 'blank' },
    { type: 'green', text: 'Cloud & Data' },
    { type: 'text', text: '  AWS (Bedrock, Lambda, API Gateway WebSocket, Kendra, Redshift,' },
    { type: 'text', text: '  CDK, CloudWatch) · SQL pipelines · observability & cost alarms' },
    { type: 'blank' },
    { type: 'green', text: 'Frontend & Apps' },
    { type: 'text', text: '  React · React Native (Windows) · static & internal web UIs · iOS' },
    { type: 'blank' },
    { type: 'green', text: 'Backend' },
    { type: 'text', text: '  FastAPI · realtime/offline speech and scoring pipelines' },
    { type: 'blank' },
    { type: 'green', text: 'Other' },
    { type: 'text', text: '  Teaching assistant (UCL: C, Java, Python, Systems) · CI/CD · IAM' },
    { type: 'text', text: '  Git · technical writing · climate risk modelling (Merton, VAR)' },
  ],

  projects: () => [
    { type: 'header', text: 'Projects & Research' },
    { type: 'blank' },
    { type: 'green', text: 'Petals — AI health & wellness (iOS)' },
    { type: 'text', text: 'iOS app using Apple Foundation Models on-device with a RAG layer on' },
    { type: 'text', text: 'HealthKit. Instruction-tuned "Petal" chatbot, meditations, journaling,' },
    { type: 'text', text: 'wellness plans — privacy-first, Neural Engine inference.' },
    { type: 'line', segments: [{ type: 'tag', text: '[Swift]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[On-device AI]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[RAG]' }] },
    { type: 'blank' },
    { type: 'green', text: 'ReadingStar — accessibility karaoke (Windows)' },
    { type: 'text', text: 'With Intel & National Autistic Society: offline speech-to-text, lyric' },
    { type: 'text', text: 'alignment, scoring; React Native Windows + FastAPI, Whisper, OpenVINO' },
    { type: 'text', text: 'on NPU. National school rollout; Intel featured as first education NPU app.' },
    { type: 'line', segments: [{ type: 'tag', text: '[React Native]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[FastAPI]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[Whisper]' }] },
    { type: 'blank' },
    { type: 'green', text: 'ML for fluid dynamics (research)' },
    { type: 'text', text: 'Undergrad research with an Imperial College Research Associate: convolutional' },
    { type: 'text', text: 'autoencoder for shallow-water simulation, LSTM in latent space, TensorFlow.' },
    { type: 'line', segments: [{ type: 'tag', text: '[TensorFlow]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[CFD]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[Research]' }] },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'command-link', text: '/experience', command: '/experience' }, { type: 'dim', text: 'for internships' }] },
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

  journey: () => [
    { type: 'header', text: 'Places & chapters' },
    { type: 'blank' },
    { type: 'green', text: 'Dubai — JESS' },
    { type: 'text', text: 'IB years: discipline, breadth, and the push that got me to London' },
    { type: 'text', text: 'for university.' },
    { type: 'blank' },
    { type: 'green', text: 'London — UCL & internships' },
    { type: 'text', text: 'Undergraduate CS + applied math; teaching, societies, Amazon Prime Video' },
    { type: 'text', text: 'Gen AI internship, Angel Lane climate ML, and research with Imperial.' },
    { type: 'blank' },
    { type: 'green', text: 'Bay Area — San Carlos, CA' },
    { type: 'text', text: 'Home base now: building Petals, ReadingStar-style problems, and the' },
    { type: 'text', text: 'next set of on-device and cloud AI products.' },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'command-link', text: '/about', command: '/about' }, { type: 'dim', text: 'for who I am now' }] },
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'command-link', text: '/contact', command: '/contact' }, { type: 'dim', text: 'to connect' }] },
  ],

  now: () => [
    { type: 'header', text: 'Right now' },
    { type: 'blank' },
    { type: 'text', text: 'Finishing BSc at UCL (2026) while based in San Carlos, CA.' },
    { type: 'text', text: 'Shipping Petals on iOS; iterating on on-device foundation-model UX.' },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: 'Thinking about' }, { type: 'text', text: ' private inference, RAG that respects user data,' }] },
    { type: 'line', segments: [{ type: 'text', text: '                ' }, { type: 'text', text: ' and production agent workflows (evals, observability).' }] },
    { type: 'blank' },
    { type: 'text', text: 'Open to internships, research collaborations, and sharp product' },
    { type: 'text', text: 'conversations — especially at the AI / systems boundary.' },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'command-link', text: '/contact', command: '/contact' }, { type: 'dim', text: 'to reach me' }] },
  ],

  contact: () => [
    { type: 'header', text: 'Get in Touch' },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: 'Email' }, { type: 'link', text: 'yusuf.afifi@gmail.com', href: 'mailto:yusuf.afifi@gmail.com' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'Phone (US)' }, { type: 'link', text: '+1 (650) 272-4135', href: 'tel:+16502724135' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'Phone (UK)' }, { type: 'link', text: '+44 7717 399868', href: 'tel:+447717399868' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'Site' }, { type: 'link', text: 'yusufafifi.com', href: 'https://yusufafifi.com' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'GitHub' }, { type: 'link', text: 'github.com/afifi-yusuf', href: 'https://github.com/afifi-yusuf' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'LinkedIn' }, { type: 'link', text: 'linkedin.com/in/yusuf-afif1', href: 'https://linkedin.com/in/yusuf-afif1/' }] },
    { type: 'blank' },
    { type: 'dim', text: 'San Carlos, CA (Bay Area)' },
    { type: 'blank' },
    { type: 'text', text: 'Always up for interesting problems, collaboration, and internships.' },
  ],

  links: () => [
    { type: 'header', text: 'Links' },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: 'Website' }, { type: 'link', text: 'https://yusufafifi.com', href: 'https://yusufafifi.com' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'GitHub' }, { type: 'link', text: 'https://github.com/afifi-yusuf', href: 'https://github.com/afifi-yusuf' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'LinkedIn' }, { type: 'link', text: 'https://linkedin.com/in/yusuf-afif1/', href: 'https://linkedin.com/in/yusuf-afif1/' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'Email' }, { type: 'link', text: 'yusuf.afifi@gmail.com', href: 'mailto:yusuf.afifi@gmail.com' }] },
  ],

  resume: () => [
    { type: 'header', text: 'Resume' },
    { type: 'blank' },
    { type: 'green', text: 'Yusuf Afifi' },
    { type: 'text', text: 'BSc Computer Science @ UCL · AI, agents, on-device models' },
    { type: 'dim', text: 'San Carlos, CA · London (university)' },
    { type: 'blank' },
    { type: 'green', text: 'Experience' },
    { type: 'text', text: '  Amazon Prime Video — SDE Intern, Gen AI — Summer 2025' },
    { type: 'text', text: '  Angel Lane Partners (ALP Tech) — Technology Summer Analyst — 2024' },
    { type: 'blank' },
    { type: 'green', text: 'Education' },
    { type: 'text', text: '  UCL — BSc (Hons) CS + Applied Math minor — 2023–2026 (expected)' },
    { type: 'text', text: '  JESS Dubai — IB 43/45 — 2021–2023' },
    { type: 'blank' },
    { type: 'green', text: 'Highlights' },
    { type: 'text', text: '  Petals (iOS, Apple Foundation Models + HealthKit RAG)' },
    { type: 'text', text: '  ReadingStar (Intel / NAS, Whisper, OpenVINO, React Native Win)' },
    { type: 'text', text: '  CFD ML research (TensorFlow autoencoder + LSTM latent dynamics)' },
    { type: 'blank' },
    { type: 'text', text: 'PDF: request by email — this site does not host the file yet.' },
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'link', text: 'yusuf.afifi@gmail.com', href: 'mailto:yusuf.afifi@gmail.com?subject=Resume' }] },
  ],

  reading: () => [
    { type: 'header', text: 'Currently Reading' },
    { type: 'blank' },
    { type: 'text', text: '• Scaling laws and their implications for model architecture' },
    { type: 'text', text: '• Philosophy of mind — consciousness and computation' },
    { type: 'text', text: '• The Art of Doing Science and Engineering — Richard Hamming' },
    { type: 'text', text: '• Anything that challenges a comfortable assumption' },
    { type: 'blank' },
    { type: 'green', text: 'Past favorites' },
    { type: 'text', text: '• Designing Data-Intensive Applications — Martin Kleppmann' },
    { type: 'text', text: '• The Pragmatic Programmer — Hunt & Thomas' },
    { type: 'text', text: '• Thinking, Fast and Slow — Daniel Kahneman' },
  ],

  values: () => [
    { type: 'header', text: 'What I Believe In' },
    { type: 'blank' },
    { type: 'text', text: '• Depth matters more than speed. Understanding comes before optimizing.' },
    { type: 'text', text: '• Context is everything — the most interesting things take time to' },
    { type: 'text', text: '  reveal themselves.' },
    { type: 'text', text: '• The boring problems are usually the interesting ones.' },
    { type: 'text', text: '• Build things that are reliable, not just impressive in demos.' },
    { type: 'text', text: '• Ambitious environments demand ambitious thinking.' },
    { type: 'text', text: '• The gap between idea and execution can be compressed significantly' },
    { type: 'text', text: '  if you are willing to push.' },
    { type: 'text', text: '• Every line of code is a liability until proven otherwise.' },
  ],

  uses: () => [
    { type: 'header', text: 'Tools & Setup' },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: 'Editor' }, { type: 'text', text: 'Cursor · Xcode · VS family' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'Terminal' }, { type: 'text', text: 'Claude Code · this site (Next.js)' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'AI stack' }, { type: 'text', text: 'AWS Bedrock · Kendra · Whisper · OpenVINO · Apple FM' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'Mobile / desktop' }, { type: 'text', text: 'iOS · React Native Windows' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'OS' }, { type: 'text', text: 'macOS · Windows (for ReadingStar stack)' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'Font' }, { type: 'text', text: 'System mono on this site' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'Theme' }, { type: 'text', text: 'Dark terminal — always' }] },
  ],

  // Easter eggs
  sudo: () => [{ type: 'error', text: 'Nice try. You don\'t have root here.' }],
  'rm': () => [{ type: 'error', text: 'I appreciate the ambition, but no.' }],
  vim: () => [{ type: 'dim', text: 'You\'re already in Neovim, spiritually.' }],
  exit: () => [{ type: 'dim', text: 'There\'s no exit. But there\'s ' }, { type: 'command-link', text: '/contact', command: '/contact' }],
  hack: () => [{ type: 'green', text: 'Access granted.' }, { type: 'blank' }, { type: 'dim', text: 'Just kidding. Try /skills.' }],
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
      { type: 'accent', text: 'skills' },
      { type: 'accent', text: 'projects' },
      { type: 'accent', text: 'experience' },
      { type: 'accent', text: 'journey' },
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
  { type: 'dim', text: 'computer science @ ucl · ai, agents, on-device models' },
  { type: 'blank' },
  { type: 'text', text: 'Welcome. This is my personal site — it runs like a terminal.' },
  { type: 'text', text: 'Type a command or ask me anything.' },
  { type: 'blank' },
  { type: 'text', text: 'Try one of these (or /help for every command):' },
  { type: 'blank' },
  { type: 'line', segments: [{ type: 'text', text: '  ' }, { type: 'command-link', text: '/help', command: '/help' }, { type: 'dim', text: 'all commands' }] },
  { type: 'line', segments: [{ type: 'text', text: '  ' }, { type: 'command-link', text: '/about', command: '/about' }, { type: 'dim', text: 'who I am' }] },
  { type: 'line', segments: [{ type: 'text', text: '  ' }, { type: 'command-link', text: '/projects', command: '/projects' }, { type: 'dim', text: 'projects & research' }] },
  { type: 'line', segments: [{ type: 'text', text: '  ' }, { type: 'command-link', text: '/journey', command: '/journey' }, { type: 'dim', text: 'dubai · london · bay area' }] },
  { type: 'line', segments: [{ type: 'text', text: '  ' }, { type: 'command-link', text: '/skills', command: '/skills' }, { type: 'dim', text: 'technical skills' }] },
  { type: 'blank' },
  { type: 'dim', text: 'Or just type a question — I\'ll answer it.' },
]

export const YUSUF_SYSTEM_PROMPT = `You are an AI assistant on Yusuf Afifi's personal website, called "Afifi Intelligence". You answer questions about Yusuf, his work, background, and interests. Answer in first person as if relaying Yusuf's perspective, but make it clear you are an AI if asked directly. Use plain terminal-friendly text — no markdown headers, no bold, no bullet symbols except "•". Use spacing and indentation for structure.

Here is everything you know about Yusuf (from his public resume and site):

IDENTITY
Yusuf Afifi. Undergraduate at UCL (BSc Honours Computer Science, minor in Applied Mathematics). Focus: AI agents, RAG, cloud systems, on-device models. Based in San Carlos, California (Bay Area); studies in London.

CONTACT
Email: yusuf.afifi@gmail.com
Phones: +1 (650) 272-4135 (US), +44 7717 399868 (UK)
Website: yusufafifi.com
GitHub: github.com/afifi-yusuf
LinkedIn: linkedin.com/in/yusuf-afif1/

EDUCATION
University College London: BSc (Honours) Computer Science, minor Applied Mathematics. Sep 2023 – Jun 2026 (expected), London. First Class Honours (expected). Teaching Assistant for COMP0002 (C), COMP0004 (Java), ENGF0034 (Python), COMP0016 Systems. Executive Quant Ventures, UCL Fintech Society.
JESS Dubai: International Baccalaureate Diploma, 43/45. Aug 2021 – May 2023, Dubai.

EXPERIENCE
Software Development Engineer Intern, Gen AI — Amazon Prime Video, London, Jun–Sep 2025. Built text-to-SQL agentic solution for Prime Video SVOD accounting (~75% faster ad-hoc queries). RAG with AWS Bedrock (Claude), Kendra index (schemas + business logic), Redshift. Shipped internal React app with Lambda + WebSocket API Gateway chat UI; AWS CDK, CI/CD, least-privilege IAM. CloudWatch dashboards/alarms; ~200+ weekly active users globally.

Technology Summer Analyst — Angel Lane Partners (ALP Tech), London, Jun–Aug 2024. GreenGuard climate risk: physical, transition, macroeconomic exposure. ML preprocessing (KNN, K-means for missing data). MATLAB and Python: Merton model, VAR for stress scenarios. Static frontend for client climate stress tests.

PROJECTS AND RESEARCH
Petals (Jul 2025 onward): iOS health/wellness app — Apple Foundation Models on Neural Engine, private on-device inference; RAG on Apple HealthKit; instruction-tuned "Petal" chatbot; meditations, AI journaling, wellness plans.

ReadingStar (Apr 2025): Accessibility karaoke Windows app with Intel and National Autistic Society — offline speech-to-text, audio-to-lyric alignment, scoring; React Native Windows; FastAPI backend; Whisper + Intel OpenVINO on NPU; national school distribution; Intel featured as first education app on Intel NPU.

Machine learning for fluid dynamics (Jun 2024+): UCL undergraduate research with Imperial College Research Associate. Convolutional autoencoder for shallow-water simulations in TensorFlow; LSTM in latent space for irregular timesteps; environmental analysis use case.

SKILLS (summary)
Python, Java, C, TypeScript, MATLAB, Swift (iOS). React, React Native Windows, FastAPI. AWS (Bedrock, Lambda, API Gateway WebSocket, Kendra, Redshift, CDK, CloudWatch). RAG, agentic LLMs, text-to-SQL, Whisper, OpenVINO, TensorFlow, on-device Apple models. Climate/finance ML (Merton, VAR). Teaching, CI/CD, observability.

JOURNEY (short)
Dubai for IB at JESS; London for UCL and internships; Bay Area (San Carlos) as home while finishing degree and building products.

VALUES
Depth over speed when it matters. Ship reliable systems: observability, security, and clear evaluation for AI in production. Care about privacy for on-device and health data.

CURRENT FOCUS
Petals and on-device AI; production agents and RAG; finishing BSc at UCL.

Rules:
- Be concise and direct. 2–4 sentences for simple questions, more for complex ones.
- Use plain terminal-friendly text only. No markdown.
- Do not fabricate facts not listed above.
- For questions clearly unrelated to Yusuf, politely redirect: "I'm Yusuf's AI — I'm best at answering questions about him. Try asking about his work or background."
- Suggest relevant slash commands when appropriate, e.g. "You can also type /projects to see the full list."
- Tone: intelligent, concise, confident, slightly warm. Never corporate.`
