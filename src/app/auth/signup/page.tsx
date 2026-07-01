'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Zap, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof schema>

// Same tokens as the marketing page — move to globals.css when you're ready
// to share them app-wide.
const theme = {
  '--paper': '#FAF7F1',
  '--ink': '#171B24',
  '--ink-soft': '#4B5566',
  '--cold': '#5B7A99',
  '--warm': '#E0A02E',
  '--hot': '#E0632E',
  '--won': '#4C8B6C',
  '--font-display': "'Fraunces', ui-serif, Georgia, serif",
  '--font-mono': "'JetBrains Mono', ui-monospace, Menlo, monospace",
} as React.CSSProperties

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signUp({
      ...data,
      options: { emailRedirectTo: `${location.origin}/dashboard` },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[var(--paper)] p-4 text-[var(--ink)]"
        style={theme}
      >
        <div className="w-full max-w-sm space-y-5 text-center">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#4C8B6C]/15">
              <CheckCircle2 className="h-8 w-8" style={{ color: 'var(--won)' }} />
            </div>
          </div>
          <h1
            className="text-2xl font-semibold"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Check your email
          </h1>
          <p className="text-sm text-[var(--ink-soft)] sm:text-base">
            We sent a confirmation link to your email. Click it to activate
            your account.
          </p>
          <Button
            variant="outline"
            asChild
            className="w-full border-[var(--ink)]/20"
          >
            <Link href="/auth/login">Back to sign in</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[var(--paper)] p-4 text-[var(--ink)] sm:p-6"
      style={theme}
    >
      <div className="w-full max-w-sm space-y-7 sm:space-y-8">
        <div className="text-center">
          <Link href="/" className="mb-6 inline-flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--ink)]">
              <Zap className="h-5 w-5 text-[var(--paper)]" />
            </div>
            <span
              className="text-xl font-semibold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              LeadPilot
            </span>
          </Link>
          <h1
            className="text-2xl font-semibold"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Create your account
          </h1>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            Start managing leads for free
          </p>
        </div>

        <div className="space-y-4 rounded-xl border border-[var(--ink)]/10 bg-white/70 p-6 shadow-sm">
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-[#E0632E]/30 bg-[#E0632E]/10 px-4 py-3 text-sm"
              style={{ color: 'var(--hot)' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="border-[var(--ink)]/15 focus-visible:ring-[var(--hot)]"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs" style={{ color: 'var(--hot)' }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Min. 6 characters"
                className="border-[var(--ink)]/15 focus-visible:ring-[var(--hot)]"
                aria-invalid={!!errors.password}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs" style={{ color: 'var(--hot)' }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full gap-2 bg-[var(--hot)] hover:bg-[var(--hot)]/90"
              disabled={loading}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Create account
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--ink-soft)]">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="font-medium underline-offset-2 hover:underline"
            style={{ color: 'var(--hot)' }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
