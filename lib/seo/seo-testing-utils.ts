import { SEOValidator } from './seo-validator';

export interface TestResult {
  passed: boolean;
  message: string;
  details?: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  passed: number;
  total: number;
  score: number;
}

export class SEOTestingUtils {
  /**
   * Run comprehensive SEO test suite on blog content
   */
  static runFullTestSuite(content: any): TestSuite {
    const suites: TestSuite[] = [
      this.testMetaTags(content),
      this.testStructuredData(content),
      this.testContentQuality(content),
      this.testAccessibility(content),
      this.testPerformance(content),
      this.testSEORequirements(content),
    ];

    // Aggregate results
    const totalPassed = suites.reduce((sum, suite) => sum + suite.passed, 0);
    const totalTests = suites.reduce((sum, suite) => sum + suite.total, 0);
    const overallScore = Math.round((totalPassed / totalTests) * 100);

    return {
      name: 'Complete SEO Test Suite',
      tests: suites.flatMap(suite => suite.tests.map(test => test)),
      passed: totalPassed,
      total: totalTests,
      score: overallScore,
    };
  }

  /**
   * Test meta tags implementation
   */
  static testMetaTags(content: any): TestSuite {
    const tests: TestResult[] = [];

    // Title length test
    tests.push({
      passed: content.title?.length >= 30 && content.title?.length <= 60,
      message: `Title length check (${content.title?.length || 0} chars)`,
      severity: 'medium',
      details: { current: content.title?.length, min: 30, max: 60 }
    });

    // Meta description test
    const description = content.seo?.description || content.description;
    tests.push({
      passed: !!description && description.length >= 120 && description.length <= 160,
      message: `Meta description check (${description?.length || 0} chars)`,
      severity: 'high',
      details: { current: description?.length, min: 120, max: 160 }
    });

    // Open Graph image test
    tests.push({
      passed: !!content.seo?.ogImage,
      message: 'Open Graph image presence',
      severity: 'medium',
      details: { hasOGImage: !!content.seo?.ogImage }
    });

    // Keywords test
    tests.push({
      passed: content.seo?.keywords?.length >= 3 && content.seo?.keywords?.length <= 8,
      message: `SEO keywords count (${content.seo?.keywords?.length || 0})`,
      severity: 'low',
      details: { current: content.seo?.keywords?.length, min: 3, max: 8 }
    });

    return {
      name: 'Meta Tags Tests',
      tests,
      passed: tests.filter(t => t.passed).length,
      total: tests.length,
      score: Math.round((tests.filter(t => t.passed).length / tests.length) * 100),
    };
  }

  /**
   * Test structured data implementation
   */
  static testStructuredData(content: any): TestSuite {
    const tests: TestResult[] = [];

    // Author information test
    tests.push({
      passed: !!(content.author?.name),
      message: 'Author information present',
      severity: 'high',
      details: { hasAuthor: !!content.author?.name }
    });

    // Publication date test
    tests.push({
      passed: !!content.publishedAt,
      message: 'Publication date present',
      severity: 'medium',
      details: { hasDate: !!content.publishedAt }
    });

    // Category/test
    tests.push({
      passed: !!content.category,
      message: 'Category specified',
      severity: 'low',
      details: { hasCategory: !!content.category }
    });

    // FAQ schema test
    tests.push({
      passed: !!(content.faq?.length > 0),
      message: 'FAQ schema potential',
      severity: 'medium',
      details: { hasFAQ: content.faq?.length > 0 }
    });

    return {
      name: 'Structured Data Tests',
      tests,
      passed: tests.filter(t => t.passed).length,
      total: tests.length,
      score: Math.round((tests.filter(t => t.passed).length / tests.length) * 100),
    };
  }

  /**
   * Test content quality factors
   */
  static testContentQuality(content: any): TestSuite {
    const tests: TestResult[] = [];
    const wordCount = this.countWords(content.content);

    // Word count test
    tests.push({
      passed: wordCount >= 300,
      message: `Word count check (${wordCount} words)`,
      severity: 'high',
      details: { current: wordCount, min: 300 }
    });

    // Tags test
    tests.push({
      passed: content.tags?.length >= 3 && content.tags?.length <= 8,
      message: `Tags count (${content.tags?.length || 0})`,
      severity: 'medium',
      details: { current: content.tags?.length, min: 3, max: 8 }
    });

    // Content structure test (headings)
    const headingCount = this.countHeadings(content.content);
    tests.push({
      passed: headingCount >= 2,
      message: `Content structure check (${headingCount} headings)`,
      severity: 'medium',
      details: { current: headingCount, min: 2 }
    });

    // Links test
    const linkCount = this.countLinks(content.content);
    tests.push({
      passed: linkCount >= 2,
      message: `Link presence check (${linkCount} links)`,
      severity: 'low',
      details: { current: linkCount, min: 2 }
    });

    return {
      name: 'Content Quality Tests',
      tests,
      passed: tests.filter(t => t.passed).length,
      total: tests.length,
      score: Math.round((tests.filter(t => t.passed).length / tests.length) * 100),
    };
  }

