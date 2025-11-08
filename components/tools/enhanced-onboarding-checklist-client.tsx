"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  CheckCircle2,
  Circle,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  Users,
  TrendingUp,
  Clock,
  AlertCircle,
  BarChart,
  Search,
  Filter,
  Bell,
  Calendar,
  FileText,
  FileSpreadsheet,
  FileImage,
  FileDown,
  GripVertical,
  Settings,
  Eye,
  EyeOff,
  RefreshCw,
  Zap,
  UserCheck,
  BellRing,
  MessageSquare,
  Activity,
  Target,
  PieChart,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CheckSquare,
  Square,
  X
} from "lucide-react";

interface ChecklistTask {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  completed: boolean;
  completedAt?: string;
  priority: "low" | "medium" | "high";
  category: string;
  dependencies?: string[];
  order: number;
}

interface ChecklistTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tasks: ChecklistTask[];
  createdAt: string;
  updatedAt: string;
  version: string;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTotalTime: string;
}

interface AssignedChecklist {
  id: string;
  templateId: string;
  templateName: string;
  assignedTo: string;
  assignedToName: string;
  assignedBy: string;
  dueDate: string;
  startDate: string;
  completedDate?: string;
  status: "not-started" | "in-progress" | "completed" | "overdue";
  progress: number;
  tasks: ChecklistTask[];
  notifications: boolean;
  comments: Comment[];
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  taskId?: string;
}

interface AdvancedAnalytics {
  totalChecklists: number;
  completedChecklists: number;
  completionRate: number;
  avgCompletionTime: number;
  activeUsers: number;
  overdueCount: number;
  completionTrend: Array<{ date: string; count: number }>;
  categoryDistribution: Array<{ category: string; count: number }>;
  priorityDistribution: Array<{ priority: string; count: number }>;
  teamPerformance: Array<{ user: string; completed: number; total: number }>;
}

interface UploadFile {
  file: File;
  progress: number;
  status: "uploading" | "processing" | "completed" | "error";
  preview?: any;
}

