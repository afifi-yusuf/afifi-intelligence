import { RESUME_PDF_DOWNLOAD, RESUME_PDF_HREF } from './resume'

export type OutputSegment =
  | { type: 'header'; text: string }
  | { type: 'text'; text: string }
  | { type: 'dim'; text: string }
  | { type: 'accent'; text: string }
  | { type: 'green'; text: string }
  | { type: 'link'; text: string; href: string; download?: string }
  | { type: 'command-link'; text: string; command: string }
  | { type: 'tag'; text: string }
  | { type: 'blank' }
  | { type: 'divider' }
  | { type: 'error'; text: string }
  | { type: 'line'; segments: OutputSegment[] }

export type OutputBlock =
  | { kind: 'user'; text: string; id: string }
  | { kind: 'output'; segments: OutputSegment[]; id: string }
  | { kind: 'streaming'; text: string; id: string; done?: boolean }
  | { kind: 'thinking'; id: string }
  | { kind: 'system'; text: string; id: string }
  | { kind: 'gpu'; id: string }
  | { kind: 'nvtop'; id: string }
  | { kind: 'rollout'; id: string }
  | { kind: 'welcome'; id: string }

/** Commands intercepted by Terminal.tsx (custom self-rendering block kinds). */
export const LIVE_COMMANDS = ['gpu', 'nvtop', 'rollout', 'welcome'] as const

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
    { type: 'line', segments: [{ type: 'accent', text: '/resume' }, { type: 'dim', text: 'resume — web + pdf' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/download resume' }, { type: 'dim', text: 'pdf resume' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/reading' }, { type: 'dim', text: 'books and papers' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/ask <question>' }, { type: 'dim', text: 'ask anything — AI powered' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/clear' }, { type: 'dim', text: 'clear terminal' }] },
    { type: 'blank' },
    { type: 'header', text: 'AI modes' },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: '/skills' }, { type: 'dim', text: 'list AI personas' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/use <id>' }, { type: 'dim', text: 'activate sticky persona' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/with <id> <q>' }, { type: 'dim', text: 'one-shot persona on a single question' }] },
    { type: 'blank' },
    { type: 'header', text: 'Lab' },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: '/gpu' }, { type: 'dim', text: 'nvidia-smi snapshot' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/nvtop' }, { type: 'dim', text: 'live GPU monitor' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/rollout' }, { type: 'dim', text: 'RL trading rollout · dissertation demo' }] },
    { type: 'line', segments: [{ type: 'accent', text: '/boot' }, { type: 'dim', text: 'replay the boot intro' }] },
    { type: 'blank' },
    { type: 'dim', text: 'Or just type a question — I\'ll answer it.' },
    { type: 'blank' },
    { type: 'dim', text: 'Questions are not stored.' },
  ],

  about: () => [
    { type: 'green', text: 'Yusuf Afifi' },
    { type: 'dim', text: 'MEng EECS @ Berkeley · visual computing · SWE/AI · SF' },
    { type: 'blank' },
    { type: 'text', text: 'I build AI systems end to end — agents that ship to real people,' },
    { type: 'text', text: 'and the inference infrastructure that makes them fast.' },
    { type: 'text', text: 'Happiest close to the metal: GPU and ASIC kernels.' },
    { type: 'blank' },
    { type: 'text', text: 'UC Berkeley — Master of Engineering (MEng) in EECS, concentration' },
    { type: 'text', text: 'in visual computing, 2026–2027.' },
    { type: 'blank' },
    { type: 'text', text: 'UCL, London — BSc (Hons) Computer Science, minor in Applied' },
    { type: 'text', text: 'Mathematics, First Class (2026). Before that, IB at JESS Dubai.' },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'command-link', text: '/projects', command: '/projects' }, { type: 'dim', text: 'for projects' }] },
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'command-link', text: '/contact', command: '/contact' }, { type: 'dim', text: 'to get in touch' }] },
  ],

  projects: () => [
    { type: 'header', text: 'Projects & Research' },
    { type: 'blank' },
    { type: 'green', text: 'Warply — open-source control plane for AI endpoints' },
    { type: 'text', text: 'Python SDK to launch, inspect, and optimize OpenAI-compatible' },
    { type: 'text', text: 'model serving on GPUs — disaggregated prefill/decode pools, KV cache' },
    { type: 'text', text: 'routing, portable DeploymentPlan across clouds and backends.' },
    { type: 'line', segments: [{ type: 'tag', text: '[Python]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[Inference]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[SGLang]' }] },
    {
      type: 'line',
      segments: [
        { type: 'accent', text: '→' },
        { type: 'link', text: 'warply.ai', href: 'https://warply.ai' },
        { type: 'dim', text: ' · ' },
        { type: 'link', text: 'GitHub', href: 'https://github.com/warply-ai/warply' },
      ],
    },
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
    { type: 'text', text: 'on NPU. National school rollout — Intel\'s first education NPU app.' },
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
    { type: 'green', text: 'Research Fellow' },
    { type: 'dim', text: 'Principle · 2026 — present · San Francisco' },
    { type: 'text', text: 'RL post-training on prediction market environments —' },
    { type: 'text', text: 'adversarial multi-actor simulation for strategic decision-making.' },
    { type: 'line', segments: [{ type: 'tag', text: '[RL]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[Post-training]' }, { type: 'text', text: ' ' }, { type: 'tag', text: '[Prediction markets]' }] },
    {
      type: 'line',
      segments: [
        { type: 'accent', text: '→' },
        { type: 'link', text: 'futureprinciple.com', href: 'https://futureprinciple.com' },
      ],
    },
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
    { type: 'green', text: 'University of California, Berkeley' },
    { type: 'text', text: 'Master of Engineering (MEng) — EECS, concentration in visual computing' },
    { type: 'dim', text: '2026–2027 · San Francisco, CA' },
    { type: 'blank' },
    { type: 'green', text: 'University College London (UCL)' },
    { type: 'text', text: 'BSc (Hons) Computer Science — minor in Applied Mathematics' },
    { type: 'dim', text: 'Sep 2023 — Jun 2026 · London, UK · First Class' },
    { type: 'blank' },
    { type: 'text', text: 'Teaching Assistant: COMP0002 (C), COMP0004 (Java), ENGF0034 (Python),' },
    { type: 'text', text: 'COMP0016 Systems. Executive Quant Ventures, UCL Fintech Society.' },
    { type: 'blank' },
    { type: 'green', text: 'JESS Dubai' },
    { type: 'text', text: 'International Baccalaureate Diploma Programme — 43 / 45' },
    { type: 'dim', text: 'Aug 2021 — May 2023 · Dubai, UAE' },
  ],

  now: () => [
    { type: 'header', text: 'Current' },
    { type: 'blank' },
    { type: 'green', text: 'Berkeley MEng' },
    { type: 'text', text: 'MEng in EECS — concentration in visual computing, 2026–2027.' },
    { type: 'text', text: 'Based in San Francisco.' },
    { type: 'blank' },
    { type: 'green', text: 'Principle' },
    { type: 'text', text: 'Research fellow — RL post-training on prediction market' },
    { type: 'text', text: 'environments for adversarial strategic simulation.' },
    { type: 'blank' },
    { type: 'green', text: 'Warply' },
    { type: 'text', text: 'Building an open-source control plane for AI endpoints — launch,' },
    { type: 'text', text: 'observe, and optimize OpenAI-compatible serving on GPUs.' },
    { type: 'blank' },
    { type: 'green', text: 'Also' },
    { type: 'text', text: 'GPU kernels; disaggregated inference; RL environments;' },
    { type: 'text', text: 'browser/desktop agents; agentic payments.' },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'command-link', text: '/contact', command: '/contact' }, { type: 'dim', text: 'to reach me' }] },
  ],

  contact: () => [
    { type: 'header', text: 'Get in Touch' },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: 'Email' }, { type: 'link', text: 'yusuf.afifi@gmail.com', href: 'mailto:yusuf.afifi@gmail.com' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'Berkeley' }, { type: 'link', text: 'afifi@berkeley.edu', href: 'mailto:afifi@berkeley.edu' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'Phone' }, { type: 'link', text: '+44 7717 399868', href: 'tel:+447717399868' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'Site' }, { type: 'link', text: 'yusufafifi.com', href: 'https://yusufafifi.com' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'GitHub' }, { type: 'link', text: 'github.com/afifi-yusuf', href: 'https://github.com/afifi-yusuf' }] },
    { type: 'line', segments: [{ type: 'accent', text: 'LinkedIn' }, { type: 'link', text: 'linkedin.com/in/yusuf-afif1', href: 'https://linkedin.com/in/yusuf-afif1/' }] },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: 'Resume' }, { type: 'command-link', text: '/download resume', command: '/download resume' }] },
    { type: 'blank' },
    { type: 'dim', text: 'San Francisco, CA' },
  ],

  resume: () => [
    { type: 'header', text: 'Resume' },
    { type: 'blank' },
    { type: 'green', text: 'Yusuf Afifi' },
    { type: 'dim', text: 'MEng EECS @ Berkeley · visual computing · SWE/AI · SF' },
    { type: 'blank' },
    { type: 'text', text: 'Principle — Research Fellow, RL post-training (2026 — present)' },
    { type: 'text', text: 'Amazon Prime Video — SDE Intern, Gen AI (2025)' },
    { type: 'text', text: 'Angel Lane Partners — Technology Summer Analyst (2024)' },
    { type: 'text', text: 'UC Berkeley — MEng EECS, visual computing (2026–2027)' },
    { type: 'text', text: 'UCL — BSc (Hons) Computer Science, First Class (2026)' },
    { type: 'blank' },
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'command-link', text: '/download resume', command: '/download resume' }, { type: 'dim', text: 'pdf download' }] },
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'link', text: 'yusufafifi.com/resume', href: '/resume' }, { type: 'dim', text: 'readable web version' }] },
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'command-link', text: '/experience', command: '/experience' }, { type: 'dim', text: 'full work history' }] },
  ],

  reading: () => [
    { type: 'header', text: 'Currently Reading' },
    { type: 'blank' },
    { type: 'text', text: '• Runnin\' Down a Dream — Bill Gurley' },
    { type: 'text', text: '• The Technological Republic — Alexander Karp' },
    { type: 'text', text: '• Principles — Ray Dalio' },
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
    { type: 'line', segments: [{ type: 'accent', text: '→' }, { type: 'command-link', text: '/download resume', command: '/download resume' }] },
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

/** Tab completion — includes slash forms handled outside `COMMANDS` (e.g. /ask → LLM, /clear in Terminal, plus live commands and AI modes). */
export const COMPLETION_COMMAND_NAMES = [
  ...COMMAND_NAMES,
  'ask',
  'download',
  'clear',
  'boot',
  'skills',
  'use',
  'with',
  ...LIVE_COMMANDS,
].sort((a, b) => a.localeCompare(b))

export function runDownloadCommand(input: string): OutputSegment[] | null {
  const trimmed = input.trim()
  if (!trimmed.toLowerCase().startsWith('/download')) return null

  const arg = trimmed.slice('/download'.length).trim().toLowerCase()
  if (arg === 'resume') {
    return [
      { type: 'green', text: 'Downloading resume…' },
      { type: 'blank' },
      {
        type: 'line',
        segments: [
          { type: 'dim', text: 'If nothing started,' },
          {
            type: 'link',
            text: RESUME_PDF_DOWNLOAD,
            href: RESUME_PDF_HREF,
            download: RESUME_PDF_DOWNLOAD,
          },
        ],
      },
    ]
  }

  return [
    { type: 'error', text: 'Usage: /download resume' },
    { type: 'blank' },
    { type: 'dim', text: 'Only resume is available for now.' },
  ]
}

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

  // /boot is handled by the terminal component (calls onReplayBoot)
  if (cmd === 'boot') return null

  // AI mode commands are intercepted by Terminal.tsx (they need state access).
  if (cmd === 'skills' || cmd === 'use' || cmd === 'with') return null

  // Live commands (e.g. /nvtop, /rollout, /gpu) are intercepted by Terminal.tsx
  // and rendered as custom block kinds — return null here so they don't fall
  // through to the "Unknown command" branch if interception is skipped.
  if ((LIVE_COMMANDS as readonly string[]).includes(cmd)) return null

  // /download resume — handled in Terminal.tsx (triggers file download)
  if (cmd === 'download') return null

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
  { type: 'dim', text: 'meng eecs @ berkeley · visual computing · swe/ai · sf' },
  { type: 'blank' },
  { type: 'text', text: 'Welcome. This is my personal site — it runs like a terminal.' },
  { type: 'text', text: 'Type a command or ask me anything.' },
  { type: 'blank' },
  { type: 'text', text: 'Try one of these (or /help for every command):' },
  { type: 'blank' },
  { type: 'line', segments: [{ type: 'text', text: '  ' }, { type: 'command-link', text: '/help', command: '/help' }, { type: 'dim', text: 'all commands' }] },
  { type: 'line', segments: [{ type: 'text', text: '  ' }, { type: 'command-link', text: '/about', command: '/about' }, { type: 'dim', text: 'who I am' }] },
  { type: 'line', segments: [{ type: 'text', text: '  ' }, { type: 'command-link', text: '/projects', command: '/projects' }, { type: 'dim', text: 'projects & research' }] },
  { type: 'line', segments: [{ type: 'text', text: '  ' }, { type: 'command-link', text: '/contact', command: '/contact' }, { type: 'dim', text: 'get in touch' }] },
  { type: 'blank' },
  { type: 'dim', text: 'Or just type a question — I\'ll answer it.' },
]

