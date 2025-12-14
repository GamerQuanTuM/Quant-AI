'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Plus, MoreHorizontal, FileText, Calendar, Clock, X, Copy, Check, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import axiosInstance from '@/lib/axios-instance'
import { TEMPLATE_CONFIG } from '@/constants/template-config'

// Function to safely format dates
const formatDate = (date: Date | string) => {
    try {
        return new Date(date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch (e) {
        return 'Invalid Date'
    }
}

// Helper to get template info
const getTemplateInfo = (id: string) => {
    return TEMPLATE_CONFIG[id] || { title: 'Unknown Template', inputs: [] }
}

type GeneratedContent = {
    id: string
    templateId: string
    inputData: Record<string, any>
    outputText: string
    createdAt: string
}

type ProjectWithContents = {
    name: string
    slug: string,
    createdAt: string,
    contents: GeneratedContent[]
}

export default function ProjectDetailsPage() {
    const params = useParams()
    const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null)
    const [isCopied, setIsCopied] = useState(false)
    const [viewMode, setViewMode] = useState<'preview' | 'markdown'>('preview')
    const [projectWithContents, setProjectWithContents] = useState<ProjectWithContents | null>(null)
    const [itemToDelete, setItemToDelete] = useState<GeneratedContent | null>(null)

    // Markdown components needed for rendering
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

    const fetchContents = async () => {
        try {
            const res = await axiosInstance.get(`/api/content/get-user-project-contents?projectSlug=${params.slug}`)
            const data = await res.data
            setProjectWithContents(data)
        } catch (error) {
            console.log(error)
        }
    }

    console.log(projectWithContents)

    const handleCopy = () => {
        if (!selectedContent) return
        navigator.clipboard.writeText(selectedContent.outputText)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }

    useEffect(() => {
        fetchContents()
    }, [])

    const confirmDelete = (item: GeneratedContent) => {
        setItemToDelete(item)
    }

    const performDelete = async () => {
        if (!itemToDelete) return

        try {
            const res = await axiosInstance.delete(`/api/content/delete`, {
                data: {
                    contentId: itemToDelete.id
                }
            })
            if (res.status === 200) {
                fetchContents()
                setItemToDelete(null)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/projects">
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground border border-border rounded-xl">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    {!projectWithContents ? (
                        <div className="space-y-2 animate-pulse">
                            <div className="h-8 w-48 bg-muted rounded-md" />
                            <div className="h-4 w-32 bg-muted rounded-md" />
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-foreground">{projectWithContents.name}</h1>
                            </div>
                            <p className="text-muted-foreground mt-1 flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> {formatDate(projectWithContents.createdAt)} • {projectWithContents.contents.length} files
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="w-5 h-5" />
                    </Button>
                    <Link href={`/templates`}>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Plus className="w-4 h-4 mr-2" /> Generate New Content
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Content List */}
            <div className="grid grid-cols-1 gap-4">
                <h3 className="text-lg font-semibold text-foreground mt-4">Project Content</h3>

                {!projectWithContents ? (
                    // Skeleton Loading
                    [1, 2, 3].map((i) => (
                        <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between animate-pulse">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-muted" />
                                <div className="space-y-2">
                                    <div className="h-5 w-48 bg-muted rounded-md" />
                                    <div className="h-3 w-24 bg-muted rounded-md" />
                                </div>
                            </div>
                            <div className="h-4 w-32 bg-muted rounded-md" />
                        </div>
                    ))
                ) : projectWithContents.contents?.length === 0 ? (
                    // Empty State
                    <div className="text-center py-12 bg-muted/30 border border-border border-dashed rounded-xl">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 border border-border text-muted-foreground">
                            <FileText className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">No content yet</h3>
                        <p className="text-muted-foreground mt-1 max-w-sm mx-auto mb-6">
                            Start creating content for this project using our AI templates.
                        </p>
                    </div>
                ) : (
                    // Actual Content
                    projectWithContents.contents?.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="group bg-card border border-border hover:border-border/80 rounded-xl p-4 flex items-center justify-between transition-all shadow-sm"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-border text-muted-foreground">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                                        {getTemplateInfo(item.templateId).title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Clock className="w-3 h-3" /> {formatDate(item.createdAt)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-foreground"
                                    onClick={() => setSelectedContent(item)}
                                >
                                    View
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => confirmDelete(item)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Content Viewer Modal */}
            <AnimatePresence>
                {selectedContent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedContent(null)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            className="relative w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[80vh]"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground max-w-[300px] truncate">
                                            {getTemplateInfo(selectedContent.templateId).title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">{formatDate(selectedContent.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 border-border text-muted-foreground hover:text-foreground"
                                        onClick={handleCopy}
                                    >
                                        {isCopied ? <Check className="w-3 h-3 mr-2" /> : <Copy className="w-3 h-3 mr-2" />}
                                        {isCopied ? 'Copied' : 'Copy'}
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => setSelectedContent(null)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto bg-background flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border">
                                {/* Inputs Sidebar */}
                                <div className="p-6 md:w-1/3 bg-muted/10 space-y-4 overflow-y-auto">
                                    <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">Input Context</h4>
                                    {/* Dynamically render inputs based on config */}
                                    {getTemplateInfo(selectedContent.templateId).inputs.map(input => {
                                        const value = selectedContent.inputData[input.id]
                                        if (!value) return null
                                        return (
                                            <div key={input.id} className="space-y-1">
                                                <label className="text-xs font-medium text-muted-foreground">{input.label}</label>
                                                <p className="text-sm text-foreground bg-muted/40 p-2 rounded-md border border-border/50 break-words whitespace-pre-wrap">
                                                    {value}
                                                </p>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Generated Output */}
                                <div className="p-6 md:w-2/3 overflow-y-auto">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Generated Result</h4>
                                        <div className="flex bg-muted rounded-lg p-1">
                                            <button
                                                onClick={() => setViewMode('preview')}
                                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'preview'
                                                    ? 'bg-background text-foreground shadow-sm'
                                                    : 'text-muted-foreground hover:text-foreground'
                                                    }`}
                                            >
                                                Preview
                                            </button>
                                            <button
                                                onClick={() => setViewMode('markdown')}
                                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'markdown'
                                                    ? 'bg-background text-foreground shadow-sm'
                                                    : 'text-muted-foreground hover:text-foreground'
                                                    }`}
                                            >
                                                Raw Text
                                            </button>
                                        </div>
                                    </div>

                                    <div className={`prose dark:prose-invert max-w-none text-foreground leading-relaxed ${viewMode === 'preview' ? '' : 'whitespace-pre-wrap'}`}>
                                        {viewMode === 'preview' ? (
                                            <ReactMarkdown components={markdownComponents}>
                                                {selectedContent.outputText}
                                            </ReactMarkdown>
                                        ) : (
                                            <pre className="whitespace-pre-wrap font-mono text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg border border-border">
                                                {selectedContent.outputText}
                                            </pre>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-border bg-muted/30 flex justify-end">
                                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setSelectedContent(null)}>
                                    Done
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {itemToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setItemToDelete(null)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-md bg-card border border-border rounded-xl shadow-lg p-6 z-10"
                        >
                            <h3 className="text-lg font-semibold text-foreground mb-2">Delete Content?</h3>
                            <p className="text-muted-foreground mb-6">
                                Are you sure you want to delete this content? This action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setItemToDelete(null)}
                                    className="border-border text-foreground hover:bg-muted"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={performDelete}
                                    variant="ghost"
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                >
                                    Delete
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
