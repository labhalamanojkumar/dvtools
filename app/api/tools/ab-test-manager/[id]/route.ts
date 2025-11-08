import { NextRequest, NextResponse } from 'next/server'

// Shared experiments storage (in production, use a database)
let experiments: any[] = []

// PUT /api/tools/ab-test-manager/[id] - Update experiment
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const experimentId = params.id
    const body = await request.json()

    const experimentIndex = experiments.findIndex(exp => exp.id === experimentId)

    if (experimentIndex === -1) {
      return NextResponse.json(
        { error: 'Experiment not found', success: false },
        { status: 404 }
      )
    }

    // Update experiment
    experiments[experimentIndex] = {
      ...experiments[experimentIndex],
      ...body,
      updatedAt: new Date()
    }

    return NextResponse.json({
      experiment: experiments[experimentIndex],
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
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const experimentId = params.id

    const experimentIndex = experiments.findIndex(exp => exp.id === experimentId)

    if (experimentIndex === -1) {
      return NextResponse.json(
        { error: 'Experiment not found', success: false },
        { status: 404 }
      )
    }

    const deletedExperiment = experiments.splice(experimentIndex, 1)[0]

    return NextResponse.json({
      experiment: deletedExperiment,
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