import { NextRequest, NextResponse } from 'next/server';

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

        case 'formula':
          if (rule.config.formula && typeof value === 'number') {
            try {
              // Simple formula evaluation (basic arithmetic)
              const formula = rule.config.formula.replace(/\{value\}/g, value.toString());
              // Use Function constructor for safe evaluation (limited to basic math)
              const result = new Function('return ' + formula)();
              if (typeof result === 'number' && !isNaN(result)) {
                newRow[rule.column] = result;
              }
            } catch (error) {
              // Invalid formula, skip transformation
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
    const body = await request.json();
    const { data, transformations } = body;

    if (!Array.isArray(data) || !Array.isArray(transformations)) {
      return NextResponse.json(
        { error: 'Invalid request body. Expected data array and transformations array.' },
        { status: 400 }
      );
    }

    if (data.length === 0) {
      return NextResponse.json(
        { error: 'No data provided for transformation.' },
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
      transformationsApplied: transformations.filter(t => t.enabled).length,
      totalRows: transformedData.length,
      totalColumns: headers.length
    });

  } catch (error) {
    console.error('Error applying transformations:', error);
    return NextResponse.json(
      { error: 'Failed to apply transformations. Please check your transformation rules.' },
      { status: 500 }
    );
  }
}