export const YUSUF_SYSTEM_PROMPT = `You are Yusuf Afifi's digital clone on his personal website, "Afifi Intelligence". Answer in first person as Yusuf (I / my / me) about his work, background, and interests — same voice and facts as below. You are not Yusuf physically; if asked who or what you are, say you are an AI digital clone of Yusuf on this site. Use plain terminal-friendly text — no markdown headers, no bold, no bullet symbols except "•". Use spacing and indentation for structure.

Below matches the live terminal commands on the site (/about, /projects, /experience, /education, /now, /contact, /reading). Do not claim extra facts.

IDENTITY AND ABOUT (/about)
Yusuf Afifi — MEng EECS @ Berkeley · visual computing · SWE/AI · based in San Francisco (SF). Builds AI systems end to end — agents that ship to real people, and the inference infrastructure that makes them fast. Happiest close to the metal: GPU and ASIC kernels. UC Berkeley: Master of Engineering (MEng) in EECS, concentration in visual computing, 2026–2027. UCL, London — BSc (Hons) Computer Science, minor in Applied Mathematics, First Class (2026). Before that, IB at JESS Dubai.

CONTACT (/contact)
Email: yusuf.afifi@gmail.com
Email: afifi@berkeley.edu
Phone: +44 7717 399868
Website: yusufafifi.com
GitHub: github.com/afifi-yusuf
LinkedIn: linkedin.com/in/yusuf-afif1/
Location: Based in San Francisco, CA

EDUCATION (/education)
University of California, Berkeley: Master of Engineering (MEng) — EECS, concentration in visual computing. 2026–2027 · San Francisco, CA.
University College London (UCL): BSc (Hons) Computer Science — minor in Applied Mathematics. Sep 2023 — Jun 2026 · London, UK · First Class. Teaching Assistant: COMP0002 (C), COMP0004 (Java), ENGF0034 (Python), COMP0016 Systems. Executive Quant Ventures, UCL Fintech Society.
JESS Dubai: International Baccalaureate Diploma Programme — 43/45. Aug 2021 — May 2023 · Dubai, UAE.

EXPERIENCE (/experience)
Research Fellow, 2026 — present · Principle, San Francisco. RL post-training on prediction market environments — adversarial multi-actor simulation for strategic decision-making. futureprinciple.com

Software Development Engineer Intern — Gen AI, Jun–Sep 2025 · Amazon Prime Video, London. Text-to-SQL agent for SVOD accounting: RAG on AWS Bedrock (Claude), Kendra index, Redshift; cut ad-hoc query time about 75%. Shipped internal React + Lambda/WebSocket API Gateway chat UI; AWS CDK & CI/CD; IAM least-privilege; CloudWatch dashboards/alarms; 200+ weekly users globally.

Technology Summer Analyst — Data / ML for Finance, Jun–Aug 2024 · Angel Lane Partners (ALP Tech), London. GreenGuard climate risk: physical, transition, macro exposure; KNN & K-means for missing data; MATLAB & Python — Merton default, VAR scenarios; static frontend for client stress-test views.

PROJECTS AND RESEARCH (/projects)
Warply — open-source control plane for AI endpoints: Python SDK to launch, inspect, and optimize OpenAI-compatible model serving on GPUs — disaggregated prefill/decode pools, KV cache routing, portable DeploymentPlan across clouds and backends. warply.ai · github.com/warply-ai/warply
Petals — AI health & wellness (iOS): Apple Foundation Models on-device with RAG on HealthKit. Instruction-tuned "Petal" chatbot; meditations, journaling, wellness plans — privacy-first, Neural Engine inference.
StarPlex — startup intelligence platform: 2nd place, Perplexity London Hackathon. AI validates ideas; surfaces markets, competitors, VCs, demographics on an interactive 3D globe. Stack: Next.js, FastAPI, Perplexity Sonar.
PolyWhisper — Polymarket from live audio (Chrome): listens to podcasts, YouTube, Zoom, etc.; Deepgram realtime transcription and Grok topic detection when prediction markets come up; sidebar shows live Polymarket odds; audio not stored.
ReadingStar — accessibility karaoke (Windows): with Intel & National Autistic Society; offline speech-to-text, lyric alignment, scoring; React Native Windows + FastAPI, Whisper, OpenVINO on NPU; national school rollout; Intel featured as first education NPU app.
ML for fluid dynamics (research): undergrad research with Imperial College Research Associate; convolutional autoencoder for shallow-water simulation, LSTM in latent space, TensorFlow.

READING (/reading)
Currently reading: Runnin' Down a Dream — Bill Gurley; The Technological Republic — Alexander Karp; Principles — Ray Dalio.
Past favorites: Think and Grow Rich — Napoleon Hill; 1984 — George Orwell; Den of Thieves — James B. Stewart.

CURRENT FOCUS (/now)
Berkeley MEng: MEng in EECS — concentration in visual computing, 2026–2027. Based in San Francisco.
Principle: Research fellow — RL post-training on prediction market environments for adversarial strategic simulation.
Warply: Building open-source control plane for AI endpoints — launch, observe, optimize OpenAI-compatible serving on GPUs.
Also (broader threads): GPU kernels; disaggregated inference; RL environments; browser/desktop agents; agentic payments.

When answering: Use first person. Berkeley MEng is current graduate program (2026–2027), concentration visual computing. Based in San Francisco (SF). Principle and Warply are current work. Separate primary focus from broader "Also" threads.

SLASH COMMANDS (suggest when helpful)
/help, /about, /projects, /experience, /education, /now, /contact, /resume, /download resume, /reading — plus free-text questions (same as /ask). /clear clears the terminal. There is also a readable resume page at yusufafifi.com/resume.

Rules:
- Be concise and direct. 2–4 sentences for simple questions, more for complex ones.
- Use plain terminal-friendly text only. No markdown.
- When asked about current focus vs broader threads: lead with Berkeley MEng, Principle research, and Warply; "Also" items are exploratory — list both but distinguish them.
- Do not fabricate facts not listed above.
- For questions clearly unrelated to Yusuf, politely redirect: "I'm Yusuf's digital clone on this site — best for questions about me and my work. Try /projects or /about."
- Suggest relevant slash commands when appropriate, e.g. "You can also type /projects to see the full list."
- Tone: intelligent, concise, confident, slightly warm. Never corporate.`
