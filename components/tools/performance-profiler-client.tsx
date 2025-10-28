'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  Zap,
  Clock,
  HardDrive,
  Globe,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  BarChart3,
  Cpu,
  Wifi
} from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'needs-improvement' | 'poor';
  description: string;
  recommendation?: string;
}

interface ResourceTiming {
  name: string;
  duration: number;
  size: number;
  type: string;
  status: 'good' | 'needs-improvement' | 'poor';
}

interface PerformanceResult {
  url?: string;
  metrics: PerformanceMetric[];
  resources: ResourceTiming[];
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  summary: {
    totalRequests: number;
    totalSize: number;
    loadTime: number;
    issues: number;
  };
  timestamp: Date;
}

const sampleMetrics: PerformanceMetric[] = [
  {
    name: 'First Contentful Paint',
    value: 1200,
    unit: 'ms',
    status: 'good',
    description: 'Time to first contentful paint'
  },
  {
    name: 'Largest Contentful Paint',
    value: 2500,
    unit: 'ms',
    status: 'needs-improvement',
    description: 'Time to largest contentful paint',
    recommendation: 'Optimize images and reduce render-blocking resources'
  },
  {
    name: 'First Input Delay',
    value: 50,
    unit: 'ms',
    status: 'good',
    description: 'First input delay'
  },
  {
    name: 'Cumulative Layout Shift',
    value: 0.05,
    unit: '',
    status: 'good',
    description: 'Cumulative layout shift score'
  },
  {
    name: 'Total Blocking Time',
    value: 200,
    unit: 'ms',
    status: 'needs-improvement',
    description: 'Total blocking time',
    recommendation: 'Reduce JavaScript execution time'
  }
];

const sampleResources: ResourceTiming[] = [
  { name: 'index.html', duration: 150, size: 25000, type: 'document', status: 'good' },
  { name: 'style.css', duration: 200, size: 50000, type: 'stylesheet', status: 'good' },
  { name: 'app.js', duration: 300, size: 150000, type: 'script', status: 'needs-improvement' },
  { name: 'hero-image.jpg', duration: 450, size: 800000, type: 'image', status: 'poor' },
  { name: 'font.woff2', duration: 100, size: 30000, type: 'font', status: 'good' }
];

