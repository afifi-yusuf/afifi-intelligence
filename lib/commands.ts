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
    { type: 'line', segments: [{ type: 'accent', text: '/journey' }, { type: 'dim', text: 'four cities, one story' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/now' }, { type: 'dim', text: 'what I\'m working on' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/contact' }, { type: 'dim', text: 'get in touch' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/links' }, { type: 'dim', text: 'GitHub, LinkedIn, X, etc.' }] },
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
    { type: 'dim', text: 'Software Engineer & AI Builder' },
    { type: 'blank' },
    { type: 'text', text: 'I build things at the intersection of software and intelligence.' },
    { type: 'text', text: 'Shaped by four cities across three continents — Alexandria, Dubai,' },
    { type: 'text', text: 'London, and San Francisco — each one left something permanent in' },
    { type: 'text', text: 'how I think and what I care about.' },
    { type: 'blank' },
    { type: 'text', text: 'Currently based in San Francisco, working on AI-native products' },
    { type: 'text', text: 'and the infrastructure that makes intelligent systems production-ready.' },
    { type: 'blank' },
    { type: 'dim', text: 'The boring problems turned out to be the interesting ones.' },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'command-link', text: '/journey', command: '/journey' }, { type: 'dim', text: 'for the full story' }] },
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'command-link', text: '/projects', command: '/projects' }, { type: 'dim', text: 'for selected work' }] },
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'command-link', text: '/contact', command: '/contact' }, { type: 'dim', text: 'to get in touch' }] },
  ],

  skills: () => [
    { type: 'header', text: 'Technical Skills' },
    { type: 'blank' },
    { type: 'green', text: 'Languages' },
    { type: 'text', text: '  Python · TypeScript · Go · Rust · SQL · C++' },
    { type: 'blank' },
    { type: 'green', text: 'AI / ML' },
    { type: 'text', text: '  PyTorch · JAX · LLM fine-tuning · inference optimization' },
    { type: 'text', text: '  transformer architecture · RAG · agent systems · RLHF' },
    { type: 'blank' },
    { type: 'green', text: 'Backend & Systems' },
    { type: 'text', text: '  Node.js · FastAPI · gRPC · PostgreSQL · Redis' },
    { type: 'text', text: '  Kafka · distributed systems · real-time pipelines' },
    { type: 'blank' },
    { type: 'green', text: 'Infrastructure' },
    { type: 'text', text: '  AWS · GCP · Docker · Kubernetes · Terraform' },
    { type: 'text', text: '  CI/CD · observability · edge deployment' },
    { type: 'blank' },
    { type: 'green', text: 'Frontend' },
    { type: 'text', text: '  React · Next.js · Tailwind CSS · Framer Motion' },
    { type: 'blank' },
    { type: 'green', text: 'Tools & Practices' },
    { type: 'text', text: '  Git · Linux · Neovim · Claude Code · Cursor' },
    { type: 'text', text: '  system design · code review · technical writing' },
  ],

  projects: () => [
    { type: 'header', text: 'Selected Projects' },
    { type: 'blank' },
    { type: 'green', text: 'LLM Inference Optimization' },
    { type: 'text', text: 'Systems-level tooling for transformer inference. 40% latency' },
    { type: 'text', text: 'reduction on standard benchmarks through kernel-level attention' },
    { type: 'text', text: 'approximation.' },
    { type: 'line', segments: [{ type: 'tag', text: '[Python]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[CUDA]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[PyTorch]' }] },
    { type: 'blank' },
    { type: 'green', text: 'Real-time Feature Pipeline' },
    { type: 'text', text: 'Distributed ML feature engineering system processing 50k events/sec.' },
    { type: 'text', text: 'Built for a fintech production environment.' },
    { type: 'line', segments: [{ type: 'tag', text: '[Go]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[Kafka]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[PostgreSQL]' }] },
    { type: 'blank' },
    { type: 'green', text: 'Sparse Attention Contribution' },
    { type: 'text', text: 'Open-source extension to a widely used NLP library.' },
    { type: 'text', text: 'Merged into main — used by hundreds of researchers.' },
    { type: 'line', segments: [{ type: 'tag', text: '[Python]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[PyTorch]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[Open Source]' }] },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'command-link', text: '/experience', command: '/experience' }, { type: 'dim', text: 'for work history' }] },
  ],

  experience: () => [
    { type: 'header', text: 'Work Experience' },
    { type: 'blank' },
    { type: 'green', text: 'Software Engineer — AI Startup' },
    { type: 'dim', text: '2024 — Present · San Francisco' },
    { type: 'text', text: 'Building AI-native products. Focused on the application layer —' },
    { type: 'text', text: 'where models meet real products and real people.' },
    { type: 'blank' },
    { type: 'green', text: 'Software Engineer Intern — DeepMind' },
    { type: 'dim', text: '2022 · London' },
    { type: 'text', text: 'Applied research engineering on language model evaluation' },
    { type: 'text', text: 'infrastructure. Worked with the Gemini pre-training team.' },
    { type: 'line', segments: [{ type: 'tag', text: '[Python]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[JAX]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[GCP]' }] },
    { type: 'blank' },
    { type: 'green', text: 'Software Engineer — Fintech Startup' },
    { type: 'dim', text: '2021 — 2023 · London' },
    { type: 'text', text: 'Full-stack engineering on a real-time algorithmic trading platform.' },
    { type: 'text', text: 'From zero to production.' },
    { type: 'line', segments: [{ type: 'tag', text: '[TypeScript]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[React]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[Node.js]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[PostgreSQL]' }] },
  ],

  education: () => [
    { type: 'header', text: 'Education' },
    { type: 'blank' },
    { type: 'green', text: 'University College London (UCL)' },
    { type: 'text', text: 'MSc Computer Science — AI Track' },
    { type: 'dim', text: '2019 — 2024 · London, UK' },
    { type: 'blank' },
    { type: 'text', text: 'Studied at the intersection of large language models and systems' },
    { type: 'text', text: 'engineering. Focused on efficiency: how to make intelligent systems' },
    { type: 'text', text: 'faster, cheaper, and more reliable in production.' },
  ],

  journey: () => [
    { type: 'header', text: 'Four Cities. One Story.' },
    { type: 'blank' },
    { type: 'green', text: 'Alexandria — 1999–2017' },
    { type: 'text', text: 'Where it all began. Born on the Mediterranean shore. The city that' },
    { type: 'text', text: 'taught me how to see — slowly, curiously, with depth before speed.' },
    { type: 'text', text: 'That constant horizon does something to you.' },
    { type: 'blank' },
    { type: 'green', text: 'Dubai — 2017–2019' },
    { type: 'text', text: 'Where ambition became real. A city built on speed and scale that' },
    { type: 'text', text: 'recalibrates your sense of what is possible. Developed discipline,' },
    { type: 'text', text: 'tolerance for discomfort, and professional momentum.' },
    { type: 'blank' },
    { type: 'green', text: 'London — 2019–2024' },
    { type: 'text', text: 'Where work became serious. UCL, research, engineering, and the' },
    { type: 'text', text: 'projects that taught me how to build under pressure. The densest' },
    { type: 'text', text: 'chapter — portfolio, internships, and serious technical depth.' },
    { type: 'blank' },
    { type: 'green', text: 'San Francisco — 2024–Present' },
    { type: 'text', text: 'The frontier. Where the most interesting problems in AI are being' },
    { type: 'text', text: 'worked on right now. Focused on the application layer and building' },
    { type: 'text', text: 'what comes next.' },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'command-link', text: '/about', command: '/about' }, { type: 'dim', text: 'for who I am now' }] },
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'command-link', text: '/contact', command: '/contact' }, { type: 'dim', text: 'to connect' }] },
  ],

  now: () => [
    { type: 'header', text: 'Right Now' },
    { type: 'blank' },
    { type: 'text', text: 'Based in San Francisco.' },
    { type: 'text', text: 'Building AI products and working on hard problems.' },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: 'Reading' }, { type: 'text', text: 'Scaling laws research. Philosophy of mind.' }] },
    { type: 'line', segments: [{ type: 'text', text: '           ' }, { type: 'text', text: 'Anything that challenges a comfortable assumption.' }] },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: 'Building' }, { type: 'text', text: 'Tools that make AI more useful, more reliable,' }] },
    { type: 'line', segments: [{ type: 'text', text: '           ' }, { type: 'text', text: 'and more honest.' }] },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: 'Exploring' }, { type: 'text', text: 'The edges of what reasoning systems can currently' }] },
    { type: 'line', segments: [{ type: 'text', text: '           ' }, { type: 'text', text: 'do — and why they fail when they do.' }] },
    { type: 'blank' },
    { type: 'text', text: 'Open to interesting conversations, collaborations,' },
    { type: 'text', text: 'and things worth caring about.' },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'command-link', text: '/contact', command: '/contact' }, { type: 'dim', text: 'to reach me' }] },
  ],

  contact: () => [
    { type: 'header', text: 'Get in Touch' },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: 'Email' }, { type: 'link', text: 'yusuf@yusufafifi.com', href: 'mailto:yusuf@yusufafifi.com' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'GitHub' }, { type: 'link', text: 'github.com/yusufafifi', href: 'https://github.com/yusufafifi' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'LinkedIn' }, { type: 'link', text: 'linkedin.com/in/yusufafifi', href: 'https://linkedin.com/in/yusufafifi' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'X' }, { type: 'link', text: 'x.com/yusufafifi', href: 'https://x.com/yusufafifi' }] },
    { type: 'blank' },
    { type: 'text', text: 'Always open to conversations about interesting problems,' },
    { type: 'text', text: 'potential collaboration, and ideas worth exploring.' },
    { type: 'dim', text: 'No deck required.' },
  ],

  links: () => [
    { type: 'header', text: 'Links' },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: 'GitHub' }, { type: 'link', text: 'https://github.com/yusufafifi', href: 'https://github.com/yusufafifi' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'LinkedIn' }, { type: 'link', text: 'https://linkedin.com/in/yusufafifi', href: 'https://linkedin.com/in/yusufafifi' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'X / Twitter' }, { type: 'link', text: 'https://x.com/yusufafifi', href: 'https://x.com/yusufafifi' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'Email' }, { type: 'link', text: 'yusuf@yusufafifi.com', href: 'mailto:yusuf@yusufafifi.com' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'Website' }, { type: 'link', text: 'https://yusufafifi.com', href: 'https://yusufafifi.com' }] },
  ],

  resume: () => [
    { type: 'header', text: 'Resume' },
    { type: 'blank' },
    { type: 'green', text: 'Yusuf Afifi' },
    { type: 'text', text: 'Software Engineer & AI Builder' },
    { type: 'dim', text: 'San Francisco, CA' },
    { type: 'blank' },
    { type: 'green', text: 'Experience' },
    { type: 'text', text: '  AI Startup — Software Engineer — 2024–Present' },
    { type: 'text', text: '  DeepMind — Software Engineer Intern — 2022' },
    { type: 'text', text: '  Fintech Startup — Software Engineer — 2021–2023' },
    { type: 'blank' },
    { type: 'green', text: 'Education' },
    { type: 'text', text: '  UCL — MSc Computer Science (AI) — 2019–2024' },
    { type: 'blank' },
    { type: 'green', text: 'Skills' },
    { type: 'text', text: '  Python, TypeScript, Go, Rust, PyTorch, JAX, React, Next.js,' },
    { type: 'text', text: '  PostgreSQL, Kafka, AWS, GCP, Docker, Kubernetes' },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'dim', text: 'Download PDF:' }, { type: 'link', text: 'resume.pdf', href: '/resume.pdf' }] },
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
    { type: 'line', segments: [{ type: 'accent', text: 'Editor' }, { type: 'text', text: 'Cursor / Neovim' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'Terminal' }, { type: 'text', text: 'Claude Code · Warp · iTerm2' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'Languages' }, { type: 'text', text: 'Python · TypeScript · Go · Rust' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'AI' }, { type: 'text', text: 'Claude · GPT-4 · local models' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'Infra' }, { type: 'text', text: 'AWS · GCP · Vercel · Docker' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'DB' }, { type: 'text', text: 'PostgreSQL · Redis · DynamoDB' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'OS' }, { type: 'text', text: 'macOS · Linux (Ubuntu)' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'Font' }, { type: 'text', text: 'JetBrains Mono' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'Theme' }, { type: 'text', text: 'Dark, always' }] },
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
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'link', text: 'yusuf@yusufafifi.com', href: 'mailto:yusuf@yusufafifi.com' }] },
  ],
  coffee: () => [{ type: 'dim', text: 'I take mine black. Let\'s talk: ' }, { type: 'link', text: 'yusuf@yusufafifi.com', href: 'mailto:yusuf@yusufafifi.com' }],
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

