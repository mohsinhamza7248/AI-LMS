'use client'

import * as React from 'react'
import { useSignIn, useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Loader2, Phone, ShieldCheck } from 'lucide-react'

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
    <div className="relative flex min-h-screen items-center justify-center bg-[#0b0f19] p-4 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-amber-500/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md rounded-[2.5rem] border border-white/5 bg-black/40 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-10 flex flex-col items-center justify-center space-y-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-amber-500/20 text-amber-400 border border-white/10 shadow-inner">
            {verifying ? <ShieldCheck className="h-10 w-10 text-amber-400 drop-shadow-lg" /> : <Phone className="h-10 w-10 text-violet-400 drop-shadow-lg" />}
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white text-center">
            {verifying ? 'Verify Your Account' : (
              <>
                <span className="bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent">Welcome</span> back
              </>
            )}
          </h1>
          <p className="text-center text-sm font-medium text-gray-400">
            {verifying
              ? `We sent a secure code to ${phone}`
              : 'Enter your phone number to continue your journey.'}
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-400 flex items-start gap-3">
            <div className="mt-0.5">⚠️</div>
            <div>{error}</div>
          </div>
        )}

        {!verifying ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="phone" className="text-sm font-bold text-gray-300">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white placeholder-gray-500 transition-colors focus:border-violet-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !phone}
              className="group mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-amber-500 px-4 py-4 text-base font-bold text-white shadow-[0_0_40px_-10px_rgba(139,92,246,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Continue securely
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifySubmit} className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="code" className="text-sm font-bold text-gray-300">
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
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center text-3xl font-black tracking-[0.5em] text-white transition-colors focus:border-amber-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading || code.length < 6}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-4 text-base font-bold text-white shadow-[0_0_40px_-10px_rgba(245,158,11,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
              {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
              Verify & Sign In
            </button>
            
            <button
              type="button"
              onClick={() => {
                setVerifying(false)
                setCode('')
                setError('')
              }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Use a different number
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
