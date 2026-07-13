import type { Metadata } from 'next'
import Link from 'next/link'
import { RESUME_PDF_DOWNLOAD, RESUME_PDF_HREF } from '@/lib/resume'

export const metadata: Metadata = {
  title: 'Resume — Yusuf Afifi',
  description:
    'Yusuf Afifi — MEng EECS @ Berkeley, visual computing. Research fellow at Principle; building Warply. Experience at Amazon Prime Video and Angel Lane Partners.',
}

/**
 * Conventional, scrollable resume page — the escape hatch for visitors who
 * won't drive the terminal. Same facts as the /experience, /education,
 * /projects, and /contact terminal commands.
 */
export default function ResumePage() {
  return (
    <div className="min-h-dvh bg-terminal-bg text-terminal-fg font-mono">
      <div className="mx-auto max-w-[72ch] px-5 py-10 sm:py-14 text-[13px] sm:text-[14px] leading-relaxed">
        {/* Top bar */}
        <nav className="flex items-center justify-between gap-3 mb-10 text-[12px]">
          <Link
            href="/"
            className="text-terminal-dim hover:text-terminal-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal-accent rounded-sm"
          >
            &larr; back to terminal
          </Link>
          <a
            href={RESUME_PDF_HREF}
            download={RESUME_PDF_DOWNLOAD}
            className="shrink-0 px-3 py-1.5 rounded border text-terminal-accent hover:bg-terminal-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal-accent"
            style={{ borderColor: 'var(--terminal-border)' }}
          >
            download pdf
          </a>
        </nav>

        {/* Identity */}
        <header className="mb-10">
          <h1 className="text-terminal-green text-[20px] sm:text-[24px] font-bold">
            Yusuf Afifi
          </h1>
          <p className="text-terminal-dim mt-1">
            MEng EECS @ Berkeley &middot; visual computing &middot; SWE/AI &middot; San Francisco, CA
          </p>
          <ul className="mt-4 space-y-1">
            <ContactRow label="Email">
              <ExtLink href="mailto:yusuf.afifi@gmail.com">yusuf.afifi@gmail.com</ExtLink>
              {' · '}
              <ExtLink href="mailto:afifi@berkeley.edu">afifi@berkeley.edu</ExtLink>
            </ContactRow>
            <ContactRow label="Phone">
              <ExtLink href="tel:+447717399868">+44 7717 399868</ExtLink>
            </ContactRow>
            <ContactRow label="GitHub">
              <ExtLink href="https://github.com/afifi-yusuf">github.com/afifi-yusuf</ExtLink>
            </ContactRow>
            <ContactRow label="LinkedIn">
              <ExtLink href="https://linkedin.com/in/yusuf-afif1/">
                linkedin.com/in/yusuf-afif1
              </ExtLink>
            </ContactRow>
          </ul>
        </header>

        <Section title="Experience">
          <Entry
            heading="Research Fellow"
            meta="Principle · 2026 — present · San Francisco"
          >
            <p>
              RL post-training on prediction market environments — adversarial
              multi-actor simulation for strategic decision-making.{' '}
              <ExtLink href="https://futureprinciple.com">futureprinciple.com</ExtLink>
            </p>
          </Entry>
          <Entry
            heading="Software Development Engineer Intern — Gen AI"
            meta="Amazon Prime Video · Jun — Sep 2025 · London"
          >
            <p>
              Text-to-SQL agent for SVOD accounting: RAG on AWS Bedrock (Claude), Kendra
              index, Redshift; cut ad-hoc query time about 75%. Shipped internal React +
              Lambda/WebSocket API Gateway chat UI; AWS CDK &amp; CI/CD; IAM
              least-privilege; CloudWatch dashboards and alarms; 200+ weekly users
              globally.
            </p>
          </Entry>
          <Entry
            heading="Technology Summer Analyst — Data / ML for Finance"
            meta="Angel Lane Partners (ALP Tech) · Jun — Aug 2024 · London"
          >
            <p>
              GreenGuard climate risk: physical, transition, and macro exposure; KNN
              &amp; K-means for missing data; MATLAB &amp; Python — Merton default, VAR
              scenarios; static frontend for client stress-test views.
            </p>
          </Entry>
        </Section>

        <Section title="Education">
          <Entry
            heading="University of California, Berkeley"
            meta="2026–2027 · San Francisco, CA"
          >
            <p>
              Master of Engineering (MEng) — EECS, concentration in visual computing.
            </p>
          </Entry>
          <Entry
            heading="University College London (UCL)"
            meta="Sep 2023 — Jun 2026 · London, UK · First Class"
          >
            <p>
              BSc (Hons) Computer Science — minor in Applied Mathematics. Teaching
              Assistant: COMP0002 (C), COMP0004 (Java), ENGF0034 (Python), COMP0016
              Systems. Executive Quant Ventures, UCL Fintech Society.
            </p>
          </Entry>
          <Entry heading="JESS Dubai" meta="Aug 2021 — May 2023 · Dubai, UAE">
            <p>International Baccalaureate Diploma Programme — 43 / 45.</p>
          </Entry>
        </Section>

        <Section title="Projects & Research">
          <Entry heading="Warply — open-source control plane for AI endpoints">
            <p>
              Python SDK to launch, inspect, and optimize OpenAI-compatible model
              serving on GPUs — disaggregated prefill/decode pools, KV cache routing,
              portable DeploymentPlan across clouds and backends.{' '}
              <ExtLink href="https://warply.ai">warply.ai</ExtLink>
              {' · '}
              <ExtLink href="https://github.com/warply-ai/warply">GitHub</ExtLink>
            </p>
          </Entry>
          <Entry heading="Petals — AI health & wellness (iOS)">
            <p>
              Apple Foundation Models on-device with a RAG layer on HealthKit.
              Instruction-tuned &ldquo;Petal&rdquo; chatbot, meditations, journaling,
              wellness plans — privacy-first, Neural Engine inference.{' '}
              <ExtLink href="https://apps.apple.com/us/app/petals-ai/id6749387193">
                App Store
              </ExtLink>
            </p>
          </Entry>
          <Entry heading="StarPlex — startup intelligence platform">
            <p>
              2nd place, Perplexity London Hackathon. AI validates ideas and surfaces
              markets, competitors, VCs, and demographics on an interactive 3D globe.
              Next.js, FastAPI, Perplexity Sonar.{' '}
              <ExtLink href="https://starplex.app">starplex.app</ExtLink>
            </p>
          </Entry>
          <Entry heading="PolyWhisper — Polymarket from live audio (Chrome)">
            <p>
              Extension that listens to podcasts, YouTube, Zoom, and other audio —
              Deepgram realtime transcription and Grok topic detection spot when
              prediction markets come up; sidebar shows live Polymarket odds.{' '}
              <ExtLink href="https://chromewebstore.google.com/detail/polywhisper/cjjdmnjmlcddlconidalbdlblkcliken">
                Chrome Web Store
              </ExtLink>
            </p>
          </Entry>
          <Entry heading="ReadingStar — accessibility karaoke (Windows)">
            <p>
              With Intel &amp; the National Autistic Society: offline speech-to-text,
              lyric alignment, scoring; React Native Windows + FastAPI, Whisper,
              OpenVINO on NPU. National school rollout; featured by Intel as the first
              education NPU app.{' '}
              <ExtLink href="https://www.intel.com/content/www/us/en/customer-spotlight/stories/university-college-london-customer-story.html">
                Intel showcase
              </ExtLink>
            </p>
          </Entry>
          <Entry heading="ML for fluid dynamics (research)">
            <p>
              Undergrad research with an Imperial College Research Associate:
              convolutional autoencoder for shallow-water simulation, LSTM in latent
              space, TensorFlow.
            </p>
          </Entry>
        </Section>

        <Section title="Skills">
          <ul className="space-y-1">
            <SkillRow label="Languages">Python · TypeScript · Swift · C · Java · MATLAB · SQL</SkillRow>
            <SkillRow label="AI / ML">
              RAG · agents · inference optimization · GPU kernels · TensorFlow · Whisper · OpenVINO
            </SkillRow>
            <SkillRow label="Cloud">
              AWS (Bedrock, Lambda, CDK, Redshift, Kendra, CloudWatch) · CI/CD
            </SkillRow>
            <SkillRow label="Web">React · Next.js · FastAPI · React Native</SkillRow>
          </ul>
        </Section>

        <footer className="mt-12 pt-6 border-t text-[12px] text-terminal-dim" style={{ borderColor: 'var(--terminal-border)' }}>
          <p>
            Prefer the interactive version?{' '}
            <Link
              href="/"
              className="text-terminal-accent underline hover:text-terminal-link transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal-accent rounded-sm"
            >
              Open the terminal
            </Link>{' '}
            and type a command — or just ask a question.
          </p>
        </footer>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-terminal-green font-bold mb-4">{title}</h2>
      {children}
    </section>
  )
}

function Entry({
  heading,
  meta,
  children,
}: {
  heading: string
  meta?: string
  children: React.ReactNode
}) {
  return (
    <article className="mb-5 last:mb-0">
      <h3 className="text-terminal-fg font-bold">{heading}</h3>
      {meta && <p className="text-terminal-dim text-[12px] sm:text-[13px]">{meta}</p>}
      <div className="mt-1 text-terminal-fg [&_p]:m-0">{children}</div>
    </article>
  )
}

function ContactRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="text-terminal-dim w-[7ch] shrink-0">{label}</span>
      {children}
    </li>
  )
}

function SkillRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3 flex-wrap sm:flex-nowrap">
      <span className="text-terminal-dim w-[10ch] shrink-0">{label}</span>
      <span className="min-w-0">{children}</span>
    </li>
  )
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="text-terminal-link underline hover:text-terminal-green transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal-link rounded-sm"
    >
      {children}
    </a>
  )
}
