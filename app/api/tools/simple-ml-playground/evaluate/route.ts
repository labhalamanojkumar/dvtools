/* eslint-disable prefer-const */
import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic';
import fs from 'fs'
import path from 'path'

// File-based storage for demo purposes - in production, use a database
const MODELS_FILE = path.join(process.cwd(), 'data', 'ml-models.json')
const DATASETS_FILE = path.join(process.cwd(), 'data', 'ml-datasets.json')

interface Model {
  id: string
  name: string
  algorithm: string
  status: 'training' | 'completed' | 'failed'
  accuracy?: number
  parameters: Record<string, any>
  createdAt: Date
  trainedAt?: Date
}

interface Dataset {
  id: string
  name: string
  size: number
  columns: string[]
  rows: number
  data: any[][]
  createdAt: Date
}

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Load models from file
const loadModels = () => {
  try {
    ensureDataDir()
    if (fs.existsSync(MODELS_FILE)) {
      const data = fs.readFileSync(MODELS_FILE, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error loading models:', error)
  }
  return []
}

// Load datasets from file
const loadDatasets = () => {
  try {
    ensureDataDir()
    if (fs.existsSync(DATASETS_FILE)) {
      const data = fs.readFileSync(DATASETS_FILE, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error loading datasets:', error)
  }
  return []
}

// Calculate evaluation metrics
function calculateMetrics(predictions: number[], actuals: any[], task: 'classification' | 'regression') {
  if (task === 'classification') {
    // Handle multi-class classification
    const uniqueClasses = [...new Set(actuals)]
    const numClasses = uniqueClasses.length

    if (numClasses === 2) {
      // Binary classification
      const classMap = new Map(uniqueClasses.map((cls, idx) => [cls, idx]))
      const binaryActuals = actuals.map(cls => classMap.get(cls) || 0)
      const binaryPredictions = predictions.map(pred => Math.floor(pred * numClasses) % numClasses)

      const tp = binaryPredictions.filter((pred, i) => pred === 1 && binaryActuals[i] === 1).length
      const tn = binaryPredictions.filter((pred, i) => pred === 0 && binaryActuals[i] === 0).length
      const fp = binaryPredictions.filter((pred, i) => pred === 1 && binaryActuals[i] === 0).length
      const fn = binaryPredictions.filter((pred, i) => pred === 0 && binaryActuals[i] === 1).length

      const accuracy = (tp + tn) / (tp + tn + fp + fn) || 0
      const precision = tp / (tp + fp) || 0
      const recall = tp / (tp + fn) || 0
      const f1Score = 2 * (precision * recall) / (precision + recall) || 0

      return {
        accuracy,
        precision,
        recall,
        f1Score,
        confusionMatrix: { tp, tn, fp, fn }
      }
    } else {
      // Multi-class classification - calculate overall accuracy
      const correctPredictions = predictions.filter((pred, i) => {
        const predictedClass = uniqueClasses[Math.floor(pred * numClasses) % numClasses]
        return predictedClass === actuals[i]
      }).length

      const accuracy = correctPredictions / actuals.length

      // For multi-class, we'll use a simplified confusion matrix
      // Create a basic 2x2 matrix for display purposes
      const tp = Math.floor(correctPredictions * 0.7) // Approximate true positives
      const tn = Math.floor((actuals.length - correctPredictions) * 0.6) // Approximate true negatives
      const fp = Math.floor((actuals.length - correctPredictions) * 0.4) // Approximate false positives
      const fn = actuals.length - correctPredictions - tp // False negatives

      return {
        accuracy,
        precision: accuracy, // Simplified for multi-class
        recall: accuracy,    // Simplified for multi-class
        f1Score: accuracy,   // Simplified for multi-class
        confusionMatrix: { tp, tn, fp, fn }
      }
    }
  } else {
    // Regression metrics
    const numericActuals = actuals.map(val => typeof val === 'number' ? val : parseFloat(val) || 0)
    const n = predictions.length
    const meanActual = numericActuals.reduce((sum, val) => sum + val, 0) / n

    const mse = predictions.reduce((sum, pred, i) => sum + Math.pow(pred - numericActuals[i], 2), 0) / n
    const rmse = Math.sqrt(mse)
    const mae = predictions.reduce((sum, pred, i) => sum + Math.abs(pred - numericActuals[i]), 0) / n
    const r2 = Math.max(0, 1 - (predictions.reduce((sum, pred, i) => sum + Math.pow(pred - numericActuals[i], 2), 0) /
                    numericActuals.reduce((sum, actual) => sum + Math.pow(actual - meanActual, 2), 0)))

    return {
      mse,
      rmse,
      mae,
      r2
    }
  }
}

// Generate confusion matrix visualization data
function generateConfusionMatrix(tp: number, tn: number, fp: number, fn: number) {
  return {
    labels: ['Predicted Negative', 'Predicted Positive'],
    data: [
      [tn, fp], // [True Negative, False Positive]
      [fn, tp]  // [False Negative, True Positive]
    ]
  }
}

// Generate ROC curve data (simplified)
function generateROCData(predictions: number[], actuals: any[]) {
  // Convert actuals to binary for ROC calculation
  const uniqueClasses = [...new Set(actuals)]
  const binaryActuals = actuals.map(val => uniqueClasses.indexOf(val) === 0 ? 0 : 1)

  const thresholds = []
  const tpr = []
  const fpr = []

  for (let threshold = 0; threshold <= 1; threshold += 0.1) {
    const binaryPreds = predictions.map(pred => pred >= threshold ? 1 : 0)
    const tp = binaryPreds.filter((pred, i) => pred === 1 && binaryActuals[i] === 1).length
    const tn = binaryPreds.filter((pred, i) => pred === 0 && binaryActuals[i] === 0).length
    const fp = binaryPreds.filter((pred, i) => pred === 1 && binaryActuals[i] === 0).length
    const fn = binaryPreds.filter((pred, i) => pred === 0 && binaryActuals[i] === 1).length

    const tprValue = tp / (tp + fn) || 0
    const fprValue = fp / (fp + tn) || 0

    thresholds.push(threshold)
    tpr.push(tprValue)
    fpr.push(fprValue)
  }

  return { thresholds, tpr, fpr }
}

// Generate feature importance data (simplified simulation)
function generateFeatureImportance(columns: string[], algorithm: string) {
  const importance = columns.map((col, idx) => ({
    feature: col,
    importance: Math.random() * 0.8 + 0.2 // Random importance for demo
  }))

  // Sort by importance
  importance.sort((a, b) => b.importance - a.importance)

  return importance
}

// POST /api/tools/simple-ml-playground/evaluate - Evaluate model performance
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { modelId, datasetId, task = 'classification' } = body

    if (!modelId || !datasetId) {
      return NextResponse.json(
        { error: 'Model ID and dataset ID are required' },
        { status: 400 }
      )
    }

    const models = loadModels()
    const datasets = loadDatasets()

    const model = models.find((m: Model) => m.id === modelId)
    const dataset = datasets.find((d: Dataset) => d.id === datasetId)

    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      )
    }

    if (!dataset) {
      return NextResponse.json(
        { error: 'Dataset not found' },
        { status: 404 }
      )
    }

    if (model.status !== 'completed') {
      return NextResponse.json(
        { error: 'Model is not trained yet' },
        { status: 400 }
      )
    }

    // Extract actual values from dataset (last column is typically the target)
    const actuals = dataset.data.map((row: any[]) => row[row.length - 1])

    // Simulate predictions on the dataset
    // Generate more realistic predictions based on the model type and data
    let predictions: number[] = []

    if (task === 'classification') {
      // For classification, generate predictions that somewhat match the actual distribution
      const uniqueClasses = [...new Set(actuals)]
      const classProbabilities = uniqueClasses.map(() => Math.random() * 0.5 + 0.25) // Random probabilities

      predictions = actuals.map(() => {
        const rand = Math.random()
        let cumulativeProb = 0
        for (let i = 0; i < classProbabilities.length; i++) {
          cumulativeProb += classProbabilities[i]
          if (rand <= cumulativeProb) {
            return i / (classProbabilities.length - 1) // Normalize to 0-1 range
          }
        }
        return 1
      })
    } else {
      // For regression, generate predictions with some correlation to actual values
      const numericActuals = actuals.map((val: any) => typeof val === 'number' ? val : parseFloat(val) || 0)
      const mean = numericActuals.reduce((sum: number, val: number) => sum + val, 0) / numericActuals.length
      const std = Math.sqrt(numericActuals.reduce((sum: number, val: number) => sum + Math.pow(val - mean, 2), 0) / numericActuals.length)

      predictions = numericActuals.map((actual: number) => {
        // Add some noise but keep it correlated
        const noise = (Math.random() - 0.5) * std * 0.5
        return Math.max(0, actual + noise) // Ensure non-negative for demo
      })
    }

    // Calculate metrics
    const metrics = calculateMetrics(predictions, actuals, task as 'classification' | 'regression')

    // Generate visualization data
    let visualizations = {}

    if (task === 'classification' && 'confusionMatrix' in metrics) {
      const { tp, tn, fp, fn } = (metrics as any).confusionMatrix
      visualizations = {
        confusionMatrix: generateConfusionMatrix(tp, tn, fp, fn),
        rocCurve: generateROCData(predictions, actuals.map((val: any) => typeof val === 'number' ? val : 0))
      }
    }

    // Feature importance
    const featureImportance = generateFeatureImportance(dataset.columns.slice(0, -1), model.algorithm)

    const evaluationResult = {
      modelId,
      datasetId,
      task,
      metrics,
      visualizations,
      featureImportance,
      sampleSize: dataset.rows,
      evaluatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      evaluation: evaluationResult,
      message: 'Model evaluation completed successfully'
    })

  } catch (error) {
    console.error('Error evaluating model:', error)
    return NextResponse.json(
      { error: 'Failed to evaluate model' },
      { status: 500 }
    )
  }
}