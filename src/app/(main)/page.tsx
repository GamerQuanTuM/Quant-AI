'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { LayoutTemplate, BarChart, ArrowRight, Zap, FileText, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axios-instance'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useSocket } from '@/hooks/use-socket'
import { Project } from '../../../generated/prisma'

type Analytics = {
    totalWords: string
    totalProjects: string
    totalCredits: string
    projectGrowth: string
    wordGrowth: string
}

export default function DashboardPage() {
    const { socket, connected } = useSocket();

    const [isLoading, setIsLoading] = useState(true)
    const [analytics, setAnalytics] = useState<Analytics>({
        totalWords: '0',
        totalProjects: '0',
        totalCredits: '0',
        projectGrowth: '0',
        wordGrowth: '0'
    })
    const [recentProjects, setRecentProjects] = useState<Project[]>([])
    const { user } = useAuth()
    const router = useRouter()

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

    const fetchAnalytics = async () => {
        try {
            const response = await axiosInstance.get('/api/analytics')
            const data = await response.data
            setAnalytics(data)
        } catch (error) {
            console.error('Failed to fetch analytics:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchRecentProjects = async () => {
        try {
            const response = await axiosInstance.get('/api/recent-projects')
            const data = response.data
            setRecentProjects(data)
        } catch (error) {
            console.error('Failed to fetch recent projects:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchAnalytics()
        fetchRecentProjects()
    }, [])

    useEffect(() => {
        if (!connected) return;
        if (!socket) return;
        if (!user?.id) return;

        socket.emit("join", { userId: user.id });
    }, [socket, user?.id, connected]);


    return (
        <motion.div
            className="space-y-8 max-w-7xl mx-auto"
            variants={container}
            initial="hidden"
            animate="show"
        >

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
                    <p className="text-muted-foreground mt-1">Welcome back, {user?.name}. Ready to create?</p>
                </div>
                <Link href="/templates">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Zap className="w-4 h-4 mr-2 fill-current" />
                        Quick Generate
                    </Button>
                </Link>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Projects', value: analytics.totalProjects, icon: LayoutTemplate, change: `${analytics.projectGrowth} this week`, color: 'text-blue-500' },
                    { label: 'Words Generated', value: analytics.totalWords, icon: BarChart, change: `${analytics.wordGrowth} today`, color: 'text-purple-500' },
                    { label: 'Credits Left', value: analytics.totalCredits, icon: Zap, change: 'Recharges monthly', color: 'text-amber-500' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={item}
                        className="p-6 rounded-2xl bg-card border border-border hover:border-border/80 transition-all group relative overflow-hidden shadow-sm"
                    >
                        <div className={`absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-30 dark:opacity-10 dark:group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500 ${stat.color}`}>
                            <stat.icon className="w-24 h-24" />
                        </div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="p-2 rounded-lg bg-muted border border-border text-muted-foreground group-hover:text-foreground transition-colors">
                                <stat.icon className="w-5 h-5" />
                            </div>
                            {isLoading ? (
                                <div className="h-5 w-16 bg-muted/50 animate-pulse rounded-full" />
                            ) : (
                                <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{stat.change}</span>
                            )}
                        </div>
                        <div className="text-3xl font-bold text-foreground mb-1 relative z-10">
                            {isLoading ? (
                                <div className="h-9 w-24 bg-muted/50 animate-pulse rounded-md" />
                            ) : (
                                stat.value
                            )}
                        </div>
                        <div className="text-sm text-muted-foreground relative z-10">{stat.label}</div>
                    </motion.div>
                ))}
            </div>


            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Recent Projects</h3>
                    <Link href="/projects" className="text-sm text-primary hover:underline flex items-center gap-1">
                        View All <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
                {recentProjects.length === 0 ? (
                    <div className="text-muted-foreground text-sm text-center py-4">
                        No recent projects found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentProjects.map((project, idx) => (
                            <motion.div
                                onClick={() => router.push(`/project/${project.slug}`)}
                                key={project.id || idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                            <ArrowRight className="w-5 h-5 text-primary" />
                                        </div>
                                    </div>

                                    <h4 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                        {project.name}
                                    </h4>

                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
                                        {project.description || 'No description provided for this creative project.'}
                                    </p>

                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-2 border-t border-border/50">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{new Date(project.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    )
}
