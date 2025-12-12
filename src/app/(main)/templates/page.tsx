'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, PenTool, Linkedin, Mail, Twitter, FileText, Instagram, Video, Mic } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const categories = ["All", "Social Media", "Blog", "Email", "Video", "Productivity"]

const templates = [
    { id: 'linkedin-post', title: 'LinkedIn Post', description: 'Professional updates & thought leadership.', icon: Linkedin, category: 'Social Media', popular: true },
    { id: 'twitter-thread', title: 'Twitter Thread', description: 'Engaging threads to grow your audience.', icon: Twitter, category: 'Social Media' },
    { id: 'instagram-caption', title: 'Instagram Caption', description: 'Catchy captions for your photos.', icon: Instagram, category: 'Social Media' },
    { id: 'blog-post', title: 'Blog Post', description: 'Full SEO-optimized articles.', icon: PenTool, category: 'Blog', popular: true },
    { id: 'blog-outline', title: 'Blog Outline', description: 'Structure your thoughts effectively.', icon: FileText, category: 'Blog' },
    { id: 'email-reply', title: 'Email Reply', description: 'Professional responses in seconds.', icon: Mail, category: 'Email' },
    { id: 'video-script', title: 'Video Script', description: 'Scripts for YouTube & TikTok.', icon: Video, category: 'Video' },
    { id: 'podcast-intro', title: 'Podcast Intro', description: 'Hook your listeners immediately.', icon: Mic, category: 'Video' },
]

export default function TemplatesPage() {
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [searchQuery, setSearchQuery] = useState("")

    const filteredTemplates = templates.filter(t => {
        const matchesCategory = selectedCategory === "All" || t.category === selectedCategory
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Templates</h2>
                    <p className="text-gray-400 mt-1">Choose a template to start generating content.</p>
                </div>
                <div className="w-full md:w-72 relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search templates..."
                        className="pl-9 bg-[#18181b] border-[#27272a] text-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 pb-4 border-b border-[#27272a]">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all",
                            selectedCategory === category
                                ? "bg-primary text-white shadow-lg shadow-primary/25"
                                : "bg-[#18181b] text-gray-400 hover:text-white hover:bg-[#27272a]"
                        )}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTemplates.map((template) => (
                    <Link href={`/generator?template=${template.id}`}>
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="h-full p-6 rounded-2xl bg-[#18181b] border border-[#27272a] hover:border-primary/50 cursor-pointer transition-all group flex flex-col"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800 text-primary group-hover:scale-110 transition-transform duration-300">
                                    <template.icon className="w-6 h-6" />
                                </div>
                                {template.popular && (
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full">Popular</span>
                                )}
                            </div>
                            <h3 className="font-semibold text-white mb-2 group-hover:text-primary transition-colors">{template.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2">{template.description}</p>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
