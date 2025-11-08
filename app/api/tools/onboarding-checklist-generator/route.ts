import { NextRequest, NextResponse } from "next/server";
import { EventEmitter } from "events";

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
  createdAt: string;
  updatedAt: string;
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
  author: string;
  isPublic: boolean;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  taskId?: string;
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
  lastActivity: string;
  assignedAt: string;
}

interface Notification {
  id: string;
  type: "assignment" | "reminder" | "completion" | "overdue" | "comment";
  message: string;
  userId: string;
  timestamp: string;
  read: boolean;
  relatedAssignmentId?: string;
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
  recentActivity: Array<{
    id: string;
    type: string;
    user: string;
    description: string;
    timestamp: string;
  }>;
  bottlenecks: Array<{
    taskTitle: string;
    completionRate: number;
    avgTime: number;
  }>;
}

interface BulkOperation {
  action: "complete" | "delete" | "update";
  assignmentIds: string[];
  taskIds?: string[];
  data?: any;
}

// Enhanced in-memory storage
const templates = new Map<string, ChecklistTemplate>();
const assignments = new Map<string, AssignedChecklist>();
const notifications = new Map<string, Notification[]>();
const activityLog = new Map<string, any>();

// WebSocket event emitter for real-time updates
const eventEmitter = new EventEmitter();

