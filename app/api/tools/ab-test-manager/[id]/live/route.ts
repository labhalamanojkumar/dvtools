import { NextRequest } from 'next/server'
import { experimentManager } from '@/lib/experiment-manager'

// GET /api/tools/ab-test-manager/[id]/live - Real-time experiment updates
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const id = url.pathname.split('/').slice(-2)[0] // Get experiment ID from URL

  if (!id) {
    return new Response('Experiment ID is required', { status: 400 })
  }

  const experiment = experimentManager.getExperiment(id)
  if (!experiment) {
    return new Response('Experiment not found', { status: 404 })
  }

  // Create Server-Sent Events response
  const stream = new ReadableStream({
    start(controller) {
      // Send initial experiment data
      const data = `data: ${JSON.stringify({
        type: 'experiment',
        experiment
      })}\n\n`
      controller.enqueue(new TextEncoder().encode(data))

      // Set up listener for real-time updates
      const listener = (updatedExperiment: any) => {
        const updateData = `data: ${JSON.stringify({
          type: 'experiment',
          experiment: updatedExperiment
        })}\n\n`
        controller.enqueue(new TextEncoder().encode(updateData))
      }

      experimentManager.addListener(id, listener)

      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
        experimentManager.removeListener(id, listener)
        controller.close()
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  })
}