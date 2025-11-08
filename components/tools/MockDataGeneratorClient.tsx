'use client';

import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Database,
  FileText,
  Download,
  Copy,
  Play,
  Plus,
  Trash2,
  Settings,
  Shuffle,
  Eye,
  Code,
  Table
} from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

interface FieldDefinition {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'name' | 'address' | 'phone' | 'uuid' | 'custom';
  options?: {
    min?: number;
    max?: number;
    format?: string;
    customValues?: string[];
  };
}

interface GeneratedData {
  [key: string]: any;
}

const FIELD_TYPES = [
  { value: 'string', label: 'String' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'date', label: 'Date' },
  { value: 'email', label: 'Email' },
  { value: 'name', label: 'Name' },
  { value: 'address', label: 'Address' },
  { value: 'phone', label: 'Phone' },
  { value: 'uuid', label: 'UUID' },
  { value: 'custom', label: 'Custom List' },
];

const PRESETS = {
  user: [
    { name: 'id', type: 'uuid' as const },
    { name: 'firstName', type: 'name' as const },
    { name: 'lastName', type: 'name' as const },
    { name: 'email', type: 'email' as const },
    { name: 'phone', type: 'phone' as const },
    { name: 'address', type: 'address' as const },
    { name: 'createdAt', type: 'date' as const },
  ],
  product: [
    { name: 'id', type: 'uuid' as const },
    { name: 'name', type: 'string' as const },
    { name: 'price', type: 'number' as const, options: { min: 1, max: 1000 } },
    { name: 'category', type: 'custom' as const, options: { customValues: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'] } },
    { name: 'inStock', type: 'boolean' as const },
    { name: 'createdAt', type: 'date' as const },
  ],
  order: [
    { name: 'id', type: 'uuid' as const },
    { name: 'userId', type: 'uuid' as const },
    { name: 'total', type: 'number' as const, options: { min: 10, max: 5000 } },
    { name: 'status', type: 'custom' as const, options: { customValues: ['pending', 'processing', 'shipped', 'delivered'] } },
    { name: 'orderDate', type: 'date' as const },
  ],
};

export default function MockDataGeneratorClient() {
  const [activeTab, setActiveTab] = useState<'schema' | 'preview' | 'export'>('schema');
  const [fields, setFields] = useState<FieldDefinition[]>([]);
  const [recordCount, setRecordCount] = useState(10);
  const [generatedData, setGeneratedData] = useState<GeneratedData[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'sql'>('json');

  const { toast } = useToast();

  // Generate mock data based on field definitions
  const generateMockData = useCallback(() => {
    const data: GeneratedData[] = [];

    for (let i = 0; i < recordCount; i++) {
      const record: GeneratedData = {};

      fields.forEach(field => {
        record[field.name] = generateFieldValue(field);
      });

      data.push(record);
    }

    setGeneratedData(data);
    setActiveTab('preview');
    toast({
      title: "Data generated",
      description: `Generated ${recordCount} records successfully`,
    });
  }, [fields, recordCount, toast]);

  // Generate value for a specific field
  const generateFieldValue = useCallback((field: FieldDefinition): any => {
    const { type, options = {} } = field;

    switch (type) {
      case 'string':
        return generateRandomString(5, 15);

      case 'number':
        const min = options.min ?? 0;
        const max = options.max ?? 100;
        return Math.floor(Math.random() * (max - min + 1)) + min;

      case 'boolean':
        return Math.random() > 0.5;

      case 'date':
        const start = new Date(2020, 0, 1);
        const end = new Date();
        const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return randomDate.toISOString().split('T')[0];

      case 'email':
        const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'example.com'];
        const name = generateRandomString(3, 8).toLowerCase();
        const domain = domains[Math.floor(Math.random() * domains.length)];
        return `${name}@${domain}`;

      case 'name':
        const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'James', 'Olivia', 'Robert', 'Sophia'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
        return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;

      case 'address':
        const streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Elm St', 'Maple Dr', 'Cedar Ln', 'Birch Blvd'];
        const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'];
        const streetNum = Math.floor(Math.random() * 9999) + 1;
        const street = streets[Math.floor(Math.random() * streets.length)];
        const city = cities[Math.floor(Math.random() * cities.length)];
        const zip = Math.floor(Math.random() * 90000) + 10000;
        return `${streetNum} ${street}, ${city}, ${zip}`;

      case 'phone':
        const areaCode = Math.floor(Math.random() * 900) + 100;
        const exchange = Math.floor(Math.random() * 900) + 100;
        const number = Math.floor(Math.random() * 9000) + 1000;
        return `(${areaCode}) ${exchange}-${number}`;

      case 'uuid':
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });

      case 'custom':
        if (options.customValues && options.customValues.length > 0) {
          return options.customValues[Math.floor(Math.random() * options.customValues.length)];
        }
        return 'custom value';

      default:
        return 'unknown';
    }
  }, []);

  // Generate random string
  const generateRandomString = useCallback((min: number, max: number): string => {
    const length = Math.floor(Math.random() * (max - min + 1)) + min;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }, []);

  // Add new field
  const addField = useCallback(() => {
    const newField: FieldDefinition = {
      id: Math.random().toString(36).substr(2, 9),
      name: `field_${fields.length + 1}`,
      type: 'string',
    };
    setFields(prev => [...prev, newField]);
  }, [fields.length]);

  // Remove field
  const removeField = useCallback((id: string) => {
    setFields(prev => prev.filter(field => field.id !== id));
  }, []);

  // Update field
  const updateField = useCallback((id: string, updates: Partial<FieldDefinition>) => {
    setFields(prev => prev.map(field =>
      field.id === id ? { ...field, ...updates } : field
    ));
  }, []);

  // Load preset
  const loadPreset = useCallback((presetName: string) => {
    const preset = PRESETS[presetName as keyof typeof PRESETS];
    if (preset) {
      const presetFields: FieldDefinition[] = preset.map(field => ({
        id: Math.random().toString(36).substr(2, 9),
        ...field,
      }));
      setFields(presetFields);
      setSelectedPreset(presetName);
    }
  }, []);

  // Export data
  const exportData = useCallback(() => {
    if (generatedData.length === 0) {
      toast({
        title: "No data to export",
        description: "Generate data first before exporting",
        variant: "destructive",
      });
      return;
    }

    let content = '';
    const timestamp = new Date().toISOString().split('T')[0];

    switch (exportFormat) {
      case 'json':
        content = JSON.stringify(generatedData, null, 2);
        break;

      case 'csv':
        if (generatedData.length > 0) {
          const headers = Object.keys(generatedData[0]);
          content = headers.join(',') + '\n';
          content += generatedData.map(row =>
            headers.map(header => {
              const value = row[header];
              // Escape commas and quotes in CSV
              if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
              }
              return value;
            }).join(',')
          ).join('\n');
        }
        break;

      case 'sql':
        if (generatedData.length > 0) {
          const tableName = 'mock_data';
          const headers = Object.keys(generatedData[0]);
          const insertStatements = generatedData.map(row => {
            const values = headers.map(header => {
              const value = row[header];
              if (typeof value === 'string') {
                return `'${value.replace(/'/g, "''")}'`;
              } else if (typeof value === 'boolean') {
                return value ? '1' : '0';
              }
              return value;
            }).join(', ');
            return `INSERT INTO ${tableName} (${headers.join(', ')}) VALUES (${values});`;
          });
          content = insertStatements.join('\n');
        }
        break;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mock-data-${timestamp}.${exportFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Data exported",
      description: `Exported as ${exportFormat.toUpperCase()} file`,
    });
  }, [generatedData, exportFormat, toast]);

  // Copy to clipboard
  const copyToClipboard = useCallback(() => {
    if (generatedData.length === 0) return;

    const content = JSON.stringify(generatedData, null, 2);
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "JSON data copied successfully",
      });
    });
  }, [generatedData, toast]);

  const canGenerate = fields.length > 0 && recordCount > 0;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Mock Data Generator</h1>
        <p className="text-muted-foreground">
          Generate realistic test data for your applications and APIs
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schema">Schema Builder</TabsTrigger>
          <TabsTrigger value="preview" disabled={generatedData.length === 0}>
            Data Preview
          </TabsTrigger>
          <TabsTrigger value="export" disabled={generatedData.length === 0}>
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schema" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Controls */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Presets</Label>
                  <Select value={selectedPreset} onValueChange={loadPreset}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a preset..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User Data</SelectItem>
                      <SelectItem value="product">Product Data</SelectItem>
                      <SelectItem value="order">Order Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Number of Records</Label>
                  <Input
                    type="number"
                    min="1"
                    max="1000"
                    value={recordCount}
                    onChange={(e) => setRecordCount(parseInt(e.target.value) || 1)}
                  />
                </div>

                <Button onClick={addField} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Field
                </Button>

                <Button
                  onClick={generateMockData}
                  disabled={!canGenerate}
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Generate Data
                </Button>
              </CardContent>
            </Card>

            {/* Schema Builder */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Schema Definition
                </CardTitle>
                <CardDescription>
                  Define the structure of your mock data
                </CardDescription>
              </CardHeader>
              <CardContent>
                {fields.length === 0 ? (
                  <div className="text-center py-12">
                    <Database className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No fields defined</h3>
                    <p className="text-muted-foreground mb-4">
                      Add fields to define your data schema or choose a preset.
                    </p>
                    <Button onClick={addField}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Field
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-4 p-4 border rounded">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Field Name</Label>
                            <Input
                              value={field.name}
                              onChange={(e) => updateField(field.id, { name: e.target.value })}
                              placeholder="field_name"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Data Type</Label>
                            <Select
                              value={field.type}
                              onValueChange={(value: FieldDefinition['type']) =>
                                updateField(field.id, { type: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {FIELD_TYPES.map(type => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Options</Label>
                            {field.type === 'number' && (
                              <div className="flex gap-2">
                                <Input
                                  type="number"
                                  placeholder="Min"
                                  value={field.options?.min ?? ''}
                                  onChange={(e) => updateField(field.id, {
                                    options: { ...field.options, min: parseInt(e.target.value) || 0 }
                                  })}
                                  className="flex-1"
                                />
                                <Input
                                  type="number"
                                  placeholder="Max"
                                  value={field.options?.max ?? ''}
                                  onChange={(e) => updateField(field.id, {
                                    options: { ...field.options, max: parseInt(e.target.value) || 100 }
                                  })}
                                  className="flex-1"
                                />
                              </div>
                            )}
                            {field.type === 'custom' && (
                              <Textarea
                                placeholder="value1,value2,value3"
                                value={field.options?.customValues?.join(',') ?? ''}
                                onChange={(e) => updateField(field.id, {
                                  options: {
                                    ...field.options,
                                    customValues: e.target.value.split(',').map(v => v.trim()).filter(v => v)
                                  }
                                })}
                                className="min-h-[60px]"
                              />
                            )}
                            {field.type !== 'number' && field.type !== 'custom' && (
                              <div className="text-sm text-muted-foreground py-2">
                                No additional options needed
                              </div>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeField(field.id)}
                          className="shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Generated Data Preview
                  </CardTitle>
                  <CardDescription>
                    {generatedData.length} records generated
                  </CardDescription>
                </div>
                <Button onClick={copyToClipboard} variant="outline">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy JSON
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-auto">
                <pre className="text-sm bg-muted p-4 rounded">
                  {JSON.stringify(generatedData.slice(0, 5), null, 2)}
                  {generatedData.length > 5 && (
                    <div className="text-muted-foreground mt-2">
                      ... and {generatedData.length - 5} more records
                    </div>
                  )}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Options
              </CardTitle>
              <CardDescription>
                Choose your preferred export format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Export Format</Label>
                <Select value={exportFormat} onValueChange={(value: 'json' | 'csv' | 'sql') => setExportFormat(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="sql">SQL Insert Statements</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={exportData} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>

              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  {exportFormat === 'json' && 'Exports data as a JSON array of objects.'}
                  {exportFormat === 'csv' && 'Exports data as comma-separated values with headers.'}
                  {exportFormat === 'sql' && 'Exports data as SQL INSERT statements for database seeding.'}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}