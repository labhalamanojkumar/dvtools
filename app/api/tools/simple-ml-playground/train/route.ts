/* eslint-disable prefer-const */
import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic';
import fs from 'fs'
import path from 'path'

// File-based storage for demo purposes - in production, use a database
const MODELS_FILE = path.join(process.cwd(), 'data', 'ml-models.json')

interface Model {
  id: string
  name: string
  type: 'classification' | 'regression' | 'clustering'
  algorithm: string
  status: 'training' | 'completed' | 'failed'
  accuracy?: number
  parameters: Record<string, any>
  trainingTime?: number
  datasetId: string
  createdAt: Date
  progress?: number
  error?: string
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

// Save models to file
const saveModels = (models: Model[]) => {
  try {
    ensureDataDir()
    const data = JSON.stringify(models, null, 2)
    fs.writeFileSync(MODELS_FILE, data, 'utf8')
  } catch (error) {
    console.error('Error saving models:', error)
  }
}

// Available algorithms
const algorithms = {
  classification: [
    { name: 'Logistic Regression', value: 'logistic_regression' },
    { name: 'Decision Tree', value: 'decision_tree' },
    { name: 'Random Forest', value: 'random_forest' },
    { name: 'SVM', value: 'svm' },
    { name: 'K-Nearest Neighbors', value: 'knn' },
    { name: 'Naive Bayes', value: 'naive_bayes' }
  ],
  regression: [
    { name: 'Linear Regression', value: 'linear_regression' },
    { name: 'Decision Tree Regressor', value: 'decision_tree_regressor' },
    { name: 'Random Forest Regressor', value: 'random_forest_regressor' },
    { name: 'SVR', value: 'svr' },
    { name: 'Gradient Boosting', value: 'gradient_boosting' }
  ],
  clustering: [
    { name: 'K-Means', value: 'kmeans' },
    { name: 'Hierarchical Clustering', value: 'hierarchical' },
    { name: 'DBSCAN', value: 'dbscan' },
    { name: 'Gaussian Mixture', value: 'gaussian_mixture' }
  ]
}

// Simulate model training
async function simulateTraining(model: Model): Promise<Model> {
  model.status = 'training'
  model.progress = 0

  // Save initial state
  const models = loadModels()
  const modelIndex = models.findIndex((m: Model) => m.id === model.id)
  if (modelIndex !== -1) {
    models[modelIndex] = { ...model }
    saveModels(models)
  }

  // Simulate training progress
  const totalSteps = 100
  for (let i = 0; i <= totalSteps; i += 5) {
    await new Promise(resolve => setTimeout(resolve, 100))
    model.progress = i

    // Save progress update to file
    const currentModels = loadModels()
    const currentModelIndex = currentModels.findIndex((m: Model) => m.id === model.id)
    if (currentModelIndex !== -1) {
      currentModels[currentModelIndex].progress = i
      saveModels(currentModels)
    }
  }

  // Simulate training completion with random success/failure
  const success = Math.random() > 0.1 // 90% success rate
  const trainingTime = Math.random() * 30 + 5 // 5-35 seconds

  model.trainingTime = trainingTime
  model.progress = 100

  if (success) {
    model.status = 'completed'
    // Generate realistic accuracy based on algorithm type
    if (model.type === 'classification') {
      model.accuracy = Math.random() * 0.3 + 0.7 // 70-100%
    } else if (model.type === 'regression') {
      model.accuracy = Math.random() * 0.4 + 0.6 // 60-100% (R² score)
    } else {
      model.accuracy = Math.random() * 0.2 + 0.8 // 80-100% (silhouette score)
    }

    // Add algorithm-specific parameters
    model.parameters = generateAlgorithmParameters(model.algorithm)
  } else {
    model.status = 'failed'
    model.error = 'Training failed due to insufficient data quality or algorithm incompatibility'
  }

  // Save final state
  const finalModels = loadModels()
  const finalModelIndex = finalModels.findIndex((m: Model) => m.id === model.id)
  if (finalModelIndex !== -1) {
    finalModels[finalModelIndex] = { ...model }
    saveModels(finalModels)
  }

  return model
}

function generateAlgorithmParameters(algorithm: string): Record<string, any> {
  switch (algorithm) {
    case 'logistic_regression':
      return {
        C: Math.random() * 10 + 0.1,
        max_iter: Math.floor(Math.random() * 1000) + 100,
        solver: ['lbfgs', 'liblinear', 'newton-cg'][Math.floor(Math.random() * 3)]
      }
    case 'decision_tree':
    case 'decision_tree_regressor':
      return {
        max_depth: Math.floor(Math.random() * 20) + 5,
        min_samples_split: Math.floor(Math.random() * 10) + 2,
        criterion: algorithm.includes('regressor') ? 'mse' : 'gini'
      }
    case 'random_forest':
    case 'random_forest_regressor':
      return {
        n_estimators: Math.floor(Math.random() * 200) + 50,
        max_depth: Math.floor(Math.random() * 20) + 5,
        min_samples_split: Math.floor(Math.random() * 10) + 2
      }
    case 'svm':
    case 'svr':
      return {
        C: Math.random() * 10 + 0.1,
        kernel: ['rbf', 'linear', 'poly', 'sigmoid'][Math.floor(Math.random() * 4)],
        gamma: ['scale', 'auto'][Math.floor(Math.random() * 2)]
      }
    case 'knn':
      return {
        n_neighbors: Math.floor(Math.random() * 20) + 1,
        weights: ['uniform', 'distance'][Math.floor(Math.random() * 2)],
        algorithm: ['auto', 'ball_tree', 'kd_tree', 'brute'][Math.floor(Math.random() * 4)]
      }
    case 'naive_bayes':
      return {
        alpha: Math.random() * 2,
        fit_prior: Math.random() > 0.5
      }
    case 'linear_regression':
      return {
        fit_intercept: Math.random() > 0.5,
        normalize: Math.random() > 0.5
      }
    case 'gradient_boosting':
      return {
        n_estimators: Math.floor(Math.random() * 200) + 50,
        learning_rate: Math.random() * 0.5 + 0.1,
        max_depth: Math.floor(Math.random() * 10) + 3
      }
    case 'kmeans':
      return {
        n_clusters: Math.floor(Math.random() * 10) + 2,
        init: ['k-means++', 'random'][Math.floor(Math.random() * 2)],
        n_init: Math.floor(Math.random() * 10) + 1
      }
    case 'dbscan':
      return {
        eps: Math.random() * 2 + 0.1,
        min_samples: Math.floor(Math.random() * 10) + 1,
        algorithm: ['auto', 'ball_tree', 'kd_tree', 'brute'][Math.floor(Math.random() * 4)]
      }
    default:
      return {}
  }
}

function determineModelType(algorithm: string): 'classification' | 'regression' | 'clustering' {
  if (algorithms.classification.some(a => a.value === algorithm)) {
    return 'classification'
  } else if (algorithms.regression.some(a => a.value === algorithm)) {
    return 'regression'
  } else {
    return 'clustering'
  }
}

// POST /api/tools/simple-ml-playground/train - Start model training
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { algorithm, datasetId, modelName } = body

