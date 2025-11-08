import { NextRequest, NextResponse } from "next/server";
import {
  broadcastIssueUpdate,
  broadcastActivity,
  addComment,
  getComments,
  addActivity,
  getActivity,
  broadcastSLAAlert
} from "./realtime-utils";

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
  tags?: string[];
  components?: string[];
  version?: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  assignedCount: number;
  role: string;
  capacity: number;
}

interface SLAConfig {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

// In-memory storage (use database in production)
const issuesStore = new Map<string, Issue>();
const teamMembersStore = new Map<string, TeamMember>();

// SLA times in hours
const SLA_TIMES = {
  critical: 2,
  high: 8,
  medium: 24,
  low: 72,
};

// Initialize with mock data
function initializeMockData() {
  if (issuesStore.size === 0) {
    const mockIssues: Issue[] = [
      {
        id: "1",
        title: "Database Connection Timeout in Production",
        description: "Users are experiencing intermittent database connection timeouts during peak hours. Affecting approximately 15% of requests.",
        priority: "critical",
        status: "in_progress",
        assignee: "alice@example.com",
        errorDetails: "Error: Connection timeout\n  at pg.connect (pg.js:123)\n  at Database.query (database.js:45)",
        alertSource: "Datadog",
        ticketId: "JIRA-1234",
        createdAt: "2024-01-20 09:30:00",
        updatedAt: "2024-01-20 10:15:00",
        slaDeadline: "2024-01-20 11:30:00",
        slaStatus: "at-risk",
      },
      {
        id: "2",
        title: "API Rate Limit Errors on /users Endpoint",
        description: "Multiple clients reporting 429 errors. Current rate limit may be too restrictive for legitimate use cases.",
        priority: "high",
        status: "new",
        assignee: "bob@example.com",
        errorDetails: "HTTP 429: Rate limit exceeded (100 requests per minute)",
        alertSource: "New Relic",
        ticketId: "JIRA-1235",
        createdAt: "2024-01-20 08:00:00",
        updatedAt: "2024-01-20 08:00:00",
        slaDeadline: "2024-01-20 16:00:00",
        slaStatus: "on-track",
      },
      {
        id: "3",
        title: "Memory Leak in Image Processing Service",
        description: "Gradual memory increase over 24 hours leading to OOM crashes. Service needs restart every 12 hours.",
        priority: "high",
        status: "review",
        assignee: "alice@example.com",
        errorDetails: "Memory usage: 8GB → 14GB over 12 hours\nOOM Killed at 16GB",
        alertSource: "Prometheus",
        ticketId: "GH-567",
        createdAt: "2024-01-19 14:00:00",
        updatedAt: "2024-01-20 09:00:00",
        slaDeadline: "2024-01-19 22:00:00",
        slaStatus: "breached",
      },
      {
        id: "4",
        title: "Deprecated API Warning in Logs",
        description: "Using deprecated authentication method. Should migrate to OAuth 2.0 before EOL.",
        priority: "medium",
        status: "new",
        assignee: "",
        alertSource: "Application Logs",
        ticketId: "",
        createdAt: "2024-01-19 10:00:00",
        updatedAt: "2024-01-19 10:00:00",
        slaDeadline: "2024-01-20 10:00:00",
        slaStatus: "on-track",
      },
      {
        id: "5",
        title: "Slow Query Performance on Dashboard",
        description: "Dashboard load time increased from 2s to 15s. Database query needs optimization.",
        priority: "medium",
        status: "resolved",
        assignee: "bob@example.com",
        errorDetails: "Query execution time: 12.5s\nFull table scan on 10M rows",
        alertSource: "APM",
        ticketId: "JIRA-1230",
        createdAt: "2024-01-18 11:00:00",
        updatedAt: "2024-01-19 16:00:00",
        slaDeadline: "2024-01-19 11:00:00",
        slaStatus: "on-track",
      },
    ];

    mockIssues.forEach(issue => issuesStore.set(issue.id, issue));

    // Initialize team members
    const mockTeamMembers: TeamMember[] = [
      {
        id: "1",
        name: "Alice Johnson",
        email: "alice@example.com",
        assignedCount: 2,
        role: "Senior Developer",
        capacity: 8,
      },
      {
        id: "2",
        name: "Bob Smith",
        email: "bob@example.com",
        assignedCount: 2,
        role: "Backend Developer",
        capacity: 6,
      },
      {
        id: "3",
        name: "Carol Williams",
        email: "carol@example.com",
        assignedCount: 0,
        role: "Frontend Developer",
        capacity: 5,
      },
    ];

    mockTeamMembers.forEach(member => teamMembersStore.set(member.email, member));
  }
}

function calculateSLA(priority: Priority, createdAt: string): { deadline: string; status: "on-track" | "at-risk" | "breached" } {
  const created = new Date(createdAt);
  const slaHours = SLA_TIMES[priority];
  const deadline = new Date(created.getTime() + slaHours * 60 * 60 * 1000);
  const now = new Date();
  
  const timeRemaining = deadline.getTime() - now.getTime();
  const hoursRemaining = timeRemaining / (60 * 60 * 1000);
  
  let status: "on-track" | "at-risk" | "breached";
  if (timeRemaining < 0) {
    status = "breached";
  } else if (hoursRemaining < slaHours * 0.25) {
    status = "at-risk";
  } else {
    status = "on-track";
  }

  return {
    deadline: deadline.toISOString().replace('T', ' ').split('.')[0],
    status,
  };
}

function updateTeamMemberCounts() {
  // Reset counts
  teamMembersStore.forEach(member => {
    member.assignedCount = 0;
  });

  // Count assigned issues
  issuesStore.forEach(issue => {
    if (issue.assignee && teamMembersStore.has(issue.assignee)) {
      const member = teamMembersStore.get(issue.assignee)!;
      member.assignedCount++;
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    initializeMockData();

    const body = await request.json();
    const { action, issueId, title, description, priority, status, assignee, errorDetails, alertSource, ticketId, issues: importedIssues } = body;

    switch (action) {
      case "getIssues": {
        const issues = Array.from(issuesStore.values());
        return NextResponse.json({ issues });
      }

      case "getTeamMembers": {
        updateTeamMemberCounts();
        const teamMembers = Array.from(teamMembersStore.values());
        return NextResponse.json({ teamMembers });
      }

      case "createIssue": {
        if (!title || !description) {
          return NextResponse.json(
            { error: "Title and description are required" },
            { status: 400 }
          );
        }

        const id = Date.now().toString();
        const createdAt = new Date().toISOString().replace('T', ' ').split('.')[0];
        const sla = calculateSLA(priority || "medium", createdAt);

        const issue: Issue = {
          id,
          title,
          description,
          priority: priority || "medium",
          status: "new",
          assignee: assignee || "",
          errorDetails,
          alertSource,
          ticketId,
          createdAt,
          updatedAt: createdAt,
          slaDeadline: sla.deadline,
          slaStatus: sla.status,
        };

        issuesStore.set(id, issue);
        updateTeamMemberCounts();

        // Broadcast real-time update
        broadcastIssueUpdate(issue, 'create');
        
        // Log activity
        addActivity(id, assignee || 'System', 'create', `Created issue: ${title}`);

        return NextResponse.json({ issue });
      }

      case "updateIssue": {
        if (!issueId) {
          return NextResponse.json(
            { error: "Issue ID is required" },
            { status: 400 }
          );
        }

        const issue = issuesStore.get(issueId);
        if (!issue) {
          return NextResponse.json(
            { error: "Issue not found" },
            { status: 404 }
          );
        }

        const updatedAt = new Date().toISOString().replace('T', ' ').split('.')[0];

        let oldSLAStatus = issue.slaStatus;
        
        // Update fields if provided
        if (priority) {
          issue.priority = priority;
          // Recalculate SLA if priority changes
          const sla = calculateSLA(priority, issue.createdAt);
          issue.slaDeadline = sla.deadline;
          issue.slaStatus = sla.status;
        }
        if (status) issue.status = status;
        if (assignee !== undefined) issue.assignee = assignee;
        
        issue.updatedAt = updatedAt;

        issuesStore.set(issueId, issue);
        
        // Check if SLA status changed and broadcast alert if needed
        if (priority && oldSLAStatus !== issue.slaStatus) {
          if (issue.slaStatus === 'breached') {
            broadcastSLAAlert(issue);
          }
        }
        
        updateTeamMemberCounts();
        
        // Log activity
        const actionDetails = [];
        if (priority) actionDetails.push(`priority to ${priority}`);
        if (status) actionDetails.push(`status to ${status}`);
        if (assignee !== undefined) actionDetails.push(`assignee to ${assignee || 'unassigned'}`);
        
        if (actionDetails.length > 0) {
          addActivity(issueId, 'System', 'update', `Updated ${actionDetails.join(', ')}`);
        }

        // Broadcast real-time update
        broadcastIssueUpdate(issue, 'update');

        return NextResponse.json({ issue });
      }

      case "deleteIssue": {
        if (!issueId) {
          return NextResponse.json(
            { error: "Issue ID is required" },
            { status: 400 }
          );
        }

        const deletedIssue = issuesStore.get(issueId);
        issuesStore.delete(issueId);
        updateTeamMemberCounts();
        
        if (deletedIssue) {
          // Log activity
          addActivity(issueId, 'System', 'delete', `Deleted issue: ${deletedIssue.title}`);
          
          // Broadcast real-time update
          broadcastIssueUpdate(deletedIssue, 'delete');
        }

        return NextResponse.json({ success: true });
      }

      case "importIssues": {
        if (!Array.isArray(importedIssues)) {
          return NextResponse.json(
            { error: "Issues must be an array" },
            { status: 400 }
          );
        }

        const createdAt = new Date().toISOString().replace('T', ' ').split('.')[0];

        importedIssues.forEach((importedIssue, index) => {
          const id = `${Date.now()}-${index}`;
          const priority = (importedIssue.priority || "medium") as Priority;
          const sla = calculateSLA(priority, createdAt);

          const issue: Issue = {
            id,
            title: importedIssue.title || "Untitled Issue",
            description: importedIssue.description || "",
            priority,
            status: (importedIssue.status || "new") as Status,
            assignee: importedIssue.assignee || "",
            errorDetails: importedIssue.errorDetails,
            alertSource: importedIssue.alertSource,
            ticketId: importedIssue.ticketId,
            createdAt,
            updatedAt: createdAt,
            slaDeadline: sla.deadline,
            slaStatus: sla.status,
          };

          issuesStore.set(id, issue);
        });

        updateTeamMemberCounts();
        const issues = Array.from(issuesStore.values());

        return NextResponse.json({ issues });
      }

      case "addComment": {
        const { issueId, author, content } = body;
        if (!issueId || !content) {
          return NextResponse.json(
            { error: "Issue ID and content are required" },
            { status: 400 }
          );
        }

        const comment = addComment(issueId, author || "Anonymous", content);
        return NextResponse.json({ comment });
      }

      case "getComments": {
        const { issueId } = body;
        if (!issueId) {
          return NextResponse.json(
            { error: "Issue ID is required" },
            { status: 400 }
          );
        }

        const comments = getComments(issueId);
        return NextResponse.json({ comments });
      }

      case "getActivity": {
        const { issueId } = body;
        if (!issueId) {
          return NextResponse.json(
            { error: "Issue ID is required" },
            { status: 400 }
          );
        }

        const activity = getActivity(issueId);
        return NextResponse.json({ activity });
      }

      case "bulkUpdate": {
        const { issueIds, updates } = body;
        if (!Array.isArray(issueIds) || !updates) {
          return NextResponse.json(
            { error: "Issue IDs array and updates object are required" },
            { status: 400 }
          );
        }

        const updatedIssues: Issue[] = [];
        issueIds.forEach(issueId => {
          const issue = issuesStore.get(issueId);
          if (issue) {
            const oldSLAStatus = issue.slaStatus;
            
            // Apply updates
            if (updates.priority) issue.priority = updates.priority;
            if (updates.status) issue.status = updates.status;
            if (updates.assignee !== undefined) issue.assignee = updates.assignee;
            
            issue.updatedAt = new Date().toISOString().replace('T', ' ').split('.')[0];
            
            // Recalculate SLA if priority changed
            if (updates.priority) {
              const sla = calculateSLA(updates.priority, issue.createdAt);
              issue.slaDeadline = sla.deadline;
              issue.slaStatus = sla.status;
              
              // Check for SLA breach alerts
              if (issue.slaStatus === 'breached' && oldSLAStatus !== 'breached') {
                broadcastSLAAlert(issue);
              }
            }

            issuesStore.set(issueId, issue);
            updatedIssues.push(issue);

            // Log activity
            const actionDetails = [];
            if (updates.priority) actionDetails.push(`priority to ${updates.priority}`);
            if (updates.status) actionDetails.push(`status to ${updates.status}`);
            if (updates.assignee !== undefined) actionDetails.push(`assignee to ${updates.assignee || 'unassigned'}`);
            
            if (actionDetails.length > 0) {
              addActivity(issueId, 'System', 'bulk_update', `Bulk updated ${actionDetails.join(', ')}`);
            }
          }
        });

        updateTeamMemberCounts();
        
        // Broadcast real-time update for bulk operation
        updatedIssues.forEach(issue => {
          broadcastIssueUpdate(issue, 'update');
        });

        return NextResponse.json({ issues: updatedIssues, count: updatedIssues.length });
      }

      case "bulkDelete": {
        const { issueIds } = body;
        if (!Array.isArray(issueIds)) {
          return NextResponse.json(
            { error: "Issue IDs array is required" },
            { status: 400 }
          );
        }

        const deletedIssues: Issue[] = [];
        issueIds.forEach(issueId => {
          const issue = issuesStore.get(issueId);
          if (issue) {
            issuesStore.delete(issueId);
            deletedIssues.push(issue);
            
            // Log activity
            addActivity(issueId, 'System', 'bulk_delete', `Deleted issue: ${issue.title}`);
          }
        });

        updateTeamMemberCounts();
        
        // Broadcast real-time update for bulk delete
        deletedIssues.forEach(issue => {
          broadcastIssueUpdate(issue, 'delete');
        });

        return NextResponse.json({ success: true, count: deletedIssues.length });
      }

      case "searchIssues": {
        const { query, filters } = body;
        let filteredIssues = Array.from(issuesStore.values());

        // Text search
        if (query && query.trim()) {
          const searchTerm = query.toLowerCase();
          filteredIssues = filteredIssues.filter(issue =>
            issue.title.toLowerCase().includes(searchTerm) ||
            issue.description.toLowerCase().includes(searchTerm) ||
            (issue.errorDetails && issue.errorDetails.toLowerCase().includes(searchTerm))
          );
        }

        // Apply filters
        if (filters) {
          if (filters.priority && filters.priority !== 'all') {
            filteredIssues = filteredIssues.filter(issue => issue.priority === filters.priority);
          }
          if (filters.status && filters.status !== 'all') {
            filteredIssues = filteredIssues.filter(issue => issue.status === filters.status);
          }
          if (filters.assignee && filters.assignee !== 'all') {
            filteredIssues = filteredIssues.filter(issue =>
              (filters.assignee === 'unassigned' && !issue.assignee) ||
              issue.assignee === filters.assignee
            );
          }
          if (filters.slaStatus && filters.slaStatus !== 'all') {
            filteredIssues = filteredIssues.filter(issue => issue.slaStatus === filters.slaStatus);
          }
        }

        return NextResponse.json({ issues: filteredIssues });
      }

      case "getAnalytics": {
        const issues = Array.from(issuesStore.values());
        const analytics = {
          total: issues.length,
          byPriority: {
            critical: issues.filter(i => i.priority === 'critical').length,
            high: issues.filter(i => i.priority === 'high').length,
            medium: issues.filter(i => i.priority === 'medium').length,
            low: issues.filter(i => i.priority === 'low').length,
          },
          byStatus: {
            new: issues.filter(i => i.status === 'new').length,
            in_progress: issues.filter(i => i.status === 'in_progress').length,
            review: issues.filter(i => i.status === 'review').length,
            resolved: issues.filter(i => i.status === 'resolved').length,
          },
          bySLA: {
            'on-track': issues.filter(i => i.slaStatus === 'on-track').length,
            'at-risk': issues.filter(i => i.slaStatus === 'at-risk').length,
            breached: issues.filter(i => i.slaStatus === 'breached').length,
          },
          avgResolutionTime: calculateAverageResolutionTime(issues),
          trendData: calculateTrendData(issues),
        };

        return NextResponse.json({ analytics });
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Issue triage board error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function calculateAverageResolutionTime(issues: Issue[]): number {
  const resolvedIssues = issues.filter(issue => issue.status === 'resolved');
  if (resolvedIssues.length === 0) return 0;

  const totalTime = resolvedIssues.reduce((sum, issue) => {
    const created = new Date(issue.createdAt);
    const resolved = new Date(issue.updatedAt);
    return sum + (resolved.getTime() - created.getTime());
  }, 0);

  return Math.round(totalTime / resolvedIssues.length / (1000 * 60 * 60)); // hours
}

function calculateTrendData(issues: Issue[]): Array<{ date: string; created: number; resolved: number }> {
  const trendMap = new Map<string, { created: number; resolved: number }>();
  
  issues.forEach(issue => {
    const createdDate = issue.createdAt.split(' ')[0];
    const resolvedDate = issue.updatedAt.split(' ')[0];
    
    if (!trendMap.has(createdDate)) {
      trendMap.set(createdDate, { created: 0, resolved: 0 });
    }
    trendMap.get(createdDate)!.created++;
    
    if (resolvedDate !== createdDate) {
      if (!trendMap.has(resolvedDate)) {
        trendMap.set(resolvedDate, { created: 0, resolved: 0 });
      }
      trendMap.get(resolvedDate)!.resolved++;
    }
  });

  return Array.from(trendMap.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7); // Last 7 days
}
