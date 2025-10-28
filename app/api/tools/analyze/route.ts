import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { ToolType } from '@prisma/client';

// Validation schemas for different tools
const componentPlaygroundSchema = z.object({
  tool: z.literal('component-playground'),
  code: z.string().min(1, 'Code is required'),
  framework: z.enum(['react', 'vue', 'angular', 'svelte']).optional(),
});

const cssLinterSchema = z.object({
  tool: z.literal('css-linter-optimizer'),
  css: z.string().min(1, 'CSS code is required'),
  rules: z.array(z.string()).optional(),
});

const responsiveTesterSchema = z.object({
  tool: z.literal('responsive-design-tester'),
  html: z.string().min(1, 'HTML content is required'),
  css: z.string().optional(),
  breakpoints: z.array(z.object({
    name: z.string(),
    width: z.number(),
    height: z.number(),
  })).optional(),
});

const imageOptimizerSchema = z.object({
  tool: z.literal('image-optimizer-converter'),
  imageData: z.string().min(1, 'Image data is required'),
  format: z.enum(['jpeg', 'png', 'webp', 'avif']).optional(),
  quality: z.number().min(1).max(100).optional(),
});

const accessibilityScannerSchema = z.object({
  tool: z.literal('accessibility-scanner'),
  html: z.string().min(1, 'HTML content is required'),
  rules: z.array(z.string()).optional(),
});

const performanceProfilerSchema = z.object({
  tool: z.literal('performance-profiler'),
  url: z.string().url().optional(),
  html: z.string().optional(),
});

const staticSiteExporterSchema = z.object({
  tool: z.literal('static-site-exporter'),
  html: z.string().min(1, 'HTML content is required'),
  options: z.object({
    format: z.enum(['single-file', 'zip']).optional(),
    minify: z.boolean().optional(),
    includeAssets: z.boolean().optional(),
  }).optional(),
});

const themeBuilderSchema = z.object({
  tool: z.literal('theme-builder'),
  colors: z.record(z.string()).optional(),
  typography: z.record(z.any()).optional(),
  spacing: z.record(z.string()).optional(),
});

const toolAnalysisSchema = z.discriminatedUnion('tool', [
  componentPlaygroundSchema,
  cssLinterSchema,
  responsiveTesterSchema,
  imageOptimizerSchema,
  accessibilityScannerSchema,
  performanceProfilerSchema,
  staticSiteExporterSchema,
  themeBuilderSchema,
]);

// Tool type mapping
const TOOL_TYPE_MAP: Record<string, ToolType> = {
  'component-playground': ToolType.COMPONENT_PLAYGROUND,
  'css-linter-optimizer': ToolType.CSS_LINTER_OPTIMIZER,
  'responsive-design-tester': ToolType.RESPONSIVE_DESIGN_TESTER,
  'image-optimizer-converter': ToolType.IMAGE_OPTIMIZER_CONVERTER,
  'accessibility-scanner': ToolType.ACCESSIBILITY_SCANNER,
  'performance-profiler': ToolType.PERFORMANCE_PROFILER,
  'static-site-exporter': ToolType.STATIC_SITE_EXPORTER,
  'theme-builder': ToolType.THEME_BUILDER,
};