// Initialize with sample data
const initializeSampleData = () => {
  if (templates.size === 0) {
    const sampleTemplates: ChecklistTemplate[] = [
      {
        id: "1",
        name: "Software Engineer Onboarding",
        description: "Complete onboarding checklist for new software engineers",
        category: "employee",
        tasks: [
          {
            id: "t1",
            title: "Complete HR paperwork",
            description: "Fill out all required employment forms and tax documents",
            estimatedTime: "30 minutes",
            completed: false,
            priority: "high",
            category: "administrative",
            order: 0,
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
          },
          {
            id: "t2",
            title: "Set up development environment",
            description: "Install IDE, tools, and configure local development setup",
            estimatedTime: "2 hours",
            completed: false,
            priority: "high",
            category: "technical",
            order: 1,
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
          },
          {
            id: "t3",
            title: "Complete security training",
            description: "Watch security awareness videos and pass quiz",
            estimatedTime: "1 hour",
            completed: false,
            priority: "high",
            category: "training",
            order: 2,
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
          },
          {
            id: "t4",
            title: "Meet team members",
            description: "Schedule 1:1 meetings with immediate team and key stakeholders",
            estimatedTime: "2 hours",
            completed: false,
            priority: "medium",
            category: "social",
            order: 3,
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
          },
          {
            id: "t5",
            title: "Review codebase architecture",
            description: "Read documentation and explore main repositories",
            estimatedTime: "4 hours",
            completed: false,
            priority: "medium",
            category: "learning",
            order: 4,
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
          },
        ],
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        version: "2.1",
        tags: ["engineering", "technical", "development"],
        difficulty: "intermediate",
        estimatedTotalTime: "7.5 hours",
        author: "admin@example.com",
        isPublic: true,
      },
      {
        id: "2",
        name: "Customer Success Onboarding",
        description: "Customer onboarding for new platform users with comprehensive training",
        category: "customer",
        tasks: [
          {
            id: "t1",
            title: "Welcome email received",
            description: "Confirm receipt of welcome email and initial setup guide",
            estimatedTime: "5 minutes",
            completed: false,
            priority: "medium",
            category: "communication",
            order: 0,
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
          },
          {
            id: "t2",
            title: "Complete account setup",
            description: "Set up profile, preferences, and payment method",
            estimatedTime: "15 minutes",
            completed: false,
            priority: "high",
            category: "setup",
            order: 1,
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
          },
          {
            id: "t3",
            title: "Watch tutorial videos",
            description: "Complete getting started video series (30 minutes total)",
            estimatedTime: "30 minutes",
            completed: false,
            priority: "medium",
            category: "training",
            order: 2,
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
          },
          {
            id: "t4",
            title: "Create first project",
            description: "Set up your first project using the platform",
            estimatedTime: "1 hour",
            completed: false,
            priority: "high",
            category: "practice",
            order: 3,
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
          },
        ],
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        version: "1.5",
        tags: ["customer", "training", "support"],
        difficulty: "beginner",
        estimatedTotalTime: "1 hour 50 minutes",
        author: "admin@example.com",
        isPublic: true,
      },
      {
        id: "3",
        name: "Manager Leadership Onboarding",
        description: "Leadership onboarding for new managers with focus on team management",
        category: "employee",
        tasks: [
          {
            id: "t1",
            title: "Management training completion",
            description: "Complete required management training courses and certifications",
            estimatedTime: "4 hours",
            completed: false,
            priority: "high",
            category: "training",
            order: 0,
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
          },
          {
            id: "t2",
            title: "Review team structure",
            description: "Understand reporting structure and team dynamics",
            estimatedTime: "2 hours",
            completed: false,
            priority: "high",
            category: "planning",
            order: 1,
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
          },
          {
            id: "t3",
            title: "Set up 1:1s with direct reports",
            description: "Schedule recurring meetings with team members",
            estimatedTime: "1 hour",
            completed: false,
            priority: "medium",
            category: "communication",
            order: 2,
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
          },
          {
            id: "t4",
            title: "Review performance processes",
            description: "Learn about performance review and feedback systems",
            estimatedTime: "2 hours",
            completed: false,
            priority: "high",
            category: "process",
            order: 3,
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
          },
        ],
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        version: "1.8",
        tags: ["leadership", "management", "team"],
        difficulty: "advanced",
        estimatedTotalTime: "9 hours",
        author: "admin@example.com",
        isPublic: true,
      },
    ];

    sampleTemplates.forEach(template => templates.set(template.id, template));

    // Add sample assignments
    const template = templates.get("1");
    if (template) {
      const enhancedAssignment: AssignedChecklist = {
        id: "a1",
        templateId: template.id,
        templateName: template.name,
        assignedTo: "john.doe@example.com",
        assignedToName: "John Doe",
        assignedBy: "admin@example.com",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        startDate: new Date().toISOString().split("T")[0],
        assignedAt: new Date().toISOString(),
        status: "in-progress",
        progress: 60,
        tasks: template.tasks.map((task, index) => ({
          ...task,
          completed: index < 3,
          completedAt: index < 3 ? new Date().toISOString().split("T")[0] : undefined,
        })),
        notifications: true,
        comments: [
          {
            id: "c1",
            author: "John Doe",
            content: "Completed the development setup successfully!",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            taskId: "t2",
          },
        ],
        lastActivity: new Date().toISOString(),
      };
      assignments.set(enhancedAssignment.id, enhancedAssignment);

      // Initialize notifications
      notifications.set("john.doe@example.com", [
        {
          id: "n1",
          type: "assignment",
          message: `New checklist "${template.name}" assigned to you`,
          userId: "john.doe@example.com",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: false,
          relatedAssignmentId: enhancedAssignment.id,
        },
      ]);

      // Initialize activity log
      activityLog.set(enhancedAssignment.id, [
        {
          id: "a1",
          type: "assignment",
          user: "admin@example.com",
          description: `Assigned "${template.name}" to John Doe`,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "a2",
          type: "task_complete",
          user: "john.doe@example.com",
          description: 'Completed "Complete HR paperwork"',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
        },
      ]);
    }
  }
};

const calculateProgress = (tasks: ChecklistTask[]): number => {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.completed).length;
  return Math.round((completed / tasks.length) * 100);
};

const calculateStatus = (progress: number, dueDate: string): "not-started" | "in-progress" | "completed" | "overdue" => {
  if (progress === 100) return "completed";
  
  const now = new Date();
  const due = new Date(dueDate);
  
  if (now > due) return "overdue";
  if (progress === 0) return "not-started";
  return "in-progress";
};