    if (!algorithm || !datasetId) {
      return NextResponse.json(
        { error: 'Algorithm and dataset ID are required' },
        { status: 400 }
      )
    }

    // Check if algorithm is valid
    const allAlgorithms = [
      ...algorithms.classification,
      ...algorithms.regression,
      ...algorithms.clustering
    ]
    const isValidAlgorithm = allAlgorithms.some(a => a.value === algorithm)

    if (!isValidAlgorithm) {
      return NextResponse.json(
        { error: 'Invalid algorithm specified' },
        { status: 400 }
      )
    }

    // Check if there's already a training model for this dataset
    const models = loadModels()
    const existingTraining = models.find((m: Model) =>
      m.datasetId === datasetId && m.status === 'training'
    )

    if (existingTraining) {
      return NextResponse.json(
        { error: 'A model is already training for this dataset', modelId: existingTraining.id },
        { status: 409 }
      )
    }

    const modelType = determineModelType(algorithm)
    const model: Model = {
      id: Date.now().toString(),
      name: modelName || `${algorithm.replace(/_/g, ' ')} Model`,
      type: modelType,
      algorithm,
      status: 'training',
      parameters: {},
      datasetId,
      createdAt: new Date(),
      progress: 0
    }

    models.push(model)
    saveModels(models)

    // Start training asynchronously
    simulateTraining(model).catch(error => {
      console.error('Training failed:', error)
      model.status = 'failed'
      model.error = error.message
    })

    return NextResponse.json({
      success: true,
      model: {
        id: model.id,
        name: model.name,
        type: model.type,
        algorithm: model.algorithm,
        status: model.status,
        progress: model.progress,
        createdAt: model.createdAt
      },
      message: 'Model training started successfully'
    })

  } catch (error) {
    console.error('Error starting model training:', error)
    return NextResponse.json(
      { error: 'Failed to start model training' },
      { status: 500 }
    )
  }
}

// GET /api/tools/simple-ml-playground/train - Get training status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const modelId = searchParams.get('modelId')

    if (!modelId) {
      return NextResponse.json(
        { error: 'Model ID is required' },
        { status: 400 }
      )
    }

    const models = loadModels()
    const model = models.find((m: Model) => m.id === modelId)

    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      model: {
        id: model.id,
        name: model.name,
        type: model.type,
        algorithm: model.algorithm,
        status: model.status,
        accuracy: model.accuracy,
        trainingTime: model.trainingTime,
        progress: model.progress,
        parameters: model.parameters,
        error: model.error,
        createdAt: model.createdAt
      }
    })

  } catch (error) {
    console.error('Error fetching training status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch training status' },
      { status: 500 }
    )
  }
}
