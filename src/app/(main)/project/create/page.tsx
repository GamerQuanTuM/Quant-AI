'use client'

import { useActionState, useEffect, useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { FolderPlus, ArrowLeft, Loader2, Check, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import z from "zod";
import axiosInstance from '@/lib/axios-instance'
import { Project } from '../../../../../generated/prisma'

const createProjectSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    description: z.string().optional(),
    slug: z.string().min(3, "Slug must be at least 3 characters long").max(32, "Slug must be at most 32 characters long"),
})

async function createProjectAction(prevState: any, credentials: unknown) {
    const validatedFields = createProjectSchema.safeParse(credentials)

    if (!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.issues[0].message,
        }
    }

    try {
        const res = await axiosInstance.post<Project>('/api/project/create', credentials)
        return { success: true, data: res.data }
    } catch (err: any) {
        return { success: false, error: err.response?.data?.error || 'Failed to create project' }
    }
}

export default function CreateProjectPage() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [formData, setFormData] = useState({ name: '', description: '', slug: '' })
    const [slugStatus, setSlugStatus] = useState<'idle' | 'loading' | 'available' | 'unavailable'>('idle')

    const checkSlug = async () => {
        if (!formData.slug) return
        setSlugStatus('loading')
        try {
            const { data } = await axiosInstance.post('/api/project/check-slug', { slug: formData.slug })
            setSlugStatus(data.available ? 'available' : 'unavailable')
        } catch (error) {
            console.error(error)
            setSlugStatus('idle')
        }
    }

    const [state, formAction] = useActionState(createProjectAction, {
        success: false,
        error: null
    })

    const handleSubmit = () => {
        startTransition(() => {
            formAction(formData)
        })
    }

    useEffect(() => {
        if (state.success) {
            router.push(`/project/${state.data?.slug}`)
        }
    }, [state.success])



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

                <form
                    action={handleSubmit}
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSubmit()
                    }}
                    className="mt-8 space-y-6 bg-[#18181b] border border-[#27272a] p-8 rounded-2xl">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Project Name</label>
                        <Input
                            placeholder="e.g., Q1 Marketing Campaign"
                            className="bg-zinc-900 border-zinc-800 text-white h-12 text-lg mt-1"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Slug (Optional)</label>
                        <div className="relative">
                            <Input
                                placeholder="marketing-campaign"
                                className={`bg-zinc-900 border-zinc-800 text-white h-12 text-lg mt-1 pr-20 ${slugStatus === 'available' ? 'border-green-500/50 focus-visible:ring-green-500/50' :
                                    slugStatus === 'unavailable' ? 'border-red-500/50 focus-visible:ring-red-500/50' : ''
                                    }`}
                                value={formData.slug}
                                onChange={(e) => {
                                    setFormData({ ...formData, slug: e.target.value })
                                    setSlugStatus('idle')
                                }}
                            />
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 px-3 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                                    onClick={checkSlug}
                                    disabled={slugStatus === 'loading' || !formData.slug}
                                >
                                    {slugStatus === 'loading' ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : slugStatus === 'available' ? (
                                        <span className="flex items-center text-green-400">
                                            <Check className="w-3 h-3 mr-1" /> Available
                                        </span>
                                    ) : slugStatus === 'unavailable' ? (
                                        <span className="flex items-center text-red-400">
                                            <X className="w-3 h-3 mr-1" /> Taken
                                        </span>
                                    ) : (
                                        'Check'
                                    )}
                                </Button>
                            </div>
                        </div>
                        {slugStatus === 'available' && (
                            <p className="text-xs text-green-500 mt-1 ml-1">
                                This URL is available for your project.
                            </p>
                        )}
                        {slugStatus === 'unavailable' && (
                            <p className="text-xs text-red-500 mt-1 ml-1">
                                This URL is already taken. Please try another one.
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Description (Optional)</label>
                        <textarea
                            className="flex min-h-[120px] w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                            placeholder="What is this project for?"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-[#27272a]">
                        <Link href="/projects">
                            <Button type="submit" variant="ghost" className="text-gray-400 hover:text-white">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" className="bg-primary hover:bg-primary/90 px-8" disabled={isPending}>
                            {isPending ? 'Creating Project...' : 'Create Project'}
                        </Button>
                    </div>
                </form>
            </div>
        </motion.div>
    )
}
