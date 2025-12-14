'use client'

import { useState } from 'react'
import { ArrowLeft, Plus, MoreHorizontal, FileText, Calendar, Clock, X, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

// Dummy content for the prototype
const dummyContent = [
    {
        id: 1,
        title: 'Announcement Post',
        type: 'LinkedIn Post',
        date: 'Just now',
        status: 'Draft',
        content: "Exciting news! 🚀 We are thrilled to announce the launch of our Q4 Marketing Campaign. Our team has been working hard to bring you the best tools for content creation.\n\n#Marketing #Growth #AI"
    },
    {
        id: 2,
        title: 'Key Features Thread',
        type: 'Twitter Thread',
        date: '2 hours ago',
        status: 'Review',
        content: "1/5 Introducing new AI capabilities.\n\n2/5 Generate faster than ever.\n\n3/5 Dark mode is finally here! 🌙\n\n4/5 Export to any platform easily.\n\n5/5 Sign up today for early access."
    },
    {
        id: 3,
        title: 'Introduction Email',
        type: 'Email Reply',
        date: 'Yesterday',
        status: 'Completed',
        content: "Hi [Client Name],\n\nThanks for reaching out! I'd love to schedule a time to chat about how our new features can help your workflow.\n\nBest,\nJohn"
    },
]

export default function ProjectDetailsPage() {
    const params = useParams()
    const [selectedContent, setSelectedContent] = useState<typeof dummyContent[0] | null>(null)
    const [isCopied, setIsCopied] = useState(false)

    const projectTitle = (params.slug as string).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

    const handleCopy = () => {
        if (!selectedContent) return
        navigator.clipboard.writeText(selectedContent.content)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
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
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-foreground">{projectTitle}</h1>
                            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20">Active</span>
                        </div>
                        <p className="text-muted-foreground mt-1 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Created today • 3 files
                        </p>
                    </div>
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
                {dummyContent.map((item, i) => (
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
                                <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">{item.title}</h4>
                                <p className="text-sm text-muted-foreground">{item.type}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" /> {item.date}
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                            ${item.status === 'Draft' ? 'bg-muted text-muted-foreground' :
                                    item.status === 'Completed' ? 'bg-blue-500/10 text-blue-500' :
                                        'bg-amber-500/10 text-amber-500'}`}>
                                {item.status}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-foreground"
                                onClick={() => setSelectedContent(item)}
                            >
                                View
                            </Button>
                        </div>
                    </motion.div>
                ))}
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
                                        <h3 className="font-bold text-foreground max-w-[300px] truncate">{selectedContent.title}</h3>
                                        <p className="text-xs text-muted-foreground">{selectedContent.type} • {selectedContent.date}</p>
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

                            <div className="p-6 overflow-y-auto bg-background">
                                <div className="prose dark:prose-invert max-w-none text-foreground whitespace-pre-wrap leading-relaxed">
                                    {selectedContent.content}
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
        </div>
    )
}
