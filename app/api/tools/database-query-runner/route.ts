import { NextRequest, NextResponse } from "next/server";
import { Client as PostgresClient } from "pg";
import mysql from "mysql2/promise";
import { DatabaseConfig } from "@/types";

interface QueryRequest {
  config: DatabaseConfig;
  query: string;
  explain?: boolean;
  format?: boolean;
}

interface QueryResult {
  success: boolean;
  data?: any[];
  columns?: string[];
  rowCount?: number;
  executionTime?: number;
  explainPlan?: any;
  formattedQuery?: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: QueryRequest = await request.json();
    const { config, query, explain = false, format = false } = body;

    // Validate input
    if (!query || !query.trim()) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    // Basic SQL injection protection - only allow SELECT statements
    const trimmedQuery = query.trim().toUpperCase();
    if (!trimmedQuery.startsWith("SELECT") && !trimmedQuery.startsWith("EXPLAIN") && !trimmedQuery.startsWith("DESCRIBE") && !trimmedQuery.startsWith("SHOW")) {
      return NextResponse.json(
        { error: "Only SELECT, EXPLAIN, DESCRIBE, and SHOW statements are allowed for security" },
        { status: 400 }
      );
    }

    const startTime = Date.now();

    try {
      let result: QueryResult;

      if (config.type === "postgresql") {
        result = await executePostgresQuery(config, query, explain);
      } else if (config.type === "mysql") {
        result = await executeMySQLQuery(config, query, explain);
      } else {
        return NextResponse.json(
          { error: "Unsupported database type. Only PostgreSQL and MySQL are supported." },
          { status: 400 }
        );
      }

      const executionTime = Date.now() - startTime;
      result.executionTime = executionTime;

      // Format query if requested
      if (format) {
        result.formattedQuery = formatSQL(query);
      }

      return NextResponse.json(result);

    } catch (dbError: any) {
      const executionTime = Date.now() - startTime;
      return NextResponse.json({
        success: false,
        executionTime,
        error: `Database error: ${dbError.message}`,
      });
    }

  } catch (error: any) {
    console.error("Database Query Runner error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

async function executePostgresQuery(
  config: DatabaseConfig,
  query: string,
  explain: boolean
): Promise<QueryResult> {
  const client = new PostgresClient({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.username,
    password: config.password,
    ssl: config.ssl ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 10000,
    query_timeout: 30000,
  });

  try {
    await client.connect();

    let explainPlan;

    if (explain) {
      // Get EXPLAIN plan
      const explainResult = await client.query(`EXPLAIN (FORMAT JSON) ${query}`);
      explainPlan = explainResult.rows[0]["QUERY PLAN"];
    }

    // Execute the actual query
    const result = await client.query(query);

    return {
      success: true,
      data: result.rows,
      columns: result.fields?.map(field => field.name),
      rowCount: result.rowCount || 0,
      explainPlan,
    };

  } finally {
    await client.end();
  }
}

async function executeMySQLQuery(
  config: DatabaseConfig,
  query: string,
  explain: boolean
): Promise<QueryResult> {
  const connection = await mysql.createConnection({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.username,
    password: config.password,
    ssl: config.ssl ? {} : undefined,
    connectTimeout: 10000,
  });

  try {
    let explainPlan;

    if (explain) {
      // Get EXPLAIN plan
      const [explainRows] = await connection.execute(`EXPLAIN FORMAT=JSON ${query}`);
      explainPlan = explainRows;
    }

    // Execute the actual query
    const [result] = await connection.execute(query);

    return {
      success: true,
      data: Array.isArray(result) ? result : [result],
      columns: result && Array.isArray(result) && result.length > 0
        ? Object.keys(result[0])
        : undefined,
      rowCount: Array.isArray(result) ? result.length : 1,
      explainPlan,
    };

  } finally {
    await connection.end();
  }
}

function formatSQL(sql: string): string {
  // Basic SQL formatting - this is a simple implementation
  // In a real application, you might want to use a proper SQL formatter library
  let formatted = sql
    .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
    .replace(/\s*,\s*/g, ',\n    ')  // Format commas
    .replace(/\s*SELECT\s+/gi, 'SELECT\n    ')
    .replace(/\s*FROM\s+/gi, '\nFROM\n    ')
    .replace(/\s*WHERE\s+/gi, '\nWHERE\n    ')
    .replace(/\s*JOIN\s+/gi, '\nJOIN ')
    .replace(/\s*ORDER BY\s+/gi, '\nORDER BY ')
    .replace(/\s*GROUP BY\s+/gi, '\nGROUP BY ')
    .replace(/\s*HAVING\s+/gi, '\nHAVING ')
    .replace(/\s*LIMIT\s+/gi, '\nLIMIT ');

  // Handle subqueries and functions
  formatted = formatted.replace(/\(/g, '(\n    ');
  formatted = formatted.replace(/\)/g, '\n)');

  return formatted.trim();
}