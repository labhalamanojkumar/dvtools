"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Target, CheckCircle, AlertTriangle, XCircle, Download, Plus, Edit, Trash2, Users, Calendar, FileText } from "lucide-react";

interface ChecklistItem {
  id: string;
  phase: string;
  category: string;
  title: string;
  description: string;
  completed: boolean;
  notes: string;
  severity: "info" | "low" | "medium" | "high" | "critical";
}

interface Issue {
  id: string;
  title: string;
  description: string;
  severity: "info" | "low" | "medium" | "high" | "critical";
  status: "open" | "in-progress" | "resolved" | "closed";
  assignee: string;
  dueDate: string;
  tags: string[];
  evidence: string[];
  checklistItemId?: string;
}

interface Assessment {
  id: string;
  name: string;
  description: string;
  target: string;
  startDate: string;
  endDate: string;
  status: "planning" | "active" | "completed" | "on-hold";
  checklist: ChecklistItem[];
  issues: Issue[];
  progress: number;
}

const PENTEST_PHASES = [
  "Reconnaissance",
  "Scanning",
  "Gaining Access",
  "Maintaining Access",
  "Covering Tracks",
  "Reporting"
];

const CHECKLIST_TEMPLATES = {
  owasp: [
    {
      phase: "Reconnaissance",
      category: "Information Gathering",
      title: "Passive Information Gathering",
      description: "Collect publicly available information about the target",
      severity: "info" as const,
    },
    {
      phase: "Reconnaissance",
      category: "Information Gathering",
      title: "Active Information Gathering",
      description: "Perform active reconnaissance techniques",
      severity: "low" as const,
    },
    {
      phase: "Scanning",
      category: "Network Scanning",
      title: "Port Scanning",
      description: "Identify open ports and services",
      severity: "low" as const,
    },
    {
      phase: "Scanning",
      category: "Vulnerability Scanning",
      title: "Vulnerability Assessment",
      description: "Scan for known vulnerabilities",
      severity: "medium" as const,
    },
    {
      phase: "Gaining Access",
      category: "Web Application Testing",
      title: "SQL Injection Testing",
      description: "Test for SQL injection vulnerabilities",
      severity: "high" as const,
    },
    {
      phase: "Gaining Access",
      category: "Web Application Testing",
      title: "XSS Testing",
      description: "Test for cross-site scripting vulnerabilities",
      severity: "high" as const,
    },
    {
      phase: "Maintaining Access",
      category: "Post Exploitation",
      title: "Privilege Escalation",
      description: "Attempt to gain higher privileges",
      severity: "critical" as const,
    },
    {
      phase: "Covering Tracks",
      category: "Cleanup",
      title: "Log Cleanup",
      description: "Remove evidence of penetration testing activities",
      severity: "medium" as const,
    },
    {
      phase: "Reporting",
      category: "Documentation",
      title: "Executive Summary",
      description: "Create executive-level summary of findings",
      severity: "info" as const,
    },
  ],
};

