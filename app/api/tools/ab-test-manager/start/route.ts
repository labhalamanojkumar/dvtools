import { NextRequest, NextResponse } from 'next/server'
import { experimentManager } from '@/lib/experiment-manager'

// POST /api/tools/ab-test-manager/[id]/start - Start experiment
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

    if (experiment.status !== 'draft' && experiment.status !== 'paused') {
      return NextResponse.json(
        { error: 'Experiment can only be started from draft or paused status', success: false },
        { status: 400 }
      )
    }

    // Update experiment status and start simulation
    const updatedExperiment = experimentManager.updateExperiment(id, {
      status: 'running',
      startDate: experiment.startDate || new Date()
    })

    // Start real-time simulation
    experimentManager.startSimulation(id)

    return NextResponse.json({
      experiment: updatedExperiment,
      success: true,
      message: 'Experiment started with real-time simulation'
    })

  } catch (error) {
    console.error('Error starting experiment:', error)
    return NextResponse.json(
      { error: 'Failed to start experiment', success: false },
      { status: 500 }
    )
  }
}