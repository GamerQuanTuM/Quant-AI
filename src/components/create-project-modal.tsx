'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, FolderPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useModal } from '@/lib/modal-context'
import { useState } from 'react'

export function CreateProjectModal() {
    const { isCreateProjectOpen, closeCreateProject } = useModal()
    const [projectName, setProjectName] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // In a real app, this would make an API call
        console.log('Creating project:', projectName)
        setProjectName('')
        closeCreateProject()
        // Could add toast notification here
    }

    return (
        <AnimatePresence>
            {isCreateProjectOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCreateProject}
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
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <FolderPlus className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-semibold text-foreground">Create Project</h2>
                            </div>
                            <Button variant="ghost" size="icon" onClick={closeCreateProject} className="text-muted-foreground hover:text-foreground">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Project Name</label>
                                <Input
                                    placeholder="e.g., Q1 Marketing Campaign"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    className="bg-muted border-input text-foreground"
                                    autoFocus
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button type="button" variant="ghost" onClick={closeCreateProject} className="text-muted-foreground hover:text-foreground">
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                    Create Project
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
