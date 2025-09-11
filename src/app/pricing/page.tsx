'use client'

import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import Link from 'next/link'
import { 
  Check, 
  Crown, 
  Sparkles, 
  Zap,
  Globe,
  BarChart3,
  Users,
  Star,
  MessageSquare,
  TestTube,
  Palette,
  Shield,
  Headphones
} from 'lucide-react'

interface PlanFeature {
  name: string
  included: boolean
  icon?: React.ReactNode
}

interface Plan {
  id: string
  name: string
  description: string
  price: number
  period: string
  popular?: boolean
  features: PlanFeature[]
  cta: string
  icon: React.ReactNode
}

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Perfect for getting started with affiliate marketing',
      price: billingPeriod === 'monthly' ? 0 : 0,
      period: billingPeriod === 'monthly' ? 'month' : 'year',
      icon: <Zap className="w-6 h-6" />,
      cta: 'Start Basic Plan',
      features: [
        { name: '3 websites', included: true, icon: <Globe className="w-4 h-4" /> },
        { name: 'Basic templates (Modern, Classic, Bold)', included: true, icon: <Palette className="w-4 h-4" /> },
        { name: 'AI content generation', included: true, icon: <Sparkles className="w-4 h-4" /> },
        { name: 'Basic analytics', included: true, icon: <BarChart3 className="w-4 h-4" /> },
        { name: 'Email support', included: true, icon: <Headphones className="w-4 h-4" /> },
        { name: 'Pro templates', included: false },
        { name: 'Custom domains', included: false },
        { name: 'Advanced analytics', included: false },
        { name: 'Reviews management', included: false },
        { name: 'A/B testing', included: false }
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Advanced features for serious affiliate marketers',
      price: billingPeriod === 'monthly' ? 29 : 290,
      period: billingPeriod === 'monthly' ? 'month' : 'year',
      popular: true,
      icon: <Crown className="w-6 h-6" />,
      cta: 'Start Pro Plan',
      features: [
        { name: '10 websites', included: true, icon: <Globe className="w-4 h-4" /> },
        { name: 'All templates including Premium & Conversion Pro', included: true, icon: <Palette className="w-4 h-4" /> },
        { name: 'AI content generation', included: true, icon: <Sparkles className="w-4 h-4" /> },
        { name: 'Advanced analytics', included: true, icon: <BarChart3 className="w-4 h-4" /> },
        { name: 'Custom domains', included: true, icon: <Globe className="w-4 h-4" /> },
        { name: 'Website analysis tools', included: true, icon: <TestTube className="w-4 h-4" /> },
        { name: 'Priority support', included: true, icon: <Headphones className="w-4 h-4" /> },
        { name: 'Reviews management', included: false },
        { name: 'A/B testing', included: false },
        { name: 'API access', included: false }
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Complete solution for agencies and large businesses',
      price: billingPeriod === 'monthly' ? 99 : 990,
      period: billingPeriod === 'monthly' ? 'month' : 'year',
      icon: <Sparkles className="w-6 h-6" />,
      cta: 'Start Enterprise Plan',
      features: [
        { name: 'Unlimited websites', included: true, icon: <Globe className="w-4 h-4" /> },
        { name: 'All templates including Enterprise', included: true, icon: <Palette className="w-4 h-4" /> },
        { name: 'AI content generation', included: true, icon: <Sparkles className="w-4 h-4" /> },
        { name: 'Advanced analytics & reporting', included: true, icon: <BarChart3 className="w-4 h-4" /> },
        { name: 'Reviews management system', included: true, icon: <MessageSquare className="w-4 h-4" /> },
        { name: 'A/B testing framework', included: true, icon: <TestTube className="w-4 h-4" /> },
        { name: 'White-label options', included: true, icon: <Shield className="w-4 h-4" /> },
        { name: 'API access', included: true, icon: <Zap className="w-4 h-4" /> },
        { name: 'Team collaboration', included: true, icon: <Users className="w-4 h-4" /> },
        { name: 'Dedicated support', included: true, icon: <Headphones className="w-4 h-4" /> }
      ]
    }
  ]

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'basic':
        return 'border-gray-200'
      case 'pro':
        return 'border-purple-500 ring-2 ring-purple-500'
      case 'enterprise':
        return 'border-blue-500'
      default:
        return 'border-gray-200'
    }
  }

  const getPlanButtonVariant = (planId: string) => {
    switch (planId) {
      case 'basic':
        return 'outline'
      case 'pro':
        return 'gradient'
      case 'enterprise':
        return 'default'
      default:
        return 'outline'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform your affiliate marketing business with AI-powered tools
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingPeriod === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative ${getPlanColor(plan.id)} transition-all hover:shadow-lg`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                  plan.id === 'basic' ? 'bg-gray-100 text-gray-600' :
                  plan.id === 'pro' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="mt-4">
                  {plan.price === 0 ? (
                    <span className="text-4xl font-bold text-green-600">FREE</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </>
                  )}
                  {billingPeriod === 'yearly' && plan.price > 0 && (
                    <div className="text-sm text-green-600 font-medium">
                      Save ${(plan.price / 10 * 12) - plan.price} per year
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <Link href={plan.price === 0 ? "/signup" : `/signup?plan=${plan.id}`} className="block mb-6">
                  <Button 
                    variant={getPlanButtonVariant(plan.id) as any}
                    className="w-full"
                    size="lg"
                  >
                    {plan.price === 0 ? "Get Started Free" : plan.cta}
                  </Button>
                </Link>
                
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-200"></div>
                        )}
                      </div>
                      <div className="flex items-center flex-1">
                        {feature.icon && (
                          <span className="mr-2 text-gray-400">
                            {feature.icon}
                          </span>
                        )}
                        <span className={`text-sm ${
                          feature.included ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {feature.name}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold mb-2">Can I change my plan later?</h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                and we'll prorate any billing differences.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">
                We offer a 14-day free trial for all plans. No credit card required to get started. 
                You can explore all features and see if AFFILIFY is right for you.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. 
                All payments are processed securely through Stripe.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. Your account will remain active 
                until the end of your current billing period.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of successful affiliate marketers using AFFILIFY
          </p>
          <Link href="/signup">
            <Button size="lg" variant="gradient" className="px-8">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

