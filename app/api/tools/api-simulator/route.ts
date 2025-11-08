import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

interface ApiRequest {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
  url: string;
  headers?: Record<string, string>;
  body?: any;
  auth?: {
    type: "basic" | "bearer" | "api-key" | "oauth2";
    username?: string;
    password?: string;
    token?: string;
    apiKey?: string;
    apiKeyHeader?: string;
  };
  timeout?: number;
  followRedirects?: boolean;
}

interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  responseTime: number;
  size: number;
}

interface AssertionResult {
  name: string;
  passed: boolean;
  expected: any;
  actual: any;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: {
      request: ApiRequest;
      assertions?: Array<{
        type: "status" | "header" | "json" | "text" | "response_time";
        field?: string;
        operator: "equals" | "contains" | "greater_than" | "less_than" | "exists" | "not_exists";
        expected: any;
        name?: string;
      }>;
    } = await request.json();

    const { request: apiRequest, assertions = [] } = body;

    // Validate request
    if (!apiRequest.url || !apiRequest.method) {
      return NextResponse.json(
        { error: "URL and method are required" },
        { status: 400 }
      );
    }

    // Prepare axios config
    const axiosConfig: AxiosRequestConfig = {
      method: apiRequest.method,
      url: apiRequest.url,
      timeout: apiRequest.timeout || 30000,
      maxRedirects: apiRequest.followRedirects === false ? 0 : 5,
      validateStatus: () => true, // Don't throw on any status code
    };

    // Add headers
    axiosConfig.headers = { ...apiRequest.headers };

    // Add authentication
    if (apiRequest.auth) {
      switch (apiRequest.auth.type) {
        case "basic":
          if (apiRequest.auth.username && apiRequest.auth.password) {
            const credentials = Buffer.from(
              `${apiRequest.auth.username}:${apiRequest.auth.password}`
            ).toString("base64");
            axiosConfig.headers.Authorization = `Basic ${credentials}`;
          }
          break;
        case "bearer":
          if (apiRequest.auth.token) {
            axiosConfig.headers.Authorization = `Bearer ${apiRequest.auth.token}`;
          }
          break;
        case "api-key":
          if (apiRequest.auth.apiKey && apiRequest.auth.apiKeyHeader) {
            axiosConfig.headers[apiRequest.auth.apiKeyHeader] = apiRequest.auth.apiKey;
          }
          break;
        case "oauth2":
          if (apiRequest.auth.token) {
            axiosConfig.headers.Authorization = `Bearer ${apiRequest.auth.token}`;
          }
          break;
      }
    }

    // Add body for non-GET requests
    if (apiRequest.method !== "GET" && apiRequest.method !== "HEAD") {
      if (typeof apiRequest.body === "string") {
        axiosConfig.data = apiRequest.body;
      } else if (apiRequest.body) {
        axiosConfig.data = apiRequest.body;
        axiosConfig.headers["Content-Type"] = "application/json";
      }
    }

    // Record start time
    const startTime = Date.now();

    // Make the request
    let response: AxiosResponse;
    try {
      response = await axios(axiosConfig);
    } catch (error: any) {
      // Handle axios errors
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      const errorResponse: ApiResponse = {
        status: error.response?.status || 0,
        statusText: error.response?.statusText || error.message || "Network Error",
        headers: error.response?.headers || {},
        data: error.response?.data || null,
        responseTime,
        size: JSON.stringify(error.response?.data || "").length,
      };

      return NextResponse.json({
        success: false,
        response: errorResponse,
        assertions: runAssertions(assertions, errorResponse),
      });
    }

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Format response
    const apiResponse: ApiResponse = {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
      data: response.data,
      responseTime,
      size: JSON.stringify(response.data).length,
    };

    // Run assertions
    const assertionResults = runAssertions(assertions, apiResponse);

    return NextResponse.json({
      success: true,
      response: apiResponse,
      assertions: assertionResults,
    });

  } catch (error: any) {
    console.error("API Simulator error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

function runAssertions(
  assertions: Array<{
    type: "status" | "header" | "json" | "text" | "response_time";
    field?: string;
    operator: "equals" | "contains" | "greater_than" | "less_than" | "exists" | "not_exists";
    expected: any;
    name?: string;
  }>,
  response: ApiResponse
): AssertionResult[] {
  return assertions.map((assertion) => {
    const name = assertion.name || `${assertion.type} ${assertion.operator} ${assertion.expected}`;

    try {
      let actual: any;
      let passed = false;

      switch (assertion.type) {
        case "status":
          actual = response.status;
          passed = compareValues(actual, assertion.expected, assertion.operator);
          break;

        case "header":
          if (assertion.field) {
            actual = response.headers[assertion.field.toLowerCase()];
            passed = compareValues(actual, assertion.expected, assertion.operator);
          } else {
            passed = false;
          }
          break;

        case "json":
          if (assertion.field && typeof response.data === "object") {
            actual = getNestedValue(response.data, assertion.field);
            passed = compareValues(actual, assertion.expected, assertion.operator);
          } else {
            passed = false;
          }
          break;

        case "text":
          actual = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
          passed = compareValues(actual, assertion.expected, assertion.operator);
          break;

        case "response_time":
          actual = response.responseTime;
          passed = compareValues(actual, assertion.expected, assertion.operator);
          break;

        default:
          passed = false;
      }

      return {
        name,
        passed,
        expected: assertion.expected,
        actual,
        message: passed
          ? "Assertion passed"
          : `Expected ${assertion.expected}, but got ${actual}`,
      };
    } catch (error) {
      return {
        name,
        passed: false,
        expected: assertion.expected,
        actual: null,
        message: `Assertion error: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  });
}

function compareValues(actual: any, expected: any, operator: string): boolean {
  switch (operator) {
    case "equals":
      return actual === expected;
    case "contains":
      return String(actual).includes(String(expected));
    case "greater_than":
      return Number(actual) > Number(expected);
    case "less_than":
      return Number(actual) < Number(expected);
    case "exists":
      return actual !== undefined && actual !== null;
    case "not_exists":
      return actual === undefined || actual === null;
    default:
      return false;
  }
}

function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((current, key) => current?.[key], obj);
}