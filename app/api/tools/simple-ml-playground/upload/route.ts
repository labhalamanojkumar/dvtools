/* eslint-disable prefer-const */
import { NextRequest, NextResponse } from 'next/server'
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

// Parse CSV content
function parseCSV(csvText: string): { headers: string[], data: any[][] } {
  const lines = csvText.split('\n').filter(line => line.trim())

  if (lines.length < 2) {
    throw new Error('CSV must contain at least a header row and one data row')
  }

  // Parse headers
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))

  // Parse data rows
  const data = lines.slice(1).map(line => {
    const values = line.split(',').map(cell => {
      const trimmed = cell.trim().replace(/"/g, '')
      // Try to parse as number, otherwise keep as string
      const num = parseFloat(trimmed)
      return isNaN(num) ? trimmed : num
    })
    return values
  })

  return { headers, data }
}

// POST /api/tools/simple-ml-playground/upload - Upload and parse CSV file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      return NextResponse.json(
        { error: 'Only CSV files are supported' },
        { status: 400 }
      )
    }

    // Enforce maximum upload size (100 MB) for direct uploads
    const MAX_UPLOAD_BYTES = 100 * 1024 * 1024 // 100 MB
    // Some runtimes expose file.size on the FormData File object
    // @ts-ignore
    const fileSize = (file as any).size ?? null
    if (fileSize && fileSize > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: 'File too large for direct upload. For files larger than 100MB, please provide a URL to a cloud-hosted file (Google Drive, S3, etc.) using the "Load from URL" option.' },
        { status: 413 }
      )
    }
    // Read file content
    const csvText = await file.text()

    // Parse CSV
    const { headers, data } = parseCSV(csvText)

    // Create dataset
    const dataset: Dataset = {
      id: Date.now().toString(),
      name: file.name.replace('.csv', ''),
      size: data.length,
      columns: headers,
      rows: data.length,
      data,
      createdAt: new Date()
    }

    // Save to persistent storage
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

  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload file' },
      { status: 500 }
    )
  }
}