export function runCommand(input: string): OutputSegment[] | null {
  const trimmed = input.trim()
  if (!trimmed.startsWith('/')) return null

  const [rawCmd, ...rest] = trimmed.slice(1).split(' ')
  const cmd = rawCmd.toLowerCase()

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
  { type: 'dim', text: 'software engineer & AI builder' },
  { type: 'blank' },
  { type: 'text', text: 'Welcome. This is my personal site — it runs like a terminal.' },
  { type: 'text', text: 'Type a command or ask me anything.' },
  { type: 'blank' },
  { type: 'text', text: 'Try one of these:' },
  { type: 'blank' },
  { type: 'line', segments: [{ type: 'text', text: '  ' }, { type: 'command-link', text: '/about', command: '/about' }, { type: 'dim', text: 'who I am' }] },
  { type: 'line', segments: [{ type: 'text', text: '  ' }, { type: 'command-link', text: '/projects', command: '/projects' }, { type: 'dim', text: 'selected work' }] },
  { type: 'line', segments: [{ type: 'text', text: '  ' }, { type: 'command-link', text: '/journey', command: '/journey' }, { type: 'dim', text: 'four cities, one story' }] },
  { type: 'line', segments: [{ type: 'text', text: '  ' }, { type: 'command-link', text: '/skills', command: '/skills' }, { type: 'dim', text: 'technical skills' }] },
  { type: 'blank' },
  { type: 'dim', text: 'Or just type a question — I\'ll answer it.' },
]

