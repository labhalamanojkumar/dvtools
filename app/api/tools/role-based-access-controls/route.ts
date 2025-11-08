import { NextRequest, NextResponse } from "next/server";

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

// In-memory storage (use database in production)
const rolesStore = new Map<string, Role>();
const usersStore = new Map<string, User>();
const auditLogsStore: AuditLog[] = [];

// Initialize with mock data
function initializeMockData() {
  if (rolesStore.size === 0) {
    const mockRoles: Role[] = [
      {
        id: "1",
        name: "Admin",
        description: "Full system access with all permissions",
        permissions: [
          { resource: "users", actions: ["create", "read", "update", "delete"] },
          { resource: "projects", actions: ["create", "read", "update", "delete"] },
          { resource: "settings", actions: ["create", "read", "update", "delete"] },
          { resource: "billing", actions: ["read", "update"] },
          { resource: "api_keys", actions: ["create", "read", "delete"] },
        ],
        userCount: 2,
        createdAt: "2024-01-10",
        updatedAt: "2024-01-15",
      },
      {
        id: "2",
        name: "Editor",
        description: "Can create and edit content, but not delete",
        permissions: [
          { resource: "projects", actions: ["create", "read", "update"] },
          { resource: "reports", actions: ["create", "read", "export"] },
          { resource: "analytics", actions: ["read"] },
        ],
        userCount: 5,
        createdAt: "2024-01-12",
        updatedAt: "2024-01-12",
      },
      {
        id: "3",
        name: "Viewer",
        description: "Read-only access to most resources",
        permissions: [
          { resource: "projects", actions: ["read"] },
          { resource: "reports", actions: ["read"] },
          { resource: "analytics", actions: ["read"] },
        ],
        userCount: 12,
        createdAt: "2024-01-08",
        updatedAt: "2024-01-08",
      },
      {
        id: "4",
        name: "Developer",
        description: "Access to development tools and API management",
        permissions: [
          { resource: "projects", actions: ["read", "update"] },
          { resource: "api_keys", actions: ["create", "read", "delete"] },
          { resource: "webhooks", actions: ["create", "read", "update", "delete"] },
          { resource: "integrations", actions: ["read", "execute"] },
        ],
        userCount: 8,
        createdAt: "2024-01-14",
        updatedAt: "2024-01-18",
      },
    ];

    mockRoles.forEach(role => rolesStore.set(role.id, role));

    // Initialize users
    const mockUsers: User[] = [
      {
        id: "1",
        email: "alice@example.com",
        name: "Alice Johnson",
        roles: ["1"],
      },
      {
        id: "2",
        email: "bob@example.com",
        name: "Bob Smith",
        roles: ["2", "4"],
      },
      {
        id: "3",
        email: "carol@example.com",
        name: "Carol Williams",
        roles: ["3"],
      },
      {
        id: "4",
        email: "david@example.com",
        name: "David Brown",
        roles: ["2"],
      },
      {
        id: "5",
        email: "eve@example.com",
        name: "Eve Davis",
        roles: ["4"],
      },
    ];

    mockUsers.forEach(user => usersStore.set(user.id, user));

    // Initialize audit logs
    const mockLogs: AuditLog[] = [
      {
        id: "1",
        action: "Role Created",
        actor: "admin@example.com",
        target: "Admin",
        details: "Created Admin role with full permissions",
        timestamp: "2024-01-10 09:00:00",
      },
      {
        id: "2",
        action: "Role Updated",
        actor: "admin@example.com",
        target: "Editor",
        details: "Added export permission to reports resource",
        timestamp: "2024-01-15 14:30:00",
      },
      {
        id: "3",
        action: "User Assigned",
        actor: "admin@example.com",
        target: "bob@example.com",
        details: "Assigned Editor and Developer roles",
        timestamp: "2024-01-16 10:15:00",
      },
      {
        id: "4",
        action: "Permission Added",
        actor: "admin@example.com",
        target: "Developer",
        details: "Added webhooks resource with full CRUD",
        timestamp: "2024-01-18 11:45:00",
      },
    ];

    auditLogsStore.push(...mockLogs);
  }
}

function addAuditLog(action: string, actor: string, target: string, details: string) {
  const log: AuditLog = {
    id: Date.now().toString(),
    action,
    actor,
    target,
    details,
    timestamp: new Date().toISOString().replace('T', ' ').split('.')[0],
  };
  auditLogsStore.unshift(log);
}

