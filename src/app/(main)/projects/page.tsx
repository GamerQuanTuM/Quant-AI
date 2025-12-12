'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Folder, MoreVertical, Calendar, FileText, Trash2, ExternalLink, AlertTriangle, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Initial Mock Data
const INITIAL_PROJECTS = [
    { id: 1, title: 'Q4 Social Media Campaign', contentCount: 12, lastEdited: '2 hours ago', status: 'Active' },
    { id: 2, title: 'Product Launch Blog Series', contentCount: 5, lastEdited: 'Yesterday', status: 'Review' },
    { id: 3, title: 'Email Newsletter - Dec', contentCount: 3, lastEdited: '3 days ago', status: 'Draft' },
    { id: 4, title: 'Website Copy Refresh', contentCount: 8, lastEdited: 'Last week', status: 'Completed' },
]

export default function ProjectsPage() {
    const [projects, setProjects] = useState(INITIAL_PROJECTS)
    const [projectToDelete, setProjectToDelete] = useState<number | null>(null)

    const handleDelete = (id: number) => {
        setProjects(prev => prev.filter(p => p.id !== id))
        setProjectToDelete(null)
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-7">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Projects</h2>
                    <p className="text-gray-400 mt-1">Manage and organize your generated content.</p>
                </div>
                <Link href="/project/create">
                    <Button className="bg-primary hover:bg-primary/90">
                        <Folder className="w-4 h-4 mr-2" />
                        New Project
                    </Button>
                </Link>
            </div>

            {/* Filters/Search */}
            <div className="flex items-center gap-4 bg-[#18181b] p-4 rounded-xl border border-[#27272a]">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search your projects..."
                        className="pl-9 bg-zinc-900 border-zinc-800 text-white focus:bg-zinc-800 transition-all"
                    />
                </div>
            </div>

            {/* Project List */}
            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode='popLayout'>
                    {projects.map((project, i) => (
                        <motion.div
                            key={project.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: i * 0.05 }}
                            className="group bg-[#18181b] border border-[#27272a] hover:border-zinc-700 rounded-xl p-4 flex items-center justify-between transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800 text-blue-500">
                                    <Folder className="w-6 h-6 fill-current opacity-20" />
                                </div>
                                <Link href={`/project/${project.title.toLowerCase().replace(/ /g, '-')}`} className="block">
                                    <h3 className="font-semibold text-white group-hover:text-primary transition-colors cursor-pointer">{project.title}</h3>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                        <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {project.contentCount} files</span>
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {project.lastEdited}</span>
                                    </div>
                                </Link>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                                ${project.status === 'Active' ? 'bg-green-500/10 text-green-500' :
                                        project.status === 'Completed' ? 'bg-blue-500/10 text-blue-500' :
                                            'bg-zinc-800 text-gray-400'}`}>
                                    {project.status}
                                </span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={`/project/${project.title.toLowerCase().replace(/ /g, '-')}`}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                                            <ExternalLink className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-gray-400 hover:text-red-400"
                                        onClick={() => setProjectToDelete(project.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {projectToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setProjectToDelete(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-md bg-[#18181b] border border-[#27272a] rounded-xl p-6 shadow-2xl z-10"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Delete Project?</h3>
                                    <p className="text-sm text-gray-400">This action cannot be undone.</p>
                                </div>
                            </div>

                            <p className="text-gray-300 mb-6">
                                Are you sure you want to delete <span className="font-semibold text-white">"{projects.find(p => p.id === projectToDelete)?.title}"</span>?
                                All {projects.find(p => p.id === projectToDelete)?.contentCount} generated files inside loop be permanently removed.
                            </p>

                            <div className="flex justify-end gap-3">
                                <Button variant="ghost" onClick={() => setProjectToDelete(null)} className="text-gray-400 hover:text-white">
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    onClick={() => projectToDelete && handleDelete(projectToDelete)}
                                >
                                    Delete Project
                                </Button>
                            </div>

                            <button onClick={() => setProjectToDelete(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
