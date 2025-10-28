import { NextRequest, NextResponse } from "next/server";

interface DocSection {
  id: string;
  title: string;
  slug: string;
  content: string;
  order: number;
  category: string;
  lastUpdated: string;
}

interface DocCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  sections: DocSection[];
}

const documentation: DocCategory[] = [
  {
    id: "getting-started",
    name: "Getting Started",
    description: "Learn the basics and get up and running quickly",
    icon: "🚀",
    sections: [
      {
        id: "introduction",
        title: "Introduction",
        slug: "introduction",
        content: `# Welcome to DevTools Hub

DevTools Hub is a comprehensive suite of developer tools designed to streamline your development workflow. Whether you're working with JSON, JWT tokens, regular expressions, or need to encode/decode data, we have you covered.

## What is DevTools Hub?

DevTools Hub provides:
- **JSON Formatter & Validator**: Format, validate, and beautify JSON data
- **Base64 Encoder/Decoder**: Convert data to/from Base64 format
- **JWT Decoder**: Decode and inspect JWT tokens
- **Regular Expression Tester**: Test and debug regex patterns
- **Code Beautifier**: Format HTML, CSS, and JavaScript
- **URL Encoder/Decoder**: Handle URL encoding and decoding

## Key Features

### Privacy First
All processing happens in your browser. Your data never leaves your device.

### Fast & Reliable
Lightning-fast processing with no server delays or rate limits (for basic usage).

### Developer Friendly
Clean, intuitive interfaces designed specifically for developers.

### Open Source
Transparent, community-driven development with regular updates.

## Quick Start

1. **Choose a Tool**: Select the tool you need from the navigation menu
2. **Input Your Data**: Paste or type your data into the input field
3. **Get Results**: See formatted, validated, or processed output instantly
4. **Copy or Download**: Use the results in your applications

## Browser Support

DevTools Hub works in all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Need Help?

- Check our [FAQ](/docs/faq) for common questions
- Browse our [API documentation](/docs/api) for integration details
- Contact [support](/contact) for technical assistance`,
        order: 1,
        category: "getting-started",
        lastUpdated: "2024-01-15T10:00:00Z",
      },
      {
        id: "quick-start",
        title: "Quick Start Guide",
        slug: "quick-start",
        content: `# Quick Start Guide

Get up and running with DevTools Hub in minutes.

## First Steps

### 1. Access the Tools
Navigate to the [Tools page](/tools) to see all available tools.

### 2. Choose Your Tool
Select the tool that matches your needs:
- JSON tools for data formatting
- Encoding tools for data conversion
- Testing tools for validation

### 3. Input Your Data
Paste your data into the input field or type it directly.

### 4. Process and Use Results
Click process/format/encode and use the results in your code.

## Tool-Specific Quick Starts

### JSON Formatter
\`\`\`json
{"name":"John","age":30,"city":"New York"}
\`\`\`

Paste JSON → Click "Format" → Get beautified output.

### Base64 Encoder
Type or paste text → Click "Encode" → Get Base64 string.

### JWT Decoder
Paste JWT token → Click "Decode" → See header, payload, and signature.

## Tips for Best Results

- Use the "Auto-detect" feature when available
- Check "Pretty Print" for readable output
- Use "Validate" to ensure data integrity
- Copy results with one click

## Next Steps

- Explore [advanced features](/docs/advanced-features)
- Learn about [API integration](/docs/api)
- Check out [examples and use cases](/docs/examples)`,
        order: 2,
        category: "getting-started",
        lastUpdated: "2024-01-14T15:30:00Z",
      },
    ],
  },
  {
    id: "tools",
    name: "Tools Documentation",
    description: "Detailed guides for each tool and feature",
    icon: "🛠️",
    sections: [
      {
        id: "json-tools",
        title: "JSON Tools",
        slug: "json-tools",
        content: `# JSON Tools Documentation

Comprehensive guide to our JSON formatting and validation tools.

## JSON Formatter

### Features
- Syntax highlighting
- Error detection and reporting
- Pretty printing with customizable indentation
- Minification for production use
- Tree view for complex structures

### Usage
\`\`\`javascript
// Input
{"name":"John","items":[{"id":1,"name":"Item 1"},{"id":2,"name":"Item 2"}]}

// Formatted Output
{
  "name": "John",
  "items": [
    {
      "id": 1,
      "name": "Item 1"
    },
    {
      "id": 2,
      "name": "Item 2"
    }
  ]
}
\`\`\`

### Options
- **Indentation**: 2 spaces, 4 spaces, or tabs
- **Compact**: Remove unnecessary whitespace
- **Sort Keys**: Alphabetically sort object keys
- **Validate**: Check JSON syntax and structure

## JSON Validator

### Validation Rules
- Proper JSON syntax
- Data type validation
- Required field checking
- Custom schema validation

### Error Messages
Clear, actionable error messages help you fix issues quickly.

## Best Practices

1. Always validate JSON before processing
2. Use consistent indentation in your projects
3. Consider minification for production APIs
4. Use schema validation for critical data`,
        order: 1,
        category: "tools",
        lastUpdated: "2024-01-13T12:00:00Z",
      },
      {
        id: "encoding-tools",
        title: "Encoding Tools",
        slug: "encoding-tools",
        content: `# Encoding Tools Documentation

Learn how to use our encoding and decoding tools effectively.

## Base64 Tools

### Base64 Encoder
Convert text and binary data to Base64 format.

**Features:**
- Text to Base64 conversion
- File to Base64 conversion
- MIME type detection
- URL-safe encoding option

### Base64 Decoder
Convert Base64 strings back to original format.

**Features:**
- Base64 to text conversion
- Base64 to file download
- Automatic format detection
- Error handling for invalid input

### Usage Examples

\`\`\`javascript
// Encoding
const original = "Hello, World!";
const encoded = "SGVsbG8sIFdvcmxkIQ==";

// Decoding
const decoded = "Hello, World!";
\`\`\`

## URL Encoding Tools

### URL Encoder
Encode URLs and query parameters safely.

### URL Decoder
Decode URL-encoded strings.

## Character Encoding

Support for multiple character encodings:
- UTF-8 (default)
- UTF-16
- ASCII
- ISO-8859-1

## Security Considerations

- Always validate input before encoding/decoding
- Be aware of encoding attacks
- Use appropriate encoding for your use case`,
        order: 2,
        category: "tools",
        lastUpdated: "2024-01-12T14:20:00Z",
      },
    ],
  },
  {
    id: "api",
    name: "API Documentation",
    description: "Integrate DevTools Hub into your applications",
    icon: "🔌",
    sections: [
      {
        id: "api-overview",
        title: "API Overview",
        slug: "api-overview",
        content: `# API Documentation

Integrate DevTools Hub functionality into your applications.

## Authentication

### API Keys
Get your API key from the [dashboard](/admin).

### Headers
\`\`\`
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
\`\`\`

## Rate Limits

- Free tier: 100 requests/hour
- Pro tier: 10,000 requests/hour
- Enterprise: Unlimited

## Endpoints

### JSON Tools
\`\`\`
POST /api/json/format
POST /api/json/validate
POST /api/json/minify
\`\`\`

### Encoding Tools
\`\`\`
POST /api/encode/base64
POST /api/decode/base64
POST /api/encode/url
POST /api/decode/url
\`\`\`

### JWT Tools
\`\`\`
POST /api/jwt/decode
POST /api/jwt/verify
\`\`\`

## Error Handling

All errors return appropriate HTTP status codes with detailed messages.

## SDKs and Libraries

We provide official SDKs for:
- JavaScript/TypeScript
- Python
- Java
- C#
- Go

## Webhooks

Set up webhooks for real-time notifications and integrations.`,
        order: 1,
        category: "api",
        lastUpdated: "2024-01-11T16:45:00Z",
      },
    ],
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    if (category) {
      const categoryData = documentation.find((cat) => cat.id === category);
      if (!categoryData) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(categoryData);
    }

    return NextResponse.json(documentation);
  } catch (error) {
    console.error("Error fetching documentation:", error);
    return NextResponse.json(
      { error: "Failed to fetch documentation" },
      { status: 500 },
    );
  }
}
