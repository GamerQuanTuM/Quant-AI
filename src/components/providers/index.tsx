'use client'

import { SidebarProvider } from '@/lib/sidebar-context'
import { AuthProvider } from '@/components/providers/auth-provider'
import { SocketProvider } from '@/components/providers/socket-provider'

const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <AuthProvider>
                <SocketProvider>
                    {children}
                </SocketProvider>
            </AuthProvider>
        </SidebarProvider>
    )
}

export default Provider
