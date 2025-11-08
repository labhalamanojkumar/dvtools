import { NextRequest, NextResponse } from 'next/server';

// Dynamic import for papaparse
let Papa: any = null;

try {
  Papa = require('papaparse');
} catch (e) {
  console.warn('papaparse not available');
}

export async function POST(request: NextRequest) {
  try {
    const { action, data, options } = await request.json();

    if (!Papa) {
      return NextResponse.json(
        { error: 'papaparse library not available. Please install papaparse' },
        { status: 500 }
      );
    }

    if (!action) {
      return NextResponse.json(
        { error: 'Missing action parameter' },
        { status: 400 }
      );
    }

    let result: any;

    switch (action) {
      case 'parse':
        if (!data) {
          return NextResponse.json(
            { error: 'Missing data for parsing' },
            { status: 400 }
          );
        }

        const parseConfig = {
          delimiter: options?.delimiter || ',',
          header: options?.hasHeaders !== false,
          quoteChar: options?.quoteChar || '"',
          escapeChar: options?.escapeChar || '"',
          skipEmptyLines: options?.skipEmptyLines !== false,
          dynamicTyping: true,
          complete: (results: any) => {
            result = {
              data: results.data,
              errors: results.errors,
              meta: results.meta,
              rows: results.data.length,
              columns: options?.hasHeaders ? Object.keys(results.data[0] || {}).length : (results.data[0]?.length || 0),
            };
          },
          error: (error: any) => {
            throw new Error(`Parse error: ${error.message}`);
          }
        };

        Papa.parse(data, parseConfig);
        break;

      case 'unparse':
        if (!data) {
          return NextResponse.json(
            { error: 'Missing data for unparsing' },
            { status: 400 }
          );
        }

        const unparseConfig = {
          delimiter: options?.delimiter || ',',
          header: options?.hasHeaders !== false,
          quoteChar: options?.quoteChar || '"',
          escapeChar: options?.escapeChar || '"',
        };

        result = Papa.unparse(data, unparseConfig);
        break;

      case 'validate':
        if (!data) {
          return NextResponse.json(
            { error: 'Missing data for validation' },
            { status: 400 }
          );
        }

        const validationErrors: Array<{ row: number; column: string; message: string }> = [];
        const dataTypes: Record<string, Set<string>> = {};
        const validateHasHeaders = options?.hasHeaders !== false;

        data.forEach((row: any, rowIndex: number) => {
          if (validateHasHeaders) {
            Object.entries(row).forEach(([column, value]) => {
              // Type detection
              if (!dataTypes[column]) dataTypes[column] = new Set();
              const type = detectType(value);
              dataTypes[column].add(type);

              // Basic validation rules
              if (value === null || value === undefined || value === "") {
                validationErrors.push({
                  row: rowIndex + 1,
                  column,
                  message: "Empty value"
                });
              }
            });
          } else {
            (row as any[]).forEach((value, colIndex) => {
              const column = `Column ${colIndex + 1}`;
              if (!dataTypes[column]) dataTypes[column] = new Set();
              const type = detectType(value);
              dataTypes[column].add(type);

              if (value === null || value === undefined || value === "") {
                validationErrors.push({
                  row: rowIndex + 1,
                  column,
                  message: "Empty value"
                });
              }
            });
          }
        });

        result = {
          isValid: validationErrors.length === 0,
          errors: validationErrors,
          dataTypes,
          totalRows: data.length,
          totalColumns: validateHasHeaders ? Object.keys(data[0] || {}).length : (data[0]?.length || 0),
        };
        break;

      case 'transform':
        if (!data) {
          return NextResponse.json(
            { error: 'Missing data for transformation' },
            { status: 400 }
          );
        }

        let transformedData = [...data];
        const transformHasHeaders = options?.hasHeaders !== false;

        // Apply column selection
        if (options?.selectedColumns?.length > 0 && transformHasHeaders) {
          transformedData = transformedData.map((row: any) => {
            const newRow: any = {};
            options.selectedColumns.forEach((col: string) => {
              newRow[col] = row[col];
            });
            return newRow;
          });
        }

        // Apply filtering
        if (options?.filterQuery?.trim()) {
          transformedData = transformedData.filter((row: any) => {
            if (transformHasHeaders) {
              return Object.values(row).some((value: any) =>
                String(value).toLowerCase().includes(options.filterQuery.toLowerCase())
              );
            } else {
              return (row as any[]).some((value: any) =>
                String(value).toLowerCase().includes(options.filterQuery.toLowerCase())
              );
            }
          });
        }

        // Apply sorting
        if (options?.sortColumn && transformHasHeaders) {
          transformedData.sort((a: any, b: any) => {
            const aVal = a[options.sortColumn];
            const bVal = b[options.sortColumn];

            let comparison = 0;
            if (aVal < bVal) comparison = -1;
            if (aVal > bVal) comparison = 1;

            return options.sortDirection === "desc" ? -comparison : comparison;
          });
        }

        result = {
          originalRows: data.length,
          transformedRows: transformedData.length,
          selectedColumns: options?.selectedColumns || null,
          appliedFilters: options?.filterQuery?.trim() ? [options.filterQuery] : [],
          sortColumn: options?.sortColumn || null,
          sortDirection: options?.sortDirection || 'asc',
          data: transformedData,
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "parse", "unparse", "validate", or "transform"' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      result,
      action
    });

  } catch (error) {
    console.error('CSV API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'CSV operation failed' },
      { status: 500 }
    );
  }
}

function detectType(value: any): string {
  if (value === null || value === undefined || value === "") return "empty";

  const str = String(value).trim();

  // Number check
  if (!isNaN(Number(str)) && !isNaN(parseFloat(str))) {
    return Number(str) % 1 === 0 ? "integer" : "float";
  }

  // Boolean check
  if (str.toLowerCase() === "true" || str.toLowerCase() === "false") {
    return "boolean";
  }

  // Date check (basic)
  if (!isNaN(Date.parse(str))) {
    return "date";
  }

  return "string";
}