/* eslint-disable prefer-const */
import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic';
import fs from 'fs'
import path from 'path'

// File-based storage for demo purposes - in production, use a database
const DATASETS_FILE = path.join(process.cwd(), 'data', 'ml-datasets.json')
const MODELS_FILE = path.join(process.cwd(), 'data', 'ml-models.json')

interface Dataset {
  id: string
  name: string
  size: number
  columns: string[]
  rows: number
  data: any[][]
  createdAt: Date
}

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
}

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
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

// Save datasets to file
const saveDatasets = (datasets: any[]) => {
  try {
    ensureDataDir()
    const data = JSON.stringify(datasets, null, 2)
    fs.writeFileSync(DATASETS_FILE, data, 'utf8')
  } catch (error) {
    console.error('Error saving datasets:', error)
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
const saveModels = (models: any[]) => {
  try {
    ensureDataDir()
    const data = JSON.stringify(models, null, 2)
    fs.writeFileSync(MODELS_FILE, data, 'utf8')
  } catch (error) {
    console.error('Error saving models:', error)
  }
}

// Sample datasets
const sampleDatasets = [
  {
    name: 'Iris Flower Dataset',
    features: ['sepal_length', 'sepal_width', 'petal_length', 'petal_width', 'species'],
    size: 150,
    type: 'classification'
  },
  {
    name: 'Boston Housing',
    features: ['crim', 'zn', 'indus', 'chas', 'nox', 'rm', 'age', 'dis', 'rad', 'tax', 'ptratio', 'b', 'lstat', 'medv'],
    size: 506,
    type: 'regression'
  },
  {
    name: 'Wine Quality',
    features: ['fixed_acidity', 'volatile_acidity', 'citric_acid', 'residual_sugar', 'chlorides', 'free_sulfur_dioxide', 'total_sulfur_dioxide', 'density', 'pH', 'sulphates', 'alcohol', 'quality'],
    size: 1599,
    type: 'regression'
  }
]

// GET /api/tools/simple-ml-playground - List datasets and models
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'datasets' or 'models'

    if (type === 'datasets') {
      const datasets = loadDatasets()
      return NextResponse.json({
        datasets: datasets.map((d: Dataset) => ({
          id: d.id,
          name: d.name,
          size: d.size,
          columns: d.columns,
          rows: d.rows,
          createdAt: d.createdAt
        })),
        sampleDatasets
      })
    } else if (type === 'models') {
      const models = loadModels()
      return NextResponse.json({
        models: models.map((m: Model) => ({
          id: m.id,
          name: m.name,
          type: m.type,
          algorithm: m.algorithm,
          status: m.status,
          accuracy: m.accuracy,
          trainingTime: m.trainingTime,
          datasetId: m.datasetId,
          createdAt: m.createdAt
        }))
      })
    }

    const datasets = loadDatasets()
    const models = loadModels()
    return NextResponse.json({
      datasets: datasets.length,
      models: models.length,
      sampleDatasets: sampleDatasets.length
    })

  } catch (error) {
    console.error('Error fetching ML data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    )
  }
}

// POST /api/tools/simple-ml-playground - Upload dataset or load sample
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, datasetName } = body

    if (action === 'load_sample' && datasetName) {
      const sampleData = sampleDatasets.find(d => d.name === datasetName)
      if (!sampleData) {
        return NextResponse.json(
          { error: 'Sample dataset not found' },
          { status: 404 }
        )
      }

      // Generate mock data
      const mockData = Array.from({ length: sampleData.size }, (_, i) => {
        const row: any[] = []
        sampleData.features.forEach((feature, idx) => {
          if (feature === 'species' && datasetName === 'Iris Flower Dataset') {
            row.push(['setosa', 'versicolor', 'virginica'][i % 3])
          } else if (feature === 'quality' && datasetName === 'Wine Quality') {
            row.push(Math.floor(Math.random() * 10) + 1)
          } else if (feature === 'medv' && datasetName === 'Boston Housing') {
            row.push(Math.random() * 50 + 5)
          } else {
            row.push(Math.random() * 100)
          }
        })
        return row
      })

      const dataset: Dataset = {
        id: Date.now().toString(),
        name: datasetName,
        size: mockData.length,
        columns: sampleData.features,
        rows: mockData.length,
        data: mockData,
        createdAt: new Date()
      }

      const datasets = loadDatasets()
      datasets.push(dataset)
      saveDatasets(datasets)

      return NextResponse.json({
        success: true,
        dataset: {
          id: dataset.id,
          name: dataset.name,
          size: dataset.size,
          columns: dataset.columns,
          rows: dataset.rows,
          preview: dataset.data.slice(0, 5),
          createdAt: dataset.createdAt
        }
      })
    }

    return NextResponse.json(
      { error: 'Invalid action or missing parameters' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error processing ML request:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

// DELETE /api/tools/simple-ml-playground - Delete dataset or model
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'dataset' or 'model'
    const id = searchParams.get('id')

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Type and ID are required' },
        { status: 400 }
      )
    }

    if (type === 'dataset') {
      const datasets = loadDatasets()
      const index = datasets.findIndex((d: Dataset) => d.id === id)
      if (index === -1) {
        return NextResponse.json(
          { error: 'Dataset not found' },
          { status: 404 }
        )
      }
      datasets.splice(index, 1)
      saveDatasets(datasets)
    } else if (type === 'model') {
      const models = loadModels()
      const index = models.findIndex((m: Model) => m.id === id)
      if (index === -1) {
        return NextResponse.json(
          { error: 'Model not found' },
          { status: 404 }
        )
      }
      models.splice(index, 1)
      saveModels(models)
    }

    return NextResponse.json({
      success: true,
      message: `${type} deleted successfully`
    })

  } catch (error) {
    console.error('Error deleting ML data:', error)
    return NextResponse.json(
      { error: 'Failed to delete data' },
      { status: 500 }
    )
  }
}
