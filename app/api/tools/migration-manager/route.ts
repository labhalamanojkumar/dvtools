import { NextRequest, NextResponse } from "next/server";
import { Client as PostgresClient } from "pg";
import mysql from "mysql2/promise";
import { v4 as uuidv4 } from "uuid";
import { DatabaseConfig } from "@/types";

interface Migration {
  id: string;
  name: string;
  up: string;
  down: string;
  created_at: string;
  executed_at?: string;
  status: "pending" | "executed" | "failed";
  checksum: string;
}

interface MigrationRequest {
  config: DatabaseConfig;
  action: "list" | "preview" | "execute" | "rollback" | "create";
  migration?: Partial<Migration>;
  targetMigrationId?: string;
}

interface MigrationResult {
  success: boolean;
  migrations?: Migration[];
  preview?: {
    up: string[];
    down: string[];
  };
  executedMigrations?: Migration[];
  error?: string;
}

// In-memory storage for demo purposes - in production, use a database
const migrations: Migration[] = [];

export async function POST(request: NextRequest) {
  try {
    const body: MigrationRequest = await request.json();
    const { config, action } = body;

    switch (action) {
      case "list":
        return await listMigrations(config);

      case "preview":
        return await previewMigration(config, body.migration);

      case "execute":
        return await executeMigration(config, body.migration);

      case "rollback":
        return await rollbackMigration(config, body.targetMigrationId);

      case "create":
        return await createMigration(body.migration);

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

  } catch (error: any) {
    console.error("Migration Manager error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

async function listMigrations(config: DatabaseConfig): Promise<NextResponse> {
  try {
    // Check if migration table exists and get migrations from database
    const dbMigrations = await getMigrationsFromDatabase(config);

    return NextResponse.json({
      success: true,
      migrations: dbMigrations,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Failed to list migrations: ${error.message}`,
    });
  }
}

async function previewMigration(
  config: DatabaseConfig,
  migration?: Partial<Migration>
): Promise<NextResponse> {
  if (!migration?.up) {
    return NextResponse.json(
      { error: "Migration up script is required" },
      { status: 400 }
    );
  }

  try {
    // Split the migration script into individual statements
    const upStatements = splitSQLStatements(migration.up);
    const downStatements = migration.down ? splitSQLStatements(migration.down) : [];

    return NextResponse.json({
      success: true,
      preview: {
        up: upStatements,
        down: downStatements,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Failed to preview migration: ${error.message}`,
    });
  }
}

async function executeMigration(
  config: DatabaseConfig,
  migration?: Partial<Migration>
): Promise<NextResponse> {
  if (!migration?.up || !migration?.name) {
    return NextResponse.json(
      { error: "Migration name and up script are required" },
      { status: 400 }
    );
  }

  const migrationId = uuidv4();
  const checksum = generateChecksum(migration.up);

  const newMigration: Migration = {
    id: migrationId,
    name: migration.name,
    up: migration.up,
    down: migration.down || "",
    created_at: new Date().toISOString(),
    status: "pending",
    checksum,
  };

  try {
    // Execute the migration
    await executeSQLStatements(config, splitSQLStatements(migration.up));

    // Record the migration as executed
    newMigration.executed_at = new Date().toISOString();
    newMigration.status = "executed";

    // Store in our in-memory storage
    migrations.push(newMigration);

    // Also try to record in database if migration table exists
    await recordMigrationInDatabase(config, newMigration);

    return NextResponse.json({
      success: true,
      executedMigrations: [newMigration],
    });
  } catch (error: any) {
    newMigration.status = "failed";
    migrations.push(newMigration);

    return NextResponse.json({
      success: false,
      error: `Migration failed: ${error.message}`,
    });
  }
}

async function rollbackMigration(
  config: DatabaseConfig,
  targetMigrationId?: string
): Promise<NextResponse> {
  if (!targetMigrationId) {
    return NextResponse.json(
      { error: "Target migration ID is required for rollback" },
      { status: 400 }
    );
  }

  try {
    // Find the migration to rollback
    const migration = migrations.find(m => m.id === targetMigrationId);
    if (!migration) {
      return NextResponse.json(
        { error: "Migration not found" },
        { status: 404 }
      );
    }

    if (!migration.down) {
      return NextResponse.json(
        { error: "Migration does not have a down script" },
        { status: 400 }
      );
    }

    // Execute the down script
    await executeSQLStatements(config, splitSQLStatements(migration.down));

    // Update migration status
    migration.status = "pending";
    migration.executed_at = undefined;

    // Remove from database record
    await removeMigrationFromDatabase(config, migration.id);

    return NextResponse.json({
      success: true,
      executedMigrations: [migration],
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Rollback failed: ${error.message}`,
    });
  }
}

async function createMigration(migration?: Partial<Migration>): Promise<NextResponse> {
  if (!migration?.name) {
    return NextResponse.json(
      { error: "Migration name is required" },
      { status: 400 }
    );
  }

  const migrationId = uuidv4();
  const newMigration: Migration = {
    id: migrationId,
    name: migration.name,
    up: migration.up || "",
    down: migration.down || "",
    created_at: new Date().toISOString(),
    status: "pending",
    checksum: generateChecksum(migration.up || ""),
  };

  migrations.push(newMigration);

  return NextResponse.json({
    success: true,
    migrations: [newMigration],
  });
}

// Helper functions

async function getMigrationsFromDatabase(config: DatabaseConfig): Promise<Migration[]> {
  // This would check for a migrations table in the database
  // For now, return our in-memory migrations
  return migrations;
}

async function recordMigrationInDatabase(config: DatabaseConfig, migration: Migration): Promise<void> {
  // This would insert the migration record into a migrations table
  // For now, we just keep it in memory
}

async function removeMigrationFromDatabase(config: DatabaseConfig, migrationId: string): Promise<void> {
  // This would remove the migration record from the database
  // For now, we just update our in-memory storage
}

async function executeSQLStatements(config: DatabaseConfig, statements: string[]): Promise<void> {
  if (config.type === "postgresql") {
    const client = new PostgresClient({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.username,
      password: config.password,
      ssl: config.ssl ? { rejectUnauthorized: false } : false,
    });

    try {
      await client.connect();
      for (const statement of statements) {
        if (statement.trim()) {
          await client.query(statement);
        }
      }
    } finally {
      await client.end();
    }
  } else if (config.type === "mysql") {
    const connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.username,
      password: config.password,
      ssl: config.ssl ? {} : undefined,
      multipleStatements: true,
    });

    try {
      for (const statement of statements) {
        if (statement.trim()) {
          await connection.execute(statement);
        }
      }
    } finally {
      await connection.end();
    }
  }
}

function splitSQLStatements(sql: string): string[] {
  // Simple SQL statement splitter - handles basic cases
  // In production, you'd want a more robust SQL parser
  const statements = sql
    .split(";")
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0);

  return statements;
}

function generateChecksum(sql: string): string {
  // Simple checksum - in production, use a proper hashing algorithm
  let hash = 0;
  for (let i = 0; i < sql.length; i++) {
    const char = sql.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}