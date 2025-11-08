"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SerializationResult, ProtobufConfig, AvroConfig, MessagePackConfig } from "@/types";
import { Upload, Download, Play, Code, FileText, Zap, CheckCircle, XCircle } from "lucide-react";

// Dynamic imports for serialization libraries
// Note: Serialization operations are now handled server-side via API routes

const SerializationConvertersClient: React.FC = () => {
  const [inputData, setInputData] = useState("");
  const [schemaDefinition, setSchemaDefinition] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<"protobuf" | "avro" | "msgpack">("protobuf");
  const [operation, setOperation] = useState<"serialize" | "deserialize">("serialize");
  const [result, setResult] = useState<SerializationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    const file = files[0];

    if (operation === "serialize") {
      // For serialization, expect JSON files
      if (!file.type.includes('json') && !file.name.endsWith('.json')) {
        setError("Please upload a JSON file for serialization");
        return;
      }

      try {
        const text = await file.text();
        setInputData(text);
        setUploadedFile(file);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to read file");
      }
    } else {
      // For deserialization, accept any file
      setUploadedFile(file);
      setIsProcessing(true);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        await detectAndDeserialize(uint8Array);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to process file");
      } finally {
        setIsProcessing(false);
      }
    }
  }, [operation]);

  // Protobuf specific state
  const [protobufConfig, setProtobufConfig] = useState<ProtobufConfig>({
    protoDefinition: "",
    messageType: "",
  });

  // Avro specific state
  const [avroConfig, setAvroConfig] = useState<AvroConfig>({
    schema: null,
    registryUrl: "",
  });

  // MessagePack specific state
  const [msgpackConfig, setMsgpackConfig] = useState<MessagePackConfig>({
    options: {},
  });

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Try to detect format and deserialize
      if (operation === "deserialize") {
        await detectAndDeserialize(uint8Array);
      } else {
        setError("Please select deserialize operation when uploading binary files");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process file");
    } finally {
      setIsProcessing(false);
    }
  }, [operation]);

  const detectAndDeserialize = useCallback(async (data: Uint8Array) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Try to detect and deserialize using API
      const response = await fetch('/api/tools/serialization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'detect',
          data: Array.from(data)
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Detection failed');
      }

      const result = await response.json();
      const { format, data: deserializedData } = result;

      setResult({
        format,
        serializedData: data,
        size: data.length,
        schema: format === "avro" ? avroConfig.schema : undefined,
        validationErrors: [],
      });
      setInputData(JSON.stringify(deserializedData, null, 2));
      setSelectedFormat(format);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to detect serialization format");
    } finally {
      setIsProcessing(false);
    }
  }, [avroConfig.schema]);

  const serializeData = useCallback(async () => {
    if (!inputData.trim()) {
      setError("Please enter data to serialize");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      let parsedData: any;
      try {
        parsedData = JSON.parse(inputData);
      } catch {
        setError("Invalid JSON data");
        return;
      }

      let result: SerializationResult;

      switch (selectedFormat) {
        case "protobuf":
          result = await serializeProtobuf(parsedData);
          break;
        case "avro":
          result = await serializeAvro(parsedData);
          break;
        case "msgpack":
          result = await serializeMessagePack(parsedData);
          break;
        default:
          throw new Error("Unsupported format");
      }

      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Serialization failed");
    } finally {
      setIsProcessing(false);
    }
  }, [inputData, selectedFormat, protobufConfig, avroConfig, msgpackConfig]);

  const deserializeData = useCallback(async () => {
    if (!uploadedFile && !result?.serializedData) {
      setError("Please upload a file or have serialized data to deserialize");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const dataToDeserialize = uploadedFile
        ? new Uint8Array(await uploadedFile.arrayBuffer())
        : result!.serializedData;

      let deserializedData: any;

      switch (selectedFormat) {
        case "protobuf":
          deserializedData = await deserializeProtobuf(dataToDeserialize);
          break;
        case "avro":
          deserializedData = await deserializeAvro(dataToDeserialize);
          break;
        case "msgpack":
          deserializedData = await deserializeMessagePack(dataToDeserialize);
          break;
        default:
          throw new Error("Unsupported format");
      }

      setInputData(JSON.stringify(deserializedData, null, 2));
      setResult({
        format: selectedFormat,
        serializedData: dataToDeserialize,
        size: dataToDeserialize.length,
        schema: selectedFormat === "avro" ? avroConfig.schema : undefined,
        validationErrors: [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deserialization failed");
    } finally {
      setIsProcessing(false);
    }
  }, [uploadedFile, result, selectedFormat, protobufConfig, avroConfig]);

  const serializeProtobuf = useCallback(async (data: any): Promise<SerializationResult> => {
    const response = await fetch('/api/tools/serialization', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'serialize',
        format: 'protobuf',
        data,
        schema: protobufConfig.protoDefinition,
        messageType: protobufConfig.messageType
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Protobuf serialization failed');
    }

    const result = await response.json();

    return {
      format: "protobuf",
      serializedData: new Uint8Array(result.result),
      size: result.result.length,
      schema: protobufConfig,
      validationErrors: [],
    };
  }, [protobufConfig]);

  const deserializeProtobuf = useCallback(async (data: Uint8Array): Promise<any> => {
    const response = await fetch('/api/tools/serialization', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'deserialize',
        format: 'protobuf',
        data: Array.from(data),
        schema: protobufConfig.protoDefinition,
        messageType: protobufConfig.messageType
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Protobuf deserialization failed');
    }

    const result = await response.json();
    return result.result;
  }, [protobufConfig]);

  const serializeAvro = useCallback(async (data: any): Promise<SerializationResult> => {
    const response = await fetch('/api/tools/serialization', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'serialize',
        format: 'avro',
        data,
        schema: avroConfig.schema
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Avro serialization failed');
    }

    const result = await response.json();

    return {
      format: "avro",
      serializedData: new Uint8Array(result.result),
      size: result.result.length,
      schema: avroConfig.schema,
      validationErrors: [],
    };
  }, [avroConfig]);

  const deserializeAvro = useCallback(async (data: Uint8Array): Promise<any> => {
    const response = await fetch('/api/tools/serialization', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'deserialize',
        format: 'avro',
        data: Array.from(data),
        schema: avroConfig.schema
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Avro deserialization failed');
    }

    const result = await response.json();
    return result.result;
  }, [avroConfig]);

  const serializeMessagePack = useCallback(async (data: any): Promise<SerializationResult> => {
    const response = await fetch('/api/tools/serialization', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'serialize',
        format: 'msgpack',
        data
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'MessagePack serialization failed');
    }

    const result = await response.json();

    return {
      format: "msgpack",
      serializedData: new Uint8Array(result.result),
      size: result.result.length,
      schema: undefined,
      validationErrors: [],
    };
  }, []);

  const deserializeMessagePack = useCallback(async (data: Uint8Array): Promise<any> => {
    const response = await fetch('/api/tools/serialization', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'deserialize',
        format: 'msgpack',
        data: Array.from(data)
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'MessagePack deserialization failed');
    }

    const result = await response.json();
    return result.result;
  }, []);

  const downloadResult = useCallback(() => {
    if (!result) return;

    const extension = {
      protobuf: ".pb",
      avro: ".avro",
      msgpack: ".msgpack",
    }[result.format];

    const blob = new Blob([result.serializedData as any], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `serialized_data${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [result]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add toast notification here
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  }, []);

  const formatSize = useCallback((bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }, []);

  const schemaExamples = useMemo(() => ({
    protobuf: `syntax = "proto3";

message Person {
  string name = 1;
  int32 age = 2;
  repeated string hobbies = 3;
}`,
    avro: `{
  "type": "record",
  "name": "Person",
  "fields": [
    {"name": "name", "type": "string"},
    {"name": "age", "type": "int"},
    {"name": "hobbies", "type": {"type": "array", "items": "string"}}
  ]
}`,
    msgpack: "MessagePack doesn't require a schema definition"
  }), []);

  const dataExamples = useMemo(() => ({
    protobuf: `{
  "name": "John Doe",
  "age": 30,
  "hobbies": ["reading", "coding", "gaming"]
}`,
    avro: `{
  "name": "John Doe",
  "age": 30,
  "hobbies": ["reading", "coding", "gaming"]
}`,
    msgpack: `{
  "name": "John Doe",
  "age": 30,
  "hobbies": ["reading", "coding", "gaming"]
}`
  }), []);

  return (
    <div className="space-y-6">
      {/* Configuration Section */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>
            Configure serialization format and operation type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="format">Format</Label>
              <Select value={selectedFormat} onValueChange={(value: "protobuf" | "avro" | "msgpack") => setSelectedFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="protobuf">Protocol Buffers</SelectItem>
                  <SelectItem value="avro">Apache Avro</SelectItem>
                  <SelectItem value="msgpack">MessagePack</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="operation">Operation</Label>
              <Select value={operation} onValueChange={(value: "serialize" | "deserialize") => setOperation(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="serialize">Serialize (JSON → Binary)</SelectItem>
                  <SelectItem value="deserialize">Deserialize (Binary → JSON)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={operation === "serialize" ? serializeData : deserializeData}
                disabled={isProcessing || (operation === "serialize" && !inputData.trim()) || (operation === "deserialize" && !uploadedFile && !result)}
                className="w-full"
              >
                {isProcessing ? "Processing..." : operation === "serialize" ? "Serialize" : "Deserialize"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schema Definition Section */}
      <Card>
        <CardHeader>
          <CardTitle>Schema Definition</CardTitle>
          <CardDescription>
            Define the data structure schema for {selectedFormat}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedFormat} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="protobuf">Protobuf</TabsTrigger>
              <TabsTrigger value="avro">Avro</TabsTrigger>
              <TabsTrigger value="msgpack">MessagePack</TabsTrigger>
            </TabsList>

            <TabsContent value="protobuf" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="proto-definition">Proto Definition</Label>
                  <Textarea
                    id="proto-definition"
                    value={protobufConfig.protoDefinition}
                    onChange={(e) => setProtobufConfig(prev => ({ ...prev, protoDefinition: e.target.value }))}
                    placeholder={schemaExamples.protobuf}
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="message-type">Message Type</Label>
                  <Input
                    id="message-type"
                    value={protobufConfig.messageType}
                    onChange={(e) => setProtobufConfig(prev => ({ ...prev, messageType: e.target.value }))}
                    placeholder="e.g., Person"
                  />
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Example Schema:</h4>
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                      {schemaExamples.protobuf}
                    </pre>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="avro" className="space-y-4">
              <div>
                <Label htmlFor="avro-schema">Avro Schema (JSON)</Label>
                <Textarea
                  id="avro-schema"
                  value={avroConfig.schema ? JSON.stringify(avroConfig.schema, null, 2) : ""}
                  onChange={(e) => {
                    try {
                      const schema = JSON.parse(e.target.value);
                      setAvroConfig(prev => ({ ...prev, schema }));
                    } catch {
                      // Invalid JSON, keep as string for now
                    }
                  }}
                  placeholder={schemaExamples.avro}
                  rows={10}
                  className="font-mono text-sm"
                />
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Example Schema:</h4>
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                    {schemaExamples.avro}
                  </pre>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="msgpack" className="space-y-4">
              <div className="p-8 text-center text-muted-foreground">
                <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>MessagePack doesn't require a predefined schema.</p>
                <p className="text-sm mt-2">Data structures are preserved automatically.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Data Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Data Input</CardTitle>
          <CardDescription>
            {operation === "serialize" ? "Enter JSON data to serialize or upload a JSON file" : "Upload binary file to deserialize or paste JSON data"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {operation === "serialize" ? (
            <div className="space-y-4">
              {/* File Upload for Serialization */}
              <div>
                <Label htmlFor="file-upload-serialize">Upload JSON File (Optional)</Label>
                <div
                  className={`mt-1 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragOver
                      ? 'border-primary bg-primary/5'
                      : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className={`h-8 w-8 mx-auto mb-2 ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className="text-sm text-muted-foreground mb-2">
                    {isDragOver ? 'Drop your JSON file here' : 'Drag & drop a JSON file here, or click to browse'}
                  </p>
                  <Input
                    id="file-upload-serialize"
                    type="file"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;

                      try {
                        const text = await file.text();
                        setInputData(text);
                        setUploadedFile(file);
                      } catch (err) {
                        setError(err instanceof Error ? err.message : "Failed to read file");
                      }
                    }}
                    accept=".json,application/json"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('file-upload-serialize')?.click()}
                  >
                    Browse Files
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload a JSON file to populate the input field automatically
                </p>
              </div>

              <Separator />

              {/* JSON Text Input */}
              <div>
                <Label htmlFor="json-input">JSON Data</Label>
                <Textarea
                  id="json-input"
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  placeholder={dataExamples[selectedFormat]}
                  rows={8}
                  className="font-mono text-sm"
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="text-sm text-muted-foreground">
                    Enter valid JSON data that matches your schema
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputData(dataExamples[selectedFormat])}
                  >
                    Load Example
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Upload for Deserialization */}
              <div>
                <Label htmlFor="file-upload">Upload Binary File</Label>
                <div
                  className={`mt-1 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragOver
                      ? 'border-primary bg-primary/5'
                      : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className={`h-8 w-8 mx-auto mb-2 ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className="text-sm text-muted-foreground mb-2">
                    {isDragOver ? 'Drop your binary file here' : 'Drag & drop a binary file here, or click to browse'}
                  </p>
                  <Input
                    id="file-upload"
                    type="file"
                    onChange={handleFileUpload}
                    accept="*/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Browse Files
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload a serialized binary file (.pb, .avro, .msgpack) to deserialize
                </p>
              </div>

              {uploadedFile && (
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <Upload className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{uploadedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatSize(uploadedFile.size)} • {uploadedFile.type || 'Unknown type'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    File Ready
                  </Badge>
                </div>
              )}

              <Separator />

              {/* JSON Output Display */}
              <div>
                <Label htmlFor="json-output">Deserialized JSON Data</Label>
                <Textarea
                  id="json-output"
                  value={inputData}
                  readOnly
                  placeholder="Deserialized JSON data will appear here..."
                  rows={8}
                  className="font-mono text-sm bg-muted"
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="text-sm text-muted-foreground">
                    Result of deserializing the uploaded binary file
                  </div>
                  {inputData && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(inputData)}
                    >
                      <Code className="h-4 w-4 mr-2" />
                      Copy JSON
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              Serialization results and validation information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <Label className="text-sm font-medium">Format</Label>
                <p className="text-lg font-semibold capitalize">{result.format}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Size</Label>
                <p className="text-lg font-semibold">{formatSize(result.size)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="flex items-center space-x-2">
                  {(result.validationErrors || []).length === 0 ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-600">Valid</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-red-600">Errors</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {(result.validationErrors || []).length > 0 && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>
                  <ul className="list-disc list-inside">
                    {(result.validationErrors || []).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex space-x-2">
              <Button onClick={downloadResult}>
                <Download className="h-4 w-4 mr-2" />
                Download Binary
              </Button>
              <Button variant="outline" onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}>
                <Code className="h-4 w-4 mr-2" />
                Copy Metadata
              </Button>
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

export default SerializationConvertersClient;