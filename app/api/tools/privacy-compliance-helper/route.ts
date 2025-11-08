import { NextRequest, NextResponse } from "next/server";

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
export const dynamic = 'force-dynamic';

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

// Mock data for demonstration - in a real implementation, this would use a database
let assessments: PrivacyAssessment[] = [];

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get("assessmentId");
    const regulation = searchParams.get("regulation");

    if (assessmentId) {
      const assessment = assessments.find(a => a.id === assessmentId);
      if (!assessment) {
        return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
      }
      return NextResponse.json(assessment);
    }

    if (regulation) {
      const checks = COMPLIANCE_CHECKS[regulation as keyof typeof COMPLIANCE_CHECKS] || [];
      return NextResponse.json(checks);
    }

    return NextResponse.json(assessments);
  } catch (error) {
    console.error("Error fetching privacy compliance data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
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
        const checks = COMPLIANCE_CHECKS[data.regulation as keyof typeof COMPLIANCE_CHECKS]?.map(check => ({
          ...check,
          regulation: data.regulation,
          status: "not-applicable" as const,
          risk: "low" as const,
          notes: "",
          evidence: []
        })) || [];

        const newAssessment: PrivacyAssessment = {
          id: Date.now().toString(),
          name: data.name,
          regulation: data.regulation,
          status: "draft",
          progress: 0,
          checks,
          score: 0,
          recommendations: [],
          createdAt: new Date().toISOString()
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

        // Recalculate progress and score if checks were updated
        if (data.checks) {
          const completedChecks = data.checks.filter((check: ComplianceCheck) => check.status !== "not-applicable").length;
          const compliantChecks = data.checks.filter((check: ComplianceCheck) => check.status === "compliant").length;
          assessments[assessmentIndex].progress = completedChecks > 0 ? (completedChecks / data.checks.length) * 100 : 0;
          assessments[assessmentIndex].score = completedChecks > 0 ? (compliantChecks / completedChecks) * 100 : 0;
        }

        return NextResponse.json(assessments[assessmentIndex]);
      }

      case "generate_recommendations": {
        const assessment = assessments.find(a => a.id === assessmentId);
        if (!assessment) {
          return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
        }

        const recommendations: string[] = [];
        const nonCompliantChecks = assessment.checks.filter(check =>
          check.status === "non-compliant" || check.status === "partial"
        );

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

        assessment.recommendations = recommendations;
        return NextResponse.json(assessment);
      }

      case "generate_policy": {
        const { regulation, type, companyName, dataProcessing } = data;

        // Mock policy generation - in a real implementation, this would use AI or templates
        const policyContent = generateMockPolicy(regulation, type, companyName, dataProcessing);

        return NextResponse.json({
          policy: policyContent,
          generatedAt: new Date().toISOString()
        });
      }

      case "analyze": {
        // Analyze uploaded document content heuristically and create an assessment
        const { fileName, content } = data as { fileName?: string; content?: string };

        const normalized = (content || "").toLowerCase();

        // simple heuristic to guess regulation
        let guessedRegulation = "gdpr";
        if (/hipaa|health|medical|eph/i.test(normalized)) guessedRegulation = "hipaa";
        else if (/california|ccpa|sale of personal information/i.test(normalized)) guessedRegulation = "ccpa";

        const checks = (COMPLIANCE_CHECKS[guessedRegulation as keyof typeof COMPLIANCE_CHECKS] || []).map(check => {
          // score each check by presence of keywords from requirement/description
          const text = `${check.requirement} ${check.description}`.toLowerCase();
          const keywords = text.split(/\W+/).filter(Boolean).slice(0, 8);
          let matches = 0;
          for (const kw of keywords) {
            if (kw.length > 3 && normalized.includes(kw)) matches++;
          }

          const status: ComplianceCheck["status"] = matches >= 2 ? "compliant" : matches === 1 ? "partial" : "non-compliant";

          return {
            ...check,
            regulation: guessedRegulation,
            status,
            risk: status === "non-compliant" ? "high" : status === "partial" ? "medium" : "low",
            notes: matches > 0 ? `Detected ${matches} hint(s) in document` : "",
            evidence: matches > 0 ? [fileName || "uploaded-document"] : []
          } as ComplianceCheck;
        });

        const newAssessment: PrivacyAssessment = {
          id: Date.now().toString(),
          name: fileName ? `Assessment - ${fileName}` : `Assessment ${new Date().toISOString()}`,
          regulation: guessedRegulation,
          status: "in-progress",
          progress: Math.round((checks.filter(c => c.status !== "non-compliant").length / checks.length) * 100),
          checks,
          score: Math.round((checks.filter(c => c.status === "compliant").length / checks.length) * 100),
          recommendations: [],
          createdAt: new Date().toISOString()
        };

        assessments.push(newAssessment);
        return NextResponse.json(newAssessment);
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in privacy compliance API:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

function generateMockPolicy(
  regulation: string,
  type: string,
  companyName: string,
  dataProcessing: string,
  websiteUrl?: string,
  contactEmail?: string,
  dataRetention?: string,
  thirdParties?: string,
  internationalTransfers?: boolean
): string {
  const currentDate = new Date().toLocaleDateString();
  const domain = websiteUrl || `${companyName.toLowerCase().replace(/\s+/g, "")}.com`;
  const email = contactEmail || `privacy@${domain}`;

  let policyContent = "";

  switch (type) {
    case "privacy-notice":
      policyContent = generatePrivacyNotice(regulation, companyName, dataProcessing, domain, email, currentDate, dataRetention, thirdParties, internationalTransfers);
      break;
    case "cookie-policy":
      policyContent = generateCookiePolicy(companyName, domain, email, currentDate);
      break;
    case "data-processing":
      policyContent = generateDataProcessingAgreement(regulation, companyName, dataProcessing, domain, email, currentDate);
      break;
    case "consent-form":
      policyContent = generateConsentForm(regulation, companyName, dataProcessing, domain, email, currentDate);
      break;
    case "privacy-policy":
      policyContent = generatePrivacyPolicy(regulation, companyName, dataProcessing, domain, email, currentDate, dataRetention, thirdParties, internationalTransfers);
      break;
    default:
      policyContent = generatePrivacyNotice(regulation, companyName, dataProcessing, domain, email, currentDate, dataRetention, thirdParties, internationalTransfers);
  }

  return policyContent;
}

function generatePrivacyNotice(
  regulation: string,
  companyName: string,
  dataProcessing: string,
  domain: string,
  email: string,
  currentDate: string,
  dataRetention?: string,
  thirdParties?: string,
  internationalTransfers?: boolean
): string {
  const regulationName = getRegulationFullName(regulation);

  return `# Privacy Notice

**${companyName}**

*Last updated: ${currentDate}*

## Introduction

This Privacy Notice describes how ${companyName} ("we," "us," or "our") collects, uses, discloses, and safeguards your information when you visit our website ${domain} or use our services. This notice complies with the ${regulationName}.

## Information We Collect

### Personal Information
${dataProcessing || "We collect personal information that you provide to us, including:"}
- Name and contact information
- Email address
- Phone number
- Payment information
- Usage data and preferences

### Automatically Collected Information
We automatically collect certain information when you visit our website, including:
- IP address and location information
- Browser type and version
- Operating system
- Referring website URLs
- Pages viewed and time spent on our site
- Device information

## How We Use Your Information

We use the collected information for the following purposes:
- To provide and maintain our services
- To process transactions and send related information
- To communicate with you about our services, updates, and promotions
- To improve our website and services
- To comply with legal obligations
- To protect our rights and prevent fraud

## Information Sharing and Disclosure

We may share your information in the following circumstances:
- With your consent
- With service providers who assist us in operating our website
- To comply with legal obligations
- To protect our rights and safety
- In connection with a business transfer

${thirdParties ? `### Third-Party Services\n${thirdParties}` : ""}

${internationalTransfers ? `## International Data Transfers

Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information during such transfers.` : ""}

## Data Security

We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
- Encryption of data in transit and at rest
- Regular security assessments
- Access controls and authentication
- Employee training on data protection

## Data Retention

${dataRetention || "We retain your personal information for as long as necessary to provide our services and comply with legal obligations. Specific retention periods vary depending on the type of information and the purpose for which it was collected."}

## Your Rights

Depending on your location and applicable law, you may have the following rights:
- **Right to Access**: Request a copy of your personal information
- **Right to Rectification**: Correct inaccurate or incomplete information
- **Right to Erasure**: Request deletion of your personal information
- **Right to Restrict Processing**: Limit how we process your information
- **Right to Data Portability**: Receive your data in a structured format
- **Right to Object**: Object to processing based on legitimate interests

## Cookies and Tracking Technologies

We use cookies and similar technologies to enhance your experience on our website. For detailed information about our use of cookies, please see our [Cookie Policy](${domain}/cookie-policy).

## Children's Privacy

Our services are not intended for children under 13 (or the applicable age in your jurisdiction). We do not knowingly collect personal information from children.

## Changes to This Privacy Notice

We may update this Privacy Notice from time to time. We will notify you of any material changes by posting the new Privacy Notice on this page and updating the "Last updated" date.

## Contact Us

If you have any questions about this Privacy Notice or our privacy practices, please contact us at:

**${companyName}**
Email: ${email}
Website: ${domain}

---

*This Privacy Notice is generated for demonstration purposes. Please consult with legal professionals for your actual privacy compliance needs.*`;
}

function generateCookiePolicy(companyName: string, domain: string, email: string, currentDate: string): string {
  return `# Cookie Policy

**${companyName}**

*Last updated: ${currentDate}*

## What Are Cookies

Cookies are small text files that are placed on your computer or mobile device when you visit our website. They allow us to remember your preferences and improve your browsing experience.

## How We Use Cookies

We use cookies for the following purposes:

### Essential Cookies
These cookies are necessary for the website to function properly:
- Session management
- Security features
- Basic functionality

### Analytics Cookies
These cookies help us understand how visitors interact with our website:
- Google Analytics
- Usage statistics
- Performance monitoring

### Functional Cookies
These cookies enable enhanced functionality:
- Language preferences
- User preferences
- Shopping cart contents

### Marketing Cookies
These cookies are used to deliver relevant advertisements:
- Targeted advertising
- Social media integration
- Campaign tracking

## Managing Cookies

You can control and manage cookies in various ways:

### Browser Settings
Most web browsers allow you to control cookies through their settings. You can:
- Delete all cookies
- Block all cookies
- Allow cookies from specific sites
- Block third-party cookies

### Opt-Out Options
You can opt out of targeted advertising by visiting:
- [Google Ad Settings](https://adssettings.google.com)
- [Digital Advertising Alliance](http://optout.aboutads.info/)
- [Network Advertising Initiative](http://optout.networkadvertising.org/)

## Third-Party Cookies

Some cookies are set by third-party services that appear on our pages:
- Google Analytics
- Social media plugins
- Advertising networks

## Updates to This Policy

We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.

## Contact Us

If you have questions about our use of cookies, please contact us at ${email}.

---

*This Cookie Policy is generated for demonstration purposes. Please consult with legal professionals for your actual cookie compliance needs.*`;
}

function generateDataProcessingAgreement(
  regulation: string,
  companyName: string,
  dataProcessing: string,
  domain: string,
  email: string,
  currentDate: string
): string {
  const regulationName = getRegulationFullName(regulation);

  return `# Data Processing Agreement

**${companyName}**

*Last updated: ${currentDate}*

## Parties

**Data Controller**: ${companyName}
**Data Processor**: [Third Party Service Provider Name]

## Purpose

This Data Processing Agreement ("Agreement") governs the processing of personal data by the Data Processor on behalf of the Data Controller in compliance with the ${regulationName}.

## Definitions

- **Personal Data**: Any information relating to an identified or identifiable natural person
- **Processing**: Any operation performed on personal data
- **Data Subject**: The individual to whom the personal data relates

## Scope of Processing

The Data Processor shall process personal data only for the following purposes:
${dataProcessing || "- Providing website hosting and maintenance services\n- Processing user requests and transactions\n- Customer support and communication"}

## Data Protection Obligations

### Security Measures
The Data Processor shall implement appropriate technical and organizational measures to ensure the security of personal data, including:
- Encryption of data in transit and at rest
- Access controls and authentication
- Regular security assessments
- Incident response procedures

### Subcontractors
The Data Processor shall not engage any sub-processor without the prior written consent of the Data Controller.

### Data Subject Rights
The Data Processor shall assist the Data Controller in fulfilling data subject rights requests.

### Breach Notification
The Data Processor shall notify the Data Controller without undue delay of any personal data breach.

## Data Retention and Deletion

The Data Processor shall retain personal data only for as long as necessary for the purposes outlined in this Agreement. Upon termination, the Data Processor shall delete or return all personal data to the Data Controller.

## International Data Transfers

If personal data is transferred outside the EEA, the Data Processor shall ensure appropriate safeguards are in place.

## Audit Rights

The Data Controller shall have the right to audit the Data Processor's compliance with this Agreement.

## Liability and Indemnification

Each party shall be liable for damages caused by their breach of this Agreement.

## Governing Law

This Agreement shall be governed by the laws of [Jurisdiction].

## Contact Information

**${companyName}**
Email: ${email}
Website: ${domain}

---

*This Data Processing Agreement template is generated for demonstration purposes. Please consult with legal professionals for your actual data processing agreements.*`;
}

function generateConsentForm(
  regulation: string,
  companyName: string,
  dataProcessing: string,
  domain: string,
  email: string,
  currentDate: string
): string {
  const regulationName = getRegulationFullName(regulation);

  return `# Consent Form

**${companyName}**

*Last updated: ${currentDate}*

## Data Processing Consent

By using our services and website, you consent to the collection, use, and processing of your personal information as described below.

## What Information We Collect

${dataProcessing || "We collect the following types of information:"}
- Contact information (name, email, phone)
- Usage data and preferences
- Device and browser information
- Location information (with your permission)

## How We Use Your Information

We use your information to:
- Provide our services to you
- Communicate with you about our services
- Improve our products and services
- Comply with legal obligations

## Your Consent

By checking the box below, you freely give your consent for ${companyName} to collect, use, and process your personal information as described in our Privacy Notice.

**I consent to the collection, use, and processing of my personal information by ${companyName} for the purposes described above.**

[ ] I consent to the processing of my personal information

## Withdrawal of Consent

You have the right to withdraw your consent at any time. To withdraw your consent, please contact us at ${email}.

## Contact Information

If you have any questions about this consent form or our data processing practices, please contact us:

**${companyName}**
Email: ${email}
Website: ${domain}

Date: _______________
Signature: ___________________________

---

*This Consent Form template is generated for demonstration purposes. Please consult with legal professionals for your actual consent forms.*`;
}

function generatePrivacyPolicy(
  regulation: string,
  companyName: string,
  dataProcessing: string,
  domain: string,
  email: string,
  currentDate: string,
  dataRetention?: string,
  thirdParties?: string,
  internationalTransfers?: boolean
): string {
  const regulationName = getRegulationFullName(regulation);

  return `# Privacy Policy

**${companyName}**

*Last updated: ${currentDate}*

## Welcome to ${companyName}

This Privacy Policy explains how ${companyName} ("we," "us," or "our") collects, uses, discloses, and safeguards your information when you visit our website ${domain} or use our services. We are committed to protecting your privacy and complying with the ${regulationName}.

## Information We Collect

### Information You Provide to Us
${dataProcessing || "When you use our services, we collect information you provide directly to us, including:"}
- Account information (name, email, password)
- Profile information
- Communications you send to us
- Payment information
- Customer support interactions

### Information We Collect Automatically
We automatically collect certain information when you use our services:
- Device information (IP address, browser type, operating system)
- Usage data (pages visited, time spent, features used)
- Location information
- Cookies and similar technologies

### Information from Third Parties
We may receive information about you from third-party sources, including:
- Social media platforms
- Payment processors
- Analytics providers
- Business partners

## How We Use Your Information

We use the information we collect for various purposes, including to:
- Provide, maintain, and improve our services
- Process transactions and send related information
- Send you technical notices, updates, and support messages
- Communicate with you about products, services, and promotions
- Monitor and analyze trends and usage
- Detect, investigate, and prevent fraudulent transactions
- Comply with legal obligations

## How We Share Your Information

We may share your information in the following ways:

### With Your Consent
We share information when you direct us to do so.

### Service Providers
We share information with third-party service providers who help us operate our services, including:
- Payment processors
- Cloud hosting providers
- Analytics services
- Customer support platforms

${thirdParties ? `### Additional Third Parties\n${thirdParties}` : ""}

### Legal Requirements
We may disclose information if required by law or to protect our rights.

### Business Transfers
In the event of a merger, acquisition, or sale of assets, your information may be transferred.

${internationalTransfers ? `## International Data Transfers

Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws than your country. We ensure appropriate safeguards are in place, such as standard contractual clauses or adequacy decisions, to protect your information during international transfers.` : ""}

## Cookies and Tracking Technologies

We use cookies, web beacons, and similar technologies to collect information and enhance your experience. For more information, please see our [Cookie Policy](${domain}/cookie-policy).

## Data Security

We implement appropriate technical and organizational measures to protect your information:
- Encryption of data in transit and at rest
- Regular security assessments and updates
- Access controls and employee training
- Secure data disposal practices

## Data Retention

${dataRetention || "We retain your information for as long as necessary to provide our services and fulfill the purposes described in this Privacy Policy, unless a longer retention period is required by law."}

## Your Rights and Choices

Depending on your location, you may have certain rights regarding your information:

### Access and Portability
You can request a copy of your information and ask for it to be transferred to another service.

### Correction
You can update or correct your information.

### Deletion
You can request that we delete your information.

### Restriction and Objection
You can limit or object to certain processing activities.

### Withdraw Consent
Where processing is based on consent, you can withdraw your consent.

To exercise these rights, please contact us at ${email}.

## Children's Privacy

Our services are not intended for children under 13. We do not knowingly collect information from children under 13.

## Changes to This Privacy Policy

We may update this Privacy Policy from time to time. We will notify you of material changes by email or through our services.

## Contact Us

If you have questions about this Privacy Policy, please contact us:

**${companyName}**
Email: ${email}
Website: ${domain}

---

*This Privacy Policy is generated for demonstration purposes. Please consult with legal professionals for your actual privacy policy.*`;
}

function getRegulationFullName(regulation: string): string {
  const names: { [key: string]: string } = {
    gdpr: "General Data Protection Regulation (GDPR)",
    ccpa: "California Consumer Privacy Act (CCPA)",
    hipaa: "Health Insurance Portability and Accountability Act (HIPAA)",
    pipeda: "Personal Information Protection and Electronic Documents Act (PIPEDA)",
    lgpd: "Brazil General Data Protection Law (LGPD)",
    pdpa: "Personal Data Protection Act (PDPA)"
  };
  return names[regulation] || regulation.toUpperCase();
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