const calculateAnalytics = (): AdvancedAnalytics => {
  const assignmentsList = Array.from(assignments.values());
  const completed = assignmentsList.filter(a => a.status === "completed");
  const overdue = assignmentsList.filter(a => a.status === "overdue");
  
  // Calculate average completion time for completed checklists
  let totalDays = 0;
  let completedCount = 0;
  
  completed.forEach(assignment => {
    if (assignment.completedDate) {
      const start = new Date(assignment.startDate).getTime();
      const end = new Date(assignment.completedDate).getTime();
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      totalDays += days;
      completedCount++;
    }
  });

  const avgCompletionTime = completedCount > 0 ? Math.round(totalDays / completedCount) : 0;
  
  // Count unique users
  const uniqueUsers = new Set(assignmentsList.map(a => a.assignedTo)).size;

  // Generate completion trend (last 7 days)
  const completionTrend = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const dayCompletions = completed.filter(a => a.completedDate === dateStr).length;
    completionTrend.push({ date: dateStr, count: dayCompletions });
  }

  // Category distribution
  const categoryStats = new Map<string, number>();
  templates.forEach(template => {
    const count = assignmentsList.filter(a => a.templateId === template.id).length;
    categoryStats.set(template.category, (categoryStats.get(template.category) || 0) + count);
  });

  // Priority distribution
  const priorityStats = new Map<string, number>();
  assignmentsList.forEach(assignment => {
    assignment.tasks.forEach(task => {
      const count = priorityStats.get(task.priority) || 0;
      priorityStats.set(task.priority, count + 1);
    });
  });

  // Team performance
  const teamStats = new Map<string, { completed: number; total: number }>();
  assignmentsList.forEach(assignment => {
    const stats = teamStats.get(assignment.assignedToName) || { completed: 0, total: 0 };
    stats.total += 1;
    if (assignment.status === "completed") stats.completed += 1;
    teamStats.set(assignment.assignedToName, stats);
  });

  // Recent activity (last 10 activities)
  const recentActivity: Array<{
    id: string;
    type: string;
    user: string;
    description: string;
    timestamp: string;
  }> = [];
  activityLog.forEach((activities, assignmentId) => {
    activities.forEach((activity: any) => {
      recentActivity.push(activity);
    });
  });
  recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Calculate bottlenecks
  const bottlenecks: Array<{
    taskTitle: string;
    completionRate: number;
    avgTime: number;
  }> = [];
  templates.forEach(template => {
    const templateAssignments = assignmentsList.filter(a => a.templateId === template.id);
    if (templateAssignments.length > 0) {
      template.tasks.forEach(task => {
        const taskCompletionRate = templateAssignments.filter(a =>
          a.tasks.find(t => t.id === task.id && t.completed)
        ).length / templateAssignments.length;
        
        bottlenecks.push({
          taskTitle: task.title,
          completionRate: Math.round(taskCompletionRate * 100),
          avgTime: parseInt(task.estimatedTime) || 0,
        });
      });
    }
  });

  return {
    totalChecklists: assignmentsList.length,
    completedChecklists: completed.length,
    completionRate: assignmentsList.length > 0
      ? Math.round((completed.length / assignmentsList.length) * 100)
      : 0,
    avgCompletionTime,
    activeUsers: uniqueUsers,
    overdueCount: overdue.length,
    completionTrend,
    categoryDistribution: Array.from(categoryStats.entries()).map(([category, count]) => ({ category, count })),
    priorityDistribution: Array.from(priorityStats.entries()).map(([priority, count]) => ({ priority, count })),
    teamPerformance: Array.from(teamStats.entries()).map(([user, stats]) => ({ user, ...stats })),
    recentActivity: recentActivity.slice(0, 10),
    bottlenecks: bottlenecks.slice(0, 5),
  };
};

