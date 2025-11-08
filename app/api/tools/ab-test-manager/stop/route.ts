import { NextRequest, NextResponse } from 'next/server'
import { experimentManager } from '@/lib/experiment-manager'

// POST /api/tools/ab-test-manager/[id]/stop - Stop experiment
export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').slice(-2)[0] // Get experiment ID from URL

    if (!id) {
      return NextResponse.json(
        { error: 'Experiment ID is required', success: false },
        { status: 400 }
      )
    }

    const experiment = experimentManager.getExperiment(id)

    if (!experiment) {
      return NextResponse.json(
        { error: 'Experiment not found', success: false },
        { status: 404 }
      )
    }

    if (experiment.status !== 'running') {
      return NextResponse.json(
        { error: 'Experiment can only be stopped when running', success: false },
        { status: 400 }
      )
    }

    // Stop simulation and complete experiment
    experimentManager.completeExperiment(id, 'stopped')

    const updatedExperiment = experimentManager.getExperiment(id)

    return NextResponse.json({
      experiment: updatedExperiment,
      success: true,
      message: 'Experiment stopped successfully'
    })

  } catch (error) {
    console.error('Error stopping experiment:', error)
    return NextResponse.json(
      { error: 'Failed to stop experiment', success: false },
      { status: 500 }
    )
  }
}