  /**
   * Test accessibility factors
   */
  static testAccessibility(content: any): TestSuite {
    const tests: TestResult[] = [];

    // Images with alt text test
    const imageCount = this.countImages(content.content);
    const imageWithAlt = this.countImagesWithAlt(content.content);
    tests.push({
      passed: imageCount === 0 || imageWithAlt === imageCount,
      message: `Image alt text check (${imageWithAlt}/${imageCount} images have alt)`,
      severity: 'high',
      details: { withAlt: imageWithAlt, total: imageCount }
    });

    // Heading hierarchy test
    const hasProperHierarchy = this.checkHeadingHierarchy(content.content);
    tests.push({
      passed: hasProperHierarchy,
      message: 'Heading hierarchy check',
      severity: 'medium',
      details: { isValid: hasProperHierarchy }
    });

    // Reading level test (simplified)
    const readabilityScore = this.calculateReadingEase(content.content);
    tests.push({
      passed: readabilityScore >= 60,
      message: `Reading ease score (${readabilityScore})`,
      severity: 'low',
      details: { score: readabilityScore, threshold: 60 }
    });

    return {
      name: 'Accessibility Tests',
      tests,
      passed: tests.filter(t => t.passed).length,
      total: tests.length,
      score: Math.round((tests.filter(t => t.passed).length / tests.length) * 100),
    };
  }

  /**
   * Test performance factors
   */
  static testPerformance(content: any): TestSuite {
    const tests: TestResult[] = [];

    // Content length vs performance
    const wordCount = this.countWords(content.content);
    tests.push({
      passed: wordCount <= 3000,
      message: `Content length check (${wordCount} words)`,
      severity: 'medium',
      details: { current: wordCount, max: 3000 }
    });

    // Image count test
    const imageCount = this.countImages(content.content);
    tests.push({
      passed: imageCount <= 10,
      message: `Image count check (${imageCount} images)`,
      severity: 'medium',
      details: { current: imageCount, max: 10 }
    });

    // Loading time estimation
    const estimatedLoadTime = Math.ceil(wordCount / 200) + Math.ceil(imageCount / 5);
    tests.push({
      passed: estimatedLoadTime <= 5,
      message: `Estimated load time check (${estimatedLoadTime} min)`,
      severity: 'low',
      details: { estimated: estimatedLoadTime, threshold: 5 }
    });

    return {
      name: 'Performance Tests',
      tests,
      passed: tests.filter(t => t.passed).length,
      total: tests.length,
      score: Math.round((tests.filter(t => t.passed).length / tests.length) * 100),
    };
  }

  /**
   * Test essential SEO requirements
   */
  static testSEORequirements(content: any): TestSuite {
    const tests: TestResult[] = [];

    // Essential fields test
    tests.push({
      passed: !!(content.title && content.content && content.author?.name),
      message: 'Essential fields completeness',
      severity: 'critical',
      details: { 
        hasTitle: !!content.title, 
        hasContent: !!content.content, 
        hasAuthor: !!content.author?.name 
      }
    });

    // SEO basics test
    tests.push({
      passed: !!(content.seo?.description && (content.seo?.keywords?.length > 0 || content.tags?.length > 0)),
      message: 'SEO basics implementation',
      severity: 'high',
      details: { 
        hasMetaDescription: !!content.seo?.description,
        hasKeywords: (content.seo?.keywords?.length || 0) > 0 || (content.tags?.length || 0) > 0
      }
    });

    // Content uniqueness indicators
    tests.push({
      passed: this.hasUniqueElements(content.content),
      message: 'Content uniqueness indicators',
      severity: 'medium',
      details: { hasCodeBlocks: this.countCodeBlocks(content.content) > 0 }
    });

    return {
      name: 'SEO Requirements Tests',
      tests,
      passed: tests.filter(t => t.passed).length,
      total: tests.length,
      score: Math.round((tests.filter(t => t.passed).length / tests.length) * 100),
    };
  }

