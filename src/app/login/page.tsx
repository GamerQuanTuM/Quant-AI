'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { Mail, Lock } from 'lucide-react'
import { useActionState, useState, startTransition, useEffect } from 'react'
import axios from 'axios'
import { z } from 'zod'
import { useRouter } from 'next/navigation'

const loginSchema = z.object({
    email: z.email({
        message: "Invalid email address",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters long",
    }),
});

async function loginAction(prevState: any, credentials: unknown) {
    const validatedFields = loginSchema.safeParse(credentials)

    if (!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.issues[0].message,
        }
    }

    try {
        const res = await axios.post('/api/login', credentials)
        return { success: true, data: res.data }
    } catch (err: any) {
        return { success: false, error: err.response?.data?.error || 'Login failed' }
    }
}

export default function LoginPage() {
    const router = useRouter()
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    })

    const [state, formAction] = useActionState(loginAction, {
        success: false,
        error: null
    })

    const handleSubmit = () => {
        startTransition(() => {
            formAction(credentials)
        })
    }

    useEffect(() => {
        if (state.success) {
            localStorage.setItem('token', state.data.token)
            localStorage.setItem('userId', state.data.id)
            router.push('/')
        }
    }, [state.success, router])

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
            {/* Background Gradients/Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-full max-w-md p-8 mx-4"
            >
                <div className="glass rounded-2xl border border-white/5 p-8 shadow-2xl space-y-8 backdrop-blur-xl">
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 border border-primary/20">
                            <Lock className="w-6 h-6" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h1>
                        <p className="text-muted-foreground">Sign in to your dashboard</p>
                    </div>

                    <form
                        className="space-y-6"
                        action={handleSubmit}
                        onSubmit={(e) => {
                            e.preventDefault()
                            handleSubmit()
                        }}
                    >
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1" htmlFor="email">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="hello@example.com"
                                        value={credentials.email}
                                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-300 ml-1" htmlFor="password">Password</label>
                                    <Link href="#" className="text-xs text-primary hover:text-primary/80">Forgot?</Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={credentials.password}
                                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <Button className="w-full h-11 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" size="lg">
                            Sign In
                        </Button>
                    </form>

                    {state.error && (
                        <p className="text-red-400 text-center text-sm pt-2">{state.error}</p>
                    )}

                    {state.success && (
                        <p className="text-green-400 text-center text-sm pt-2">Login successful!</p>
                    )}

                    <div className="text-center text-sm text-muted-foreground pt-2">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-primary hover:text-primary/80 font-medium hover:underline underline-offset-4 transition-colors">
                            Sign up now
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
