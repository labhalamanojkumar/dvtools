"use client";

import ReactMarkdown from "react-markdown";
import Image from "next/image";

interface MarkdownRendererProps {
  content: string;
  remarkPlugins?: any[];
  rehypePlugins?: any[];
}

export function MarkdownRenderer({ content, remarkPlugins, rehypePlugins }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={remarkPlugins}
      rehypePlugins={rehypePlugins}
      components={{
        // Handle images without event handlers
        img: ({ node, ...props }) => {
          const { src, alt } = props;
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
        // Enhanced typography
        h1: ({ node, ...props }) => (
          <h1
            className="text-4xl font-bold mt-8 mb-4 text-foreground"
            {...props}
          />
        ),
        h2: ({ node, ...props }) => (
          <h2
            className="text-3xl font-semibold mt-6 mb-3 text-foreground"
            {...props}
          />
        ),
        h3: ({ node, ...props }) => (
          <h3
            className="text-2xl font-semibold mt-4 mb-2 text-foreground"
            {...props}
          />
        ),
        p: ({ node, ...props }) => (
          <p
            className="text-base leading-relaxed mb-4 text-muted-foreground"
            {...props}
          />
        ),
        a: ({ node, ...props }) => (
          <a
            className="text-primary hover:underline font-medium"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className="text-muted-foreground" {...props} />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground"
            {...props}
          />
        ),
        code: ({ node, inline, ...props }: any) =>
          inline ? (
            <code
              className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
              {...props}
            />
          ) : (
            <code
              className="block bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono my-4"
              {...props}
            />
          ),
        pre: ({ node, ...props }) => (
          <pre className="bg-muted rounded-lg overflow-x-auto my-4" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
