import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail } from 'lucide-react'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SignIn() {
  const { signIn, signUp, session, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/modules'

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)

  useEffect(() => {
    if (!authLoading && session) {
      // Post-auth lands on the onboarding sequence; it forwards `from` on skip/complete
      navigate('/onboarding', { replace: true, state: { from } })
    }
  }, [session, authLoading, navigate, from])

  const validate = (): string | null => {
    if (!email.trim() || !password) return 'Email and password are required.'
    if (!EMAIL_RE.test(email)) return 'Enter a valid email address.'
    if (password.length < 8) return 'Password must be at least 8 characters.'
    return null
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }
    setError(null)
    setSubmitting(true)

    if (mode === 'signup') {
      const { error } = await signUp(email, password)
      setSubmitting(false)
      if (error) { setError(error.message); return }
      setVerificationSent(true)
    } else {
      const { error } = await signIn(email, password)
      setSubmitting(false)
      if (error) { setError(error.message); return }
      navigate('/onboarding', { replace: true, state: { from } })
    }
  }

  const switchMode = () => {
    setMode(m => (m === 'signin' ? 'signup' : 'signin'))
    setError(null)
    setVerificationSent(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-sm transition-colors ${mode === 'signup' ? 'auth-signup' : ''}`}
      >
        <AnimatePresence mode="wait">
          {verificationSent ? (
            /* ── Email verification screen ── */
            <motion.div
              key="verify"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center gap-5 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Mail className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-bold text-foreground">Check your email</p>
                <p className="text-sm text-muted-foreground">
                  We sent a verification link to{' '}
                  <span className="font-medium text-foreground">{email}</span>.
                  Click the link to confirm your account before signing in.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setVerificationSent(false)
                  setMode('signin')
                  setPassword('')
                  setError(null)
                }}
              >
                Back to sign in
              </Button>
            </motion.div>
          ) : (
            /* ── Sign in / Sign up form ── */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-8 text-center">
                <p className="text-2xl font-bold text-foreground">
                  Be <span className="text-accent italic">Informed.</span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                {error && (
                  <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="mt-2 w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={submitting}
                >
                  {submitting
                    ? mode === 'signin' ? 'Signing in…' : 'Creating account…'
                    : mode === 'signin' ? 'Sign in' : 'Create account'}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-accent underline-offset-4 hover:underline"
                >
                  {mode === 'signin' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
