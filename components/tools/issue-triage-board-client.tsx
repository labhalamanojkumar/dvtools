"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  FileJson,
  Plus,
  User,
  AlertTriangle,
  TrendingUp,
  Filter,
  X
} from "lucide-react";

type Priority = "critical" | "high" | "medium" | "low";
type Status = "new" | "in_progress" | "review" | "resolved";

interface Issue {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  assignee: string;
  errorDetails?: string;
  alertSource?: string;
  ticketId?: string;
  createdAt: string;
  updatedAt: string;
  slaDeadline: string;
  slaStatus: "on-track" | "at-risk" | "breached";
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  capacity: number;
  assignedCount: number;
}

export default function IssueTriageBoardClient() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("board");
  const [isConnected, setIsConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIssues, setSelectedIssues] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<{[issueId: string]: any[]}>({});
  const [activity, setActivity] = useState<{[issueId: string]: any[]}>({});
  const [analytics, setAnalytics] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // New issue form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [assignee, setAssignee] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const [alertSource, setAlertSource] = useState("");
  const [ticketId, setTicketId] = useState("");

  // Comment form state
  const [commentContent, setCommentContent] = useState<{[issueId: string]: string}>({});

  // Filter state
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all");
  const [filterSLA, setFilterSLA] = useState<"all" | "on-track" | "at-risk" | "breached">("all");

  useEffect(() => {
    loadIssues();
    loadTeamMembers();
    initializeRealtimeConnection();
    
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const initializeRealtimeConnection = () => {
    try {
      const eventSource = new EventSource("/api/tools/issue-triage-board/realtime");
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsConnected(true);
        toast.success("Connected to real-time updates");
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleRealtimeMessage(data);
        } catch (error) {
          console.error("Error parsing realtime message:", error);
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE error:", error);
        setIsConnected(false);
        toast.error("Real-time connection lost. Attempting to reconnect...");
        
        // Auto-reconnect after 3 seconds
        setTimeout(() => {
          initializeRealtimeConnection();
        }, 3000);
      };

    } catch (error) {
      console.error("Failed to initialize real-time connection:", error);
      setIsConnected(false);
    }
  };

  const handleRealtimeMessage = (message: any) => {
    // Early return if message or message.type is invalid
    if (!message || !message.type) {
      console.warn('Invalid message format:', message);
      return;
    }

    switch (message.type) {
      case 'issue_create':
        if (message.payload?.issue) {
          setIssues(prev => [message.payload.issue, ...prev]);
          toast.success(`New issue created: ${message.payload.issue.title}`);
        }
        break;
      
      case 'issue_update':
        if (message.payload?.issue && message.payload.issue.id) {
          setIssues(prev => prev.map(issue =>
            issue.id === message.payload.issue.id ? message.payload.issue : issue
          ));
        }
        break;
      
      case 'issue_delete':
        if (message.payload?.issue && message.payload.issue.id) {
          setIssues(prev => prev.filter(issue => issue.id !== message.payload.issue.id));
        }
        break;
      
      case 'comment_add':
        const comment = message.payload?.comment;
        if (comment && comment.issueId) {
          setComments(prev => ({
            ...prev,
            [comment.issueId]: [...(prev[comment.issueId] || []), comment]
          }));
          toast.success("New comment added");
        }
        break;
      
      case 'activity_add':
        const activityItem = message.payload?.activity;
        if (activityItem && activityItem.issueId) {
          setActivity(prev => ({
            ...prev,
            [activityItem.issueId]: [...(prev[activityItem.issueId] || []), activityItem]
          }));
        }
        break;
      
      case 'sla_alert':
        if (message.payload?.issue?.title) {
          toast.warning(`SLA Breach Alert: ${message.payload.issue.title}`);
        }
        break;
      
      case 'issue_update':
        if (message.payload?.connected) {
          setIsConnected(true);
        }
        break;
    }
  };

  const loadIssues = async () => {
    try {
      const response = await fetch("/api/tools/issue-triage-board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getIssues" }),
      });

      const data = await response.json();
      if (data.issues) {
        setIssues(data.issues);
      }
    } catch (error) {
      console.error("Error loading issues:", error);
      toast.error("Failed to load issues");
    }
  };

  const loadTeamMembers = async () => {
    try {
      const response = await fetch("/api/tools/issue-triage-board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getTeamMembers" }),
      });

      const data = await response.json();
      if (data.teamMembers) {
        setTeamMembers(data.teamMembers);
      }
    } catch (error) {
      console.error("Error loading team members:", error);
    }
  };

  const loadComments = async (issueId: string) => {
    try {
      const response = await fetch("/api/tools/issue-triage-board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getComments", issueId }),
      });

      const data = await response.json();
      if (data.comments) {
        setComments(prev => ({
          ...prev,
          [issueId]: data.comments
        }));
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const loadActivity = async (issueId: string) => {
    try {
      const response = await fetch("/api/tools/issue-triage-board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getActivity", issueId }),
      });

      const data = await response.json();
      if (data.activity) {
        setActivity(prev => ({
          ...prev,
          [issueId]: data.activity
        }));
      }
    } catch (error) {
      console.error("Error loading activity:", error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await fetch("/api/tools/issue-triage-board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAnalytics" }),
      });

      const data = await response.json();
      if (data.analytics) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
    }
  };

  const searchIssues = async (query: string) => {
    if (!query.trim()) {
      loadIssues();
      return;
    }

    try {
      const response = await fetch("/api/tools/issue-triage-board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "searchIssues",
          query,
          filters: {
            priority: filterPriority,
            status: filterStatus,
            assignee: filterAssignee,
            slaStatus: filterSLA
          }
        }),
      });

      const data = await response.json();
      if (data.issues) {
        setIssues(data.issues);
      }
    } catch (error) {
      console.error("Error searching issues:", error);
      toast.error("Failed to search issues");
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      toast.error("Please upload a JSON file");
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const importedIssues = JSON.parse(content);

        if (!Array.isArray(importedIssues)) {
          throw new Error("Invalid format: expected an array of issues");
        }

        const response = await fetch("/api/tools/issue-triage-board", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "importIssues",
            issues: importedIssues,
          }),
        });

        const data = await response.json();
        if (data.issues) {
          setIssues(data.issues);
          toast.success(`Imported ${importedIssues.length} issues successfully`);
        }
      } catch (error) {
        console.error("Error importing issues:", error);
        toast.error("Failed to import issues. Check file format.");
      } finally {
        setIsProcessing(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    reader.readAsText(file);
  };

  const createIssue = async () => {
    if (!title || !description) {
      toast.error("Title and description are required");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/tools/issue-triage-board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createIssue",
          title,
          description,
          priority,
          assignee,
          errorDetails,
          alertSource,
          ticketId,
        }),
      });

      const data = await response.json();
      if (data.issue) {
        setIssues([...issues, data.issue]);
        toast.success("Issue created successfully");
        resetForm();
        setActiveTab("board");
      }
    } catch (error) {
      console.error("Error creating issue:", error);
      toast.error("Failed to create issue");
    } finally {
      setIsProcessing(false);
    }
  };

  const updateIssueStatus = async (issueId: string, newStatus: Status) => {
    try {
      const response = await fetch("/api/tools/issue-triage-board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateIssue",
          issueId,
          status: newStatus,
        }),
      });

      const data = await response.json();
      if (data.issue) {
        setIssues(issues.map(issue => issue.id === issueId ? data.issue : issue));
        toast.success("Issue status updated");
      }
    } catch (error) {
      console.error("Error updating issue:", error);
      toast.error("Failed to update issue");
    }
  };

  const updateIssuePriority = async (issueId: string, newPriority: Priority) => {
    try {
      const response = await fetch("/api/tools/issue-triage-board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateIssue",
          issueId,
          priority: newPriority,
        }),
      });

      const data = await response.json();
      if (data.issue) {
        setIssues(issues.map(issue => issue.id === issueId ? data.issue : issue));
        toast.success("Priority updated");
      }
    } catch (error) {
      console.error("Error updating priority:", error);
      toast.error("Failed to update priority");
    }
  };

  const updateIssueAssignee = async (issueId: string, newAssignee: string) => {
    try {
      const response = await fetch("/api/tools/issue-triage-board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateIssue",
          issueId,
          assignee: newAssignee,
        }),
      });

      const data = await response.json();
      if (data.issue) {
        setIssues(issues.map(issue => issue.id === issueId ? data.issue : issue));
        toast.success("Assignee updated");
        await loadTeamMembers(); // Refresh workload counts
      }
    } catch (error) {
      console.error("Error updating assignee:", error);
      toast.error("Failed to update assignee");
    }
  };

  const deleteIssue = async (issueId: string) => {
    if (!confirm("Are you sure you want to delete this issue?")) return;

    try {
      const response = await fetch("/api/tools/issue-triage-board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "deleteIssue",
          issueId,
        }),
      });

      if (response.ok) {
        setIssues(issues.filter(issue => issue.id !== issueId));
        toast.success("Issue deleted");
        await loadTeamMembers();
      }
    } catch (error) {
      console.error("Error deleting issue:", error);
      toast.error("Failed to delete issue");
    }
  };

  const exportIssues = () => {
    const dataStr = JSON.stringify(issues, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `issues-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Issues exported successfully");
  };

  const addComment = async (issueId: string, content: string) => {
    if (!content.trim()) return;

    try {
      const response = await fetch("/api/tools/issue-triage-board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "addComment",
          issueId,
          content,
          author: "Current User" // In real app, get from auth
        }),
      });

      const data = await response.json();
      if (data.comment) {
        setCommentContent(prev => ({ ...prev, [issueId]: "" }));
        // The real-time message will handle updating the UI
        toast.success("Comment added successfully");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const bulkUpdate = async () => {
    if (selectedIssues.size === 0) {
      toast.error("No issues selected");
      return;
    }

    const updateData = {
      priority: filterPriority !== "all" ? filterPriority : undefined,
      status: filterStatus !== "all" ? filterStatus : undefined,
      assignee: filterAssignee !== "all" ? filterAssignee : undefined
    };

    try {
      const response = await fetch("/api/tools/issue-triage-board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "bulkUpdate",
          issueIds: Array.from(selectedIssues),
          updates: updateData
        }),
      });

      const data = await response.json();
      if (data.issues) {
        toast.success(`Bulk updated ${data.count} issues`);
        setSelectedIssues(new Set());
      }
    } catch (error) {
      console.error("Error in bulk update:", error);
      toast.error("Failed to bulk update issues");
    }
  };

  const bulkDelete = async () => {
    if (selectedIssues.size === 0) {
      toast.error("No issues selected");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedIssues.size} issues?`)) return;

    try {
      const response = await fetch("/api/tools/issue-triage-board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "bulkDelete",
          issueIds: Array.from(selectedIssues)
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Deleted ${data.count} issues`);
        setSelectedIssues(new Set());
      }
    } catch (error) {
      console.error("Error in bulk delete:", error);
      toast.error("Failed to bulk delete issues");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setAssignee("");
    setErrorDetails("");
    setAlertSource("");
    setTicketId("");
  };

  const toggleIssueSelection = (issueId: string) => {
    setSelectedIssues(prev => {
      const newSet = new Set(prev);
      if (newSet.has(issueId)) {
        newSet.delete(issueId);
      } else {
        newSet.add(issueId);
      }
      return newSet;
    });
  };

  const selectAllVisible = () => {
    const visibleIssues = getIssuesByStatus('new').concat(
      getIssuesByStatus('in_progress'),
      getIssuesByStatus('review'),
      getIssuesByStatus('resolved')
    );
    setSelectedIssues(new Set(visibleIssues.map(i => i.id)));
  };

  const clearSelection = () => {
    setSelectedIssues(new Set());
  };

  const getPriorityColor = (priority: Priority) => {
    const colors = {
      critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    };
    return colors[priority];
  };

  const getSLAStatusColor = (slaStatus: string) => {
    const colors = {
      "on-track": "text-green-600 dark:text-green-400",
      "at-risk": "text-yellow-600 dark:text-yellow-400",
      "breached": "text-red-600 dark:text-red-400",
    };
    return colors[slaStatus as keyof typeof colors] || "";
  };

  const getStatusLabel = (status: Status) => {
    const labels = {
      new: "New",
      in_progress: "In Progress",
      review: "Review",
      resolved: "Resolved",
    };
    return labels[status];
  };

  const filterIssues = (issuesList: Issue[]) => {
    return issuesList.filter(issue => {
      const priorityMatch = filterPriority === "all" || issue.priority === filterPriority;
      const statusMatch = filterStatus === "all" || issue.status === filterStatus;
      const assigneeMatch = filterAssignee === "all" ||
        (filterAssignee === "unassigned" && !issue.assignee) ||
        issue.assignee === filterAssignee;
      const slaMatch = filterSLA === "all" || issue.slaStatus === filterSLA;
      return priorityMatch && statusMatch && assigneeMatch && slaMatch;
    });
  };

  const getIssuesByStatus = (status: Status) => {
    return filterIssues(issues).filter(issue => issue.status === status);
  };

  const stats = {
    total: issues.length,
    critical: issues.filter(i => i.priority === "critical").length,
    breached: issues.filter(i => i.slaStatus === "breached").length,
    resolved: issues.filter(i => i.status === "resolved").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Issues</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">SLA Breached</p>
                <p className="text-2xl font-bold text-orange-600">{stats.breached}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Issue Triage Board</CardTitle>
          <CardDescription>
            Manage errors, alerts, and incidents with priority-based triage and SLA tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="board">Board</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="create">Create Issue</TabsTrigger>
                <TabsTrigger value="team">Team Workload</TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                >
                  <FileJson className="w-4 h-4 mr-2" />
                  Import JSON
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportIssues}
                  disabled={issues.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <TabsContent value="board" className="space-y-4">
              {/* Search and Filters */}
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Search issues by title, description, or error details..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchIssues(searchQuery)}
                    className="flex-1"
                  />
                  <Button onClick={() => searchIssues(searchQuery)} size="sm">
                    Search
                  </Button>
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("");
                        loadIssues();
                      }}
                    >
                      Clear
                    </Button>
                  )}
                </div>

                {/* Filters */}
                <div className="flex gap-4 p-4 bg-muted rounded-lg flex-wrap">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <Label>Filters:</Label>
                  </div>
                  
                  {/* Connection Status */}
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-xs text-muted-foreground">
                      {isConnected ? 'Live' : 'Disconnected'}
                    </span>
                  </div>

                  <Select value={filterPriority} onValueChange={(value) => setFilterPriority(value as Priority | "all")}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as Status | "all")}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterAssignee || "all"} onValueChange={setFilterAssignee}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Assignees</SelectItem>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {teamMembers.map(member => (
                        <SelectItem key={member.id} value={member.email}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterSLA} onValueChange={(value) => setFilterSLA(value as "all" | "on-track" | "at-risk" | "breached")}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="SLA Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All SLA</SelectItem>
                      <SelectItem value="on-track">On Track</SelectItem>
                      <SelectItem value="at-risk">At Risk</SelectItem>
                      <SelectItem value="breached">Breached</SelectItem>
                    </SelectContent>
                  </Select>

                  {(filterPriority !== "all" || filterAssignee !== "all" || filterStatus !== "all" || filterSLA !== "all") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFilterPriority("all");
                        setFilterAssignee("all");
                        setFilterStatus("all");
                        setFilterSLA("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>

                {/* Bulk Actions */}
                {selectedIssues.size > 0 && (
                  <div className="flex gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <span className="text-sm font-medium">
                      {selectedIssues.size} issue(s) selected
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={bulkUpdate}
                      disabled={isProcessing}
                    >
                      Bulk Update
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={bulkDelete}
                      disabled={isProcessing}
                    >
                      Bulk Delete
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={clearSelection}
                    >
                      Clear Selection
                    </Button>
                  </div>
                )}
              </div>

              {/* Kanban Board */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {(["new", "in_progress", "review", "resolved"] as Status[]).map(status => (
                  <div key={status} className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <h3 className="font-semibold">{getStatusLabel(status)}</h3>
                      <Badge variant="secondary">{getIssuesByStatus(status).length}</Badge>
                    </div>

                    <div className="space-y-2 min-h-[500px]">
                      {getIssuesByStatus(status).map(issue => (
                        <Card key={issue.id} className="p-4 hover:shadow-lg transition-shadow">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={selectedIssues.has(issue.id)}
                                  onCheckedChange={() => toggleIssueSelection(issue.id)}
                                  className="h-4 w-4"
                                />
                                <h4 className="font-semibold text-sm line-clamp-2">{issue.title}</h4>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => deleteIssue(issue.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>

                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {issue.description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                              <Badge className={getPriorityColor(issue.priority)}>
                                {issue.priority}
                              </Badge>
                              {issue.ticketId && (
                                <Badge variant="outline" className="text-xs">
                                  #{issue.ticketId}
                                </Badge>
                              )}
                            </div>

                            {issue.assignee && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <User className="w-3 h-3" />
                                <span>{issue.assignee}</span>
                              </div>
                            )}

                            <div className={`flex items-center gap-2 text-xs ${getSLAStatusColor(issue.slaStatus)}`}>
                              <Clock className="w-3 h-3" />
                              <span>SLA: {issue.slaDeadline}</span>
                            </div>

                            <div className="flex gap-2 pt-2 border-t">
                              <Select
                                value={issue.status}
                                onValueChange={(value) => updateIssueStatus(issue.id, value as Status)}
                              >
                                <SelectTrigger className="h-8 text-xs flex-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="new">New</SelectItem>
                                  <SelectItem value="in_progress">In Progress</SelectItem>
                                  <SelectItem value="review">Review</SelectItem>
                                  <SelectItem value="resolved">Resolved</SelectItem>
                                </SelectContent>
                              </Select>
                              
                              <Select
                                value={issue.priority}
                                onValueChange={(value) => updateIssuePriority(issue.id, value as Priority)}
                              >
                                <SelectTrigger className="h-8 text-xs flex-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="critical">Critical</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                              </Select>

                              <Select
                                value={issue.assignee || "unassigned"}
                                onValueChange={(value) => updateIssueAssignee(issue.id, value === "unassigned" ? "" : value)}
                              >
                                <SelectTrigger className="h-8 text-xs flex-1">
                                  <SelectValue placeholder="Assign" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="unassigned">Unassigned</SelectItem>
                                  {teamMembers.map(member => (
                                    <SelectItem key={member.id} value={member.email}>
                                      {member.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Comments Section */}
                            <div className="pt-2 border-t">
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      loadComments(issue.id);
                                      loadActivity(issue.id);
                                    }}
                                  >
                                    💬 Comments & Activity
                                  </Button>
                                  {comments[issue.id] && comments[issue.id].length > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                      {comments[issue.id].length}
                                    </Badge>
                                  )}
                                </div>
                                
                                {comments[issue.id] && comments[issue.id].length > 0 && (
                                  <div className="space-y-2">
                                    {comments[issue.id].map(comment => (
                                      <div key={comment.id} className="p-2 bg-muted rounded text-xs">
                                        <div className="flex justify-between items-center mb-1">
                                          <span className="font-medium">{comment.author}</span>
                                          <span className="text-muted-foreground text-xs">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                          </span>
                                        </div>
                                        <p>{comment.content}</p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {activity[issue.id] && activity[issue.id].length > 0 && (
                                  <div className="space-y-1">
                                    {activity[issue.id].slice(-3).map(act => (
                                      <div key={act.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Clock className="w-3 h-3" />
                                        <span>{act.user} {act.action}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Add a comment..."
                                    value={commentContent[issue.id] || ""}
                                    onChange={(e) => setCommentContent(prev => ({
                                      ...prev,
                                      [issue.id]: e.target.value
                                    }))}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        addComment(issue.id, commentContent[issue.id] || "");
                                      }
                                    }}
                                    className="h-8 text-xs flex-1"
                                  />
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 px-2"
                                    onClick={() => addComment(issue.id, commentContent[issue.id] || "")}
                                    disabled={!commentContent[issue.id]?.trim()}
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}

                      {getIssuesByStatus(status).length === 0 && (
                        <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                          No issues
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Analytics & Reporting</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadAnalytics}
                    disabled={isProcessing}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Refresh Analytics
                  </Button>
                </div>

                {analytics ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Priority Distribution */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Priority Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {Object.entries(analytics.byPriority).map(([priority, count]) => (
                            <div key={priority} className="flex justify-between items-center">
                              <span className="text-sm capitalize">{priority}</span>
                              <Badge
                                className={
                                  priority === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                  priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' :
                                  priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                }
                              >
                                {count as number}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Status Distribution */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Status Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {Object.entries(analytics.byStatus).map(([status, count]) => (
                            <div key={status} className="flex justify-between items-center">
                              <span className="text-sm capitalize">{status.replace('_', ' ')}</span>
                              <Badge variant="secondary">
                                {count as number}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* SLA Status */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">SLA Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {Object.entries(analytics.bySLA).map(([status, count]) => (
                            <div key={status} className="flex justify-between items-center">
                              <span className="text-sm capitalize">{status.replace('-', ' ')}</span>
                              <Badge
                                className={
                                  status === 'breached' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                  status === 'at-risk' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                }
                              >
                                {count as number}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Performance Metrics */}
                    <Card className="md:col-span-2 lg:col-span-3">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Performance Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-medium mb-3">Key Metrics</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center p-3 bg-muted rounded">
                                <span className="text-sm">Average Resolution Time</span>
                                <Badge variant="outline">{analytics.avgResolutionTime} hours</Badge>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-muted rounded">
                                <span className="text-sm">Total Issues</span>
                                <Badge>{analytics.total}</Badge>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-muted rounded">
                                <span className="text-sm">Resolution Rate</span>
                                <Badge variant="outline">
                                  {analytics.total > 0 ? Math.round((analytics.byStatus.resolved / analytics.total) * 100) : 0}%
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-3">Team Performance</h4>
                            <div className="space-y-2">
                              {teamMembers.map(member => {
                                const memberIssues = issues.filter(i => i.assignee === member.email);
                                const resolvedCount = memberIssues.filter(i => i.status === 'resolved').length;
                                const activeCount = memberIssues.filter(i => i.status !== 'resolved').length;
                                
                                return (
                                  <div key={member.id} className="flex justify-between items-center p-2 bg-muted rounded">
                                    <div>
                                      <div className="text-sm font-medium">{member.name}</div>
                                      <div className="text-xs text-muted-foreground">{member.role}</div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Badge variant="outline" className="text-xs">
                                        {activeCount} active
                                      </Badge>
                                      <Badge variant="secondary" className="text-xs">
                                        {resolvedCount} resolved
                                      </Badge>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Trends */}
                    {analytics.trendData && analytics.trendData.length > 0 && (
                      <Card className="md:col-span-2 lg:col-span-3">
                        <CardHeader>
                          <CardTitle className="text-sm font-medium">7-Day Trends</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {analytics.trendData.map((day: any, index: number) => (
                              <div key={day.date} className="flex items-center justify-between p-2 bg-muted rounded">
                                <span className="text-sm">{new Date(day.date).toLocaleDateString()}</span>
                                <div className="flex gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    +{day.created} created
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    -{day.resolved} resolved
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Click "Refresh Analytics" to load data</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="create" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Issue Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Database connection timeout in production"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Detailed description of the issue..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="errorDetails">Error Details</Label>
                    <Textarea
                      id="errorDetails"
                      placeholder="Stack trace, error messages, logs..."
                      value={errorDetails}
                      onChange={(e) => setErrorDetails(e.target.value)}
                      rows={6}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="assignee">Assignee</Label>
                    <Select value={assignee || "unassigned"} onValueChange={setAssignee}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team member" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {teamMembers.map(member => (
                          <SelectItem key={member.id} value={member.email}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="alertSource">Alert Source</Label>
                    <Input
                      id="alertSource"
                      placeholder="e.g., Datadog, New Relic, Prometheus"
                      value={alertSource}
                      onChange={(e) => setAlertSource(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="ticketId">External Ticket ID</Label>
                    <Input
                      id="ticketId"
                      placeholder="e.g., JIRA-1234, GH-567"
                      value={ticketId}
                      onChange={(e) => setTicketId(e.target.value)}
                    />
                  </div>

                  <Button
                    onClick={createIssue}
                    disabled={isProcessing}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Issue
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="team" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                {teamMembers.map(member => {
                  const memberIssues = issues.filter(i => i.assignee === member.email);
                  const criticalCount = memberIssues.filter(i => i.priority === "critical").length;
                  const breachedCount = memberIssues.filter(i => i.slaStatus === "breached").length;

                  return (
                    <Card key={member.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <CardDescription>{member.email}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Assigned Issues</span>
                          <Badge variant="secondary">{memberIssues.length}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Critical</span>
                          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                            {criticalCount}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">SLA Breached</span>
                          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                            {breachedCount}
                          </Badge>
                        </div>
                        <div className="pt-3 border-t">
                          <div className="flex gap-2 text-xs">
                            <div className="flex-1 text-center">
                              <div className="font-semibold">
                                {memberIssues.filter(i => i.status === "new").length}
                              </div>
                              <div className="text-muted-foreground">New</div>
                            </div>
                            <div className="flex-1 text-center">
                              <div className="font-semibold">
                                {memberIssues.filter(i => i.status === "in_progress").length}
                              </div>
                              <div className="text-muted-foreground">Active</div>
                            </div>
                            <div className="flex-1 text-center">
                              <div className="font-semibold">
                                {memberIssues.filter(i => i.status === "resolved").length}
                              </div>
                              <div className="text-muted-foreground">Done</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {teamMembers.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No team members found. Team members will appear here once issues are assigned.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
