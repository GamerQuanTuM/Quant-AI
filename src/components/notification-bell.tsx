'use client'

import { useState, useEffect } from 'react'
import { Bell, X, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSocket } from '@/hooks/use-socket'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'
import axiosInstance from '@/lib/axios-instance'

type Notification = {
    id: string
    type: string
    message: string
    createdAt: string
    read: boolean
}

export function NotificationBell() {
    const { socket } = useSocket()
    const { user } = useAuth()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [hasUnread, setHasUnread] = useState(false)

    useEffect(() => {
        if (!user) return

        // Fetch initial notifications
        axiosInstance.get('/api/notifications')
            .then(res => {
                setNotifications(res.data)
                // Check if there are any unread notifications
                if (res.data.some((n: Notification) => !n.read)) {
                    setHasUnread(true)
                }
            })
            .catch(err => console.error("Failed to fetch notifications", err))

        if (!socket) return
        socket.emit('join', { userId: user.id })

        socket.on('notification', (data: Notification) => {
            console.log('Received notification:', data)
            setNotifications(prev => [data, ...prev])
            setHasUnread(true)
        })

        return () => {
            socket.off('notification')
        }
    }, [socket, user])

    const handleOpen = () => {
        setIsOpen(!isOpen)
        if (!isOpen) {
            setHasUnread(false)
        }
    }

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()

        // Optimistic update
        setNotifications(prev => prev.filter(n => n.id !== id))

        try {
            await axiosInstance.delete(`/api/notifications/${id}`)
        } catch (error) {
            console.error("Failed to delete notification", error)
            // Revert on failure (could be improved with SWR/React Query but keeping it simple)
        }
    }

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground relative"
                onClick={handleOpen}
            >
                <Bell className="w-5 h-5" />
                {hasUnread && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-background" />
                )}
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                            aria-hidden="true"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-card border border-border rounded-xl shadow-xl z-50 flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-card/95 backdrop-blur-sm">
                                <h3 className="font-semibold text-foreground">Notifications</h3>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground text-sm">
                                        No new notifications
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border">
                                        {notifications.map((notif) => (
                                            <div key={notif.id} className="p-4 hover:bg-muted/50 transition-colors group relative pr-10">
                                                <p className="text-sm text-foreground">{notif.message}</p>
                                                <span className="text-xs text-muted-foreground mt-1 block">
                                                    {new Date(notif.createdAt || Date.now()).toLocaleTimeString()}
                                                </span>
                                                <button
                                                    onClick={(e) => handleDelete(notif.id, e)}
                                                    className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                                    title="Delete notification"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
