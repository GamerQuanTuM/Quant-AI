import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Components } from 'react-markdown'

interface MarkdownRendererProps {
    content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    const markdownComponents: Components = {
        h1: ({ node, ...props }: any) => <h1 className="text-2xl font-bold text-foreground mt-6 mb-4" {...props} />,
        h2: ({ node, ...props }: any) => <h2 className="text-xl font-semibold text-foreground mt-5 mb-3" {...props} />,
        h3: ({ node, ...props }: any) => <h3 className="text-lg font-medium text-foreground mt-4 mb-2" {...props} />,
        p: ({ node, ...props }: any) => <p className="text-muted-foreground mb-3 leading-relaxed" {...props} />,
        ul: ({ node, ...props }: any) => <ul className="list-disc pl-5 text-muted-foreground mb-3" {...props} />,
        ol: ({ node, ...props }: any) => <ol className="list-decimal pl-5 text-muted-foreground mb-3" {...props} />,
        li: ({ node, ...props }: any) => <li className="mb-1" {...props} />,
        strong: ({ node, ...props }: any) => <strong className="font-semibold text-foreground" {...props} />,
        em: ({ node, ...props }: any) => <em className="italic text-muted-foreground" {...props} />,
        blockquote: ({ node, ...props }: any) => (
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-3" {...props} />
        ),
        code: ({ node, inline, className, children, ...props }: any) =>
            inline ? (
                <code className="text-primary font-bold italic text-sm font-mono" {...props}>{children}</code>
            ) : (
                <code className="text-foreground text-sm font-mono" {...props}>{children}</code>
            ),
        pre: ({ node, ...props }: any) => <pre className="my-3 overflow-x-auto bg-muted p-4 rounded-lg" {...props} />,
        a: ({ node, ...props }: any) => <a className="text-primary hover:text-primary/80 underline" {...props} />,
        table: ({ node, ...props }: any) => <div className="overflow-x-auto my-4 rounded-md border border-border"><table className="w-full text-left order-collapse" {...props} /></div>,
        thead: ({ node, ...props }: any) => <thead className="bg-muted text-muted-foreground" {...props} />,
        tbody: ({ node, ...props }: any) => <tbody className="divide-y divide-border" {...props} />,
        tr: ({ node, ...props }: any) => <tr className="hover:bg-muted/50 transition-colors" {...props} />,
        th: ({ node, ...props }: any) => <th className="px-4 py-3 text-sm font-medium border-b border-r border-border last:border-r-0" {...props} />,
        td: ({ node, ...props }: any) => <td className="px-4 py-3 text-sm border-r border-border last:border-r-0" {...props} />,
    }

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
        >
            {content}
        </ReactMarkdown>
    )
}
