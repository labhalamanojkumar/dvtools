import { NextRequest, NextResponse } from 'next/server'

// Shared experiment data store with real-time simulation
class ExperimentManager {
  private experiments: any[] = []
  private simulationIntervals: Map<string, NodeJS.Timeout> = new Map()
  private listeners: Map<string, ((experiment: any) => void)[]> = new Map()

  constructor() {
    // Start periodic cleanup of old experiments
    setInterval(() => this.cleanupOldExperiments(), 24 * 60 * 60 * 1000) // Daily cleanup
  }

  // Get all experiments
  getExperiments() {
    return this.experiments
  }

  // Get experiment by ID
  getExperiment(id: string) {
    return this.experiments.find(exp => exp.id === id)
  }

  // Add new experiment
  addExperiment(experiment: any) {
    this.experiments.push(experiment)
    this.notifyListeners(experiment.id, experiment)
    return experiment
  }

  // Update experiment
  updateExperiment(id: string, updates: any) {
    const index = this.experiments.findIndex(exp => exp.id === id)
    if (index !== -1) {
      this.experiments[index] = { ...this.experiments[index], ...updates, updatedAt: new Date() }
      this.notifyListeners(id, this.experiments[index])
      return this.experiments[index]
    }
    return null
  }

  // Delete experiment
  deleteExperiment(id: string) {
    const index = this.experiments.findIndex(exp => exp.id === id)
    if (index !== -1) {
      const experiment = this.experiments.splice(index, 1)[0]
      this.stopSimulation(id)
      this.listeners.delete(id)
      return experiment
    }
    return null
  }

  // Start real-time simulation for an experiment
  startSimulation(experimentId: string) {
    const experiment = this.getExperiment(experimentId)
    if (!experiment || experiment.status !== 'running') return

    // Stop existing simulation if any
    this.stopSimulation(experimentId)

    // Start new simulation
    const interval = setInterval(() => {
      this.simulateTraffic(experimentId)
    }, 2000) // Update every 2 seconds

    this.simulationIntervals.set(experimentId, interval)
  }

  // Stop simulation for an experiment
  stopSimulation(experimentId: string) {
    const interval = this.simulationIntervals.get(experimentId)
    if (interval) {
      clearInterval(interval)
      this.simulationIntervals.delete(experimentId)
    }
  }

  // Simulate traffic and conversions for running experiments
  private simulateTraffic(experimentId: string) {
    const experiment = this.getExperiment(experimentId)
    if (!experiment || experiment.status !== 'running') return

    // Simulate visitors for each variant based on traffic allocation
    const totalTrafficPercent = experiment.trafficAllocation || 100
    const baseVisitorsPerUpdate = Math.floor(Math.random() * 10) + 1 // 1-10 visitors per update

    experiment.variants.forEach((variant: any) => {
      // Calculate visitors for this variant based on traffic percentage
      const variantTrafficPercent = (variant.trafficPercentage / 100) * (totalTrafficPercent / 100)
      const visitorsThisUpdate = Math.floor(baseVisitorsPerUpdate * variantTrafficPercent)

      if (visitorsThisUpdate > 0) {
        variant.visitors += visitorsThisUpdate

        // Simulate conversions based on variant performance
        // Control variant has baseline conversion rate
        // Other variants have modified rates based on expected improvement
        let conversionRate = 0.05 // Base 5% conversion rate

        if (variant.isControl) {
          // Control has baseline performance
          conversionRate = 0.05 + (Math.random() * 0.02) // 5-7%
        } else {
          // Test variants have different performance levels
          const variantIndex = experiment.variants.indexOf(variant)
          const performanceModifier = (Math.sin(variantIndex) + 1) * 0.02 // -0.02 to +0.02
          conversionRate = 0.05 + performanceModifier + (Math.random() * 0.01)
          conversionRate = Math.max(0.01, Math.min(0.15, conversionRate)) // Keep between 1% and 15%
        }

        const conversionsThisUpdate = Math.floor(visitorsThisUpdate * conversionRate)
        variant.conversions += conversionsThisUpdate

        // Update conversion rate
        variant.conversionRate = variant.visitors > 0 ? (variant.conversions / variant.visitors) * 100 : 0

        // Update confidence level based on sample size
        variant.confidence = this.calculateConfidence(variant.visitors, variant.conversions)
      }
    })

    // Check if experiment should auto-complete
    this.checkAutoCompletion(experiment)

    // Update experiment
    this.updateExperiment(experimentId, {
      variants: experiment.variants,
      updatedAt: new Date()
    })
  }

  // Calculate confidence level based on sample size and conversions
  private calculateConfidence(visitors: number, conversions: number): number {
    if (visitors < 30) return Math.min(visitors * 2, 50) // Low confidence for small samples

    // Simplified confidence calculation
    const conversionRate = conversions / visitors
    const standardError = Math.sqrt((conversionRate * (1 - conversionRate)) / visitors)
    const zScore = 1.96 // 95% confidence interval

    const marginOfError = zScore * standardError
    const confidence = Math.max(0, Math.min(100, (1 - marginOfError / conversionRate) * 100))

    return isNaN(confidence) ? 0 : confidence
  }

  // Check if experiment should auto-complete based on duration and statistical significance
  private checkAutoCompletion(experiment: any) {
    const now = new Date()
    const startDate = new Date(experiment.startDate)
    const durationMs = now.getTime() - startDate.getTime()
    const durationDays = durationMs / (1000 * 60 * 60 * 24)

    // Auto-complete if duration exceeded or statistical significance reached
    if (durationDays >= experiment.duration) {
      this.completeExperiment(experiment.id, 'completed')
    } else {
      // Check for early statistical significance
      const analysis = this.performStatisticalAnalysis(experiment)
      if (analysis.significance >= experiment.confidenceLevel / 100) {
        this.completeExperiment(experiment.id, 'completed')
      }
    }
  }

