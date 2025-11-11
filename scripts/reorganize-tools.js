#!/usr/bin/env node

/**
 * DVtools - Tools Reorganization Script
 * 
 * This script reorganizes all tools into categorized folders
 * and creates necessary redirects for backward compatibility.
 */

const fs = require('fs');
const path = require('path');

// Category mapping - which tools go into which category
const CATEGORY_MAPPING = {
  'text-string': [
    'base64',
    'url-encoder',
    'character-encoding-converter',
    'lorem-ipsum-generator',
    'compression-tools',
    'code-beautifier',
    'formatter-profiles',
    'css-linter-optimizer',
    'linter-runner',
  ],
  'developer': [
    'json-formatter',
    'jwt-decoder',
    'regexp-tester',
    'code-formatting-tools',
    'graphql-playground',
    'openapi-editor',
    'mock-data-generator',
    'mock-server',
    'api-simulator',
    'database-query-runner',
    'snippet-library',
    'dev-tunneler',
    'component-playground',
    'simple-ml-playground',
  ],
  'security': [
    'secrets-vault-interface',
    'secrets-rotation-scheduler',
    'static-secret-scanner',
    'penetration-test-checklist',
    'csp-security-headers-tester',
    'mfa-session-controls',
    'role-based-access-controls',
    'privacy-compliance-helper',
  ],
  'image-media': [
    'image-optimizer-converter',
    'image-editor',
    'icon-library',
    'design-to-code-exporter',
    'theme-builder',
    'color-palette-studio',
  ],
  'network-web': [
    'webhook-tester',
    'api-key-manager',
    'rate-limiter-dashboard',
    'responsive-design-tester',
    'accessibility-scanner',
    'performance-profiler',
  ],
  'data-conversion': [
    'csv-excel-inspector',
    'csv-tsv-encoder-decoder',
    'serialization-converters',
    'binary-viewer',
    'data-connector-hub',
  ],
  'productivity': [
    'onboarding-checklist-generator',
    'enhanced-onboarding-checklist-generator',
    'knowledge-base-editor',
    'issue-triage-board',
    'log-viewer',
    'usage-analytics',
  ],
  'devops': [
    'kubernetes-dashboard',
    'container-image-scanner',
    'infrastructure-blueprinter',
    'cicd-pipeline-editor',
    'migration-manager',
    'dependency-updater',
    'dependency-vulnerability-scanner',
    'cost-estimator',
    'static-site-exporter',
  ],
  'testing': [
    'ab-test-manager',
    'contract-testing',
    'user-impersonation-console',
    'background-job-debugger',
  ],
  'admin': [
    'ad-system-test',
    'prototype-linker',
  ],
};

// Category metadata
const CATEGORY_INFO = {
  'text-string': {
    name: 'Text & String Tools',
    description: 'Tools for text manipulation, encoding, and formatting',
    icon: '📝',
  },
  'developer': {
    name: 'Developer Tools',
    description: 'Essential tools for developers including formatters, testers, and generators',
    icon: '💻',
  },
  'security': {
    name: 'Security & Encryption',
    description: 'Security testing, secrets management, and encryption tools',
    icon: '🔒',
  },
  'image-media': {
    name: 'Image & Media',
    description: 'Image optimization, editing, and design tools',
    icon: '🎨',
  },
  'network-web': {
    name: 'Network & Web',
    description: 'API testing, webhooks, and web performance tools',
    icon: '🌐',
  },
  'data-conversion': {
    name: 'Data Conversion',
    description: 'Convert between different data formats and encodings',
    icon: '🔄',
  },
  'productivity': {
    name: 'Productivity',
    description: 'Tools to enhance your development productivity',
    icon: '⚡',
  },
  'devops': {
    name: 'DevOps & Infrastructure',
    description: 'DevOps, CI/CD, and infrastructure management tools',
    icon: '🚀',
  },
  'testing': {
    name: 'Testing & QA',
    description: 'Testing, debugging, and quality assurance tools',
    icon: '🧪',
  },
  'admin': {
    name: 'Admin & Misc',
    description: 'Administrative and miscellaneous tools',
    icon: '⚙️',
  },
};

