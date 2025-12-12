'use client'

import { createContext, useEffect, useState } from 'react'
import { getClientUser } from '@/lib/user-client'
import { Loader2 } from 'lucide-react'
import { User } from '../../../generated/prisma'


interface AuthContextType {
    user: User | null
    loading: boolean
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getClientUser()
                setUser(userData)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [])

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#09090b]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    )
}
