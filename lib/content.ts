export type Link = { label: string; href: string }

export const PROFILE = {
  name: 'Yusuf Afifi',
  tagline: 'MEng EECS, UC Berkeley',
  location: 'San Francisco, CA',
  email: 'yusufafifi@berkeley.edu',
  personalEmail: 'yusuf.afifi@gmail.com',
  links: [
    { label: 'GitHub', href: 'https://github.com/afifi-yusuf' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/yusuf-afif1/' },
  ] satisfies Link[],
}

export const NOW: { title: string; text: string; href?: string }[] = [
  {
    title: 'UC Berkeley',
    text: 'MEng in EECS, 2026–2027.',
  },
  {
    title: 'Sky Lab',
    text: 'Research in the Berkeley Sky Computing Lab on agent efficiency for production workloads, advised by Alvin Cheung.',
    href: 'https://sky.cs.berkeley.edu',
  },
  {
    title: 'Principle',
    text: 'Research fellow working on RL post-training in prediction market environments, using adversarial multi-actor simulation for strategic decision-making.',
    href: 'https://futureprinciple.com',
  },
  {
    title: 'Warply',
    text: 'Building an open-source control plane for AI endpoints: launch, observe, and optimize OpenAI-compatible serving on GPUs.',
    href: 'https://warply.ai',
  },
]

export const INTERESTS = ['inference optimization', 'RL environments', 'agent execution']

export type Publication = {
  title: string
  authors: string[]
  venue: string
  summary: string
  note?: string
  links: Link[]
}

export const PUBLICATIONS: Publication[] = [
  {
    title: 'Do Your Own Research: Learning to Forecast by Learning to Search',
    authors: [
      'Yusuf Afifi',
      'Artur Kiulian',
      'Anton Polishko',
      'Mykola Khandoga',
      'Hamudi Naanaa',
      'Alina Krasnobrizha',
    ],
    venue: 'NeurIPS 2026 Workshop on Foundation Models for Temporal Systems (FMTS)',
    summary:
      'RLVR with web search in the loop for prediction market forecasting. An agentic environment built from 2,100+ resolved Polymarket questions, where the model gathers its own evidence behind leak filters; single-epoch GRPO on Qwen3.5-35B-A3B with a Brier-score reward cuts calibration error (ECE) 31% and searches per rollout from 3.8 to 2.25, and outperforms four frontier models, including Claude Opus 4.5, at about 5% of its inference cost.',
    note: 'Work done at Principle.',
    links: [
      { label: 'arXiv', href: 'https://arxiv.org/abs/2610.01955' },
      { label: 'pdf', href: 'https://arxiv.org/pdf/2610.01955' },
      { label: 'code', href: 'https://github.com/afifi-yusuf/prime-forecast' },
    ],
  },
]

export type Project = {
  title: string
  subtitle: string
  description: string
  tags: string[]
  links: Link[]
  note?: string
}

export const PROJECTS: Project[] = [
  {
    title: 'Agency',
    subtitle: 'Running, profiling, and debugging AI agent workflows',
    description:
      'Open-source platform from the Berkeley Sky Computing Lab for running concurrent agents across harnesses (Claude Code, Codex, OpenCode) and models (OpenAI, Anthropic, vLLM). Live view of model requests and tool calls, pause and resume, replay and mock-LLM testing, and a critical-path profiler across LLM, tool, and system time.',
    note: 'Part of my Sky Lab research, advised by Alvin Cheung.',
    tags: ['Agents', 'Profiling', 'Open source'],
    links: [
      { label: 'code', href: 'https://github.com/agency-project/agency' },
      { label: 'blog', href: 'https://www.linkedin.com/pulse/introducing-agency-alvin-cheung-hd8xc/' },
    ],
  },
  {
    title: 'Warply',
    subtitle: 'Open-source control plane for AI endpoints',
    description:
      'Python SDK to launch, inspect, and optimize OpenAI-compatible model serving on GPUs. Disaggregated prefill/decode pools, KV cache routing, and a portable DeploymentPlan across clouds and backends.',
    tags: ['Python', 'Inference', 'SGLang'],
    links: [
      { label: 'site', href: 'https://warply.ai' },
      { label: 'code', href: 'https://github.com/warply-ai/warply' },
    ],
  },
  {
    title: 'IntelliTrade',
    subtitle: 'Context-enriched multi-agent deep RL for algorithmic trading',
    description:
      'My UCL final-year dissertation, supervised by Yun Fu. Four LLM agents turn earnings-call transcripts into structured signals over a Neo4j causal-temporal knowledge graph, and a dual-stream DQN fuses them with price features through attention and gating.',
    note: 'In a walk-forward test (Jan 2024 – Feb 2026), LLM signals lifted mean Sharpe from 1.47 to 1.91 and added 22.4 points of return over a price-only version, winning on 8 of 9 tickers.',
    tags: ['Deep RL', 'LLM agents', 'Knowledge graphs'],
    links: [
      { label: 'report', href: '/intellitrade.pdf' },
      { label: 'code', href: 'https://github.com/afifi-yusuf/IntelliTrade' },
    ],
  },
  {
    title: 'ML for fluid dynamics',
    subtitle: 'Undergraduate research',
    description:
      'With an Imperial College research associate: a convolutional autoencoder for shallow-water simulation, with an LSTM in the latent space. TensorFlow.',
    tags: ['TensorFlow', 'CFD', 'Research'],
    links: [],
  },
  {
    title: 'ReadingStar',
    subtitle: 'Accessibility karaoke for Windows',
    description:
      'Offline karaoke app built with Intel and the National Autistic Society for speech development in neurodiverse students. I owned the speech model: real-time, fully offline Whisper, exported to ONNX and quantized to INT8 with OpenVINO, running on the Intel NPU at 88% less energy per inference than CPU. Distributed to UK schools.',
    note: 'The first education app optimized for NPUs, and featured by Intel.',
    tags: ['React Native', 'Whisper', 'OpenVINO'],
    links: [
      {
        label: 'Intel showcase',
        href: 'https://www.intel.com/content/www/us/en/customer-spotlight/stories/university-college-london-customer-story.html',
      },
      { label: 'code', href: 'https://github.com/JerryWu0430/readingstar' },
    ],
  },
  {
    title: 'Petals',
    subtitle: 'On-device AI for health and wellness (iOS)',
    description:
      'Apple Foundation Models running on-device with a RAG layer over HealthKit. An instruction-tuned chatbot, meditations, journaling, and wellness plans, with inference on the Neural Engine so data stays private.',
    tags: ['Swift', 'On-device AI', 'RAG'],
    links: [
      {
        label: 'write-up',
        href: 'https://medium.com/@yusuf.afifi/petals-ai-the-private-ai-revolution-e45ea6f3155f',
      },
    ],
  },
  {
    title: 'PolyWhisper',
    subtitle: 'Polymarket odds from live audio (Chrome)',
    description:
      'Listens to podcasts, YouTube, Zoom, and other audio. Deepgram realtime transcription and Grok topic detection notice when a prediction market comes up, and a sidebar shows the live Polymarket odds. Audio is not stored.',
    tags: ['Chrome', 'Deepgram', 'Polymarket'],
    links: [
      {
        label: 'Chrome Web Store',
        href: 'https://chromewebstore.google.com/detail/polywhisper/cjjdmnjmlcddlconidalbdlblkcliken',
      },
    ],
  },
]

export type Hackathon = {
  title: string
  event: string
  result?: string
  description: string
  links: Link[]
}

export const HACKATHONS: Hackathon[] = [
  {
    title: 'PolyBans',
    event: 'Mistral AI Hackathon, London 2026',
    result: '1st place, Best Use of Data (with Jump Trading)',
    description:
      'Prediction-market arbitrage from Meta Ray-Ban glasses. Live video and speech stream through a relay to Mistral, which finds matching Polymarket markets, shows them on a dashboard, and reads them back to the wearer.',
    links: [
      { label: 'demo', href: 'https://www.youtube.com/watch?v=bKkInQQRBt4' },
      { label: 'code', href: 'https://github.com/JerryWu0430/PolyBans' },
    ],
  },
  {
    title: 'Grok Earth',
    event: 'xAI Hackathon, London 2026',
    description:
      'A global mission control built on Grok: a 3D globe where any region opens live news, X posts, Grokipedia context, an AI radio host, generated imagery, and Polymarket odds.',
    links: [{ label: 'code', href: 'https://github.com/yunus04254/grok-earth' }],
  },
  {
    title: 'StarPlex',
    event: 'Perplexity London Hackathon 2025',
    result: '2nd place',
    description:
      'Startup intelligence platform that validates ideas and maps markets, competitors, VCs, and demographics on an interactive 3D globe. Next.js, FastAPI, Perplexity Sonar.',
    links: [
      { label: 'code', href: 'https://github.com/JerryWu0430/StarPlex' },
      { label: 'Perplexity showcase', href: 'https://docs.perplexity.ai/docs/cookbook/showcase/starplex' },
    ],
  },
]

export type Role = {
  title: string
  org: string
  dates: string
  place: string
  description: string
  href?: string
}

export const EXPERIENCE: Role[] = [
  {
    title: 'Research Fellow',
    org: 'Principle',
    dates: '2026 – present',
    place: 'San Francisco',
    description:
      'RL post-training on prediction market environments: adversarial multi-actor simulation for strategic decision-making. First-author paper on RLVR with web search in the loop for forecasting, accepted at the NeurIPS 2026 FMTS workshop.',
    href: 'https://futureprinciple.com',
  },
  {
    title: 'Software Development Engineer Intern, Gen AI',
    org: 'Amazon Prime Video',
    dates: 'Jun – Sep 2025',
    place: 'London',
    description:
      'Built a text-to-SQL agent for SVOD accounting using RAG on AWS Bedrock (Claude), a Kendra index, and Redshift, cutting ad-hoc query time by about 75%. Shipped the internal React chat UI on Lambda and WebSocket API Gateway with AWS CDK, CI/CD, least-privilege IAM, and CloudWatch alarms. 200+ weekly users globally.',
  },
  {
    title: 'Technology Summer Analyst, Data / ML for Finance',
    org: 'Angel Lane Partners (ALP Tech)',
    dates: 'Jun – Aug 2024',
    place: 'London',
    description:
      'GreenGuard climate risk modelling across physical, transition, and macro exposure. KNN and K-means imputation for missing data; Merton default and VAR scenarios in MATLAB and Python; a static frontend for client stress-test views.',
  },
]

export type School = {
  name: string
  degree: string
  dates: string
  place: string
  detail?: string
}

export const EDUCATION: School[] = [
  {
    name: 'University of California, Berkeley',
    degree: 'Master of Engineering (MEng), EECS',
    dates: '2026 – 2027',
    place: 'Berkeley, CA',
  },
  {
    name: 'University College London',
    degree: 'BSc (Hons) Computer Science, minor in Applied Mathematics · First Class',
    dates: 'Sep 2023 – Jun 2026',
    place: 'London, UK',
    detail:
      'Dissertation: IntelliTrade, context-enriched multi-agent deep RL for algorithmic trading (supervised by Yun Fu). Executive, Quant Ventures at the UCL Fintech Society.',
  },
  {
    name: 'JESS Dubai',
    degree: 'International Baccalaureate Diploma · 43 / 45',
    dates: 'Aug 2021 – May 2023',
    place: 'Dubai, UAE',
  },
]

export const TEACHING = [
  { code: 'COMP0002', name: 'C' },
  { code: 'COMP0004', name: 'Java' },
  { code: 'ENGF0034', name: 'Python' },
  { code: 'COMP0016', name: 'Systems' },
]

export const READING = {
  current: [
    { title: 'Inference Engineering', author: 'Philip Kiely' },
    { title: 'Our Mathematical Universe', author: 'Max Tegmark' },
    { title: "Runnin' Down a Dream", author: 'Bill Gurley' },
    { title: 'The Technological Republic', author: 'Alexander Karp' },
    { title: 'Principles', author: 'Ray Dalio' },
  ],
  favorites: [
    { title: 'Think and Grow Rich', author: 'Napoleon Hill' },
    { title: '1984', author: 'George Orwell' },
    { title: 'Den of Thieves', author: 'James B. Stewart' },
  ],
}

export const SKILLS = [
  { label: 'Languages', items: 'Python · TypeScript · Swift · C · Java · MATLAB · SQL' },
  {
    label: 'AI / ML',
    items:
      'RL post-training (GRPO, RLVR) · agents · RAG · inference optimization · model serving (SGLang) · TensorFlow · Whisper · OpenVINO',
  },
  { label: 'Cloud', items: 'AWS (Bedrock, Lambda, CDK, Redshift, Kendra, CloudWatch) · CI/CD' },
  { label: 'Web', items: 'React · Next.js · FastAPI · React Native' },
]
