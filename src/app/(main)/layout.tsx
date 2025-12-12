'use client'

import { Sidebar, MobileSidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { SidebarProvider } from '@/lib/sidebar-context'
import { Button } from '@/components/ui/button' // For the mobile sidebar import if needed, but it's handled in sidebar component

import { AuthProvider } from '@/components/providers/auth-provider'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <AuthProvider>
                <div className="flex h-screen bg-[#09090b]">
                    <Sidebar />
                    <MobileSidebar />
                    <div className="flex-1 flex flex-col min-w-0 md:pl-72 transition-all duration-300">
                        <Header />
                        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                            {children}
                        </main>
                    </div>
                </div>
            </AuthProvider>
        </SidebarProvider>
    )
}