  // Complete an experiment and determine winner
  completeExperiment(experimentId: string, status: string) {
    const experiment = this.getExperiment(experimentId)
    if (!experiment) return

    this.stopSimulation(experimentId)

    const analysis = this.performStatisticalAnalysis(experiment)
    const winner = analysis.winner

    this.updateExperiment(experimentId, {
      status,
      endDate: new Date(),
      winner,
      statisticalSignificance: analysis.significance,
      updatedAt: new Date()
    })
  }

  // Perform comprehensive statistical analysis
  performStatisticalAnalysis(experiment: any) {
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
    let maxSignificance = 0

    for (const variant of variants) {
      if (variant.isControl) continue

      // Calculate statistical significance
      const significance = this.calculateStatisticalSignificance(controlVariant, variant)

      // Calculate improvement
      const improvement = variant.conversionRate - controlVariant.conversionRate
      const relativeImprovement = controlVariant.conversionRate > 0
        ? (improvement / controlVariant.conversionRate) * 100
        : 0

      results.push({
        variantId: variant.id,
        variantName: variant.name,
        improvement,
        relativeImprovement,
        significance,
        confidence: variant.confidence,
        visitors: variant.visitors,
        conversions: variant.conversions,
        conversionRate: variant.conversionRate
      })

      // Determine winner based on significance and improvement
      if (significance >= experiment.confidenceLevel / 100 && significance > maxSignificance) {
        maxSignificance = significance
        winner = variant.name
      }
    }

    const recommendations = this.generateRecommendations(results, experiment)

    return {
      significance: maxSignificance,
      winner,
      confidenceIntervals: results,
      recommendations
    }
  }

  // Calculate statistical significance between control and variant
  private calculateStatisticalSignificance(control: any, variant: any): number {
    const controlRate = control.conversionRate / 100
    const variantRate = variant.conversionRate / 100

    const controlVisitors = control.visitors
    const variantVisitors = variant.visitors

    if (controlVisitors < 30 || variantVisitors < 30) {
      return 0 // Not enough sample size
    }

    // Pooled proportion for two-sample proportion test
    const pooledP = (control.conversions + variant.conversions) / (controlVisitors + variantVisitors)

    if (pooledP === 0 || pooledP === 1) return 0

    // Standard error
    const se = Math.sqrt(pooledP * (1 - pooledP) * (1/controlVisitors + 1/variantVisitors))

    if (se === 0) return 0

    // Z-score
    const zScore = Math.abs(variantRate - controlRate) / se

    // Convert z-score to p-value approximation, then to confidence level
    let confidence = 0
    if (zScore >= 2.576) confidence = 0.99 // 99% confidence
    else if (zScore >= 1.96) confidence = 0.95  // 95% confidence
    else if (zScore >= 1.645) confidence = 0.90 // 90% confidence
    else if (zScore >= 1.282) confidence = 0.80 // 80% confidence

    return confidence
  }

  // Generate recommendations based on analysis
  private generateRecommendations(results: any[], experiment: any): string[] {
    const recommendations = []

    if (results.length === 0) {
      recommendations.push('Continue running the experiment to collect more data')
      return recommendations
    }

    const significantResults = results.filter(r => r.significance >= experiment.confidenceLevel / 100)

    if (significantResults.length === 0) {
      recommendations.push('No statistically significant results yet')
      recommendations.push('Consider increasing sample size or extending test duration')
    } else {
      const bestResult = significantResults.reduce((best, current) =>
        current.relativeImprovement > best.relativeImprovement ? current : best
      )

      recommendations.push(`🎯 "${bestResult.variantName}" shows ${bestResult.relativeImprovement.toFixed(1)}% improvement`)
      recommendations.push('Ready to implement the winning variant')
    }

    // Check sample sizes
    const totalVisitors = experiment.variants.reduce((sum: number, v: any) => sum + v.visitors, 0)
    if (totalVisitors < 1000) {
      recommendations.push('⚠️ Low sample size - results may not be reliable')
    }

    return recommendations
  }

  // Add listener for real-time updates
  addListener(experimentId: string, callback: (experiment: any) => void) {
    if (!this.listeners.has(experimentId)) {
      this.listeners.set(experimentId, [])
    }
    this.listeners.get(experimentId)!.push(callback)
  }

  // Remove listener
  removeListener(experimentId: string, callback: (experiment: any) => void) {
    const listeners = this.listeners.get(experimentId)
    if (listeners) {
      const index = listeners.indexOf(callback)
      if (index !== -1) {
        listeners.splice(index, 1)
      }
    }
  }

  // Notify listeners of experiment updates
  private notifyListeners(experimentId: string, experiment: any) {
    const listeners = this.listeners.get(experimentId)
    if (listeners) {
      listeners.forEach(callback => callback(experiment))
    }
  }

  // Cleanup old completed experiments (older than 30 days)
  private cleanupOldExperiments() {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    this.experiments = this.experiments.filter(exp => {
      if (exp.status === 'completed' && exp.endDate) {
        const endDate = new Date(exp.endDate)
        return endDate > thirtyDaysAgo
      }
      return true
    })
  }
}

// Export singleton instance
export const experimentManager = new ExperimentManager()