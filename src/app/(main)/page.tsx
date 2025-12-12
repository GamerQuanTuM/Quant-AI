'use client'

import { motion } from 'framer-motion'
import { LayoutTemplate, Clock, BarChart, ArrowRight, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DashboardPage() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <motion.div
            className="space-y-8 max-w-7xl mx-auto"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
                    <p className="text-gray-400 mt-1">Welcome back, John. Ready to create?</p>
                </div>
                <Link href="/templates">
                    <Button className="bg-white text-black hover:bg-gray-200">
                        <Zap className="w-4 h-4 mr-2 fill-black" />
                        Quick Generate
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Projects', value: '12', icon: LayoutTemplate, change: '+2 this week', color: 'text-blue-500' },
                    { label: 'Words Generated', value: '15.4k', icon: BarChart, change: '+2.1k today', color: 'text-purple-500' },
                    { label: 'Credits Left', value: '150', icon: Zap, change: 'Recharges monthly', color: 'text-amber-500' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={item}
                        className="p-6 rounded-2xl bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] transition-all group relative overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500 ${stat.color}`}>
                            <stat.icon className="w-24 h-24" />
                        </div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-gray-400 group-hover:text-white transition-colors">
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">{stat.change}</span>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1 relative z-10">{stat.value}</div>
                        <div className="text-sm text-gray-500 relative z-10">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Projects */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Recent Projects</h3>
                    <Link href="/projects" className="text-sm text-primary hover:underline flex items-center gap-1">
                        View All <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { title: "LinkedIn Post Strategy", type: "Social Media", time: "2 hours ago", icon: "💼" },
                        { title: "Product Launch Email", type: "Email Marketing", time: "5 hours ago", icon: "📧" },
                        { title: "Blog Outline: AI Trends", type: "Blog Post", time: "Yesterday", icon: "📝" },
                    ].map((project, idx) => (
                        <motion.div
                            key={idx}
                            variants={item}
                            className="p-6 rounded-xl bg-[#18181b] border border-[#27272a] hover:border-primary/50 cursor-pointer transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800 text-2xl group-hover:scale-110 transition-transform duration-300">
                                    {project.icon}
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-white">
                                    <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform" />
                                </Button>
                            </div>
                            <h4 className="font-semibold text-white mb-1 group-hover:text-primary transition-colors">{project.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                                <span>{project.type}</span>
                                <span>•</span>
                                <span>{project.time}</span>
                            </div>
                            <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                                <div className="bg-primary h-full w-full" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}
