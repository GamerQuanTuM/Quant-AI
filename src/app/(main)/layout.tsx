'use client'

import { Sidebar, MobileSidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import Provider from '@/components/providers'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <Provider>
            <div className="flex h-screen bg-background">
                <Sidebar />
                <MobileSidebar />
                <div className="flex-1 flex flex-col min-w-0 md:pl-72 transition-all duration-300">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                        {children}
                    </main>
                </div>
            </div>
        </Provider>
    )
}
