# Add UC Berkeley MEng EECS when ready

**When:** After the UCL bachelor’s is finished and it’s accurate to publish graduate study (e.g. from **May 2026** onward, or whenever you actually start at Berkeley).

**Files to update**

1. `lib/commands.ts` — `/about` subtitle and Berkeley paragraph, `/education` Berkeley block at top, `/now` “Berkeley MEng” section above Dissertation, `WELCOME_SEGMENTS` dim line, `/contact` location if you move to SF, and `YUSUF_SYSTEM_PROMPT` (IDENTITY, CONTACT location, EDUCATION, CURRENT FOCUS “Graduate study” paragraph, “When answering”, Rules bullet).
2. `app/layout.tsx` — `metadata` / Open Graph / Twitter titles, `jsonLd.jobTitle`, `jsonLd.description`.

**Quick restore**

- Search the git history for commit message `add berkeley` or diff against that commit for the exact strings.
- Intended public copy (adjust dates if needed):
  - **Subtitle / welcome:** MEng EECS @ Berkeley · visual computing · SWE/AI · based in SF (welcome line historically lowercase: `meng eecs @ berkeley · visual computing · swe/ai · sf`).
  - **About:** UC Berkeley — Master of Engineering (MEng) in EECS, concentration in visual computing, 2026–2027 (then UCL bachelor’s block as today).
  - **Education:** UC Berkeley MEng EECS, visual computing, 2026–2027 · based in San Francisco, CA — then UCL, then JESS.
  - **Now:** Berkeley MEng block (MEng in EECS, visual computing, 2026–2027, Based in SF) above Dissertation.
  - **System prompt:** Reinstate Berkeley as current graduate program, SF for “based”, and the thesis-vs-interests rule that mentions Berkeley MEng when relevant.

**Optional:** If `afifi-intelligence.md` should match the site, align location and education there too when you publish Berkeley.
