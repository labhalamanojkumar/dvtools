"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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
}

interface SessionPolicy {
  id: string;
  name: string;
  timeout: number; // minutes
  maxConcurrentSessions: number;
  idleTimeout: number; // minutes
  rememberMe: boolean;
  rememberMeDuration: number; // days
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
    browser?: string;
    os?: string;
  };
  createdAt: string;
  lastActivity: string;
  expiresAt: string;
  isActive: boolean;
}

interface SecurityEvent {
  id: string;
  type: "login_attempt" | "mfa_failure" | "suspicious_activity" | "session_timeout";
  userId: string;
  timestamp: string;
  details: {
    ipAddress: string;
    userAgent: string;
    location: string;
    reason: string;
  };
  severity: "low" | "medium" | "high" | "critical";
}

export default function MFASessionControlsClient() {
  const [activeTab, setActiveTab] = useState("mfa-setup");
  const [mfaConfigs, setMfaConfigs] = useState<MFAConfig[]>([]);
  const [sessionPolicies, setSessionPolicies] = useState<SessionPolicy[]>([]);
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<MFAConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>("");

  // MFA Setup State
  const [newMFAConfig, setNewMFAConfig] = useState({
    name: "",
    method: "totp" as "totp" | "sms" | "email",
    issuer: "",
    accountName: "",
    phoneNumber: "",
    emailAddress: "",
  });

  // Session Policy State
  const [newSessionPolicy, setNewSessionPolicy] = useState({
    name: "",
    timeout: 30,
    maxConcurrentSessions: 5,
    idleTimeout: 15,
    rememberMe: true,
    rememberMeDuration: 30,
    forceLogoutOnPasswordChange: true,
    deviceFingerprinting: true,
  });

  const generateTOTPSecret = useCallback(async () => {
    try {
      const res = await fetch("/api/tools/mfa-session-controls?action=generate-secret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.secret as string | null;
    } catch (err) {
      console.error("Error generating TOTP secret:", err);
      return null;
    }
  }, []);

  const createMFAConfig = async () => {
    if (!newMFAConfig.name.trim()) {
      alert("Configuration name is required");
      return;
    }
    setIsLoading(true);
    try {
      const payload = {
        action: "create_mfa",
        name: newMFAConfig.name,
        method: newMFAConfig.method,
        issuer: newMFAConfig.issuer,
        accountName: newMFAConfig.accountName,
        phoneNumber: newMFAConfig.phoneNumber,
        emailAddress: newMFAConfig.emailAddress,
      } as any;

      const res = await fetch("/api/tools/mfa-session-controls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("Failed to create MFA config:", txt);
        setIsLoading(false);
        return;
      }

      const created: MFAConfig = await res.json();
      setMfaConfigs(prev => [...prev, created]);
      setNewMFAConfig({
        name: "",
        method: "totp",
        issuer: "",
        accountName: "",
        phoneNumber: "",
        emailAddress: "",
      });
    } catch (error) {
      console.error("Error creating MFA config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createSessionPolicy = () => {
    if (!newSessionPolicy.name.trim()) {
      alert("Policy name is required");
      return;
    }
    // Create on server
    const payload = { action: "create_session_policy", ...newSessionPolicy } as any;
    setIsLoading(true);
    fetch("/api/tools/mfa-session-controls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          console.error("Failed to create session policy", await res.text());
          return;
        }
        const policy: SessionPolicy = await res.json();
        setSessionPolicies(prev => [...prev, policy]);
        setNewSessionPolicy({
          name: "",
          timeout: 30,
          maxConcurrentSessions: 5,
          idleTimeout: 15,
          rememberMe: true,
          rememberMeDuration: 30,
          forceLogoutOnPasswordChange: true,
          deviceFingerprinting: true,
        });
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  };

  const generateImplementationCode = async (config: MFAConfig) => {
    // Generate a simple implementation snippet locally for immediate feedback
    if (!config) return;
    setIsLoading(true);
    try {
      let code = "";
      if (config.method === "totp") {
        code = `// Node.js TOTP example (speakeasy)
const speakeasy = require('speakeasy');

// Secret (store securely)
const secret = '${config.secret || "REPLACE_WITH_SECRET"}';

function verify(token) {
  return speakeasy.totp.verify({ secret, encoding: 'base32', token, window: 1 });
}

console.log('Use verify(token) to validate TOTP codes');`;
      } else if (config.method === "sms") {
        code = `// SMS verification example (pseudo)
// Send a 6-digit code via SMS and verify it on the server
function sendSmsCode(phoneNumber) {
  // integrate with SMS provider
}
`;
      } else {
        code = `// Email verification example (pseudo)
function sendEmailCode(email) {
  // integrate with email provider
}`;
      }

      setGeneratedCode(code);
    } catch (err) {
      console.error("Error generating code:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data from server on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/tools/mfa-session-controls');
        if (!res.ok) return;
        const data = await res.json();
        if (data.mfaConfigs) setMfaConfigs(data.mfaConfigs);
        if (data.sessionPolicies) setSessionPolicies(data.sessionPolicies);
        if (data.activeSessions) setActiveSessions(data.activeSessions);
        if (data.securityEvents) {
          // security events might come as objects
        }
      } catch (err) {
        console.error('Failed to fetch initial MFA/session data', err);
      }
    })();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>MFA & Session Controls Configuration</CardTitle>
          <CardDescription>
            Configure multi-factor authentication and session management policies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="mfa-setup">MFA Setup</TabsTrigger>
              <TabsTrigger value="session-policies">Session Policies</TabsTrigger>
              <TabsTrigger value="active-sessions">Active Sessions</TabsTrigger>
              <TabsTrigger value="implementation">Implementation</TabsTrigger>
            </TabsList>

            <TabsContent value="mfa-setup" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Create MFA Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="config-name">Configuration Name</Label>
                      <Input
                        id="config-name"
                        value={newMFAConfig.name}
                        onChange={(e) =>
                          setNewMFAConfig({ ...newMFAConfig, name: e.target.value })
                        }
                        placeholder="e.g., Admin Portal MFA"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mfa-method">MFA Method</Label>
                      <Select
                        value={newMFAConfig.method}
                        onValueChange={(value: "totp" | "sms" | "email") =>
                          setNewMFAConfig({ ...newMFAConfig, method: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="totp">TOTP (Authenticator App)</SelectItem>
                          <SelectItem value="sms">SMS Verification</SelectItem>
                          <SelectItem value="email">Email Verification</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {newMFAConfig.method === "totp" && (
                      <>
                        <div>
                          <Label htmlFor="issuer">Issuer</Label>
                          <Input
                            id="issuer"
                            value={newMFAConfig.issuer}
                            onChange={(e) =>
                              setNewMFAConfig({ ...newMFAConfig, issuer: e.target.value })
                            }
                            placeholder="e.g., MyApp"
                          />
                        </div>
                        <div>
                          <Label htmlFor="account-name">Account Name</Label>
                          <Input
                            id="account-name"
                            value={newMFAConfig.accountName}
                            onChange={(e) =>
                              setNewMFAConfig({ ...newMFAConfig, accountName: e.target.value })
                            }
                            placeholder="user@example.com"
                          />
                        </div>
                      </>
                    )}

                    {newMFAConfig.method === "sms" && (
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={newMFAConfig.phoneNumber}
                          onChange={(e) =>
                            setNewMFAConfig({ ...newMFAConfig, phoneNumber: e.target.value })
                          }
                          placeholder="+1234567890"
                        />
                      </div>
                    )}

                    {newMFAConfig.method === "email" && (
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          value={newMFAConfig.emailAddress}
                          onChange={(e) =>
                            setNewMFAConfig({ ...newMFAConfig, emailAddress: e.target.value })
                          }
                          placeholder="user@example.com"
                        />
                      </div>
                    )}

                    <Button onClick={createMFAConfig} disabled={isLoading} className="w-full">
                      {isLoading ? "Creating..." : "Create MFA Configuration"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Existing Configurations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-4">
                        {mfaConfigs.map((config) => (
                          <div
                            key={config.id}
                            className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50"
                            onClick={() => setSelectedConfig(config)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{config.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {config.method.toUpperCase()} • {config.enabled ? "Enabled" : "Disabled"}
                                </p>
                              </div>
                              <Badge variant={config.enabled ? "default" : "secondary"}>
                                {config.method}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        {mfaConfigs.length === 0 && (
                          <p className="text-center text-muted-foreground py-8">
                            No MFA configurations yet. Create your first one above.
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {selectedConfig && (
                <Card>
                  <CardHeader>
                    <CardTitle>Configuration Details: {selectedConfig.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Method</Label>
                        <p className="text-sm">{selectedConfig.method.toUpperCase()}</p>
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Badge variant={selectedConfig.enabled ? "default" : "secondary"}>
                          {selectedConfig.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    </div>

                    {selectedConfig.method === "totp" && selectedConfig.secret && (
                      <div>
                        <Label>Secret Key</Label>
                        <div className="flex items-center space-x-2">
                          <Input value={selectedConfig.secret} readOnly />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(selectedConfig.secret!)}
                          >
                            Copy
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Use this secret to generate QR codes for TOTP setup
                        </p>
                      </div>
                    )}

                    <div>
                      <Label>Settings</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Rate Limit</span>
                          <span className="text-sm">{selectedConfig.settings.rateLimit} attempts/minute</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Max Attempts</span>
                          <span className="text-sm">{selectedConfig.settings.maxAttempts}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="session-policies" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Create Session Policy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="policy-name">Policy Name</Label>
                      <Input
                        id="policy-name"
                        value={newSessionPolicy.name}
                        onChange={(e) =>
                          setNewSessionPolicy({ ...newSessionPolicy, name: e.target.value })
                        }
                        placeholder="e.g., Standard User Policy"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                        <Input
                          id="session-timeout"
                          type="number"
                          value={newSessionPolicy.timeout}
                          onChange={(e) =>
                            setNewSessionPolicy({
                              ...newSessionPolicy,
                              timeout: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="max-sessions">Max Concurrent Sessions</Label>
                        <Input
                          id="max-sessions"
                          type="number"
                          value={newSessionPolicy.maxConcurrentSessions}
                          onChange={(e) =>
                            setNewSessionPolicy({
                              ...newSessionPolicy,
                              maxConcurrentSessions: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="remember-me">Enable Remember Me</Label>
                        <Switch
                          id="remember-me"
                          checked={newSessionPolicy.rememberMe}
                          onCheckedChange={(checked) =>
                            setNewSessionPolicy({ ...newSessionPolicy, rememberMe: checked })
                          }
                        />
                      </div>

                      {newSessionPolicy.rememberMe && (
                        <div>
                          <Label htmlFor="remember-duration">Remember Me Duration (days)</Label>
                          <Input
                            id="remember-duration"
                            type="number"
                            value={newSessionPolicy.rememberMeDuration}
                            onChange={(e) =>
                              setNewSessionPolicy({
                                ...newSessionPolicy,
                                rememberMeDuration: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <Label htmlFor="force-logout">Force Logout on Password Change</Label>
                        <Switch
                          id="force-logout"
                          checked={newSessionPolicy.forceLogoutOnPasswordChange}
                          onCheckedChange={(checked) =>
                            setNewSessionPolicy({
                              ...newSessionPolicy,
                              forceLogoutOnPasswordChange: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="device-fingerprinting">Device Fingerprinting</Label>
                        <Switch
                          id="device-fingerprinting"
                          checked={newSessionPolicy.deviceFingerprinting}
                          onCheckedChange={(checked) =>
                            setNewSessionPolicy({
                              ...newSessionPolicy,
                              deviceFingerprinting: checked,
                            })
                          }
                        />
                      </div>
                    </div>

                    <Button onClick={createSessionPolicy} className="w-full">
                      Create Session Policy
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Existing Policies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-4">
                        {sessionPolicies.map((policy) => (
                          <div key={policy.id} className="p-4 border rounded-lg">
                            <h4 className="font-medium">{policy.name}</h4>
                            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                              <p>Timeout: {policy.timeout} minutes</p>
                              <p>Max Sessions: {policy.maxConcurrentSessions}</p>
                              <p>Idle Timeout: {policy.idleTimeout} minutes</p>
                              {policy.rememberMe && (
                                <p>Remember Me: {policy.rememberMeDuration} days</p>
                              )}
                            </div>
                          </div>
                        ))}
                        {sessionPolicies.length === 0 && (
                          <p className="text-center text-muted-foreground py-8">
                            No session policies yet. Create your first one above.
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="active-sessions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Sessions Monitor</CardTitle>
                  <CardDescription>
                    Monitor and manage active user sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-semibold">Active Sessions</h4>
                      <div className="space-x-2">
                        <Button
                          size="sm"
                          onClick={async () => {
                            // refresh
                            try {
                              const res = await fetch('/api/tools/mfa-session-controls?action=get_sessions');
                              if (!res.ok) return;
                              const data = await res.json();
                              setActiveSessions(data);
                            } catch (err) {
                              console.error('Failed to refresh sessions', err);
                            }
                          }}
                        >
                          Refresh
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={async () => {
                            // create a sample session for demo
                            try {
                              const res = await fetch('/api/tools/mfa-session-controls', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ action: 'create_session', userId: 'demo_user' })
                              });
                              if (!res.ok) return;
                              const session = await res.json();
                              setActiveSessions(prev => [session, ...prev]);
                            } catch (err) {
                              console.error('Failed to create sample session', err);
                            }
                          }}
                        >
                          Add Demo Session
                        </Button>
                      </div>
                    </div>

                    <ScrollArea className="h-80">
                      <div className="space-y-3">
                        {activeSessions.length === 0 && (
                          <p className="text-center text-muted-foreground py-8">No active sessions.</p>
                        )}

                        {activeSessions.map(sess => (
                          <div key={sess.id} className="p-4 border rounded-md flex items-start justify-between">
                            <div>
                              <div className="font-medium">{sess.userId} • {sess.deviceInfo.browser} on {sess.deviceInfo.os}</div>
                              <div className="text-sm text-muted-foreground">IP: {sess.deviceInfo.ipAddress} • {new Date(sess.lastActivity).toLocaleString()}</div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge variant={sess.isActive ? 'default' : 'secondary'}>{sess.isActive ? 'Active' : 'Inactive'}</Badge>
                              <Button size="sm" variant="destructive" onClick={async () => {
                                try {
                                  const res = await fetch('/api/tools/mfa-session-controls', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ action: 'terminate_session', sessionId: sess.id })
                                  });
                                  if (!res.ok) {
                                    console.error('Failed to terminate session', await res.text());
                                    return;
                                  }
                                  // update state
                                  setActiveSessions(prev => prev.map(s => s.id === sess.id ? { ...s, isActive: false } : s));
                                } catch (err) {
                                  console.error(err);
                                }
                              }}>Terminate</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="implementation" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Generate Implementation Code</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Select MFA Configuration</Label>
                        <Select
                          value={selectedConfig?.id || ""}
                          onValueChange={(value) => {
                            const config = mfaConfigs.find((c) => c.id === value);
                            setSelectedConfig(config || null);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a configuration" />
                          </SelectTrigger>
                          <SelectContent>
                            {mfaConfigs.map((config) => (
                              <SelectItem key={config.id} value={config.id}>
                                {config.name} ({config.method.toUpperCase()})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        onClick={() => selectedConfig && generateImplementationCode(selectedConfig)}
                        disabled={!selectedConfig || isLoading}
                        className="w-full"
                      >
                        {isLoading ? "Generating..." : "Generate Code"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Implementation Code</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {generatedCode ? (
                      <div className="space-y-4">
                        <ScrollArea className="h-96">
                          <pre className="text-xs bg-muted p-4 rounded-md overflow-x-auto">
                            <code>{generatedCode}</code>
                          </pre>
                        </ScrollArea>
                        <Button
                          variant="outline"
                          onClick={() => navigator.clipboard.writeText(generatedCode)}
                          className="w-full"
                        >
                          Copy Code
                        </Button>
                      </div>
                    ) : (
                      <Alert>
                        <AlertTitle>No Code Generated</AlertTitle>
                        <AlertDescription>
                          Select an MFA configuration and click "Generate Code" to create implementation code.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>

              {selectedConfig ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Integration Examples</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="nodejs" className="w-full">
                        <TabsList>
                          <TabsTrigger value="nodejs">Node.js</TabsTrigger>
                          <TabsTrigger value="python">Python</TabsTrigger>
                          <TabsTrigger value="java">Java</TabsTrigger>
                        </TabsList>

                        <TabsContent value="nodejs" className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Install Dependencies</h4>
                            <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                              <code>npm install speakeasy qrcode express-session</code>
                            </pre>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">TOTP Setup Example</h4>
                            <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
{`const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// Generate secret
const secret = speakeasy.generateSecret({
  name: '${selectedConfig.settings.accountName || 'user@example.com'}',
  issuer: '${selectedConfig.settings.issuer || 'MyApp'}'
});

// Generate QR code for authenticator apps
QRCode.toDataURL(secret.otpauth_url, (err, dataUrl) => {
  console.log('QR Code:', dataUrl);
});

// Verify TOTP token
function verifyToken(token, secret) {
  return speakeasy.totp.verify({
    secret: secret.base32,
    encoding: 'base32',
    token: token,
    window: 2
  });
}`}
                            </pre>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Session Management</h4>
                            <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
{`const session = require('express-session');

// Configure session
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: ${newSessionPolicy.timeout * 60 * 1000}, // ${newSessionPolicy.timeout} minutes
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Session validation middleware
function validateSession(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // Check session timeout
  const now = Date.now();
  const sessionAge = now - req.session.createdAt;
  const maxAge = ${newSessionPolicy.timeout * 60 * 1000};

  if (sessionAge > maxAge) {
    req.session.destroy();
    return res.status(401).json({ error: 'Session expired' });
  }

  // Update last activity
  req.session.lastActivity = now;
  next();
}`}
                            </pre>
                          </div>
                        </TabsContent>

                        <TabsContent value="python" className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Install Dependencies</h4>
                            <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                              <code>pip install pyotp qrcode[pil] flask-session</code>
                            </pre>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">TOTP Setup Example</h4>
                            <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
{`import pyotp
import qrcode
from io import BytesIO

# Generate secret
secret = pyotp.random_base32()

# Create TOTP object
totp = pyotp.TOTP(secret)

# Generate provisioning URI
provisioning_uri = totp.provisioning_uri(
    name='${selectedConfig.settings.accountName || 'user@example.com'}',
    issuer_name='${selectedConfig.settings.issuer || 'MyApp'}'
)

# Generate QR code
qr = qrcode.QRCode()
qr.add_data(provisioning_uri)
qr.make(fit=True)
img = qr.make_image(fill_color="black", back_color="white")

# Verify TOTP token
def verify_token(token, secret):
    totp = pyotp.TOTP(secret)
    return totp.verify(token)`}
                            </pre>
                          </div>
                        </TabsContent>

                        <TabsContent value="java" className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Maven Dependencies</h4>
                            <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
{`<dependency>
  <groupId>com.warrenstrange</groupId>
  <artifactId>googleauth</artifactId>
  <version>1.5.0</version>
</dependency>`}
                            </pre>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">TOTP Setup Example</h4>
                            <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
{`import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;

// Create authenticator
GoogleAuthenticator gAuth = new GoogleAuthenticator();

// Generate secret key
final GoogleAuthenticatorKey key = gAuth.createCredentials();

// Get secret
String secret = key.getKey();

// Verify TOTP token
boolean isValid = gAuth.authorize(secret, Integer.parseInt(token));`}
                            </pre>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Session Management</h4>
                            <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
{`import javax.servlet.http.HttpSession;
import java.util.concurrent.TimeUnit;

// Configure session timeout
session.setMaxInactiveInterval(${newSessionPolicy.timeout * 60}); // ${newSessionPolicy.timeout} minutes

// Session validation
public boolean validateSession(HttpSession session) {
    long now = System.currentTimeMillis();
    long sessionStart = session.getCreationTime();
    long sessionAge = now - sessionStart;
    long maxAge = TimeUnit.MINUTES.toMillis(${newSessionPolicy.timeout});

    if (sessionAge > maxAge) {
        session.invalidate();
        return false;
    }

    session.setAttribute("lastActivity", now);
    return true;
}`}
                            </pre>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Alert>
                  <AlertTitle>No Configuration Selected</AlertTitle>
                  <AlertDescription>
                    Create and configure an MFA setup to generate implementation code.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}