// POST /api/tools/analyze - Analyze content using various tools
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { tool, ...toolData } = toolAnalysisSchema.parse(body);

    const userId = session.user.id;
    const toolType = TOOL_TYPE_MAP[tool];
    const startTime = Date.now();

    let result: any = {};
    let success = true;
    let errorMsg: string | undefined;

    try {
      // Process the tool analysis based on type
      switch (tool) {
        case 'component-playground':
          result = await analyzeComponentPlayground(toolData as z.infer<typeof componentPlaygroundSchema>);
          break;

        case 'css-linter-optimizer':
          result = await analyzeCssLinter(toolData as z.infer<typeof cssLinterSchema>);
          break;

        case 'responsive-design-tester':
          result = await analyzeResponsiveTester(toolData as z.infer<typeof responsiveTesterSchema>);
          break;

        case 'image-optimizer-converter':
          result = await analyzeImageOptimizer(toolData as z.infer<typeof imageOptimizerSchema>);
          break;

        case 'accessibility-scanner':
          result = await analyzeAccessibilityScanner(toolData as z.infer<typeof accessibilityScannerSchema>);
          break;

        case 'performance-profiler':
          result = await analyzePerformanceProfiler(toolData as z.infer<typeof performanceProfilerSchema>);
          break;

        case 'static-site-exporter':
          result = await analyzeStaticSiteExporter(toolData as z.infer<typeof staticSiteExporterSchema>);
          break;

        case 'theme-builder':
          result = await analyzeThemeBuilder(toolData as z.infer<typeof themeBuilderSchema>);
          break;

        default:
          throw new Error(`Unsupported tool: ${tool}`);
      }
    } catch (error) {
      success = false;
      errorMsg = error instanceof Error ? error.message : 'Analysis failed';
      result = { error: errorMsg };
    }

    const duration = Date.now() - startTime;

    // Log the tool usage
    await prisma.toolSession.create({
      data: {
        userId,
        toolType,
        inputHash: generateHash(JSON.stringify(toolData)),
        outputHash: generateHash(JSON.stringify(result)),
        duration,
        success,
        errorMsg,
      },
    });

    // Log the audit event
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'TOOL_USED',
        resource: 'tool_analysis',
        resourceId: tool,
        details: {
          tool,
          success,
          duration,
          inputSize: JSON.stringify(toolData).length,
          outputSize: JSON.stringify(result).length,
        },
      },
    });

    return NextResponse.json({
      success,
      tool,
      result,
      duration,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 });
    }

    console.error('Tool analysis error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Tool analysis functions
async function analyzeComponentPlayground(data: z.infer<typeof componentPlaygroundSchema>) {
  const { code, framework = 'react' } = data;

  // Basic syntax validation
  const syntaxErrors: string[] = [];

  if (framework === 'react') {
    // Check for common React issues
    if (!code.includes('import React')) {
      syntaxErrors.push('Missing React import');
    }
    if (code.includes('className=') && !code.includes('className="')) {
      syntaxErrors.push('Potential className syntax error');
    }
  }

  // Count components, props, etc.
  const componentCount = (code.match(/function\s+\w+|const\s+\w+\s*=\s*\(/g) || []).length;
  const propCount = (code.match(/props?\.\w+/g) || []).length;

  return {
    syntaxValid: syntaxErrors.length === 0,
    syntaxErrors,
    metrics: {
      componentCount,
      propCount,
      linesOfCode: code.split('\n').length,
      characters: code.length,
    },
    suggestions: [
      'Consider using TypeScript for better type safety',
      'Use meaningful component and prop names',
      'Consider extracting reusable components',
    ],
  };
}

async function analyzeCssLinter(data: z.infer<typeof cssLinterSchema>) {
  const { css, rules = ['all'] } = data;

  const issues: Array<{
    type: 'error' | 'warning';
    message: string;
    line?: number;
    column?: number;
  }> = [];

  // Basic CSS validation
  if (css.includes('{') && !css.includes('}')) {
    issues.push({ type: 'error', message: 'Unclosed CSS rule' });
  }

  // Check for common issues
  if (css.includes('!important')) {
    issues.push({ type: 'warning', message: 'Use of !important detected' });
  }

  // Calculate metrics
  const rulesCount = (css.match(/{/g) || []).length;
  const selectorsCount = (css.match(/[^}]+{/g) || []).length;
  const propertiesCount = (css.match(/[^:]+:[^;]+;/g) || []).length;

  // Optimization suggestions
  const suggestions: string[] = [];
  if (css.length > 10000) {
    suggestions.push('Consider splitting CSS into multiple files');
  }
  if (rulesCount > 100) {
    suggestions.push('High number of CSS rules - consider optimization');
  }

  return {
    issues,
    metrics: {
      rulesCount,
      selectorsCount,
      propertiesCount,
      fileSize: css.length,
    },
    suggestions,
    optimized: issues.length === 0,
  };
}

async function analyzeResponsiveTester(data: z.infer<typeof responsiveTesterSchema>) {
  const { html, css = '', breakpoints = [] } = data;

  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check for responsive meta tag
  if (!html.includes('viewport')) {
    issues.push('Missing viewport meta tag');
  }

  // Check for responsive units
  if (!css.includes('vw') && !css.includes('%') && !css.includes('em')) {
    recommendations.push('Consider using responsive units (vw, %, em, rem)');
  }

  // Check for media queries
  const mediaQueryCount = (css.match(/@media/g) || []).length;
  if (mediaQueryCount === 0) {
    recommendations.push('Add media queries for different screen sizes');
  }

  // Default breakpoints if none provided
  const defaultBreakpoints = breakpoints.length > 0 ? breakpoints : [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ];

  return {
    issues,
    recommendations,
    breakpoints: defaultBreakpoints,
    mediaQueryCount,
    responsive: issues.length === 0,
  };
}

async function analyzeImageOptimizer(data: z.infer<typeof imageOptimizerSchema>) {
  const { imageData, format = 'webp', quality = 80 } = data;

  // Basic image analysis (in a real implementation, you'd use a library like sharp)
  const sizeKB = Math.round((imageData.length * 3) / 4 / 1024); // Rough estimate

  const optimizations = {
    originalSize: sizeKB,
    optimizedSize: Math.round(sizeKB * 0.7), // Estimate 30% reduction
    format,
    quality,
    compressionRatio: 0.7,
  };

  return {
    optimizations,
    recommendations: [
      `Convert to ${format} format for better compression`,
      `Use quality setting of ${quality}% for optimal balance`,
      'Consider lazy loading for images below the fold',
      'Use responsive images with srcset attribute',
    ],
  };
}

async function analyzeAccessibilityScanner(data: z.infer<typeof accessibilityScannerSchema>) {
  const { html, rules = ['wcag2a', 'wcag2aa'] } = data;

  const violations: Array<{
    rule: string;
    impact: 'minor' | 'moderate' | 'serious' | 'critical';
    description: string;
    element?: string;
  }> = [];

  // Basic accessibility checks
  if (!html.includes('alt=')) {
    violations.push({
      rule: 'image-alt',
      impact: 'critical',
      description: 'Images must have alt text',
    });
  }

  if (!html.includes('<title>')) {
    violations.push({
      rule: 'document-title',
      impact: 'serious',
      description: 'Document must have a title',
    });
  }

  // Check for heading hierarchy
  const headings = html.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi) || [];
  if (headings.length > 0 && !headings.some(h => h.includes('<h1'))) {
    violations.push({
      rule: 'heading-order',
      impact: 'moderate',
      description: 'Page must have an h1 heading',
    });
  }

  // Color contrast (basic check)
  if (html.includes('color:')) {
    violations.push({
      rule: 'color-contrast',
      impact: 'serious',
      description: 'Check color contrast ratios',
    });
  }

  const score = Math.max(0, 100 - (violations.length * 15));

  return {
    violations,
    score,
    level: rules.includes('wcag2aa') ? 'AA' : 'A',
    passed: violations.length === 0,
    summary: {
      totalViolations: violations.length,
      critical: violations.filter(v => v.impact === 'critical').length,
      serious: violations.filter(v => v.impact === 'serious').length,
      moderate: violations.filter(v => v.impact === 'moderate').length,
      minor: violations.filter(v => v.impact === 'minor').length,
    },
  };
}

async function analyzePerformanceProfiler(data: z.infer<typeof performanceProfilerSchema>) {
  const { url, html } = data;

  // Simulate performance analysis
  const metrics = {
    firstContentfulPaint: Math.random() * 2000 + 1000,
    largestContentfulPaint: Math.random() * 3000 + 2000,
    firstInputDelay: Math.random() * 100,
    cumulativeLayoutShift: Math.random() * 0.1,
    totalBlockingTime: Math.random() * 200,
  };

  const scores = {
    performance: Math.round(calculatePerformanceScore(metrics)),
    accessibility: Math.round(Math.random() * 40 + 60),
    bestPractices: Math.round(Math.random() * 30 + 70),
    seo: Math.round(Math.random() * 20 + 80),
  };

  const recommendations = [
    'Optimize images and use modern formats (WebP, AVIF)',
    'Minify CSS and JavaScript files',
    'Use lazy loading for images',
    'Implement proper caching headers',
    'Reduce unused JavaScript and CSS',
  ];

  return {
    metrics,
    scores,
    recommendations,
    grade: getPerformanceGrade(scores.performance),
  };
}

async function analyzeStaticSiteExporter(data: z.infer<typeof staticSiteExporterSchema>) {
  const { html, options = {} } = data;
  const { format = 'single-file', minify = false, includeAssets = true } = options;

  const analysis = {
    originalSize: html.length,
    estimatedOutputSize: minify ? Math.round(html.length * 0.8) : html.length,
    format,
    minified: minify,
    assetsIncluded: includeAssets,
  };

  // Extract basic info
  const hasCSS = html.includes('<style') || html.includes('href=') && html.includes('.css');
  const hasJS = html.includes('<script') && !html.includes('src=');
  const hasImages = html.includes('<img') || html.includes('background-image');

  return {
    analysis,
    features: {
      hasInlineCSS: hasCSS,
      hasInlineJS: hasJS,
      hasImages: hasImages,
      isResponsive: html.includes('viewport') || html.includes('@media'),
    },
    recommendations: [
      format === 'zip' ? 'Use ZIP format for complex sites with multiple assets' : 'Single file format works best for simple pages',
      minify ? 'Minification will reduce file size significantly' : 'Consider enabling minification for production',
      includeAssets ? 'Including assets ensures complete functionality' : 'External assets may not load in exported files',
    ],
  };
}

async function analyzeThemeBuilder(data: z.infer<typeof themeBuilderSchema>) {
  const { colors = {}, typography = {}, spacing = {} } = data;

  const analysis = {
    colorCount: Object.keys(colors).length,
    typographySettings: Object.keys(typography).length,
    spacingTokens: Object.keys(spacing).length,
  };

  const suggestions = [];

  if (analysis.colorCount < 5) {
    suggestions.push('Consider adding more color tokens for better design flexibility');
  }

  if (analysis.typographySettings < 3) {
    suggestions.push('Add more typography settings (line-height, letter-spacing, etc.)');
  }

  if (analysis.spacingTokens < 6) {
    suggestions.push('Expand spacing scale for more granular control');
  }

  return {
    analysis,
    suggestions,
    completeness: Math.min(100, (analysis.colorCount + analysis.typographySettings + analysis.spacingTokens) * 10),
    readyForExport: analysis.colorCount >= 3 && analysis.typographySettings >= 2,
  };
}

// Helper functions
function generateHash(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

function calculatePerformanceScore(metrics: any): number {
  // Simplified performance scoring based on Core Web Vitals
  const fcp = Math.max(0, 100 - (metrics.firstContentfulPaint / 20));
  const lcp = Math.max(0, 100 - (metrics.largestContentfulPaint / 30));
  const fid = Math.max(0, 100 - (metrics.firstInputDelay * 2));
  const cls = Math.max(0, 100 - (metrics.cumulativeLayoutShift * 1000));
  const tbt = Math.max(0, 100 - (metrics.totalBlockingTime / 2));

  return (fcp + lcp + fid + cls + tbt) / 5;
}

function getPerformanceGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}