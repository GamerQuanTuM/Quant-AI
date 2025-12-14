'use client'

import { motion } from 'framer-motion'
import { Copy, Trash2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

const historyItems = [
    { id: 1, template: 'LinkedIn Post', preview: 'Excited to announce our new feature launch! This has been...', date: 'Just now', project: 'Q4 Social Media' },
    { id: 2, template: 'Blog Outline', preview: '1. Introduction to AI\n2. The Current Landscape\n3. Future Predictions...', date: '2 hours ago', project: 'General' },
    { id: 3, template: 'Email Reply', preview: 'Hi Sarah,\n\nThanks for reaching out. I would love to schedule a call...', date: 'Yesterday', project: 'Client Comms' },
    { id: 4, template: 'Twitter Thread', preview: '1/5 Why design systems matter more than ever.\n\nConsistency is key...', date: 'Yesterday', project: 'Personal Brand' },
    { id: 5, template: 'Product Description', preview: 'Meet the future of productivity. Our new tool combines...', date: '2 days ago', project: 'Product Launch' },
]

export default function HistoryPage() {
    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground mb-1">Content History</h2>
                <p className="text-muted-foreground">A timeline of everything you've generated.</p>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm text-muted-foreground">
                    <thead className="bg-muted/50 text-foreground font-medium border-b border-border">
                        <tr>
                            <th className="px-6 py-4">Content</th>
                            <th className="px-6 py-4">Template</th>
                            <th className="px-6 py-4">Project</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {historyItems.map((item, i) => (
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
                                            <p className="text-foreground font-medium mb-1 truncate">{item.preview}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-foreground">{item.template}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-foreground border border-border text-xs">{item.project}</span>
                                </td>
                                <td className="px-6 py-4">{item.date}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Copy">
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" title="Delete">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
