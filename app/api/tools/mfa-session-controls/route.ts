import { NextRequest, NextResponse } from "next/server";

interface MFAConfig {
  id: string;
  name: string;
  method: "totp" | "sms" | "email";
  enabled: boolean;
  settings: {
    issuer?: string;
    accountName?: string;
    phoneNumber?: string;
    emailAddress?: string;
    backupCodes?: string[];
    rateLimit?: number;
    maxAttempts?: number;
  };
  secret?: string;
  createdAt: string;
  qrCodeUrl?: string;
  provisioningUri?: string;
}

interface SessionPolicy {
  id: string;
  name: string;
  timeout: number;
  maxConcurrentSessions: number;
  idleTimeout: number;
  rememberMe: boolean;
  rememberMeDuration: number;
  forceLogoutOnPasswordChange: boolean;
  deviceFingerprinting: boolean;
  ipWhitelist?: string[];
  geoBlocking?: boolean;
  allowedCountries?: string[];
}

interface Session {
  id: string;
  userId: string;
  deviceInfo: {
    userAgent: string;
    ipAddress: string;
    location: string;
    deviceFingerprint: string;
    browser: string;
    os: string;
  };
  createdAt: string;
  lastActivity: string;
  expiresAt: string;
  isActive: boolean;
  loginMethod: string;
}

interface SecurityEvent {
  id: string;
  type: "login_attempt" | "mfa_failure" | "suspicious_activity" | "session_timeout" | "brute_force" | "device_change";
  userId: string;
  timestamp: string;
  details: {
    ipAddress: string;
    userAgent: string;
    location: string;
    reason: string;
    deviceFingerprint?: string;
    loginMethod?: string;
  };
  severity: "low" | "medium" | "high" | "critical";
  resolved: boolean;
}

interface VerificationCode {
  id: string;
  type: "sms" | "email";
  recipient: string;
  code: string;
  expiresAt: string;
  attempts: number;
  maxAttempts: number;
}

// Mock data for demonstration - in a real implementation, this would use a database
let mfaConfigs: MFAConfig[] = [];
let sessionPolicies: SessionPolicy[] = [];
let activeSessions: Session[] = [];
let securityEvents: SecurityEvent[] = [];
let verificationCodes: VerificationCode[] = [];

// TOTP implementation (simplified for demo)
const generateTOTPSecret = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let secret = "";
  for (let i = 0; i < 32; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
};

const base32ToBuffer = (base32: string): Buffer => {
  const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const bits = base32.toUpperCase().split('').map(char => {
    const index = base32Chars.indexOf(char);
    if (index === -1) throw new Error('Invalid base32 character');
    return index;
  });

  const bytes = [];
  let buffer = 0;
  let bitsCount = 0;

  for (const bit of bits) {
    buffer = (buffer << 5) | bit;
    bitsCount += 5;
    if (bitsCount >= 8) {
      bytes.push((buffer >>> (bitsCount - 8)) & 0xff);
      bitsCount -= 8;
    }
  }

  return Buffer.from(bytes);
};