export const YUSUF_SYSTEM_PROMPT = `You are an AI assistant on Yusuf Afifi's personal website, called "Afifi Intelligence". You know everything about Yusuf and answer questions about him, his work, his background, and his interests. Answer in first person as if relaying Yusuf's perspective, but make it clear you are an AI if asked directly. Use plain terminal-friendly text — no markdown headers, no bold, no bullet symbols except "•". Use spacing and indentation for structure.

Here is everything you know about Yusuf:

IDENTITY
Yusuf Afifi. Software Engineer & AI Builder. Based in San Francisco. Shaped by four cities across three continents.

JOURNEY
Alexandria (1999–2017): Born on the Mediterranean shore. Taught to see slowly, curiously, with depth before speed.
Dubai (2017–2019): Where ambition became real. Built discipline and tolerance for discomfort.
London (2019–2024): UCL MSc Computer Science (AI Track). DeepMind internship. Fintech startup. Dense chapter of technical depth.
San Francisco (2024–Present): The frontier. AI-native products. Application layer and what comes next.

EXPERIENCE
Software Engineer at AI Startup (2024–Present, San Francisco): Building AI-native products, focused on where models meet real people.
Software Engineer Intern at DeepMind (2022, London): Language model evaluation infrastructure, Gemini pre-training team. Python, JAX, GCP.
Software Engineer at Fintech Startup (2021–2023, London): Real-time algorithmic trading platform, full-stack, zero to production. TypeScript, React, Node.js, PostgreSQL.

EDUCATION
UCL — MSc Computer Science, AI Track, 2019–2024, London.

SKILLS
Languages: Python, TypeScript, Go, Rust, SQL, C++
AI/ML: PyTorch, JAX, LLM fine-tuning, inference optimization, transformer architecture, RAG, agent systems, RLHF
Backend: Node.js, FastAPI, gRPC, PostgreSQL, Redis, Kafka, distributed systems, real-time pipelines
Infra: AWS, GCP, Docker, Kubernetes, Terraform, CI/CD, observability, edge deployment
Frontend: React, Next.js, Tailwind CSS, Framer Motion
Tools: Git, Linux, Neovim, Claude Code, Cursor

PROJECTS
LLM Inference Optimization: 40% latency reduction through kernel-level attention approximation. Python, CUDA, PyTorch.
Real-time Feature Pipeline: Distributed ML feature system, 50k events/sec, fintech production. Go, Kafka, PostgreSQL.
Sparse Attention Contribution: Open-source extension merged into widely-used NLP library, used by hundreds of researchers. Python, PyTorch.

VALUES
Depth over speed. Understanding before optimizing. Context is everything. The boring problems are the interesting ones. Build reliable, not just impressive. Every line of code is a liability until proven otherwise.

CURRENT FOCUS
Scaling laws, philosophy of mind, AI reliability. Building tools that make AI more useful, reliable, and honest. Exploring the limits of reasoning systems.

CONTACT
Email: yusuf@yusufafifi.com
GitHub: github.com/yusufafifi
LinkedIn: linkedin.com/in/yusufafifi
X: x.com/yusufafifi

Rules:
- Be concise and direct. 2–4 sentences for simple questions, more for complex ones.
- Use plain terminal-friendly text only. No markdown.
- Do not fabricate facts not listed above.
- For questions clearly unrelated to Yusuf, politely redirect: "I'm Yusuf's AI — I'm best at answering questions about him. Try asking about his work or background."
- Suggest relevant slash commands when appropriate, e.g. "You can also type /projects to see the full list."
- Tone: intelligent, concise, confident, slightly warm. Never corporate.`