const TOOLS_DIR = path.join(__dirname, '..', 'app', 'tools');
const DRY_RUN = process.argv.includes('--dry-run');

console.log('🔧 DVtools Tools Reorganization Script');
console.log('=====================================\n');

if (DRY_RUN) {
  console.log('⚠️  DRY RUN MODE - No files will be moved\n');
}

// Create reverse mapping (tool -> category)
const toolToCategory = {};
Object.entries(CATEGORY_MAPPING).forEach(([category, tools]) => {
  tools.forEach(tool => {
    toolToCategory[tool] = category;
  });
});

// Step 1: Create category directories
console.log('Step 1: Creating category directories...');
Object.keys(CATEGORY_MAPPING).forEach(category => {
  const categoryPath = path.join(TOOLS_DIR, category);
  
  if (!DRY_RUN) {
    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true });
      console.log(`  ✅ Created: ${category}/`);
    } else {
      console.log(`  ⏭️  Exists: ${category}/`);
    }
  } else {
    console.log(`  [DRY RUN] Would create: ${category}/`);
  }
});

// Step 2: Create category index pages
console.log('\nStep 2: Creating category index pages...');
Object.entries(CATEGORY_INFO).forEach(([category, info]) => {
  const categoryPath = path.join(TOOLS_DIR, category);
  const pagePath = path.join(categoryPath, 'page.tsx');
  
  const pageContent = `import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "${info.name} | DVtools",
  description: "${info.description}",
};

export default function ${category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}CategoryPage() {
  const tools = ${JSON.stringify(CATEGORY_MAPPING[category], null, 2)};

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-5xl">${info.icon}</span>
          <h1 className="text-4xl font-bold">${info.name}</h1>
        </div>
        <p className="text-lg text-muted-foreground">${info.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link key={tool} href={\`/tools/${category}/\${tool}\`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="capitalize">
                  {tool.replace(/-/g, ' ')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">${category}</Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/tools" className="text-primary hover:underline">
          ← Back to All Tools
        </Link>
      </div>
    </div>
  );
}
`;

  if (!DRY_RUN) {
    fs.writeFileSync(pagePath, pageContent);
    console.log(`  ✅ Created: ${category}/page.tsx`);
  } else {
    console.log(`  [DRY RUN] Would create: ${category}/page.tsx`);
  }
});

// Step 3: Move tools to categories (DRY RUN shows what would happen)
console.log('\nStep 3: Tool movement plan:');
let movedCount = 0;
let notFoundCount = 0;

Object.entries(CATEGORY_MAPPING).forEach(([category, tools]) => {
  console.log(`\n📁 ${category}/`);
  
  tools.forEach(tool => {
    const sourcePath = path.join(TOOLS_DIR, tool);
    const destPath = path.join(TOOLS_DIR, category, tool);
    
    if (fs.existsSync(sourcePath)) {
      if (!DRY_RUN) {
        // Move directory
        fs.renameSync(sourcePath, destPath);
        console.log(`  ✅ Moved: ${tool}/ -> ${category}/${tool}/`);
      } else {
        console.log(`  [PLAN] ${tool}/ -> ${category}/${tool}/`);
      }
      movedCount++;
    } else {
      console.log(`  ⚠️  Not found: ${tool}/`);
      notFoundCount++;
    }
  });
});

console.log('\n=====================================');
console.log('📊 Summary:');
console.log(`  Total tools to organize: ${Object.values(CATEGORY_MAPPING).flat().length}`);
console.log(`  Tools ${DRY_RUN ? 'to be moved' : 'moved'}: ${movedCount}`);
console.log(`  Tools not found: ${notFoundCount}`);
console.log(`  Categories created: ${Object.keys(CATEGORY_MAPPING).length}`);

if (DRY_RUN) {
  console.log('\n💡 Run without --dry-run to actually move files:');
  console.log('   node scripts/reorganize-tools.js');
} else {
  console.log('\n✅ Reorganization complete!');
  console.log('\n⚠️  Next steps:');
  console.log('   1. Update tool registry/routes');
  console.log('   2. Add redirects in middleware.ts');
  console.log('   3. Update sitemap.xml');
  console.log('   4. Test all tool pages');
  console.log('   5. Update documentation');
}

console.log('\n');
