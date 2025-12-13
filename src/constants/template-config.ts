export const TEMPLATE_CONFIG: Record<string, { title: string; inputs: { id: string; label: string; type: 'text' | 'textarea' | 'select'; placeholder?: string; options?: string[] }[] }> = {
    'linkedin-post': {
        title: 'LinkedIn Post Generator',
        inputs: [
            { id: 'topic', label: 'Topic or Subject', type: 'text', placeholder: 'e.g., The future of remote work' },
            { id: 'audience', label: 'Target Audience', type: 'text', placeholder: 'e.g., HR Managers, Tech Leaders' },
            { id: 'takeaways', label: 'Key Takeaways', type: 'textarea', placeholder: 'Points to cover...' },
            { id: 'tone', label: 'Tone', type: 'select', options: ['Professional', 'Casual', 'Thought Leadership', 'Empathetic'] }
        ]
    },
    'twitter-thread': {
        title: 'Twitter Thread Creator',
        inputs: [
            { id: 'topic', label: 'Thread Topic', type: 'text', placeholder: 'e.g., 5 Tips for Productivity' },
            { id: 'points', label: 'Key Points (Bullet inputs)', type: 'textarea', placeholder: 'List your main points here...' },
            { id: 'tone', label: 'Tone', type: 'select', options: ['Engaging', 'Informative', 'Viral', 'Casual'] }
        ]
    },
    'blog-post': {
        title: 'Blog Post Writer',
        inputs: [
            { id: 'title', label: 'Blog Title / Topic', type: 'text', placeholder: 'e.g., Ultimate Guide to React' },
            { id: 'keywords', label: 'SEO Keywords', type: 'text', placeholder: 'react, hooks, performance' },
            { id: 'outline', label: 'Rough Outline (Optional)', type: 'textarea', placeholder: 'Intro, Body, Conclusion...' },
            { id: 'tone', label: 'Tone', type: 'select', options: ['Educational', 'Professional', 'Storytelling', 'Opinionated'] }
        ]
    },
    'email-reply': {
        title: 'Email Reply Generator',
        inputs: [
            { id: 'sender', label: 'Who sent the email?', type: 'text', placeholder: 'e.g., Client Name' },
            { id: 'context', label: 'Original Email / Context', type: 'textarea', placeholder: 'Paste the email you received or describe it...' },
            { id: 'response_points', label: 'Key Points to Hit', type: 'textarea', placeholder: 'Yes I can attend, Price is $500, etc.' },
            { id: 'tone', label: 'Tone', type: 'select', options: ['Professional', 'Friendly', 'Firm', 'Grateful'] }
        ]
    },
    'default': {
        title: 'AI Content Generator',
        inputs: [
            { id: 'prompt', label: 'What should I write?', type: 'textarea', placeholder: 'Describe what you need...' },
            { id: 'tone', label: 'Tone', type: 'select', options: ['Professional', 'Casual', 'Creative'] }
        ]
    }
}
