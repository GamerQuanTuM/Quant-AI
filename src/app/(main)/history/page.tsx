'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Trash2, FileText, AlertTriangle, X, Check, History as HistoryIcon, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import axiosInstance from '@/lib/axios-instance'
import { useEffect, useState } from 'react'
import { History } from '../../../../generated/prisma'
import { useSocket } from '@/hooks/use-socket'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'

const historyItems = [
    { id: 1, template: 'LinkedIn Post', preview: 'Excited to announce our new feature launch! This has been...', date: 'Just now', },
    { id: 2, template: 'Blog Outline', preview: '1. Introduction to AI\n2. The Current Landscape\n3. Future Predictions...', date: '2 hours ago', },
    { id: 3, template: 'Email Reply', preview: 'Hi Sarah,\n\nThanks for reaching out. I would love to schedule a call...', date: 'Yesterday' },
    { id: 4, template: 'Twitter Thread', preview: '1/5 Why design systems matter more than ever.\n\nConsistency is key...', date: 'Yesterday' },
    { id: 5, template: 'Product Description', preview: 'Meet the future of productivity. Our new tool combines...', date: '2 days ago' },
]

export default function HistoryPage() {

    const [history, setHistory] = useState<History[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const { socket } = useSocket()
    const { user } = useAuth()

    const fetchHistory = async () => {
        try {
            const response = await axiosInstance.get('/api/history')
            const data = await response.data
            if (response.status === 200) {
                setHistory(data)
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleCopy = (content: string, id: string) => {
        navigator.clipboard.writeText(content)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const handleDeleteClick = (id: string) => {
        setDeleteId(id)
    }

    const confirmDelete = async () => {
        if (!deleteId) return

        setIsDeleting(true)
        try {
            const response = await axiosInstance.delete(`/api/history`, {
                params: {
                    historyId: deleteId
                }
            })

            if (response.status === 200) {
                setHistory(prev => prev.filter(item => item.id !== deleteId))
                setDeleteId(null)
            }
        } catch (error) {
            console.error("Failed to delete history item", error)
        } finally {
            setIsDeleting(false)
        }
    }

    useEffect(() => {
        if (user?.id && socket) {
            socket.emit('join', { userId: user.id })
        }
    }, [user, socket])

    useEffect(() => {
        fetchHistory()
    }, [])

    useEffect(() => {
        socket?.on('content-generate', (data: { message: History }) => {
            setHistory((prev) => [data.message, ...prev])
        })

        return () => {
            socket?.off('content-generate')
        }
    }, [socket])

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground mb-1">Content History</h2>
                <p className="text-muted-foreground">A timeline of everything you've generated.</p>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center p-12">
                    {/* You might want to use a formal Loader component if available, or just text/spinner */}
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : history.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
                    <div className="p-4 bg-muted/50 rounded-full mb-4">
                        <HistoryIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No history yet</h3>
                    <p className="text-muted-foreground max-w-md mb-8">
                        You haven't generated any content yet. Start creating amazing content with our AI templates.
                    </p>
                    <Link href="/templates">
                        <Button className="gap-2">
                            <PlusCircle className="w-4 h-4" />
                            Start Generating
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm text-muted-foreground">
                        <thead className="bg-muted/50 text-foreground font-medium border-b border-border">
                            <tr>
                                <th className="px-6 py-4">Content</th>
                                <th className="px-6 py-4">Template</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {history.map((item, i) => (
                                <motion.tr
                                    key={item.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group hover:bg-muted/50 transition-colors"
                                >
                                    <td className="px-6 py-4 max-w-md">
                                        <div className="flex gap-3">
                                            <div className="mt-1 min-w-[32px] w-8 h-8 rounded bg-muted flex items-center justify-center text-muted-foreground border border-border">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <div>
                                                {item.templateSlug === "code-generation" ? (
                                                    <div className="bg-muted p-2 rounded text-xs font-mono break-all whitespace-pre-wrap border border-border/50 text-foreground/80 line-clamp-2 max-w-[450px]">
                                                        {item.aiResponse}
                                                    </div>
                                                ) : (
                                                    <p className="text-foreground font-medium mb-1 line-clamp-2">
                                                        {item.aiResponse}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-foreground">{item.templateSlug.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</td>
                                    <td className="px-6 py-4">{new Date(item.createdAt).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                title="Copy"
                                                onClick={() => handleCopy(item.aiResponse || "", item.id)}
                                            >
                                                {copiedId === item.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                title="Delete"
                                                onClick={() => handleDeleteClick(item.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <AnimatePresence>
                {deleteId && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDeleteId(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 bg-background border border-border rounded-2xl shadow-2xl z-50"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-destructive/10 rounded-lg text-destructive">
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-foreground">Delete Item</h2>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setDeleteId(null)} className="text-muted-foreground hover:text-foreground">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <p className="text-muted-foreground mb-6">
                                Are you sure you want to delete this history item? This action cannot be undone.
                            </p>

                            <div className="flex justify-end gap-3">
                                <Button variant="ghost" onClick={() => setDeleteId(null)} disabled={isDeleting} className="text-muted-foreground hover:text-foreground">
                                    Cancel
                                </Button>
                                <Button
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                >
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
