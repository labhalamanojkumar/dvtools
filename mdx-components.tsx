import type { MDXComponents } from 'mdx/types'
import { ReactNode } from 'react'

// Custom img component for MDX that doesn't use event handlers
function MdxImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const { src, alt, ...rest } = props
  // Filter out any event handlers that might be passed
  const { onError, onLoad, onClick, ...safeProps } = rest as any
  return (
    <span className="block my-4">
      <img
        src={src}
        alt={alt}
        {...safeProps}
        className="rounded-lg max-w-full h-auto"
        loading="lazy"
      />
    </span>
  )
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Provide custom img component to prevent event handler serialization
    img: MdxImage,
    ...components,
  }
}
