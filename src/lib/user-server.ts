import { cookies } from "next/headers"
import { Project, User } from "../../generated/prisma"
import { GeneratedContent } from "@prisma/client"

type UserWithProjects = User & {
    projects: (Project & {
        contents: GeneratedContent[]
    })[]
}
export async function getServerUser<T extends boolean | undefined>(
    options?: { projects: T }
): Promise<
    T extends true ? UserWithProjects | null : User | null
>{
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")

        if (!token) {
            return null
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/me?projects=${options?.projects}`, {
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
