import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic';
import fs from 'fs'
import path from 'path'

// File-based storage for demo purposes - in production, use a database and async workers
const DATASETS_FILE = path.join(process.cwd(), 'data', 'ml-datasets.json')

const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

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

const saveDatasets = (datasets: any[]) => {
  try {
    ensureDataDir()
    const data = JSON.stringify(datasets, null, 2)
    fs.writeFileSync(DATASETS_FILE, data, 'utf8')
  } catch (error) {
    console.error('Error saving datasets:', error)
  }
}

// Helper to attempt a HEAD request, fallback to GET if needed
async function fetchHead(url: string) {
  try {
    const headRes = await fetch(url, { method: 'HEAD' })
    return headRes
  } catch (err) {
    // Some hosts block HEAD; try range GET for first byte to get headers
    try {
      const res = await fetch(url, { headers: { Range: 'bytes=0-0' } })
      return res
    } catch (e) {
      throw e
    }
  }
}

// Simple CSV parser used for small files
function parseCSV(csvText: string): { headers: string[], data: any[][] } {
  const lines = csvText.split('\n').filter(line => line.trim())
  if (lines.length < 2) {
    throw new Error('CSV must contain at least a header row and one data row')
  }
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
  const data = lines.slice(1).map(line => line.split(',').map(cell => {
    const trimmed = cell.trim().replace(/"/g, '')
    const num = parseFloat(trimmed)
    return isNaN(num) ? trimmed : num
  }))
  return { headers, data }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Validate URL
    let parsed: URL
    try {
      parsed = new URL(url)
    } catch (error) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    // Perform HEAD/RANGE check to get size
    let contentLength: number | null = null
    try {
      const headRes = await fetchHead(url)
      const cl = headRes.headers.get('content-length')
      if (cl) contentLength = parseInt(cl, 10)
    } catch (error) {
      console.warn('Could not determine content-length for URL:', url)
    }

    const MAX_DIRECT_BYTES = 100 * 1024 * 1024 // 100 MB

    if (contentLength && contentLength <= MAX_DIRECT_BYTES) {
      // Safe to fetch and parse directly
      const res = await fetch(url)
      if (!res.ok) {
        return NextResponse.json({ error: `Failed to fetch URL: ${res.statusText}` }, { status: 502 })
      }
      const text = await res.text()
      const { headers, data } = parseCSV(text)

      const dataset = {
        id: Date.now().toString(),
        name: path.basename(parsed.pathname) || url,
        size: data.length,
        columns: headers,
        rows: data.length,
        data,
        createdAt: new Date()
      }

      const datasets = loadDatasets()
      datasets.push(dataset)
      saveDatasets(datasets)

      return NextResponse.json({ success: true, dataset: { id: dataset.id, name: dataset.name, size: dataset.size, columns: dataset.columns, rows: dataset.rows, preview: dataset.data.slice(0,5), createdAt: dataset.createdAt } })
    }

    // For large files (>100MB) or unknown size, store a remote dataset reference and process asynchronously
    const remoteDataset = {
      id: Date.now().toString(),
      name: path.basename(parsed.pathname) || url,
      size: contentLength ?? -1,
      columns: [],
      rows: 0,
      data: [],
      sourceUrl: url,
      remote: true,
      createdAt: new Date()
    }

    const datasets = loadDatasets()
    datasets.push(remoteDataset)
    saveDatasets(datasets)

    return NextResponse.json({ success: true, dataset: { id: remoteDataset.id, name: remoteDataset.name, size: remoteDataset.size, columns: remoteDataset.columns, rows: remoteDataset.rows, preview: [], createdAt: remoteDataset.createdAt }, message: 'Large dataset registered. Processing will be handled asynchronously; provide a direct-download link (S3/Google Drive direct link) for faster processing.' })

  } catch (error) {
    console.error('Error fetching remote dataset:', error)
    return NextResponse.json({ error: 'Failed to fetch remote dataset' }, { status: 500 })
  }
}
