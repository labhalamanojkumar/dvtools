import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
export const dynamic = 'force-dynamic';

interface Connection {
  id: string;
  name: string;
  type: 'database' | 'api' | 'cloud' | 'filesystem';
  subtype: string;
  config: any;
  status: 'connected' | 'disconnected' | 'error' | 'connecting';
  lastSync?: Date;
  errorMessage?: string;
  metrics: {
    recordsProcessed: number;
    syncDuration: number;
    errorCount: number;
  };
}

// File-based storage for demo purposes - in production, use a database
const CONNECTIONS_FILE = path.join(process.cwd(), 'data', 'connections.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Load connections from file
const loadConnections = (): Connection[] => {
  try {
    ensureDataDir();
    if (fs.existsSync(CONNECTIONS_FILE)) {
      const data = fs.readFileSync(CONNECTIONS_FILE, 'utf8');
      const parsed = JSON.parse(data);
      // Convert date strings back to Date objects
      return parsed.map((conn: any) => ({
        ...conn,
        lastSync: conn.lastSync ? new Date(conn.lastSync) : undefined
      }));
    }
  } catch (error) {
    console.error('Error loading connections:', error);
  }
  return [];
};

// Save connections to file
const saveConnections = (connections: Connection[]) => {
  try {
    ensureDataDir();
    const data = JSON.stringify(connections, null, 2);
    fs.writeFileSync(CONNECTIONS_FILE, data, 'utf8');
  } catch (error) {
    console.error('Error saving connections:', error);
  }
};

// Helper function to generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// POST - Create new connection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, subtype, config } = body;

    if (!name || !type || !subtype) {
      return NextResponse.json(
        { error: 'Name, type, and subtype are required' },
        { status: 400 }
      );
    }

    const connections = loadConnections();

    // Check if connection name already exists
    if (connections.some(conn => conn.name === name)) {
      return NextResponse.json(
        { error: 'Connection name already exists' },
        { status: 400 }
      );
    }

    const newConnection: Connection = {
      id: generateId(),
      name,
      type,
      subtype,
      config: config || {},
      status: 'disconnected',
      metrics: {
        recordsProcessed: 0,
        syncDuration: 0,
        errorCount: 0
      }
    };

    connections.push(newConnection);
    saveConnections(connections);

    return NextResponse.json({
      success: true,
      connection: newConnection
    });

  } catch (error) {
    console.error('Error creating connection:', error);
    return NextResponse.json(
      { error: 'Failed to create connection' },
      { status: 500 }
    );
  }
}

// GET - List all connections
export async function GET(request: NextRequest) {
  try {
    const connections = loadConnections();

    return NextResponse.json({
      connections,
      total: connections.length,
      active: connections.filter(c => c.status === 'connected').length
    });

  } catch (error) {
    console.error('Error fetching connections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch connections' },
      { status: 500 }
    );
  }
}

// PUT - Update connection
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Connection ID is required' },
        { status: 400 }
      );
    }

    const connections = loadConnections();
    const index = connections.findIndex(c => c.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Connection not found' },
        { status: 404 }
      );
    }

    // Update the connection
    connections[index] = { ...connections[index], ...updates };
    saveConnections(connections);

    return NextResponse.json({
      success: true,
      connection: connections[index]
    });

  } catch (error) {
    console.error('Error updating connection:', error);
    return NextResponse.json(
      { error: 'Failed to update connection' },
      { status: 500 }
    );
  }
}

// DELETE - Delete connection
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const connectionId = searchParams.get('connectionId');

    if (!connectionId) {
      return NextResponse.json(
        { error: 'Connection ID is required' },
        { status: 400 }
      );
    }

    const connections = loadConnections();
    const index = connections.findIndex(c => c.id === connectionId);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Connection not found' },
        { status: 404 }
      );
    }

    connections.splice(index, 1);
    saveConnections(connections);

    return NextResponse.json({
      success: true,
      message: 'Connection deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting connection:', error);
    return NextResponse.json(
      { error: 'Failed to delete connection' },
      { status: 500 }
    );
  }
}
