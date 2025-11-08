"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ComplianceCheck {
  id: string;
  regulation: string;
  category: string;
  requirement: string;
  description: string;
  status: "compliant" | "non-compliant" | "partial" | "not-applicable";
  risk: "low" | "medium" | "high" | "critical";
  notes: string;
  evidence: string[];
}

interface PrivacyAssessment {
  id: string;
  name: string;
  regulation: string;
  status: "draft" | "in-progress" | "completed";
  progress: number;
  checks: ComplianceCheck[];
  score: number;
  recommendations: string[];
  createdAt: string;
}

const REGULATIONS = [
  { value: "gdpr", label: "GDPR (EU General Data Protection Regulation)" },
  { value: "ccpa", label: "CCPA (California Consumer Privacy Act)" },
  { value: "hipaa", label: "HIPAA (Health Insurance Portability and Accountability Act)" },
  { value: "pipeda", label: "PIPEDA (Personal Information Protection and Electronic Documents Act)" },
  { value: "lgpd", label: "LGPD (Brazil General Data Protection Law)" },
  { value: "pdpa", label: "PDPA (Singapore Personal Data Protection Act)" },
];

const COMPLIANCE_CHECKS = {
  gdpr: [
    {
      id: "gdpr-lawful-basis",
      category: "Legal Basis",
      requirement: "Lawful basis for processing personal data",
      description: "Establish and document lawful basis for all data processing activities"
    },
    {
      id: "gdpr-data-minimization",
      category: "Data Minimization",
      requirement: "Data minimization principle",
      description: "Only collect and process data that is necessary for the specified purpose"
    },
    {
      id: "gdpr-purpose-limitation",
      category: "Purpose Limitation",
      requirement: "Purpose limitation principle",
      description: "Data collected for specified, explicit, and legitimate purposes"
    },
    {
      id: "gdpr-storage-limitation",
      category: "Storage Limitation",
      requirement: "Storage limitation principle",
      description: "Personal data shall not be kept longer than necessary"
    },
    {
      id: "gdpr-accuracy",
      category: "Data Quality",
      requirement: "Accuracy principle",
      description: "Personal data shall be accurate and kept up to date"
    },
    {
      id: "gdpr-integrity",
      category: "Data Security",
      requirement: "Integrity and confidentiality principle",
      description: "Appropriate security measures to protect personal data"
    },
    {
      id: "gdpr-accountability",
      category: "Accountability",
      requirement: "Accountability principle",
      description: "Controller shall be responsible and able to demonstrate compliance"
    },
    {
      id: "gdpr-privacy-notice",
      category: "Transparency",
      requirement: "Privacy notice requirements",
      description: "Clear and comprehensive privacy information provided to data subjects"
    },
    {
      id: "gdpr-data-subject-rights",
      category: "Data Subject Rights",
      requirement: "Data subject rights implementation",
      description: "Rights to access, rectify, erase, restrict processing, data portability, and object"
    },
    {
      id: "gdpr-dpia",
      category: "Risk Assessment",
      requirement: "Data Protection Impact Assessment",
      description: "Conduct DPIA for high-risk processing activities"
    },
    {
      id: "gdpr-dpo",
      category: "Governance",
      requirement: "Data Protection Officer",
      description: "Appoint DPO where required by law or processing activities"
    },
    {
      id: "gdpr-breach-notification",
      category: "Incident Response",
      requirement: "Breach notification procedures",
      description: "72-hour notification requirement for personal data breaches"
    }
  ],
  ccpa: [
    {
      id: "ccpa-collection-disclosure",
      category: "Transparency",
      requirement: "Collection and disclosure notice",
      description: "Clear notice about personal information collected and shared"
    },
    {
      id: "ccpa-right-to-know",
      category: "Data Subject Rights",
      requirement: "Right to know",
      description: "Right to know what personal information is collected, used, and disclosed"
    },
    {
      id: "ccpa-right-to-delete",
      category: "Data Subject Rights",
      requirement: "Right to delete",
      description: "Right to delete personal information held by the business"
    },
    {
      id: "ccpa-right-to-correct",
      category: "Data Subject Rights",
      requirement: "Right to correct",
      description: "Right to correct inaccurate personal information"
    },
    {
      id: "ccpa-opt-out",
      category: "Data Subject Rights",
      requirement: "Right to opt-out",
      description: "Right to opt-out of sale and sharing of personal information"
    },
    {
      id: "ccpa-non-discrimination",
      category: "Non-Discrimination",
      requirement: "Non-discrimination policy",
      description: "Cannot discriminate against consumers for exercising CCPA rights"
    },
    {
      id: "ccpa-data-security",
      category: "Data Security",
      requirement: "Data security measures",
      description: "Reasonable security procedures to protect personal information"
    },
    {
      id: "ccpa-minors",
      category: "Children's Privacy",
      requirement: "Children's privacy protection",
      description: "Additional protections for personal information of minors under 16"
    }
  ],
  hipaa: [
    {
      id: "hipaa-privacy-rule",
      category: "Privacy Rule",
      requirement: "Privacy Rule compliance",
      description: "Standards for privacy of individually identifiable health information"
    },
    {
      id: "hipaa-security-rule",
      category: "Security Rule",
      requirement: "Security Rule compliance",
      description: "Standards for security of electronic protected health information"
    },
    {
      id: "hipaa-breach-notification",
      category: "Breach Notification",
      requirement: "Breach notification rule",
      description: "Notification requirements for breaches of unsecured protected health information"
    },
    {
      id: "hipaa-business-associate",
      category: "Business Associates",
      requirement: "Business Associate Agreements",
      description: "Contracts with business associates to ensure HIPAA compliance"
    },
    {
      id: "hipaa-risk-analysis",
      category: "Risk Management",
      requirement: "Risk analysis and management",
      description: "Regular risk analysis to identify and mitigate potential security threats"
    },
    {
      id: "hipaa-access-controls",
      category: "Access Controls",
      requirement: "Access controls implementation",
      description: "Implement policies and procedures for controlling access to ePHI"
    },
    {
      id: "hipaa-audit-controls",
      category: "Audit Controls",
      requirement: "Audit controls and monitoring",
      description: "Implement hardware, software, and procedural mechanisms for audit logging"
    },
    {
      id: "hipaa-person-designation",
      category: "Governance",
      requirement: "Privacy and Security Officer designation",
      description: "Designate individuals responsible for privacy and security programs"
    }
  ]
};

