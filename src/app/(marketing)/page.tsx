import Link from 'next/link'
import { ArrowRight, CheckCircle2, Users, Kanban, Bell, BarChart3, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Design tokens for this page. Move these into globals.css as CSS variables
// (see notes) once you're happy with the palette, so the rest of the app
// (buttons, links, etc.) can share it.
const theme = {
  '--paper': '#FAF7F1', // warm off-white background
  '--ink': '#171B24', // near-black, slightly warm
  '--ink-soft': '#4B5566',
  '--cold': '#5B7A99', // new lead
  '--warm': '#E0A02E', // contacted
  '--hot': '#E0632E', // proposal sent — also our primary/CTA color
  '--won': '#4C8B6C', // closed
  '--font-display': "'Fraunces', ui-serif, Georgia, serif",
  '--font-mono': "'JetBrains Mono', ui-monospace, Menlo, monospace",
} as React.CSSProperties

const features = [
  {
    icon: Users,
    title: 'Lead management',
    desc: 'Store every contact with notes, source, and service interest in one place.',
    stage: 'cold',
  },
  {
    icon: Kanban,
    title: 'Visual pipeline',
    desc: 'Drag leads through stages — New, Contacted, Proposal sent, Won.',
    stage: 'warm',
  },
  {
    icon: Bell,
    title: 'Follow-up alerts',
    desc: 'Never miss a follow-up with due-date reminders on your dashboard.',
    stage: 'hot',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    desc: 'See conversion rates, top lead sources, and pipeline health at a glance.',
    stage: 'won',
  },
] as const

const stageColorVar: Record<string, string> = {
  cold: 'var(--cold)',
  warm: 'var(--warm)',
  hot: 'var(--hot)',
  won: 'var(--won)',
}

export default function LandingPage() {
  return (
    <div
      className="min-h-screen bg-[var(--paper)] text-[var(--ink)] antialiased"
      style={theme}
    >
      {/* Local, zero-JS animation for the hero pipeline demo. */}
      <style>{`
        @keyframes leadMove {
          0%, 18%  { left: 1%; }
          28%, 43% { left: 33%; }
          53%, 68% { left: 66%; }
          78%, 100%{ left: 97%; }
        }
        @keyframes leadColor {
          0%, 18%  { background: var(--cold); }
          28%, 43% { background: var(--warm); }
          53%, 68% { background: var(--hot); }
          78%, 100%{ background: var(--won); }
        }
        .lead-card {
          animation: leadMove 9s ease-in-out infinite, leadColor 9s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .lead-card { animation: none; left: 66%; background: var(--hot); }
        }
      `}</style>

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-[var(--ink)]/10 bg-[var(--paper)]/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--ink)]">
              <Zap className="h-4 w-4 text-[var(--paper)]" />
            </div>
            <span
              className="text-lg font-semibold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              LeadPilot
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              asChild
              className="px-2 text-sm sm:px-4 sm:text-base"
            >
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button
              asChild
              className="bg-[var(--hot)] px-3 text-sm hover:bg-[var(--hot)]/90 sm:px-4 sm:text-base"
            >
              <Link href="/auth/signup">Get started free</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p
              className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-[var(--ink-soft)]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Lead temperature, tracked automatically
            </p>
            <h1
              className="text-balance text-[clamp(2.25rem,7vw,4.5rem)] font-semibold leading-[1.05] tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Never let a lead{' '}
              <span style={{ color: 'var(--cold)' }}>go cold.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base text-[var(--ink-soft)] sm:text-lg">
              LeadPilot helps small businesses and freelancers organize leads,
              track the sales pipeline, and follow up at the right moment —
              all in one clean dashboard.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                asChild
                className="w-full gap-2 bg-[var(--hot)] text-base hover:bg-[var(--hot)]/90 sm:w-auto"
              >
                <Link href="/auth/signup">
                  Start managing leads <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full border-[var(--ink)]/20 text-base sm:w-auto"
              >
                <Link href="/auth/login">Sign in to your account</Link>
              </Button>
            </div>
          </div>

          {/* Signature element: the lead-temperature pipeline, in motion */}
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20">
            <div className="relative h-1.5 rounded-full bg-gradient-to-r from-[var(--cold)] via-[var(--warm)] to-[var(--won)] opacity-30">
              <div
                className="lead-card absolute -top-2 h-5 w-5 -translate-x-1/2 rounded-full shadow-md ring-4 ring-[var(--paper)]"
                aria-hidden="true"
              />
            </div>
            <div
              className="mt-4 flex justify-between text-[11px] font-medium uppercase tracking-wide text-[var(--ink-soft)] sm:text-xs"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <span>New</span>
              <span>Contacted</span>
              <span>Proposal</span>
              <span>Won</span>
            </div>
          </div>
        </section>

        {/* Problem → Solution */}
        <section className="bg-[var(--ink)] text-[var(--paper)]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
              <div>
                <p
                  className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cold)]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  Without a system
                </p>
                <h2
                  className="text-2xl font-semibold sm:text-3xl"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Leads fall through the cracks every day
                </h2>
                <div className="mt-6 space-y-4">
                  {[
                    'Inquiries buried in email inboxes',
                    'No system to track follow-up dates',
                    'Losing track of where leads are in the process',
                    'Forgetting to follow up costs you real money',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 text-[var(--paper)]/70"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[var(--paper)]/30 text-xs">
                        ✕
                      </span>
                      <span className="text-sm sm:text-base">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p
                  className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--won)]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  With LeadPilot
                </p>
                <h2
                  className="text-2xl font-semibold sm:text-3xl"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  One place for every lead
                </h2>
                <div className="mt-6 space-y-4">
                  {[
                    'All leads organized in a clean dashboard',
                    'Visual pipeline to see every stage at a glance',
                    'Automatic follow-up reminders',
                    'Track your conversion rate over time',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0"
                        style={{ color: 'var(--won)' }}
                      />
                      <span className="text-sm sm:text-base">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mb-12 text-center sm:mb-16">
            <h2
              className="text-2xl font-semibold sm:text-3xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="mt-3 text-[var(--ink-soft)]">
              Built for the way small businesses actually work.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, desc, stage }) => (
              <div
                key={title}
                className="rounded-xl border border-[var(--ink)]/10 bg-white/60 p-6 shadow-sm"
                style={{ borderTopWidth: 3, borderTopColor: stageColorVar[stage] }}
              >
                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${stageColorVar[stage]}1A` }}
                >
                  <Icon className="h-5 w-5" style={{ color: stageColorVar[stage] }} />
                </div>
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="text-sm text-[var(--ink-soft)]">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-[var(--ink)]/10 bg-[var(--ink)]/[0.03]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
            <div className="mb-12 text-center sm:mb-16">
              <h2
                className="text-2xl font-semibold sm:text-3xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Up and running in minutes
              </h2>
            </div>
            <div className="relative grid gap-10 sm:grid-cols-3 sm:gap-8">
              {/* connecting line, hidden on mobile */}
              <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-[var(--cold)] via-[var(--warm)] to-[var(--won)] sm:block" />
              {[
                {
                  step: '1',
                  color: 'var(--cold)',
                  title: 'Add your leads',
                  desc: 'Import or manually add leads with contact info, source, and service interest.',
                },
                {
                  step: '2',
                  color: 'var(--warm)',
                  title: 'Track progress',
                  desc: 'Move leads through your pipeline and log notes after every interaction.',
                },
                {
                  step: '3',
                  color: 'var(--won)',
                  title: 'Convert customers',
                  desc: 'Follow-up reminders keep you on track so no deal goes cold.',
                },
              ].map(({ step, color, title, desc }) => (
                <div key={step} className="relative text-center">
                  <div
                    className="relative z-10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold text-[var(--paper)]"
                    style={{ backgroundColor: color, fontFamily: 'var(--font-mono)' }}
                  >
                    {step}
                  </div>
                  <h3 className="mb-2 font-semibold">{title}</h3>
                  <p className="text-sm text-[var(--ink-soft)]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[var(--ink)] text-[var(--paper)]">
          <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
            <h2
              className="text-2xl font-semibold sm:text-4xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Ready to take control of your leads?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[var(--paper)]/70">
              Built for freelancers and small teams who want to follow up
              faster — and never lose track of a deal in progress.
            </p>
            <Button
              size="lg"
              asChild
              className="mt-8 w-full gap-2 bg-[var(--hot)] text-base hover:bg-[var(--hot)]/90 sm:w-auto"
            >
              <Link href="/auth/signup">
                Start for free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--ink)]/10 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-[var(--ink-soft)] sm:px-6">
          <div className="mb-2 flex items-center justify-center gap-2">
            <Zap className="h-4 w-4" style={{ color: 'var(--hot)' }} />
            <span
              className="font-semibold text-[var(--ink)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              LeadPilot
            </span>
          </div>
          Built for small businesses and freelancers.
        </div>
      </footer>
    </div>
  )
}