function updateRoleCounts() {
  // Reset counts
  rolesStore.forEach(role => {
    role.userCount = 0;
  });

  // Count users per role
  usersStore.forEach(user => {
    user.roles.forEach(roleId => {
      const role = rolesStore.get(roleId);
      if (role) {
        role.userCount++;
      }
    });
  });
}

export async function POST(request: NextRequest) {
  try {
    initializeMockData();

    const body = await request.json();
    const { action, roleId, name, description, permissions, userId, roleIds, roles: importedRoles } = body;

    switch (action) {
      case "getRoles": {
        updateRoleCounts();
        const roles = Array.from(rolesStore.values());
        return NextResponse.json({ roles });
      }

      case "getUsers": {
        const users = Array.from(usersStore.values());
        return NextResponse.json({ users });
      }

      case "getAuditLogs": {
        return NextResponse.json({ logs: auditLogsStore.slice(0, 50) });
      }

      case "createRole": {
        if (!name || !permissions || permissions.length === 0) {
          return NextResponse.json(
            { error: "Name and permissions are required" },
            { status: 400 }
          );
        }

        const id = Date.now().toString();
        const now = new Date().toISOString().split('T')[0];

        const role: Role = {
          id,
          name,
          description: description || "",
          permissions,
          userCount: 0,
          createdAt: now,
          updatedAt: now,
        };

        rolesStore.set(id, role);
        addAuditLog("Role Created", "admin@example.com", name, `Created role with ${permissions.length} permissions`);

        return NextResponse.json({ role });
      }

      case "updateRole": {
        if (!roleId) {
          return NextResponse.json(
            { error: "Role ID is required" },
            { status: 400 }
          );
        }

        const role = rolesStore.get(roleId);
        if (!role) {
          return NextResponse.json(
            { error: "Role not found" },
            { status: 404 }
          );
        }

        const updatedRole: Role = {
          ...role,
          name: name || role.name,
          description: description !== undefined ? description : role.description,
          permissions: permissions || role.permissions,
          updatedAt: new Date().toISOString().split('T')[0],
        };

        rolesStore.set(roleId, updatedRole);
        addAuditLog("Role Updated", "admin@example.com", updatedRole.name, "Updated role configuration");

        return NextResponse.json({ role: updatedRole });
      }

      case "deleteRole": {
        if (!roleId) {
          return NextResponse.json(
            { error: "Role ID is required" },
            { status: 400 }
          );
        }

        const role = rolesStore.get(roleId);
        if (!role) {
          return NextResponse.json(
            { error: "Role not found" },
            { status: 404 }
          );
        }

        // Remove role from all users
        usersStore.forEach(user => {
          user.roles = user.roles.filter(id => id !== roleId);
        });

        rolesStore.delete(roleId);
        addAuditLog("Role Deleted", "admin@example.com", role.name, "Deleted role and removed all assignments");

        return NextResponse.json({ success: true });
      }

      case "assignRoles": {
        if (!userId || !roleIds || roleIds.length === 0) {
          return NextResponse.json(
            { error: "User ID and role IDs are required" },
            { status: 400 }
          );
        }

        const user = usersStore.get(userId);
        if (!user) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }

        // Validate all role IDs exist
        const invalidRoles = roleIds.filter((id: string) => !rolesStore.has(id));
        if (invalidRoles.length > 0) {
          return NextResponse.json(
            { error: `Invalid role IDs: ${invalidRoles.join(", ")}` },
            { status: 400 }
          );
        }

        user.roles = roleIds;
        usersStore.set(userId, user);
        updateRoleCounts();

        const roleNames = roleIds.map((id: string) => rolesStore.get(id)?.name).join(", ");
        addAuditLog("Roles Assigned", "admin@example.com", user.email, `Assigned roles: ${roleNames}`);

        return NextResponse.json({ user });
      }

      case "importRoles": {
        if (!Array.isArray(importedRoles)) {
          return NextResponse.json(
            { error: "Roles must be an array" },
            { status: 400 }
          );
        }

        const now = new Date().toISOString().split('T')[0];
        let importCount = 0;

        importedRoles.forEach((importedRole, index) => {
          if (importedRole.name && importedRole.permissions) {
            const id = `${Date.now()}-${index}`;
            const role: Role = {
              id,
              name: importedRole.name,
              description: importedRole.description || "",
              permissions: importedRole.permissions,
              userCount: 0,
              createdAt: now,
              updatedAt: now,
            };
            rolesStore.set(id, role);
            importCount++;
          }
        });

        addAuditLog("Roles Imported", "admin@example.com", "System", `Imported ${importCount} roles`);
        updateRoleCounts();

        const roles = Array.from(rolesStore.values());
        return NextResponse.json({ roles });
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("RBAC error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
