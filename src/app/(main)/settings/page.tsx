'use client'

import { use, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, CreditCard, Bell, Key, Shield, Mail, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import axiosInstance from '@/lib/axios-instance'
import { Token } from '../../../../generated/prisma'

const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
    { id: 'providers', label: 'AI Providers', icon: Shield },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
]


export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general')
    const { user } = useAuth();
    const [showGenerateModal, setShowGenerateModal] = useState(false)
    const [keyAlias, setKeyAlias] = useState('Default')
    const [isGenerating, setIsGenerating] = useState(false)
    const [tokens, setTokens] = useState<Token[] | null>(null)
    const [generatedToken, setGeneratedToken] = useState<string | null>(null)
    const [isCopied, setIsCopied] = useState(false)
    const [keyToRevoke, setKeyToRevoke] = useState<Token | null>(null)

    // Provider Settings State
    const [openRouterKey, setOpenRouterKey] = useState('')
    const [openaiKey, setOpenaiKey] = useState('')
    const [googleKey, setGoogleKey] = useState('')
    const [groqKey, setGroqKey] = useState('')
    const [anthropicKey, setAnthropicKey] = useState('')
    const [isProviderSaved, setIsProviderSaved] = useState(false)

    useEffect(() => {
        const orKey = localStorage.getItem('openrouter_key')
        if (orKey) setOpenRouterKey(orKey)

        const oaKey = localStorage.getItem('openai_key')
        if (oaKey) setOpenaiKey(oaKey)

        const gKey = localStorage.getItem('google_key')
        if (gKey) setGoogleKey(gKey)

        const grKey = localStorage.getItem('groq_key')
        if (grKey) setGroqKey(grKey)

        const aKey = localStorage.getItem('anthropic_key')
        if (aKey) setAnthropicKey(aKey)
    }, [])

    const handleSaveProviderKey = () => {
        if (openRouterKey) localStorage.setItem('openrouter_key', openRouterKey)
        if (openaiKey) localStorage.setItem('openai_key', openaiKey)
        if (googleKey) localStorage.setItem('google_key', googleKey)
        if (groqKey) localStorage.setItem('groq_key', groqKey)
        if (anthropicKey) localStorage.setItem('anthropic_key', anthropicKey)

        setIsProviderSaved(true)
        setTimeout(() => setIsProviderSaved(false), 2000)
    }

    const handleGenerateKey = async () => {
        setIsGenerating(true)
        try {
            const res = await axiosInstance.post('/api/generate-token', { alias: keyAlias })
            setGeneratedToken(res.data.token) // Display the token
            fetchUserTokens() // Refresh list
        } catch (error) {
            console.error('Failed to generate key', error)
        } finally {
            setIsGenerating(false)
        }
    }

    const handleRevokeKey = async () => {
        if (!keyToRevoke) return;
        try {
            await axiosInstance.delete('/api/token', {
                data: {
                    tokenId: keyToRevoke.id
                }
            })
            setTokens(tokens?.filter(t => t.id !== keyToRevoke.id) || null)
            setKeyToRevoke(null)
        } catch (error) {
            console.error('Failed to revoke key', error)
        }
    }

    const handleCopyToken = () => {
        if (generatedToken) {
            navigator.clipboard.writeText(generatedToken)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        }
    }

    const handleCloseModal = () => {
        setShowGenerateModal(false)
        setGeneratedToken(null)
        setKeyAlias('Default')
        setIsCopied(false)
    }

    const fetchUserTokens = async () => {
        const response = await axiosInstance.get('/api/token');
        setTokens(response.data)
    };

    useEffect(() => {
        fetchUserTokens()
    }, [])

    console.log(tokens)


    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Settings</h2>
                <p className="text-muted-foreground mt-1">Manage your account preferences and settings.</p>
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
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </nav>

                {/* Content Area */}
                <div className="flex-1 bg-card border border-border rounded-2xl p-6 md:p-8 min-h-[500px] shadow-sm">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-foreground">Profile Information</h3>
                                <div className="flex items-center gap-6 pb-6 border-b border-border">
                                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-foreground border-2 border-border">
                                        JD
                                    </div>
                                    <div className="space-y-2">
                                        <Button variant="outline" className="text-foreground border-border hover:bg-accent">Change Avatar</Button>
                                        <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 800K</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">First Name</label>
                                        <Input value={user?.name?.split(" ")[0]} className="bg-background border-input text-foreground" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                                        <Input value={user?.name?.split(" ")[1]} className="bg-background border-input text-foreground" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input value={user?.email} className="pl-9 bg-background border-input text-foreground" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                        <Save className="w-4 h-4 mr-2" /> Save Changes
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'providers' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-foreground">AI Provider Configuration</h3>
                                    <p className="text-sm text-muted-foreground mt-1">Configure your own AI provider keys to use in the generator.</p>

                                    <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-3">
                                        <Shield className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                        <div className="text-sm text-amber-500/90">
                                            <p className="font-medium text-amber-500">Security Disclaimer</p>
                                            <p>Your API keys are stored <strong>locally in your browser</strong> using LocalStorage. They are never saved to our servers/database. They are sent directly from your browser to our backend only when generating content, and are not logged.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <div className="flex items-end justify-between">
                                        <h4 className="text-sm font-semibold text-foreground">API Keys</h4>
                                        <Button onClick={handleSaveProviderKey} className="bg-primary text-primary-foreground hover:bg-primary/90">
                                            {isProviderSaved ? "Saved!" : "Save All Keys"}
                                        </Button>
                                    </div>

                                    {/* OpenRouter */}
                                    <div className="space-y-2 p-4 bg-muted/30 rounded-lg border border-border">
                                        <label className="text-sm font-medium text-foreground">OpenRouter API Key</label>
                                        <Input
                                            type="password"
                                            value={openRouterKey}
                                            onChange={(e) => setOpenRouterKey(e.target.value)}
                                            placeholder="sk-or-..."
                                            className="bg-background border-input text-foreground mt-1"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Access Llama, Mistral, & many others. <a href="https://openrouter.ai/keys" target="_blank" className="underline hover:text-foreground">Get Key</a>
                                        </p>
                                    </div>

                                    {/* OpenAI */}
                                    <div className="space-y-2 p-4 bg-muted/30 rounded-lg border border-border">
                                        <label className="text-sm font-medium text-foreground">OpenAI API Key</label>
                                        <Input
                                            type="password"
                                            value={openaiKey}
                                            onChange={(e) => setOpenaiKey(e.target.value)}
                                            placeholder="sk-..."
                                            className="bg-background border-input text-foreground mt-1"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            For GPT-4, GPT-3.5 models. <a href="https://platform.openai.com/api-keys" target="_blank" className="underline hover:text-foreground">Get Key</a>
                                        </p>
                                    </div>

                                    {/* Google Gemini */}
                                    <div className="space-y-2 p-4 bg-muted/30 rounded-lg border border-border">
                                        <label className="text-sm font-medium text-foreground">Google Gemini API Key</label>
                                        <Input
                                            type="password"
                                            value={googleKey}
                                            onChange={(e) => setGoogleKey(e.target.value)}
                                            placeholder="AIza..."
                                            className="bg-background border-input text-foreground mt-1"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            For Gemini Pro models. <a href="https://aistudio.google.com/app/apikey" target="_blank" className="underline hover:text-foreground">Get Key</a>
                                        </p>
                                    </div>

                                    {/* Groq */}
                                    <div className="space-y-2 p-4 bg-muted/30 rounded-lg border border-border">
                                        <label className="text-sm font-medium text-foreground">Groq API Key</label>
                                        <Input
                                            type="password"
                                            value={groqKey}
                                            onChange={(e) => setGroqKey(e.target.value)}
                                            placeholder="gsk_..."
                                            className="bg-background border-input text-foreground mt-1"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            For ultra-fast inference (Llama, Mixtral). <a href="https://console.groq.com/keys" target="_blank" className="underline hover:text-foreground">Get Key</a>
                                        </p>
                                    </div>

                                    {/* Anthropic */}
                                    <div className="space-y-2 p-4 bg-muted/30 rounded-lg border border-border">
                                        <label className="text-sm font-medium text-foreground">Anthropic API Key</label>
                                        <Input
                                            type="password"
                                            value={anthropicKey}
                                            onChange={(e) => setAnthropicKey(e.target.value)}
                                            placeholder="sk-ant-..."
                                            className="bg-background border-input text-foreground mt-1"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            For Claude 3.5 Sonnet & Opus. <a href="https://console.anthropic.com/settings/keys" target="_blank" className="underline hover:text-foreground">Get Key</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'billing' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-foreground">Current Plan</h3>
                                <div className="p-4 rounded-xl bg-accent/20 border border-primary/20 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-primary/20 rounded-lg text-primary">
                                            <Shield className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground">Pro Plan</h4>
                                            <p className="text-sm text-muted-foreground">Next billing date: Jan 12, 2026</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10">
                                        Manage Subscription
                                    </Button>
                                </div>

                                <h3 className="text-lg font-medium text-foreground mt-8">Payment Methods</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-muted/30">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-8 bg-background rounded-md flex items-center justify-center text-xs text-foreground border border-border">VISA</div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">Visa ending in 4242</p>
                                                <p className="text-xs text-muted-foreground">Expiry 12/2028</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Edit</Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'api' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-foreground">API Keys</h3>
                                <p className="text-sm text-muted-foreground">Manage your API keys to access the platform programmatically.</p>

                                {tokens?.map((token) => (
                                    <div key={token.id} className="p-4 border border-border rounded-xl bg-muted/30 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-foreground">{token?.alias}</p>
                                                <p className="text-xs text-muted-foreground mt-1">Created on {new Date(token?.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <Button size="sm" className="h-8 bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={() => setKeyToRevoke(token)}>Revoke</Button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input readOnly value={`${token?.token.substring(0, 100)}...`} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-mono text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50" />
                                            <Button variant="outline" size="icon" className="shrink-0 border-border text-muted-foreground"><CreditCard className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                ))}



                                <Button
                                    onClick={() => setShowGenerateModal(true)}
                                    variant="outline"
                                    className="w-full border-dashed border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                                >
                                    + Generate New Key
                                </Button>

                                <div className="mt-8 border-t border-border pt-6">
                                    <h4 className="text-lg font-medium text-foreground mb-4">API Documentation</h4>

                                    <div className="space-y-6">
                                        {/* Authentication */}
                                        <div className="space-y-2">
                                            <h5 className="text-sm font-semibold text-foreground">Authentication</h5>
                                            <p className="text-sm text-muted-foreground">
                                                Include your API key in the Authorization header of your requests.
                                            </p>
                                            <div className="bg-muted p-3 rounded-md border border-border overflow-x-auto relative group">
                                                <code className="text-xs font-mono text-foreground">Authorization: Bearer YOUR_API_KEY</code>
                                            </div>
                                        </div>

                                        {/* Get Projects */}
                                        <div className="space-y-2">
                                            <h5 className="text-sm font-semibold text-foreground">Get All Projects</h5>
                                            <p className="text-sm text-muted-foreground">Retrieve list of all your projects.</p>
                                            <div className="bg-muted p-3 rounded-md border border-border overflow-x-auto">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">GET</span>
                                                    <span className="text-xs font-mono text-muted-foreground">/api/public/get-projects</span>
                                                </div>
                                                <code className="text-xs font-mono text-foreground block whitespace-pre">
                                                    {`curl -X GET "${typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api/public/get-projects" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                                                </code>
                                            </div>
                                        </div>

                                        {/* Get Single Project */}
                                        <div className="space-y-2">
                                            <h5 className="text-sm font-semibold text-foreground">Get Project</h5>
                                            <p className="text-sm text-muted-foreground">Retrieve a specific project by its slug.</p>
                                            <div className="bg-muted p-3 rounded-md border border-border overflow-x-auto">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">GET</span>
                                                    <span className="text-xs font-mono text-muted-foreground">/api/public/get-project/[slug]</span>
                                                </div>
                                                <code className="text-xs font-mono text-foreground block whitespace-pre">
                                                    {`curl -X GET "${typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api/public/get-project/my-project-slug?content=true" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                                                </code>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Query Params: <code className="bg-muted px-1.5 py-0.5 rounded border border-border text-foreground font-mono">content=true</code> to include project content.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-foreground">Email Notifications</h3>
                                <div className="space-y-4">
                                    {['Product updates', 'Security alerts', 'Billing invoices', 'Weekly newsletter'].map((item) => (
                                        <div key={item} className="flex items-center justify-between py-2">
                                            <label className="text-sm text-muted-foreground">{item}</label>
                                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-input bg-background text-primary focus:ring-primary" />
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
                                        onClick={handleCloseModal}
                                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="relative w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-2xl z-10"
                                    >
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <Key className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground">Generate New API Key</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {generatedToken ? "Your token has been generated successfully." : "Enter a name for your new key."}
                                                </p>
                                            </div>
                                        </div>

                                        {generatedToken ? (
                                            <div className="space-y-4">
                                                <div className="p-4 bg-muted rounded-lg border border-border break-all font-mono text-sm text-primary">
                                                    {generatedToken}
                                                </div>
                                                <p className="text-xs text-amber-500">
                                                    Make sure to copy your personal access token now. You won't be able to see it again!
                                                </p>
                                                <div className="flex justify-end gap-3 pt-2">
                                                    <Button variant="outline" onClick={handleCopyToken} className="border-border text-foreground hover:bg-accent">
                                                        {isCopied ? "Copied!" : "Copy Token"}
                                                    </Button>
                                                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleCloseModal}>
                                                        Done
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">Key Alias</label>
                                                    <Input
                                                        value={keyAlias}
                                                        onChange={(e) => setKeyAlias(e.target.value)}
                                                        placeholder="e.g. Development"
                                                        className="bg-background border-input text-foreground placeholder:text-muted-foreground mt-2"
                                                    />
                                                </div>

                                                <div className="flex justify-end gap-3 pt-2">
                                                    <Button
                                                        variant="ghost"
                                                        onClick={handleCloseModal}
                                                        className="text-muted-foreground hover:text-foreground"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                                        onClick={handleGenerateKey}
                                                        disabled={isGenerating}
                                                    >
                                                        {isGenerating ? 'Generating...' : 'Generate Key'}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>

                        {/* Revoke Confirmation Modal */}
                        <AnimatePresence>
                            {keyToRevoke && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setKeyToRevoke(null)}
                                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="relative w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-2xl z-10"
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                                                <Shield className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground">Revoke API Key?</h3>
                                                <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
                                            </div>
                                        </div>

                                        <p className="text-muted-foreground mb-6">
                                            Are you sure you want to revoke <span className="font-semibold text-foreground">"{keyToRevoke.alias}"</span>?
                                            Any applications using this key will immediately lose access.
                                        </p>

                                        <div className="flex justify-end gap-3">
                                            <Button variant="ghost" onClick={() => setKeyToRevoke(null)} className="text-muted-foreground hover:text-foreground">
                                                Cancel
                                            </Button>
                                            <Button
                                                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                                onClick={handleRevokeKey}
                                            >
                                                Revoke Key
                                            </Button>
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


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWo3N3oweGowMDAwbzBqbGw1N2lyY2E3IiwiaWF0IjoxNzY2Mjk1ODEyfQ.n3HZvcffH9VM0EIAmPLSIGXThW5oa1iJHvmi21SXEbo