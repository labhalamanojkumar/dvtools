import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import fs from 'fs';
import path from 'path';

// File-based storage for demo purposes - in production, use a database
const CONNECTIONS_FILE = path.join(process.cwd(), 'data', 'connections.json');
const SYNC_JOBS_FILE = path.join(process.cwd(), 'data', 'sync-jobs.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Load connections from file
const loadConnections = () => {
  try {
    ensureDataDir();
    if (fs.existsSync(CONNECTIONS_FILE)) {
      const data = fs.readFileSync(CONNECTIONS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading connections:', error);
  }
  return [];
};

// Save connections to file
const saveConnections = (connections: any[]) => {
  try {
    ensureDataDir();
    const data = JSON.stringify(connections, null, 2);
    fs.writeFileSync(CONNECTIONS_FILE, data, 'utf8');
  } catch (error) {
    console.error('Error saving connections:', error);
  }
};

// Load sync jobs from file
const loadSyncJobs = () => {
  try {
    ensureDataDir();
    if (fs.existsSync(SYNC_JOBS_FILE)) {
      const data = fs.readFileSync(SYNC_JOBS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading sync jobs:', error);
  }
  return [];
};

// Save sync jobs to file
const saveSyncJobs = (jobs: any[]) => {
  try {
    ensureDataDir();
    const data = JSON.stringify(jobs, null, 2);
    fs.writeFileSync(SYNC_JOBS_FILE, data, 'utf8');
  } catch (error) {
    console.error('Error saving sync jobs:', error);
  }
};

// Simulate sync operations
async function simulateSync(job: any): Promise<any> {
  job.status = 'running';
  job.startTime = new Date().toISOString();

  // Simulate progress updates
  const totalSteps = 100;
  for (let i = 0; i <= totalSteps; i++) {
    await new Promise(resolve => setTimeout(resolve, 50));
    job.progress = i;
    job.recordsProcessed = Math.floor(i * 2.5);

    // Save progress to file periodically
    if (i % 10 === 0) {
      const jobs = loadSyncJobs();
      const jobIndex = jobs.findIndex((j: any) => j.id === job.id);
      if (jobIndex !== -1) {
        jobs[jobIndex] = job;
        saveSyncJobs(jobs);
      }
    }
  }

  // Randomly succeed or fail for demo
  const success = Math.random() > 0.1; // 90% success rate

  job.endTime = new Date().toISOString();
  job.status = success ? 'completed' : 'failed';
  job.recordsFailed = success ? 0 : Math.floor(Math.random() * 10);

  if (!success) {
    job.error = 'Simulated sync failure for demo purposes';
  }

  job.metadata = {
    sourceRecords: job.recordsProcessed + job.recordsFailed,
    targetRecords: job.recordsProcessed,
    duration: `${Math.floor((new Date(job.endTime).getTime() - new Date(job.startTime).getTime()) / 1000)}s`,
    throughput: `${Math.floor(job.recordsProcessed / ((new Date(job.endTime).getTime() - new Date(job.startTime).getTime()) / 1000))} records/sec`
  };

  // Save final job state
  const jobs = loadSyncJobs();
  const jobIndex = jobs.findIndex((j: any) => j.id === job.id);
  if (jobIndex !== -1) {
    jobs[jobIndex] = job;
    saveSyncJobs(jobs);
  }

  // Update connection metrics
  const connections = loadConnections();
  const connectionIndex = connections.findIndex((c: any) => c.id === job.connectionId);
  if (connectionIndex !== -1) {
    connections[connectionIndex].metrics.recordsProcessed += job.recordsProcessed;
    connections[connectionIndex].metrics.errorCount += job.recordsFailed;
    connections[connectionIndex].lastSync = new Date();
    saveConnections(connections);
  }

  return job;
}

// GET /api/tools/data-connector-hub/sync - List sync jobs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const connectionId = searchParams.get('connectionId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let jobs = loadSyncJobs();

    if (connectionId) {
      jobs = jobs.filter((job: any) => job.connectionId === connectionId);
    }

    if (status) {
      jobs = jobs.filter((job: any) => job.status === status);
    }

    // Sort by start time descending
    jobs.sort((a: any, b: any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    const paginatedJobs = jobs.slice(0, limit);

    return NextResponse.json({
      jobs: paginatedJobs,
      total: jobs.length,
      limit
    });

  } catch (error) {
    console.error('Error fetching sync jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sync jobs' },
      { status: 500 }
    );
  }
}

// POST /api/tools/data-connector-hub/sync - Start a new sync job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { connectionId, type = 'incremental' } = body;
    
    if (!connectionId) {
      return NextResponse.json(
        { error: 'Connection ID is required' },
        { status: 400 }
      );
    }
    
    if (!['full', 'incremental'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be either "full" or "incremental"' },
        { status: 400 }
      );
    }
    
    // Check if connection exists
    const connections = loadConnections();
    const connection = connections.find((c: any) => c.id === connectionId);

    if (!connection) {
      return NextResponse.json(
        { error: 'Connection not found' },
        { status: 404 }
      );
    }
    
    // Check if there's already a running job for this connection
    const jobs = loadSyncJobs();
    const runningJob = jobs.find((job: any) =>
      job.connectionId === connectionId && job.status === 'running'
    );
    
    if (runningJob) {
      return NextResponse.json(
        { error: 'A sync job is already running for this connection', jobId: runningJob.id },
        { status: 409 }
      );
    }
    
    const newJob = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      connectionId,
      status: 'pending',
      type: type as 'full' | 'incremental',
      progress: 0,
      recordsProcessed: 0,
      recordsFailed: 0,
      startTime: new Date().toISOString()
    };
    
    jobs.push(newJob);
    saveSyncJobs(jobs);
    
    // Start the sync job asynchronously
    simulateSync(newJob).catch(error => {
      console.error('Sync job failed:', error);
      const updatedJobs = loadSyncJobs();
      const jobIndex = updatedJobs.findIndex((j: any) => j.id === newJob.id);
      if (jobIndex !== -1) {
        updatedJobs[jobIndex].status = 'failed';
        updatedJobs[jobIndex].error = error.message;
        updatedJobs[jobIndex].endTime = new Date().toISOString();
        saveSyncJobs(updatedJobs);
      }
    });
    
    return NextResponse.json({
      job: newJob,
      message: 'Sync job started successfully'
    });
    
  } catch (error) {
    console.error('Error starting sync job:', error);
    return NextResponse.json(
      { error: 'Failed to start sync job' },
      { status: 500 }
    );
  }
}

// DELETE /api/tools/data-connector-hub/sync?jobId=xxx - Cancel a sync job
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    
    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }
    
    const jobs = loadSyncJobs();
    const jobIndex = jobs.findIndex((job: any) => job.id === jobId);
    
    if (jobIndex === -1) {
      return NextResponse.json(
        { error: 'Sync job not found' },
        { status: 404 }
      );
    }
    
    const job = jobs[jobIndex];
    
    if (job.status === 'completed' || job.status === 'failed') {
      return NextResponse.json(
        { error: 'Cannot cancel a completed or failed job' },
        { status: 400 }
      );
    }
    
    // Cancel the job
    job.status = 'failed';
    job.error = 'Job cancelled by user';
    job.endTime = new Date().toISOString();
    
    jobs[jobIndex] = job;
    saveSyncJobs(jobs);
    
    return NextResponse.json({
      message: 'Sync job cancelled successfully',
      job
    });
    
  } catch (error) {
    console.error('Error cancelling sync job:', error);
    return NextResponse.json(
      { error: 'Failed to cancel sync job' },
      { status: 500 }
    );
  }
}