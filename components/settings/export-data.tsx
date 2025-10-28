'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Download,
  FileText,
  Database,
  BarChart3,
  Calendar,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

interface ExportOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
}

interface ExportResult {
  success: boolean;
  fileName: string;
  data: any;
  message: string;
}

export default function ExportData() {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [exportedItems, setExportedItems] = useState<Map<string, ExportResult>>(new Map());
  const [availableExports, setAvailableExports] = useState<ExportOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const defaultExportOptions: ExportOption[] = [
    {
      id: 'usage-data',
      title: 'Usage Data',
      description: 'Export your tool usage statistics and analytics',
      icon: BarChart3,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950'
    },
    {
      id: 'api-calls',
      title: 'API Call History',
      description: 'Export your API call logs and history',
      icon: Database,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950'
    },
    {
      id: 'tool-sessions',
      title: 'Tool Sessions',
      description: 'Export your tool usage sessions and timestamps',
      icon: FileText,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950'
    },
    {
      id: 'account-data',
      title: 'Account Data',
      description: 'Export your profile and account information',
      icon: Calendar,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950'
    }
  ];

  useEffect(() => {
    fetchAvailableExports();
  }, []);

  const fetchAvailableExports = async () => {
    try {
      const response = await fetch('/api/export/status');
      if (response.ok) {
        const data = await response.json();
        setAvailableExports(data.availableExports || defaultExportOptions);
      } else {
        setAvailableExports(defaultExportOptions);
      }
    } catch (error) {
      console.error('Failed to fetch available exports:', error);
      setAvailableExports(defaultExportOptions);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (exportId: string) => {
    setIsExporting(exportId);

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: exportId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Export failed');
      }

      const result: ExportResult = await response.json();
      setExportedItems(prev => new Map(prev.set(exportId, result)));

      toast({
        title: "Export completed",
        description: result.message,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export data",
        variant: "destructive",
      });
    } finally {
      setIsExporting(null);
    }
  };

  const downloadFile = (exportId: string) => {
    const exportResult = exportedItems.get(exportId);
    if (!exportResult) return;

    try {
      const blob = new Blob([JSON.stringify(exportResult.data, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = exportResult.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: `${exportResult.fileName} has been downloaded`,
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download the file",
        variant: "destructive",
      });
    }
  };

  const handleBulkExport = async () => {
    const exportPromises = availableExports.map(option => handleExport(option.id));
    await Promise.allSettled(exportPromises);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Your Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            Loading export options...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Your Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your data will be exported in JSON format. All exports are processed securely and contain only your data.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableExports.map((option) => {
            const exportResult = exportedItems.get(option.id);
            const isCurrentlyExporting = isExporting === option.id;

            return (
              <Card key={option.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${option.bgColor}`}>
                      <option.icon className={`h-5 w-5 ${option.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{option.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {option.description}
                      </p>
                    </div>
                  </div>

                  {isCurrentlyExporting && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Exporting...</span>
                        <span>Processing</span>
                      </div>
                      <Progress value={undefined} className="animate-pulse" />
                    </div>
                  )}

                  <div className="flex gap-2">
                    {!exportResult ? (
                      <Button
                        onClick={() => handleExport(option.id)}
                        disabled={isCurrentlyExporting}
                        className="flex-1"
                        size="sm"
                      >
                        {isCurrentlyExporting ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Exporting...
                          </>
                        ) : (
                          'Export'
                        )}
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={() => downloadFile(option.id)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Ready
                        </Badge>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="border-t pt-6">
          <h4 className="font-medium mb-3">Bulk Export</h4>
          <div className="flex gap-3">
            <Button
              onClick={handleBulkExport}
              disabled={isExporting !== null}
              variant="outline"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Exporting All...
                </>
              ) : (
                'Export All Data'
              )}
            </Button>
            <Button variant="outline">
              Schedule Regular Exports
            </Button>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Data Privacy</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Your data is processed securely and never shared with third parties</li>
            <li>• Exports contain only your personal data and usage statistics</li>
            <li>• You can delete your account and all associated data at any time</li>
            <li>• All exports are available for download for 30 days</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}