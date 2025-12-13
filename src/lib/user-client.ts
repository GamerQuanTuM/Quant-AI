import axiosInstance from "./axios-instance"
import { GeneratedContent, Project, User } from "../../generated/prisma"

type UserWithProjects = User & {
    projects: (Project & {
        contents: GeneratedContent[]
    })[]
}

export async function getClientUser<T extends boolean | undefined>(
    options?: { projects: T }
): Promise<
    T extends true ? UserWithProjects | null : User | null
> {
    try {
        const { data } = await axiosInstance.get('/api/me?projects=' + options?.projects)
        return data
    } catch (error) {
        return null
    }
}
