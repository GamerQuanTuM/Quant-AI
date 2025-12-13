import { getServerUser } from '@/lib/user-server'
import ProjectsPageData from './data'

export default async function ProjectsPage() {
    const user = await getServerUser({ projects: true });

    if(!user?.projects){
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#09090b]">
                <p className="text-white">No projects found</p>
            </div>
        )
    }


    return (
        <ProjectsPageData projects={user?.projects} />
    )
}