export default function PrivacyComplianceHelperClient() {
  const [assessments, setAssessments] = useState<PrivacyAssessment[]>([]);
  const [currentAssessment, setCurrentAssessment] = useState<PrivacyAssessment | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("assess");

  const createAssessment = useCallback((regulation: string, name: string) => {
    const checks = COMPLIANCE_CHECKS[regulation as keyof typeof COMPLIANCE_CHECKS]?.map(check => ({
      ...check,
      regulation,
      status: "not-applicable" as const,
      risk: "low" as const,
      notes: "",
      evidence: []
    })) || [];

    const newAssessment: PrivacyAssessment = {
      id: Date.now().toString(),
      name,
      regulation,
      status: "draft",
      progress: 0,
      checks,
      score: 0,
      recommendations: [],
      createdAt: new Date().toISOString()
    };

    setAssessments(prev => [...prev, newAssessment]);
    setCurrentAssessment(newAssessment);
  }, []);

  const updateCheckStatus = useCallback((checkId: string, status: ComplianceCheck["status"], risk: ComplianceCheck["risk"], notes: string) => {
    if (!currentAssessment) return;

    const updatedChecks = currentAssessment.checks.map(check =>
      check.id === checkId
        ? { ...check, status, risk, notes }
        : check
    );

    const completedChecks = updatedChecks.filter(check => check.status !== "not-applicable").length;
    const compliantChecks = updatedChecks.filter(check => check.status === "compliant").length;
    const progress = completedChecks > 0 ? (completedChecks / updatedChecks.length) * 100 : 0;
    const score = completedChecks > 0 ? (compliantChecks / completedChecks) * 100 : 0;

    const updatedAssessment: PrivacyAssessment = {
      ...currentAssessment,
      checks: updatedChecks,
      progress,
      score,
      status: progress === 100 ? "completed" : "in-progress"
    };

    setCurrentAssessment(updatedAssessment);
    setAssessments(prev => prev.map(a => a.id === updatedAssessment.id ? updatedAssessment : a));
  }, [currentAssessment]);

  const generateRecommendations = useCallback(() => {
    if (!currentAssessment) return;

    const recommendations: string[] = [];
    const nonCompliantChecks = currentAssessment.checks.filter(check => check.status === "non-compliant" || check.status === "partial");

    nonCompliantChecks.forEach(check => {
      switch (check.id) {
        case "gdpr-lawful-basis":
          recommendations.push("Document lawful basis for all data processing activities and implement consent management system");
          break;
        case "gdpr-data-minimization":
          recommendations.push("Review data collection practices and implement data minimization policies");
          break;
        case "gdpr-privacy-notice":
          recommendations.push("Update privacy notice to include all required GDPR information and make it easily accessible");
          break;
        case "ccpa-right-to-know":
          recommendations.push("Implement comprehensive data inventory and subject access request procedures");
          break;
        case "hipaa-security-rule":
          recommendations.push("Conduct security risk assessment and implement required administrative, physical, and technical safeguards");
          break;
        default:
          recommendations.push(`Address compliance gap in ${check.category}: ${check.requirement}`);
      }
    });

    const updatedAssessment: PrivacyAssessment = {
      ...currentAssessment,
      recommendations
    };

    setCurrentAssessment(updatedAssessment);
    setAssessments(prev => prev.map(a => a.id === updatedAssessment.id ? updatedAssessment : a));
  }, [currentAssessment]);

  const exportReport = useCallback(() => {
    if (!currentAssessment) return;

    const report = {
      assessment: currentAssessment,
      generatedAt: new Date().toISOString(),
      summary: {
        regulation: REGULATIONS.find(r => r.value === currentAssessment.regulation)?.label,
        overallScore: Math.round(currentAssessment.score),
        progress: Math.round(currentAssessment.progress),
        totalChecks: currentAssessment.checks.length,
        compliantChecks: currentAssessment.checks.filter(c => c.status === "compliant").length,
        nonCompliantChecks: currentAssessment.checks.filter(c => c.status === "non-compliant").length,
        highRiskItems: currentAssessment.checks.filter(c => c.risk === "high" || c.risk === "critical").length
      }
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `privacy-compliance-report-${currentAssessment.name.toLowerCase().replace(/\s+/g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [currentAssessment]);

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      setIsProcessing(true);
      setUploadedFile(file);

      const text = await file.text();

      // Send to API for heuristic analysis
      const res = await fetch("/api/tools/privacy-compliance-helper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ action: "analyze", fileName: file.name, content: text })
      });

      if (!res.ok) {
        console.error("Failed to analyze document", await res.text());
        setIsProcessing(false);
        return;
      }

      const assessment: PrivacyAssessment = await res.json();
      // set into state so UI shows results
      setAssessments(prev => [...prev, assessment]);
      setCurrentAssessment(assessment);
    } catch (err) {
      console.error("Error uploading file:", err);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Privacy Compliance Assessment</CardTitle>
          <CardDescription>
            Assess your organization's compliance with major privacy regulations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="assess">Assessment</TabsTrigger>
              <TabsTrigger value="checks">Compliance Checks</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="policies">Policy Generator</TabsTrigger>
            </TabsList>

            <TabsContent value="assess" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Create New Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="regulation">Privacy Regulation</Label>
                      <Select onValueChange={(value) => {
                        const name = `${REGULATIONS.find(r => r.value === value)?.label} Assessment`;
                        createAssessment(value, name);
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select regulation" />
                        </SelectTrigger>
                        <SelectContent>
                          {REGULATIONS.map(reg => (
                            <SelectItem key={reg.value} value={reg.value}>
                              {reg.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Upload Privacy Documents</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="file-upload">Privacy Policy, Data Processing Records, etc.</Label>
                      <Input
                        id="file-upload"
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,.html"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                        disabled={isProcessing}
                      />
                      {isProcessing && (
                        <div className="mt-2">
                          <Progress value={66} className="w-full" />
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            Analyzing document...
                          </p>
                        </div>
                      )}
                      {uploadedFile && !isProcessing && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                          ✓ {uploadedFile.name} uploaded successfully
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {currentAssessment && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Assessment: {currentAssessment.name}</CardTitle>
                    <div className="flex items-center gap-4">
                      <Badge variant={currentAssessment.status === "completed" ? "default" : "secondary"}>
                        {currentAssessment.status}
                      </Badge>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{Math.round(currentAssessment.progress)}%</span>
                        </div>
                        <Progress value={currentAssessment.progress} className="w-full" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round(currentAssessment.score)}%
                        </div>
                        <div className="text-xs text-slate-500">Compliance Score</div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="checks" className="space-y-6">
              {currentAssessment ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Compliance Checklist</h3>
                    <Button onClick={generateRecommendations} variant="outline">
                      Generate Recommendations
                    </Button>
                  </div>

                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                      {currentAssessment.checks.map((check) => (
                        <Card key={check.id}>
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium">{check.requirement}</h4>
                                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                    {check.description}
                                  </p>
                                  <Badge variant="outline" className="mt-2">
                                    {check.category}
                                  </Badge>
                                </div>
                                <div className="flex gap-2">
                                  <Select
                                    value={check.status}
                                    onValueChange={(value: ComplianceCheck["status"]) =>
                                      updateCheckStatus(check.id, value, check.risk, check.notes)
                                    }
                                  >
                                    <SelectTrigger className="w-32">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="compliant">Compliant</SelectItem>
                                      <SelectItem value="non-compliant">Non-compliant</SelectItem>
                                      <SelectItem value="partial">Partial</SelectItem>
                                      <SelectItem value="not-applicable">N/A</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Select
                                    value={check.risk}
                                    onValueChange={(value: ComplianceCheck["risk"]) =>
                                      updateCheckStatus(check.id, check.status, value, check.notes)
                                    }
                                  >
                                    <SelectTrigger className="w-24">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="low">Low</SelectItem>
                                      <SelectItem value="medium">Medium</SelectItem>
                                      <SelectItem value="high">High</SelectItem>
                                      <SelectItem value="critical">Critical</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <Textarea
                                placeholder="Add notes about this requirement..."
                                value={check.notes}
                                onChange={(e) =>
                                  updateCheckStatus(check.id, check.status, check.risk, e.target.value)
                                }
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <Alert>
                  <AlertTitle>No Assessment Selected</AlertTitle>
                  <AlertDescription>
                    Create a new assessment to view and manage compliance checks.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              {currentAssessment ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Compliance Report</h3>
                    <Button onClick={exportReport}>
                      Export Report
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600 mb-2">
                            {Math.round(currentAssessment.score)}%
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Overall Compliance Score
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600 mb-2">
                            {currentAssessment.checks.filter(c => c.status === "compliant").length}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Compliant Requirements
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-red-600 mb-2">
                            {currentAssessment.checks.filter(c => c.status === "non-compliant").length}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Non-Compliant Items
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {currentAssessment.recommendations.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {currentAssessment.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              <span className="text-sm">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Alert>
                  <AlertTitle>No Assessment Available</AlertTitle>
                  <AlertDescription>
                    Complete an assessment to generate compliance reports.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="policies" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Privacy Policy Generator</CardTitle>
                  <CardDescription>
                    Generate customized privacy policies based on your compliance needs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="policy-regulation">Regulation</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select regulation" />
                        </SelectTrigger>
                        <SelectContent>
                          {REGULATIONS.map(reg => (
                            <SelectItem key={reg.value} value={reg.value}>
                              {reg.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="policy-type">Policy Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="privacy-notice">Privacy Notice</SelectItem>
                          <SelectItem value="cookie-policy">Cookie Policy</SelectItem>
                          <SelectItem value="data-processing">Data Processing Agreement</SelectItem>
                          <SelectItem value="consent-form">Consent Form</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" placeholder="Enter your company name" />
                  </div>
                  <div>
                    <Label htmlFor="data-processing">Data Processing Activities</Label>
                    <Textarea
                      id="data-processing"
                      placeholder="Describe your data processing activities..."
                      rows={4}
                    />
                  </div>
                  <Button className="w-full">
                    Generate Privacy Policy
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}