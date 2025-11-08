"use client";

import React, { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toaster";
import { Upload, FileText, Image, Video, Archive, X, Eye, Download } from "lucide-react";

interface FileUploadProps {
  onFileUpload: (file: File, content: string) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  multiple?: boolean;
  showPreview?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

interface UploadedFile {
  file: File;
  content: string;
  size: number;
  type: string;
  preview?: string;
}

export default function FileUploadComponent({
  onFileUpload,
  acceptedTypes = ["text/*", "application/json", "application/xml", "text/csv", "text/plain", "application/pdf", "image/*"],
  maxSize = 50,
  multiple = false,
  showPreview = true,
  title = "File Upload",
  description = "Upload files to process with the tool",
  className = ""
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="w-4 h-4" />;
    if (type.startsWith("video/")) return <Video className="w-4 h-4" />;
    if (type.includes("zip") || type.includes("tar") || type.includes("rar")) return <Archive className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size exceeds ${maxSize}MB limit`;
    }

    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.includes("*")) {
        return file.type.startsWith(type.replace("*", ""));
      }
      return file.type === type;
    });

    if (!isValidType) {
      return `File type ${file.type} is not supported`;
    }

    return null;
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const content = event.target?.result as string;
        resolve(content);
      };
      
      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      if (file.type.startsWith("image/")) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const handleFileUpload = useCallback(async (files: FileList) => {
    setUploading(true);
    setUploadProgress(0);
    
    const newFiles: UploadedFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        // Validate file
        const validationError = validateFile(file);
        if (validationError) {
          toast({
            title: "Upload Error",
            description: `${file.name}: ${validationError}`,
            variant: "destructive",
          });
          continue;
        }

        // Read file content
        const content = await readFileContent(file);
        
        // Create uploaded file object
        const uploadedFile: UploadedFile = {
          file,
          content,
          size: file.size,
          type: file.type,
          preview: file.type.startsWith("image/") ? content : undefined
        };
        
        newFiles.push(uploadedFile);
        
        // Call the upload handler
        onFileUpload(file, content);
        
        // Update progress
        setUploadProgress(((i + 1) / files.length) * 100);
        
      } catch (error) {
        toast({
          title: "Upload Error",
          description: `Failed to read ${file.name}`,
          variant: "destructive",
        });
      }
    }
    
    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
      toast({
        title: "Upload Success",
        description: `${newFiles.length} file(s) uploaded successfully`,
      });
    }
    
    setUploading(false);
    setUploadProgress(0);
    
    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onFileUpload, toast, maxSize, acceptedTypes]);

  const removeFile = useCallback((index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const downloadFile = useCallback((file: UploadedFile) => {
    const blob = new Blob([file.content], { type: file.type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="w-5 h-5" />
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={acceptedTypes.join(",")}
            onChange={(e) => {
              if (e.target.files) {
                handleFileUpload(e.target.files);
              }
            }}
            className="hidden"
            id="file-upload"
          />
          
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="space-y-4">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-lg font-medium">
                  Click to upload files or drag and drop
                </p>
                <p className="text-sm text-muted-foreground">
                  Supported: {acceptedTypes.join(", ")} (Max {maxSize}MB)
                </p>
              </div>
            </div>
          </label>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <Label>Uploaded Files</Label>
            <div className="space-y-2">
              {uploadedFiles.map((uploadedFile, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getFileIcon(uploadedFile.type)}
                    <div>
                      <p className="font-medium text-sm">{uploadedFile.file.name}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {uploadedFile.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(uploadedFile.size)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {showPreview && uploadedFile.content && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Open content in a modal or new window
                          const modal = document.createElement("div");
                          modal.style.cssText = `
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: rgba(0,0,0,0.8);
                            z-index: 1000;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                          `;
                          modal.innerHTML = `
                            <div style="background: white; padding: 20px; max-width: 80%; max-height: 80%; overflow: auto;">
                              <h3>${uploadedFile.file.name}</h3>
                              <pre style="background: #f5f5f5; padding: 10px; overflow: auto;">${
                                uploadedFile.content.length > 1000 
                                  ? uploadedFile.content.substring(0, 1000) + "..." 
                                  : uploadedFile.content
                              }</pre>
                              <button onclick="this.parentElement.parentElement.remove()">Close</button>
                            </div>
                          `;
                          document.body.appendChild(modal);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadFile(uploadedFile)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}