import { NextRequest, NextResponse } from "next/server";

interface FieldDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'uuid' | 'json';
  options?: {
    min?: number;
    max?: number;
    length?: number;
    pattern?: string;
    enum?: string[];
  };
}

interface MockDataRequest {
  fields: FieldDefinition[];
  count: number;
  format: 'json' | 'csv' | 'sql' | 'xml';
  tableName?: string;
}

interface MockDataResponse {
  success: boolean;
  data?: any[];
  csv?: string;
  sql?: string;
  xml?: string;
  error?: string;
}

// Mock data generators
function generateString(options?: { length?: number; pattern?: string; enum?: string[] }): string {
  if (options?.enum && options.enum.length > 0) {
    return options.enum[Math.floor(Math.random() * options.enum.length)];
  }

  const length = options?.length || 10;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

function generateNumber(options?: { min?: number; max?: number }): number {
  const min = options?.min || 0;
  const max = options?.max || 100;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateBoolean(): boolean {
  return Math.random() > 0.5;
}

function generateDate(): string {
  const start = new Date(2020, 0, 1);
  const end = new Date();
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toISOString().split('T')[0];
}

function generateEmail(): string {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'example.com'];
  const name = generateString({ length: 8 });
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${name}@${domain}`;
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function generateJSON(): object {
  return {
    key1: generateString({ length: 5 }),
    key2: generateNumber(),
    key3: generateBoolean()
  };
}

function generateFieldValue(field: FieldDefinition): any {
  switch (field.type) {
    case 'string':
      return generateString(field.options);
    case 'number':
      return generateNumber(field.options);
    case 'boolean':
      return generateBoolean();
    case 'date':
      return generateDate();
    case 'email':
      return generateEmail();
    case 'uuid':
      return generateUUID();
    case 'json':
      return generateJSON();
    default:
      return generateString();
  }
}

function generateMockData(fields: FieldDefinition[], count: number): any[] {
  const data: any[] = [];

  for (let i = 0; i < count; i++) {
    const row: any = {};
    fields.forEach(field => {
      row[field.name] = generateFieldValue(field);
    });
    data.push(row);
  }

  return data;
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ];

  return csvRows.join('\n');
}

function convertToSQL(data: any[], tableName: string = 'mock_data'): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const insertStatements = data.map(row => {
    const values = headers.map(header => {
      const value = row[header];
      if (typeof value === 'string') {
        return `'${value.replace(/'/g, "''")}'`;
      } else if (typeof value === 'boolean') {
        return value ? '1' : '0';
      } else if (value === null || value === undefined) {
        return 'NULL';
      } else {
        return value;
      }
    }).join(', ');
    return `INSERT INTO ${tableName} (${headers.join(', ')}) VALUES (${values});`;
  });

  return insertStatements.join('\n');
}

function convertToXML(data: any[], rootName: string = 'data'): string {
  if (data.length === 0) return `<${rootName}></${rootName}>`;

  const headers = Object.keys(data[0]);
  const xmlItems = data.map(row => {
    const properties = headers.map(header => {
      const value = row[header];
      const safeValue = typeof value === 'string' ? value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : value;
      return `  <${header}>${safeValue}</${header}>`;
    }).join('\n');
    return `  <item>\n${properties}\n  </item>`;
  }).join('\n');

  return `<${rootName}>\n${xmlItems}\n</${rootName}>`;
}

export async function POST(request: NextRequest) {
  try {
    const body: MockDataRequest = await request.json();
    const { fields, count, format, tableName } = body;

    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Fields array is required and must not be empty"
      }, { status: 400 });
    }

    if (!count || count < 1 || count > 1000) {
      return NextResponse.json({
        success: false,
        error: "Count must be between 1 and 1000"
      }, { status: 400 });
    }

    // Validate field definitions
    for (const field of fields) {
      if (!field.name || !field.type) {
        return NextResponse.json({
          success: false,
          error: "Each field must have a name and type"
        }, { status: 400 });
      }

      if (!['string', 'number', 'boolean', 'date', 'email', 'uuid', 'json'].includes(field.type)) {
        return NextResponse.json({
          success: false,
          error: `Invalid field type: ${field.type}`
        }, { status: 400 });
      }
    }

    // Generate mock data
    const data = generateMockData(fields, count);

    const response: MockDataResponse = {
      success: true,
      data
    };

    // Convert to requested format
    switch (format) {
      case 'csv':
        response.csv = convertToCSV(data);
        break;
      case 'sql':
        response.sql = convertToSQL(data, tableName);
        break;
      case 'xml':
        response.xml = convertToXML(data);
        break;
      case 'json':
      default:
        // data is already in JSON format
        break;
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error("Mock data generation error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Mock Data Generator API",
    endpoints: {
      POST: "/api/tools/mock-data-generator",
      description: "Generate mock data based on field definitions"
    },
    supportedTypes: ['string', 'number', 'boolean', 'date', 'email', 'uuid', 'json'],
    supportedFormats: ['json', 'csv', 'sql', 'xml']
  });
}
