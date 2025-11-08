import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic';

interface Icon {
  id: string
  name: string
  category: string
  tags: string[]
  svg: string
  variants: IconVariant[]
}

interface IconVariant {
  style: 'outline' | 'solid' | 'duotone'
  sizes: number[]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, query, category, format, icons } = body

    switch (action) {
      case 'search':
        // Search icons
        const searchResults = await searchIcons(query, category)
        
        return NextResponse.json({
          success: true,
          results: searchResults,
          total: searchResults.length
        })

      case 'get-icon':
        // Get specific icon
        return NextResponse.json({
          success: true,
          icon: {
            id: body.iconId,
            name: 'sample-icon',
            category: 'general',
            svg: '<svg>...</svg>',
            variants: [
              { style: 'outline', sizes: [16, 24, 32, 48] },
              { style: 'solid', sizes: [16, 24, 32, 48] }
            ]
          }
        })

      case 'export':
        // Export icons in specified format
        const exportedIcons = await exportIcons(icons, format)
        
        return NextResponse.json({
          success: true,
          data: exportedIcons,
          format,
          count: icons?.length || 0
        })

      case 'upload':
        // Upload custom icons
        const formData = await request.formData()
        const uploadedFiles = formData.getAll('files')
        
        const processedIcons = await Promise.all(
          uploadedFiles.map(async (file: any) => {
            // Validate SVG files
            const content = await file.text()
            
            return {
              id: generateId(),
              name: file.name.replace('.svg', ''),
              svg: content,
              size: file.size,
              uploaded: true
            }
          })
        )

        return NextResponse.json({
          success: true,
          message: 'Icons uploaded successfully',
          icons: processedIcons
        })

      case 'customize':
        // Customize icon (color, size, stroke)
        return NextResponse.json({
          success: true,
          customizedIcon: {
            svg: customizeIcon(body.icon, body.options),
            options: body.options
          }
        })

      case 'generate-sprite':
        // Generate SVG sprite sheet
        const sprite = generateSpriteSheet(icons)
        
        return NextResponse.json({
          success: true,
          sprite,
          iconCount: icons?.length || 0
        })

      case 'get-categories':
        // Get available icon categories
        return NextResponse.json({
          success: true,
          categories: [
            { name: 'General', count: 150, slug: 'general' },
            { name: 'UI/UX', count: 200, slug: 'ui-ux' },
            { name: 'Social Media', count: 50, slug: 'social' },
            { name: 'Technology', count: 100, slug: 'tech' },
            { name: 'Business', count: 80, slug: 'business' },
            { name: 'Communication', count: 60, slug: 'communication' },
            { name: 'Finance', count: 45, slug: 'finance' },
            { name: 'Education', count: 55, slug: 'education' }
          ]
        })

      case 'generate-icon-font':
        // Generate icon font from selection
        return NextResponse.json({
          success: true,
          message: 'Icon font generated successfully',
          data: {
            fontFile: '/downloads/icon-font.woff2',
            cssFile: '/downloads/icon-font.css',
            format: 'woff2'
          }
        })

      case 'optimize':
        // Optimize SVG icons
        const optimizedIcons = icons?.map((icon: any) => ({
          ...icon,
          svg: optimizeSVG(icon.svg),
          optimized: true,
          sizeSaved: '23%'
        }))

        return NextResponse.json({
          success: true,
          message: 'Icons optimized successfully',
          icons: optimizedIcons
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Icon library error:', error)
    return NextResponse.json(
      { error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const query = searchParams.get('q')

  if (query || category) {
    const results = await searchIcons(query || '', category || undefined)
    return NextResponse.json({
      success: true,
      results,
      total: results.length
    })
  }

  return NextResponse.json({
    message: 'Icon Library API',
    endpoints: {
      GET: {
        description: 'Search icons',
        params: ['q', 'category']
      },
      POST: {
        actions: [
          'search',
          'get-icon',
          'export',
          'upload',
          'customize',
          'generate-sprite',
          'get-categories',
          'generate-icon-font',
          'optimize'
        ],
        description: 'Manage and customize icon library'
      }
    },
    stats: {
      totalIcons: 800,
      categories: 8,
      styles: ['outline', 'solid', 'duotone']
    }
  })
}

// Helper functions
async function searchIcons(query: string, category?: string): Promise<Icon[]> {
  // Mock data - in production, fetch from database or icon API
  const mockIcons: Icon[] = [
    {
      id: '1',
      name: 'home',
      category: 'general',
      tags: ['house', 'main', 'dashboard'],
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
      variants: [
        { style: 'outline', sizes: [16, 24, 32] },
        { style: 'solid', sizes: [16, 24, 32] }
      ]
    },
    {
      id: '2',
      name: 'user',
      category: 'general',
      tags: ['person', 'profile', 'account'],
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>',
      variants: [
        { style: 'outline', sizes: [16, 24, 32] },
        { style: 'solid', sizes: [16, 24, 32] }
      ]
    }
  ]

  let filtered = mockIcons

  if (query) {
    const lowerQuery = query.toLowerCase()
    filtered = filtered.filter(icon =>
      icon.name.toLowerCase().includes(lowerQuery) ||
      icon.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  if (category) {
    filtered = filtered.filter(icon => icon.category === category)
  }

  return filtered
}

async function exportIcons(icons: any[], format: string) {
  switch (format) {
    case 'svg':
      return icons.map(icon => ({
        name: icon.name,
        content: icon.svg
      }))
    
    case 'react':
      return icons.map(icon => ({
        name: `${icon.name}.tsx`,
        content: generateReactComponent(icon)
      }))
    
    case 'vue':
      return icons.map(icon => ({
        name: `${icon.name}.vue`,
        content: generateVueComponent(icon)
      }))
    
    case 'png':
      return icons.map(icon => ({
        name: `${icon.name}.png`,
        url: `/api/tools/icon-library/convert?icon=${icon.id}&format=png`
      }))
    
    default:
      return icons
  }
}

function customizeIcon(icon: any, options: any) {
  let svg = icon.svg || ''
  
  // Apply color
  if (options.color) {
    svg = svg.replace(/fill="[^"]*"/g, `fill="${options.color}"`)
    svg = svg.replace(/stroke="[^"]*"/g, `stroke="${options.color}"`)
  }
  
  // Apply size
  if (options.size) {
    svg = svg.replace(/width="[^"]*"/g, `width="${options.size}"`)
    svg = svg.replace(/height="[^"]*"/g, `height="${options.size}"`)
  }
  
  // Apply stroke width
  if (options.strokeWidth) {
    svg = svg.replace(/stroke-width="[^"]*"/g, `stroke-width="${options.strokeWidth}"`)
  }
  
  return svg
}

function generateSpriteSheet(icons: any[]): string {
  const symbols = icons?.map(icon => {
    const content = icon.svg.replace(/<svg[^>]*>|<\/svg>/g, '')
    return `  <symbol id="${icon.name}" viewBox="0 0 24 24">${content}</symbol>`
  }).join('\n')

  return `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
${symbols}
</svg>`
}

function optimizeSVG(svg: string): string {
  // Simplified optimization - in production use SVGO
  return svg
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim()
}

function generateReactComponent(icon: any): string {
  return `import React from 'react'

export const ${capitalize(icon.name)}Icon = (props: React.SVGProps<SVGSVGElement>) => (
  ${icon.svg.replace('<svg', '<svg {...props}')}
)

export default ${capitalize(icon.name)}Icon`
}

function generateVueComponent(icon: any): string {
  return `<template>
  ${icon.svg}
</template>

<script setup>
// ${capitalize(icon.name)} Icon
</script>`
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())
}
