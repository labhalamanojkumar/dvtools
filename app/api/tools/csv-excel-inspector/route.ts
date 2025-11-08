import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

interface DataRow {
  [key: string]: string | number | boolean | null;
}

interface ValidationError {
  row: number;
  column: string;
  value: any;
  error: string;
  severity: 'error' | 'warning';
}

interface TransformationRule {
  id: string;
  type: 'replace' | 'regex' | 'formula' | 'case' | 'trim' | 'split';
  column: string;
  config: any;
  enabled: boolean;
}

// Helper function to parse CSV
function parseCSV(content: string): { headers: string[], data: DataRow[] } {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length === 0) return { headers: [], data: [] };

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const data: DataRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    if (values.length === headers.length) {
      const row: DataRow = {};
      headers.forEach((header, index) => {
        const value = values[index];
        // Try to parse as number or boolean
        if (!isNaN(Number(value)) && value !== '') {
          row[header] = Number(value);
        } else if (value.toLowerCase() === 'true') {
          row[header] = true;
        } else if (value.toLowerCase() === 'false') {
          row[header] = false;
        } else {
          row[header] = value || null;
        }
      });
      data.push(row);
    }
  }

  return { headers, data };
}

// Helper function to validate data
function validateData(data: DataRow[], headers: string[]): ValidationError[] {
  const errors: ValidationError[] = [];

  data.forEach((row, rowIndex) => {
    headers.forEach(header => {
      const value = row[header];

      // Check for empty required fields (assuming first column is required)
      if (header === headers[0] && (value === null || value === '')) {
        errors.push({
          row: rowIndex + 1,
          column: header,
          value,
          error: 'Required field is empty',
          severity: 'error'
        });
      }

      // Check for data type consistency
      if (typeof value === 'number' && isNaN(value)) {
        errors.push({
          row: rowIndex + 1,
          column: header,
          value,
          error: 'Invalid number format',
          severity: 'error'
        });
      }

      // Check for unusually long strings (potential data issues)
      if (typeof value === 'string' && value.length > 1000) {
        errors.push({
          row: rowIndex + 1,
          column: header,
          value: value.substring(0, 50) + '...',
          error: 'Unusually long text value',
          severity: 'warning'
        });
      }
    });
  });

  return errors;
}

// Helper function to apply transformations
function applyTransformations(data: DataRow[], transformations: TransformationRule[]): DataRow[] {
  let transformedData = [...data];

  transformations.forEach(rule => {
    if (!rule.enabled) return;

    transformedData = transformedData.map(row => {
      const newRow = { ...row };
      const value = row[rule.column];

      if (value === null || value === undefined) return newRow;

      switch (rule.type) {
        case 'replace':
          if (rule.config.find && typeof value === 'string') {
            newRow[rule.column] = value.replace(new RegExp(rule.config.find, 'g'), rule.config.replace || '');
          }
          break;

        case 'regex':
          if (rule.config.pattern && typeof value === 'string') {
            try {
              const regex = new RegExp(rule.config.pattern, 'g');
              newRow[rule.column] = value.replace(regex, rule.config.replacement || '');
            } catch (error) {
              // Invalid regex, skip transformation
            }
          }
          break;

        case 'case':
          if (typeof value === 'string') {
            if (rule.config.toUpper) {
              newRow[rule.column] = value.toUpperCase();
            } else if (rule.config.toLower) {
              newRow[rule.column] = value.toLowerCase();
            } else if (rule.config.capitalize) {
              newRow[rule.column] = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
            }
          }
          break;

        case 'trim':
          if (typeof value === 'string') {
            newRow[rule.column] = value.trim();
          }
          break;

        case 'split':
          if (typeof value === 'string' && rule.config.delimiter) {
            const parts = value.split(rule.config.delimiter);
            if (rule.config.keepIndex !== undefined && parts[rule.config.keepIndex]) {
              newRow[rule.column] = parts[rule.config.keepIndex].trim();
            }
          }
          break;
      }

      return newRow;
    });
  });

  return transformedData;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file type
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only CSV and Excel files are supported.' },
        { status: 400 }
      );
    }

    // Check file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 50MB.' },
        { status: 400 }
      );
    }

    // Read file content
    const buffer = await file.arrayBuffer();
    const content = new TextDecoder('utf-8').decode(buffer);

    // Parse data
    const { headers, data } = parseCSV(content);

    if (headers.length === 0) {
      return NextResponse.json(
        { error: 'No data found in file' },
        { status: 400 }
      );
    }

    // Validate data
    const errors = validateData(data, headers);

    return NextResponse.json({
      headers,
      data,
      errors,
      rowCount: data.length,
      columnCount: headers.length,
      fileName: file.name,
      fileSize: file.size
    });

  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    );
  }
}

// Handle transformation requests
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, transformations } = body;

    if (!Array.isArray(data) || !Array.isArray(transformations)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Apply transformations
    const transformedData = applyTransformations(data, transformations);

    // Re-validate after transformation
    const headers = Object.keys(data[0] || {});
    const errors = validateData(transformedData, headers);

    return NextResponse.json({
      data: transformedData,
      errors,
      transformationsApplied: transformations.length
    });

  } catch (error) {
    console.error('Error applying transformations:', error);
    return NextResponse.json(
      { error: 'Failed to apply transformations' },
      { status: 500 }
    );
  }
}
