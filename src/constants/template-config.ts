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
            { id: 'sender', label: 'Who sent the email?', placeholder: 'e.g., Sender Name', type: 'text' },
            { id: 'receipent', label: 'Who is the receipent?', placeholder: 'e.g., Receipent Name', type: 'text' },
            { id: 'context', label: 'Original Email / Context', placeholder: 'Paste the email you received or describe it...', type: 'textarea' },
            { id: 'response_points', label: 'Key Points to Hit', placeholder: 'Yes I can attend, Price is $500, etc.', type: 'textarea' },
            { id: 'tone', label: 'Tone', placeholder: 'e.g., Professional', type: 'select', options: ['Professional', 'Friendly', 'Firm', 'Grateful'] }
        ]
    },
    'instagram-caption': {
        title: 'Instagram Caption Generator',
        inputs: [
            { id: 'description', label: 'Photo/Video Description', type: 'textarea', placeholder: 'Describe your image or video...' },
            { id: 'tone', label: 'Tone', type: 'select', options: ['Fun', 'Inspirational', 'Sarcastic', 'Minimalist'] }
        ]
    },
    'code-generation': {
        title: 'AI Code Generator',
        inputs: [
            { id: 'description', label: 'What code do you need?', type: 'textarea', placeholder: 'e.g., A React component for a navbar...' },
            { id: 'language', label: 'Programming Language', type: 'text', placeholder: 'e.g., Python, TypeScript, SQL' },
            { id: 'context', label: 'Additional Context (Optional)', type: 'textarea', placeholder: 'Any specific libraries or constraints...' }
        ]
    },
    'video-script': {
        title: 'Video Script Writer',
        inputs: [
            { id: 'topic', label: 'Video Topic', type: 'text', placeholder: 'e.g., How to learn coding' },
            { id: 'platform', label: 'Platform', type: 'select', options: ['YouTube', 'TikTok', 'Instagram Reels'] },
            { id: 'tone', label: 'Tone', type: 'select', options: ['Educational', 'Entertaining', 'Storytelling'] }
        ]
    },
    'podcast-intro': {
        title: 'Podcast Intro Generator',
        inputs: [
            { id: 'podcastName', label: 'Podcast Name', type: 'text', placeholder: 'e.g., The Tech Daily' },
            { id: 'episodeTopic', label: 'Episode Topic', type: 'text', placeholder: 'e.g., AI Agents' },
            { id: 'guest', label: 'Guest Name (Optional)', type: 'text', placeholder: 'e.g., Sam Altman' },
            { id: 'tone', label: 'Tone', type: 'select', options: ['Energetic', 'Calm', 'Professional', 'Mystery'] }
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
