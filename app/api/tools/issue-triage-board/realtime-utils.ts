import { EventEmitter } from "events";

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

interface Comment {
  id: string;
  issueId: string;
  author: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface Activity {
  id: string;
  issueId: string;
  user: string;
  action: string;
  details: string;
  timestamp: string;
}

// Global EventEmitter for real-time communication
export const eventEmitter = new EventEmitter();

// Global stores (in production, use proper database)
const commentsStore = new Map<string, Comment[]>();
const activityStore = new Map<string, Activity[]>();

// Utility functions for broadcasting events
export function broadcastIssueUpdate(issue: Issue, action: 'create' | 'update' | 'delete') {
  eventEmitter.emit('issue_' + (action === 'create' ? 'create' : action === 'delete' ? 'delete' : 'update'), { issue, action });
}

export function broadcastComment(comment: Comment) {
  eventEmitter.emit('comment_add', { comment });
}

export function broadcastActivity(activity: Activity) {
  eventEmitter.emit('activity_add', { activity });
}

export function broadcastSLAAlert(issue: Issue) {
  eventEmitter.emit('sla_alert', { issue });
}

// Utility functions for comments and activity
export function addComment(issueId: string, author: string, content: string): Comment {
  const comment: Comment = {
    id: Date.now().toString(),
    issueId,
    author,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const comments = commentsStore.get(issueId) || [];
  comments.push(comment);
  commentsStore.set(issueId, comments);

  broadcastComment(comment);
  return comment;
}

export function getComments(issueId: string): Comment[] {
  return commentsStore.get(issueId) || [];
}

export function addActivity(issueId: string, user: string, action: string, details: string): Activity {
  const activity: Activity = {
    id: Date.now().toString(),
    issueId,
    user,
    action,
    details,
    timestamp: new Date().toISOString()
  };

  const activities = activityStore.get(issueId) || [];
  activities.push(activity);
  activityStore.set(issueId, activities);

  broadcastActivity(activity);
  return activity;
}

export function getActivity(issueId: string): Activity[] {
  return activityStore.get(issueId) || [];
}

