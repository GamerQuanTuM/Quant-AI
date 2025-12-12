'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Wand2, Copy, Save, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

// Template Configurations
const TEMPLATE_CONFIG: Record<string, { title: string; inputs: { id: string; label: string; type: 'text' | 'textarea' | 'select'; placeholder?: string; options?: string[] }[] }> = {
    'linkedin-post': {
        title: 'LinkedIn Post Generator',
        inputs: [
            { id: 'topic', label: 'Topic or Subject', type: 'text', placeholder: 'e.g., The future of remote work' },
            { id: 'audience', label: 'Target Audience', type: 'text', placeholder: 'e.g., HR Managers, Tech Leaders' },
            { id: 'takeaways', label: 'Key Takeaways', type: 'textarea', placeholder: 'Points to cover...' },
            { id: 'tone', label: 'Tone', type: 'select', options: ['Professional', 'Casual', 'Thought Leadership', 'Empathetic'] }
        ]
    },
    'twitter-thread': {
        title: 'Twitter Thread Creator',
        inputs: [
            { id: 'topic', label: 'Thread Topic', type: 'text', placeholder: 'e.g., 5 Tips for Productivity' },
            { id: 'points', label: 'Key Points (Bullet inputs)', type: 'textarea', placeholder: 'List your main points here...' },
            { id: 'tone', label: 'Tone', type: 'select', options: ['Engaging', 'Informative', 'Viral', 'Casual'] }
        ]
    },
    'blog-post': {
        title: 'Blog Post Writer',
        inputs: [
            { id: 'title', label: 'Blog Title / Topic', type: 'text', placeholder: 'e.g., Ultimate Guide to React' },
            { id: 'keywords', label: 'SEO Keywords', type: 'text', placeholder: 'react, hooks, performance' },
            { id: 'outline', label: 'Rough Outline (Optional)', type: 'textarea', placeholder: 'Intro, Body, Conclusion...' },
            { id: 'tone', label: 'Tone', type: 'select', options: ['Educational', 'Professional', 'Storytelling', 'Opinionated'] }
        ]
    },
    'email-reply': {
        title: 'Email Reply Generator',
        inputs: [
            { id: 'sender', label: 'Who sent the email?', type: 'text', placeholder: 'e.g., Client Name' },
            { id: 'context', label: 'Original Email / Context', type: 'textarea', placeholder: 'Paste the email you received or describe it...' },
            { id: 'response_points', label: 'Key Points to Hit', type: 'textarea', placeholder: 'Yes I can attend, Price is $500, etc.' },
            { id: 'tone', label: 'Tone', type: 'select', options: ['Professional', 'Friendly', 'Firm', 'Grateful'] }
        ]
    },
    // Default fallback
    'default': {
        title: 'AI Content Generator',
        inputs: [
            { id: 'prompt', label: 'What should I write?', type: 'textarea', placeholder: 'Describe what you need...' },
            { id: 'tone', label: 'Tone', type: 'select', options: ['Professional', 'Casual', 'Creative'] }
        ]
    }
}

function GeneratorContent() {
    const searchParams = useSearchParams()
    const templateId = searchParams.get('template') || 'default'
    const config = TEMPLATE_CONFIG[templateId] || TEMPLATE_CONFIG['default']

    const [isGenerating, setIsGenerating] = useState(false)
    const [output, setOutput] = useState("")
    const [formData, setFormData] = useState<Record<string, string>>({})

    const handleInputChange = (id: string, value: string) => {
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleGenerate = () => {
        setIsGenerating(true)
        // Simulate specific output based on template
        setTimeout(() => {
            setIsGenerating(false)
            setOutput(`Generated ${config.title} based on:\n\n${Object.entries(formData).map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n[AI Content Simulation]`)
        }, 1500)
    }

    // Dummy Projects
    const projects = [
        { id: '1', name: 'Q4 Social Media Campaign' },
        { id: '2', name: 'Product Launch Blog Series' },
        { id: '3', name: 'Email Newsletter - Dec' },
    ]

    const [selectedProjectId, setSelectedProjectId] = useState<string>("")

    // Initialize with project ID from URL if present
    useEffect(() => {
        const urlPId = searchParams.get('projectId')
        if (urlPId) setSelectedProjectId(urlPId)
    }, [searchParams])

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link href={selectedProjectId ? `/project/${projects.find(p => p.id === selectedProjectId)?.name.toLowerCase().replace(/ /g, '-')}` : "/templates"}>
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
                                value={selectedProjectId}
                                onChange={(e) => setSelectedProjectId(e.target.value)}
                            >
                                <option value="" disabled>-- Choose a project --</option>
                                {projects.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            {!selectedProjectId && (
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
                                        className="flex min-h-[100px] w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder={field.placeholder}
                                        value={formData[field.id] || ''}
                                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    />
                                ) : field.type === 'select' ? (
                                    <select
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData[field.id] || ''}
                                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    >
                                        {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                                    </select>
                                ) : (
                                    <Input
                                        placeholder={field.placeholder}
                                        className="bg-zinc-900 border-zinc-800 text-white"
                                        value={formData[field.id] || ''}
                                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    />
                                )}
                            </div>
                        ))}

                        <Button
                            onClick={handleGenerate}
                            disabled={isGenerating || !selectedProjectId}
                            className="w-full h-11 bg-primary hover:bg-primary/90 mt-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...
                                </>
                            ) : !selectedProjectId ? (
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
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white h-8">
                                <Copy className="w-4 h-4 mr-2" /> Copy
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white h-8">
                                <Save className="w-4 h-4 mr-2" /> Save
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 p-6 bg-zinc-950/50 overflow-y-auto">
                        {output ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed"
                            >
                                {output}
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
