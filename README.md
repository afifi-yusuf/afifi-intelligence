# afifi-intelligence

Personal site for [yusufafifi.com](https://yusufafifi.com): a plain, academic-style homepage. Sections are routes, and their headings are written as directories (`/about`, `/projects`, `/experience`, `/reading`, `/cv`, `/ask`). `/ask` is a small chat with an AI version of me, streamed from a Groq-hosted model.

## Stack

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript**
- **Tailwind CSS v4**
- Newsreader (serif body) and IBM Plex Mono (directory headings, metadata) via `next/font`
- **Vercel** for hosting and analytics
- **Groq SDK** for `/ask` (default model `qwen/qwen3.8-27b`)
- Every page is static except the `/api/ask` endpoint; no database

## Getting started

```bash
pnpm install
cp .env.example .env   # fill in GROQ_API_KEY (only /ask needs it)
pnpm dev       # http://localhost:3000
pnpm build     # production build
pnpm start     # serve production build
```

## Layout

```
app/
  layout.tsx           fonts, metadata, JSON-LD, shared header and footer
  page.tsx             /about (home): bio, /now, selected projects
  projects/page.tsx    /projects
  experience/page.tsx  /experience, /education, /teaching
  reading/page.tsx     /reading
  cv/page.tsx          /cv: contact, condensed CV, PDF download
  ask/                 /ask: chat page (ask-client.tsx streams from /api/ask)
  api/ask/route.ts     origin check, per-IP rate limit, Groq streaming
  opengraph-image.tsx  OG card
components/site/
  SiteHeader.tsx       name and directory nav (active route underlined)
  primitives.tsx       Dir heading, Section, A, LinkRow, SiteFooter
  Publications.tsx     paper list (title, authors, venue, links)
lib/
  content.ts           all site copy: profile, publications, projects, hackathons, experience, education, reading, skills
  ask-prompt.ts        system prompt for /ask, generated from content.ts
  resume.ts            resume PDF path
```

To edit content, change `lib/content.ts`. Pages only handle layout, and the `/ask` prompt is rebuilt from the same data, so the chat stays in sync.

The home page has a plain GET form that sends visitors to `/ask?q=...`; the page answers that question on load.

`/about` redirects to `/` and `/resume` redirects to `/cv` (see `next.config.mjs`).

## Design

Colors live as tokens at the top of `app/globals.css`: warm paper background, near-black ink, Berkeley blue links, and a gold accent on the `/` of each directory heading. Dark mode follows `prefers-color-scheme`.
