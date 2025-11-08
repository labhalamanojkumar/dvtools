import { NextRequest, NextResponse } from 'next/server';

interface DataRow {
  [key: string]: string | number | boolean | null;
}

// Helper function to convert data to CSV
function convertToCSV(data: DataRow[], columns: string[]): string {
  if (data.length === 0) return '';

  // Create header row
  const headers = columns.join(',');
  
  // Create data rows
  const rows = data.map(row => 
    columns.map(col => {
      const value = row[col];
      if (value === null || value === undefined) return '';
      
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',')
  );

  return [headers, ...rows].join('\n');
}

// Helper function to convert data to JSON
function convertToJSON(data: DataRow[]): string {
  return JSON.stringify(data, null, 2);
}

// Helper function to create Excel-like XML (basic implementation)
function convertToExcelXML(data: DataRow[], columns: string[]): string {
  let xml = '<?xml version="1.0"?>\n';
  xml += '<?mso-application progid="Excel.Sheet"?>\n';
  xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet">\n';
  xml += '<Worksheet ss:Name="Sheet1">\n';
  xml += '<Table>\n';

  // Add header row
  xml += '<Row>\n';
  columns.forEach(col => {
    xml += `<Cell><Data ss:Type="String">${col}</Data></Cell>\n`;
  });
  xml += '</Row>\n';

  // Add data rows
  data.forEach(row => {
    xml += '<Row>\n';
    columns.forEach(col => {
      const value = row[col];
      let dataType = 'String';
      let cellValue = '';

      if (value === null || value === undefined) {
        cellValue = '';
      } else if (typeof value === 'number') {
        dataType = 'Number';
        cellValue = value.toString();
      } else if (typeof value === 'boolean') {
        dataType = 'Boolean';
        cellValue = value ? '1' : '0';
      } else {
        cellValue = String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }

      xml += `<Cell><Data ss:Type="${dataType}">${cellValue}</Data></Cell>\n`;
    });
    xml += '</Row>\n';
  });

  xml += '</Table>\n';
  xml += '</Worksheet>\n';
  xml += '</Workbook>\n';

  return xml;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, format, columns } = body;

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: 'Invalid request body. Expected data array.' },
        { status: 400 }
      );
    }

    if (data.length === 0) {
      return NextResponse.json(
        { error: 'No data provided for export.' },
        { status: 400 }
      );
    }

    // Determine columns to export
    const exportColumns = Array.isArray(columns) && columns.length > 0 
      ? columns 
      : Object.keys(data[0] || {});

    if (exportColumns.length === 0) {
      return NextResponse.json(
        { error: 'No columns available for export.' },
        { status: 400 }
      );
    }

    let content: string;
    let mimeType: string;
    let fileExtension: string;

    switch (format) {
      case 'csv':
        content = convertToCSV(data, exportColumns);
        mimeType = 'text/csv';
        fileExtension = 'csv';
        break;

      case 'xlsx':
        content = convertToExcelXML(data, exportColumns);
        mimeType = 'application/vnd.ms-excel';
        fileExtension = 'xls';
        break;

      case 'json':
        content = convertToJSON(data);
        mimeType = 'application/json';
        fileExtension = 'json';
        break;

      default:
        return NextResponse.json(
          { error: 'Unsupported export format. Supported formats: csv, xlsx, json.' },
          { status: 400 }
        );
    }

    // Create response with file download
    const response = new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="exported_data.${fileExtension}"`,
        'Content-Length': Buffer.byteLength(content, 'utf8').toString(),
      },
    });

    return response;

  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      { error: 'Failed to export data. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint for download statistics/metadata
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format');
    const columns = searchParams.get('columns')?.split(',') || [];

    // Return export metadata
    return NextResponse.json({
      supportedFormats: ['csv', 'xlsx', 'json'],
      maxRows: 100000, // Reasonable limit for web export
      maxColumns: 100,
      requestedFormat: format,
      requestedColumns: columns.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error getting export metadata:', error);
    return NextResponse.json(
      { error: 'Failed to get export metadata.' },
      { status: 500 }
    );
  }
}
