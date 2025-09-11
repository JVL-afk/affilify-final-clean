"use client"

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

function SignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const plan = searchParams.get('plan')
    setSelectedPlan(plan)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // If user selected a paid plan, redirect to Stripe checkout
        if (selectedPlan === 'pro' || selectedPlan === 'enterprise') {
          // Create Stripe checkout session
          const checkoutResponse = await fetch('/api/stripe/create-checkout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              plan: selectedPlan,
              email: formData.email
            }),
          })
          
          const checkoutData = await checkoutResponse.json()
          
          if (checkoutResponse.ok && checkoutData.url) {
            // Redirect to Stripe checkout
            window.location.href = checkoutData.url
          } else {
            // If checkout fails, still go to dashboard but show upgrade prompt
            router.push('/dashboard?upgrade=' + selectedPlan)
          }
        } else {
          // Free plan - go directly to dashboard
          router.push('/dashboard')
        }
      } else {
        setError(data.error || 'Failed to create account')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return 'Weak'
    if (password.length < 10) return 'Medium'
    return 'Strong'
  }

  const getPasswordStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Weak': return 'text-red-400'
      case 'Medium': return 'text-yellow-400'
      case 'Strong': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      {/* Background Logo */}
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center space-x-2 text-white font-bold text-xl hover:text-orange-400 transition-colors">
          <span className="text-orange-500">⚡</span>
          <span>AFFILIFY</span>
        </Link>
      </div>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <span className="text-orange-500 text-4xl">⚡</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-gray-300">Start your affiliate marketing journey today</p>
          
          {/* Plan Selection Display */}
          {selectedPlan && (
            <div className="mt-4 bg-orange-500/20 border border-orange-500/50 rounded-lg p-4">
              <p className="text-orange-200 text-sm">
                🎯 You selected the <span className="font-bold text-orange-100 capitalize">{selectedPlan} Plan</span>
              </p>
              <p className="text-orange-300 text-xs mt-1">
                {selectedPlan === 'pro' ? 'After signup, you\'ll be redirected to secure payment' : 
                 selectedPlan === 'enterprise' ? 'After signup, you\'ll be redirected to secure payment' : 
                 'You\'ll get instant access to all free features'}
              </p>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {formData.password && (
              <p className={`text-sm mt-2 ${getPasswordStrengthColor(getPasswordStrength(formData.password))}`}>
                Password strength: {getPasswordStrength(formData.password)}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start space-x-3">
            <input
              id="terms"
              type="checkbox"
              className="mt-1 w-4 h-4 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500 focus:ring-2"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            <label htmlFor="terms" className="text-sm text-gray-300">
              I agree to the{' '}
              <Link href="/terms" className="text-orange-400 hover:text-orange-300 underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-orange-400 hover:text-orange-300 underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="text-center mt-8">
          <p className="text-gray-300">
            Already have an account?{' '}
            <Link href="/login" className="text-orange-400 hover:text-orange-300 font-semibold">
              Sign in
            </Link>
          </p>
        </div>

        {/* Free Plan Features */}
        <div className="mt-12 bg-white/5 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            🎉 Free Basic Plan Includes:
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              3 AI-generated websites
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              10 website analyses
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Professional templates
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Basic analytics
            </li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-gray-400 text-sm">
          © 2025 AFFILIFY. All rights reserved.
        </p>
        <p className="text-gray-400 text-sm mt-1">
          Made with <span className="text-red-500">❤️</span> for affiliate marketers worldwide
        </p>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-orange-600 via-orange-700 to-black flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>}>
      <SignupForm />
    </Suspense>
  )
}

