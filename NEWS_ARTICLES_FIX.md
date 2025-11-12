# News Articles Publishing Fix

## Problem
News articles were failing to publish with two critical errors:

### Error 1: Missing Component
```
Error: Expected component `Project` to be defined: you likely forgot to import, pass, or provide it.
    at /app/.next/server/app/blog/system-architecture-visualizer/page.js
```

### Error 2: Event Handler Serialization
```
Error: Event handlers cannot be passed to Client Component props.
  {src: ..., alt: ..., className: ..., onError: function onError}
                                                ^^^^^^^^^^^^^^^^
```

## Root Causes

### 1. Undefined `Project` Component
**File**: `app/blog/system-architecture-visualizer/page.mdx` (line 139)

The MDX file used a `<Project>` component that was never imported:
```jsx
<Button asChild size="lg">
  <Link href="/tools/system-architecture-visualizer">
    <Project className="mr-2 h-5 w-5" /> Visualize Your Architecture
  </Link>
</Button>
```

The `Project` icon doesn't exist in Lucide React. The file already imported `FolderKanban` which is the appropriate icon for this use case.

### 2. Event Handler Serialization Error
**File**: `mdx-components.tsx`

The MDX components configuration file was empty, which meant MDX was using its default `img` component. During server-side rendering (SSR) and build time, MDX's default behavior can generate event handlers like `onError`, `onLoad`, and `onClick` on image elements. 

In Next.js App Router, Server Components cannot pass non-serializable props (like functions) to Client Components. This caused the build to fail when MDX tried to render images with event handlers.

## Solutions Implemented

### Fix 1: Replace Undefined Component
**File**: `app/blog/system-architecture-visualizer/page.mdx`

**Before**:
```jsx
<Project className="mr-2 h-5 w-5" />
```

**After**:
```jsx
<FolderKanban className="mr-2 h-5 w-5" />
```

The `FolderKanban` icon is already imported at the top of the file and is semantically appropriate for visualizing architecture/projects.

### Fix 2: Custom MDX Image Component
**File**: `mdx-components.tsx`

**Before**:
```tsx
import type { MDXComponents } from 'mdx/types'
 
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  }
}
```

**After**:
```tsx
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
```

This custom implementation:
1. Explicitly destructures and filters out event handler props (`onError`, `onLoad`, `onClick`)
2. Only passes serializable props (`src`, `alt`, and safe props) to the img element
3. Adds consistent styling and lazy loading
4. Wraps images in a span for proper layout control

## How It Works

### MDX Rendering Flow
```
MDX File → Next.js MDX Plugin → useMDXComponents() → Custom Components → Rendered Output
```

1. **MDX Files**: Located in `app/blog/[slug]/page.mdx`
2. **MDX Configuration**: `next.config.mjs` sets up the MDX plugin
3. **Component Mapping**: `mdx-components.tsx` provides custom React components for MDX elements
4. **Custom Image Handler**: Filters out non-serializable props before rendering

### News Articles Rendering Flow
```
Database (Prisma) → Server Component → MarkdownRenderer (Client) → React-Markdown → Rendered Output
```

News articles stored in the database use the `MarkdownRenderer` component which already had proper event handler filtering in place.

## Testing

### Verify MDX Blog Posts
```bash
# Build the application
npm run build

# Check for build errors related to MDX
# Should complete without "Expected component" or "Event handlers" errors
```

### Verify News Articles
```bash
# Start development server
npm run dev

# Visit a news article
http://localhost:3001/news/[any-slug]

# Should render without errors
```

### Specific Test Case
Visit the system architecture visualizer blog post:
```
http://localhost:3001/blog/system-architecture-visualizer
```

Should render successfully with:
- ✅ FolderKanban icon in the CTA button
- ✅ All images rendering without console errors
- ✅ No serialization errors in production build

## Files Modified

1. **`app/blog/system-architecture-visualizer/page.mdx`**
   - Line 139: Changed `<Project>` to `<FolderKanban>`

2. **`mdx-components.tsx`**
   - Added custom `MdxImage` component
   - Configured `useMDXComponents` to use custom img handler

## Related Components (Already Working)

### `components/blog/markdown-renderer.tsx`
This Client Component already handles event handler filtering for news articles:
```tsx
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
```

No changes needed here - it was already filtering props correctly.

## Technical Details

### Why Event Handlers Can't Be Serialized

In Next.js App Router:
- **Server Components** (default) render on the server
- **Client Components** (marked with `"use client"`) render in the browser
- Data passed from Server to Client must be **serializable** (JSON-compatible)
- Functions cannot be serialized, so they can't be passed as props

When MDX is rendered in a Server Component and contains images with event handlers, Next.js throws this error because it can't serialize the function props to send to the client.

### Solution Strategy

Instead of trying to pass the entire MDX-generated component tree (with functions) to the client, we:
1. Intercept image rendering at the MDX component level
2. Filter out non-serializable props (functions) immediately
3. Pass only serializable props (strings, numbers, booleans) to the actual img elements

This happens during SSR, so only safe, serializable HTML reaches the client.

## Prevention

### Guidelines for MDX Files

1. **Always import components before using them**
   ```jsx
   import { FolderKanban } from "lucide-react"; // ✅ Good
   
   <FolderKanban className="h-5 w-5" /> // ✅ Works
   <Project className="h-5 w-5" /> // ❌ Undefined - will crash
   ```

2. **Use Next.js Image carefully in MDX**
   ```jsx
   import Image from "next/image"; // Use Next.js Image
   
   // But avoid event handlers in MDX context
   <Image src="/img.png" alt="Test" /> // ✅ Good
   <Image src="/img.png" alt="Test" onError={() => {}} /> // ❌ Will fail in SSR
   ```

3. **Prefer markdown image syntax when possible**
   ```markdown
   ![Alt text](/image.png) <!-- ✅ Handled by MdxImage component -->
   ```

### Guidelines for News Articles

News articles work differently:
- Stored in database as markdown or HTML
- Rendered using `MarkdownRenderer` Client Component
- Already have proper event handler filtering
- No MDX compilation involved

## Benefits

1. **Build Success**: Application builds without MDX errors
2. **Consistent Image Rendering**: All images follow the same styling
3. **Performance**: Lazy loading enabled for all images
4. **SEO**: Proper alt text and semantic HTML maintained
5. **Future-Proof**: Any new MDX files automatically use safe image rendering

## Next Steps

1. **Audit Other MDX Files**: Check if any other blog posts have similar issues
   ```bash
   # Search for undefined component usage
   grep -r "<[A-Z][a-zA-Z]*" app/blog/**/*.mdx | grep -v "import"
   ```

2. **Add Linting**: Consider adding an MDX linter to catch these issues during development

3. **Documentation**: Update contributor guidelines to include MDX best practices

---

**Status**: ✅ Fixed and Tested
**Date**: 2025-11-12
**Issues Resolved**: 
- Missing `Project` component in MDX
- Event handler serialization in MDX images
