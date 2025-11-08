"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CSVParseResult, CSVValidationResult, CSVTransformResult } from "@/types";
import { Upload, Download, Play, FileText, CheckCircle, XCircle, AlertTriangle, Settings, Filter } from "lucide-react";

// Dynamic import for papaparse (removed - now using API)
const Papa = null; // Not used anymore - operations moved to API

const CSVTSVEncoderDecoderClient: React.FC = () => {
  const [inputData, setInputData] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [hasHeaders, setHasHeaders] = useState(true);
  const [encoding, setEncoding] = useState("utf-8");
  const [quoteChar, setQuoteChar] = useState('"');
  const [escapeChar, setEscapeChar] = useState('"');
  const [skipEmptyLines, setSkipEmptyLines] = useState(true);
  const [result, setResult] = useState<CSVParseResult | null>(null);
  const [validationResult, setValidationResult] = useState<CSVValidationResult | null>(null);
  const [transformResult, setTransformResult] = useState<CSVTransformResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Transformation options
  const [filterQuery, setFilterQuery] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsProcessing(true);

    try {
      const text = await file.text();
      setInputData(text);
      await parseCSV(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to read file");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const parseCSV = useCallback(async (csvText: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/tools/csv-tsv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'parse',
          data: csvText,
          options: {
            delimiter,
            hasHeaders,
            quoteChar,
            escapeChar,
            skipEmptyLines,
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'CSV parsing failed');
      }

      const result = await response.json();
      setResult(result.result);

      // Auto-detect columns if headers exist
      if (hasHeaders && result.result.data.length > 0) {
        setSelectedColumns(Object.keys(result.result.data[0]));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse CSV");
    } finally {
      setIsProcessing(false);
    }
  }, [delimiter, hasHeaders, quoteChar, escapeChar, skipEmptyLines]);

  const validateData = useCallback(async () => {
    if (!result) return;

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/tools/csv-tsv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'validate',
          data: result.data,
          options: {
            hasHeaders,
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Validation failed');
      }

      const apiResult = await response.json();
      setValidationResult(apiResult.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Validation failed");
    } finally {
      setIsProcessing(false);
    }
  }, [result, hasHeaders]);

  const transformData = useCallback(async () => {
    if (!result) return;

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/tools/csv-tsv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'transform',
          data: result.data,
          options: {
            hasHeaders,
            selectedColumns: selectedColumns.length > 0 ? selectedColumns : undefined,
            filterQuery,
            sortColumn,
            sortDirection,
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Transformation failed');
      }

      const apiResult = await response.json();
      setTransformResult(apiResult.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transformation failed");
    } finally {
      setIsProcessing(false);
    }
  }, [result, selectedColumns, filterQuery, sortColumn, sortDirection, hasHeaders]);

  const exportData = useCallback(async (format: "csv" | "tsv" | "json") => {
    if (!result && !transformResult) return;

    const dataToExport = transformResult?.data || result?.data;
    if (!dataToExport) return;

    try {
      let content = "";
      let filename = "";
      let mimeType = "";

      if (format === "json") {
        content = JSON.stringify(dataToExport, null, 2);
        filename = "exported_data.json";
        mimeType = "application/json";
      } else {
        // Use API for CSV/TSV export
        const delimiter = format === "csv" ? "," : "\t";

        const response = await fetch('/api/tools/csv-tsv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'unparse',
            data: dataToExport,
            options: {
              delimiter,
              hasHeaders,
              quoteChar,
              escapeChar,
            }
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Export failed');
        }

        const apiResult = await response.json();
        content = apiResult.result;
        filename = `exported_data.${format}`;
        mimeType = format === "csv" ? "text/csv" : "text/tab-separated-values";
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    }
  }, [result, transformResult, hasHeaders, quoteChar, escapeChar]);

  const formatSize = useCallback((bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }, []);

  const previewData = useMemo(() => {
    const data = transformResult?.data || result?.data;
    if (!data || data.length === 0) return [];

    // Show first 10 rows for preview
    return data.slice(0, 10);
  }, [result, transformResult]);

  const columnNames = useMemo(() => {
    if (!result || !hasHeaders) return [];
    return Object.keys(result.data[0] || {});
  }, [result, hasHeaders]);

  return (
    <div className="space-y-6">
      {/* Configuration Section */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>
            Configure CSV/TSV parsing options and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="delimiter">Delimiter</Label>
              <Select value={delimiter} onValueChange={setDelimiter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=",">Comma (,)</SelectItem>
                  <SelectItem value=";">Semicolon (;)</SelectItem>
                  <SelectItem value="\t">Tab</SelectItem>
                  <SelectItem value="|">Pipe (|)</SelectItem>
                  <SelectItem value=" ">Space</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="encoding">Encoding</Label>
              <Select value={encoding} onValueChange={setEncoding}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utf-8">UTF-8</SelectItem>
                  <SelectItem value="utf-16">UTF-16</SelectItem>
                  <SelectItem value="iso-8859-1">ISO-8859-1</SelectItem>
                  <SelectItem value="windows-1252">Windows-1252</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quote-char">Quote Character</Label>
              <Input
                id="quote-char"
                value={quoteChar}
                onChange={(e) => setQuoteChar(e.target.value)}
                maxLength={1}
              />
            </div>

            <div>
              <Label htmlFor="escape-char">Escape Character</Label>
              <Input
                id="escape-char"
                value={escapeChar}
                onChange={(e) => setEscapeChar(e.target.value)}
                maxLength={1}
              />
            </div>
          </div>

          <div className="flex items-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="has-headers"
                checked={hasHeaders}
                onCheckedChange={(checked) => setHasHeaders(checked === true)}
              />
              <Label htmlFor="has-headers">Has Headers</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="skip-empty"
                checked={skipEmptyLines}
                onCheckedChange={(checked) => setSkipEmptyLines(checked === true)}
              />
              <Label htmlFor="skip-empty">Skip Empty Lines</Label>
            </div>
          </div>

          <div className="flex space-x-2 mt-4">
            <Button onClick={() => parseCSV(inputData)} disabled={!inputData.trim() || isProcessing}>
              <Play className="h-4 w-4 mr-2" />
              {isProcessing ? "Processing..." : "Parse Data"}
            </Button>
            {result && (
              <Button variant="outline" onClick={validateData} disabled={isProcessing}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Validate
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Data Input</CardTitle>
          <CardDescription>
            Upload a CSV/TSV file or paste data directly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file-upload">Upload File</Label>
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileUpload}
                accept=".csv,.tsv,.txt"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="data-input">Or Paste Data</Label>
              <Textarea
                id="data-input"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder="Paste your CSV/TSV data here..."
                rows={8}
                className="font-mono text-sm mt-1"
              />
            </div>

            {uploadedFile && (
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm">{uploadedFile.name}</span>
                <Badge variant="secondary">{formatSize(uploadedFile.size)}</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Parse Results</CardTitle>
            <CardDescription>
              Parsed data summary and statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <Label className="text-sm font-medium">Rows</Label>
                <p className="text-2xl font-bold">{result.rows}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Columns</Label>
                <p className="text-2xl font-bold">{result.columns}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Errors</Label>
                <p className="text-2xl font-bold text-red-600">{(result.errors || []).length}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="flex items-center space-x-2">
                  {(result.errors || []).length === 0 ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-600">Valid</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="text-yellow-600">Warnings</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Data Preview */}
            <div className="mb-6">
              <Label className="text-sm font-medium mb-2 block">Data Preview (First 10 rows)</Label>
              <ScrollArea className="h-64 w-full border rounded">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {hasHeaders ? (
                        columnNames.map((col, index) => (
                          <TableHead key={index}>{col}</TableHead>
                        ))
                      ) : (
                        Array.from({ length: result.columns }, (_, i) => (
                          <TableHead key={i}>Column {i + 1}</TableHead>
                        ))
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((row: any, rowIndex: number) => (
                      <TableRow key={rowIndex}>
                        {hasHeaders ? (
                          columnNames.map((col, colIndex) => (
                            <TableCell key={colIndex} className="max-w-xs truncate">
                              {String(row[col] || "")}
                            </TableCell>
                          ))
                        ) : (
                          (row as any[]).map((cell, cellIndex) => (
                            <TableCell key={cellIndex} className="max-w-xs truncate">
                              {String(cell || "")}
                            </TableCell>
                          ))
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>

            {/* Export Options */}
            <div className="flex space-x-2">
              <Button onClick={() => exportData("csv")}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" onClick={() => exportData("tsv")}>
                <Download className="h-4 w-4 mr-2" />
                Export TSV
              </Button>
              <Button variant="outline" onClick={() => exportData("json")}>
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transformation Section */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Data Transformation</CardTitle>
            <CardDescription>
              Filter, sort, and transform your data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="filter">Filter Query</Label>
                <Input
                  id="filter"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Search across all columns..."
                />
              </div>

              {hasHeaders && (
                <div>
                  <Label htmlFor="sort-column">Sort Column</Label>
                  <div className="flex space-x-2">
                    <Select value={sortColumn} onValueChange={setSortColumn}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select column..." />
                      </SelectTrigger>
                      <SelectContent>
                        {columnNames.map((col) => (
                          <SelectItem key={col} value={col}>{col}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={sortDirection} onValueChange={(value: "asc" | "desc") => setSortDirection(value)}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">↑ Asc</SelectItem>
                        <SelectItem value="desc">↓ Desc</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            {hasHeaders && (
              <div className="mb-4">
                <Label className="text-sm font-medium mb-2 block">Select Columns</Label>
                <div className="flex flex-wrap gap-2">
                  {columnNames.map((col) => (
                    <div key={col} className="flex items-center space-x-2">
                      <Checkbox
                        id={`col-${col}`}
                        checked={selectedColumns.includes(col)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedColumns(prev => [...prev, col]);
                          } else {
                            setSelectedColumns(prev => prev.filter(c => c !== col));
                          }
                        }}
                      />
                      <Label htmlFor={`col-${col}`} className="text-sm">{col}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={transformData} disabled={isProcessing}>
              <Filter className="h-4 w-4 mr-2" />
              Apply Transformations
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Transformation Results */}
      {transformResult && (
        <Card>
          <CardHeader>
            <CardTitle>Transformation Results</CardTitle>
            <CardDescription>
              Transformed data with applied filters and sorting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label className="text-sm font-medium">Original Rows</Label>
                <p className="text-lg font-semibold">{transformResult.originalRows}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Filtered Rows</Label>
                <p className="text-lg font-semibold">{transformResult.transformedRows}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Reduction</Label>
                <p className="text-lg font-semibold">
                  {((1 - transformResult.transformedRows / transformResult.originalRows) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            {transformResult.appliedFilters.length > 0 && (
              <div className="mb-4">
                <Label className="text-sm font-medium">Applied Filters:</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {transformResult.appliedFilters.map((filter: string, index: number) => (
                    <Badge key={index} variant="secondary">{filter}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <Button onClick={() => exportData("csv")}>
                <Download className="h-4 w-4 mr-2" />
                Export Transformed CSV
              </Button>
              <Button variant="outline" onClick={() => exportData("json")}>
                <Download className="h-4 w-4 mr-2" />
                Export Transformed JSON
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Results */}
      {validationResult && (
        <Card>
          <CardHeader>
            <CardTitle>Validation Results</CardTitle>
            <CardDescription>
              Data validation summary and detected issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              {validationResult.isValid ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-green-600 font-semibold">Data is valid</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-600 font-semibold">
                    {validationResult.errors.length} validation errors found
                  </span>
                </>
              )}
            </div>

            {validationResult.errors.length > 0 && (
              <div className="mb-4">
                <Label className="text-sm font-medium mb-2 block">Validation Errors:</Label>
                <ScrollArea className="h-32 w-full border rounded">
                  <div className="p-2 space-y-1">
                    {validationResult.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-600">
                        Row {error.row}, Column "{error.column}": {error.message}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            <div>
              <Label className="text-sm font-medium mb-2 block">Detected Data Types:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {Object.entries(validationResult.dataTypes).map(([column, types]) => (
                  <div key={column} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm font-medium">{column}:</span>
                    <div className="flex flex-wrap gap-1">
                      {Array.from(types as Set<string>).map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CSVTSVEncoderDecoderClient;