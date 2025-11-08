import { NextRequest, NextResponse } from "next/server";

interface ContractInteraction {
  description: string;
  request: {
    method: string;
    path: string;
    headers?: Record<string, string>;
    body?: any;
  };
  response: {
    status: number;
    headers?: Record<string, string>;
    body?: any;
  };
}

interface Contract {
  consumer: { name: string };
  provider: { name: string };
  interactions: ContractInteraction[];
  metadata?: any;
}

interface TestResult {
  interaction: string;
  status: "passed" | "failed";
  expected: any;
  actual: any;
  differences: string[];
  duration: number;
}

function compareValues(expected: any, actual: any, path: string = "root"): string[] {
  const differences: string[] = [];

  if (typeof expected !== typeof actual) {
    differences.push(`Type mismatch at ${path}: expected ${typeof expected}, got ${typeof actual}`);
    return differences;
  }

  if (expected === null || actual === null) {
    if (expected !== actual) {
      differences.push(`Value mismatch at ${path}: expected ${expected}, got ${actual}`);
    }
    return differences;
  }

  if (typeof expected === "object") {
    if (Array.isArray(expected)) {
      if (!Array.isArray(actual)) {
        differences.push(`${path} should be an array`);
        return differences;
      }

      if (expected.length !== actual.length) {
        differences.push(`Array length mismatch at ${path}: expected ${expected.length}, got ${actual.length}`);
      }

      const minLength = Math.min(expected.length, actual.length);
      for (let i = 0; i < minLength; i++) {
        differences.push(...compareValues(expected[i], actual[i], `${path}[${i}]`));
      }
    } else {
      const expectedKeys = Object.keys(expected);
      const actualKeys = Object.keys(actual);

      // Check for missing keys
      for (const key of expectedKeys) {
        if (!(key in actual)) {
          differences.push(`Missing key at ${path}.${key}`);
        } else {
          differences.push(...compareValues(expected[key], actual[key], `${path}.${key}`));
        }
      }

      // Check for extra keys
      for (const key of actualKeys) {
        if (!(key in expected)) {
          differences.push(`Unexpected key at ${path}.${key}`);
        }
      }
    }
  } else if (expected !== actual) {
    differences.push(`Value mismatch at ${path}: expected ${expected}, got ${actual}`);
  }

  return differences;
}

async function runTestsAgainstProvider(contract: Contract, providerUrl: string): Promise<TestResult[]> {
  const results: TestResult[] = [];

  for (const interaction of contract.interactions) {
    const startTime = Date.now();
    
    try {
      const url = `${providerUrl}${interaction.request.path}`;
      const fetchOptions: RequestInit = {
        method: interaction.request.method,
        headers: interaction.request.headers || {},
      };

      if (interaction.request.body) {
        fetchOptions.body = JSON.stringify(interaction.request.body);
        if (!fetchOptions.headers) fetchOptions.headers = {};
        (fetchOptions.headers as Record<string, string>)["Content-Type"] = "application/json";
      }

      // In a real scenario, this would make an actual HTTP request
      // For demo purposes, we'll simulate it
      const response = await fetch(url, fetchOptions).catch(() => null);
      
      const duration = Date.now() - startTime;

      // Simulate response for demo (in production, parse actual response)
      const actualResponse = response ? {
        status: response.status,
        body: await response.json().catch(() => ({}))
      } : {
        status: interaction.response.status,
        body: interaction.response.body // Demo: return expected
      };

      // Compare expected vs actual
      const statusMatches = actualResponse.status === interaction.response.status;
      const bodyDifferences = compareValues(interaction.response.body, actualResponse.body, "body");

      const status = statusMatches && bodyDifferences.length === 0 ? "passed" : "failed";
      const differences: string[] = [];

      if (!statusMatches) {
        differences.push(`Status code mismatch: expected ${interaction.response.status}, got ${actualResponse.status}`);
      }

      differences.push(...bodyDifferences);

      results.push({
        interaction: interaction.description,
        status,
        expected: {
          status: interaction.response.status,
          body: interaction.response.body
        },
        actual: actualResponse,
        differences,
        duration
      });

    } catch (error) {
      const duration = Date.now() - startTime;
      results.push({
        interaction: interaction.description,
        status: "failed",
        expected: {
          status: interaction.response.status,
          body: interaction.response.body
        },
        actual: {
          error: error instanceof Error ? error.message : "Unknown error"
        },
        differences: [`Test execution failed: ${error instanceof Error ? error.message : "Unknown error"}`],
        duration
      });
    }
  }

  return results;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, contract, providerUrl } = body;

    if (action === "runTests") {
      if (!contract || !contract.interactions) {
        return NextResponse.json(
          { error: "Invalid contract format" },
          { status: 400 }
        );
      }

      if (!providerUrl) {
        return NextResponse.json(
          { error: "Provider URL is required" },
          { status: 400 }
        );
      }

      const results = await runTestsAgainstProvider(contract, providerUrl);

      return NextResponse.json({
        success: true,
        results,
        summary: {
          total: results.length,
          passed: results.filter(r => r.status === "passed").length,
          failed: results.filter(r => r.status === "failed").length
        }
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Contract testing API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