export default function PenetrationTestChecklistClient() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadLog, setUploadLog] = useState<string[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    name: "",
    description: "",
    target: "",
    startDate: "",
    endDate: "",
  });

  const createAssessment = () => {
    if (!newAssessment.name || !newAssessment.target) return;

    const assessment: Assessment = {
      id: Date.now().toString(),
      name: newAssessment.name,
      description: newAssessment.description,
      target: newAssessment.target,
      startDate: newAssessment.startDate,
      endDate: newAssessment.endDate,
      status: "planning",
      checklist: CHECKLIST_TEMPLATES.owasp.map(item => ({
        ...item,
        id: `${item.phase}-${item.title}`.toLowerCase().replace(/\s+/g, "-"),
        completed: false,
        notes: "",
      })),
      issues: [],
      progress: 0,
    };

    setAssessments(prev => [...prev, assessment]);
    setCurrentAssessment(assessment);
    setNewAssessment({ name: "", description: "", target: "", startDate: "", endDate: "" });
    setShowCreateDialog(false);
  };

  const updateChecklistItem = (itemId: string, updates: Partial<ChecklistItem>) => {
    if (!currentAssessment) return;

    const updatedChecklist = currentAssessment.checklist.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );

    const completedCount = updatedChecklist.filter(item => item.completed).length;
    const progress = (completedCount / updatedChecklist.length) * 100;

    const updatedAssessment = {
      ...currentAssessment,
      checklist: updatedChecklist,
      progress,
    };

    setCurrentAssessment(updatedAssessment);
    setAssessments(prev => prev.map(a => a.id === currentAssessment.id ? updatedAssessment : a));
  };

  const addIssue = (checklistItemId?: string) => {
    if (!currentAssessment) return;

    const newIssue: Issue = {
      id: Date.now().toString(),
      title: "",
      description: "",
      severity: "medium",
      status: "open",
      assignee: "",
      dueDate: "",
      tags: [],
      evidence: [],
      checklistItemId,
    };

    const updatedAssessment = {
      ...currentAssessment,
      issues: [...currentAssessment.issues, newIssue],
    };

    setCurrentAssessment(updatedAssessment);
    setAssessments(prev => prev.map(a => a.id === currentAssessment.id ? updatedAssessment : a));
  };

  const updateIssue = (issueId: string, updates: Partial<Issue>) => {
    if (!currentAssessment) return;

    const updatedIssues = currentAssessment.issues.map(issue =>
      issue.id === issueId ? { ...issue, ...updates } : issue
    );

    const updatedAssessment = {
      ...currentAssessment,
      issues: updatedIssues,
    };

    setCurrentAssessment(updatedAssessment);
    setAssessments(prev => prev.map(a => a.id === currentAssessment.id ? updatedAssessment : a));
  };

  const deleteIssue = (issueId: string) => {
    if (!currentAssessment) return;

    const updatedIssues = currentAssessment.issues.filter(issue => issue.id !== issueId);

    const updatedAssessment = {
      ...currentAssessment,
      issues: updatedIssues,
    };

    setCurrentAssessment(updatedAssessment);
    setAssessments(prev => prev.map(a => a.id === currentAssessment.id ? updatedAssessment : a));
  };

  const exportAssessment = () => {
    if (!currentAssessment) return;

    const dataStr = JSON.stringify(currentAssessment, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `${currentAssessment.name.replace(/\s+/g, "-")}-assessment.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-600";
      case "high": return "bg-red-500";
      case "medium": return "bg-orange-500";
      case "low": return "bg-yellow-500";
      case "info": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-red-500";
      case "in-progress": return "bg-orange-500";
      case "resolved": return "bg-green-500";
      case "closed": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Assessment Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Penetration Test Assessments
              </CardTitle>
              <CardDescription>
                Create and manage penetration testing assessments with structured checklists and issue tracking
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <input id="pt-upload-input" type="file" accept="application/json,text/*" className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploadLog([]);
                  setUploading(true);
                  try {
                    const form = new FormData();
                    form.append('file', file);

                    const res = await fetch('/api/tools/penetration-test-checklist/upload', { method: 'POST', body: form });
                    if (!res.ok) {
                      setUploadLog(prev => [...prev, `server-error: ${res.status} ${res.statusText}`]);
                      setUploading(false);
                      return;
                    }
                    const contentType = res.headers.get('content-type') || '';
                    if (!contentType.includes('text/event-stream') && !contentType.includes('application/json') && !contentType.includes('ndjson')) {
                      setUploadLog(prev => [...prev, `unexpected-content-type: ${contentType}`]);
                    }

                    // If server returned JSON (not a stream), parse it directly and handle error/assessment
                    if (contentType.includes('application/json') && !contentType.includes('text/event-stream')) {
                      try {
                        const j = await res.json();
                        if (j.error) {
                          setUploadLog(prev => [...prev, `server-error-json: ${String(j.error)}`]);
                          setUploading(false);
                          return;
                        }
                        if (j.assessment) {
                          setUploadLog(prev => [...prev, `[assessment] ${j.assessment.name || j.assessment.id}`]);
                          setAssessments(prev => [...prev, j.assessment]);
                          setCurrentAssessment(j.assessment);
                          setUploading(false);
                          return;
                        }
                        setUploadLog(prev => [...prev, `server-json: ${JSON.stringify(j)}`]);
                      } catch (err) {
                        setUploadLog(prev => [...prev, `json-parse-failed: ${String(err)}`]);
                      }
                      setUploading(false);
                      return;
                    }

                    if (!res.body) {
                      setUploadLog(prev => [...prev, 'No response body from server']);
                      setUploading(false);
                      return;
                    }

                    const reader = res.body.getReader();
                    const decoder = new TextDecoder();
                    let buf = '';

                    while (true) {
                      const { done, value } = await reader.read();
                      if (done) break;
                      buf += decoder.decode(value, { stream: true });
                      const parts = buf.split(/\n/);
                      buf = parts.pop() || '';

                      for (const line of parts) {
                        if (!line) continue;
                        try {
                          const obj = JSON.parse(line);
                          if (obj.type === 'progress') {
                            setUploadLog(prev => [...prev, `[progress] ${obj.message || JSON.stringify(obj)}`]);
                          } else if (obj.type === 'issue') {
                            const issue = obj.issue as Issue;
                            setUploadLog(prev => [...prev, `[issue] ${issue.title || issue.description || issue.id}`]);
                            setAssessments(prev => {
                              if (currentAssessment) {
                                const updated = prev.map(a => a.id === currentAssessment.id ? { ...a, issues: [...a.issues, issue] } : a);
                                setCurrentAssessment(prevA => prevA ? { ...prevA, issues: [...prevA.issues, issue] } : prevA);
                                return updated;
                              }
                              const importedAssessment: Assessment = {
                                id: `import-${Date.now()}`,
                                name: file.name || 'Imported Assessment',
                                description: 'Imported issues',
                                target: '',
                                startDate: new Date().toISOString(),
                                endDate: '',
                                status: 'planning',
                                checklist: [],
                                issues: [issue],
                                progress: 0,
                              };
                              setCurrentAssessment(importedAssessment);
                              return [...prev, importedAssessment];
                            });
                          } else if (obj.type === 'assessment') {
                            const asmt = obj.assessment as Assessment;
                            setUploadLog(prev => [...prev, `[assessment] ${asmt.name || asmt.id}`]);
                            setAssessments(prev => [...prev, asmt]);
                            setCurrentAssessment(asmt);
                          } else if (obj.type === 'done') {
                            setUploadLog(prev => [...prev, `[done] ${obj.message || 'done'}`]);
                          } else if (obj.type === 'error') {
                            setUploadLog(prev => [...prev, `[error] ${obj.message || JSON.stringify(obj)}`]);
                          } else {
                            setUploadLog(prev => [...prev, JSON.stringify(obj)]);
                          }
                        } catch (err) {
                          setUploadLog(prev => [...prev, `parse-error: ${String(err)} - ${line.slice(0, 200)}`]);
                        }
                      }
                    }

                    if (buf) {
                      try { const obj = JSON.parse(buf); setUploadLog(prev => [...prev, JSON.stringify(obj)]); } catch (e) {}
                    }

                    setUploadLog(prev => [...prev, 'Upload processing finished']);
                  } catch (err: any) {
                    setUploadLog(prev => [...prev, `upload-failed: ${String(err)}`]);
                  } finally {
                    setUploading(false);
                    const input = document.getElementById('pt-upload-input') as HTMLInputElement | null;
                    if (input) input.value = '';
                  }
                }}
              />
              <label htmlFor="pt-upload-input">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Download className="w-4 h-4 mr-2" />
                    Import
                  </span>
                </Button>
              </label>

              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Assessment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Assessment</DialogTitle>
                    <DialogDescription>
                      Set up a new penetration testing assessment project
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Assessment Name</Label>
                      <Input
                        id="name"
                        value={newAssessment.name}
                        onChange={(e) => setNewAssessment(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Web Application Security Assessment"
                      />
                    </div>
                    <div>
                      <Label htmlFor="target">Target System</Label>
                      <Input
                        id="target"
                        value={newAssessment.target}
                        onChange={(e) => setNewAssessment(prev => ({ ...prev, target: e.target.value }))}
                        placeholder="e.g., https://example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newAssessment.description}
                        onChange={(e) => setNewAssessment(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Assessment objectives and scope"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={newAssessment.startDate}
                          onChange={(e) => setNewAssessment(prev => ({ ...prev, startDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={newAssessment.endDate}
                          onChange={(e) => setNewAssessment(prev => ({ ...prev, endDate: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={createAssessment}>
                        Create Assessment
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {uploadLog.length > 0 && (
            <div className="mb-4 space-y-2">
              {uploading && (
                <Alert>
                  <AlertDescription>Processing upload...</AlertDescription>
                </Alert>
              )}
              {uploadLog.slice(-10).map((line, idx) => (
                <Alert key={idx}>
                  <AlertDescription className="whitespace-pre-wrap">{line}</AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {assessments.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No assessments yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first penetration testing assessment to get started
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Assessment
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assessments.map((assessment) => (
                <Card
                  key={assessment.id}
                  className={`cursor-pointer transition-colors ${
                    currentAssessment?.id === assessment.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setCurrentAssessment(assessment)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold truncate">{assessment.name}</h4>
                      <Badge variant="outline">{assessment.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 truncate">
                      {assessment.target}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.round(assessment.progress)}%</span>
                      </div>
                      <Progress value={assessment.progress} className="h-2" />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                      <span>{assessment.issues.length} issues</span>
                      <span>{assessment.checklist.filter(c => c.completed).length}/{assessment.checklist.length} tasks</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Assessment */}
      {currentAssessment && (
        <div className="space-y-6">
          {/* Assessment Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{currentAssessment.name}</CardTitle>
                  <CardDescription>
                    Target: {currentAssessment.target} | Status: {currentAssessment.status}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={exportAssessment}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Select
                    value={currentAssessment.status}
                    onValueChange={(value: Assessment["status"]) => {
                      const updatedAssessment = { ...currentAssessment, status: value };
                      setCurrentAssessment(updatedAssessment);
                      setAssessments(prev => prev.map(a => a.id === currentAssessment.id ? updatedAssessment : a));
                    }}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(currentAssessment.progress)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {currentAssessment.issues.filter(i => i.status === "open").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Open Issues</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {currentAssessment.checklist.filter(c => c.completed).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed Tasks</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Content */}
          <Tabs defaultValue="checklist" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="checklist">
                Checklist ({currentAssessment.checklist.filter(c => c.completed).length}/{currentAssessment.checklist.length})
              </TabsTrigger>
              <TabsTrigger value="issues">
                Issues ({currentAssessment.issues.length})
              </TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="checklist" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Assessment Checklist</h3>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Custom Task
                </Button>
              </div>

              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {PENTEST_PHASES.map((phase) => {
                    const phaseItems = currentAssessment.checklist.filter(item => item.phase === phase);
                    if (phaseItems.length === 0) return null;

                    return (
                      <Card key={phase}>
                        <CardHeader>
                          <CardTitle className="text-base">{phase}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {phaseItems.map((item) => (
                            <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg">
                              <Checkbox
                                checked={item.completed}
                                onCheckedChange={(checked) =>
                                  updateChecklistItem(item.id, { completed: !!checked })
                                }
                                className="mt-1"
                              />
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm font-medium ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                                    {item.title}
                                  </span>
                                  <Badge className={getSeverityColor(item.severity)} variant="secondary">
                                    {item.severity}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                                <Textarea
                                  placeholder="Add notes..."
                                  value={item.notes}
                                  onChange={(e) => updateChecklistItem(item.id, { notes: e.target.value })}
                                  className="text-sm min-h-[60px]"
                                />
                                <div className="flex justify-end">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addIssue(item.id)}
                                  >
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                    Create Issue
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="issues" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Issue Tracker</h3>
                <Button onClick={() => addIssue()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Issue
                </Button>
              </div>

              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {currentAssessment.issues.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No issues yet</h3>
                      <p className="text-muted-foreground">
                        Issues will appear here as you identify vulnerabilities during testing
                      </p>
                    </div>
                  ) : (
                    currentAssessment.issues.map((issue) => (
                      <Card key={issue.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Badge className={getSeverityColor(issue.severity)}>
                                {issue.severity.toUpperCase()}
                              </Badge>
                              <Badge className={getStatusColor(issue.status)}>
                                {issue.status.replace("-", " ").toUpperCase()}
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteIssue(issue.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-medium">{issue.title || "Untitled Issue"}</h4>
                            <p className="text-sm text-muted-foreground">{issue.description || "No description provided"}</p>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {issue.assignee && (
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {issue.assignee}
                                </div>
                              )}
                              {issue.dueDate && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  Due: {new Date(issue.dueDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>

                            {issue.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {issue.tags.map((tag, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Reports</CardTitle>
                  <CardDescription>
                    Generate comprehensive reports for your penetration testing assessment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-24 flex-col">
                      <FileText className="w-8 h-8 mb-2" />
                      Executive Summary
                    </Button>
                    <Button variant="outline" className="h-24 flex-col">
                      <FileText className="w-8 h-8 mb-2" />
                      Technical Report
                    </Button>
                    <Button variant="outline" className="h-24 flex-col">
                      <FileText className="w-8 h-8 mb-2" />
                      Remediation Plan
                    </Button>
                    <Button variant="outline" className="h-24 flex-col">
                      <FileText className="w-8 h-8 mb-2" />
                      Compliance Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}