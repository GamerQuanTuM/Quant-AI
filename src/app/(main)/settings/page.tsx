'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, CreditCard, Bell, Key, Shield, Mail, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import axiosInstance from '@/lib/axios-instance'

const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
]


export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general')
    const { user } = useAuth();
    const [showGenerateModal, setShowGenerateModal] = useState(false)
    const [keyAlias, setKeyAlias] = useState('Default')
    const [isGenerating, setIsGenerating] = useState(false)

    const handleGenerateKey = async () => {
        setIsGenerating(true)
        try {
            await axiosInstance.post('/api/generate-token', { alias: keyAlias })
            setShowGenerateModal(false)
            setKeyAlias('Default')
        } catch (error) {
            console.error('Failed to generate key', error)
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Settings</h2>
                <p className="text-gray-400 mt-1">Manage your account preferences and settings.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <nav className="w-full md:w-64 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                activeTab === tab.id
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </nav>

                {/* Content Area */}
                <div className="flex-1 bg-[#18181b] border border-[#27272a] rounded-2xl p-6 md:p-8 min-h-[500px]">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-white">Profile Information</h3>
                                <div className="flex items-center gap-6 pb-6 border-b border-[#27272a]">
                                    <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-2xl font-bold text-white border-2 border-[#27272a]">
                                        JD
                                    </div>
                                    <div className="space-y-2">
                                        <Button variant="outline" className="text-white border-[#27272a] hover:bg-[#27272a]">Change Avatar</Button>
                                        <p className="text-xs text-gray-500">JPG, GIF or PNG. Max size of 800K</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">First Name</label>
                                        <Input value={user?.name?.split(" ")[0]} className="bg-zinc-900 border-zinc-800 text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Last Name</label>
                                        <Input value={user?.name?.split(" ")[1]} className="bg-zinc-900 border-zinc-800 text-white" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium text-gray-300">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                            <Input value={user?.email} className="pl-9 bg-zinc-900 border-zinc-800 text-white" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button className="bg-primary hover:bg-primary/90">
                                        <Save className="w-4 h-4 mr-2" /> Save Changes
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'billing' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-white">Current Plan</h3>
                                <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-primary/20 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-primary/20 rounded-lg text-primary">
                                            <Shield className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-white">Pro Plan</h4>
                                            <p className="text-sm text-gray-400">Next billing date: Jan 12, 2026</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                                        Manage Subscription
                                    </Button>
                                </div>

                                <h3 className="text-lg font-medium text-white mt-8">Payment Methods</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-[#27272a] rounded-xl bg-zinc-900/50">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-8 bg-white/10 rounded-md flex items-center justify-center text-xs text-white">VISA</div>
                                            <div>
                                                <p className="text-sm font-medium text-white">Visa ending in 4242</p>
                                                <p className="text-xs text-gray-500">Expiry 12/2028</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">Edit</Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'api' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-white">API Keys</h3>
                                <p className="text-sm text-gray-400">Manage your API keys to access the platform programmatically.</p>

                                <div className="p-4 border border-[#27272a] rounded-xl bg-zinc-900/50 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-white">Production Key</p>
                                            <p className="text-xs text-gray-500">Created on Dec 12, 2025</p>
                                        </div>
                                        <Button size="sm" className="h-8 bg-red-600 hover:bg-red-700 text-white">Revoke</Button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input readOnly value="sk_live_51M..." className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-mono text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50" />
                                        <Button variant="outline" size="icon" className="shrink-0 border-[#27272a] text-gray-400"><CreditCard className="w-4 h-4" /></Button>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => setShowGenerateModal(true)}
                                    variant="outline"
                                    className="w-full border-dashed border-[#27272a] text-gray-400 hover:text-white hover:bg-[#27272a]"
                                >
                                    + Generate New Key
                                </Button>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-white">Email Notifications</h3>
                                <div className="space-y-4">
                                    {['Product updates', 'Security alerts', 'Billing invoices', 'Weekly newsletter'].map((item) => (
                                        <div key={item} className="flex items-center justify-between py-2">
                                            <label className="text-sm text-gray-300">{item}</label>
                                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-600 bg-zinc-900 text-primary focus:ring-primary" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Generate Key Modal */}
                        <AnimatePresence>
                            {showGenerateModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setShowGenerateModal(false)}
                                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="relative w-full max-w-md bg-[#18181b] border border-[#27272a] rounded-xl p-6 shadow-2xl z-10"
                                    >
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <Key className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white">Generate New API Key</h3>
                                                <p className="text-sm text-gray-400">Enter a name for your new key.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-300">Key Alias</label>
                                                <Input
                                                    value={keyAlias}
                                                    onChange={(e) => setKeyAlias(e.target.value)}
                                                    placeholder="e.g. Development"
                                                    className="bg-zinc-900 border-zinc-800 text-white placeholder:text-gray-600 mt-2"
                                                />
                                            </div>

                                            <div className="flex justify-end gap-3 pt-2">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setShowGenerateModal(false)}
                                                    className="text-gray-400 hover:text-white"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    className="bg-primary hover:bg-primary/90 text-white"
                                                    onClick={handleGenerateKey}
                                                    disabled={isGenerating}
                                                >
                                                    {isGenerating ? 'Generating...' : 'Generate Key'}
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>

                    </motion.div>
                </div>
            </div>
        </div>
    )
}
