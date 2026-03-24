Personal Terminal UI — Design Specification

Project: yusufafifi.com
Concept: A Claude Code-style terminal interface that IS the personal website. Visitors interact with a dark, monospace terminal where slash commands surface pre-written content and free-text questions are answered by an LLM that knows everything about Yusuf.

---

1. Product vision

Build a personal website that looks and feels like Claude Code — a polished, dark terminal with a blinking cursor, typed input, and beautifully formatted output.

The interaction model should feel like:
  - opening a terminal session with someone's life and work
  - discovering content through intentional commands
  - having a real conversation via free-text questions
  - a memorable, technically-native personal brand

It should not feel like:
  - a gimmick or toy
  - a generic portfolio with a terminal skin
  - intimidating to non-engineers (suggested commands solve this)
  - slow or laggy

Target audience:
  - engineers, recruiters, founders, collaborators
  - anyone who receives a link to yusufafifi.com
  - people who appreciate craft and unusual personal sites

First impression goal:
  Within 3 seconds of landing, the visitor should understand: this person builds tools, cares about craft, and has a sense of identity. The welcome message and suggested commands make the next action obvious without requiring any CLI knowledge.

---

2. Visual design

The site replicates the look and feel of Claude Code's terminal interface.

2.1 Layout

Full viewport, single column terminal. No sidebars, no cards, no scroll-jacking. Just a terminal.

Structure from top to bottom:
  - Header bar (thin, ~36px)
  - Terminal body (scrollable, fills remaining space)
  - Input line (fixed at bottom, always visible)
  - Status bar (thin, ~24px, below input)

2.2 Header bar

Left side:
  - "yusuf afifi" in small monospace, dimmed white

Right side:
  - session indicator or version, e.g. "v1.0.0" or a subtle link icon
  - optional: theme toggle (dark/light) if desired later

