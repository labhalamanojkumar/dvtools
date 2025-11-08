import { NextRequest, NextResponse } from 'next/server'
import { experimentManager } from '@/lib/experiment-manager'

// GET /api/tools/ab-test-manager - List all experiments
export async function GET() {
  try {
    const experiments = experimentManager.getExperiments()
    return NextResponse.json({
      experiments,
      total: experiments.length,
      success: true
    })
  } catch (error) {
    console.error('Error fetching experiments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch experiments', success: false },
      { status: 500 }
    )
  }
}

// POST /api/tools/ab-test-manager - Create new experiment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.description) {
      return NextResponse.json(
        { error: 'Name and description are required', success: false },
        { status: 400 }
      )
    }

    if (!body.variants || body.variants.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 variants are required', success: false },
        { status: 400 }
      )
    }

    if (!body.metrics || body.metrics.length === 0) {
      return NextResponse.json(
        { error: 'At least 1 metric is required', success: false },
        { status: 400 }
      )
    }

    // Create new experiment
    const newExperiment = {
      id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: body.name,
      description: body.description,
      status: body.status || 'draft',
      variants: body.variants,
      metrics: body.metrics,
      targetAudience: body.targetAudience || '',
      duration: body.duration || 14,
      trafficAllocation: body.trafficAllocation || 100,
      confidenceLevel: body.confidenceLevel || 95,
      statisticalSignificance: body.statisticalSignificance || 0,
      winner: body.winner || null,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const experiment = experimentManager.addExperiment(newExperiment)

    return NextResponse.json({
      experiment,
      success: true
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating experiment:', error)
    return NextResponse.json(
      { error: 'Failed to create experiment', success: false },
      { status: 500 }
    )
  }
}

// PUT /api/tools/ab-test-manager/[id] - Update experiment
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return NextResponse.json(
        { error: 'Experiment ID is required', success: false },
        { status: 400 }
      )
    }

    const body = await request.json()
    const experiment = experimentManager.updateExperiment(id, body)

    if (!experiment) {
      return NextResponse.json(
        { error: 'Experiment not found', success: false },
        { status: 404 }
      )
    }

    return NextResponse.json({
      experiment,
      success: true
    })

  } catch (error) {
    console.error('Error updating experiment:', error)
    return NextResponse.json(
      { error: 'Failed to update experiment', success: false },
      { status: 500 }
    )
  }
}

// DELETE /api/tools/ab-test-manager/[id] - Delete experiment
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return NextResponse.json(
        { error: 'Experiment ID is required', success: false },
        { status: 400 }
      )
    }

    const experiment = experimentManager.deleteExperiment(id)

    if (!experiment) {
      return NextResponse.json(
        { error: 'Experiment not found', success: false },
        { status: 404 }
      )
    }

    return NextResponse.json({
      experiment,
      success: true
    })

  } catch (error) {
    console.error('Error deleting experiment:', error)
    return NextResponse.json(
      { error: 'Failed to delete experiment', success: false },
      { status: 500 }
    )
  }
}