import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  tls?: boolean;
}

interface Job {
  id: string;
  data: any;
  opts: any;
  progress?: number;
  attemptsMade: number;
  finishedOn?: number;
  processedOn?: number;
  failedReason?: string;
  returnvalue?: any;
  stacktrace?: string[];
}

interface QueueInfo {
  name: string;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}

interface JobDebuggerRequest {
  config: RedisConfig;
  action: "list_queues" | "get_queue_info" | "get_jobs" | "get_job_details" | "retry_job" | "delete_job" | "clean_queue";
  queueName?: string;
  jobId?: string;
  state?: "waiting" | "active" | "completed" | "failed" | "delayed";
  limit?: number;
}

interface JobDebuggerResponse {
  success: boolean;
  queues?: QueueInfo[];
  jobs?: Job[];
  job?: Job;
  error?: string;
}

// Redis connection cache
const redisConnections = new Map<string, Redis>();

function getRedisKey(config: RedisConfig): string {
  return `${config.host}:${config.port}:${config.db || 0}`;
}

async function getRedisClient(config: RedisConfig): Promise<Redis> {
  const key = getRedisKey(config);

  if (redisConnections.has(key)) {
    const client = redisConnections.get(key)!;
    try {
      await client.ping();
      return client;
    } catch (error) {
      redisConnections.delete(key);
    }
  }

  const client = new Redis({
    host: config.host,
    port: config.port,
    password: config.password,
    db: config.db || 0,
    tls: config.tls ? {
      rejectUnauthorized: false, // Allow self-signed certificates
      checkServerIdentity: () => undefined, // Skip server identity check
    } : undefined,
    lazyConnect: true,
    maxRetriesPerRequest: 3,
    connectTimeout: 10000,
  });

  try {
    await client.connect();
    redisConnections.set(key, client);
    return client;
  } catch (error: any) {
    throw new Error(`Failed to connect to Redis: ${error.message}`);
  }
}

