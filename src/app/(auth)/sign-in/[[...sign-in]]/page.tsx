'use client'

import * as React from 'react'
import { useSignIn, useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Loader2, Phone, ShieldCheck, Mail, Lock } from 'lucide-react'
import { ParticlesBg } from '@/components/ui/ParticlesBg'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export default function SignInPage() {
  const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn()
  const { isLoaded: isSignUpLoaded, signUp, setActive: setSignUpActive } = useSignUp()
  const router = useRouter()

  const [phone, setPhone] = React.useState('')
  const [code, setCode] = React.useState('')
  const [verifying, setVerifying] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const [authMode, setAuthMode] = React.useState<'signIn' | 'signUp'>('signIn')

  async function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isSignInLoaded || !isSignUpLoaded) return

    setIsLoading(true)
    setError('')

    const digitsOnly = phone.replace(/\D/g, '')
    // Ensure we have at least a few digits for a valid number
    if (digitsOnly.length < 10) {
      setError('Please enter a valid phone number with country code (e.g., +1 for USA, +91 for India).')
      setIsLoading(false)
      return
    }

    const formattedPhone = `+${digitsOnly}`

    try {
      // 1. Try signing in only (Removing automatic sign-up as requested)
      const { supportedFirstFactors } = await signIn.create({
        identifier: formattedPhone,
      })

      const isPhoneCodeFactor = supportedFirstFactors?.find(
        (factor) => factor.strategy === 'phone_code'
      )

      if (isPhoneCodeFactor) {
        // Send the OTP
        await signIn.prepareFirstFactor({
          strategy: 'phone_code',
          phoneNumberId: (isPhoneCodeFactor as any).phoneNumberId,
        })
        setAuthMode('signIn')
        setVerifying(true)
      } else {
        // No phone code factor found
        setError('Phone number not eligible for OTP login. Please check if SMS is enabled in your Clerk dashboard.')
      }
    } catch (err: any) {
      if (err.errors?.[0]?.code === 'form_identifier_not_found') {
        setError('No account found with this phone number.')
      } else if (err.errors?.[0]?.code === 'form_param_format_invalid') {
        setError('Invalid phone number format. Ensure "Phone number" is enabled in Clerk Dashboard > User & Authentication.')
      } else {
        setError(err.errors?.[0]?.longMessage || 'An error occurred during sign in. Make sure SMS is enabled in Clerk dashboard.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerifySubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isSignInLoaded || !isSignUpLoaded) return

    setIsLoading(true)
    setError('')

    try {
      if (authMode === 'signIn') {
        // Verify sign in
        const result = await signIn.attemptFirstFactor({
          strategy: 'phone_code',
          code,
        })

        if (result.status === 'complete') {
          await setSignInActive({ session: result.createdSessionId })
          router.push('/dashboard')
        } else {
          setError('Incomplete verification step.')
        }
      } else {
        // Verify sign up
        const result = await signUp.attemptPhoneNumberVerification({
          code,
        })

        if (result.status === 'complete') {
          await setSignUpActive({ session: result.createdSessionId })
          router.push('/dashboard')
        } else {
          setError('Incomplete verification step.')
        }
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || 'Invalid OTP code')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4 overflow-hidden">
      <ParticlesBg />

      {/* Decorative Blur and Gradients */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[120px] -z-10 animate-pulse duration-[10s]" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-secondary/15 blur-[120px] -z-10 animate-pulse duration-[8s]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="mb-8 flex flex-col items-center">
          <Link href="/" className="flex h-20 w-40 items-center justify-center transition-transform hover:scale-105 duration-300 cursor-pointer">
            <img src="/logo.png" alt="Logo" className="h-full w-full object-contain" />
          </Link>
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative">
          {/* Subtle line decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-50" />

          <div className="mb-10 flex flex-col items-center justify-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-inner group">
              {verifying ? (
                <ShieldCheck className="h-8 w-8 text-primary drop-shadow-[0_0_8px_rgba(255,102,0,0.4)] group-hover:scale-110 transition-transform" />
              ) : (
                <Phone className="h-8 w-8 text-primary drop-shadow-[0_0_8px_rgba(255,102,0,0.4)] group-hover:scale-110 transition-transform" />
              )}
            </div>

            <div className="space-y-1.5 text-center">
              <Badge variant="outline" className="mb-2 rounded-full border-primary/30 bg-primary/5 text-primary text-[10px] uppercase tracking-widest font-bold px-3 py-0.5">
                {verifying ? 'Security' : 'Authentication'}
              </Badge>
              <h1 className="text-3xl font-black tracking-tight text-foreground">
                {verifying ? 'Verify Identity' : (
                  <>
                    <span className="text-gradient-primary">Welcome</span> Back
                  </>
                )}
              </h1>
              <p className="text-sm font-medium text-muted-foreground/80 max-w-[260px] mx-auto leading-relaxed">
                {verifying
                  ? `Enter the 6-digit code sent to ${phone}`
                  : 'Enter your phone number to continue your learning journey.'}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-8 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive flex items-start gap-4 animate-in fade-in zoom-in duration-300">
              <div className="mt-0.5 text-lg">⚠️</div>
              <div className="flex-1">{error}</div>
            </div>
          )}

          {!verifying ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">
                  Phone Number
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground/50 group-focus-within:text-primary transition-colors">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+91 000 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-border/60 bg-muted/5 pl-11 pr-5 py-4 text-sm text-foreground placeholder-muted-foreground/40 transition-all focus:border-primary/50 focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/5"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !phone}
                className="group mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-4 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              <div className="mt-8 flex items-center justify-center gap-2">
                <div className="h-px flex-1 bg-border/40" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 px-2">Safe & Secure</span>
                <div className="h-px flex-1 bg-border/40" />
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifySubmit} className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="code" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">
                  Verification Code
                </label>
                <div className="relative">
                  <input
                    id="code"
                    type="text"
                    maxLength={6}
                    placeholder="000 000"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-border/60 bg-muted/5 px-5 py-4 text-center text-3xl font-black tracking-[0.5em] text-foreground transition-all focus:border-secondary/50 focus:bg-background focus:outline-none focus:ring-4 focus:ring-secondary/5"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || code.length < 6}
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-secondary px-4 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
              >
                {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                Confirm Code
              </button>

              <button
                type="button"
                onClick={() => {
                  setVerifying(false)
                  setCode('')
                  setError('')
                }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-muted-foreground/60 transition-colors hover:bg-muted/10 hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Change Phone Number
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-[11px] font-medium text-muted-foreground/50">
          By continuing, you agree to our <span className="underline hover:text-primary transition-colors cursor-pointer">Terms of Service</span> and <span className="underline hover:text-primary transition-colors cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  )
}