export default function EnhancedOnboardingChecklistClient() {
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  const [assignments, setAssignments] = useState<AssignedChecklist[]>([]);
  const [analytics, setAnalytics] = useState<AdvancedAnalytics | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragItemRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Enhanced state for new features
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showNotifications, setShowNotifications] = useState(false);
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>(["analytics"]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Template form state
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [templateCategory, setTemplateCategory] = useState("employee");
  const [templateDifficulty, setTemplateDifficulty] = useState("intermediate");
  const [templateTags, setTemplateTags] = useState("");
  const [tasks, setTasks] = useState<ChecklistTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [newTaskCategory, setNewTaskCategory] = useState("general");

  // Assignment form state
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [assigneeName, setAssigneeName] = useState("");
  const [assigneeEmail, setAssigneeEmail] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [enableNotifications, setEnableNotifications] = useState(true);

  // Notification state
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: "assignment" | "reminder" | "completion" | "overdue";
    message: string;
    timestamp: string;
    read: boolean;
  }>>([]);

  useEffect(() => {
    loadTemplates();
    loadAssignments();
    loadAnalytics();
    if (realTimeEnabled) {
      connectWebSocket();
    }
    loadNotifications();
  }, [realTimeEnabled]);

  useEffect(() => {
    // Auto-refresh data every 30 seconds when real-time is enabled
    if (realTimeEnabled) {
      const interval = setInterval(() => {
        loadTemplates();
        loadAssignments();
        loadAnalytics();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [realTimeEnabled]);

  const connectWebSocket = useCallback(() => {
    try {
      // In a real implementation, you would connect to your WebSocket server
      // For demo purposes, we'll simulate WebSocket updates
      const mockWebSocket = {
        readyState: WebSocket.OPEN,
        send: () => {},
        close: () => {},
      } as unknown as WebSocket;
      
      wsRef.current = mockWebSocket;
      
      // Simulate real-time updates
      const simulateUpdate = () => {
        if (Math.random() < 0.1) { // 10% chance every 5 seconds
          loadAssignments();
          loadAnalytics();
          showRealTimeNotification("Assignment progress updated");
        }
      };
      
      const interval = setInterval(simulateUpdate, 5000);
      return () => clearInterval(interval);
    } catch (error) {
      console.error("WebSocket connection failed:", error);
    }
  }, []);

  const showRealTimeNotification = (message: string) => {
    if (realTimeEnabled) {
      toast.success(message, {
        description: new Date().toLocaleTimeString(),
      });
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await fetch("/api/tools/enhanced-onboarding-checklist-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getTemplates" }),
      });

      const data = await response.json();
      if (data.templates) {
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error("Error loading templates:", error);
      toast.error("Failed to load templates");
    }
  };

  const loadAssignments = async () => {
    try {
      const response = await fetch("/api/tools/enhanced-onboarding-checklist-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAssignments" }),
      });

      const data = await response.json();
      if (data.assignments) {
        setAssignments(data.assignments);
      }
    } catch (error) {
      console.error("Error loading assignments:", error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await fetch("/api/tools/enhanced-onboarding-checklist-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAdvancedAnalytics" }),
      });

      const data = await response.json();
      if (data.analytics) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
    }
  };

  const loadNotifications = async () => {
    // Simulate loading notifications
    const mockNotifications = [
      {
        id: "1",
        type: "assignment" as const,
        message: "New checklist assigned to John Doe",
        timestamp: new Date(Date.now() - 300000).toISOString(),
        read: false,
      },
      {
        id: "2",
        type: "reminder" as const,
        message: "3 checklists due in 24 hours",
        timestamp: new Date(Date.now() - 600000).toISOString(),
        read: false,
      },
    ];
    setNotifications(mockNotifications);
  };

  // Enhanced file upload with multiple format support
  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;

    const newUploadFiles: UploadFile[] = [];
    
    Array.from(files).forEach((file) => {
      const uploadFile: UploadFile = {
        file,
        progress: 0,
        status: "uploading",
      };
      newUploadFiles.push(uploadFile);
    });

    setUploadFiles(prev => [...prev, ...newUploadFiles]);

    // Process files
    for (const uploadFile of newUploadFiles) {
      try {
        await processFile(uploadFile);
      } catch (error) {
        console.error("Error processing file:", error);
        uploadFile.status = "error";
        setUploadFiles(prev => prev.map(f => f === uploadFile ? uploadFile : f));
      }
    }
  };

  const processFile = async (uploadFile: UploadFile) => {
    const { file } = uploadFile;
    
    // Update progress
    uploadFile.progress = 25;
    setUploadFiles(prev => prev.map(f => f === uploadFile ? uploadFile : f));

    let importedTemplates: ChecklistTemplate[] = [];

    switch (file.type) {
      case "application/json":
        importedTemplates = await processJSONFile(file);
        break;
      case "text/csv":
        importedTemplates = await processCSVFile(file);
        break;
      case "application/vnd.ms-excel":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        importedTemplates = await processExcelFile(file);
        break;
      case "text/markdown":
        importedTemplates = await processMarkdownFile(file);
        break;
      case "application/pdf":
        importedTemplates = await processPDFFile(file);
        break;
      default:
        throw new Error(`Unsupported file type: ${file.type}`);
    }

    uploadFile.progress = 75;
    uploadFile.preview = importedTemplates;
    setUploadFiles(prev => prev.map(f => f === uploadFile ? uploadFile : f));

    // Save to server
    const response = await fetch("/api/tools/enhanced-onboarding-checklist-generator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "importTemplates",
        templates: importedTemplates,
      }),
    });

    const data = await response.json();
    if (data.templates) {
      setTemplates(data.templates);
      uploadFile.status = "completed";
      uploadFile.progress = 100;
      toast.success(`Imported ${importedTemplates.length} templates from ${file.name}`);
    }
  };

  const processJSONFile = async (file: File): Promise<ChecklistTemplate[]> => {
    const content = await file.text();
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : [data];
  };

  const processCSVFile = async (file: File): Promise<ChecklistTemplate[]> => {
    const content = await file.text();
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error("CSV must have at least header and one data row");
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const templates: ChecklistTemplate[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length < headers.length) continue;

      const template: ChecklistTemplate = {
        id: Date.now().toString() + i,
        name: values[0] || "Imported Template",
        description: values[1] || "",
        category: values[2] || "imported",
        tasks: [
          {
            id: `task-${i}`,
            title: values[3] || "Imported Task",
            description: values[4] || "",
            estimatedTime: values[5] || "1 hour",
            completed: false,
            priority: "medium",
            category: "general",
            order: 0,
          }
        ],
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        version: "1.0",
        tags: [],
        difficulty: "intermediate",
        estimatedTotalTime: values[5] || "1 hour",
      };
      templates.push(template);
    }

    return templates;
  };

  const processExcelFile = async (file: File): Promise<ChecklistTemplate[]> => {
    // For Excel files, we'll use a simple CSV-like approach
    // In a real implementation, you'd use a library like xlsx
    const content = await file.text();
    return processCSVFile(new File([content], file.name, { type: 'text/csv' }));
  };

  const processMarkdownFile = async (file: File): Promise<ChecklistTemplate[]> => {
    const content = await file.text();
    const lines = content.split('\n');
    
    const templates: ChecklistTemplate[] = [];
    let currentTemplate: Partial<ChecklistTemplate> = {};
    let currentTasks: ChecklistTask[] = [];

    for (const line of lines) {
      if (line.startsWith('# ')) {
        if (currentTemplate.name) {
          templates.push({
            id: Date.now().toString() + templates.length,
            name: currentTemplate.name,
            description: currentTemplate.description || "",
            category: currentTemplate.category || "imported",
            tasks: currentTasks,
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
            version: "1.0",
            tags: [],
            difficulty: "intermediate",
            estimatedTotalTime: "1 hour",
          });
        }
        currentTemplate = { name: line.substring(2).trim() };
        currentTasks = [];
      } else if (line.startsWith('## ')) {
        currentTemplate.description = line.substring(3).trim();
      } else if (line.startsWith('- ')) {
        const taskTitle = line.substring(2).trim();
        currentTasks.push({
          id: `task-${currentTasks.length}`,
          title: taskTitle,
          description: "",
          estimatedTime: "1 hour",
          completed: false,
          priority: "medium",
          category: "general",
          order: currentTasks.length,
        });
      }
    }

    // Add the last template
    if (currentTemplate.name) {
      templates.push({
        id: Date.now().toString() + templates.length,
        name: currentTemplate.name!,
        description: currentTemplate.description || "",
        category: currentTemplate.category || "imported",
        tasks: currentTasks,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        version: "1.0",
        tags: [],
        difficulty: "intermediate",
        estimatedTotalTime: "1 hour",
      });
    }

    return templates;
  };

  const processPDFFile = async (file: File): Promise<ChecklistTemplate[]> => {
    // For PDF files, we would typically extract text first
    // For demo purposes, we'll create a template based on the filename
    const template: ChecklistTemplate = {
      id: Date.now().toString(),
      name: file.name.replace('.pdf', '').replace(/[-_]/g, ' '),
      description: "Imported from PDF document",
      category: "imported",
      tasks: [
        {
          id: "task-1",
          title: "Review uploaded document",
          description: "Review and analyze the uploaded PDF content",
          estimatedTime: "30 minutes",
          completed: false,
          priority: "high",
          category: "review",
          order: 0,
        }
      ],
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      version: "1.0",
      tags: ["pdf-import"],
      difficulty: "beginner",
      estimatedTotalTime: "30 minutes",
    };

    return [template];
  };

  const addTask = () => {
    if (!newTaskTitle) {
      toast.error("Task title is required");
      return;
    }

    const task: ChecklistTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDescription,
      estimatedTime: newTaskTime,
      completed: false,
      priority: newTaskPriority,
      category: newTaskCategory,
      order: tasks.length,
    };

    setTasks([...tasks, task]);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskTime("");
    setNewTaskPriority("medium");
    setNewTaskCategory("general");
    toast.success("Task added");
  };

  const removeTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  // Drag and drop reordering
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    dragItemRef.current = taskId;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetTaskId: string) => {
    e.preventDefault();
    const draggedTaskId = dragItemRef.current;
    if (!draggedTaskId || draggedTaskId === targetTaskId) return;

    const draggedTaskIndex = tasks.findIndex(t => t.id === draggedTaskId);
    const targetTaskIndex = tasks.findIndex(t => t.id === targetTaskId);

    const newTasks = [...tasks];
    const draggedTask = newTasks.splice(draggedTaskIndex, 1)[0];
    newTasks.splice(targetTaskIndex, 0, draggedTask);

    // Update order numbers
    newTasks.forEach((task, index) => {
      task.order = index;
    });

    setTasks(newTasks);
    dragItemRef.current = null;
    toast.success("Task order updated");
  };

  const handleDragEnd = () => {
    dragItemRef.current = null;
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOverZone = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeaveZone = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const createOrUpdateTemplate = async () => {
    if (!templateName || tasks.length === 0) {
      toast.error("Template name and at least one task required");
      return;
    }

    setIsProcessing(true);

    try {
      const tags = templateTags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const estimatedTotalTime = tasks.reduce((total, task) => {
        const timeStr = task.estimatedTime.toLowerCase();
        const match = timeStr.match(/(\d+)/);
        return total + (match ? parseInt(match[1]) : 0);
      }, 0);

      const response = await fetch("/api/tools/enhanced-onboarding-checklist-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: editingTemplateId ? "updateTemplate" : "createTemplate",
          templateId: editingTemplateId,
          name: templateName,
          description: templateDescription,
          category: templateCategory,
          difficulty: templateDifficulty,
          tags,
          tasks,
          estimatedTotalTime: `${estimatedTotalTime} hours`,
        }),
      });

      const data = await response.json();
      if (data.template) {
        await loadTemplates();
        toast.success(`Template ${editingTemplateId ? "updated" : "created"} successfully`);
        resetTemplateForm();
      }
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Failed to save template");
    } finally {
      setIsProcessing(false);
    }
  };

  const editTemplate = (template: ChecklistTemplate) => {
    setEditingTemplateId(template.id);
    setTemplateName(template.name);
    setTemplateDescription(template.description);
    setTemplateCategory(template.category);
    setTemplateDifficulty(template.difficulty);
    setTemplateTags(template.tags.join(', '));
    setTasks(template.tasks);
    setActiveTab("create");
  };

  const deleteTemplate = async (templateId: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    try {
      const response = await fetch("/api/tools/enhanced-onboarding-checklist-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "deleteTemplate",
          templateId,
        }),
      });

      if (response.ok) {
        await loadTemplates();
        toast.success("Template deleted");
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Failed to delete template");
    }
  };

  const assignChecklist = async () => {
    if (!selectedTemplateId || !assigneeName || !assigneeEmail || !dueDate) {
      toast.error("All fields are required");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/tools/enhanced-onboarding-checklist-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "assignChecklist",
          templateId: selectedTemplateId,
          assigneeName,
          assigneeEmail,
          dueDate,
          notifications: enableNotifications,
        }),
      });

      const data = await response.json();
      if (data.assignment) {
        await loadAssignments();
        await loadAnalytics();
        toast.success("Checklist assigned successfully");
        resetAssignmentForm();
        
        // Show notification
        if (enableNotifications) {
          showRealTimeNotification(`Checklist assigned to ${assigneeName}`);
        }
      }
    } catch (error) {
      console.error("Error assigning checklist:", error);
      toast.error("Failed to assign checklist");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleTask = async (assignmentId: string, taskId: string) => {
    try {
      const response = await fetch("/api/tools/enhanced-onboarding-checklist-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggleTask",
          assignmentId,
          taskId,
        }),
      });

      const data = await response.json();
      if (data.assignment) {
        await loadAssignments();
        await loadAnalytics();
        showRealTimeNotification("Task status updated");
      }
    } catch (error) {
      console.error("Error toggling task:", error);
      toast.error("Failed to update task");
    }
  };

  const addComment = async (assignmentId: string, taskId: string | undefined, content: string) => {
    try {
      const response = await fetch("/api/tools/enhanced-onboarding-checklist-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "addComment",
          assignmentId,
          taskId,
          content,
        }),
      });

      const data = await response.json();
      if (data.success) {
        await loadAssignments();
        toast.success("Comment added");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const resetTemplateForm = () => {
    setEditingTemplateId(null);
    setTemplateName("");
    setTemplateDescription("");
    setTemplateCategory("employee");
    setTemplateDifficulty("intermediate");
    setTemplateTags("");
    setTasks([]);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskTime("");
    setNewTaskPriority("medium");
    setNewTaskCategory("general");
  };

  const resetAssignmentForm = () => {
    setSelectedTemplateId("");
    setAssigneeName("");
    setAssigneeEmail("");
    setDueDate("");
    setEnableNotifications(true);
  };

  const exportTemplates = (format: "json" | "csv" | "excel" | "pdf") => {
    switch (format) {
      case "json":
        const jsonData = JSON.stringify(templates, null, 2);
        const jsonBlob = new Blob([jsonData], { type: "application/json" });
        const jsonUrl = URL.createObjectURL(jsonBlob);
        const jsonLink = document.createElement("a");
        jsonLink.href = jsonUrl;
        jsonLink.download = `checklist-templates-${new Date().toISOString().split('T')[0]}.json`;
        jsonLink.click();
        URL.revokeObjectURL(jsonUrl);
        break;
        
      case "csv":
        const csvHeaders = "Name,Description,Category,Task Title,Task Description,Estimated Time\n";
        const csvRows = templates.flatMap(template => 
          template.tasks.map(task => 
            `"${template.name}","${template.description}","${template.category}","${task.title}","${task.description}","${task.estimatedTime}"`
          )
        ).join('\n');
        const csvBlob = new Blob([csvHeaders + csvRows], { type: "text/csv" });
        const csvUrl = URL.createObjectURL(csvBlob);
        const csvLink = document.createElement("a");
        csvLink.href = csvUrl;
        csvLink.download = `checklist-templates-${new Date().toISOString().split('T')[0]}.csv`;
        csvLink.click();
        URL.revokeObjectURL(csvUrl);
        break;
        
      case "excel":
        // For Excel export, we'd use a library like xlsx
        toast.info("Excel export would be implemented with xlsx library");
        break;
        
      case "pdf":
        // For PDF export, we'd use libraries like jsPDF or react-pdf
        toast.info("PDF export would be implemented with jsPDF or react-pdf");
        break;
    }
    
    toast.success(`Templates exported as ${format.toUpperCase()}`);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      "not-started": { className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300", label: "Not Started" },
      "in-progress": { className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300", label: "In Progress" },
      "completed": { className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300", label: "Completed" },
      "overdue": { className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300", label: "Overdue" },
    };
    return variants[status] || variants["not-started"];
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      "low": { className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300", label: "Low" },
      "medium": { className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300", label: "Medium" },
      "high": { className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300", label: "High" },
    };
    return variants[priority] || variants["medium"];
  };

  const getDifficultyBadge = (difficulty: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      "beginner": { className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300", label: "Beginner" },
      "intermediate": { className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300", label: "Intermediate" },
      "advanced": { className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300", label: "Advanced" },
    };
    return variants[difficulty] || variants["intermediate"];
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === "all" || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.templateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.assignedToName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || assignment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Real-time status indicator */}
      {realTimeEnabled && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <Zap className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-800 dark:text-green-200">Real-time updates enabled</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRealTimeEnabled(!realTimeEnabled)}
            className="ml-auto text-green-600"
          >
            <EyeOff className="w-3 h-3 mr-1" />
            Disable
          </Button>
        </div>
      )}

      {/* Enhanced Analytics Dashboard */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{analytics.totalChecklists}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{analytics.completedChecklists}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completion</p>
                  <p className="text-2xl font-bold">{analytics.completionRate}%</p>
                </div>
                <BarChart className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Time</p>
                  <p className="text-2xl font-bold">{analytics.avgCompletionTime}d</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Users</p>
                  <p className="text-2xl font-bold">{analytics.activeUsers}</p>
                </div>
                <Users className="w-8 h-8 text-pink-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">{analytics.overdueCount}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Main Interface */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Enhanced Onboarding Checklist Generator
                {realTimeEnabled && <Zap className="w-4 h-4 text-green-600" />}
              </CardTitle>
              <CardDescription>
                Advanced checklist management with real-time collaboration, multiple file formats, and enhanced analytics
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="w-4 h-4" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">
                    {notifications.filter(n => !n.read).length}
                  </Badge>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRealTimeEnabled(!realTimeEnabled)}
              >
                {realTimeEnabled ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {realTimeEnabled ? "Disable" : "Enable"} Real-time
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Enhanced Tab Navigation */}
            <div className="flex items-center justify-between mb-4">
              <TabsList className="grid grid-cols-6 w-full max-w-4xl">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="create">Create</TabsTrigger>
                <TabsTrigger value="assign">Assign</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                {/* Enhanced Upload Controls */}
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".json,.csv,.xlsx,.xls,.md,.pdf"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                  
                  <Select onValueChange={(format) => exportTemplates(format as any)}>
                    <SelectTrigger className="w-[120px]">
                      <Download className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Export" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 flex-1">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates, assignments, or users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="contractor">Contractor</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notifications Panel */}
            {showNotifications && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BellRing className="w-5 h-5" />
                    Notifications ({notifications.filter(n => !n.read).length} unread)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`p-3 border rounded-lg ${
                          notification.read ? "bg-muted/50" : "bg-blue-50 dark:bg-blue-900/20"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{notification.message}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {assignments.slice(0, 5).map(assignment => (
                        <div key={assignment.id} className="flex items-center gap-3 p-2 border rounded">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{assignment.templateName}</p>
                            <p className="text-xs text-muted-foreground">
                              Assigned to {assignment.assignedToName}
                            </p>
                          </div>
                          <Badge className={getStatusBadge(assignment.status).className}>
                            {getStatusBadge(assignment.status).label}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="h-20 flex-col"
                        onClick={() => setActiveTab("create")}
                      >
                        <Plus className="w-6 h-6 mb-2" />
                        Create Template
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex-col"
                        onClick={() => setActiveTab("assign")}
                      >
                        <UserCheck className="w-6 h-6 mb-2" />
                        Assign Checklist
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex-col"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-6 h-6 mb-2" />
                        Import Templates
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex-col"
                        onClick={() => setActiveTab("analytics")}
                      >
                        <PieChart className="w-6 h-6 mb-2" />
                        View Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Enhanced Templates Tab */}
            <TabsContent value="templates" className="space-y-4 mt-6">
              {filteredTemplates.length === 0 ? (
                <Alert>
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    {searchQuery || filterCategory !== "all" 
                      ? "No templates match your search criteria."
                      : "No templates created yet. Create your first template in the Create Template tab."
                    }
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.map(template => {
                    const difficultyBadge = getDifficultyBadge(template.difficulty);
                    return (
                      <Card key={template.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{template.name}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary">{template.category}</Badge>
                                <Badge className={difficultyBadge.className}>
                                  {difficultyBadge.label}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <CardDescription className="line-clamp-2">
                            {template.description}
                          </CardDescription>
                          
                          {/* Tags */}
                          {template.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {template.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardHeader>
                        
                        <CardContent className="space-y-3">
                          <div>
                            <p className="text-sm font-semibold mb-2">
                              Tasks ({template.tasks.length}) - Est: {template.estimatedTotalTime}
                            </p>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {template.tasks.slice(0, 3).map(task => (
                                <div key={task.id} className="text-xs flex items-start gap-2">
                                  <div className={`w-2 h-2 rounded-full mt-1 ${
                                    task.priority === 'high' ? 'bg-red-500' :
                                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}></div>
                                  <span className="line-clamp-1">{task.title}</span>
                                </div>
                              ))}
                              {template.tasks.length > 3 && (
                                <p className="text-xs text-muted-foreground">
                                  +{template.tasks.length - 3} more tasks
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2 pt-3 border-t">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => editTemplate(template)}
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteTemplate(template.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>

                          <div className="text-xs text-muted-foreground">
                            Updated: {template.updatedAt}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Enhanced Create Template Tab */}
            <TabsContent value="create" className="space-y-6 mt-6">
              {/* Drag and Drop Upload Zone */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-muted-foreground/25"
                }`}
                onDrop={handleDropZoneDrop}
                onDragOver={handleDragOverZone}
                onDragLeave={handleDragLeaveZone}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Drag files here or click to upload</h3>
                <p className="text-muted-foreground mb-4">
                  Supports JSON, CSV, Excel, Markdown, and PDF files
                </p>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Choose Files
                </Button>
              </div>

              {/* Upload Progress */}
              {uploadFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Upload Progress</h4>
                  {uploadFiles.map((uploadFile, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded">
                      <FileText className="w-5 h-5" />
                      <div className="flex-1">
                        <p className="font-medium">{uploadFile.file.name}</p>
                        <Progress value={uploadFile.progress} className="h-2 mt-1" />
                      </div>
                      <Badge variant={
                        uploadFile.status === "completed" ? "default" :
                        uploadFile.status === "error" ? "destructive" : "secondary"
                      }>
                        {uploadFile.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}

              {/* Template Creation Form */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {editingTemplateId ? "Edit Template" : "Create New Template"}
                </h3>
                {editingTemplateId && (
                  <Button variant="outline" size="sm" onClick={resetTemplateForm}>
                    Cancel Edit
                  </Button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="templateName">Template Name *</Label>
                    <Input
                      id="templateName"
                      placeholder="e.g., Software Engineer Onboarding"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="templateDescription">Description</Label>
                    <Textarea
                      id="templateDescription"
                      placeholder="Describe this onboarding checklist..."
                      value={templateDescription}
                      onChange={(e) => setTemplateDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={templateCategory} onValueChange={setTemplateCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employee">Employee Onboarding</SelectItem>
                          <SelectItem value="customer">Customer Onboarding</SelectItem>
                          <SelectItem value="vendor">Vendor Onboarding</SelectItem>
                          <SelectItem value="contractor">Contractor Onboarding</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select value={templateDifficulty} onValueChange={setTemplateDifficulty}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="templateTags">Tags (comma-separated)</Label>
                    <Input
                      id="templateTags"
                      placeholder="e.g., engineering, technical, 2024"
                      value={templateTags}
                      onChange={(e) => setTemplateTags(e.target.value)}
                    />
                  </div>

                  {/* Enhanced Task List */}
                  <div className="p-4 border rounded-lg bg-muted max-h-96 overflow-y-auto">
                    <h4 className="font-semibold mb-3">Tasks ({tasks.length})</h4>
                    {tasks.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No tasks added yet</p>
                    ) : (
                      <div className="space-y-2">
                        {tasks
                          .sort((a, b) => a.order - b.order)
                          .map(task => (
                            <div
                              key={task.id}
                              className="p-3 bg-background rounded border-2 border-transparent hover:border-blue-200 transition-colors"
                              draggable
                              onDragStart={(e) => handleDragStart(e, task.id)}
                              onDragOver={handleDragOver}
                              onDrop={(e) => handleDrop(e, task.id)}
                              onDragEnd={handleDragEnd}
                              onDragEnter={handleDragEnter}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1">
                                  <GripVertical className="w-4 h-4 text-muted-foreground mt-1 cursor-move" />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="font-medium text-sm">{task.title}</p>
                                      <Badge className={getPriorityBadge(task.priority).className} variant="outline">
                                        {getPriorityBadge(task.priority).label}
                                      </Badge>
                                    </div>
                                    {task.description && (
                                      <p className="text-xs text-muted-foreground mb-1">{task.description}</p>
                                    )}
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <Clock className="w-3 h-3" />
                                      {task.estimatedTime}
                                      <Badge variant="outline" className="text-xs">
                                        {task.category}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeTask(task.id)}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Add Task</h4>
                  
                  <div>
                    <Label htmlFor="taskTitle">Task Title *</Label>
                    <Input
                      id="taskTitle"
                      placeholder="e.g., Complete security training"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="taskDescription">Task Description</Label>
                    <Textarea
                      id="taskDescription"
                      placeholder="Additional details..."
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="taskTime">Estimated Time</Label>
                      <Input
                        id="taskTime"
                        placeholder="e.g., 1 hour, 30 minutes"
                        value={newTaskTime}
                        onChange={(e) => setNewTaskTime(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="taskPriority">Priority</Label>
                      <Select value={newTaskPriority} onValueChange={(value) => setNewTaskPriority(value as any)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="taskCategory">Task Category</Label>
                    <Input
                      id="taskCategory"
                      placeholder="e.g., security, training, setup"
                      value={newTaskCategory}
                      onChange={(e) => setNewTaskCategory(e.target.value)}
                    />
                  </div>

                  <Button onClick={addTask} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>

                  <div className="pt-4 border-t">
                    <Button
                      onClick={createOrUpdateTemplate}
                      disabled={isProcessing}
                      className="w-full"
                      size="lg"
                    >
                      {isProcessing && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                      {editingTemplateId ? "Update Template" : "Create Template"}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Enhanced Assign Checklist Tab */}
            <TabsContent value="assign" className="space-y-4 mt-6">
              <div className="max-w-2xl mx-auto space-y-4">
                <div>
                  <Label htmlFor="selectTemplate">Select Template *</Label>
                  <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a checklist template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name} ({template.tasks.length} tasks, {template.estimatedTotalTime})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="assigneeName">Assignee Name *</Label>
                  <Input
                    id="assigneeName"
                    placeholder="e.g., John Doe"
                    value={assigneeName}
                    onChange={(e) => setAssigneeName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="assigneeEmail">Assignee Email *</Label>
                  <Input
                    id="assigneeEmail"
                    type="email"
                    placeholder="e.g., john@example.com"
                    value={assigneeEmail}
                    onChange={(e) => setAssigneeEmail(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <input
                    type="checkbox"
                    id="enableNotifications"
                    checked={enableNotifications}
                    onChange={(e) => setEnableNotifications(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="enableNotifications" className="text-sm">
                    Enable real-time notifications for this assignment
                  </Label>
                </div>

                <Button
                  onClick={assignChecklist}
                  disabled={isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                  <Plus className="w-4 h-4 mr-2" />
                  Assign Checklist
                </Button>
              </div>
            </TabsContent>

            {/* Enhanced Progress Tab */}
            <TabsContent value="progress" className="space-y-4 mt-6">
              {filteredAssignments.length === 0 ? (
                <Alert>
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    {searchQuery || filterStatus !== "all"
                      ? "No assignments match your search criteria."
                      : "No assigned checklists yet. Assign a checklist from the Assign Checklist tab."
                    }
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {filteredAssignments.map(assignment => {
                    const statusBadge = getStatusBadge(assignment.status);
                    return (
                      <Card key={assignment.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{assignment.templateName}</CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">
                                {assignment.assignedToName} ({assignment.assignedTo})
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge className={statusBadge.className}>
                                  {statusBadge.label}
                                </Badge>
                                {assignment.notifications && (
                                  <Badge variant="outline" className="text-xs">
                                    <Bell className="w-3 h-3 mr-1" />
                                    Notifications On
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Progress</span>
                              <span className="font-semibold">{assignment.progress}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full transition-all"
                                style={{ width: `${assignment.progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Started</p>
                              <p className="font-semibold">{assignment.startDate}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Due</p>
                              <p className="font-semibold">{assignment.dueDate}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Tasks</p>
                              <p className="font-semibold">
                                {assignment.tasks.filter(t => t.completed).length}/{assignment.tasks.length}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="font-semibold text-sm">Tasks:</p>
                            {assignment.tasks.map(task => (
                              <div
                                key={task.id}
                                className="flex items-start gap-3 p-2 border rounded hover:bg-muted transition-colors cursor-pointer"
                                onClick={() => toggleTask(assignment.id, task.id)}
                              >
                                {task.completed ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                ) : (
                                  <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className={`text-sm ${task.completed ? "line-through text-muted-foreground" : "font-medium"}`}>
                                      {task.title}
                                    </p>
                                    <Badge className={getPriorityBadge(task.priority).className} variant="outline">
                                      {task.priority}
                                    </Badge>
                                  </div>
                                  {task.description && (
                                    <p className="text-xs text-muted-foreground">{task.description}</p>
                                  )}
                                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    {task.estimatedTime}
                                    <Badge variant="outline" className="text-xs">
                                      {task.category}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Comments Section */}
                          <div className="space-y-2">
                            <p className="font-semibold text-sm flex items-center gap-2">
                              <MessageSquare className="w-4 h-4" />
                              Comments
                            </p>
                            {assignment.comments && assignment.comments.length > 0 ? (
                              <div className="space-y-2">
                                {assignment.comments.map(comment => (
                                  <div key={comment.id} className="p-2 bg-muted rounded text-sm">
                                    <p className="font-medium">{comment.author}</p>
                                    <p>{comment.content}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {new Date(comment.timestamp).toLocaleString()}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">No comments yet</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Enhanced Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6 mt-6">
              <div className="grid gap-6">
                {/* Completion Trend */}
                {analytics?.completionTrend && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Completion Trend
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analytics.completionTrend.slice(-7).map((trend, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-20 text-sm text-muted-foreground">{trend.date}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <div className="h-2 bg-green-200 rounded-full" style={{ width: `${trend.count * 10}px` }}></div>
                                <span className="text-sm">{trend.count} completions</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Category Distribution */}
                  {analytics?.categoryDistribution && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Category Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {analytics.categoryDistribution.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${
                                  index === 0 ? "bg-blue-500" :
                                  index === 1 ? "bg-green-500" :
                                  index === 2 ? "bg-yellow-500" : "bg-purple-500"
                                }`}></div>
                                <span className="text-sm">{item.category}</span>
                              </div>
                              <span className="font-semibold">{item.count}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Priority Distribution */}
                  {analytics?.priorityDistribution && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Priority Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {analytics.priorityDistribution.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${
                                  item.priority === 'high' ? "bg-red-500" :
                                  item.priority === 'medium' ? "bg-yellow-500" : "bg-green-500"
                                }`}></div>
                                <span className="text-sm capitalize">{item.priority}</span>
                              </div>
                              <span className="font-semibold">{item.count}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Team Performance */}
                {analytics?.teamPerformance && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Team Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analytics.teamPerformance.map((member, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{member.user}</span>
                              <span>{member.completed}/{member.total} completed</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${(member.completed / member.total) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}