# afifi-intelligence

Personal site for [yusufafifi.com](https://yusufafifi.com) — a single-page terminal you can type commands into or just ask a question. Free-text questions stream from a Groq-hosted LLM that's prompted to answer as me.

```
> /about
yusuf afifi
meng eecs @ berkeley · visual computing · swe/ai · sf
...
> what did you build at amazon?
A text-to-SQL agent for SVOD accounting on AWS Bedrock — cut ad-hoc query time about 75% ...
```

## Stack

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript**
- **Tailwind CSS v4** with `tw-animate-css`
- **Groq SDK** for streaming inference (default model: `openai/gpt-oss-20b`)
- **Vercel** for hosting + analytics
- No database, no auth, no external state — every page load is a fresh terminal

## Getting started

```bash
pnpm install
cp .env.example .env       # then fill in GROQ_API_KEY
pnpm dev                   # http://localhost:3000
```

### Environment variables

| Variable        | Required | Default              | Notes                                                  |
| --------------- | -------- | -------------------- | ------------------------------------------------------ |
| `GROQ_API_KEY`  | yes      | —                    | Server-only. Used by `/api/ask` for streaming answers. |
| `GROQ_MODEL`    | no       | `openai/gpt-oss-20b` | Any model the Groq account has access to.              |

Only `GROQ_API_KEY` is required for `/ask` and free-text questions to work; the rest of the terminal (slash commands, `/gpu`, `/nvtop`, `/rollout`) is fully static and runs without it.

### Scripts

```bash
pnpm dev      # local dev (Turbopack)
pnpm build    # production build
pnpm start    # serve production build
pnpm lint     # eslint (config minimal — see Roadmap below)
```

## Architecture

One route, one client, one server endpoint, one prompt source.

```
app/
  page.tsx            entry — wraps HomePage in <Suspense>
  home-client.tsx     boots <SSHBoot> splash, then mounts <Terminal>
  layout.tsx          metadata, JSON-LD, viewport (themeColor #0a0a0a)
  manifest.ts         PWA manifest (Add-to-Home-Screen → standalone)
  opengraph-image.tsx terminal-styled OG card, prerendered statically
  error.tsx           terminal-styled render-error boundary
  not-found.tsx       terminal-styled 404
  resume/page.tsx     conventional readable resume page (+ PDF download)
  api/ask/route.ts    POST { question, skillId } → text/plain stream

components/terminal/
  Terminal.tsx        the main thing — state, input, history, completion, streaming
  SSHBoot.tsx         block-pixel "AFIFI INTELLIGENCE" splash + fake SSH session
  TerminalHeader.tsx  status dot (ready/streaming/error) + version chip
  OutputRenderer.tsx  segment-based output renderer (memoized)
  GpuBlock.tsx        /gpu — static nvidia-smi snapshot
  NvtopBlock.tsx      /nvtop — animated GPU meters (~6s, then settles)
  RolloutBlock.tsx    /rollout — RL trading rollout with ASCII sparkline

lib/
  commands.ts         slash command registry, OutputSegment/OutputBlock types,
                      WELCOME_SEGMENTS, YUSUF_SYSTEM_PROMPT
  skills.ts           AI persona registry (me / fun / deep / pitch)
  utils.ts            cn() helper
```

### Slash commands

Static (data in [`lib/commands.ts`](lib/commands.ts)):

```
/help /about /projects /experience /education /now
/contact /resume /reading /clear /ask <question>
```

There is also a conventional, crawlable resume page at [`/resume`](app/resume/page.tsx) (same facts as the terminal commands, plus PDF download) for visitors who won't drive the terminal.

Lab (custom self-rendering block kinds in `components/terminal/*Block.tsx`):

```
/gpu      static nvidia-smi snapshot
/nvtop    live GPU monitor (animated)
/rollout  RL trading rollout (animated)
```

AI modes (defined in [`lib/skills.ts`](lib/skills.ts)):

```
/skills          list AI personas (me / fun / deep / pitch)
/use <id>        sticky persona — sent with every subsequent question
/use off         back to default (me)
/with <id> <q>   one-shot persona for a single question
```

Easter eggs (hidden from `/help`, still tab-complete-blocked):
`sudo`, `vim`, `exit`, `hack`, `hello`, `hire`, `coffee`, `secret`, `whoami`, `ls`, `pwd`.

### Keyboard

- `Enter` — submit
- `Tab` / `↑` / `↓` — cycle slash completions
- `→` — accept ghost suffix (fish/zsh style)
- `↑` / `↓` (no completions) — command history
- `Esc` / `Ctrl+C` — interrupt streaming answer
- `Ctrl+L` — clear

### Deep links

```
https://yusufafifi.com/?cmd=projects        runs /projects on load
https://yusufafifi.com/?q=what's your stack live-streams a question on load
```

### How `/ask` works

1. Terminal POSTs `{ question, skillId? }` to `/api/ask`.
2. Server validates (length ≤ 2000 chars), looks up the skill, and concatenates `YUSUF_SYSTEM_PROMPT + "\n\n" + skill.prompt` (skill prompt is empty for `me`).
3. Streams Groq's chat completion back as `text/plain` chunks.
4. Client renders incrementally, with `aria-busy` while streaming.

The system prompt and all factual content live in a single source — [`YUSUF_SYSTEM_PROMPT`](lib/commands.ts) — so the LLM cannot contradict the slash-command content.

## Deploy

This repo deploys to Vercel on every push to `main`. Set `GROQ_API_KEY` in the Vercel project's Environment Variables (Production + Preview). Optional: set `GROQ_MODEL` to override the default.

OpenGraph image, manifest, and the homepage are prerendered statically; only `/api/ask` is dynamic.

## Roadmap

Tracked in [`TODO.md`](TODO.md) and `.cursor/plans/terminal-site-improvements_*.plan.md`. High-leverage items still open:

- Server-side rate limit + origin lock on `/api/ask` (Upstash KV)
- Trim unused dependencies (`components/ui/` shadcn dead code)
- ESLint config + CI step on previews
- More personas / playbooks once content is ready
