import { NextRequest, NextResponse } from "next/server";

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  fills?: any[];
  strokes?: any[];
  strokeWeight?: number;
  cornerRadius?: number;
  characters?: string;
  style?: any;
  componentProperties?: any;
}

interface ComponentTemplate {
  name: string;
  framework: 'react' | 'vue';
  code: string;
  styles: string;
  tokens: Record<string, any>;
}

interface DesignToCodeRequest {
  figmaUrl?: string;
  figmaData?: any;
  framework: 'react' | 'vue';
  includeStyles: boolean;
  responsive: boolean;
  componentName?: string;
}

interface DesignToCodeResponse {
  success: boolean;
  components?: ComponentTemplate[];
  tokens?: Record<string, any>;
  error?: string;
}

// Extract design tokens from Figma nodes
function extractDesignTokens(nodes: FigmaNode[]): Record<string, any> {
  const tokens: Record<string, any> = {
    colors: {},
    spacing: {},
    typography: {},
    shadows: {},
    borders: {},
  };

  function processNode(node: FigmaNode) {
    // Extract colors
    if (node.fills) {
      node.fills.forEach((fill, index) => {
        if (fill.type === 'SOLID' && fill.color) {
          const { r, g, b, a = 1 } = fill.color;
          const hex = rgbToHex(r, g, b, a);
          tokens.colors[`${node.name.toLowerCase().replace(/\s+/g, '-')}-${index}`] = hex;
        }
      });
    }

    // Extract spacing
    if (node.absoluteBoundingBox) {
      const { width, height } = node.absoluteBoundingBox;
      tokens.spacing[`${node.name.toLowerCase().replace(/\s+/g, '-')}-width`] = `${width}px`;
      tokens.spacing[`${node.name.toLowerCase().replace(/\s+/g, '-')}-height`] = `${height}px`;
    }

    // Extract typography
    if (node.style && node.type === 'TEXT') {
      tokens.typography[node.name.toLowerCase().replace(/\s+/g, '-')] = {
        fontSize: node.style.fontSize,
        fontFamily: node.style.fontFamily,
        fontWeight: node.style.fontWeight,
        letterSpacing: node.style.letterSpacing,
        lineHeight: node.style.lineHeightPercent / 100,
      };
    }

    // Extract borders and shadows
    if (node.strokes) {
      node.strokes.forEach((stroke, index) => {
        if (stroke.type === 'SOLID' && stroke.color) {
          const { r, g, b, a = 1 } = stroke.color;
          const hex = rgbToHex(r, g, b, a);
          tokens.borders[`${node.name.toLowerCase().replace(/\s+/g, '-')}-border`] = {
            width: node.strokeWeight || 1,
            color: hex,
          };
        }
      });
    }

    if (node.children) {
      node.children.forEach(processNode);
    }
  }

  nodes.forEach(processNode);
  return tokens;
}

// Convert RGB to Hex
function rgbToHex(r: number, g: number, b: number, a: number = 1): string {
  const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  return a < 1 ? `${hex}${Math.round(a * 255).toString(16).padStart(2, '0')}` : hex;
}

