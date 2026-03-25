# Afifi Intelligence — roadmap & ideas

Personal terminal site. Order matters for the first three; the rest are optional polish (Claude Code–inspired where noted).

---

## Priority

### 1. Update content

- [ ] Refresh copy in [`lib/commands.ts`](lib/commands.ts) (about, projects, experience, journey, values, etc.) so it matches what you want live today.
- [ ] Keep [`YUSUF_SYSTEM_PROMPT`](lib/commands.ts) in sync with the same facts — the LLM should not contradict slash-command content.
- [ ] Audit links (`/contact`, `/links`, `/resume`) and any PDFs or assets in [`public/`](public/).

### 2. Context for Groq

- [ ] Decide what “full context” means: single system blob vs split (identity vs long reference appendix).
- [ ] Optional: move the long knowledge block out of `commands.ts` into a dedicated module or markdown file loaded at build/runtime so edits are easier (still one system message to Groq).
- [ ] Tune [`app/api/ask/route.ts`](app/api/ask/route.ts): `max_tokens`, `temperature`, and model env (`GROQ_MODEL`) for cost/latency vs depth.
- [ ] Optional: very small “session preamble” (e.g. “User has already used /projects”) — only if you add client-side memory of commands run; keep privacy-friendly (no server-side chat log unless you choose to).

### 3. Skills (playbooks)

- [ ] Add `.claude/skills/<id>/SKILL.md` (Claude Code–compatible layout: YAML `name` / `description` + body).
- [ ] `GET /api/skills` — list id + name + description only (progressive disclosure).
- [ ] `POST /api/ask` — optional `skillId`; inject playbook body as extra system content.
- [ ] Terminal: `/playbooks`, `/playbook <id>`, `/playbook off` (sticky) or `/with <id> …` (one-shot) — keep existing `/skills` as the **resume** command.

---

## Interactive & fun (Claude Code vibes)

- [ ] **`/shortcuts` or `/keys`** — document Enter, ↑/↓ history, Tab completion, and any chip shortcuts (like CC’s discoverability).
- [ ] **Command palette feel** — mobile chips already help; optional: `⌘K`-style modal listing all commands with fuzzy search.
- [ ] **Sticky status line** — show active model, inference hint, and optional “active playbook” when you add skills (mirrors CC’s context footer).
- [ ] **`/changelog` or `/version`** — human-readable release notes as terminal output (git tags → copy, or hand-curated in `commands.ts`).
- [ ] **Easter commands** — you already have `secret`, `coffee`, etc.; add 1–2 more discoverable only via `ls`-style hints or `/help` subtext.
- [ ] **Boot sequence variants** — rare second SSH script or seasonal one-liner (still fast; no layout shift).
- [ ] **`/quote` or `/now-reading`** — one line from [`/reading`](lib/commands.ts) at random or rotating — makes repeat visits slightly alive.
- [ ] **Rate-limit UX** — if Groq returns 429, show a friendly terminal-style message and suggest `/contact` (production polish).

---

## Later / maybe

- [ ] **Light theme** — spec exists in [`afifi-intelligence.md`](afifi-intelligence.md); implement when you want contrast choice.
- [ ] **Shareable deep links** — already have `initialCmd` / `initialQ`; document in footer or `/help` (“append `?q=` …”).
- [ ] **Analytics** — privacy-preserving aggregate only (optional).
- [ ] **Auto-routing to playbooks** — keyword match on question vs `description` fields; adds complexity and tokens; defer.

---

## Not in scope (real Claude Code features)

These need tools, filesystem, or agents — not the same as prompt-only Groq:

- Parallel subagents, git worktrees, `/batch`-style refactors
- Live codebase search or MCP tool loop inside the browser terminal

---

*Last updated: March 2026*
