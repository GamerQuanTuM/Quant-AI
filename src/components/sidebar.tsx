'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderKanban, Sparkles, History, Settings, LogOut, Zap, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/lib/sidebar-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Templates', href: '/templates', icon: Sparkles },
    { name: 'History', href: '/history', icon: History },
]

export function SidebarContent() {
    const pathname = usePathname()
    const { closeMobileSidebar } = useSidebar()

    return (
        <div className="flex h-full flex-col bg-[#09090b] text-white">
            {/* Logo */}
            <div className="flex h-16 items-center px-6 border-b border-[#27272a] justify-between">
                <div className="flex items-center gap-2 text-primary font-bold text-xl">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                        <Sparkles className="w-5 h-5 fill-current" />
                    </div>
                    <span>QuantAI</span>
                </div>
                {/* Mobile Close Button - Only visible in mobile drawer implicitly contextually, but we can standardise */}
            </div>

            {/* Nav */}
            <div className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Menu</div>
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
                                    ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400 group-hover:text-white")} />
                            {item.name}
                        </Link>
                    )
                })}
            </div>

            {/* Bottom Section */}
            <div className="p-4 border-t border-[#27272a] space-y-4">
                {/* Credits */}
                <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl p-4 border border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center justify-between mb-2 relative z-10">
                        <span className="text-xs font-medium text-indigo-300">Credits Remaining</span>
                        <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                    </div>
                    <div className="text-2xl font-bold text-white relative z-10">150</div>
                    <Link href="/billing" className="text-[10px] text-gray-400 hover:text-white mt-2 block relative z-10">
                        Upgrade Plan →
                    </Link>
                </div>

                {/* User Profile */}
                <Link href="/settings">
                    <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10 text-xs font-bold text-white">
                            JD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">John Doe</p>
                            <p className="text-xs text-gray-500 truncate">john@contentgen.com</p>
                        </div>
                        <Settings className="w-4 h-4 text-gray-500 hover:text-white transition-colors" />
                    </div>
                </Link>
            </div>
        </div>
    )
}

export function Sidebar() {
    return (
        <div className="hidden md:flex h-screen w-72 flex-col border-r border-[#27272a] fixed left-0 top-0 bottom-0 z-40">
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
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
                    />
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                        className="fixed inset-y-0 left-0 z-50 w-72 bg-[#09090b] border-r border-[#27272a] md:hidden"
                    >
                        <SidebarContent />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 text-gray-400 md:hidden"
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
