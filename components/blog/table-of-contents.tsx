'use client';

import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

export function TableOfContents({ content, className = '' }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const items: TOCItem[] = [];
    
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const title = match[2].trim();
      const id = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      items.push({ id, title, level });
    }
    
    setTocItems(items);

    // Setup intersection observer for active heading tracking
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    // Observe all heading elements
    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [content]);

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <nav className={`space-y-2 ${className}`}>
      <h3 className="text-sm font-semibold text-muted-foreground mb-3">
        Table of Contents
      </h3>
      <ul className="space-y-1">
        {tocItems.map((item) => (
          <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 12}px` }}>
            <a
              href={`#${item.id}`}
              className={`flex items-center py-1 text-sm transition-colors hover:text-primary ${
                activeId === item.id
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground'
              }`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
              }}
            >
              <ChevronRight className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{item.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}