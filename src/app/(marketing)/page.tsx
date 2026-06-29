import Link from 'next/link'
import { ArrowRight, CheckCircle2, Users, Kanban, Bell, BarChart3, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">LeadPilot</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild><Link href="/auth/login">Sign in</Link></Button>
            <Button asChild><Link href="/auth/signup">Get started free</Link></Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm text-muted-foreground mb-8">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Free to get started — no credit card required
        </div>
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Never lose a potential
          <span className="block text-primary">customer again.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          LeadPilot helps small businesses and freelancers organize leads, track the sales
          pipeline, and follow up at the right moment — all in one clean dashboard.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" asChild className="gap-2 text-base px-8">
            <Link href="/auth/signup">
              Start managing leads <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-base px-8">
            <Link href="/auth/login">Sign in to your account</Link>
          </Button>
        </div>
      </section>

      {/* Problem → Solution */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">The problem</p>
              <h2 className="text-3xl font-bold">Leads fall through the cracks every day</h2>
              <div className="mt-6 space-y-4">
                {[
                  'Inquiries buried in email inboxes',
                  'No system to track follow-up dates',
                  'Losing track of where leads are in the process',
                  'Forgetting to follow up costs you real money',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-muted-foreground">
                    <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 border-muted-foreground/40 flex items-center justify-center text-xs">✕</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-3">The solution</p>
              <h2 className="text-3xl font-bold">One place for every lead</h2>
              <div className="mt-6 space-y-4">
                {[
                  'All leads organized in a clean dashboard',
                  'Visual pipeline to see every stage at a glance',
                  'Automatic follow-up reminders',
                  'Track your conversion rate over time',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Everything you need, nothing you don't</h2>
          <p className="mt-4 text-muted-foreground">Built for the way small businesses actually work.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, title: 'Lead Management', desc: 'Store every contact with notes, source, and service interest in one place.' },
            { icon: Kanban, title: 'Visual Pipeline', desc: 'Drag leads through stages — New, Contacted, Proposal Sent, Won.' },
            { icon: Bell, title: 'Follow-up Alerts', desc: 'Never miss a follow-up with due-date reminders on your dashboard.' },
            { icon: BarChart3, title: 'Analytics', desc: 'See conversion rates, top lead sources, and pipeline health at a glance.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Up and running in minutes</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { step: '1', title: 'Add your leads', desc: 'Import or manually add leads with contact info, source, and service interest.' },
              { step: '2', title: 'Track progress', desc: 'Move leads through your pipeline and log notes after every interaction.' },
              { step: '3', title: 'Convert customers', desc: 'Follow-up reminders keep you on track so no deal goes cold.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                  {step}
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h2 className="text-4xl font-bold">Ready to take control of your leads?</h2>
        <p className="mt-4 text-muted-foreground">Join thousands of freelancers and small businesses growing with LeadPilot.</p>
        <Button size="lg" asChild className="mt-8 gap-2 text-base px-8">
          <Link href="/auth/signup">
            Start for free <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">LeadPilot</span>
          </div>
          Built for small businesses and freelancers.
        </div>
      </footer>
    </div>
  )
}