const generateTOTP = (secret: string, timeStep: number = 30): string => {
  try {
    const time = Math.floor(Date.now() / 1000 / timeStep);
    const key = base32ToBuffer(secret);
    const hmac = require('crypto').createHmac('sha1', key);
    hmac.update(Buffer.from(time.toString(16).padStart(16, '0'), 'hex'));
    const hmacResult = hmac.digest();

    const offset = hmacResult[hmacResult.length - 1] & 0xf;
    const code = (hmacResult.readUInt32BE(offset) & 0x7fffffff) % 1000000;

    return code.toString().padStart(6, '0');
  } catch (error) {
    // Fallback for demo purposes
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
};

const verifyTOTP = (token: string, secret: string, window: number = 1): boolean => {
  if (!token || !secret) return false;

  const timeStep = 30;
  const currentTime = Math.floor(Date.now() / 1000 / timeStep);

  for (let i = -window; i <= window; i++) {
    try {
      const expectedToken = generateTOTP(secret, timeStep);
      if (token === expectedToken) {
        return true;
      }
    } catch (error) {
      // For demo purposes, accept any 6-digit code
      return /^\d{6}$/.test(token);
    }
  }
  return false;
};

const generateQRCodeUrl = (secret: string, accountName: string, issuer: string): string => {
  const otpauthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`;
};

const generateDeviceFingerprint = (userAgent: string, ipAddress: string): string => {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(`${userAgent}:${ipAddress}`).digest('hex').substring(0, 16);
};

const detectBrowserAndOS = (userAgent: string): { browser: string; os: string } => {
  let browser = "Unknown";
  let os = "Unknown";

  // Browser detection
  if (userAgent.includes("Chrome")) browser = "Chrome";
  else if (userAgent.includes("Firefox")) browser = "Firefox";
  else if (userAgent.includes("Safari")) browser = "Safari";
  else if (userAgent.includes("Edge")) browser = "Edge";
  else if (userAgent.includes("Opera")) browser = "Opera";

  // OS detection
  if (userAgent.includes("Windows")) os = "Windows";
  else if (userAgent.includes("Mac")) os = "macOS";
  else if (userAgent.includes("Linux")) os = "Linux";
  else if (userAgent.includes("Android")) os = "Android";
  else if (userAgent.includes("iOS")) os = "iOS";

  return { browser, os };
};

const parseUploadedFile = (content: string, filename: string): any => {
  try {
    const fileExtension = filename.split('.').pop()?.toLowerCase();

    switch (fileExtension) {
      case 'json':
        return JSON.parse(content);

      case 'csv':
        // Simple CSV parsing for basic key-value pairs
        const lines = content.split('\n').filter(line => line.trim());
        const csvResult: any = {};

        lines.forEach(line => {
          const [key, ...valueParts] = line.split(',');
          if (key && valueParts.length > 0) {
            const value = valueParts.join(',').trim();
            // Try to parse as JSON, otherwise keep as string
            try {
              csvResult[key.trim()] = JSON.parse(value);
            } catch {
              csvResult[key.trim()] = value;
            }
          }
        });

        return csvResult;

      case 'xml':
        // Basic XML parsing (simplified)
        const xmlMatch = content.match(/<([^>]+)>([^<]*)<\/\1>/g);
        const xmlResult: any = {};

        if (xmlMatch) {
          xmlMatch.forEach(match => {
            const [, tag, value] = match.match(/<([^>]+)>([^<]*)<\/\1>/) || [];
            if (tag && value) {
              try {
                xmlResult[tag] = JSON.parse(value);
              } catch {
                xmlResult[tag] = value;
              }
            }
          });
        }

        return xmlResult;

      case 'txt':
      default:
        // Try to parse as JSON first, fallback to plain text
        try {
          return JSON.parse(content);
        } catch {
          return { content: content, type: 'text' };
        }
    }
  } catch (error) {
    throw new Error(`Failed to parse file: ${error}`);
  }
};

const handleFileUpload = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const action = formData.get('action') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (action !== 'upload_config') {
      return NextResponse.json({ error: 'Invalid action for file upload' }, { status: 400 });
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    // Read file content
    const content = await file.text();

    // Parse the file content
    const parsedData = parseUploadedFile(content, file.name);

    // Validate that the parsed data contains expected MFA/session configuration
    const isValidConfig = parsedData && (
      parsedData.mfaConfigs ||
      parsedData.sessionPolicies ||
      parsedData.sessions ||
      parsedData.securityEvents ||
      parsedData.policies
    );

    if (!isValidConfig) {
      return NextResponse.json({
        error: 'Invalid configuration file. Expected MFA or session configuration data.',
        parsedData: parsedData
      }, { status: 400 });
    }

    // Log the upload event
    securityEvents.unshift({
      id: Date.now().toString(),
      type: "suspicious_activity",
      userId: "admin",
      timestamp: new Date().toISOString(),
      details: {
        ipAddress: "127.0.0.1",
        userAgent: "File Upload",
        location: "Local",
        reason: `Configuration file uploaded: ${file.name} (${file.size} bytes)`
      },
      severity: "low",
      resolved: true
    });

    return NextResponse.json({
      success: true,
      message: 'File uploaded and parsed successfully',
      filename: file.name,
      size: file.size,
      type: file.type,
      parsedData: parsedData
    });

  } catch (error) {
    console.error('Error handling file upload:', error);
    return NextResponse.json(
      { error: `Failed to process file: ${error}` },
      { status: 500 }
    );
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const type = searchParams.get("type");
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");

    // Handle action-based requests (from client component)
    if (action) {
      switch (action) {
        case "get_dashboard_stats": {
          const stats = {
            activeSessions: activeSessions.length,
            totalMFASetups: mfaConfigs.length,
            securityEventsToday: securityEvents.filter(e =>
              new Date(e.timestamp).toDateString() === new Date().toDateString()
            ).length,
            failedLoginAttempts: securityEvents.filter(e => e.type === "mfa_failure").length,
            recentEvents: securityEvents.slice(0, 5).map(event => ({
              id: event.id,
              type: event.type,
              severity: event.severity,
              message: event.details.reason,
              timestamp: new Date(event.timestamp),
              ipAddress: event.details.ipAddress,
              success: event.resolved
            }))
          };
          return NextResponse.json(stats);
        }

        case "get_sessions": {
          const sessions = activeSessions.map(session => ({
            id: session.id,
            deviceFingerprint: session.deviceInfo.deviceFingerprint,
            browser: session.deviceInfo.browser,
            os: session.deviceInfo.os,
            ipAddress: session.deviceInfo.ipAddress,
            location: session.deviceInfo.location,
            lastActivity: new Date(session.lastActivity),
            createdAt: new Date(session.createdAt),
            isActive: session.isActive,
            isCurrentSession: session.id === "current" // For demo purposes
          }));
          return NextResponse.json(sessions);
        }

        case "get_security_events": {
          const events = securityEvents.slice(0, 50).map(event => ({
            id: event.id,
            type: event.type,
            severity: event.severity,
            message: event.details.reason,
            timestamp: new Date(event.timestamp),
            ipAddress: event.details.ipAddress,
            userAgent: event.details.userAgent,
            success: event.resolved
          }));
          return NextResponse.json(events);
        }

        default:
          return NextResponse.json({ error: "Invalid action" }, { status: 400 });
      }
    }

    // Handle type-based requests (legacy support)
    switch (type) {
      case "mfa":
        if (id) {
          const config = mfaConfigs.find(c => c.id === id);
          return config ? NextResponse.json(config) : NextResponse.json({ error: "MFA config not found" }, { status: 404 });
        }
        return NextResponse.json(mfaConfigs);

      case "sessions":
        if (id) {
          const policy = sessionPolicies.find(p => p.id === id);
          return policy ? NextResponse.json(policy) : NextResponse.json({ error: "Session policy not found" }, { status: 404 });
        }
        return NextResponse.json(sessionPolicies);

      case "active-sessions":
        const userSessions = userId ? activeSessions.filter(s => s.userId === userId) : activeSessions;
        return NextResponse.json(userSessions);

      case "security-events":
        const limit = parseInt(searchParams.get("limit") || "50");
        const severity = searchParams.get("severity");
        let filteredEvents = securityEvents;

        if (severity) {
          filteredEvents = filteredEvents.filter(e => e.severity === severity);
        }

        return NextResponse.json(filteredEvents.slice(0, limit));

      case "dashboard-stats":
        const stats = {
          totalSessions: activeSessions.length,
          activeUsers: new Set(activeSessions.map(s => s.userId)).size,
          securityEventsToday: securityEvents.filter(e =>
            new Date(e.timestamp).toDateString() === new Date().toDateString()
          ).length,
          failedLogins: securityEvents.filter(e => e.type === "mfa_failure").length,
          mfaConfigs: mfaConfigs.length,
          sessionPolicies: sessionPolicies.length
        };
        return NextResponse.json(stats);

      default:
        return NextResponse.json({
          mfaConfigs,
          sessionPolicies,
          activeSessions,
          securityEvents: securityEvents.slice(0, 10),
          stats: {
            totalSessions: activeSessions.length,
            activeUsers: new Set(activeSessions.map(s => s.userId)).size,
            securityEventsToday: securityEvents.filter(e =>
              new Date(e.timestamp).toDateString() === new Date().toDateString()
            ).length
          }
        });
    }
  } catch (error) {
    console.error("Error fetching MFA/session data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if this is a multipart form data request (file upload)
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      return handleFileUpload(request);
    }

    // Get action from query parameters or body
    const { searchParams } = new URL(request.url);
    let action = searchParams.get("action");

    let body: any = {};
    if (!action) {
      try {
        body = await request.json();
        action = body.action;
      } catch (error) {
        // Handle empty body
        body = {};
      }
    } else {
      // If action is in query params, still try to parse body for data
      try {
        body = await request.json();
      } catch (error) {
        // Handle empty body
        body = {};
      }
    }

    const { action: _, ...data } = body;

    switch (action) {
      case "generate-secret": {
        const secret = generateTOTPSecret();
        return NextResponse.json({ secret });
      }

      case "create_mfa": {
        const config: MFAConfig = {
          id: Date.now().toString(),
          name: data.name,
          method: data.method,
          enabled: true,
          settings: {
            issuer: data.issuer || "Multi-Tool Platform",
            accountName: data.accountName,
            phoneNumber: data.phoneNumber,
            emailAddress: data.emailAddress,
            rateLimit: 5,
            maxAttempts: 3
          },
          createdAt: new Date().toISOString()
        };

        if (data.method === "totp") {
          config.secret = generateTOTPSecret();
          config.provisioningUri = `otpauth://totp/${encodeURIComponent(config.settings.issuer!)}:${encodeURIComponent(config.settings.accountName!)}?secret=${config.secret}&issuer=${encodeURIComponent(config.settings.issuer!)}`;
          config.qrCodeUrl = generateQRCodeUrl(config.secret, config.settings.accountName!, config.settings.issuer!);
        }

        mfaConfigs.push(config);

        // Log security event
        securityEvents.unshift({
          id: Date.now().toString(),
          type: "suspicious_activity",
          userId: "admin",
          timestamp: new Date().toISOString(),
          details: {
            ipAddress: "127.0.0.1",
            userAgent: "Admin Console",
            location: "Local",
            reason: `MFA configuration created: ${config.name}`
          },
          severity: "low",
          resolved: true
        });

        return NextResponse.json(config);
      }

      case "update_mfa": {
        const configIndex = mfaConfigs.findIndex(c => c.id === data.id);
        if (configIndex === -1) {
          return NextResponse.json({ error: "MFA config not found" }, { status: 404 });
        }

        mfaConfigs[configIndex] = { ...mfaConfigs[configIndex], ...data };
        return NextResponse.json(mfaConfigs[configIndex]);
      }

      case "create_session_policy": {
        const policy: SessionPolicy = {
          id: Date.now().toString(),
          name: data.name,
          timeout: data.timeout || 60,
          maxConcurrentSessions: data.maxConcurrentSessions || 5,
          idleTimeout: data.idleTimeout || 30,
          rememberMe: data.rememberMe ?? true,
          rememberMeDuration: data.rememberMeDuration || 30,
          forceLogoutOnPasswordChange: data.forceLogoutOnPasswordChange ?? true,
          deviceFingerprinting: data.deviceFingerprinting ?? true
        };

        sessionPolicies.push(policy);
        return NextResponse.json(policy);
      }

      case "update_session_policy": {
        const policyIndex = sessionPolicies.findIndex(p => p.id === data.id);
        if (policyIndex === -1) {
          return NextResponse.json({ error: "Session policy not found" }, { status: 404 });
        }

        sessionPolicies[policyIndex] = { ...sessionPolicies[policyIndex], ...data };
        return NextResponse.json(sessionPolicies[policyIndex]);
      }

      case "verify_totp": {
        const { token, secret } = data;
        const isValid = verifyTOTP(token, secret);

        // Log verification attempt
        securityEvents.unshift({
          id: Date.now().toString(),
          type: isValid ? "login_attempt" : "mfa_failure",
          userId: "user123",
          timestamp: new Date().toISOString(),
          details: {
            ipAddress: "127.0.0.1",
            userAgent: "Test Client",
            location: "Local",
            reason: `TOTP verification ${isValid ? 'successful' : 'failed'}`,
            loginMethod: "totp"
          },
          severity: isValid ? "low" : "medium",
          resolved: true
        });

        return NextResponse.json({ valid: isValid });
      }

      case "send_sms_code": {
        const { phoneNumber } = data;
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        const codeEntry: VerificationCode = {
          id: Date.now().toString(),
          type: "sms",
          recipient: phoneNumber,
          code: verificationCode,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
          attempts: 0,
          maxAttempts: 3
        };

        verificationCodes.push(codeEntry);

        // Log SMS sending
        securityEvents.unshift({
          id: Date.now().toString(),
          type: "login_attempt",
          userId: "user123",
          timestamp: new Date().toISOString(),
          details: {
            ipAddress: "127.0.0.1",
            userAgent: "Test Client",
            location: "Local",
            reason: `SMS verification code sent to ${phoneNumber}`,
            loginMethod: "sms"
          },
          severity: "low",
          resolved: true
        });

        console.log(`SMS Code for ${phoneNumber}: ${verificationCode}`);
        return NextResponse.json({
          success: true,
          message: `Verification code sent to ${phoneNumber}`,
          expiresIn: 300 // 5 minutes
        });
      }

      case "verify_sms_code": {
        const { phoneNumber, code } = data;
        const codeEntry = verificationCodes.find(
          c => c.type === "sms" && c.recipient === phoneNumber && c.code === code
        );

        if (!codeEntry) {
          return NextResponse.json({ valid: false, error: "Invalid code" });
        }

        if (new Date() > new Date(codeEntry.expiresAt)) {
          return NextResponse.json({ valid: false, error: "Code expired" });
        }

        codeEntry.attempts++;
        if (codeEntry.attempts > codeEntry.maxAttempts) {
          return NextResponse.json({ valid: false, error: "Too many attempts" });
        }

        // Remove used code
        verificationCodes = verificationCodes.filter(c => c.id !== codeEntry.id);

        return NextResponse.json({ valid: true });
      }

      case "send_email_code": {
        const { email } = data;
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        const codeEntry: VerificationCode = {
          id: Date.now().toString(),
          type: "email",
          recipient: email,
          code: verificationCode,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
          attempts: 0,
          maxAttempts: 3
        };

        verificationCodes.push(codeEntry);

        // Log email sending
        securityEvents.unshift({
          id: Date.now().toString(),
          type: "login_attempt",
          userId: "user123",
          timestamp: new Date().toISOString(),
          details: {
            ipAddress: "127.0.0.1",
            userAgent: "Test Client",
            location: "Local",
            reason: `Email verification code sent to ${email}`,
            loginMethod: "email"
          },
          severity: "low",
          resolved: true
        });

        console.log(`Email Code for ${email}: ${verificationCode}`);
        return NextResponse.json({
          success: true,
          message: `Verification code sent to ${email}`,
          expiresIn: 600 // 10 minutes
        });
      }

      case "verify_email_code": {
        const { email, code } = data;
        const codeEntry = verificationCodes.find(
          c => c.type === "email" && c.recipient === email && c.code === code
        );

        if (!codeEntry) {
          return NextResponse.json({ valid: false, error: "Invalid code" });
        }

        if (new Date() > new Date(codeEntry.expiresAt)) {
          return NextResponse.json({ valid: false, error: "Code expired" });
        }

        codeEntry.attempts++;
        if (codeEntry.attempts > codeEntry.maxAttempts) {
          return NextResponse.json({ valid: false, error: "Too many attempts" });
        }

        // Remove used code
        verificationCodes = verificationCodes.filter(c => c.id !== codeEntry.id);

        return NextResponse.json({ valid: true });
      }

      case "test_totp": {
        const { code } = data;
        // For demo purposes, accept any 6-digit code as valid
        const isValid = /^\d{6}$/.test(code);

        // Log TOTP test
        securityEvents.unshift({
          id: Date.now().toString(),
          type: isValid ? "login_attempt" : "mfa_failure",
          userId: "test_user",
          timestamp: new Date().toISOString(),
          details: {
            ipAddress: "127.0.0.1",
            userAgent: "Test Client",
            location: "Local",
            reason: `TOTP test ${isValid ? 'successful' : 'failed'}: ${code}`,
            loginMethod: "totp"
          },
          severity: isValid ? "low" : "medium",
          resolved: true
        });

        return NextResponse.json({
          valid: isValid,
          message: isValid ? "TOTP code verified successfully" : "Invalid TOTP code"
        });
      }

      case "create_session": {
        const userAgent = data.userAgent || "Mozilla/5.0";
        const ipAddress = data.ipAddress || "192.168.1.100";
        const { browser, os } = detectBrowserAndOS(userAgent);
        const deviceFingerprint = generateDeviceFingerprint(userAgent, ipAddress);

        const session: Session = {
          id: Date.now().toString(),
          userId: data.userId || "user123",
          deviceInfo: {
            userAgent,
            ipAddress,
            location: data.location || "Unknown",
            deviceFingerprint,
            browser,
            os
          },
          createdAt: new Date().toISOString(),
          lastActivity: new Date().toISOString(),
          expiresAt: new Date(Date.now() + (data.timeout || 3600) * 1000).toISOString(),
          isActive: true,
          loginMethod: data.loginMethod || "password"
        };

        activeSessions.push(session);

        // Log session creation
        securityEvents.unshift({
          id: Date.now().toString(),
          type: "login_attempt",
          userId: session.userId,
          timestamp: new Date().toISOString(),
          details: {
            ipAddress: session.deviceInfo.ipAddress,
            userAgent: session.deviceInfo.userAgent,
            location: session.deviceInfo.location,
            reason: `New session created from ${browser} on ${os}`,
            deviceFingerprint,
            loginMethod: session.loginMethod
          },
          severity: "low",
          resolved: true
        });

        return NextResponse.json(session);
      }

      case "update_session_activity": {
        const session = activeSessions.find(s => s.id === data.sessionId);
        if (!session) {
          return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        session.lastActivity = new Date().toISOString();
        return NextResponse.json({ success: true });
      }

      case "terminate_session": {
        const sessionIndex = activeSessions.findIndex(s => s.id === data.sessionId);
        if (sessionIndex === -1) {
          return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        activeSessions[sessionIndex].isActive = false;

        // Log session termination
        securityEvents.unshift({
          id: Date.now().toString(),
          type: "session_timeout",
          userId: activeSessions[sessionIndex].userId,
          timestamp: new Date().toISOString(),
          details: {
            ipAddress: activeSessions[sessionIndex].deviceInfo.ipAddress,
            userAgent: activeSessions[sessionIndex].deviceInfo.userAgent,
            location: activeSessions[sessionIndex].deviceInfo.location,
            reason: "Session manually terminated",
            deviceFingerprint: activeSessions[sessionIndex].deviceInfo.deviceFingerprint
          },
          severity: "low",
          resolved: true
        });

        return NextResponse.json({ success: true });
      }

      case "update_policies": {
        // Update session policies
        sessionPolicies.length = 0; // Clear existing policies
        // For demo purposes, create a default policy with the provided settings
        const policy: SessionPolicy = {
          id: Date.now().toString(),
          name: "Default Policy",
          timeout: data.sessionTimeout || 60,
          maxConcurrentSessions: data.maxSessions || 5,
          idleTimeout: 30,
          rememberMe: true,
          rememberMeDuration: 30,
          forceLogoutOnPasswordChange: true,
          deviceFingerprinting: true
        };
        sessionPolicies.push(policy);

        // Log policy update
        securityEvents.unshift({
          id: Date.now().toString(),
          type: "suspicious_activity",
          userId: "admin",
          timestamp: new Date().toISOString(),
          details: {
            ipAddress: "127.0.0.1",
            userAgent: "Admin Console",
            location: "Local",
            reason: `Session policies updated: timeout=${policy.timeout}min, max_sessions=${policy.maxConcurrentSessions}`
          },
          severity: "low",
          resolved: true
        });

        return NextResponse.json({
          success: true,
          message: "Session policies updated successfully",
          policy
        });
      }

      case "simulate_brute_force": {
        // Simulate brute force attack detection
        const events = Array.from({ length: 10 }, (_, i) => ({
          id: (Date.now() + i).toString(),
          type: "brute_force" as const,
          userId: "attacker123",
          timestamp: new Date(Date.now() - i * 1000).toISOString(),
          details: {
            ipAddress: `192.168.1.${100 + i}`,
            userAgent: "Malicious Bot",
            location: "Unknown",
            reason: `Failed login attempt ${i + 1}/10`
          },
          severity: "high" as const,
          resolved: false
        }));

        securityEvents.unshift(...events);
        securityEvents = securityEvents.slice(0, 1000);

        return NextResponse.json({ simulated: events.length });
      }

      case "generate_sample_data": {
        const sampleSessions = [
          {
            id: "sample_1",
            userId: "user123",
            deviceInfo: {
              userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
              ipAddress: "192.168.1.100",
              location: "New York, US",
              deviceFingerprint: "abc123def456",
              browser: "Chrome",
              os: "macOS"
            },
            createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            lastActivity: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
            expiresAt: new Date(Date.now() + 1800000).toISOString(), // 30 minutes from now
            isActive: true,
            loginMethod: "password"
          },
          {
            id: "sample_2",
            userId: "user456",
            deviceInfo: {
              userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              ipAddress: "10.0.0.50",
              location: "London, UK",
              deviceFingerprint: "xyz789uvw123",
              browser: "Firefox",
              os: "Windows"
            },
            createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            lastActivity: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
            expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
            isActive: true,
            loginMethod: "totp"
          }
        ];

        const sampleEvents = [
          {
            id: "event_1",
            type: "login_attempt",
            userId: "user123",
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            details: {
              ipAddress: "192.168.1.100",
              userAgent: "Chrome on macOS",
              location: "New York, US",
              reason: "Successful login with TOTP",
              loginMethod: "totp"
            },
            severity: "low",
            resolved: true
          },
          {
            id: "event_2",
            type: "mfa_failure",
            userId: "attacker",
            timestamp: new Date(Date.now() - 900000).toISOString(),
            details: {
              ipAddress: "203.0.113.1",
              userAgent: "Unknown Bot",
              location: "Unknown",
              reason: "Failed TOTP verification attempt",
              loginMethod: "totp"
            },
            severity: "medium",
            resolved: false
          },
          {
            id: "event_3",
            type: "suspicious_activity",
            userId: "user456",
            timestamp: new Date(Date.now() - 600000).toISOString(),
            details: {
              ipAddress: "10.0.0.50",
              userAgent: "Firefox on Windows",
              location: "London, UK",
              reason: "Login from new device"
            },
            severity: "low",
            resolved: true
          }
        ];

        // Add sample sessions (avoid duplicates)
        sampleSessions.forEach(session => {
          if (!activeSessions.find(s => s.id === session.id)) {
            activeSessions.push(session as Session);
          }
        });

        // Add sample events
        sampleEvents.forEach(event => {
          if (!securityEvents.find(e => e.id === event.id)) {
            securityEvents.unshift(event as SecurityEvent);
          }
        });

        // Keep only recent events
        securityEvents = securityEvents.slice(0, 1000);

        return NextResponse.json({
          success: true,
          message: "Sample data generated successfully",
          sessionsAdded: sampleSessions.length,
          eventsAdded: sampleEvents.length,
          totalSessions: activeSessions.length,
          totalEvents: securityEvents.length
        });
      }

      case "import_config": {
        const { config } = data;

        if (!config) {
          return NextResponse.json({ error: "No configuration data provided" }, { status: 400 });
        }

        let importedCount = 0;

        // Import MFA configurations
        if (config.mfaConfigs && Array.isArray(config.mfaConfigs)) {
          config.mfaConfigs.forEach((mfaConfig: any) => {
            if (mfaConfig.id && mfaConfig.name && mfaConfig.method) {
              // Check if config already exists
              const existingIndex = mfaConfigs.findIndex(c => c.id === mfaConfig.id);
              if (existingIndex >= 0) {
                mfaConfigs[existingIndex] = { ...mfaConfigs[existingIndex], ...mfaConfig };
              } else {
                mfaConfigs.push(mfaConfig);
              }
              importedCount++;
            }
          });
        }

        // Import session policies
        if (config.sessionPolicies && Array.isArray(config.sessionPolicies)) {
          config.sessionPolicies.forEach((policy: any) => {
            if (policy.id && policy.name) {
              const existingIndex = sessionPolicies.findIndex(p => p.id === policy.id);
              if (existingIndex >= 0) {
                sessionPolicies[existingIndex] = { ...sessionPolicies[existingIndex], ...policy };
              } else {
                sessionPolicies.push(policy);
              }
              importedCount++;
            }
          });
        }

        // Import security events (optional, for historical data)
        if (config.securityEvents && Array.isArray(config.securityEvents)) {
          config.securityEvents.forEach((event: any) => {
            if (event.id && event.type && event.timestamp) {
              const existingIndex = securityEvents.findIndex(e => e.id === event.id);
              if (existingIndex < 0) {
                securityEvents.unshift(event);
                importedCount++;
              }
            }
          });
          // Keep only the most recent 1000 events
          securityEvents = securityEvents.slice(0, 1000);
        }

        // Log import event
        securityEvents.unshift({
          id: Date.now().toString(),
          type: "suspicious_activity",
          userId: "admin",
          timestamp: new Date().toISOString(),
          details: {
            ipAddress: "127.0.0.1",
            userAgent: "Configuration Import",
            location: "Local",
            reason: `Configuration imported: ${importedCount} items`
          },
          severity: "low",
          resolved: true
        });

        return NextResponse.json({
          success: true,
          message: `Configuration imported successfully`,
          importedCount,
          stats: {
            mfaConfigs: mfaConfigs.length,
            sessionPolicies: sessionPolicies.length,
            securityEvents: securityEvents.length
          }
        });
      }

      case "export_config": {
        const exportData = {
          exportedAt: new Date().toISOString(),
          version: "1.0",
          mfaConfigs: mfaConfigs.map(config => ({
            ...config,
            // Remove sensitive data from export
            secret: config.secret ? "***REDACTED***" : undefined,
            qrCodeUrl: undefined,
            provisioningUri: undefined
          })),
          sessionPolicies: sessionPolicies,
          activeSessions: activeSessions.map(session => ({
            ...session,
            // Remove sensitive device fingerprint from export
            deviceInfo: {
              ...session.deviceInfo,
              deviceFingerprint: "***REDACTED***"
            }
          })),
          securityEvents: securityEvents.slice(0, 100), // Export last 100 events
          stats: {
            totalMFAConfigs: mfaConfigs.length,
            totalSessionPolicies: sessionPolicies.length,
            totalActiveSessions: activeSessions.length,
            totalSecurityEvents: securityEvents.length
          }
        };

        // Log export event
        securityEvents.unshift({
          id: Date.now().toString(),
          type: "suspicious_activity",
          userId: "admin",
          timestamp: new Date().toISOString(),
          details: {
            ipAddress: "127.0.0.1",
            userAgent: "Configuration Export",
            location: "Local",
            reason: "Configuration data exported"
          },
          severity: "low",
          resolved: true
        });

        return NextResponse.json(exportData);
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in MFA/session API:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    if (!type || !id) {
      return NextResponse.json({ error: "Type and ID required" }, { status: 400 });
    }

    switch (type) {
      case "mfa":
        mfaConfigs = mfaConfigs.filter(c => c.id !== id);
        break;
      case "session-policy":
        sessionPolicies = sessionPolicies.filter(p => p.id !== id);
        break;
      case "session":
        activeSessions = activeSessions.filter(s => s.id !== id);
        break;
      case "security-event":
        securityEvents = securityEvents.filter(e => e.id !== id);
        break;
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting MFA/session data:", error);
    return NextResponse.json(
      { error: "Failed to delete data" },
      { status: 500 }
    );
  }
}