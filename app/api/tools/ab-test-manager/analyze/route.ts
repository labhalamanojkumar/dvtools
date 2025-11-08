import { NextRequest, NextResponse } from 'next/server'
import { experimentManager } from '@/lib/experiment-manager'

// POST /api/tools/ab-test-manager/[id]/analyze - Analyze experiment results
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

    // Perform statistical analysis using the experiment manager
    const analysis = experimentManager.performStatisticalAnalysis(experiment)

    // Update experiment with analysis results
    const updatedExperiment = experimentManager.updateExperiment(id, {
      statisticalSignificance: analysis.significance,
      winner: analysis.winner
    })

    return NextResponse.json({
      experiment: updatedExperiment,
      analysis,
      success: true
    })

  } catch (error) {
    console.error('Error analyzing experiment:', error)
    return NextResponse.json(
      { error: 'Failed to analyze experiment', success: false },
      { status: 500 }
    )
  }
}

// Perform statistical analysis on experiment variants
function performStatisticalAnalysis(experiment: any) {
  const variants = experiment.variants
  if (!variants || variants.length < 2) {
    return {
      significance: 0,
      winner: null,
      confidenceIntervals: [],
      recommendations: ['Not enough variants for analysis']
    }
  }

  const controlVariant = variants.find((v: any) => v.isControl)
  if (!controlVariant) {
    return {
      significance: 0,
      winner: null,
      confidenceIntervals: [],
      recommendations: ['No control variant found']
    }
  }

  const results = []
  let winner = null
  let maxImprovement = 0

  for (const variant of variants) {
    if (variant.isControl) continue

    // Calculate improvement over control
    const improvement = variant.conversionRate - controlVariant.conversionRate
    const relativeImprovement = controlVariant.conversionRate > 0
      ? (improvement / controlVariant.conversionRate) * 100
      : 0

    // Simple statistical significance test (t-test approximation)
    const significance = calculateStatisticalSignificance(controlVariant, variant)

    results.push({
      variantId: variant.id,
      variantName: variant.name,
      improvement,
      relativeImprovement,
      significance,
      confidence: variant.confidence
    })

    // Determine winner
    if (significance >= experiment.confidenceLevel / 100 && relativeImprovement > maxImprovement) {
      maxImprovement = relativeImprovement
      winner = variant.name
    }
  }

  const recommendations = generateRecommendations(results, experiment)

  return {
    significance: results.length > 0 ? Math.max(...results.map(r => r.significance)) : 0,
    winner,
    confidenceIntervals: results,
    recommendations
  }
}

// Simplified statistical significance calculation
function calculateStatisticalSignificance(control: any, variant: any) {
  // This is a simplified calculation. In production, use proper statistical libraries
  const controlRate = control.conversionRate / 100
  const variantRate = variant.conversionRate / 100

  const controlVisitors = control.visitors
  const variantVisitors = variant.visitors

  if (controlVisitors < 30 || variantVisitors < 30) {
    return 0 // Not enough sample size
  }

  // Calculate standard error
  const se = Math.sqrt(
    (controlRate * (1 - controlRate) / controlVisitors) +
    (variantRate * (1 - variantRate) / variantVisitors)
  )

  if (se === 0) return 0

  // Calculate z-score
  const zScore = Math.abs(variantRate - controlRate) / se

  // Convert z-score to confidence level (approximate)
  // This is a rough approximation - use statistical libraries for production
  if (zScore >= 2.576) return 0.99 // 99% confidence
  if (zScore >= 1.96) return 0.95  // 95% confidence
  if (zScore >= 1.645) return 0.90 // 90% confidence
  if (zScore >= 1.282) return 0.80 // 80% confidence

  return 0
}

// Generate recommendations based on analysis
function generateRecommendations(results: any[], experiment: any) {
  const recommendations = []

  if (results.length === 0) {
    recommendations.push('Run the experiment longer to collect more data')
    return recommendations
  }

  const significantResults = results.filter(r => r.significance >= experiment.confidenceLevel / 100)

  if (significantResults.length === 0) {
    recommendations.push('No statistically significant results yet. Continue running the experiment.')
    recommendations.push('Consider increasing sample size or extending test duration.')
  } else {
    const bestResult = significantResults.reduce((best, current) =>
      current.relativeImprovement > best.relativeImprovement ? current : best
    )

    recommendations.push(`Variant "${bestResult.variantName}" shows significant improvement of ${bestResult.relativeImprovement.toFixed(1)}%`)
    recommendations.push('Consider implementing the winning variant')
  }

  // Check sample sizes
  const totalVisitors = experiment.variants.reduce((sum: number, v: any) => sum + v.visitors, 0)
  if (totalVisitors < 1000) {
    recommendations.push('Low sample size detected. Consider running the test longer for more reliable results.')
  }

  return recommendations
}