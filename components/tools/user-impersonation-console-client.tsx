"use client";

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
import { toast } from "sonner";
import FileUploadComponent from "./file-upload-component";
import {
  User,
  Clock,
  Shield,
  AlertCircle,
  CheckCircle2,
  Download,
  Play,
  Square,
  Search,
  Activity,
  Upload,
  Bell,
  Wifi,
  WifiOff
} from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  accountType: string;
  lastActive: string;
}

interface ImpersonationSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  initiator: string;
  reason: string;
  startTime: string;
  endTime: string | null;
  duration: number;
  status: "active" | "ended";
  activities: Activity[];
}

interface Activity {
  id: string;
  action: string;
  details: string;
  timestamp: string;
}

interface AuditLog {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  initiator: string;
  reason: string;
  startTime: string;
  endTime: string;
  duration: number;
  activityCount: number;
}

export default function UserImpersonationConsoleClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [sessions, setSessions] = useState<ImpersonationSession[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("start");

  // Real-time connection state
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Start session form
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [reason, setReason] = useState("");
  const [sessionDuration, setSessionDuration] = useState("30");

  // Active session
  const [activeSession, setActiveSession] = useState<ImpersonationSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // File upload state
  const [importedUsers, setImportedUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
    loadSessions();
    loadAuditLogs();
    connectToRealTime();
  }, []);

  useEffect(() => {
    if (activeSession && activeSession.status === "active") {
      const interval = setInterval(() => {
        const start = new Date(activeSession.startTime).getTime();
        const now = new Date().getTime();
        const elapsed = Math.floor((now - start) / 1000);
        const remaining = (activeSession.duration * 60) - elapsed;

        if (remaining <= 0) {
          endSession();
        } else {
          setTimeRemaining(remaining);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [activeSession]);

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/tools/user-impersonation-console", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getUsers" }),
      });

      const data = await response.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
    }
  };

  const loadSessions = async () => {
    try {
      const response = await fetch("/api/tools/user-impersonation-console", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getSessions" }),
      });

      const data = await response.json();
      if (data.sessions) {
        setSessions(data.sessions);
        const active = data.sessions.find((s: ImpersonationSession) => s.status === "active");
        if (active) {
          setActiveSession(active);
        }
      }
    } catch (error) {
      console.error("Error loading sessions:", error);
    }
  };

  const loadAuditLogs = async () => {
    try {
      const response = await fetch("/api/tools/user-impersonation-console", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAuditLogs" }),
      });

      const data = await response.json();
      if (data.logs) {
        setAuditLogs(data.logs);
      }
    } catch (error) {
      console.error("Error loading audit logs:", error);
    }
  };

  const searchUsers = () => {
    if (!searchQuery) {
      return users;
    }
    return users.filter(user =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const startImpersonation = async () => {
    if (!selectedUser || !reason) {
      toast.error("Please select a user and provide a reason");
      return;
    }

    if (activeSession) {
      toast.error("An impersonation session is already active");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/tools/user-impersonation-console", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "startSession",
          userId: selectedUser.id,
          reason,
          duration: parseInt(sessionDuration),
        }),
      });

      const data = await response.json();
      if (data.session) {
        setActiveSession(data.session);
        await loadSessions();
        await loadAuditLogs();
        toast.success("Impersonation session started");
        setActiveTab("active");
        resetForm();
      }
    } catch (error) {
      console.error("Error starting session:", error);
      toast.error("Failed to start impersonation session");
    } finally {
      setIsProcessing(false);
    }
  };

  const logActivity = async (action: string, details: string) => {
    if (!activeSession) return;

    try {
      const response = await fetch("/api/tools/user-impersonation-console", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "logActivity",
          sessionId: activeSession.id,
          activityAction: action,
          activityDetails: details,
        }),
      });

      const data = await response.json();
      if (data.session) {
        setActiveSession(data.session);
        await loadSessions();
      }
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  const endSession = async () => {
    if (!activeSession) return;

    try {
      const response = await fetch("/api/tools/user-impersonation-console", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "endSession",
          sessionId: activeSession.id,
        }),
      });

      const data = await response.json();
      if (data.session) {
        toast.success("Impersonation session ended");
        setActiveSession(null);
        await loadSessions();
        await loadAuditLogs();
      }
    } catch (error) {
      console.error("Error ending session:", error);
      toast.error("Failed to end session");
    }
  };

  const exportAuditLogs = () => {
    const dataStr = JSON.stringify(auditLogs, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `impersonation-audit-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Audit logs exported");
  };

  const exportUsers = async () => {
    try {
      const response = await fetch("/api/tools/user-impersonation-console", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "exportUsers" }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Users exported successfully");
      } else {
        toast.error("Failed to export users");
      }
    } catch (error) {
      console.error("Error exporting users:", error);
      toast.error("Failed to export users");
    }
  };

  const handleFileUpload = async (file: File, content: string) => {
    try {
      const response = await fetch("/api/tools/user-impersonation-console", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "importUsers",
          fileContent: content,
          fileName: file.name,
        }),
      });

      const data = await response.json();
      if (data.success) {
        await loadUsers();
      } else {
        toast.error(data.error || "Failed to import users");
      }
    } catch (error) {
      console.error("Error importing users:", error);
      toast.error("Failed to import users");
    }
  };

  const uploadSessionFile = async (file: File, content: string) => {
    if (!activeSession) {
      toast.error("No active session to upload file to");
      return;
    }

    try {
      const response = await fetch("/api/tools/user-impersonation-console", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "uploadSessionFile",
          sessionId: activeSession.id,
          fileContent: content,
          fileName: file.name,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("File uploaded and logged");
      } else {
        toast.error(data.error || "Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    }
  };

  const resetForm = () => {
    setSearchQuery("");
    setSelectedUser(null);
    setReason("");
    setSessionDuration("30");
  };

  // Real-time connection
  const connectToRealTime = useCallback(() => {
    const eventSource = new EventSource("/api/tools/user-impersonation-console");
    
    eventSource.onopen = () => {
      setIsConnected(true);
      console.log("Connected to real-time updates");
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleRealTimeEvent(data);
      } catch (error) {
        console.error("Error parsing real-time event:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("Real-time connection error:", error);
      setIsConnected(false);
      eventSource.close();
      
      // Reconnect after 5 seconds
      setTimeout(() => {
        connectToRealTime();
      }, 5000);
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, []);

  const handleRealTimeEvent = (event: any) => {
    switch (event.type) {
      case 'session_started':
        setActiveSession(event.data.session);
        loadSessions();
        setNotifications(prev => [...prev, `Session started for ${event.data.session.userName}`]);
        toast.success(`Session started for ${event.data.session.userName}`);
        break;
      
      case 'session_ended':
        if (activeSession?.id === event.data.session.id) {
          setActiveSession(null);
        }
        loadSessions();
        loadAuditLogs();
        setNotifications(prev => [...prev, `Session ended for ${event.data.session.userName}`]);
        toast.success(`Session ended for ${event.data.session.userName}`);
        break;
      
      case 'activity_logged':
        if (activeSession?.id === event.data.sessionId) {
          setActiveSession(prev => prev ? {
            ...prev,
            activities: [...prev.activities, event.data.activity]
          } : prev);
        }
        loadSessions();
        break;
      
      case 'users_imported':
        loadUsers();
        setNotifications(prev => [...prev, `Imported ${event.data.count} users from file`]);
        toast.success(`Successfully imported ${event.data.count} users`);
        break;
      
      case 'session_file_uploaded':
        if (activeSession?.id === event.data.sessionId) {
          setActiveSession(prev => prev ? {
            ...prev,
            activities: [...prev.activities, event.data.activity]
          } : prev);
        }
        loadSessions();
        setNotifications(prev => [...prev, `File uploaded: ${event.data.fileName}`]);
        toast.info(`File uploaded: ${event.data.fileName}`);
        break;
      
      case 'heartbeat':
        // Periodic heartbeat - no action needed
        break;
      
      default:
        console.log("Unknown real-time event:", event);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const stats = {
    activeSessions: sessions.filter(s => s.status === "active").length,
    totalSessions: sessions.length,
    totalAuditLogs: auditLogs.length,
    avgDuration: auditLogs.length > 0
      ? Math.round(auditLogs.reduce((sum, log) => sum + log.duration, 0) / auditLogs.length)
      : 0,
  };

  return (
    <div className="space-y-6">
      {/* Header with real-time status and notifications */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <div className="flex items-center space-x-2 text-green-600">
                <Wifi className="w-4 h-4" />
                <span className="text-sm">Real-time Connected</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-red-600">
                <WifiOff className="w-4 h-4" />
                <span className="text-sm">Disconnected</span>
              </div>
            )}
          </div>
          
          <Button variant="outline" size="sm" onClick={exportUsers}>
            <Download className="w-4 h-4 mr-2" />
            Export Users
          </Button>
        </div>

        {/* Notifications */}
        <div className="relative">
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <Badge variant="destructive" className="ml-2 px-1 min-w-[1.25rem] h-5">
                {notifications.length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Sessions</p>
                <p className="text-2xl font-bold">{stats.activeSessions}</p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{stats.totalSessions}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Audit Logs</p>
                <p className="text-2xl font-bold">{stats.totalAuditLogs}</p>
              </div>
              <User className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Duration</p>
                <p className="text-2xl font-bold">{stats.avgDuration}m</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Session Alert */}
      {activeSession && (
        <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-900/20">
          <AlertCircle className="w-4 h-4 text-orange-600" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>
                Active impersonation: <strong>{activeSession.userName}</strong> - Time remaining: <strong>{formatTime(timeRemaining)}</strong>
              </span>
              <Button variant="destructive" size="sm" onClick={endSession}>
                <Square className="w-3 h-3 mr-2" />
                End Session
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>User Impersonation Console</CardTitle>
          <CardDescription>
            Safely impersonate users for debugging with consent logging and activity tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
                <TabsTrigger value="start">Start Session</TabsTrigger>
                <TabsTrigger value="active" disabled={!activeSession}>Active Session</TabsTrigger>
                <TabsTrigger value="bulk-import">Bulk Import/Export</TabsTrigger>
                <TabsTrigger value="history">Session History</TabsTrigger>
                <TabsTrigger value="audit">Audit Logs</TabsTrigger>
              </TabsList>

            <TabsContent value="start" className="space-y-6 mt-6">
              {activeSession ? (
                <Alert>
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    You already have an active impersonation session. Please end it before starting a new one.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="search">Search Users</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="search"
                          placeholder="Search by email or name..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="border rounded-lg max-h-96 overflow-y-auto">
                      {searchUsers().map(user => (
                        <div
                          key={user.id}
                          className={`p-4 border-b last:border-b-0 cursor-pointer hover:bg-muted ${
                            selectedUser?.id === user.id ? "bg-muted" : ""
                          }`}
                          onClick={() => setSelectedUser(user)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                            <Badge variant="outline">{user.accountType}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Last active: {user.lastActive}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {selectedUser && (
                      <Alert>
                        <CheckCircle2 className="w-4 h-4" />
                        <AlertDescription>
                          Selected: <strong>{selectedUser.name}</strong> ({selectedUser.email})
                        </AlertDescription>
                      </Alert>
                    )}

                    <div>
                      <Label htmlFor="reason">Justification (Required) *</Label>
                      <Textarea
                        id="reason"
                        placeholder="Provide a clear business justification for this impersonation..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={4}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        This will be logged in the audit trail
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="duration">Session Duration (minutes)</Label>
                      <Select value={sessionDuration} onValueChange={setSessionDuration}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Alert>
                      <Shield className="w-4 h-4" />
                      <AlertDescription className="text-xs">
                        Starting this session will:
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Log consent and notify the user</li>
                          <li>Track all activities during the session</li>
                          <li>Automatically expire after the set duration</li>
                          <li>Create an audit trail for compliance</li>
                        </ul>
                      </AlertDescription>
                    </Alert>

                    <Button
                      onClick={startImpersonation}
                      disabled={isProcessing || !selectedUser || !reason}
                      className="w-full"
                      size="lg"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Impersonation Session
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="active" className="space-y-6 mt-6">
              {activeSession ? (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Session Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Impersonating</p>
                          <p className="font-semibold">{activeSession.userName}</p>
                          <p className="text-sm text-muted-foreground">{activeSession.userEmail}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Reason</p>
                          <p className="text-sm">{activeSession.reason}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Started</p>
                          <p className="text-sm">{activeSession.startTime}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Time Remaining</p>
                          <p className="text-2xl font-bold text-orange-600">{formatTime(timeRemaining)}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Log Activity</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Quickly log common support activities:
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => logActivity("Viewed Dashboard", "Checked user's dashboard for issues")}
                          >
                            View Dashboard
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => logActivity("Checked Settings", "Reviewed account settings")}
                          >
                            Check Settings
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => logActivity("Reproduced Issue", "Successfully reproduced reported bug")}
                          >
                            Reproduce Issue
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => logActivity("Fixed Configuration", "Corrected misconfiguration")}
                          >
                            Fix Config
                          </Button>
                        </div>

                        <div className="pt-4 border-t">
                          <p className="text-sm text-muted-foreground mb-3">
                            Upload files to this session:
                          </p>
                          <FileUploadComponent
                            onFileUpload={uploadSessionFile}
                            acceptedTypes={["image/*", "text/*", "application/pdf", "application/json"]}
                            maxSize={25}
                            title=""
                            description=""
                            showPreview={false}
                          />
                        </div>

                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={endSession}
                        >
                          <Square className="w-4 h-4 mr-2" />
                          End Session Now
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Activity Log ({activeSession.activities.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {activeSession.activities.map(activity => (
                          <div key={activity.id} className="p-3 border rounded-lg">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold text-sm">{activity.action}</p>
                                <p className="text-sm text-muted-foreground">{activity.details}</p>
                              </div>
                              <Badge variant="outline">{activity.timestamp}</Badge>
                            </div>
                          </div>
                        ))}
                        {activeSession.activities.length === 0 && (
                          <p className="text-center text-muted-foreground py-8">
                            No activities logged yet
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    No active impersonation session. Start a session from the Start Session tab.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4 mt-6">
              {sessions.length === 0 ? (
                <Alert>
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    No session history available yet.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {sessions.map(session => (
                    <Card key={session.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-semibold">{session.userName}</p>
                              <Badge variant={session.status === "active" ? "default" : "secondary"}>
                                {session.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{session.userEmail}</p>
                            <p className="text-sm mt-2"><strong>Reason:</strong> {session.reason}</p>
                            <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                              <div>
                                <p className="text-muted-foreground">Started</p>
                                <p>{session.startTime}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Ended</p>
                                <p>{session.endTime || "Active"}</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Duration</p>
                            <p className="font-semibold">{session.duration} min</p>
                            <p className="text-sm text-muted-foreground mt-2">Activities</p>
                            <p className="font-semibold">{session.activities.length}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="audit" className="space-y-4 mt-6">
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportAuditLogs}
                  disabled={auditLogs.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Audit Logs
                </Button>
              </div>

              {auditLogs.length === 0 ? (
                <Alert>
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    No audit logs available yet.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  {auditLogs.map(log => (
                    <Card key={log.id}>
                      <CardContent className="p-4">
                        <div className="grid md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">User</p>
                            <p className="font-semibold">{log.userName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Initiator</p>
                            <p className="font-semibold">{log.initiator}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Duration</p>
                            <p className="font-semibold">{log.duration} minutes</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Activities</p>
                            <p className="font-semibold">{log.activityCount}</p>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm"><strong>Reason:</strong> {log.reason}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {log.startTime} → {log.endTime}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="bulk-import" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <FileUploadComponent
                    onFileUpload={handleFileUpload}
                    acceptedTypes={["text/csv", "application/json", "text/plain"]}
                    maxSize={10}
                    title="Import Users"
                    description="Upload CSV or JSON files to bulk import users"
                    showPreview={false}
                  />
                  <Alert className="mt-4">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>
                      Supported formats:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li><strong>CSV:</strong> email, name, accountType, lastActive</li>
                        <li><strong>JSON:</strong> Array of user objects</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Export Options</CardTitle>
                      <CardDescription>
                        Download user data in various formats
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button
                        onClick={exportUsers}
                        className="w-full"
                        variant="outline"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export Users as CSV
                      </Button>
                      
                      <Alert>
                        <CheckCircle2 className="w-4 h-4" />
                        <AlertDescription>
                          Export includes all users with their account details and activity status.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>

                  {importedUsers.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Recently Imported</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {importedUsers.slice(0, 5).map(user => (
                            <div key={user.id} className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <p className="font-medium text-sm">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                              <Badge variant="outline">{user.accountType}</Badge>
                            </div>
                          ))}
                          {importedUsers.length > 5 && (
                            <p className="text-xs text-muted-foreground text-center">
                              ... and {importedUsers.length - 5} more users
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
