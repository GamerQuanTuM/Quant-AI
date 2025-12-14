'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderKanban, Sparkles, History, Settings, LogOut, Zap, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/lib/sidebar-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { useAuth } from '@/hooks/use-auth'

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Templates', href: '/templates', icon: Sparkles },
    { name: 'History', href: '/history', icon: History },
]

export function SidebarContent() {
    const pathname = usePathname()
    const { closeMobileSidebar } = useSidebar()

    const { user } = useAuth()

    return (
        <div className="flex h-full flex-col bg-card text-card-foreground">
            {/* Logo */}
            <div className="flex h-16 items-center px-6 border-b border-border justify-between">
                <div className="flex items-center gap-2 text-foreground font-bold text-xl">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                        <Sparkles className="w-5 h-5 fill-current" />
                    </div>
                    <span>QuantAI</span>
                </div>
                {/* Mobile Close Button - Only visible in mobile drawer implicitly contextually, but we can standardise */}
            </div>

            {/* Nav */}
            <div className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Menu</div>
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={closeMobileSidebar}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm font-medium",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground")} />
                            {item.name}
                        </Link>
                    )
                })}
            </div>

            {/* Bottom Section */}
            <div className="p-4 border-t border-border space-y-4">
                {/* Credits */}
                <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-500/5 blur-xl pointer-events-none" />
                    <div className="flex items-center justify-between mb-2 relative z-10">
                        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">Credits Remaining</span>
                        <div className="w-6 h-6 rounded-md bg-indigo-500 flex items-center justify-center shadow-sm shadow-indigo-500/20">
                            <Zap className="w-3.5 h-3.5 text-white fill-white" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-foreground relative z-10">150</div>
                    <Link href="/billing" className="text-[10px] text-muted-foreground hover:text-foreground mt-2 block relative z-10">
                        Upgrade Plan →
                    </Link>
                </div>

                {/* User Profile */}
                <Link href="/settings">
                    <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border text-xs font-bold text-foreground">
                            JD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                        <Settings className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </div>
                </Link>
            </div>
        </div>
    )
}

export function Sidebar() {
    return (
        <div className="hidden md:flex h-screen w-72 flex-col border-r border-border fixed left-0 top-0 bottom-0 z-40 bg-card">
            <SidebarContent />
        </div>
    )
}

export function MobileSidebar() {
    const { isMobileSidebarOpen, closeMobileSidebar } = useSidebar()

    return (
        <AnimatePresence>
            {isMobileSidebarOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeMobileSidebar}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden"
                    />
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                        className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border md:hidden"
                    >
                        <SidebarContent />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 text-muted-foreground md:hidden"
                            onClick={closeMobileSidebar}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
