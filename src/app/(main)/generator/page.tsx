'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Wand2, Copy, Save, ArrowLeft, Loader2 } from 'lucide-react'
import { useCompletion } from '@ai-sdk/react';
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getClientUser } from '@/lib/user-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TEMPLATE_CONFIG } from '@/constants/template-config'


function GeneratorContent() {
    const searchParams = useSearchParams()
    const templateId = searchParams.get('template') || 'default'
    const config = TEMPLATE_CONFIG[templateId] || TEMPLATE_CONFIG['default']
    const [projects, setProjects] = useState<{ slug: string; name: string }[]>([])
    const [selectedProjectSlug, setSelectedProjectSlug] = useState<string>("")
    const [formData, setFormData] = useState<Record<string, string>>({})

    
    const { completion, complete, isLoading, error } = useCompletion({
        api: `/api/generate-content/${templateId}`,
        onError: (err) => {
            console.error("Generation error:", err)
        },
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })


    const handleInputChange = (id: string, value: string) => {
        setFormData(prev => ({ ...prev, [id]: value }))
    }
    
    const handleGenerate = async () => {
        if (!selectedProjectSlug) return
        
        let payload: Record<string, string> = {}
        if (templateId === 'linkedin-post') {
            payload = {
                topic: formData.topic || '',
                audience: formData.audience || '',
                takeaways: formData.takeaways || '',
                tone: formData.tone || ''
            }
            console.log(formData)
        }
        try {
            await complete(JSON.stringify(payload))
        } catch (err) {
            console.error("Failed to generate:", err)
        }
        
    }
    
    useEffect(() => {
        const defaults: Record<string, string> = {}
        config.inputs.forEach(input => {
            if (input.type === 'select' && input.options && input.options.length > 0) {
                defaults[input.id] = input.options[0]
            }
        })
        setFormData(defaults)
    }, [templateId])

    useEffect(() => {
        getClientUser({ projects: true })
            .then((data) => {
                setProjects(
                    data?.projects?.map(project => ({
                        slug: project.slug,
                        name: project.name,
                    })) || []
                )
            })
            .catch((error) => console.log(error))
    }, [])

    useEffect(() => {
        const urlPId = searchParams.get('projectId')
        if (urlPId) setSelectedProjectSlug(urlPId)
    }, [searchParams])

    const handleCopy = async () => {
        if (completion) {
            try {
                await navigator.clipboard.writeText(completion)
                alert("Copied to clipboard!")
            } catch (err) {
                console.error('Failed to copy:', err)
            }
        }
    }

    const handleSave = async () => {
        if (!completion || !selectedProjectSlug) return

        console.log('Saving content:', {
            projectSlug: selectedProjectSlug,
            template: templateId,
            content: completion
        })
        // Add your save API call here
    }

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link href={selectedProjectSlug ? `/project/${projects.find(p => p.slug === selectedProjectSlug)?.name.toLowerCase().replace(/ /g, '-')}` : "/templates"}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Wand2 className="w-6 h-6 text-primary" />
                        {config.title}
                    </h2>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                {/* Input Panel */}
                <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 overflow-y-auto">
                    <h3 className="text-lg font-medium text-white mb-6">Content Details</h3>
                    <div className="space-y-6">

                        {/* Project Selector - REQUIRED */}
                        <div className="space-y-2 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                            <label className="text-sm font-medium text-primary flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary" />
                                Select Project (Required)
                            </label>
                            <select
                                className="flex h-10 w-full items-center justify-between rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                                value={selectedProjectSlug}
                                onChange={(e) => setSelectedProjectSlug(e.target.value)}
                            >
                                <option value="" disabled>-- Choose a project --</option>
                                {projects.map((p) => (
                                    <option key={p.slug} value={p.slug}>{p.name}</option>
                                ))}
                            </select>
                            {!selectedProjectSlug && (
                                <p className="text-xs text-amber-500/80">
                                    You must select a project to save your generated content.
                                </p>
                            )}
                        </div>

                        {config.inputs.map((field) => (
                            <div key={field.id} className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">{field.label}</label>
                                {field.type === 'textarea' ? (
                                    <textarea
                                        className="flex min-h-[100px] w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                                        placeholder={field.placeholder}
                                        value={formData[field.id] || ''}
                                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    />
                                ) : field.type === 'select' ? (
                                    <select
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                                        value={formData[field.id] || ''}
                                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    >
                                        {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                                    </select>
                                ) : (
                                    <Input
                                        placeholder={field.placeholder}
                                        className="bg-zinc-900 border-zinc-800 text-white mt-1"
                                        value={formData[field.id] || ''}
                                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    />
                                )}
                            </div>
                        ))}

                        <Button
                            onClick={handleGenerate}
                            disabled={isLoading || !selectedProjectSlug}
                            className="w-full h-11 bg-primary hover:bg-primary/90 mt-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...
                                </>
                            ) : !selectedProjectSlug ? (
                                <>Select a Project to Generate</>
                            ) : (
                                <>
                                    <Wand2 className="w-4 h-4 mr-2" /> Generate Content
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Output Panel */}
                <div className="bg-[#18181b] border border-[#27272a] rounded-xl flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-[#27272a] flex items-center justify-between bg-zinc-900/50">
                        <span className="text-sm font-medium text-gray-400">AI Output</span>
                        <div className="flex items-center gap-2">
                            <Button onClick={handleCopy} variant="ghost" size="sm" className="text-gray-400 hover:text-white h-8">
                                <Copy className="w-4 h-4 mr-2" /> Copy
                            </Button>
                            <Button onClick={handleSave} variant="ghost" size="sm" className="text-gray-400 hover:text-white h-8">
                                <Save className="w-4 h-4 mr-2" /> Save
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 p-6 bg-zinc-950/50 overflow-y-auto">
                        {completion ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed"
                            >
                                {completion}
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                                <Wand2 className="w-12 h-12 mb-4" />
                                <p>Fill in the details and click generate</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function GeneratorPage() {
    return (
        <Suspense fallback={<div className="text-white">Loading...</div>}>
            <GeneratorContent />
        </Suspense>
    )
}
