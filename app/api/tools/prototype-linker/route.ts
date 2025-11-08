import { NextRequest, NextResponse } from 'next/server'
import { PROTOTYPES } from './store'

interface Prototype {
  id: string
  name: string
  url: string
  description?: string
  screens: Screen[]
  hotspots: Hotspot[]
  createdAt: Date
  updatedAt: Date
}



interface Screen {
  id: string
  name: string
  imageUrl?: string
  order: number
}

interface Hotspot {
  id: string
  screenId: string
  targetScreenId: string
  x: number
  y: number
  width: number
  height: number
  action: 'navigate' | 'overlay' | 'back'
}

export async function POST(request: NextRequest) {
  try {
    // Detect content type first so file uploads (multipart/form-data)
    // are handled without attempting to parse JSON.
    const contentType = request.headers.get('content-type') || ''

    let body: any = {}
    let formData: FormData | null = null

    if (contentType.includes('multipart/form-data')) {
      formData = await request.formData()
      body.action = formData.get('action')?.toString() || 'upload-screens'
      // leave other fields to be read from formData when needed
    } else {
      body = await request.json()
    }

    const { action, prototype, screenId, hotspot } = body

    switch (action) {
      case 'create':
        // Create new prototype and persist in-memory
        const newPrototype: Prototype = {
          id: generateId(),
          name: prototype?.name || 'New Prototype',
          url: generateUniqueUrl(prototype?.name),
          description: prototype?.description || '',
          screens: [],
          hotspots: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }

        PROTOTYPES.push(newPrototype)

        return NextResponse.json({ success: true, message: 'Prototype created successfully', prototype: newPrototype })

      case 'add-screen':
        // Add screen to prototype
        if (!body.prototypeId) {
          return NextResponse.json({ success: false, message: 'prototypeId required' }, { status: 400 })
        }

        const protoForScreen = PROTOTYPES.find(p => p.id === body.prototypeId)
        if (!protoForScreen) {
          return NextResponse.json({ success: false, message: 'Prototype not found' }, { status: 404 })
        }

        const newScreen: Screen = {
          id: generateId(),
          name: body.screenName || 'New Screen',
          imageUrl: body.imageUrl || '',
          order: body.order ?? protoForScreen.screens.length
        }

        protoForScreen.screens.push(newScreen)
        protoForScreen.updatedAt = new Date()

        return NextResponse.json({ success: true, message: 'Screen added successfully', screen: newScreen })

      case 'add-hotspot':
        // Add interactive hotspot
        if (!body.prototypeId) {
          return NextResponse.json({ success: false, message: 'prototypeId required' }, { status: 400 })
        }

        const protoForHotspot = PROTOTYPES.find(p => p.id === body.prototypeId)
        if (!protoForHotspot) {
          return NextResponse.json({ success: false, message: 'Prototype not found' }, { status: 404 })
        }

        const newHotspot: Hotspot = {
          id: generateId(),
          screenId: hotspot.screenId,
          targetScreenId: hotspot.targetScreenId,
          x: hotspot.x,
          y: hotspot.y,
          width: hotspot.width || 100,
          height: hotspot.height || 100,
          action: hotspot.action || 'navigate'
        }

        protoForHotspot.hotspots.push(newHotspot)
        protoForHotspot.updatedAt = new Date()

        return NextResponse.json({ success: true, message: 'Hotspot added successfully', hotspot: newHotspot })

      case 'link-screens':
        // Create navigation link between screens
        return NextResponse.json({
          success: true,
          message: 'Screens linked successfully',
          link: {
            from: body.fromScreenId,
            to: body.toScreenId,
            transition: body.transition || 'slide'
          }
        })

      case 'generate-share-link':
        // Generate shareable prototype link
        if (!body.prototypeId) return NextResponse.json({ success: false, message: 'prototypeId required' }, { status: 400 })
        const protoForShare = PROTOTYPES.find(p => p.id === body.prototypeId)
        if (!protoForShare) return NextResponse.json({ success: false, message: 'Prototype not found' }, { status: 404 })

        const shareUrl = `${request.headers.get('x-forwarded-proto') || 'https'}://${request.headers.get('host') || 'localhost'}/prototypes/${body.prototypeId}`

        return NextResponse.json({ success: true, message: 'Share link generated', shareUrl, embedCode: `<iframe src="${shareUrl}" width="100%" height="800"></iframe>` })

      case 'upload-screens':
        // Handle screen image uploads. Prefer formData parsed earlier
        // (when content-type was multipart/form-data). Fall back to
        // parsing formData here if not already parsed.
        const fd = formData ?? (await request.formData())
        const uploadedFiles = fd.getAll('files')

        const screens = await Promise.all(
          uploadedFiles.map(async (file: any, index) => {
            // In production, upload to cloud storage
            return {
              id: generateId(),
              name: file.name,
              imageUrl: `/uploads/${file.name}`,
              order: index,
              size: file.size
            }
          })
        )
        // If a prototypeId is provided in the form data, attach screens to it
        const protoIdFromForm = fd.get('prototypeId')?.toString()
        if (protoIdFromForm) {
          const proto = PROTOTYPES.find(p => p.id === protoIdFromForm)
          if (proto) {
            proto.screens.push(...screens.map((s: any) => ({ id: s.id, name: s.name, imageUrl: s.imageUrl, order: s.order })))
            proto.updatedAt = new Date()
          }
        }

        return NextResponse.json({ success: true, message: 'Screens uploaded successfully', screens })

      case 'export':
        // Export prototype for sharing
        if (!body.prototypeId) return NextResponse.json({ success: false, message: 'prototypeId required' }, { status: 400 })
        const protoToExport = PROTOTYPES.find(p => p.id === body.prototypeId)
        if (!protoToExport) return NextResponse.json({ success: false, message: 'Prototype not found' }, { status: 404 })

        return NextResponse.json({ success: true, message: 'Prototype exported successfully', data: { format: body.format || 'html', downloadUrl: `/api/tools/prototype-linker/download/${body.prototypeId}` } })

      case 'get-prototype':
        // Retrieve prototype by ID
        if (!body.prototypeId) return NextResponse.json({ success: false, message: 'prototypeId required' }, { status: 400 })
        const found = PROTOTYPES.find(p => p.id === body.prototypeId)
        if (!found) return NextResponse.json({ success: false, message: 'Prototype not found' }, { status: 404 })
        return NextResponse.json({ success: true, prototype: found })

      case 'list':
        // List all prototypes
        return NextResponse.json({ success: true, prototypes: PROTOTYPES })

      case 'delete':
        // Delete prototype
        if (!body.prototypeId) return NextResponse.json({ success: false, message: 'prototypeId required' }, { status: 400 })
        const index = PROTOTYPES.findIndex(p => p.id === body.prototypeId)
        if (index === -1) return NextResponse.json({ success: false, message: 'Prototype not found' }, { status: 404 })
        PROTOTYPES.splice(index, 1)
        return NextResponse.json({ success: true, message: 'Prototype deleted successfully' })

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Prototype linker error:', error)
    return NextResponse.json(
      { error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const prototypeId = searchParams.get('id')

  if (prototypeId) {
    return NextResponse.json({
      success: true,
      prototype: {
        id: prototypeId,
        name: 'Sample Prototype',
        url: `/prototypes/${prototypeId}`,
        screens: [],
        hotspots: []
      }
    })
  }

  return NextResponse.json({
    message: 'Prototype Linker API',
    endpoints: {
      GET: {
        description: 'Get prototype by ID',
        params: ['id']
      },
      POST: {
        actions: [
          'create',
          'add-screen',
          'add-hotspot',
          'link-screens',
          'generate-share-link',
          'upload-screens',
          'export',
          'get-prototype',
          'list',
          'delete'
        ],
        description: 'Create and manage interactive prototypes'
      }
    }
  })
}

// Helper functions
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function generateUniqueUrl(name?: string): string {
  const slug = name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'prototype'
  return `${slug}-${Date.now()}`
}
