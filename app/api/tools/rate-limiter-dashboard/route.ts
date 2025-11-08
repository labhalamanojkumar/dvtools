import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

interface RateLimitRule {
  id: string;
  name: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "ALL";
  limit: number;
  windowMs: number; // Time window in milliseconds
  strategy: "fixed-window" | "sliding-window" | "token-bucket" | "leaky-bucket";
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RateLimitStats {
  ruleId: string;
  totalRequests: number;
  blockedRequests: number;
  allowedRequests: number;
  currentWindow: {
    start: number;
    end: number;
    requests: number;
  };
  topClients: Array<{
    identifier: string;
    requests: number;
    blocked: number;
  }>;
  recentActivity: Array<{
    timestamp: number;
    clientId: string;
    endpoint: string;
    allowed: boolean;
    responseTime?: number;
  }>;
}

interface ClientActivity {
  clientId: string;
  requests: number;
  blocked: number;
  lastSeen: number;
  firstSeen: number;
  avgResponseTime?: number;
}

interface RateLimiterRequest {
  action: "list_rules" | "create_rule" | "update_rule" | "delete_rule" | "get_stats" | "reset_stats" | "simulate_request" | "export_config";
  ruleId?: string;
  rule?: Partial<RateLimitRule>;
  clientId?: string;
  endpoint?: string;
  method?: string;
  redisConfig?: {
    host: string;
    port: number;
    password?: string;
    db?: number;
    tls?: boolean;
  };
}

interface RateLimiterResponse {
  success: boolean;
  rules?: RateLimitRule[];
  rule?: RateLimitRule;
  stats?: RateLimitStats;
  simulation?: {
    allowed: boolean;
    remainingRequests: number;
    resetTime: number;
    ruleId: string;
  };
  config?: any;
  error?: string;
}

// Redis connection management
const redisConnections = new Map<string, Redis>();

function getRedisKey(config: RateLimiterRequest['redisConfig']): string {
  if (!config) return "default";
  return `${config.host}:${config.port}:${config.db || 0}`;
}

async function getRedisClient(config?: RateLimiterRequest['redisConfig']): Promise<Redis> {
  const defaultConfig = {
    host: "161.97.172.172",
    port: 6379,
    password: "87gQQOarM2IJUKqmZA2wcPM4HryGs9El9RvfW49ZKQydlGkbbCr95Xmv0yfVFRS3",
    db: 0,
    tls: true,
  };

  const redisConfig = config || defaultConfig;
  const key = getRedisKey(redisConfig);

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
    host: redisConfig.host,
    port: redisConfig.port,
    password: redisConfig.password,
    db: redisConfig.db || 0,
    tls: redisConfig.tls ? {} : undefined,
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

async function disconnectRedis(config?: RateLimiterRequest['redisConfig']): Promise<void> {
  const key = getRedisKey(config);
  const client = redisConnections.get(key);
  if (client) {
    await client.disconnect();
    redisConnections.delete(key);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: RateLimiterRequest = await request.json();
    const { action, redisConfig } = body;

    switch (action) {
      case "list_rules":
        return await listRules(redisConfig);

      case "create_rule":
        return await createRule(body.rule!, redisConfig);

      case "update_rule":
        return await updateRule(body.ruleId!, body.rule!, redisConfig);

      case "delete_rule":
        return await deleteRule(body.ruleId!, redisConfig);

      case "get_stats":
        return await getStats(body.ruleId, redisConfig);

      case "reset_stats":
        return await resetStats(body.ruleId, redisConfig);

      case "simulate_request":
        return await simulateRequest(body.clientId!, body.endpoint!, body.method, redisConfig);

      case "export_config":
        return await exportConfig(redisConfig);

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

  } catch (error: any) {
    console.error("Rate Limiter error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

async function listRules(redisConfig?: RateLimiterRequest['redisConfig']): Promise<NextResponse> {
  let client: Redis | null = null;
  try {
    client = await getRedisClient(redisConfig);

    const ruleKeys = await client.keys("ratelimit:rules:*");
    const rules: RateLimitRule[] = [];

    for (const key of ruleKeys) {
      const ruleData = await client.get(key);
      if (ruleData) {
        const rule: RateLimitRule = JSON.parse(ruleData);
        rules.push(rule);
      }
    }

    rules.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return NextResponse.json({
      success: true,
      rules,
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Failed to list rules: ${error.message}`,
    });
  } finally {
    if (client) {
      await disconnectRedis(redisConfig);
    }
  }
}

async function createRule(ruleData: Partial<RateLimitRule>, redisConfig?: RateLimiterRequest['redisConfig']): Promise<NextResponse> {
  let client: Redis | null = null;
  try {
    client = await getRedisClient(redisConfig);

    if (!ruleData.name || !ruleData.endpoint || !ruleData.limit || !ruleData.windowMs) {
      return NextResponse.json(
        { error: "Name, endpoint, limit, and window are required" },
        { status: 400 }
      );
    }

    // Check for duplicate rule names
    const ruleKeys = await client.keys("ratelimit:rules:*");
    for (const key of ruleKeys) {
      const ruleDataStr = await client.get(key);
      if (ruleDataStr) {
        const existingRule: RateLimitRule = JSON.parse(ruleDataStr);
        if (existingRule.name.toLowerCase() === ruleData.name!.toLowerCase()) {
          return NextResponse.json(
            { error: "A rule with this name already exists" },
            { status: 409 }
          );
        }
      }
    }

    const now = new Date().toISOString();
    const ruleId = `rule_${Date.now()}`;

    const newRule: RateLimitRule = {
      id: ruleId,
      name: ruleData.name,
      endpoint: ruleData.endpoint,
      method: ruleData.method || "ALL",
      limit: ruleData.limit,
      windowMs: ruleData.windowMs,
      strategy: ruleData.strategy || "fixed-window",
      enabled: ruleData.enabled !== false,
      createdAt: now,
      updatedAt: now,
    };

    await client.set(`ratelimit:rules:${ruleId}`, JSON.stringify(newRule));

    return NextResponse.json({
      success: true,
      rule: newRule,
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Failed to create rule: ${error.message}`,
    });
  } finally {
    if (client) {
      await disconnectRedis(redisConfig);
    }
  }
}

async function updateRule(ruleId: string, updates: Partial<RateLimitRule>, redisConfig?: RateLimiterRequest['redisConfig']): Promise<NextResponse> {
  let client: Redis | null = null;
  try {
    client = await getRedisClient(redisConfig);

    const ruleData = await client.get(`ratelimit:rules:${ruleId}`);
    if (!ruleData) {
      return NextResponse.json(
        { error: "Rule not found" },
        { status: 404 }
      );
    }

    const rule: RateLimitRule = JSON.parse(ruleData);

    // Check for name conflicts if name is being updated
    if (updates.name && updates.name.toLowerCase() !== rule.name.toLowerCase()) {
      const ruleKeys = await client.keys("ratelimit:rules:*");
      for (const key of ruleKeys) {
        const existingData = await client.get(key);
        if (existingData) {
          const existingRule: RateLimitRule = JSON.parse(existingData);
          if (existingRule.id !== ruleId && existingRule.name.toLowerCase() === updates.name!.toLowerCase()) {
            return NextResponse.json(
              { error: "A rule with this name already exists" },
              { status: 409 }
            );
          }
        }
      }
    }

    const updatedRule: RateLimitRule = {
      ...rule,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await client.set(`ratelimit:rules:${ruleId}`, JSON.stringify(updatedRule));

    return NextResponse.json({
      success: true,
      rule: updatedRule,
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Failed to update rule: ${error.message}`,
    });
  } finally {
    if (client) {
      await disconnectRedis(redisConfig);
    }
  }
}

async function deleteRule(ruleId: string, redisConfig?: RateLimiterRequest['redisConfig']): Promise<NextResponse> {
  let client: Redis | null = null;
  try {
    client = await getRedisClient(redisConfig);

    const ruleData = await client.get(`ratelimit:rules:${ruleId}`);
    if (!ruleData) {
      return NextResponse.json(
        { error: "Rule not found" },
        { status: 404 }
      );
    }

    await client.del(`ratelimit:rules:${ruleId}`);
    // Also clean up related stats and logs
    const statsKeys = await client.keys(`ratelimit:stats:${ruleId}:*`);
    if (statsKeys.length > 0) {
      await client.del(...statsKeys);
    }

    return NextResponse.json({
      success: true,
      message: "Rule deleted successfully",
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Failed to delete rule: ${error.message}`,
    });
  } finally {
    if (client) {
      await disconnectRedis(redisConfig);
    }
  }
}

async function getStats(ruleId?: string, redisConfig?: RateLimiterRequest['redisConfig']): Promise<NextResponse> {
  let client: Redis | null = null;
  try {
    client = await getRedisClient(redisConfig);

    if (ruleId) {
      // Get stats for specific rule
      const statsData = await client.get(`ratelimit:stats:${ruleId}`);
      if (!statsData) {
        return NextResponse.json(
          { error: "Stats not found for this rule" },
          { status: 404 }
        );
      }

      const stats: RateLimitStats = JSON.parse(statsData);
      // Update current window stats
      await updateCurrentWindowStats(stats, client);

      return NextResponse.json({
        success: true,
        stats,
      });
    } else {
      // Return stats for all rules
      const ruleKeys = await client.keys("ratelimit:rules:*");
      const allStats: RateLimitStats[] = [];

      for (const ruleKey of ruleKeys) {
        const ruleId = ruleKey.split(":")[2];
        const statsData = await client.get(`ratelimit:stats:${ruleId}`);
        if (statsData) {
          const stats: RateLimitStats = JSON.parse(statsData);
          await updateCurrentWindowStats(stats, client);
          allStats.push(stats);
        }
      }

      return NextResponse.json({
        success: true,
        stats: allStats,
      });
    }

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Failed to get stats: ${error.message}`,
    });
  } finally {
    if (client) {
      await disconnectRedis(redisConfig);
    }
  }
}

async function resetStats(ruleId?: string, redisConfig?: RateLimiterRequest['redisConfig']): Promise<NextResponse> {
  let client: Redis | null = null;
  try {
    client = await getRedisClient(redisConfig);

    if (ruleId) {
      const ruleData = await client.get(`ratelimit:rules:${ruleId}`);
      if (!ruleData) {
        return NextResponse.json(
          { error: "Rule not found" },
          { status: 404 }
        );
      }

      await initializeRuleStats(ruleId, client);

    } else {
      // Reset all stats
      const ruleKeys = await client.keys("ratelimit:rules:*");
      for (const ruleKey of ruleKeys) {
        const ruleId = ruleKey.split(":")[2];
        await initializeRuleStats(ruleId, client);
      }
    }

    return NextResponse.json({
      success: true,
      message: ruleId ? "Rule stats reset successfully" : "All stats reset successfully",
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Failed to reset stats: ${error.message}`,
    });
  } finally {
    if (client) {
      await disconnectRedis(redisConfig);
    }
  }
}

async function simulateRequest(clientId: string, endpoint: string, method: string = "GET", redisConfig?: RateLimiterRequest['redisConfig']): Promise<NextResponse> {
  let client: Redis | null = null;
  try {
    client = await getRedisClient(redisConfig);

    // Find applicable rules
    const ruleKeys = await client.keys("ratelimit:rules:*");
    const applicableRules: RateLimitRule[] = [];

    for (const ruleKey of ruleKeys) {
      const ruleData = await client.get(ruleKey);
      if (ruleData) {
        const rule: RateLimitRule = JSON.parse(ruleData);
        if (!rule.enabled) continue;

        // Check endpoint match (simple pattern matching)
        const endpointMatch = rule.endpoint === "*" ||
          endpoint.includes(rule.endpoint) ||
          new RegExp(rule.endpoint.replace(/\*/g, ".*")).test(endpoint);

        // Check method match
        const methodMatch = rule.method === "ALL" || rule.method === method;

        if (endpointMatch && methodMatch) {
          applicableRules.push(rule);
        }
      }
    }

    if (applicableRules.length === 0) {
      return NextResponse.json({
        success: true,
        simulation: {
          allowed: true,
          remainingRequests: -1, // Unlimited
          resetTime: 0,
          ruleId: "none",
        },
      });
    }

    // Use the first matching rule
    const rule = applicableRules[0];
    const now = Date.now();

    // Check rate limit using Redis
    const allowed = await checkRateLimit(rule, clientId, now, client);

    // Update stats
    await updateRuleStats(rule.id, allowed, clientId, endpoint, method, now, client);

    // Calculate remaining requests and reset time
    const remainingRequests = await getCurrentWindowRequests(rule, clientId, client);
    const resetTime = getWindowResetTime(rule);

    return NextResponse.json({
      success: true,
      simulation: {
        allowed,
        remainingRequests: Math.max(0, rule.limit - remainingRequests),
        resetTime,
        ruleId: rule.id,
      },
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Failed to simulate request: ${error.message}`,
    });
  } finally {
    if (client) {
      await disconnectRedis(redisConfig);
    }
  }
}

async function exportConfig(redisConfig?: RateLimiterRequest['redisConfig']): Promise<NextResponse> {
  let client: Redis | null = null;
  try {
    client = await getRedisClient(redisConfig);

    const ruleKeys = await client.keys("ratelimit:rules:*");
    const rules: RateLimitRule[] = [];

    for (const key of ruleKeys) {
      const ruleData = await client.get(key);
      if (ruleData) {
        rules.push(JSON.parse(ruleData));
      }
    }

    const config = {
      rules,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    };

    return NextResponse.json({
      success: true,
      config,
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Failed to export config: ${error.message}`,
    });
  } finally {
    if (client) {
      await disconnectRedis(redisConfig);
    }
  }
}

async function initializeRuleStats(ruleId: string, client: Redis): Promise<void> {
  const now = Date.now();
  const ruleData = await client.get(`ratelimit:rules:${ruleId}`);
  if (!ruleData) return;

  const rule: RateLimitRule = JSON.parse(ruleData);
  const stats: RateLimitStats = {
    ruleId,
    totalRequests: 0,
    blockedRequests: 0,
    allowedRequests: 0,
    currentWindow: {
      start: now,
      end: now + (rule.windowMs || 60000),
      requests: 0,
    },
    topClients: [],
    recentActivity: [],
  };

  await client.set(`ratelimit:stats:${ruleId}`, JSON.stringify(stats));
}

async function updateCurrentWindowStats(stats: RateLimitStats, client: Redis): Promise<void> {
  const ruleData = await client.get(`ratelimit:rules:${stats.ruleId}`);
  if (!ruleData) return;

  const rule: RateLimitRule = JSON.parse(ruleData);
  const now = Date.now();
  const windowStart = Math.floor(now / rule.windowMs) * rule.windowMs;
  const windowEnd = windowStart + rule.windowMs;

  // Update current window
  const currentRequests = await getCurrentWindowRequests(rule, "global", client);
  stats.currentWindow = {
    start: windowStart,
    end: windowEnd,
    requests: currentRequests,
  };

  // Update top clients
  await updateTopClients(stats, client);

  // Save updated stats
  await client.set(`ratelimit:stats:${stats.ruleId}`, JSON.stringify(stats));
}

async function updateTopClients(stats: RateLimitStats, client: Redis): Promise<void> {
  // Get recent activity logs for this rule
  const logKeys = await client.keys(`ratelimit:logs:${stats.ruleId}:*`);
  const clientStats = new Map<string, { requests: number; blocked: number }>();

  // Get last 100 logs
  for (let i = 0; i < Math.min(logKeys.length, 100); i++) {
    const logData = await client.get(logKeys[i]);
    if (logData) {
      const log = JSON.parse(logData);
      const existing = clientStats.get(log.clientId) || { requests: 0, blocked: 0 };
      existing.requests++;
      if (!log.allowed) existing.blocked++;
      clientStats.set(log.clientId, existing);
    }
  }

  stats.topClients = Array.from(clientStats.entries())
    .map(([identifier, stats]) => ({ identifier, ...stats }))
    .sort((a, b) => b.requests - a.requests)
    .slice(0, 10);
}

async function updateRecentActivity(stats: RateLimitStats, client: Redis): Promise<void> {
  const logKeys = await client.keys(`ratelimit:logs:${stats.ruleId}:*`);
  const activities: any[] = [];

  // Get last 20 logs
  const recentKeys = logKeys.slice(-20);
  for (const key of recentKeys) {
    const logData = await client.get(key);
    if (logData) {
      const log = JSON.parse(logData);
      activities.push({
        timestamp: log.timestamp,
        clientId: log.clientId,
        endpoint: log.endpoint,
        allowed: log.allowed,
        responseTime: log.responseTime,
      });
    }
  }

  stats.recentActivity = activities.reverse();
}

async function updateRuleStats(ruleId: string, allowed: boolean, clientId: string, endpoint: string, method: string, timestamp: number, client: Redis): Promise<void> {
  const statsData = await client.get(`ratelimit:stats:${ruleId}`);
  if (!statsData) return;

  const stats: RateLimitStats = JSON.parse(statsData);
  stats.totalRequests++;
  if (allowed) {
    stats.allowedRequests++;
  } else {
    stats.blockedRequests++;
  }

  // Log the request
  const logKey = `ratelimit:logs:${ruleId}:${timestamp}:${clientId}`;
  const logData = {
    timestamp,
    clientId,
    ruleId,
    endpoint,
    method,
    allowed,
    responseTime: Math.random() * 100 + 50, // Simulated response time
  };
  await client.set(logKey, JSON.stringify(logData));

  // Keep only recent logs (last 1000)
  const logKeys = await client.keys(`ratelimit:logs:${ruleId}:*`);
  if (logKeys.length > 1000) {
    // Sort by timestamp and remove oldest
    logKeys.sort();
    const keysToDelete = logKeys.slice(0, logKeys.length - 1000);
    if (keysToDelete.length > 0) {
      await client.del(...keysToDelete);
    }
  }

  // Update recent activity
  await updateRecentActivity(stats, client);

  // Save updated stats
  await client.set(`ratelimit:stats:${ruleId}`, JSON.stringify(stats));
}

async function checkRateLimit(rule: RateLimitRule, clientId: string, now: number, client: Redis): Promise<boolean> {
  const windowStart = Math.floor(now / rule.windowMs) * rule.windowMs;
  const currentRequests = await getCurrentWindowRequests(rule, clientId, client);
  return currentRequests < rule.limit;
}

async function getCurrentWindowRequests(rule: RateLimitRule, clientId: string, client: Redis): Promise<number> {
  const now = Date.now();
  const windowStart = Math.floor(now / rule.windowMs) * rule.windowMs;

  // Count logs in current window for this client and rule
  const logKeys = await client.keys(`ratelimit:logs:${rule.id}:*`);
  let count = 0;

  for (const key of logKeys) {
    const logData = await client.get(key);
    if (logData) {
      const log = JSON.parse(logData);
      if (log.clientId === clientId && log.timestamp >= windowStart && log.timestamp < windowStart + rule.windowMs) {
        count++;
      }
    }
  }

  return count;
}

function getWindowResetTime(rule: RateLimitRule): number {
  const now = Date.now();
  const windowStart = Math.floor(now / rule.windowMs) * rule.windowMs;
  return windowStart + rule.windowMs;
}