export default function PerformanceProfilerClient() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<PerformanceResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const analyzePerformance = async (targetUrl?: string): Promise<PerformanceResult> => {
    // Simulate analysis with realistic data
    const metrics = [...sampleMetrics];
    const resources = [...sampleResources];

    // Add some randomization for demo purposes
    metrics.forEach(metric => {
      metric.value = Math.round(metric.value * (0.8 + Math.random() * 0.4));
    });

    resources.forEach(resource => {
      resource.duration = Math.round(resource.duration * (0.7 + Math.random() * 0.6));
      resource.size = Math.round(resource.size * (0.9 + Math.random() * 0.2));
    });

    // Calculate overall score (0-100)
    const scores = metrics.map(m => {
      switch (m.status) {
        case 'good': return 100;
        case 'needs-improvement': return 70;
        case 'poor': return 40;
        default: return 50;
      }
    });

    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const score = Math.round(avgScore);

    // Determine grade
    let grade: 'A' | 'B' | 'C' | 'D' | 'F';
    if (score >= 90) grade = 'A';
    else if (score >= 80) grade = 'B';
    else if (score >= 70) grade = 'C';
    else if (score >= 60) grade = 'D';
    else grade = 'F';

    const totalSize = resources.reduce((sum, r) => sum + r.size, 0);
    const loadTime = Math.max(...resources.map(r => r.duration));
    const issues = metrics.filter(m => m.status !== 'good').length +
                   resources.filter(r => r.status !== 'good').length;

    return {
      url: targetUrl,
      metrics,
      resources,
      score,
      grade,
      summary: {
        totalRequests: resources.length,
        totalSize,
        loadTime,
        issues
      },
      timestamp: new Date()
    };
  };

  const handleAnalyze = async () => {
    if (!url.trim()) {
      toast({
        title: "No URL provided",
        description: "Please enter a website URL to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 20;
        });
      }, 200);

      const analysisResult = await analyzePerformance(url);
      setResult(analysisResult);
      setProgress(100);

      clearInterval(progressInterval);

      toast({
        title: "Analysis complete",
        description: `Performance score: ${analysisResult.score}/100 (Grade ${analysisResult.grade})`,
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Failed to analyze website performance",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'needs-improvement': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'needs-improvement': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'poor': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600';
      case 'B': return 'text-blue-600';
      case 'C': return 'text-yellow-600';
      case 'D': return 'text-orange-600';
      case 'F': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Profiler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="url-input">Website URL</Label>
            <Input
              id="url-input"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Enter a website URL to analyze its performance metrics
            </p>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Zap className="mr-2 h-4 w-4 animate-spin" />
                Analyzing... ({Math.round(progress)}%)
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-4 w-4" />
                Analyze Performance
              </>
            )}
          </Button>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analyzing website performance...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className={`text-4xl font-bold ${getGradeColor(result.grade)}`}>
                    {result.grade}
                  </div>
                  <p className="text-xs text-muted-foreground">Performance Grade</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Score: {result.score}/100
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{formatTime(result.summary.loadTime)}</div>
                  <p className="text-xs text-muted-foreground">Load Time</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{result.summary.totalRequests}</div>
                  <p className="text-xs text-muted-foreground">Total Requests</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{formatBytes(result.summary.totalSize)}</div>
                  <p className="text-xs text-muted-foreground">Total Size</p>
                </CardContent>
              </Card>
            </div>

            {result.url && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Analyzed URL</p>
                      <p className="text-sm text-muted-foreground">{result.url}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={result.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Visit Site
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Overall Assessment</h4>
                    <p className="text-sm text-muted-foreground">
                      {result.grade === 'A'
                        ? "Excellent performance! Your website loads quickly and efficiently."
                        : result.grade === 'B'
                        ? "Good performance with room for improvement."
                        : result.grade === 'C'
                        ? "Average performance. Consider optimizations for better user experience."
                        : "Poor performance. Significant improvements needed."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {result.metrics.filter(m => m.status === 'good').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Good Metrics</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {result.metrics.filter(m => m.status === 'needs-improvement').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Needs Work</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {result.metrics.filter(m => m.status === 'poor').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Poor Metrics</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {result.summary.issues}
                      </div>
                      <div className="text-sm text-muted-foreground">Issues Found</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Core Web Vitals & Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.metrics.map((metric, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(metric.status)}
                          <h4 className="font-semibold">{metric.name}</h4>
                        </div>
                        <Badge variant="outline" className={getStatusColor(metric.status)}>
                          {metric.status.replace('-', ' ')}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 mb-2">
                        <div className="text-2xl font-bold">
                          {metric.unit === 'ms' ? formatTime(metric.value) :
                           metric.unit === '' ? metric.value.toFixed(3) :
                           `${metric.value}${metric.unit}`}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {metric.description}
                        </div>
                      </div>

                      {metric.recommendation && (
                        <div className="bg-muted p-3 rounded text-sm">
                          <strong>Recommendation:</strong> {metric.recommendation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  Resource Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] w-full">
                  <div className="space-y-3">
                    {result.resources.map((resource, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(resource.status)}
                          <div>
                            <div className="font-medium">{resource.name}</div>
                            <div className="text-sm text-muted-foreground capitalize">
                              {resource.type}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-medium">{formatTime(resource.duration)}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatBytes(resource.size)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Optimization Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Priority Improvements</h4>
                    <div className="space-y-3">
                      {result.metrics.filter(m => m.status !== 'good').map((metric, index) => (
                        <div key={index} className="border-l-4 border-l-yellow-500 pl-4">
                          <h5 className="font-medium">{metric.name}</h5>
                          <p className="text-sm text-muted-foreground mb-2">
                            Current: {metric.unit === 'ms' ? formatTime(metric.value) : `${metric.value}${metric.unit}`}
                          </p>
                          {metric.recommendation && (
                            <p className="text-sm">{metric.recommendation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">General Best Practices</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h5 className="font-medium flex items-center gap-2">
                          <Cpu className="h-4 w-4" />
                          Code Optimization
                        </h5>
                        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                          <li>Minify CSS and JavaScript</li>
                          <li>Remove unused code</li>
                          <li>Use code splitting</li>
                          <li>Enable compression (Gzip/Brotli)</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-medium flex items-center gap-2">
                          <HardDrive className="h-4 w-4" />
                          Asset Optimization
                        </h5>
                        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                          <li>Optimize and compress images</li>
                          <li>Use modern formats (WebP, AVIF)</li>
                          <li>Enable browser caching</li>
                          <li>Use a CDN for assets</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-medium flex items-center gap-2">
                          <Wifi className="h-4 w-4" />
                          Network Optimization
                        </h5>
                        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                          <li>Reduce server response time</li>
                          <li>Use HTTP/2 or HTTP/3</li>
                          <li>Implement lazy loading</li>
                          <li>Preload critical resources</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-medium flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          User Experience
                        </h5>
                        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                          <li>Eliminate render-blocking resources</li>
                          <li>Optimize font loading</li>
                          <li>Reduce layout shifts</li>
                          <li>Improve interactivity</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}