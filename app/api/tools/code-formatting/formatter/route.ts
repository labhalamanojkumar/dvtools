import { NextRequest, NextResponse } from "next/server";

interface FormatRequest {
  content: string;
  formatter: string;
  config?: any;
}

export async function POST(request: NextRequest) {
  try {
    const body: FormatRequest = await request.json();
    const { content, formatter, config } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    let formattedCode = content;

    switch (formatter) {
      case "prettier":
        formattedCode = await formatWithPrettier(content, config);
        break;

      case "black":
        formattedCode = await formatWithBlack(content, config);
        break;

      default:
        return NextResponse.json(
          { error: "Unsupported formatter" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      result: {
        output: formattedCode
      }
    });

  } catch (error: any) {
    console.error("Formatter error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

async function formatWithPrettier(code: string, config?: any): Promise<string> {
  // Enhanced Prettier-like formatting based on config
  let formatted = code;

  // Apply configuration options
  if (config) {
    // Handle semicolons
    if (config.semi === false) {
      formatted = formatted.replace(/;(?=\s*}|\s*$)/gm, '');
    }

    // Handle quotes
    if (config.singleQuote) {
      formatted = formatted.replace(/"/g, "'");
    } else {
      formatted = formatted.replace(/'/g, '"');
    }

    // Handle indentation
    const indentChar = config.useTabs ? '\t' : ' '.repeat(config.tabWidth || 2);
    const spaceIndent = ' '.repeat(config.tabWidth || 2);

    // Convert existing indentation
    formatted = formatted.replace(/^ +/gm, (match) => {
      const spaces = match.length;
      const tabs = Math.floor(spaces / (config.tabWidth || 2));
      const remainingSpaces = spaces % (config.tabWidth || 2);
      return (config.useTabs ? '\t'.repeat(tabs) : spaceIndent.repeat(tabs)) +
             (config.useTabs ? '' : ' '.repeat(remainingSpaces));
    });

    // Handle trailing commas
    if (config.trailingComma === 'none') {
      formatted = formatted.replace(/,(\s*[}\]])/g, '$1');
    }

    // Handle bracket spacing
    if (config.bracketSpacing === false) {
      formatted = formatted.replace(/{\s+/g, '{');
      formatted = formatted.replace(/\s+}/g, '}');
    }

    // Handle arrow parens
    if (config.arrowParens === 'avoid') {
      formatted = formatted.replace(/\(\s*([^,)]+)\s*\)\s*=>/g, '$1 =>');
    }
  }

  // Basic structural formatting
  formatted = formatted
    .replace(/;\s*/g, ';\n')  // Add newlines after semicolons
    .replace(/{\s*/g, '{\n' + (config?.useTabs ? '\t' : ' '.repeat(config?.tabWidth || 2)))  // Format opening braces
    .replace(/}\s*/g, '\n}')  // Format closing braces
    .replace(/,\s*/g, ',\n' + (config?.useTabs ? '\t' : ' '.repeat(config?.tabWidth || 2))); // Format commas

  // Clean up excessive newlines
  formatted = formatted.replace(/\n{3,}/g, '\n\n');

  return formatted;
}

async function formatWithBlack(code: string, config?: any): Promise<string> {
  // Enhanced Black-like formatting for Python
  let formatted = code;

  // Apply Python-specific formatting rules
  formatted = formatted
    .replace(/:\s*/g, ': ')  // Space after colons
    .replace(/,\s*/g, ', ')  // Space after commas
    .replace(/=\s*/g, ' = ')  // Space around equals
    .replace(/\s*==\s*/g, ' == ')  // Space around equality
    .replace(/\s*!=\s*/g, ' != ')  // Space around inequality
    .replace(/\s*<=\s*/g, ' <= ')  // Space around less than or equal
    .replace(/\s*>=\s*/g, ' >= ')  // Space around greater than or equal
    .replace(/\s*<\s*/g, ' < ')  // Space around less than
    .replace(/\s*>\s*/g, ' > '); // Space around greater than

  // Handle indentation (Black uses 4 spaces by default)
  const indentSize = 4;
  const indentChar = ' '.repeat(indentSize);

  // Fix indentation for function definitions, classes, etc.
  const lines = formatted.split('\n');
  let indentLevel = 0;
  const formattedLines = lines.map((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return ''; // Remove empty lines

    // Decrease indent for dedent keywords
    if (/^(return|break|continue|pass|raise)$/.test(trimmed) ||
        /^elif|^else|^except|^finally/.test(trimmed)) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    const indented = indentChar.repeat(indentLevel) + trimmed;

    // Increase indent after colon-ending lines (except for certain cases)
    if (trimmed.endsWith(':') &&
        !trimmed.startsWith('class ') &&
        !trimmed.startsWith('def ') &&
        !trimmed.includes('if ') &&
        !trimmed.includes('elif ') &&
        !trimmed.includes('else') &&
        !trimmed.includes('for ') &&
        !trimmed.includes('while ') &&
        !trimmed.includes('try') &&
        !trimmed.includes('except') &&
        !trimmed.includes('with ')) {
      indentLevel++;
    } else if (/(class|def|if|elif|else|for|while|try|except|with)\s+.*:/.test(trimmed)) {
      indentLevel++;
    }

    return indented;
  });

  formatted = formattedLines.join('\n');

  // Line length handling (Black default is 88)
  const maxLength = config?.printWidth || 88;
  const longLines = formatted.split('\n');
  const processedLines = longLines.map(line => {
    if (line.length > maxLength) {
      // Simple line breaking for function calls and other constructs
      return line
        .replace(/(\w+)\s*\(\s*([^)]+)\s*\)/g, (match, func, args) => {
          if (match.length > maxLength) {
            const argLines = args.split(',').map((arg: string) => '    ' + arg.trim());
            return func + '(\n' + argLines.join(',\n') + '\n)';
          }
          return match;
        });
    }
    return line;
  });

  return processedLines.join('\n');
}