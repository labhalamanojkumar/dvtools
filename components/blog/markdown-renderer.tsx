"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";

interface MarkdownRendererProps {
  content: string;
}

// Keep markdown rendering inside a Client Component but avoid passing
// non-serializable plugin functions from server -> client. Import and
// use the plugins inside this client component instead.
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight, rehypeSanitize]}
      components={{
        // Handle images without event handlers (don't map to next/image here)
        img: ({ node, ...props }: any) => {
          const { src, alt } = props as any;
          return (
            <span className="block my-4">
              <img
                src={src || ""}
                alt={alt || ""}
                className="rounded-lg max-w-full h-auto"
                loading="lazy"
              />
            </span>
          );
        },
        // Typography and simple elements
        h1: ({ node, ...props }: any) => (
          <h1 className="text-4xl font-bold mt-8 mb-4 text-foreground" {...props} />
        ),
        h2: ({ node, ...props }: any) => (
          <h2 className="text-3xl font-semibold mt-6 mb-3 text-foreground" {...props} />
        ),
        h3: ({ node, ...props }: any) => (
          <h3 className="text-2xl font-semibold mt-4 mb-2 text-foreground" {...props} />
        ),
        p: ({ node, ...props }: any) => (
          <p className="text-base leading-relaxed mb-4 text-muted-foreground" {...props} />
        ),
        a: ({ node, ...props }: any) => (
          <a className="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer" {...props} />
        ),
        ul: ({ node, ...props }: any) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
        ol: ({ node, ...props }: any) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
        li: ({ node, ...props }: any) => <li className="text-muted-foreground" {...props} />,
        blockquote: ({ node, ...props }: any) => (
          <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground" {...props} />
        ),
        code: ({ node, inline, ...props }: any) =>
          inline ? (
            <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
          ) : (
            <code className="block bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono my-4" {...props} />
          ),
        pre: ({ node, ...props }: any) => <pre className="bg-muted rounded-lg overflow-x-auto my-4" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
