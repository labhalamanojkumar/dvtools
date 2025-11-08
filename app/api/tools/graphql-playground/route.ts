import { NextRequest, NextResponse } from "next/server";

const INTROSPECTION_QUERY = `
  query IntrospectionQuery {
    __schema {
      types {
        name
        kind
        description
        fields {
          name
          type {
            name
            kind
          }
          description
        }
      }
    }
  }
`;

interface SchemaType {
  name: string;
  kind: string;
  description?: string;
  fields?: Array<{
    name: string;
    type: { name?: string; kind: string };
    description?: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, endpoint, query, variables, headers } = body;

    if (!endpoint) {
      return NextResponse.json(
        { error: "GraphQL endpoint is required" },
        { status: 400 }
      );
    }

    if (action === "introspect") {
      // Fetch schema via introspection
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers
        },
        body: JSON.stringify({
          query: INTROSPECTION_QUERY
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch schema: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.errors) {
        return NextResponse.json(
          { error: "Introspection failed", details: data.errors },
          { status: 400 }
        );
      }

      // Filter out internal types (starting with __)
      const schema: SchemaType[] = data.data.__schema.types
        .filter((type: SchemaType) => !type.name.startsWith("__"))
        .map((type: SchemaType) => ({
          name: type.name,
          kind: type.kind,
          description: type.description,
          fields: type.fields?.map(field => ({
            name: field.name,
            type: field.type.name || field.type.kind,
            description: field.description
          }))
        }));

      return NextResponse.json({
        success: true,
        schema
      });
    }

    if (action === "execute") {
      if (!query) {
        return NextResponse.json(
          { error: "Query is required" },
          { status: 400 }
        );
      }

      const startTime = Date.now();

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers
        },
        body: JSON.stringify({
          query,
          variables: variables || {}
        })
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      if (!response.ok) {
        throw new Error(`Query execution failed: ${response.statusText}`);
      }

      const result = await response.json();

      // Add tracing information
      return NextResponse.json({
        success: true,
        result: {
          ...result,
          extensions: {
            ...result.extensions,
            tracing: {
              duration,
              startTime: new Date(startTime).toISOString(),
              endTime: new Date(endTime).toISOString()
            }
          }
        }
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("GraphQL Playground API error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