  /**
   * Generate improvement suggestions based on test results
   */
  static generateImprovementSuggestions(testSuite: TestSuite): string[] {
    const suggestions: string[] = [];
    const failedTests = testSuite.tests.filter(test => !test.passed);

    failedTests.forEach(test => {
      switch (test.severity) {
        case 'critical':
          suggestions.push(`CRITICAL: ${test.message} - ${this.getCriticalSuggestion(test.message)}`);
          break;
        case 'high':
          suggestions.push(`HIGH PRIORITY: ${test.message} - ${this.getHighPrioritySuggestion(test.message)}`);
          break;
        case 'medium':
          suggestions.push(`MEDIUM PRIORITY: ${test.message} - ${this.getMediumPrioritySuggestion(test.message)}`);
          break;
        case 'low':
          suggestions.push(`LOW PRIORITY: ${test.message} - ${this.getLowPrioritySuggestion(test.message)}`);
          break;
      }
    });

    return suggestions;
  }

  // Helper methods
  private static countWords(content: string): number {
    return content?.trim().split(/\s+/).filter(word => word.length > 0).length || 0;
  }

  private static countHeadings(content: string): number {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    return (content?.match(headingRegex) || []).length;
  }

  private static countLinks(content: string): number {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    return (content?.match(linkRegex) || []).length;
  }

  private static countImages(content: string): number {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    return (content?.match(imageRegex) || []).length;
  }

  private static countImagesWithAlt(content: string): number {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const matches = content?.match(imageRegex) || [];
    return matches.filter(match => {
      const altText = match.match(/!\[([^\]]*)\]/);
      return altText && altText[1].trim().length > 0;
    }).length;
  }

  private static countCodeBlocks(content: string): number {
    const codeBlockRegex = /```[\s\S]*?```/g;
    return (content?.match(codeBlockRegex) || []).length;
  }

  private static checkHeadingHierarchy(content: string): boolean {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: number[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      headings.push(match[1].length);
    }

    if (headings.length === 0) return false;

    let previousLevel = 0;
    for (const level of headings) {
      if (level > previousLevel + 1) return false;
      previousLevel = level;
    }

    return true;
  }

  private static calculateReadingEase(content: string): number {
    const wordCount = this.countWords(content);
    const sentenceCount = (content?.match(/[.!?]+/g) || []).length;
    const syllableCount = this.countSyllables(content);

    if (wordCount === 0 || sentenceCount === 0 || syllableCount === 0) return 0;

    const score = 206.835 - (1.015 * (wordCount / sentenceCount)) - (84.6 * (syllableCount / wordCount));
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  private static countSyllables(content: string): number {
    const words = content?.toLowerCase().split(/\s+/) || [];
    let syllableCount = 0;

    words.forEach(word => {
      word = word.replace(/[^a-z]/g, '');
      if (word.length === 0) return;

      if (word.length <= 3) {
        syllableCount += 1;
      } else {
        word = word.replace(/e$/, '');
        const vowelGroups = word.match(/[aeiouy]+/g);
        syllableCount += vowelGroups ? vowelGroups.length : 1;
      }
    });

    return syllableCount;
  }

  private static hasUniqueElements(content: string): boolean {
    return this.countCodeBlocks(content) > 0 || this.countLists(content) > 0;
  }

  private static countLists(content: string): number {
    const listRegex = /^\s*[-*+]\s+.+$/gm;
    return (content?.match(listRegex) || []).length;
  }

  // Suggestion methods
  private static getCriticalSuggestion(message: string): string {
    if (message.includes('Essential fields')) {
      return 'Add required title, content, and author information';
    }
    return 'Fix this critical issue immediately';
  }

  private static getHighPrioritySuggestion(message: string): string {
    if (message.includes('Meta description')) {
      return 'Add a compelling meta description between 120-160 characters';
    }
    if (message.includes('Word count')) {
      return 'Expand content to at least 300 words for better SEO';
    }
    if (message.includes('Author information')) {
      return 'Add author information for better E-A-T signals';
    }
    if (message.includes('Image alt text')) {
      return 'Add descriptive alt text to all images';
    }
    return 'Address this high-priority issue for better SEO';
  }

  private static getMediumPrioritySuggestion(message: string): string {
    if (message.includes('Title length')) {
      return 'Optimize title length (30-60 characters) for better search display';
    }
    if (message.includes('Open Graph')) {
      return 'Add OG image for better social media sharing';
    }
    if (message.includes('Content structure')) {
      return 'Add more headings to improve content structure';
    }
    return 'Implement this improvement for better user experience';
  }

  private static getLowPrioritySuggestion(message: string): string {
    if (message.includes('Keywords')) {
      return 'Add 3-8 relevant keywords for better content targeting';
    }
    if (message.includes('Links')) {
      return 'Add internal and external links to improve navigation';
    }
    return 'Consider this enhancement for optimal performance';
  }
}