async function disconnectRedis(config: RedisConfig): Promise<void> {
  const key = getRedisKey(config);
  const client = redisConnections.get(key);
  if (client) {
    await client.disconnect();
    redisConnections.delete(key);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: JobDebuggerRequest = await request.json();
    const { config, action } = body;

    switch (action) {
      case "list_queues":
        return await listQueues(config);

      case "get_queue_info":
        return await getQueueInfo(config, body.queueName!);

      case "get_jobs":
        return await getJobs(config, body.queueName!, body.state, body.limit);

      case "get_job_details":
        return await getJobDetails(config, body.queueName!, body.jobId!);

      case "retry_job":
        return await retryJob(config, body.queueName!, body.jobId!);

      case "delete_job":
        return await deleteJob(config, body.queueName!, body.jobId!, body.state);

      case "clean_queue":
        return await cleanQueue(config, body.queueName!, body.state);

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

  } catch (error: any) {
    console.error("Background Job Debugger error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

async function listQueues(config: RedisConfig): Promise<NextResponse> {
  let client: Redis | null = null;
  try {
    client = await getRedisClient(config);

    // Get all keys that match Bull queue patterns
    const keys = await client.keys("*:*:*");

    // Extract unique queue names from keys
    const queueNames = new Set<string>();
    keys.forEach(key => {
      const parts = key.split(":");
      if (parts.length >= 2) {
        queueNames.add(parts[0]);
      }
    });

    // Get info for each queue
    const queues: QueueInfo[] = [];
    for (const queueName of queueNames) {
      try {
        const info = await getQueueInfoInternal(client, queueName);
        queues.push(info);
      } catch (error) {
        // Skip queues that can't be accessed
        console.warn(`Could not get info for queue ${queueName}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      queues,
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Failed to list queues: ${error.message}`,
    });
  } finally {
    if (client) {
      await disconnectRedis(config);
    }
  }
}

async function getQueueInfo(config: RedisConfig, queueName: string): Promise<NextResponse> {
  let client: Redis | null = null;
  try {
    client = await getRedisClient(config);
    const info = await getQueueInfoInternal(client, queueName);

    return NextResponse.json({
      success: true,
      queues: [info],
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Failed to get queue info: ${error.message}`,
    });
  } finally {
    if (client) {
      await disconnectRedis(config);
    }
  }
}

async function getQueueInfoInternal(client: Redis, queueName: string): Promise<QueueInfo> {
  const [
    waiting,
    active,
    completed,
    failed,
    delayed,
  ] = await Promise.all([
    client.llen(`${queueName}:wait`),
    client.llen(`${queueName}:active`),
    client.zcard(`${queueName}:completed`),
    client.zcard(`${queueName}:failed`),
    client.zcard(`${queueName}:delayed`),
  ]);

  return {
    name: queueName,
    waiting: waiting || 0,
    active: active || 0,
    completed: completed || 0,
    failed: failed || 0,
    delayed: delayed || 0,
  };
}

async function getJobs(
  config: RedisConfig,
  queueName: string,
  state: string = "waiting",
  limit: number = 50
): Promise<NextResponse> {
  let client: Redis | null = null;
  try {
    client = await getRedisClient(config);

    let jobIds: string[] = [];

    switch (state) {
      case "waiting":
        jobIds = await client.lrange(`${queueName}:wait`, 0, limit - 1);
        break;
      case "active":
        jobIds = await client.lrange(`${queueName}:active`, 0, limit - 1);
        break;
      case "completed":
        jobIds = await client.zrevrange(`${queueName}:completed`, 0, limit - 1);
        break;
      case "failed":
        jobIds = await client.zrevrange(`${queueName}:failed`, 0, limit - 1);
        break;
      case "delayed":
        jobIds = await client.zrevrange(`${queueName}:delayed`, 0, limit - 1);
        break;
      default:
        throw new Error(`Invalid state: ${state}`);
    }

    const jobs: Job[] = [];

    for (const jobId of jobIds) {
      try {
        const job = await getJobFromRedis(client, queueName, jobId, state);
        if (job) {
          jobs.push(job);
        }
      } catch (error) {
        console.warn(`Could not get job ${jobId}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      jobs,
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Failed to get jobs: ${error.message}`,
    });
  } finally {
    if (client) {
      await disconnectRedis(config);
    }
  }
}

async function getJobDetails(
  config: RedisConfig,
  queueName: string,
  jobId: string
): Promise<NextResponse> {
  let client: Redis | null = null;
  try {
    client = await getRedisClient(config);

    // Try to find the job in all states
    const states = ["waiting", "active", "completed", "failed", "delayed"];
    let job: Job | null = null;
    let foundState = "";

    for (const state of states) {
      try {
        job = await getJobFromRedis(client, queueName, jobId, state);
        if (job) {
          foundState = state;
          break;
        }
      } catch (error) {
        // Continue to next state
      }
    }

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      job,
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Failed to get job details: ${error.message}`,
    });
  } finally {
    if (client) {
      await disconnectRedis(config);
    }
  }
}

async function getJobFromRedis(
  client: Redis,
  queueName: string,
  jobId: string,
  state: string
): Promise<Job | null> {
  const jobKey = `${queueName}:${jobId}`;

  try {
    const [data, opts, progress, attemptsMade, finishedOn, processedOn, failedReason, returnvalue, stacktrace] =
      await Promise.all([
        client.hget(jobKey, "data"),
        client.hget(jobKey, "opts"),
        client.hget(jobKey, "progress"),
        client.hget(jobKey, "attemptsMade"),
        client.hget(jobKey, "finishedOn"),
        client.hget(jobKey, "processedOn"),
        client.hget(jobKey, "failedReason"),
        client.hget(jobKey, "returnvalue"),
        client.hget(jobKey, "stacktrace"),
      ]);

    if (!data) {
      return null;
    }

    return {
      id: jobId,
      data: JSON.parse(data),
      opts: opts ? JSON.parse(opts) : {},
      progress: progress ? parseFloat(progress) : undefined,
      attemptsMade: attemptsMade ? parseInt(attemptsMade) : 0,
      finishedOn: finishedOn ? parseInt(finishedOn) : undefined,
      processedOn: processedOn ? parseInt(processedOn) : undefined,
      failedReason: failedReason || undefined,
      returnvalue: returnvalue ? JSON.parse(returnvalue) : undefined,
      stacktrace: stacktrace ? JSON.parse(stacktrace) : undefined,
    };
  } catch (error) {
    console.warn(`Error parsing job ${jobId}:`, error);
    return null;
  }
}

async function retryJob(
  config: RedisConfig,
  queueName: string,
  jobId: string
): Promise<NextResponse> {
  let client: Redis | null = null;
  try {
    client = await getRedisClient(config);

    // Move job from failed to waiting
    const jobKey = `${queueName}:${jobId}`;
    const failedKey = `${queueName}:failed`;
    const waitKey = `${queueName}:wait`;

    // Check if job exists in failed set
    const score = await client.zscore(failedKey, jobId);
    if (score === null) {
      return NextResponse.json(
        { error: "Job not found in failed queue" },
        { status: 404 }
      );
    }

    // Remove from failed set
    await client.zrem(failedKey, jobId);

    // Add to waiting list
    await client.rpush(waitKey, jobId);

    // Reset attempts and failed reason
    await client.hdel(jobKey, "finishedOn", "failedReason", "stacktrace");
    await client.hset(jobKey, "attemptsMade", "0");

    return NextResponse.json({
      success: true,
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Failed to retry job: ${error.message}`,
    });
  } finally {
    if (client) {
      await disconnectRedis(config);
    }
  }
}

async function deleteJob(
  config: RedisConfig,
  queueName: string,
  jobId: string,
  state: string = "failed"
): Promise<NextResponse> {
  let client: Redis | null = null;
  try {
    client = await getRedisClient(config);

    const jobKey = `${queueName}:${jobId}`;
    let stateKey = "";

    switch (state) {
      case "waiting":
        stateKey = `${queueName}:wait`;
        await client.lrem(stateKey, 0, jobId);
        break;
      case "active":
        stateKey = `${queueName}:active`;
        await client.lrem(stateKey, 0, jobId);
        break;
      case "completed":
        stateKey = `${queueName}:completed`;
        await client.zrem(stateKey, jobId);
        break;
      case "failed":
        stateKey = `${queueName}:failed`;
        await client.zrem(stateKey, jobId);
        break;
      case "delayed":
        stateKey = `${queueName}:delayed`;
        await client.zrem(stateKey, jobId);
        break;
      default:
        throw new Error(`Invalid state: ${state}`);
    }

    // Clean up job data
    await client.del(jobKey);

    return NextResponse.json({
      success: true,
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Failed to delete job: ${error.message}`,
    });
  } finally {
    if (client) {
      await disconnectRedis(config);
    }
  }
}

async function cleanQueue(
  config: RedisConfig,
  queueName: string,
  state: string = "completed"
): Promise<NextResponse> {
  let client: Redis | null = null;
  try {
    client = await getRedisClient(config);

    let stateKey = "";
    let jobIds: string[] = [];

    switch (state) {
      case "completed":
        stateKey = `${queueName}:completed`;
        jobIds = await client.zrange(stateKey, 0, -1);
        break;
      case "failed":
        stateKey = `${queueName}:failed`;
        jobIds = await client.zrange(stateKey, 0, -1);
        break;
      default:
        throw new Error(`Clean operation only supported for completed and failed states`);
    }

    // Delete jobs and clean up state
    const pipeline = client.pipeline();
    jobIds.forEach(jobId => {
      pipeline.del(`${queueName}:${jobId}`);
    });
    pipeline.del(stateKey);
    await pipeline.exec();

    return NextResponse.json({
      success: true,
      cleanedCount: jobIds.length,
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Failed to clean queue: ${error.message}`,
    });
  } finally {
    if (client) {
      await disconnectRedis(config);
    }
  }
}