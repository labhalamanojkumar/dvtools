import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

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

// Mock data for demonstration - in a real implementation, this would use a database
let assessments: Assessment[] = [];

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  {
    id: "recon-passive",
    phase: "Reconnaissance",
    category: "Information Gathering",
    title: "Passive Information Gathering",
    description: "Collect publicly available information about the target organization, domain, and infrastructure",
    completed: false,
    notes: "",
    severity: "info",
  },
  {
    id: "recon-active",
    phase: "Reconnaissance",
    category: "Information Gathering",
    title: "Active Information Gathering",
    description: "Perform active reconnaissance techniques including DNS enumeration and network scanning",
    completed: false,
    notes: "",
    severity: "low",
  },
  {
    id: "recon-fingerprinting",
    phase: "Reconnaissance",
    category: "Service Identification",
    title: "Service Fingerprinting",
    description: "Identify running services, versions, and potential vulnerabilities through banner grabbing",
    completed: false,
    notes: "",
    severity: "low",
  },
  {
    id: "scanning-port",
    phase: "Scanning",
    category: "Network Scanning",
    title: "Port Scanning",
    description: "Identify open ports and services using various scanning techniques",
    completed: false,
    notes: "",
    severity: "low",
  },
  {
    id: "scanning-vulnerability",
    phase: "Scanning",
    category: "Vulnerability Assessment",
    title: "Vulnerability Scanning",
    description: "Use automated tools to scan for known vulnerabilities in identified services",
    completed: false,
    notes: "",
    severity: "medium",
  },
  {
    id: "scanning-web",
    phase: "Scanning",
    category: "Web Application Scanning",
    title: "Web Application Scanning",
    description: "Scan web applications for common vulnerabilities and misconfigurations",
    completed: false,
    notes: "",
    severity: "medium",
  },
  {
    id: "gaining-access-web",
    phase: "Gaining Access",
    category: "Web Application Exploitation",
    title: "Web Application Exploitation",
    description: "Attempt to exploit identified web application vulnerabilities",
    completed: false,
    notes: "",
    severity: "high",
  },
  {
    id: "gaining-access-injection",
    phase: "Gaining Access",
    category: "Injection Attacks",
    title: "Injection Attacks",
    description: "Test for SQL injection, command injection, and other injection vulnerabilities",
    completed: false,
    notes: "",
    severity: "high",
  },
  {
    id: "gaining-access-auth",
    phase: "Gaining Access",
    category: "Authentication Testing",
    title: "Authentication Bypass",
    description: "Test for authentication weaknesses and bypass mechanisms",
    completed: false,
    notes: "",
    severity: "high",
  },
  {
    id: "maintaining-access-backdoor",
    phase: "Maintaining Access",
    category: "Post Exploitation",
    title: "Backdoor Installation",
    description: "Install persistent access mechanisms for continued assessment",
    completed: false,
    notes: "",
    severity: "critical",
  },
  {
    id: "maintaining-access-privilege",
    phase: "Maintaining Access",
    category: "Privilege Escalation",
    title: "Privilege Escalation",
    description: "Attempt to gain higher privileges on compromised systems",
    completed: false,
    notes: "",
    severity: "critical",
  },
  {
    id: "covering-tracks-logs",
    phase: "Covering Tracks",
    category: "Cleanup",
    title: "Log Manipulation",
    description: "Clear or manipulate system logs to cover testing activities",
    completed: false,
    notes: "",
    severity: "medium",
  },
  {
    id: "covering-tracks-evidence",
    phase: "Covering Tracks",
    category: "Cleanup",
    title: "Evidence Removal",
    description: "Remove tools, files, and other evidence of penetration testing",
    completed: false,
    notes: "",
    severity: "medium",
  },
  {
    id: "reporting-findings",
    phase: "Reporting",
    category: "Documentation",
    title: "Findings Documentation",
    description: "Document all vulnerabilities, exploits, and assessment results",
    completed: false,
    notes: "",
    severity: "info",
  },
  {
    id: "reporting-recommendations",
    phase: "Reporting",
    category: "Documentation",
    title: "Remediation Recommendations",
    description: "Provide detailed recommendations for fixing identified vulnerabilities",
    completed: false,
    notes: "",
    severity: "info",
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get("assessmentId");

    if (assessmentId) {
      const assessment = assessments.find(a => a.id === assessmentId);
      if (!assessment) {
        return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
      }
      return NextResponse.json(assessment);
    }

    return NextResponse.json(assessments);
  } catch (error) {
    console.error("Error fetching assessments:", error);
    return NextResponse.json(
      { error: "Failed to fetch assessments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, assessmentId, ...data } = body;

    switch (action) {
      case "create": {
        const newAssessment: Assessment = {
          id: Date.now().toString(),
          name: data.name,
          description: data.description || "",
          target: data.target,
          startDate: data.startDate || "",
          endDate: data.endDate || "",
          status: "planning",
          checklist: DEFAULT_CHECKLIST.map(item => ({ ...item })),
          issues: [],
          progress: 0,
        };

        assessments.push(newAssessment);
        return NextResponse.json(newAssessment);
      }

      case "update": {
        const assessmentIndex = assessments.findIndex(a => a.id === assessmentId);
        if (assessmentIndex === -1) {
          return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
        }

        assessments[assessmentIndex] = { ...assessments[assessmentIndex], ...data };

        // Recalculate progress if checklist was updated
        if (data.checklist) {
          const completedCount = data.checklist.filter((item: ChecklistItem) => item.completed).length;
          assessments[assessmentIndex].progress = (completedCount / data.checklist.length) * 100;
        }

        return NextResponse.json(assessments[assessmentIndex]);
      }

      case "add_issue": {
        const assessment = assessments.find(a => a.id === assessmentId);
        if (!assessment) {
          return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
        }

        const newIssue: Issue = {
          id: Date.now().toString(),
          title: data.title || "",
          description: data.description || "",
          severity: data.severity || "medium",
          status: "open",
          assignee: data.assignee || "",
          dueDate: data.dueDate || "",
          tags: data.tags || [],
          evidence: data.evidence || [],
          checklistItemId: data.checklistItemId,
        };

        assessment.issues.push(newIssue);
        return NextResponse.json(newIssue);
      }

      case "update_issue": {
        const assessment = assessments.find(a => a.id === assessmentId);
        if (!assessment) {
          return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
        }

        const issueIndex = assessment.issues.findIndex(i => i.id === data.issueId);
        if (issueIndex === -1) {
          return NextResponse.json({ error: "Issue not found" }, { status: 404 });
        }

        assessment.issues[issueIndex] = { ...assessment.issues[issueIndex], ...data };
        return NextResponse.json(assessment.issues[issueIndex]);
      }

      case "delete_issue": {
        const assessment = assessments.find(a => a.id === assessmentId);
        if (!assessment) {
          return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
        }

        assessment.issues = assessment.issues.filter(i => i.id !== data.issueId);
        return NextResponse.json({ success: true });
      }

      case "export": {
        const assessment = assessments.find(a => a.id === assessmentId);
        if (!assessment) {
          return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
        }

        return NextResponse.json(assessment);
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in penetration test checklist API:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get("assessmentId");

    if (!assessmentId) {
      return NextResponse.json({ error: "Assessment ID required" }, { status: 400 });
    }

    const assessmentIndex = assessments.findIndex(a => a.id === assessmentId);
    if (assessmentIndex === -1) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    assessments.splice(assessmentIndex, 1);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting assessment:", error);
    return NextResponse.json(
      { error: "Failed to delete assessment" },
      { status: 500 }
    );
  }
}