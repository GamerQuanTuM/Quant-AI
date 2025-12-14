'use client'

import { Search, Plus, Bell, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useSidebar } from '@/lib/sidebar-context'
import { ModeToggle } from '@/components/mode-toggle'

export function Header() {
    const { toggleMobileSidebar } = useSidebar()

    return (
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
            {/* Left Section: Mobile Menu + Search */}
            <div className="flex items-center gap-4 w-full md:w-auto">
                <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground" onClick={toggleMobileSidebar}>
                    <Menu className="w-5 h-5" />
                </Button>

                {/* Search */}
                <div className="flex-1 md:w-96 md:flex-none">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            className="pl-9 bg-muted/50 border-transparent focus:border-input text-foreground placeholder:text-muted-foreground focus:bg-muted transition-all rounded-full h-9 w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4 ml-2">
                <ModeToggle />

                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative hidden md:flex">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-background" />
                </Button>

                <Link href="/project/create">
                    <Button className="h-9 bg-primary hover:bg-primary/90 rounded-full text-xs font-medium px-3 md:px-4 gap-2 shadow-lg shadow-primary/25 whitespace-nowrap text-primary-foreground">
                        <Plus className="w-4 h-4" />
                        <span className="hidden md:inline">Create New Project</span>
                        <span className="md:hidden">Create</span>
                    </Button>
                </Link>
            </div>
        </header>
    )
}
