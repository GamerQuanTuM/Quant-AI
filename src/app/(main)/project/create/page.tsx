'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, FolderPlus, ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CreateProjectPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({ name: '', description: '' })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Simulate creation
        const slug = formData.name.toLowerCase().replace(/ /g, '-')
        console.log('Project Created:', formData)

        // Redirect to the new project dashboard
        router.push(`/project/${slug}`)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto py-12"
        >
            <Link href="/projects" className="inline-flex items-center text-sm text-gray-500 hover:text-white mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
            </Link>

            <div>
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
                        <FolderPlus className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Create New Project</h1>
                        <p className="text-gray-400">Start a new collection of content.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-[#18181b] border border-[#27272a] p-8 rounded-2xl">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Project Name</label>
                        <Input
                            placeholder="e.g., Q1 Marketing Campaign"
                            className="bg-zinc-900 border-zinc-800 text-white h-12 text-lg"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Description (Optional)</label>
                        <textarea
                            className="flex min-h-[120px] w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="What is this project for?"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-[#27272a]">
                        <Link href="/projects">
                            <Button type="button" variant="ghost" className="text-gray-400 hover:text-white">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" className="bg-primary hover:bg-primary/90 px-8">
                            Create Project <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </form>
            </div>
        </motion.div>
    )
}
