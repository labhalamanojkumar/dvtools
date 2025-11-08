'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  Download, 
  FileText, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Eye, 
  Settings, 
  Filter, 
  Search, 
  Trash2, 
  Play, 
  Pause, 
  RotateCcw,
  BarChart3,
  Database,
  Zap
} from 'lucide-react';

interface DataRow {
  [key: string]: string | number | boolean | null;
}

interface ValidationError {
  row: number;
  column: string;
  value: any;
  error: string;
  severity: 'error' | 'warning';
}

interface TransformationRule {
  id: string;
  type: 'replace' | 'regex' | 'formula' | 'case' | 'trim' | 'split';
  column: string;
  config: any;
  enabled: boolean;
}

const CSVExcelInspectorTransformerClient: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<DataRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [transformations, setTransformations] = useState<TransformationRule[]>([]);
  const [previewData, setPreviewData] = useState<DataRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx' | 'json'>('csv');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsProcessing(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/tools/csv-excel-inspector', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process file');
      }

      const result = await response.json();
      
      setData(result.data);
      setHeaders(result.headers);
      setErrors(result.errors || []);
      setPreviewData(result.data.slice(0, 100)); // Preview first 100 rows
      setSelectedColumns(result.headers);
      setProgress(100);
      setActiveTab('preview');
    } catch (error) {
      console.error('Error processing file:', error);
      setErrors([{ 
        row: 0, 
        column: '', 
        value: null, 
        error: 'Failed to process file', 
        severity: 'error' 
      }]);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleTransformation = useCallback(async () => {
    if (!file || transformations.length === 0) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const response = await fetch('/api/tools/csv-excel-inspector/transform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data,
          transformations: transformations.filter(t => t.enabled),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to apply transformations');
      }

      const result = await response.json();
      setData(result.data);
      setPreviewData(result.data.slice(0, 100));
      setErrors(result.errors || []);
      setProgress(100);
    } catch (error) {
      console.error('Error applying transformations:', error);
      setErrors([{ 
        row: 0, 
        column: '', 
        value: null, 
        error: 'Failed to apply transformations', 
        severity: 'error' 
      }]);
    } finally {
      setIsProcessing(false);
    }
  }, [file, data, transformations]);

  const handleExport = useCallback(async () => {
    if (data.length === 0) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const response = await fetch('/api/tools/csv-excel-inspector/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: previewData.length > 0 ? previewData : data,
          format: exportFormat,
          columns: selectedColumns,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `exported_data.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setProgress(100);
    } catch (error) {
      console.error('Error exporting data:', error);
      setErrors([{ 
        row: 0, 
        column: '', 
        value: null, 
        error: 'Failed to export data', 
        severity: 'error' 
      }]);
    } finally {
      setIsProcessing(false);
    }
  }, [data, previewData, exportFormat, selectedColumns]);

  const addTransformationRule = useCallback(() => {
    const newRule: TransformationRule = {
      id: Date.now().toString(),
      type: 'replace',
      column: headers[0] || '',
      config: {},
      enabled: true,
    };
    setTransformations(prev => [...prev, newRule]);
  }, [headers]);

  const updateTransformationRule = useCallback((id: string, updates: Partial<TransformationRule>) => {
    setTransformations(prev => prev.map(rule => 
      rule.id === id ? { ...rule, ...updates } : rule
    ));
  }, []);

  const removeTransformationRule = useCallback((id: string) => {
    setTransformations(prev => prev.filter(rule => rule.id !== id));
  }, []);

  const filteredData = previewData.filter(row => 
    Object.values(row).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Advanced CSV/Excel Inspector & Transformer
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Professional-grade data processing tool for CSV and Excel files. 
          Analyze, transform, validate, and export your spreadsheet data with advanced capabilities.
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="secondary" className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            CSV Support
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <FileSpreadsheet className="w-3 h-3" />
            Excel Support
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Real-time Processing
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />
            Data Visualization
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Database className="w-3 h-3" />
            Batch Operations
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="transform" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Transform
          </TabsTrigger>
          <TabsTrigger value="validate" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Validate
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                File Upload
              </CardTitle>
              <CardDescription>
                Upload your CSV or Excel file to begin processing. 
                Supported formats: .csv, .xlsx, .xls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  size="lg"
                  className="mb-4"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
                <p className="text-sm text-muted-foreground">
                  {file ? `Selected: ${file.name}` : 'Click to select or drag and drop your file'}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Maximum file size: 50MB
                </p>
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing file...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Data Preview
              </CardTitle>
              <CardDescription>
                Preview your data with search and filtering capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search Data</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search across all columns..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-48">
                  <Label>Rows Displayed</Label>
                  <Select defaultValue="100">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">50 rows</SelectItem>
                      <SelectItem value="100">100 rows</SelectItem>
                      <SelectItem value="500">500 rows</SelectItem>
                      <SelectItem value="1000">1000 rows</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <ScrollArea className="h-96 w-full border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {headers.map((header, index) => (
                        <TableHead key={index}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {headers.map((header, colIndex) => (
                          <TableCell key={colIndex}>
                            {String(row[header] || '')}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>

              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Showing {filteredData.length} of {data.length} rows</span>
                <span>{headers.length} columns</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transform" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Data Transformations
              </CardTitle>
              <CardDescription>
                Apply transformation rules to clean and modify your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={addTransformationRule} className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Add Transformation Rule
              </Button>

              <div className="space-y-4">
                {transformations.map((rule) => (
                  <Card key={rule.id} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={rule.enabled}
                          onChange={(e) => updateTransformationRule(rule.id, { enabled: e.target.checked })}
                        />
                        <Select 
                          value={rule.type}
                          onValueChange={(value) => updateTransformationRule(rule.id, { type: value as any })}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="replace">Replace</SelectItem>
                            <SelectItem value="regex">Regex</SelectItem>
                            <SelectItem value="formula">Formula</SelectItem>
                            <SelectItem value="case">Case</SelectItem>
                            <SelectItem value="trim">Trim</SelectItem>
                            <SelectItem value="split">Split</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select 
                          value={rule.column}
                          onValueChange={(value) => updateTransformationRule(rule.id, { column: value })}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Column" />
                          </SelectTrigger>
                          <SelectContent>
                            {headers.map((header) => (
                              <SelectItem key={header} value={header}>{header}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => removeTransformationRule(rule.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Transformation-specific configuration */}
                    {rule.type === 'replace' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Find</Label>
                          <Input 
                            placeholder="Text to replace"
                            value={rule.config.find || ''}
                            onChange={(e) => updateTransformationRule(rule.id, {
                              config: { ...rule.config, find: e.target.value }
                            })}
                          />
                        </div>
                        <div>
                          <Label>Replace with</Label>
                          <Input 
                            placeholder="Replacement text"
                            value={rule.config.replace || ''}
                            onChange={(e) => updateTransformationRule(rule.id, {
                              config: { ...rule.config, replace: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    )}

                    {rule.type === 'regex' && (
                      <div className="space-y-4">
                        <div>
                          <Label>Regular Expression</Label>
                          <Input 
                            placeholder="Enter regex pattern"
                            value={rule.config.pattern || ''}
                            onChange={(e) => updateTransformationRule(rule.id, {
                              config: { ...rule.config, pattern: e.target.value }
                            })}
                          />
                        </div>
                        <div>
                          <Label>Replacement</Label>
                          <Input 
                            placeholder="Replacement string"
                            value={rule.config.replacement || ''}
                            onChange={(e) => updateTransformationRule(rule.id, {
                              config: { ...rule.config, replacement: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>

              <Button 
                onClick={handleTransformation} 
                disabled={transformations.length === 0 || isProcessing}
                className="w-full"
              >
                <Play className="w-4 h-4 mr-2" />
                Apply Transformations
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Data Validation
              </CardTitle>
              <CardDescription>
                Review validation errors and data quality issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {errors.length === 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>No Issues Found</AlertTitle>
                  <AlertDescription>
                    Your data appears to be valid and ready for processing.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Found {errors.length} issue{errors.length !== 1 ? 's' : ''}
                    </h3>
                    <Badge variant={errors.some(e => e.severity === 'error') ? 'destructive' : 'secondary'}>
                      {errors.filter(e => e.severity === 'error').length} errors, {errors.filter(e => e.severity === 'warning').length} warnings
                    </Badge>
                  </div>

                  <ScrollArea className="h-64 w-full border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Row</TableHead>
                          <TableHead>Column</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Issue</TableHead>
                          <TableHead>Severity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {errors.map((error, index) => (
                          <TableRow key={index}>
                            <TableCell>{error.row}</TableCell>
                            <TableCell>{error.column}</TableCell>
                            <TableCell className="max-w-32 truncate">
                              {String(error.value)}
                            </TableCell>
                            <TableCell>{error.error}</TableCell>
                            <TableCell>
                              <Badge variant={error.severity === 'error' ? 'destructive' : 'secondary'}>
                                {error.severity}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Data
              </CardTitle>
              <CardDescription>
                Export your processed data in various formats
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Export Format</Label>
                  <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Rows to Export</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All rows ({data.length})</SelectItem>
                      <SelectItem value="filtered">Filtered rows ({filteredData.length})</SelectItem>
                      <SelectItem value="preview">Preview rows (100)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Columns to Include</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {headers.map((header) => (
                    <Badge 
                      key={header}
                      variant={selectedColumns.includes(header) ? 'default' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedColumns(prev => 
                          prev.includes(header) 
                            ? prev.filter(col => col !== header)
                            : [...prev, header]
                        );
                      }}
                    >
                      {header}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleExport} 
                disabled={data.length === 0 || isProcessing}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Exporting data...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CSVExcelInspectorTransformerClient;