// Generate React component
function generateReactComponent(node: FigmaNode, tokens: Record<string, any>, options: DesignToCodeRequest): ComponentTemplate {
  const componentName = options.componentName || node.name.replace(/[^a-zA-Z0-9]/g, '').replace(/^([0-9])/, '_$1') || 'GeneratedComponent';

  const styles = '';
  let jsxContent = '';

  function processNodeForJSX(node: FigmaNode, depth = 0): string {
    const indent = '  '.repeat(depth);
    let elementType = 'div';
    const props: Record<string, any> = {};
    const style: Record<string, any> = {};

    // Determine element type and props based on node type
    switch (node.type) {
      case 'FRAME':
      case 'GROUP':
        elementType = 'div';
        break;
      case 'RECTANGLE':
        elementType = 'div';
        if (node.cornerRadius) {
          style.borderRadius = `${node.cornerRadius}px`;
        }
        break;
      case 'TEXT':
        elementType = 'span';
        if (node.characters) {
          jsxContent = node.characters;
        }
        break;
      case 'ELLIPSE':
        elementType = 'div';
        style.borderRadius = '50%';
        break;
      case 'VECTOR':
      case 'STAR':
      case 'POLYGON':
        elementType = 'svg';
        break;
    }

    // Add styles
    if (node.absoluteBoundingBox) {
      style.width = `${node.absoluteBoundingBox.width}px`;
      style.height = `${node.absoluteBoundingBox.height}px`;
    }

    if (node.fills && node.fills.length > 0) {
      const fill = node.fills[0];
      if (fill.type === 'SOLID' && fill.color) {
        style.backgroundColor = rgbToHex(fill.color.r, fill.color.g, fill.color.b, fill.color.a);
      }
    }

    if (node.strokes && node.strokes.length > 0) {
      const stroke = node.strokes[0];
      if (stroke.type === 'SOLID' && stroke.color) {
        style.border = `${node.strokeWeight || 1}px solid ${rgbToHex(stroke.color.r, stroke.color.g, stroke.color.b, stroke.color.a)}`;
      }
    }

    // Convert style object to CSS string
    const styleString = Object.entries(style)
      .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`)
      .join(';');

    if (styleString) {
      props.style = `{${Object.entries(style).map(([k, v]) => `${k}: "${v}"`).join(', ')}}`;
    }

    // Generate JSX
    let jsx = `${indent}<${elementType}`;
    if (Object.keys(props).length > 0) {
      jsx += ' ' + Object.entries(props).map(([k, v]) => `${k}={${v}}`).join(' ');
    }

    if (node.children && node.children.length > 0) {
      jsx += '>\n';
      jsx += node.children.map(child => processNodeForJSX(child, depth + 1)).join('\n');
      jsx += `\n${indent}</${elementType}>`;
    } else {
      jsx += `>${jsxContent || ''}</${elementType}>`;
    }

    return jsx;
  }

  const jsx = processNodeForJSX(node);

  const code = `import React from 'react';

interface ${componentName}Props {
  className?: string;
}

export default function ${componentName}({ className }: ${componentName}Props) {
  return (
${jsx}
  );
}`;

  return {
    name: componentName,
    framework: 'react',
    code,
    styles,
    tokens,
  };
}

// Generate Vue component
function generateVueComponent(node: FigmaNode, tokens: Record<string, any>, options: DesignToCodeRequest): ComponentTemplate {
  const componentName = options.componentName || node.name.replace(/[^a-zA-Z0-9]/g, '').replace(/^([0-9])/, '_$1') || 'GeneratedComponent';

  const styles = '';
  let templateContent = '';

  function processNodeForVue(node: FigmaNode, depth = 0): string {
    const indent = '  '.repeat(depth);
    let elementType = 'div';
    const style: Record<string, any> = {};

    switch (node.type) {
      case 'FRAME':
      case 'GROUP':
        elementType = 'div';
        break;
      case 'RECTANGLE':
        elementType = 'div';
        if (node.cornerRadius) {
          style.borderRadius = `${node.cornerRadius}px`;
        }
        break;
      case 'TEXT':
        elementType = 'span';
        if (node.characters) {
          templateContent = node.characters;
        }
        break;
      case 'ELLIPSE':
        elementType = 'div';
        style.borderRadius = '50%';
        break;
    }

    if (node.absoluteBoundingBox) {
      style.width = `${node.absoluteBoundingBox.width}px`;
      style.height = `${node.absoluteBoundingBox.height}px`;
    }

    if (node.fills && node.fills.length > 0) {
      const fill = node.fills[0];
      if (fill.type === 'SOLID' && fill.color) {
        style.backgroundColor = rgbToHex(fill.color.r, fill.color.g, fill.color.b, fill.color.a);
      }
    }

    const styleString = Object.entries(style)
      .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`)
      .join(';');

    let vueElement = `${indent}<${elementType}`;
    if (styleString) {
      vueElement += ` :style="{ ${Object.entries(style).map(([k, v]) => `${k}: '${v}'`).join(', ')} }"`;
    }

    if (node.children && node.children.length > 0) {
      vueElement += '>\n';
      vueElement += node.children.map(child => processNodeForVue(child, depth + 1)).join('\n');
      vueElement += `\n${indent}</${elementType}>`;
    } else {
      vueElement += `>${templateContent || ''}</${elementType}>`;
    }

    return vueElement;
  }

  const template = processNodeForVue(node);

  const code = `<template>
${template}
</template>

<script setup lang="ts">
interface Props {
  className?: string;
}

defineProps<Props>();
</script>

<style scoped>
/* Component styles */
</style>`;

  return {
    name: componentName,
    framework: 'vue',
    code,
    styles,
    tokens,
  };
}

// Extract Figma file ID from URL
function extractFigmaFileId(url: string): string | null {
  const match = url.match(/figma\.com\/(file|design)\/([a-zA-Z0-9]+)/);
  return match ? match[2] : null;
}

// Fetch Figma file data (mock implementation - would need real Figma API)
async function fetchFigmaData(fileId: string, nodeId?: string): Promise<any> {
  // This would normally call the Figma API
  // For now, return mock data structure
  return {
    document: {
      id: fileId,
      name: "Mock Figma File",
      type: "DOCUMENT",
      children: [
        {
          id: "frame1",
          name: "Button Component",
          type: "FRAME",
          absoluteBoundingBox: { x: 0, y: 0, width: 120, height: 40 },
          fills: [{ type: "SOLID", color: { r: 0.2, g: 0.6, b: 1, a: 1 } }],
          cornerRadius: 8,
          children: [
            {
              id: "text1",
              name: "Button Text",
              type: "TEXT",
              absoluteBoundingBox: { x: 20, y: 10, width: 80, height: 20 },
              characters: "Click me",
              style: {
                fontSize: 16,
                fontFamily: "Inter",
                fontWeight: 500,
              },
            },
          ],
        },
      ],
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: DesignToCodeRequest = await request.json();
    const { figmaUrl, figmaData, framework, includeStyles, responsive, componentName } = body;

    let nodes: FigmaNode[] = [];

    if (figmaData) {
      // Use provided Figma data
      nodes = figmaData.document?.children || [];
    } else if (figmaUrl) {
      // Fetch from Figma URL
      const fileId = extractFigmaFileId(figmaUrl);
      if (!fileId) {
        return NextResponse.json(
          { error: "Invalid Figma URL" },
          { status: 400 }
        );
      }

      const data = await fetchFigmaData(fileId);
      nodes = data.document?.children || [];
    } else {
      return NextResponse.json(
        { error: "Either figmaUrl or figmaData must be provided" },
        { status: 400 }
      );
    }

    if (nodes.length === 0) {
      return NextResponse.json(
        { error: "No components found in Figma data" },
        { status: 400 }
      );
    }

    // Extract design tokens
    const tokens = extractDesignTokens(nodes);

    // Generate components
    const components: ComponentTemplate[] = [];

    for (const node of nodes) {
      if (framework === 'react') {
        components.push(generateReactComponent(node, tokens, body));
      } else if (framework === 'vue') {
        components.push(generateVueComponent(node, tokens, body));
      }
    }

    return NextResponse.json({
      success: true,
      components,
      tokens,
    });

  } catch (error: any) {
    console.error("Design-to-Code Exporter error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