export async function POST(request: NextRequest) {
  initializeSampleData();

  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "getTemplates": {
        return NextResponse.json({
          templates: Array.from(templates.values()).sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          ),
        });
      }

      case "createTemplate": {
        const { name, description, category, tasks } = body;
        
        const template: ChecklistTemplate = {
          id: Date.now().toString(),
          name,
          description,
          category,
          tasks: tasks.map((task: ChecklistTask) => ({
            ...task,
            completed: false,
            priority: task.priority || "medium",
            category: task.category || "general",
            order: task.order || 0,
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
          })),
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
          version: "1.0",
          tags: [],
          difficulty: "intermediate",
          estimatedTotalTime: "1 hour",
          author: "admin@example.com",
          isPublic: true,
        };

        templates.set(template.id, template);

        return NextResponse.json({ template });
      }

      case "updateTemplate": {
        const { templateId, name, description, category, tasks } = body;
        
        const template = templates.get(templateId);
        if (!template) {
          return NextResponse.json({ error: "Template not found" }, { status: 404 });
        }

        template.name = name;
        template.description = description;
        template.category = category;
        template.tasks = tasks.map((task: ChecklistTask) => ({
          ...task,
          completed: false,
        }));
        template.updatedAt = new Date().toISOString().split("T")[0];

        templates.set(templateId, template);

        return NextResponse.json({ template });
      }

      case "deleteTemplate": {
        const { templateId } = body;
        
        // Check if template is in use
        const inUse = Array.from(assignments.values()).some(a => a.templateId === templateId);
        if (inUse) {
          return NextResponse.json(
            { error: "Cannot delete template that is currently assigned" },
            { status: 400 }
          );
        }

        templates.delete(templateId);

        return NextResponse.json({ success: true });
      }

      case "importTemplates": {
        const { templates: importedTemplates } = body;

        importedTemplates.forEach((template: ChecklistTemplate) => {
          const newTemplate: ChecklistTemplate = {
            ...template,
            id: Date.now().toString() + Math.random().toString(36).substring(7),
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
          };
          templates.set(newTemplate.id, newTemplate);
        });

        return NextResponse.json({
          templates: Array.from(templates.values()),
        });
      }

      case "getAssignments": {
        return NextResponse.json({
          assignments: Array.from(assignments.values()).sort((a, b) => 
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          ),
        });
      }

      case "assignChecklist": {
        const { templateId, assigneeName, assigneeEmail, dueDate } = body;
        
        const template = templates.get(templateId);
        if (!template) {
          return NextResponse.json({ error: "Template not found" }, { status: 404 });
        }

        const assignment: AssignedChecklist = {
          id: Date.now().toString(),
          templateId: template.id,
          templateName: template.name,
          assignedTo: assigneeEmail,
          assignedToName: assigneeName,
          assignedBy: "admin@example.com", // In production, get from auth session
          dueDate,
          startDate: new Date().toISOString().split("T")[0],
          assignedAt: new Date().toISOString(),
          status: "not-started",
          progress: 0,
          tasks: template.tasks.map(task => ({
            ...task,
            completed: false,
          })),
          notifications: true,
          comments: [],
          lastActivity: new Date().toISOString(),
        };

        assignments.set(assignment.id, assignment);

        return NextResponse.json({ assignment });
      }

      case "toggleTask": {
        const { assignmentId, taskId } = body;
        
        const assignment = assignments.get(assignmentId);
        if (!assignment) {
          return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
        }

        const task = assignment.tasks.find(t => t.id === taskId);
        if (task) {
          task.completed = !task.completed;
          task.completedAt = task.completed
            ? new Date().toISOString().split("T")[0]
            : undefined;
          task.updatedAt = new Date().toISOString().split("T")[0];
        }

        assignment.progress = calculateProgress(assignment.tasks);
        assignment.status = calculateStatus(assignment.progress, assignment.dueDate);
        assignment.lastActivity = new Date().toISOString();
        
        if (assignment.status === "completed" && !assignment.completedDate) {
          assignment.completedDate = new Date().toISOString().split("T")[0];
        } else if (assignment.status !== "completed") {
          assignment.completedDate = undefined;
        }

        assignments.set(assignmentId, assignment);

        // Add activity log
        addActivityLog(assignment.id, {
          type: "task_" + (task?.completed ? "complete" : "reopen"),
          user: assignment.assignedToName,
          description: `${task?.completed ? "Completed" : "Reopened"} "${task?.title}"`,
          timestamp: new Date().toISOString(),
        });

        return NextResponse.json({ assignment });
      }

      case "addComment": {
        const { assignmentId, taskId, content } = body;
        
        const assignment = assignments.get(assignmentId);
        if (!assignment) {
          return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
        }

        const comment: Comment = {
          id: Date.now().toString(),
          author: "admin@example.com", // In production, get from auth session
          content,
          timestamp: new Date().toISOString(),
          taskId,
        };

        assignment.comments.push(comment);
        assignment.lastActivity = new Date().toISOString();
        assignments.set(assignmentId, assignment);

        // Add activity log
        addActivityLog(assignmentId, {
          type: "comment",
          user: comment.author,
          description: `Added comment: ${content.substring(50)}...`,
          timestamp: new Date().toISOString(),
        });

        return NextResponse.json({ success: true });
      }

      case "getAdvancedAnalytics": {
        const analytics = calculateAnalytics();
        return NextResponse.json({ analytics });
      }

      case "getAnalytics": {
        const analytics = calculateAnalytics();
        return NextResponse.json({ analytics });
      }

      case "getNotifications": {
        const { userId } = body;
        const userNotifications = notifications.get(userId) || [];
        return NextResponse.json({ notifications: userNotifications });
      }

      case "markNotificationRead": {
        const { notificationId, userId } = body;
        const userNotifications = notifications.get(userId) || [];
        const notification = userNotifications.find(n => n.id === notificationId);
        if (notification) {
          notification.read = true;
          notifications.set(userId, userNotifications);
        }
        return NextResponse.json({ success: true });
      }

      case "reorderTasks": {
        const { templateId, taskOrder } = body;
        
        const template = templates.get(templateId);
        if (!template) {
          return NextResponse.json({ error: "Template not found" }, { status: 404 });
        }

        const reorderedTasks = taskOrder.map((taskId: string, index: number) => {
          const task = template.tasks.find(t => t.id === taskId);
          if (task) {
            task.order = index;
            task.updatedAt = new Date().toISOString().split("T")[0];
          }
          return task;
        }).filter(Boolean);

        template.tasks = reorderedTasks;
        template.updatedAt = new Date().toISOString().split("T")[0];
        templates.set(templateId, template);

        return NextResponse.json({ template });
      }

      case "exportTemplates": {
        const { format } = body;
        const allTemplates = Array.from(templates.values());
        
        switch (format) {
          case "json":
            return NextResponse.json({
              data: JSON.stringify(allTemplates, null, 2),
              filename: `templates-${new Date().toISOString().split('T')[0]}.json`,
              contentType: "application/json"
            });
            
          case "csv":
            const csvHeaders = "ID,Name,Description,Category,Difficulty,Version,Tags,Estimated Time,Created At,Updated At\n";
            const csvRows = allTemplates.map(template =>
              `"${template.id}","${template.name}","${template.description}","${template.category}","${template.difficulty}","${template.version}","${template.tags.join(', ')}","${template.estimatedTotalTime}","${template.createdAt}","${template.updatedAt}"`
            ).join('\n');
            
            return NextResponse.json({
              data: csvHeaders + csvRows,
              filename: `templates-${new Date().toISOString().split('T')[0]}.csv`,
              contentType: "text/csv"
            });
            
          default:
            return NextResponse.json({ error: "Unsupported format" }, { status: 400 });
        }
      }

      case "getActivityLog": {
        const { assignmentId } = body;
        const activities = activityLog.get(assignmentId) || [];
        return NextResponse.json({ activities });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in onboarding-checklist-generator API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper functions for enhanced features
const broadcastUpdate = (type: string, data: any) => {
  eventEmitter.emit('update', { type, data, timestamp: new Date().toISOString() });
};

const createNotification = (userId: string, notification: Omit<Notification, 'id'>) => {
  const userNotifications = notifications.get(userId) || [];
  const newNotification = {
    id: Date.now().toString(),
    ...notification,
  };
  userNotifications.unshift(newNotification);
  notifications.set(userId, userNotifications);
  broadcastUpdate('notification', newNotification);
};

const addActivityLog = (assignmentId: string, activity: any) => {
  const assignmentActivities = activityLog.get(assignmentId) || [];
  assignmentActivities.unshift({
    id: Date.now().toString(),
    ...activity,
  });
  activityLog.set(assignmentId, assignmentActivities);
};
