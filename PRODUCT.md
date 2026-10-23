# Product

## Register

brand

## Users

Engineers, researchers, recruiters, founders, and collaborators: anyone who receives a link to yusufafifi.com. They arrive cold (often on mobile from a shared link), spend 30 seconds to a few minutes, and leave knowing who Yusuf is, what he works on, and how to reach him.

## Product Purpose

A researcher-style personal homepage, in the tradition of academic lab and faculty pages. Content comes first and the design stays quiet. Each section is a real route, and its heading is written as a directory (`/projects`). Success: within a few seconds a visitor knows Yusuf's current affiliation and work and can find projects, the CV, and contact details.

## Brand Personality

Intelligent, concise, confident, slightly warm. Academic without being stuffy. Never corporate, never try-hard.

## Anti-references

- Startup landing pages: hero gradients, cards, big CTAs, animated sections
- Template portfolios with skill bars and icon grids
- Anything that makes the visitor work to find the CV or email

## Design Principles

1. **Typography does the work.** Serif body, monospace only for directory headings and metadata. No cards, no shadows, no decoration.
2. **Directories as structure.** Navigation and section headings use `/name`, and every top-level directory is a real URL.
3. **One column, readable measure.** About 44rem wide, generous spacing, works the same on a phone.
4. **Content lives in one place.** `lib/content.ts` is the single source; pages only lay it out.
5. **Static and fast.** Pages are static; the only client-heavy page is `/ask`, an opt-in chat with an AI version of Yusuf that answers strictly from `lib/content.ts`.

## Accessibility & Inclusion

WCAG AA contrast in both light and dark themes. Semantic headings and lists, visible focus outlines, and an `aria-current` marker on the active nav item. Respects `prefers-reduced-motion`.
