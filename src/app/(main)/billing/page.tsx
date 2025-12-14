'use client'

import { motion } from 'framer-motion'
import { Check, Zap, CreditCard, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

const plans = [
    {
        name: 'Starter',
        price: '$5',
        credits: '500',
        features: ['Access to all templates', 'Basic support', 'Save to projects'],
        popular: false
    },
    {
        name: 'Pro',
        price: '$15',
        credits: '2000',
        features: ['Everything in Starter', 'Priority generation', 'Advanced tone controls', 'Priority support'],
        popular: true
    },
    {
        name: 'Agency',
        price: '$49',
        credits: '10,000',
        features: ['Everything in Pro', 'Team collaboration', 'API Access', 'Dedicated account manager'],
        popular: false
    }
]

export default function BillingPage() {
    return (
        <div className="space-y-10 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold tracking-tight text-foreground">Upgrade your creativity</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                    Pay as you go. No hidden fees. Purchase credits to keep generating amazing content.
                </p>
            </div>

            {/* Credit Status Card */}
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-500/5 blur-3xl pointer-events-none" />
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Zap className="w-8 h-8 text-white fill-white" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-indigo-500 mb-1">Current Balance</div>
                        <div className="text-4xl font-bold text-foreground">150 <span className="text-lg font-normal text-muted-foreground">credits</span></div>
                        <p className="text-muted-foreground text-sm mt-1">~15 generations remaining</p>
                    </div>
                </div>
                <Button className="bg-background text-foreground hover:bg-accent font-semibold px-8 h-12 relative z-10 border border-input shadow-sm">
                    Auto-recharge Settings
                </Button>
            </div>

            {/* Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan, i) => (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`relative p-8 rounded-2xl border flex flex-col ${plan.popular ? 'bg-card border-primary shadow-lg shadow-primary/5' : 'bg-card border-border'}`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                Most Popular
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-foreground">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mt-2">
                                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                                <span className="text-muted-foreground">/ pack</span>
                            </div>
                            <div className="text-primary font-medium mt-2 text-sm">{plan.credits} Credits</div>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <Check className="w-4 h-4 text-primary mt-0.5" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Button
                            className={`w-full h-11 ${plan.popular ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'}`}
                        >
                            Purchase Now
                        </Button>
                    </motion.div>
                ))}
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-8 border-t border-border">
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Secure Payment
                </div>
                <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Stripe Integration
                </div>
            </div>
        </div>
    )
}
