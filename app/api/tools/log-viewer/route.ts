import { NextRequest, NextResponse } from 'next/server';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
  category: string;
  message: string;
  source: string;
  metadata?: any;
}

interface LogStats {
  total: number;
  byLevel: Record<string, number>;
  byCategory: Record<string, number>;
  bySource: Record<string, number>;
  timeRange: {
    start: string;
    end: string;
  };
}

interface LogResponse {
  logs: LogEntry[];
  stats: LogStats;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// Mock log data for demonstration
const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    level: 'INFO',
    category: 'web',
    source: 'nginx',
    message: 'User login successful',
    metadata: { userId: '12345', ip: '192.168.1.1' }
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    level: 'ERROR',
    category: 'api',
    source: 'express',
    message: 'Database connection failed',
    metadata: { error: 'ECONNREFUSED', host: 'localhost:5432' }
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 900000).toISOString(),
    level: 'WARN',
    category: 'auth',
    source: 'jwt-service',
    message: 'Invalid token format',
    metadata: { token: 'eyJ...', reason: 'malformed' }
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    level: 'DEBUG',
    category: 'cache',
    source: 'redis',
    message: 'Cache miss for key: user:12345',
    metadata: { key: 'user:12345', ttl: 3600 }
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 60000).toISOString(),
    level: 'CRITICAL',
    category: 'payment',
    source: 'stripe-webhook',
    message: 'Payment processing failed',
    metadata: { paymentId: 'pi_1234567890', amount: 99.99, currency: 'USD' }
  }
];

function filterLogs(logs: LogEntry[], filters: any): LogEntry[] {
  return logs.filter(log => {
    if (filters.startDate && new Date(log.timestamp) < new Date(filters.startDate)) return false;
    if (filters.endDate && new Date(log.timestamp) > new Date(filters.endDate)) return false;
    if (filters.level && filters.level !== 'ALL' && log.level !== filters.level) return false;
    if (filters.category && !log.category.toLowerCase().includes(filters.category.toLowerCase())) return false;
    if (filters.source && !log.source.toLowerCase().includes(filters.source.toLowerCase())) return false;
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const regex = filters.regex ? new RegExp(query, 'i') : null;
      const matches = regex
        ? regex.test(log.message) || regex.test(log.category) || regex.test(log.source)
        : log.message.toLowerCase().includes(query) ||
          log.category.toLowerCase().includes(query) ||
          log.source.toLowerCase().includes(query);
      if (!matches) return false;
    }
    return true;
  });
}

function calculateStats(logs: LogEntry[]): LogStats {
  const byLevel: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  const bySource: Record<string, number> = {};

  logs.forEach(log => {
    byLevel[log.level] = (byLevel[log.level] || 0) + 1;
    byCategory[log.category] = (byCategory[log.category] || 0) + 1;
    bySource[log.source] = (bySource[log.source] || 0) + 1;
  });

  const timestamps = logs.map(log => new Date(log.timestamp));
  const start = timestamps.length > 0 ? new Date(Math.min(...timestamps.map(d => d.getTime()))).toISOString() : '';
  const end = timestamps.length > 0 ? new Date(Math.max(...timestamps.map(d => d.getTime()))).toISOString() : '';

  return {
    total: logs.length,
    byLevel,
    byCategory,
    bySource,
    timeRange: { start, end }
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = {
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      level: searchParams.get('level'),
      category: searchParams.get('category'),
      source: searchParams.get('source'),
      query: searchParams.get('query'),
      regex: searchParams.get('regex') === 'true'
    };

    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 1000);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Filter logs
    const filteredLogs = filterLogs(mockLogs, filters);

    // Apply pagination
    const paginatedLogs = filteredLogs.slice(offset, offset + limit);
    const hasMore = offset + limit < filteredLogs.length;

    // Calculate stats for filtered logs
    const stats = calculateStats(filteredLogs);

    const response: LogResponse = {
      logs: paginatedLogs,
      stats,
      pagination: {
        total: filteredLogs.length,
        limit,
        offset,
        hasMore
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // In a real implementation, this would save logs to a database
    // For now, we'll just add to the mock data
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      level: body.level || 'INFO',
      category: body.category || 'unknown',
      source: body.source || 'manual',
      message: body.message || '',
      metadata: body.metadata
    };

    mockLogs.unshift(newLog); // Add to beginning

    return NextResponse.json({
      success: true,
      log: newLog
    });
  } catch (error) {
    console.error('Error creating log:', error);
    return NextResponse.json(
      { error: 'Failed to create log' },
      { status: 500 }
    );
  }
}
