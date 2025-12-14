'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Wand2, Copy, Save, ArrowLeft, Loader2 } from 'lucide-react'
import { useCompletion } from '@ai-sdk/react';
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useSearchParams } from 'next/navigation'
import { getClientUser } from '@/lib/user-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TEMPLATE_CONFIG } from '@/constants/template-config'


function GeneratorContent() {
    const searchParams = useSearchParams()
    const templateId = searchParams.get('template') || 'default'
    const config = TEMPLATE_CONFIG[templateId] || TEMPLATE_CONFIG['default']

    const [viewMode, setViewMode] = useState<'preview' | 'markdown'>('preview')
    const [projects, setProjects] = useState<{ slug: string; name: string }[]>([])
    const [selectedProjectSlug, setSelectedProjectSlug] = useState<string>("")
    const [formData, setFormData] = useState<Record<string, string>>({})

    const [selectedProvider, setSelectedProvider] = useState<string>('openrouter')
    const [availableProviders, setAvailableProviders] = useState<string[]>([])

    useEffect(() => {
        // Check which keys exist in localStorage
        const providers = ['server'] // Default option
        if (localStorage.getItem('openrouter_key')) providers.push('openrouter')
        if (localStorage.getItem('openai_key')) providers.push('openai')
        if (localStorage.getItem('google_key')) providers.push('google')
        if (localStorage.getItem('groq_key')) providers.push('groq')
        if (localStorage.getItem('anthropic_key')) providers.push('anthropic')

        setAvailableProviders(providers)
        setSelectedProvider('server')
    }, [])


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
        }

        if (templateId === "twitter-thread") {
            payload = {
                topic: formData.topic || '',
                points: formData.points || '',
                tone: formData.tone || ''
            }
        }

        if (templateId === "blog-post") {
            payload = {
                title: formData.title || '',
                keywords: formData.keywords || '',
                outline: formData.outline || '',
                tone: formData.tone || ''
            }
        }

        if (templateId === "email-reply") {
            console.log(formData)

            payload = {
                tone: formData.tone || '',
                sender: formData.sender || '',
                receipent: formData.receipent || '',
                context: formData.context || '',
                response_points: formData.response_points || '',

            }
        }

        if (templateId === "instagram-caption") {
            payload = {
                description: formData.description || '',
                tone: formData.tone || ''
            }
        }

        if (templateId === "code-generation") {
            payload = {
                description: formData.description || '',
                language: formData.language || '',
                context: formData.context || ''
            }
        }

        if (templateId === "video-script") {
            payload = {
                topic: formData.topic || '',
                platform: formData.platform || '',
                tone: formData.tone || ''
            }
        }

        if (templateId === "podcast-intro") {
            payload = {
                podcastName: formData.podcastName || '',
                episodeTopic: formData.episodeTopic || '',
                guest: formData.guest || '',
                tone: formData.tone || ''
            }
        }


        try {
            const token = localStorage.getItem('token')

            // Get the appropriate key for the selected provider
            let providerKey = ''
            if (selectedProvider === 'openrouter') providerKey = localStorage.getItem('openrouter_key') || ''
            if (selectedProvider === 'openai') providerKey = localStorage.getItem('openai_key') || ''
            if (selectedProvider === 'google') providerKey = localStorage.getItem('google_key') || ''
            if (selectedProvider === 'groq') providerKey = localStorage.getItem('groq_key') || ''
            if (selectedProvider === 'anthropic') providerKey = localStorage.getItem('anthropic_key') || ''

            const headers: Record<string, string> = {
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }

            // Only attach provider headers if not using server default
            if (selectedProvider !== 'server') {
                headers['x-provider'] = selectedProvider
                headers['x-provider-key'] = providerKey
            }

            await complete(JSON.stringify(payload), { headers })
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
    }

    const markdownComponents = {
        h1: ({ node, ...props }: any) => <h1 className="text-2xl font-bold text-foreground mt-6 mb-4" {...props} />,
        h2: ({ node, ...props }: any) => <h2 className="text-xl font-semibold text-foreground mt-5 mb-3" {...props} />,
        h3: ({ node, ...props }: any) => <h3 className="text-lg font-medium text-foreground mt-4 mb-2" {...props} />,
        p: ({ node, ...props }: any) => <p className="text-muted-foreground mb-3 leading-relaxed" {...props} />,
        ul: ({ node, ...props }: any) => <ul className="list-disc pl-5 text-muted-foreground mb-3" {...props} />,
        ol: ({ node, ...props }: any) => <ol className="list-decimal pl-5 text-muted-foreground mb-3" {...props} />,
        li: ({ node, ...props }: any) => <li className="mb-1" {...props} />,
        strong: ({ node, ...props }: any) => <strong className="font-semibold text-foreground" {...props} />,
        em: ({ node, ...props }: any) => <em className="italic text-muted-foreground" {...props} />,
        blockquote: ({ node, ...props }: any) => (
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-3" {...props} />
        ),
        code: ({ node, inline, ...props }: any) =>
            inline ? (
                <code className="text-primary font-bold italic text-sm font-mono" {...props} />
            ) : (
                <code className="text-foreground text-sm font-mono" {...props} />
            ),
        pre: ({ node, ...props }: any) => <pre className="my-3 overflow-x-auto bg-muted p-4 rounded-lg" {...props} />,
        a: ({ node, ...props }: any) => <a className="text-primary hover:text-primary/80 underline" {...props} />,
    }

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link href={selectedProjectSlug ? `/project/${projects.find(p => p.slug === selectedProjectSlug)?.name.toLowerCase().replace(/ /g, '-')}` : "/templates"}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Wand2 className="w-6 h-6 text-primary" />
                        {config.title}
                    </h2>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                {/* Input Panel */}
                <div className="bg-card border border-border rounded-xl p-6 overflow-y-auto shadow-sm">
                    <h3 className="text-lg font-medium text-card-foreground mb-6">Content Details</h3>
                    <div className="space-y-6">

                        <div className="space-y-2 p-4 bg-muted/50 border border-border rounded-lg">
                            <label className="text-sm font-medium text-primary flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary" />
                                Select Project (Required)
                            </label>
                            <select
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
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

                        {/* Provider Selector */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">AI Model Provider</label>
                            <select
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                                value={selectedProvider}
                                onChange={(e) => setSelectedProvider(e.target.value)}
                            >
                                {availableProviders.map(p => {
                                    if (p === 'server') return <option key="server" value="server">Platform Managed (Free)</option>
                                    return <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)} (Your Key)</option>
                                })}
                            </select>
                            {availableProviders.length === 1 && (
                                <Link href="/settings" className="text-xs text-primary underline">
                                    Add your own keys for more models
                                </Link>
                            )}
                        </div>

                        {config.inputs.map((field) => (
                            <div key={field.id} className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">{field.label}</label>
                                {field.type === 'textarea' ? (
                                    <textarea
                                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                                        placeholder={field.placeholder}
                                        value={formData[field.id] || ''}
                                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    />
                                ) : field.type === 'select' ? (
                                    <select
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                                        value={formData[field.id] || ''}
                                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    >
                                        {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                                    </select>
                                ) : (
                                    <Input
                                        placeholder={field.placeholder}
                                        className="bg-background border-input text-foreground mt-1"
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
                <div className="bg-card border border-border rounded-xl flex flex-col overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-muted-foreground">AI Output</span>
                            <div className="flex bg-muted rounded-lg p-0.5 ml-2">
                                <button
                                    onClick={() => setViewMode('preview')}
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'preview' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Preview
                                </button>
                                <button
                                    onClick={() => setViewMode('markdown')}
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'markdown' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Raw Text
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button onClick={handleCopy} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8">
                                <Copy className="w-4 h-4 mr-2" /> Copy
                            </Button>
                            <Button onClick={handleSave} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8">
                                <Save className="w-4 h-4 mr-2" /> Save
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 p-6 bg-card/50 overflow-y-auto">
                        {isLoading ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                                <Loader2 className="w-12 h-12 mb-4 animate-spin" />
                                <p>Generating content...</p>
                            </div>
                        ) : completion ? (
                            viewMode === 'preview' ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-foreground leading-relaxed"
                                >
                                    <ReactMarkdown components={markdownComponents}>
                                        {completion}
                                    </ReactMarkdown>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-foreground whitespace-pre-wrap leading-relaxed font-mono text-sm bg-muted/30 p-4 rounded-lg"
                                >
                                    {completion}
                                </motion.div>
                            )
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
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
        <Suspense fallback={<div className="text-foreground">Loading...</div>}>
            <GeneratorContent />
        </Suspense>
    )
}