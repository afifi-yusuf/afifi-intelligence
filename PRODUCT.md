# Product

## Register

brand

## Users

Engineers, recruiters, founders, and collaborators — anyone who receives a link to yusufafifi.com. They arrive cold (often on mobile via a shared link), spend 30 seconds to a few minutes, and leave with an impression of Yusuf. Two distinct groups: technical visitors who get the terminal instantly, and non-technical visitors (recruiters, founders) who need suggested commands to avoid CLI intimidation.

## Product Purpose

A personal website that IS a terminal: a Claude Code-style dark monospace session where slash commands surface pre-written content (/about, /projects, /experience, ...) and free-text questions stream from an LLM prompted to answer as Yusuf. Success: within 3 seconds a visitor understands this person builds tools and cares about craft, and knows what to do next without CLI knowledge. The site is the portfolio artifact — proof of craft, not a container for it.

## Brand Personality

Intelligent, concise, confident, slightly warm. Never corporate, never try-hard. Technically native — it should feel like a real terminal, not a website wearing a terminal skin. Occasional dry wit; forced humor is out.

## Anti-references

- A gimmick or toy that gets old in 10 seconds
- A generic portfolio with a terminal skin (cards, sidebars, modals, scroll-jacking)
- A chatbot widget bolted onto a resume
- Anything intimidating to non-engineers — suggested commands and mobile chips must make the next action obvious
- Slow or laggy anything; slash commands are instant, only the LLM touches the network

## Design Principles

1. **The terminal is the only interface.** No modals, no sidebars, no alternative views. Output formatting uses spacing and color, never rich cards.
2. **Discovery through commands, not scrolling.** Content is earned by intent; cross-references (`→ /command`) guide exploration.
3. **Instant where possible, streaming where honest.** Static commands render immediately; only LLM answers stream.
4. **Mobile visitors are the majority.** Shared links open on phones; chips and tap targets carry the CLI experience there.
5. **Respect the visitor's time.** Outputs are 5–15 scannable lines; LLM answers are 2–6 sentences.

## Accessibility & Inclusion

WCAG AA contrast against the dark background. Terminal body is an aria-live region so screen readers announce output. Fully keyboard-navigable (input, links, completions). `prefers-reduced-motion` disables typewriter/boot animation and shows output instantly. Semantic HTML output (not canvas), hidden server-rendered content for crawlers and screen readers.
