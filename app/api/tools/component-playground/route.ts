import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case "process-component":
        return await processComponent(data);
      case "validate-component":
        return await validateComponent(data);
      case "generate-component":
        return await generateComponent(data);
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Component playground API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function processComponent(data: any) {
  try {
    const { fileContent, fileName } = data;

    // Process component file content
    let componentConfig;

    try {
      componentConfig = JSON.parse(fileContent);
    } catch (e) {
      // If not JSON, try to extract component information from code
      componentConfig = extractComponentFromCode(fileContent, fileName);
    }

    if (!componentConfig) {
      return NextResponse.json(
        { error: "Invalid component format" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      component: componentConfig,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process component" },
      { status: 500 }
    );
  }
}

async function validateComponent(data: any) {
  try {
    const { componentConfig } = data;

    const validation = {
      isValid: true,
      errors: [] as string[],
      warnings: [] as string[],
    };

    // Basic validation
    if (!componentConfig.name) {
      validation.errors.push("Component name is required");
      validation.isValid = false;
    }

    if (!componentConfig.props || typeof componentConfig.props !== "object") {
      validation.errors.push("Component props must be an object");
      validation.isValid = false;
    }

    // Check for required prop fields
    if (componentConfig.props) {
      Object.entries(componentConfig.props).forEach(([propName, propConfig]: [string, any]) => {
        if (!propConfig.type) {
          validation.errors.push(`Prop '${propName}' missing type`);
          validation.isValid = false;
        }
        if (propConfig.default === undefined) {
          validation.warnings.push(`Prop '${propName}' missing default value`);
        }
      });
    }

    return NextResponse.json({
      success: true,
      validation,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to validate component" },
      { status: 500 }
    );
  }
}

async function generateComponent(data: any) {
  try {
    const { componentConfig, framework = "react" } = data;

    let generatedCode = "";

    switch (framework.toLowerCase()) {
      case "react":
        generatedCode = generateReactComponent(componentConfig);
        break;
      case "vue":
        generatedCode = generateVueComponent(componentConfig);
        break;
      case "angular":
        generatedCode = generateAngularComponent(componentConfig);
        break;
      default:
        generatedCode = generateReactComponent(componentConfig);
    }

    return NextResponse.json({
      success: true,
      code: generatedCode,
      framework,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate component" },
      { status: 500 }
    );
  }
}

function extractComponentFromCode(content: string, fileName: string) {
  // Basic component extraction from code files
  // This is a simplified implementation - in a real app you'd use AST parsing

  const componentName = fileName.replace(/\.(js|ts|tsx|jsx)$/, "");

  // Look for prop definitions in comments or JSDoc
  const propsMatch = content.match(/@prop\s+{(\w+)}\s+(\w+)/g);
  const props: any = {};

  if (propsMatch) {
    propsMatch.forEach((match) => {
      const [, type, name] = match.match(/@prop\s+{(\w+)}\s+(\w+)/) || [];
      if (type && name) {
        props[name] = {
          type: type.toLowerCase(),
          default: getDefaultValue(type),
        };
      }
    });
  }

  return {
    name: componentName,
    props,
    render: (props: any) => `<${componentName} />`,
  };
}

function getDefaultValue(type: string) {
  switch (type) {
    case "string":
      return "";
    case "number":
      return 0;
    case "boolean":
      return false;
    default:
      return "";
  }
}

function generateReactComponent(config: any) {
  const { name, props } = config;

  const propInterface = Object.entries(props)
    .map(([key, config]: [string, any]) => `  ${key}${config.default !== undefined ? "?" : ""}: ${getTypeScriptType(config.type)};`)
    .join("\n");

  const defaultProps = Object.entries(props)
    .filter(([, config]: [string, any]) => config.default !== undefined)
    .map(([key, config]: [string, any]) => `  ${key}: ${JSON.stringify(config.default)},`)
    .join("\n");

  return `import React from 'react';

interface ${name}Props {
${propInterface}
}

const ${name}: React.FC<${name}Props> = ({
${Object.keys(props).join(",\n")}
}) => {
  return (
    <div className="${name.toLowerCase()}">
      {/* ${name} component implementation */}
    </div>
  );
};

${name}.defaultProps = {
${defaultProps}
};

export default ${name};
`;
}

function generateVueComponent(config: any) {
  const { name, props } = config;

  const propDefinitions = Object.entries(props)
    .map(([key, config]: [string, any]) => `    ${key}: {
      type: ${getVueType(config.type)},
      default: ${JSON.stringify(config.default || getDefaultValue(config.type))}
    },`)
    .join("\n");

  return `<template>
  <div class="${name.toLowerCase()}">
    <!-- ${name} component implementation -->
  </div>
</template>

<script>
export default {
  name: '${name}',
  props: {
${propDefinitions}
  }
};
</script>

<style scoped>
.${name.toLowerCase()} {
  /* Component styles */
}
</style>
`;
}

function generateAngularComponent(config: any) {
  const { name, props } = config;

  const inputProperties = Object.keys(props)
    .map(key => `  @Input() ${key}: ${getTypeScriptType((props[key] as any).type)} = ${JSON.stringify((props[key] as any).default || getDefaultValue((props[key] as any).type))};`)
    .join("\n");

  return `import { Component, Input } from '@angular/core';

@Component({
  selector: '${name.toLowerCase()}',
  template: \`
    <div class="${name.toLowerCase()}">
      <!-- ${name} component implementation -->
    </div>
  \`,
  styles: [\`
    .${name.toLowerCase()} {
      /* Component styles */
    }
  \`]
})
export class ${name}Component {
${inputProperties}
}
`;
}

function getTypeScriptType(type: string) {
  switch (type) {
    case "string":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "select":
      return "string";
    case "textarea":
      return "string";
    default:
      return "any";
  }
}

function getVueType(type: string) {
  switch (type) {
    case "string":
      return "String";
    case "number":
      return "Number";
    case "boolean":
      return "Boolean";
    case "select":
      return "String";
    case "textarea":
      return "String";
    default:
      return "String";
  }
}