Style:
  - background slightly lighter than terminal body (e.g. #1a1a2e or similar)
  - thin bottom border, 1px, very subtle (rgba white ~8%)
  - font: monospace, 12px, letter-spacing normal

2.3 Terminal body

  - background: near-black (#0d1117 or #111111 — match Claude Code's tone)
  - font: monospace (JetBrains Mono, Fira Code, or SF Mono — pick one, load from Google Fonts)
  - font size: 14px desktop, 13px mobile
  - line height: 1.6–1.7
  - text color: #e6e6e6 (off-white, not pure white)
  - padding: 24px horizontal, 16px vertical
  - scrollable, scroll-to-bottom on new output
  - selection color: subtle blue or purple highlight

2.4 Input line

  - fixed at the bottom of the terminal area, never scrolls away
  - prompt symbol: ">" in accent color (muted blue, ~#7aa2f7)
  - input text: same monospace, same size, white
  - blinking cursor: thin line or block, accent-colored, ~1s blink cycle
  - no visible border on the input — it sits flush with the terminal body
  - background: same as terminal or very slightly different
  - subtle top border or shadow to separate from scrolling content

2.5 Status bar

  - sits below the input line, at the very bottom
  - background: slightly lighter than terminal (#161b22 range)
  - left: current "mode" indicator (e.g. "commands" or "ask mode")
  - center or right: "type /help for commands" hint (dimmed, disappears after first command)
  - font: 11px monospace, dimmed gray (#666 range)

2.6 Color palette

  Role              | Color
  ------------------|----------
  background        | #0d1117
  header/status bg  | #161b22
  foreground text   | #e6e6e6
  dimmed text       | #7d8590
  accent (prompt)   | #7aa2f7
  success/green     | #7ee787
  warning/yellow    | #d29922
  error/red         | #f85149
  link/highlight    | #58a6ff
  tag/label         | #a371f7
  border subtle     | rgba(255,255,255,0.06)

These should be CSS custom properties so theming is trivial later.

2.7 Output formatting

Different content types get distinct visual treatments:

  - Section headers: green or accent color, bold, preceded by a blank line
  - Body text: default foreground, wrapped at terminal width
  - Labels / keys: dimmed or accent, followed by value in foreground
  - Lists: prefixed with "•" or "-", indented 2 spaces
  - Tags: inline, wrapped in brackets, purple/tag color, e.g. [Python] [CUDA]
  - Links: underlined, link color, clickable
  - Dividers: a line of "—" in dimmed color, used sparingly
  - Errors: red prefix "error:" followed by message
  - System messages: dimmed italic (e.g. "type /help for commands")
  - Streaming text (LLM): characters appear one by one or in chunks, like Claude Code's output

2.8 Animations

  - Text output: typewriter effect for welcome message and LLM responses (configurable speed, ~20-40ms per character for short content, chunked for long)
  - Command output: appears instantly (no typewriter for static commands — they should feel snappy)
  - Cursor blink: CSS animation, 1s cycle
  - Scroll: smooth scroll to bottom on new output
  - Respect prefers-reduced-motion: disable typewriter, show all text immediately

---

3. Slash command catalog

Commands use the forward-slash prefix (like Claude Code's /help, /config, etc.). All slash command output is pre-written, static, and instant.

3.1 Command list

  /help          Show all available commands with descriptions
  /about         Who Yusuf is — identity, positioning, one-paragraph bio
  /skills        Technical skills organized by category
  /projects      Selected engineering projects
  /experience    Work experience timeline
  /education     Academic background
  /journey       The four-cities narrative (Alexandria → Dubai → London → SF)
  /now           What Yusuf is doing right now
  /contact       How to reach Yusuf
  /links         Social and professional links
  /resume        Formatted resume view + PDF download link
  /reading       What Yusuf is currently reading or recommends
  /values        Core beliefs and working principles
  /uses          Tools, stack, and setup Yusuf uses daily
  /ask <question>  Ask anything — powered by AI (free-text, calls LLM)
  /clear         Clear the terminal
  /theme         Toggle light/dark (optional, dark default)

3.2 Detailed command outputs

--- /help ---

Output:

  Available commands

  /about         who I am
  /skills        technical skills
  /projects      selected work
  /experience    work history
  /education     academic background
  /journey       four cities, one story
  /now           what I'm working on
  /contact       get in touch
  /links         GitHub, LinkedIn, X, etc.
  /resume        resume + PDF download
  /reading       books and papers
  /values        what I believe in
  /uses          tools and setup
  /clear         clear terminal

  Or just type a question — I'll answer it.

--- /about ---

Output:

  Yusuf Afifi
  Software Engineer & AI Builder

  I build things at the intersection of software and intelligence.
  Shaped by four cities across three continents — Alexandria, Dubai,
  London, and San Francisco — each one left something permanent in
  how I think and what I care about.

  Currently based in San Francisco, working on AI-native products
  and the infrastructure that makes intelligent systems production-ready.

  The boring problems turned out to be the interesting ones.

  → /journey for the full story
  → /projects for selected work
  → /contact to get in touch

--- /skills ---

Output:

  Technical Skills

  Languages
    Python · TypeScript · Go · Rust · SQL · C++

  AI / ML
    PyTorch · JAX · LLM fine-tuning · inference optimization
    transformer architecture · RAG · agent systems · RLHF

  Backend & Systems
    Node.js · FastAPI · gRPC · PostgreSQL · Redis
    Kafka · distributed systems · real-time pipelines

  Infrastructure
    AWS · GCP · Docker · Kubernetes · Terraform
    CI/CD · observability · edge deployment

  Frontend
    React · Next.js · Tailwind CSS · Framer Motion

  Tools & Practices
    Git · Linux · Neovim · Claude Code · Cursor
    system design · code review · technical writing

--- /projects ---

Output:

  Selected Projects

  LLM Inference Optimization
  Systems-level tooling for transformer inference. 40% latency
  reduction on standard benchmarks through kernel-level attention
  approximation.
  [Python] [CUDA] [PyTorch]

  Real-time Feature Pipeline
  Distributed ML feature engineering system processing 50k events/sec.
  Built for a fintech production environment.
  [Go] [Kafka] [PostgreSQL]

  Sparse Attention Contribution
  Open-source extension to a widely used NLP library.
  Merged into main — used by hundreds of researchers.
  [Python] [PyTorch] [Open Source]

  → /experience for work history

--- /experience ---

Output:

  Work Experience

  Software Engineer — AI Startup
  2024 — Present · San Francisco
  Building AI-native products. Focused on the application layer —
  where models meet real products and real people.

  Software Engineer Intern — DeepMind
  2022 · London
  Applied research engineering on language model evaluation
  infrastructure. Worked with the Gemini pre-training team.
  [Python] [JAX] [GCP]

  Software Engineer — Fintech Startup
  2021 — 2023 · London
  Full-stack engineering on a real-time algorithmic trading platform.
  From zero to production.
  [TypeScript] [React] [Node.js] [PostgreSQL]

--- /education ---

Output:

  Education

  University College London (UCL)
  MSc Computer Science — AI Track
  2019 — 2024 · London, UK

  Studied at the intersection of large language models and systems
  engineering. Focused on efficiency: how to make intelligent systems
  faster, cheaper, and more reliable in production.

--- /journey ---

Output:

  Four Cities. One Story.

  Alexandria — 1999–2017
  Where it all began. Born on the Mediterranean shore. The city that
  taught me how to see — slowly, curiously, with depth before speed.
  That constant horizon does something to you.

  Dubai — 2017–2019
  Where ambition became real. A city built on speed and scale that
  recalibrates your sense of what is possible. Developed discipline,
  tolerance for discomfort, and professional momentum.

  London — 2019–2024
  Where work became serious. UCL, research, engineering, and the
  projects that taught me how to build under pressure. The densest
  chapter — portfolio, internships, and serious technical depth.

  San Francisco — 2024–Present
  The frontier. Where the most interesting problems in AI are being
  worked on right now. Focused on the application layer and building
  what comes next.

  → /about for who I am now
  → /contact to connect

--- /now ---

Output:

  Right Now

  Based in San Francisco.
  Building AI products and working on hard problems.

  Reading    Scaling laws research. Philosophy of mind.
             Anything that challenges a comfortable assumption.

  Building   Tools that make AI more useful, more reliable,
             and more honest.

  Exploring  The edges of what reasoning systems can currently
             do — and why they fail when they do.

  Open to interesting conversations, collaborations,
  and things worth caring about.

  → /contact to reach me

--- /contact ---

Output:

  Get in Touch

  Email      yusuf@yusufafifi.com
  GitHub     github.com/yusufafifi
  LinkedIn   linkedin.com/in/yusufafifi
  X          x.com/yusufafifi

  Always open to conversations about interesting problems,
  potential collaboration, and ideas worth exploring.
  No deck required.

--- /links ---

Output:

  Links

  GitHub       https://github.com/yusufafifi
  LinkedIn     https://linkedin.com/in/yusufafifi
  X / Twitter  https://x.com/yusufafifi
  Email        yusuf@yusufafifi.com
  Website      https://yusufafifi.com

--- /resume ---

Output:

  Resume

  [View formatted resume below]

  Yusuf Afifi
  Software Engineer & AI Builder
  San Francisco, CA

  Experience
    AI Startup — Software Engineer — 2024–Present
    DeepMind — Software Engineer Intern — 2022
    Fintech Startup — Software Engineer — 2021–2023

  Education
    UCL — MSc Computer Science (AI) — 2019–2024

  Skills
    Python, TypeScript, Go, Rust, PyTorch, JAX, React, Next.js,
    PostgreSQL, Kafka, AWS, GCP, Docker, Kubernetes

  → Download PDF: [resume.pdf]

--- /reading ---

Output:

  Currently Reading

  • Scaling laws and their implications for model architecture
  • Philosophy of mind — consciousness and computation
  • The Art of Doing Science and Engineering — Richard Hamming
  • Anything that challenges a comfortable assumption

  Past favorites
  • Designing Data-Intensive Applications — Martin Kleppmann
  • The Pragmatic Programmer — Hunt & Thomas
  • Thinking, Fast and Slow — Daniel Kahneman

--- /values ---

Output:

  What I Believe In

  • Depth matters more than speed. Understanding comes before optimizing.
  • Context is everything — the most interesting things take time to
    reveal themselves.
  • The boring problems are usually the interesting ones.
  • Build things that are reliable, not just impressive in demos.
  • Ambitious environments demand ambitious thinking.
  • The gap between idea and execution can be compressed significantly
    if you are willing to push.
  • Every line of code is a liability until proven otherwise.

--- /uses ---

Output:

  Tools & Setup

  Editor       Cursor / Neovim
  Terminal     Claude Code · Warp · iTerm2
  Languages    Python · TypeScript · Go · Rust
  AI           Claude · GPT-4 · local models
  Infra        AWS · GCP · Vercel · Docker
  DB           PostgreSQL · Redis · DynamoDB
  OS           macOS · Linux (Ubuntu)
  Font         JetBrains Mono
  Theme        Dark, always

--- /clear ---

Clears all terminal output. Resets to a fresh state with just the input line. Does not show the welcome message again.

--- /theme ---

Toggles between dark and light mode. Default is dark. Light mode inverts the palette to a white/cream background with dark text. Optional for v1 — dark-only is fine.

---

4. Free-text / LLM mode

4.1 How it works

Any input that does not start with "/" is treated as a free-text question. It is sent to the Claude API (or similar LLM) along with a system prompt containing everything about Yusuf. The response streams back character-by-character, exactly like Claude Code's output.

The "/ask" command is an explicit alias — "/ask what are you working on?" behaves identically to just typing "what are you working on?"

4.2 System prompt

The system prompt should contain:
  - Yusuf's full bio, journey, skills, projects, experience, education, values, and current focus (all the content from the slash commands above)
  - Instruction to answer as if Yusuf is speaking in first person, but clearly indicate it is an AI assistant that knows about Yusuf
  - Tone: intelligent, concise, confident, slightly warm, never corporate
  - Refuse to answer questions that are clearly unrelated to Yusuf or his work (politely redirect)
  - Never fabricate facts not in the system prompt
  - Keep answers concise — 2-4 sentences for simple questions, longer for complex ones
  - Format output in plain text suitable for a terminal (no markdown headers, no bold — use spacing and indentation instead)

Example system prompt structure:

  You are an AI assistant on Yusuf Afifi's personal website.
  You know everything about Yusuf and answer questions about him,
  his work, his background, and his interests. Answer in first
  person as if relaying Yusuf's perspective, but make it clear
  you are an AI if asked directly.

  Here is everything you know about Yusuf:
  [... all content from slash commands embedded here ...]

  Rules:
  - Be concise and direct
  - Use plain terminal-friendly formatting
  - Do not make up facts not provided above
  - For unrelated questions, politely redirect to Yusuf-related topics
  - Suggest relevant slash commands when appropriate

4.3 Streaming UX

  - Show a thinking indicator: "thinking..." in dimmed text with a subtle animation (dots cycling, or a spinner)
  - Stream the response character-by-character or in small chunks (~3-5 chars)
  - Character delay: ~15-25ms (fast enough to feel responsive, slow enough to read)
  - When streaming completes, the text stays and the input becomes active again
  - If the user presses Escape during streaming, stop the stream and show what was received so far + "[interrupted]" in dimmed text
  - Scroll to bottom continuously during streaming

4.4 Rate limiting

  - Client-side: max ~20 questions per session (show a polite message when exhausted: "You've been curious — I appreciate that. For longer conversations, reach out directly: yusuf@yusufafifi.com")
  - Server-side: standard API rate limiting, short responses (max_tokens ~500)
  - Error state: if API fails, show "Couldn't reach the AI right now. Try a /command instead, or come back later." in warning color

4.5 Privacy

  - Do not log or store user questions beyond the current session
  - No cookies for tracking
  - Session state is in-memory only (lost on refresh)
  - Display a small note in the welcome message or /help: "Questions are not stored."

---

5. Interaction model

5.1 Typing

  - Standard text input behavior
  - Enter submits the command/question
  - The submitted input appears in the terminal output as "> [input]" in accent color before the response
  - After submission, input clears and cursor returns to empty prompt

5.2 Tab completion

  - Typing "/" then pressing Tab cycles through matching commands
  - Typing "/sk" + Tab completes to "/skills"
  - If multiple matches, show them inline as suggestions (dimmed, below input)
  - Tab through them one by one
  - Escape cancels completion

5.3 Command history

  - Up/Down arrow keys navigate through previously entered commands
  - History persists for the current session only (in-memory)
  - History wraps: pressing Up at the oldest entry does nothing; pressing Down at the newest clears input

5.4 Keyboard shortcuts

  Ctrl+L         Clear terminal (same as /clear)
  Ctrl+C         Cancel current streaming response
  Escape         Cancel autocomplete, or cancel streaming
  Up/Down        Command history
  Tab            Autocomplete

5.5 Clickable elements

  - Links in output are clickable (open in new tab)
  - Suggested commands in output (e.g. "→ /projects") are clickable — clicking them runs the command
  - Tags like [Python] are not clickable (purely decorative)

5.6 Unknown commands

  If the user types a slash command that does not exist:

  Output:
    Unknown command: /foo
    Type /help to see available commands.

---

6. Landing state

When a visitor first loads the site, the terminal is NOT empty. It shows a welcome sequence.

6.1 Welcome output

Displayed with typewriter effect (respect reduced-motion):

  yusuf afifi
  software engineer & AI builder

  Welcome. This is my personal site — it runs like a terminal.
  Type a command or ask me anything.

  Try one of these:

    /about       who I am
    /projects    selected work
    /journey     four cities, one story
    /skills      technical skills

  Or just type a question — I'll answer it.

The suggested commands in the "Try one of these" block should be clickable.

6.2 After welcome

  - The input line is active and ready
  - The status bar shows "type /help for all commands"
  - The cursor blinks in the input

6.3 Deep linking

  Support URL query params to pre-run a command on load:

    yusufafifi.com/?cmd=about     → loads and immediately runs /about
    yusufafifi.com/?cmd=projects  → loads and immediately runs /projects
    yusufafifi.com/?q=what+do+you+work+on  → runs a free-text question

  This makes the site shareable. The welcome message still appears first, followed by the command output.

---

7. Mobile behavior

The terminal must work well on phones. Most visitors will arrive via a shared link on mobile.

7.1 Layout

  - Same single-column terminal, full viewport
  - Input line stays above the software keyboard when it opens
  - Font size: 13px (slightly smaller than desktop)
  - Padding: 16px horizontal

7.2 Touch interactions

  - Tapping the terminal body focuses the input (opens keyboard)
  - Suggested commands and "→ /command" links are tap targets (min 44px touch area)
  - Scrolling works naturally — no hijacking
  - No hover states on mobile (hover-dependent UI like tab completion is keyboard-only)

7.3 Suggested command chips

  On mobile, below the input line (above status bar), show a horizontal scrollable row of command chips:

    [ /about ] [ /projects ] [ /skills ] [ /journey ] [ /contact ]

  Tapping a chip runs the command. This ensures mobile users never need to type a slash command from memory.

  On desktop, these chips are hidden (keyboard users have tab completion and /help).

7.4 Keyboard

  - The native keyboard should appear when the input is focused
  - Auto-capitalize: off
  - Auto-correct: off
  - Spell check: off

---

8. Technical implementation

8.1 Stack

  Framework:     Next.js (App Router)
  Language:      TypeScript
  Styling:       Tailwind CSS
  Font:          JetBrains Mono (Google Fonts) or similar monospace
  LLM:           Claude API (Anthropic) via server-side route handler
  Deployment:    Vercel
  Terminal:      Custom DOM-based (not xterm.js — we want full CSS control)

8.2 Why custom DOM, not xterm.js

  xterm.js is built for real terminal emulation (escape codes, PTY). We don't need that. We need:
  - Styled HTML output (clickable links, colored tags, clickable commands)
  - Full CSS control over every element
  - Semantic HTML for accessibility and SEO
  - Easy responsive behavior

  A custom terminal is a scrollable div of output blocks + a fixed input. Much simpler, more flexible.

8.3 Architecture

  Route structure:
    /                → the terminal (only page)
    /api/ask         → POST endpoint that proxies to Claude API

  Key components:
    Terminal          — main container: header + body + input + status
    TerminalOutput    — scrollable list of output blocks
    OutputBlock       — single command-response pair
    PromptInput       — the input line with cursor
    StatusBar         — bottom bar
    CommandChips      — mobile suggested commands

  State:
    - output history: array of { type, content } blocks
    - input value: string
    - command history: string[]
    - history index: number
    - isStreaming: boolean
    - sessionQuestionCount: number

  Command execution:
    - parse input
    - if starts with "/", look up in command registry (a map of command → handler)
    - if no "/", treat as free-text → POST to /api/ask
    - handler returns content (string or structured data) → rendered into OutputBlock

8.4 API route (/api/ask)

  - Accepts POST { question: string }
  - Sends to Claude API with system prompt + user question
  - Streams response back using ReadableStream / Server-Sent Events
  - Rate limiting: check session token or IP-based counter
  - API key stored in environment variable (ANTHROPIC_API_KEY)
  - Max tokens: 500
  - Model: claude-sonnet (or latest fast model)
  - Temperature: 0.7

8.5 SEO

  The terminal is client-rendered, which is bad for SEO by default. Mitigations:

  - Server-render the welcome message and /about content as hidden semantic HTML (visually hidden, screen-reader and crawler accessible)
  - Add proper meta tags: title, description, og:image, og:title
  - Add JSON-LD structured data (Person schema)
  - The og:image should be a screenshot of the terminal showing the welcome message

  Meta tags:
    title:       "Yusuf Afifi — Software Engineer & AI Builder"
    description: "Personal terminal. Type a command or ask me anything."
    og:image:    static screenshot of the terminal welcome screen

8.6 Analytics

  - Minimal: track page views and command usage (which commands are popular)
  - Use Vercel Analytics or a lightweight alternative
  - Do not track free-text questions (privacy)

---

9. Performance and accessibility

9.1 Performance

  - First paint: < 1s (static shell, fonts preloaded)
  - Interactive: < 1.5s
  - No heavy JS libraries — the entire terminal is lightweight DOM
  - Font: preload the monospace font to avoid FOUT
  - LLM calls are the only network dependency after initial load
  - Bundle size target: < 100KB JS (excluding font)

9.2 Accessibility

  - The terminal body is a live region (aria-live="polite") so screen readers announce new output
  - Input has proper label and role
  - All clickable elements (links, commands) are focusable and keyboard-accessible
  - Color contrast meets WCAG AA against the dark background
  - prefers-reduced-motion: disable typewriter effects, show output instantly
  - prefers-color-scheme: respect if /theme is implemented
  - Screen reader users get the same content — output blocks are semantic HTML (paragraphs, lists, headings), not a canvas

9.3 Keyboard-only navigation

  - Tab focuses the input
  - Output links are focusable with Tab
  - Escape closes any autocomplete
  - The site is fully usable without a mouse

---

10. Content guidelines

10.1 Tone

  - Intelligent, concise, confident, slightly warm
  - Never corporate, never try-hard
  - First person but not self-absorbed
  - Technical precision without jargon for its own sake
  - Occasional dry wit is fine; forced humor is not

10.2 Length

  - Slash command outputs: 5–15 lines each (scannable, not a wall)
  - LLM responses: 2–6 sentences for simple questions
  - Everything should feel like it respects the visitor's time

10.3 Cross-references

  End outputs with "→ /command" suggestions to guide exploration. Keep to 1–3 per output. These should feel like natural next steps, not a menu.

---

11. Phased delivery

Phase 1 — Core terminal (MVP)
  - Terminal shell: header, body, input, status bar
  - Welcome message on load
  - /help, /about, /skills, /projects, /experience, /education, /journey, /contact, /links
  - /clear
  - Command history (up/down arrows)
  - Tab completion
  - Clickable commands in output
  - Responsive mobile layout
  - Mobile command chips
  - Deploy to Vercel

Phase 2 — LLM integration
  - /api/ask route with Claude API
  - Free-text input handling
  - Streaming output with typewriter effect
  - Thinking indicator
  - Rate limiting (client + server)
  - Escape to cancel stream
  - /ask explicit command

Phase 3 — Polish
  - Deep linking (?cmd= and ?q=)
  - /resume with PDF download
  - /now, /reading, /values, /uses commands
  - SEO: hidden semantic HTML, meta tags, JSON-LD
  - og:image generation (screenshot of terminal)
  - Analytics
  - Typewriter on welcome message
  - prefers-reduced-motion support

Phase 4 — Optional
  - /theme light mode
  - Easter egg commands (/sudo, /rm -rf, /hack, etc. — playful responses)
  - Sound effects (key clicks, optional, off by default)
  - Shareable command URLs with preview cards
  - Session persistence (localStorage for history across refreshes)

---

12. Easter eggs (optional, Phase 4)

These are playful hidden commands that reward curiosity:

  /sudo          "Nice try. You don't have root here."
  /rm -rf /      "I appreciate the ambition, but no."
  /vim           "You're already in Neovim, spiritually."
  /exit          "There's no exit. But there's /contact."
  /hack          "Access granted. Just kidding. Try /skills."
  /hello         "Hey. Welcome. Try /about to get started."
  /hire          Alias for /contact with added context about availability
  /coffee        "I take mine black. Let's talk: yusuf@yusufafifi.com"
  /secret        "You found this. That means you're paying attention. I like that."

---

13. Design constraints

The coding agent should follow these constraints:
  1. The terminal is the ONLY interface — no modals, no sidebars, no alternative views
  2. Do not over-style — it should feel like a real terminal, not a website pretending
  3. Output formatting uses spacing and color, never markdown rendering or rich cards
  4. Keep the input always visible and always active
  5. Slash commands are instant — no loading states for static content
  6. The LLM integration is the only network-dependent feature
  7. Mobile must work well — this is how most people will visit
  8. Everything is stateless across page loads (except optional localStorage in Phase 4)
  9. No authentication, no accounts, no cookies
  10. The site should be deployable with just ANTHROPIC_API_KEY as the only secret

---

14. Final product summary

The final site should feel like:

  Opening a terminal session with someone's career and mind.
  Discovering a person through commands, not scrolling.
  An engineer's answer to "make a personal website."

Not:
  - a generic portfolio
  - a chatbot widget
  - a novelty that gets old in 10 seconds

But:
  - fast, native, purposeful
  - technically sharp
  - instantly memorable
  - actually useful for learning about Yusuf

---

If you want, this can be turned into a stricter PRD, component breakdown, or file structure for the coding agent.
