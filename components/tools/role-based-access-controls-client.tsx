"use client";

import { useState, useRef, useEffect } from "react";
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
import {
  Shield,
  Users,
  FileText,
  Download,
  Upload,
  Plus,
  Check,
  X,
  Edit,
  Trash2,
  AlertCircle,
  Clock
} from "lucide-react";

interface Permission {
  resource: string;
  actions: string[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

interface AuditLog {
  id: string;
  action: string;
  actor: string;
  target: string;
  details: string;
  timestamp: string;
}

const AVAILABLE_RESOURCES = [
  "users", "projects", "settings", "billing", "reports", 
  "api_keys", "webhooks", "integrations", "teams", "analytics"
];

const AVAILABLE_ACTIONS = ["create", "read", "update", "delete", "execute", "export"];

export default function RoleBasedAccessControlsClient() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("roles");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Role form state
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedResource, setSelectedResource] = useState("");
  const [selectedActions, setSelectedActions] = useState<string[]>([]);

  // User assignment state
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  useEffect(() => {
    loadRoles();
    loadUsers();
    loadAuditLogs();
  }, []);

  const loadRoles = async () => {
    try {
      const response = await fetch("/api/tools/role-based-access-controls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getRoles" }),
      });

      const data = await response.json();
      if (data.roles) {
        setRoles(data.roles);
      }
    } catch (error) {
      console.error("Error loading roles:", error);
      toast.error("Failed to load roles");
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/tools/role-based-access-controls", {
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
    }
  };

  const loadAuditLogs = async () => {
    try {
      const response = await fetch("/api/tools/role-based-access-controls", {
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
        const importedRoles = JSON.parse(content);

        if (!Array.isArray(importedRoles)) {
          throw new Error("Invalid format: expected an array of roles");
        }

        const response = await fetch("/api/tools/role-based-access-controls", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "importRoles",
            roles: importedRoles,
          }),
        });

        const data = await response.json();
        if (data.roles) {
          setRoles(data.roles);
          toast.success(`Imported ${importedRoles.length} roles successfully`);
          await loadAuditLogs();
        }
      } catch (error) {
        console.error("Error importing roles:", error);
        toast.error("Failed to import roles. Check file format.");
      } finally {
        setIsProcessing(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    reader.readAsText(file);
  };

  const addPermission = () => {
    if (!selectedResource || selectedActions.length === 0) {
      toast.error("Select resource and at least one action");
      return;
    }

    const existingIndex = permissions.findIndex(p => p.resource === selectedResource);
    if (existingIndex >= 0) {
      const updated = [...permissions];
      updated[existingIndex] = { resource: selectedResource, actions: selectedActions };
      setPermissions(updated);
    } else {
      setPermissions([...permissions, { resource: selectedResource, actions: selectedActions }]);
    }

    setSelectedResource("");
    setSelectedActions([]);
    toast.success("Permission added");
  };

  const removePermission = (resource: string) => {
    setPermissions(permissions.filter(p => p.resource !== resource));
  };

  const toggleAction = (action: string) => {
    if (selectedActions.includes(action)) {
      setSelectedActions(selectedActions.filter(a => a !== action));
    } else {
      setSelectedActions([...selectedActions, action]);
    }
  };

  const createOrUpdateRole = async () => {
    if (!roleName || permissions.length === 0) {
      toast.error("Role name and at least one permission required");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/tools/role-based-access-controls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: editingRoleId ? "updateRole" : "createRole",
          roleId: editingRoleId,
          name: roleName,
          description: roleDescription,
          permissions,
        }),
      });

      const data = await response.json();
      if (data.role) {
        await loadRoles();
        await loadAuditLogs();
        toast.success(`Role ${editingRoleId ? "updated" : "created"} successfully`);
        resetRoleForm();
      }
    } catch (error) {
      console.error("Error saving role:", error);
      toast.error("Failed to save role");
    } finally {
      setIsProcessing(false);
    }
  };

  const editRole = (role: Role) => {
    setEditingRoleId(role.id);
    setRoleName(role.name);
    setRoleDescription(role.description);
    setPermissions(role.permissions);
    setActiveTab("create");
  };

  const deleteRole = async (roleId: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;

    try {
      const response = await fetch("/api/tools/role-based-access-controls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "deleteRole",
          roleId,
        }),
      });

      if (response.ok) {
        await loadRoles();
        await loadAuditLogs();
        toast.success("Role deleted");
      }
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Failed to delete role");
    }
  };

  const assignRolesToUser = async () => {
    if (!selectedUser || selectedRoles.length === 0) {
      toast.error("Select user and at least one role");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/tools/role-based-access-controls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "assignRoles",
          userId: selectedUser,
          roleIds: selectedRoles,
        }),
      });

      const data = await response.json();
      if (data.user) {
        await loadUsers();
        await loadRoles();
        await loadAuditLogs();
        toast.success("Roles assigned successfully");
        setSelectedUser("");
        setSelectedRoles([]);
      }
    } catch (error) {
      console.error("Error assigning roles:", error);
      toast.error("Failed to assign roles");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetRoleForm = () => {
    setEditingRoleId(null);
    setRoleName("");
    setRoleDescription("");
    setPermissions([]);
    setSelectedResource("");
    setSelectedActions([]);
  };

  const exportRoles = () => {
    const dataStr = JSON.stringify(roles, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `roles-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Roles exported successfully");
  };

  const exportAuditLogs = () => {
    const dataStr = JSON.stringify(auditLogs, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Audit logs exported");
  };

  const stats = {
    totalRoles: roles.length,
    totalUsers: users.length,
    totalPermissions: roles.reduce((sum, role) => sum + role.permissions.length, 0),
    recentChanges: auditLogs.length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Roles</p>
                <p className="text-2xl font-bold">{stats.totalRoles}</p>
              </div>
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Permissions</p>
                <p className="text-2xl font-bold">{stats.totalPermissions}</p>
              </div>
              <Check className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Audit Logs</p>
                <p className="text-2xl font-bold">{stats.recentChanges}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role-based Access Controls</CardTitle>
          <CardDescription>
            Manage roles, permissions, user assignments, and audit access control changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="roles">Roles</TabsTrigger>
                <TabsTrigger value="create">Create/Edit Role</TabsTrigger>
                <TabsTrigger value="users">User Assignments</TabsTrigger>
                <TabsTrigger value="audit">Audit Logs</TabsTrigger>
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
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportRoles}
                  disabled={roles.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <TabsContent value="roles" className="space-y-4">
              {roles.length === 0 ? (
                <Alert>
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    No roles defined yet. Create your first role in the Create/Edit Role tab.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roles.map(role => (
                    <Card key={role.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{role.name}</CardTitle>
                            <CardDescription className="line-clamp-2">
                              {role.description}
                            </CardDescription>
                          </div>
                          <Badge variant="secondary">{role.userCount} users</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm font-semibold mb-2">Permissions:</p>
                          <div className="space-y-1">
                            {role.permissions.map(perm => (
                              <div key={perm.resource} className="text-xs">
                                <span className="font-medium">{perm.resource}:</span>{" "}
                                <span className="text-muted-foreground">
                                  {perm.actions.join(", ")}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-3 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => editRole(role)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteRole(role.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          Updated: {role.updatedAt}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="create" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {editingRoleId ? "Edit Role" : "Create New Role"}
                </h3>
                {editingRoleId && (
                  <Button variant="outline" size="sm" onClick={resetRoleForm}>
                    Cancel Edit
                  </Button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="roleName">Role Name *</Label>
                    <Input
                      id="roleName"
                      placeholder="e.g., Editor, Viewer, Admin"
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="roleDescription">Description</Label>
                    <Textarea
                      id="roleDescription"
                      placeholder="Describe what this role can do..."
                      value={roleDescription}
                      onChange={(e) => setRoleDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="p-4 border rounded-lg bg-muted">
                    <h4 className="font-semibold mb-3">Current Permissions</h4>
                    {permissions.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No permissions added yet
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {permissions.map(perm => (
                          <div
                            key={perm.resource}
                            className="flex items-center justify-between p-2 bg-background rounded"
                          >
                            <div>
                              <p className="font-medium text-sm">{perm.resource}</p>
                              <p className="text-xs text-muted-foreground">
                                {perm.actions.join(", ")}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removePermission(perm.resource)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Add Permissions</h4>
                  
                  <div>
                    <Label htmlFor="resource">Resource</Label>
                    <Select value={selectedResource} onValueChange={setSelectedResource}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select resource" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_RESOURCES.map(resource => (
                          <SelectItem key={resource} value={resource}>
                            {resource}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Actions</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {AVAILABLE_ACTIONS.map(action => (
                        <Button
                          key={action}
                          variant={selectedActions.includes(action) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleAction(action)}
                          className="justify-start"
                        >
                          {selectedActions.includes(action) && (
                            <Check className="w-3 h-3 mr-2" />
                          )}
                          {action}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button onClick={addPermission} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Permission
                  </Button>

                  <div className="pt-4 border-t">
                    <Button
                      onClick={createOrUpdateRole}
                      disabled={isProcessing}
                      className="w-full"
                      size="lg"
                    >
                      {editingRoleId ? "Update Role" : "Create Role"}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Assign Roles to User</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="selectUser">User</Label>
                      <Select value={selectedUser} onValueChange={setSelectedUser}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map(user => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name} ({user.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Roles</Label>
                      <div className="space-y-2 mt-2">
                        {roles.map(role => (
                          <label
                            key={role.id}
                            className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-muted"
                          >
                            <input
                              type="checkbox"
                              checked={selectedRoles.includes(role.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedRoles([...selectedRoles, role.id]);
                                } else {
                                  setSelectedRoles(selectedRoles.filter(id => id !== role.id));
                                }
                              }}
                              className="rounded"
                            />
                            <span className="text-sm">{role.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={assignRolesToUser}
                      disabled={isProcessing}
                      className="w-full"
                    >
                      Assign Roles
                    </Button>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <h3 className="font-semibold">Current User Assignments</h3>
                  {users.map(user => (
                    <Card key={user.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                          <Badge variant="secondary">{user.roles.length} roles</Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map(roleId => {
                            const role = roles.find(r => r.id === roleId);
                            return role ? (
                              <Badge key={roleId} variant="outline" className="text-xs">
                                {role.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="audit" className="space-y-4">
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportAuditLogs}
                  disabled={auditLogs.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Logs
                </Button>
              </div>

              {auditLogs.length === 0 ? (
                <Alert>
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    No audit logs yet. Actions will be recorded here.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  {auditLogs.map(log => (
                    <Card key={log.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Clock className="w-4 h-4 text-muted-foreground mt-1" />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold text-sm">{log.action}</p>
                                <p className="text-sm text-muted-foreground">
                                  {log.details}
                                </p>
                              </div>
                              <Badge variant="outline">{log.timestamp}</Badge>
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground">
                              Actor: {log.actor} | Target: {log.target}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
