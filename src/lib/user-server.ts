import { cookies } from "next/headers"

export const getServerUser = async () => {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")

        if (!token) {
            return null
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/me`, {
            headers: {
                Cookie: `token=${token.value}`,
                Authorization: `Bearer ${token.value}`
            },
            cache: 'no-store'
        })

        if (!res.ok) {
            return null
        }

        const user = await res.json()
        return user
    } catch (error) {
        return null
    }
}
