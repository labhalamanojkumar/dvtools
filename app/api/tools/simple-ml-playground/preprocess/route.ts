/* eslint-disable prefer-const */
import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic';
import fs from 'fs'
import path from 'path'

// File-based storage for demo purposes - in production, use a database
const DATASETS_FILE = path.join(process.cwd(), 'data', 'ml-datasets.json')

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
const saveDatasets = (datasets: Dataset[]) => {
  try {
    ensureDataDir()
    const data = JSON.stringify(datasets, null, 2)
    fs.writeFileSync(DATASETS_FILE, data, 'utf8')
  } catch (error) {
    console.error('Error saving datasets:', error)
  }
}

// Handle missing values
function handleMissingValues(data: any[][], method: 'drop' | 'mean' | 'median' | 'mode' = 'drop'): any[][] {
  if (method === 'drop') {
    return data.filter(row => !row.some(cell => cell === null || cell === undefined || cell === ''))
  }

  // For other methods, we need to identify numeric vs categorical columns
  const numericColumns: number[] = []
  const categoricalColumns: number[] = []

  // Analyze first few rows to determine column types
  for (let col = 0; col < data[0].length; col++) {
    const sampleValues = data.slice(0, Math.min(10, data.length)).map(row => row[col])
    const numericCount = sampleValues.filter(val => typeof val === 'number' && !isNaN(val)).length
    if (numericCount > sampleValues.length * 0.5) {
      numericColumns.push(col)
    } else {
      categoricalColumns.push(col)
    }
  }

  const processedData = data.map(row => [...row])

  // Fill missing values
  for (const row of processedData) {
    for (let col = 0; col < row.length; col++) {
      if (row[col] === null || row[col] === undefined || row[col] === '') {
        if (numericColumns.includes(col)) {
          // Numeric column
          const values = processedData.map(r => r[col]).filter(val => typeof val === 'number' && !isNaN(val))
          if (method === 'mean') {
            row[col] = values.reduce((sum, val) => sum + val, 0) / values.length
          } else if (method === 'median') {
            values.sort((a, b) => a - b)
            const mid = Math.floor(values.length / 2)
            row[col] = values.length % 2 === 0 ? (values[mid - 1] + values[mid]) / 2 : values[mid]
          }
        } else {
          // Categorical column
          const values = processedData.map(r => r[col]).filter(val => val !== null && val !== undefined && val !== '')
          const mode = values.reduce((acc, val) => {
            acc[val] = (acc[val] || 0) + 1
            return acc
          }, {} as Record<string, number>)
          const mostFrequent = Object.keys(mode).reduce((a, b) => mode[a] > mode[b] ? a : b)
          row[col] = mostFrequent
        }
      }
    }
  }

  return processedData
}

// Normalize features
function normalizeFeatures(data: any[][], method: 'standard' | 'minmax' = 'standard'): any[][] {
  const processedData = data.map(row => [...row])

  // Find numeric columns
  const numericColumns: number[] = []
  for (let col = 0; col < data[0].length; col++) {
    const values = data.map(row => row[col]).filter(val => typeof val === 'number' && !isNaN(val))
    if (values.length > data.length * 0.5) {
      numericColumns.push(col)
    }
  }

  // Normalize each numeric column
  for (const col of numericColumns) {
    const values = processedData.map(row => row[col]).filter(val => typeof val === 'number' && !isNaN(val))

    if (method === 'standard') {
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
      const std = Math.sqrt(variance)

      for (const row of processedData) {
        if (typeof row[col] === 'number' && !isNaN(row[col])) {
          row[col] = (row[col] - mean) / std
        }
      }
    } else if (method === 'minmax') {
      const min = Math.min(...values)
      const max = Math.max(...values)

      for (const row of processedData) {
        if (typeof row[col] === 'number' && !isNaN(row[col])) {
          row[col] = (row[col] - min) / (max - min)
        }
      }
    }
  }

  return processedData
}

// Encode categorical variables
function encodeCategorical(data: any[][], method: 'label' | 'onehot' = 'label'): any[][] {
  const processedData = data.map(row => [...row])

  // Find categorical columns
  const categoricalColumns: number[] = []
  for (let col = 0; col < data[0].length; col++) {
    const values = data.map(row => row[col]).filter(val => val !== null && val !== undefined)
    const numericCount = values.filter(val => typeof val === 'number' && !isNaN(val)).length
    if (numericCount < values.length * 0.5) {
      categoricalColumns.push(col)
    }
  }

  if (method === 'label') {
    // Label encoding
    for (const col of categoricalColumns) {
      const uniqueValues = [...new Set(processedData.map(row => row[col]))]
      const valueMap = Object.fromEntries(uniqueValues.map((val, idx) => [val, idx]))

      for (const row of processedData) {
        row[col] = valueMap[row[col]] ?? 0
      }
    }
  } else if (method === 'onehot') {
    // One-hot encoding (simplified - would need to handle column expansion properly)
    // For demo purposes, we'll just do label encoding
    for (const col of categoricalColumns) {
      const uniqueValues = [...new Set(processedData.map(row => row[col]))]
      const valueMap = Object.fromEntries(uniqueValues.map((val, idx) => [val, idx]))

      for (const row of processedData) {
        row[col] = valueMap[row[col]] ?? 0
      }
    }
  }

  return processedData
}

// POST /api/tools/simple-ml-playground/preprocess - Apply preprocessing to dataset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { datasetId, operations } = body

    if (!datasetId || !operations || !Array.isArray(operations)) {
      return NextResponse.json(
        { error: 'Dataset ID and operations array are required' },
        { status: 400 }
      )
    }

    const datasets = loadDatasets()
    const datasetIndex = datasets.findIndex((d: Dataset) => d.id === datasetId)

    if (datasetIndex === -1) {
      return NextResponse.json(
        { error: 'Dataset not found' },
        { status: 404 }
      )
    }

    let processedData = [...datasets[datasetIndex].data]

    // Apply each preprocessing operation
    for (const operation of operations) {
      switch (operation.type) {
        case 'missing_values':
          processedData = handleMissingValues(processedData, operation.method || 'drop')
          break
        case 'normalize':
          processedData = normalizeFeatures(processedData, operation.method || 'standard')
          break
        case 'encode_categorical':
          processedData = encodeCategorical(processedData, operation.method || 'label')
          break
        default:
          return NextResponse.json(
            { error: `Unknown preprocessing operation: ${operation.type}` },
            { status: 400 }
          )
      }
    }

    // Update dataset with processed data
    datasets[datasetIndex].data = processedData
    datasets[datasetIndex].rows = processedData.length
    saveDatasets(datasets)

    return NextResponse.json({
      success: true,
      dataset: {
        id: datasets[datasetIndex].id,
        name: datasets[datasetIndex].name,
        size: datasets[datasetIndex].size,
        columns: datasets[datasetIndex].columns,
        rows: datasets[datasetIndex].rows,
        preview: processedData.slice(0, 5)
      },
      operations: operations.length,
      message: 'Preprocessing completed successfully'
    })

  } catch (error) {
    console.error('Error preprocessing data:', error)
    return NextResponse.json(
      { error: 'Failed to preprocess data' },
      { status: 500 }
    )
  }
}