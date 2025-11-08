import { NextRequest, NextResponse } from "next/server";
import yaml from "js-yaml";

interface OpenAPISpec {
  openapi?: string;
  swagger?: string;
  info?: {
    title?: string;
    version?: string;
  };
  paths?: Record<string, any>;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  try {
    const { action, spec, format, targetFormat } = await request.json();

    if (!action || !spec) {
      return NextResponse.json(
        { error: "Missing required fields: action and spec" },
        { status: 400 }
      );
    }

    let parsedSpec: OpenAPISpec;

    // Parse the specification
    try {
      if (format === "yaml") {
        parsedSpec = yaml.load(spec) as OpenAPISpec;
      } else {
        parsedSpec = JSON.parse(spec);
      }
    } catch (error) {
      return NextResponse.json(
        { error: `Invalid ${format.toUpperCase()} format: ${error instanceof Error ? error.message : 'Parse error'}` },
        { status: 400 }
      );
    }

    switch (action) {
      case "validate":
        return handleValidate(parsedSpec);
      
      case "preview":
        return handlePreview(parsedSpec);
      
      case "generateExamples":
        return handleGenerateExamples(parsedSpec, format);
      
      case "convert":
        return handleConvert(parsedSpec, targetFormat);
      
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("OpenAPI API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

function handleValidate(spec: OpenAPISpec) {
  const errors: Array<{ path: string; message: string; severity: "error" | "warning" }> = [];
  const warnings: Array<{ path: string; message: string; severity: "error" | "warning" }> = [];

  // Check OpenAPI version
  const version = spec.openapi || spec.swagger || "unknown";
  if (!spec.openapi && !spec.swagger) {
    errors.push({
      path: "root",
      message: "Missing 'openapi' or 'swagger' version field",
      severity: "error"
    });
  }

  // Check required info field
  if (!spec.info) {
    errors.push({
      path: "info",
      message: "Missing required 'info' object",
      severity: "error"
    });
  } else {
    if (!spec.info.title) {
      errors.push({
        path: "info.title",
        message: "Missing required 'title' field",
        severity: "error"
      });
    }
    if (!spec.info.version) {
      errors.push({
        path: "info.version",
        message: "Missing required 'version' field",
        severity: "error"
      });
    }
  }

  // Check paths
  if (!spec.paths || Object.keys(spec.paths).length === 0) {
    warnings.push({
      path: "paths",
      message: "No API paths defined",
      severity: "warning"
    });
  }

  let endpointCount = 0;
  if (spec.paths) {
    for (const [path, pathItem] of Object.entries(spec.paths)) {
      if (!path.startsWith('/')) {
        errors.push({
          path: `paths.${path}`,
          message: "Path must start with '/'",
          severity: "error"
        });
      }

      const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];
      for (const method of methods) {
        if (pathItem[method]) {
          endpointCount++;
          const operation = pathItem[method];

          if (!operation.responses) {
            errors.push({
              path: `paths.${path}.${method}`,
              message: "Missing required 'responses' field",
              severity: "error"
            });
          }

          if (!operation.summary && !operation.description) {
            warnings.push({
              path: `paths.${path}.${method}`,
              message: "Consider adding summary or description",
              severity: "warning"
            });
          }
        }
      }
    }
  }

  return NextResponse.json({
    valid: errors.length === 0,
    errors,
    warnings,
    version,
    endpoints: endpointCount
  });
}

function handlePreview(spec: OpenAPISpec) {
  const endpoints: Array<{
    path: string;
    method: string;
    summary: string;
    description: string;
    parameters: any[];
    responses: Record<string, any>;
  }> = [];

  if (!spec.paths) {
    return NextResponse.json({ endpoints });
  }

  for (const [path, pathItem] of Object.entries(spec.paths)) {
    const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];
    
    for (const method of methods) {
      if (pathItem[method]) {
        const operation = pathItem[method];
        endpoints.push({
          path,
          method: method.toUpperCase(),
          summary: operation.summary || '',
          description: operation.description || '',
          parameters: operation.parameters || [],
          responses: operation.responses || {}
        });
      }
    }
  }

  return NextResponse.json({ endpoints });
}

function handleGenerateExamples(spec: OpenAPISpec, format: string) {
  // Generate example responses for each endpoint
  if (spec.paths) {
    for (const [path, pathItem] of Object.entries(spec.paths)) {
      const methods = ['get', 'post', 'put', 'delete', 'patch'];
      
      for (const method of methods) {
        if (pathItem[method]) {
          const operation = pathItem[method];
          
          // Generate examples for responses
          if (operation.responses) {
            for (const [status, response] of Object.entries(operation.responses)) {
              if ((response as any).content) {
                for (const [contentType, mediaType] of Object.entries((response as any).content)) {
                  if ((mediaType as any).schema && !(mediaType as any).example) {
                    (mediaType as any).example = generateExampleFromSchema((mediaType as any).schema);
                  }
                }
              }
            }
          }

          // Generate examples for request body
          if (operation.requestBody?.content) {
            for (const [contentType, mediaType] of Object.entries(operation.requestBody.content)) {
              if ((mediaType as any).schema && !(mediaType as any).example) {
                (mediaType as any).example = generateExampleFromSchema((mediaType as any).schema);
              }
            }
          }
        }
      }
    }
  }

  const specWithExamples = format === "yaml" 
    ? yaml.dump(spec, { indent: 2 })
    : JSON.stringify(spec, null, 2);

  return NextResponse.json({ specWithExamples });
}

function generateExampleFromSchema(schema: any): any {
  if (!schema || typeof schema !== 'object') return null;

  if (schema.example) return schema.example;

  switch (schema.type) {
    case 'string':
      if (schema.format === 'email') return 'user@example.com';
      if (schema.format === 'date') return '2024-01-01';
      if (schema.format === 'date-time') return '2024-01-01T00:00:00Z';
      if (schema.format === 'uri') return 'https://example.com';
      return 'string';
    
    case 'number':
    case 'integer':
      return schema.minimum || 0;
    
    case 'boolean':
      return true;
    
    case 'array':
      const itemExample = schema.items ? generateExampleFromSchema(schema.items) : {};
      return [itemExample];
    
    case 'object':
      if (!schema.properties) return {};
      const obj: Record<string, any> = {};
      for (const [key, value] of Object.entries(schema.properties)) {
        obj[key] = generateExampleFromSchema(value);
      }
      return obj;
    
    default:
      return null;
  }
}

function handleConvert(spec: OpenAPISpec, targetFormat: string) {
  let converted: string;

  if (targetFormat === "yaml") {
    converted = yaml.dump(spec, { indent: 2, lineWidth: -1 });
  } else {
    converted = JSON.stringify(spec, null, 2);
  }

  return NextResponse.json({ converted });
}
