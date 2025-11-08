'use client'

// Force recompilation - added comment

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import {
  Shield,
  Key,
  Smartphone,
  Mail,
  Clock,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity,
  Settings,
  Users,
  Lock,
  Unlock,
  Trash2,
  Copy,
  Download,
  Upload,
  QrCode,
  Phone,
  MessageSquare,
  Monitor,
  Globe,
  Zap,
  BarChart3,
  TrendingUp,
  Calendar,
  UserCheck,
  UserX,
  AlertCircle,
  Info,
  Play,
  Pause
} from 'lucide-react'

interface MFASetup {
  secret: string
  qrCodeUrl: string
  backupCodes: string[]
}

interface Session {
  id: string
  deviceFingerprint: string
  browser?: string
  os?: string
  ipAddress: string
  location: string
  lastActivity: Date
  createdAt: Date
  isActive: boolean
  isCurrentSession: boolean
}

interface SecurityEvent {
  id: string
  type: 'login_attempt' | 'mfa_verification' | 'session_terminated' | 'suspicious_activity' | 'password_change'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: Date
  ipAddress: string
  userAgent: string
  success: boolean
}

interface DashboardStats {
  activeSessions: number
  totalMFASetups: number
  securityEventsToday: number
  failedLoginAttempts: number
  recentEvents: SecurityEvent[]
}

export default function MFASessionControlsClient() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isLoading, setIsLoading] = useState(false)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [mfaSetup, setMfaSetup] = useState<MFASetup | null>(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [sessions, setSessions] = useState<Session[]>([])
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [testPhone, setTestPhone] = useState('')
  const [testEmail, setTestEmail] = useState('')
  const [smsCode, setSmsCode] = useState('')
  const [emailCode, setEmailCode] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const [showSecret, setShowSecret] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedData, setUploadedData] = useState<any>(null)
  const [sessionPolicies, setSessionPolicies] = useState({
    maxSessions: 5,
    sessionTimeout: 60,
    requireMFA: true,
    allowMultipleDevices: false
  })
  const [eventSearchTerm, setEventSearchTerm] = useState('')
  const [eventSeverityFilter, setEventSeverityFilter] = useState('all')
  const [eventSuccessFilter, setEventSuccessFilter] = useState('all')
  const [sessionSearchTerm, setSessionSearchTerm] = useState('')
  const [sessionStatusFilter, setSessionStatusFilter] = useState('all')
  const [securityEventSearchTerm, setSecurityEventSearchTerm] = useState('')
  const [securityEventSeverityFilter, setSecurityEventSeverityFilter] = useState('all')
  const [securityEventSuccessFilter, setSecurityEventSuccessFilter] = useState('all')

  useEffect(() => {
    loadDashboardStats()
    loadSessions()
    loadSecurityEvents()
  }, [])

  const loadDashboardStats = async () => {
    try {
      const response = await fetch('/api/tools/mfa-session-controls?action=get_dashboard_stats')
      if (response.ok) {
        const data = await response.json()
        // Server returns a stats object directly. Normalize to DashboardStats shape.
        const stats = {
          activeSessions: data.activeSessions ?? data.activeSessionsCount ?? data.activeSessionsCount ?? data.activeSessions ?? data.totalSessions ?? 0,
          totalMFASetups: data.totalMFASetups ?? data.mfaConfigs ?? data.mfaConfigsCount ?? 0,
          securityEventsToday: data.securityEventsToday ?? (data.stats && data.stats.securityEventsToday) ?? 0,
          failedLoginAttempts: data.failedLoginAttempts ?? data.failedLogins ?? 0,
          recentEvents: Array.isArray(data.recentEvents)
            ? data.recentEvents.map((e: any) => ({ ...e, timestamp: e.timestamp ? new Date(e.timestamp) : new Date() }))
            : []
        }

        setDashboardStats(stats)
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    }
  }

  const loadSessions = async () => {
    try {
      const response = await fetch('/api/tools/mfa-session-controls?action=get_sessions')
      if (response.ok) {
        const data = await response.json()
        // Server may return an array directly or an object wrapping sessions
        const rawArray = Array.isArray(data) ? data : (Array.isArray(data.sessions) ? data.sessions : (Array.isArray(data.activeSessions) ? data.activeSessions : []))
        const parsed = rawArray.map((s: any) => ({
          ...s,
          lastActivity: s.lastActivity ? new Date(s.lastActivity) : new Date(),
          createdAt: s.createdAt ? new Date(s.createdAt) : new Date(),
        }))
        setSessions(parsed)
      }
    } catch (error) {
      console.error('Error loading sessions:', error)
      setSessions([])
    }
  }

  const loadSecurityEvents = async () => {
    try {
      const response = await fetch('/api/tools/mfa-session-controls?action=get_security_events')
      if (response.ok) {
        const data = await response.json()
        const rawArray = Array.isArray(data) ? data : (Array.isArray(data.events) ? data.events : [])
        const parsed = rawArray.map((e: any) => ({
          ...e,
          timestamp: e.timestamp ? new Date(e.timestamp) : new Date(),
        }))
        setSecurityEvents(parsed)
      }
    } catch (error) {
      console.error('Error loading security events:', error)
      setSecurityEvents([])
    }
  }

  const createMFASetup = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/tools/mfa-session-controls?action=create_mfa', {
        method: 'POST'
      })
      if (response.ok) {
        const data = await response.json()
        setMfaSetup(data.mfaSetup)
        toast.success('MFA setup created successfully')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create MFA setup')
      }
    } catch (error) {
      console.error('Error creating MFA setup:', error)
      toast.error('Failed to create MFA setup')
    } finally {
      setIsLoading(false)
    }
  }

  const verifyTOTP = async () => {
    if (!verificationCode.trim()) {
      toast.error('Please enter verification code')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/tools/mfa-session-controls?action=verify_totp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode })
      })
      if (response.ok) {
        const data = await response.json()
        toast.success(data.message || 'TOTP verified successfully')
        setVerificationCode('')
        loadDashboardStats()
      } else {
        const error = await response.json()
        toast.error(error.error || 'TOTP verification failed')
      }
    } catch (error) {
      console.error('Error verifying TOTP:', error)
      toast.error('Failed to verify TOTP')
    } finally {
      setIsLoading(false)
    }
  }

  const sendSMSCode = async () => {
    if (!testPhone.trim()) {
      toast.error('Please enter phone number')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/tools/mfa-session-controls?action=send_sms_code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: testPhone })
      })
      if (response.ok) {
        toast.success('SMS code sent successfully')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to send SMS code')
      }
    } catch (error) {
      console.error('Error sending SMS code:', error)
      toast.error('Failed to send SMS code')
    } finally {
      setIsLoading(false)
    }
  }

  const verifySMSCode = async () => {
    if (!smsCode.trim()) {
      toast.error('Please enter SMS code')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/tools/mfa-session-controls?action=verify_sms_code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: smsCode })
      })
      if (response.ok) {
        const data = await response.json()
        toast.success(data.message || 'SMS code verified successfully')
        setSmsCode('')
        loadDashboardStats()
      } else {
        const error = await response.json()
        toast.error(error.error || 'SMS code verification failed')
      }
    } catch (error) {
      console.error('Error verifying SMS code:', error)
      toast.error('Failed to verify SMS code')
    } finally {
      setIsLoading(false)
    }
  }

  const sendEmailCode = async () => {
    if (!testEmail.trim()) {
      toast.error('Please enter email address')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/tools/mfa-session-controls?action=send_email_code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail })
      })
      if (response.ok) {
        toast.success('Email code sent successfully')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to send email code')
      }
    } catch (error) {
      console.error('Error sending email code:', error)
      toast.error('Failed to send email code')
    } finally {
      setIsLoading(false)
    }
  }

  const verifyEmailCode = async () => {
    if (!emailCode.trim()) {
      toast.error('Please enter email code')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/tools/mfa-session-controls?action=verify_email_code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: emailCode })
      })
      if (response.ok) {
        const data = await response.json()
        toast.success(data.message || 'Email code verified successfully')
        setEmailCode('')
        loadDashboardStats()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Email code verification failed')
      }
    } catch (error) {
      console.error('Error verifying email code:', error)
      toast.error('Failed to verify email code')
    } finally {
      setIsLoading(false)
    }
  }

  const testTOTPCode = async () => {
    if (!totpCode.trim()) {
      toast.error('Please enter TOTP code')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/tools/mfa-session-controls?action=test_totp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: totpCode })
      })
      if (response.ok) {
        const data = await response.json()
        toast.success(data.message || 'TOTP code verified successfully')
        setTotpCode('')
      } else {
        const error = await response.json()
        toast.error(error.error || 'TOTP code verification failed')
      }
    } catch (error) {
      console.error('Error testing TOTP code:', error)
      toast.error('Failed to test TOTP code')
    } finally {
      setIsLoading(false)
    }
  }

  const terminateSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to terminate this session?')) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/tools/mfa-session-controls?action=terminate_session&sessionId=${sessionId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        toast.success('Session terminated successfully')
        loadSessions()
        loadDashboardStats()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to terminate session')
      }
    } catch (error) {
      console.error('Error terminating session:', error)
      toast.error('Failed to terminate session')
    } finally {
      setIsLoading(false)
    }
  }

  const updateSessionPolicies = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/tools/mfa-session-controls?action=update_policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionPolicies)
      })
      if (response.ok) {
        toast.success('Session policies updated successfully')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update session policies')
      }
    } catch (error) {
      console.error('Error updating session policies:', error)
      toast.error('Failed to update session policies')
    } finally {
      setIsLoading(false)
    }
  }

  const generateSecurityReport = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/tools/mfa-session-controls?action=generate_security_report')
      if (response.ok) {
        const data = await response.json()
        toast.success('Security report generated successfully')
        // In a real app, you might download the report or show it in a modal
        console.log('Security Report:', data.report)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to generate security report')
      }
    } catch (error) {
      console.error('Error generating security report:', error)
      toast.error('Failed to generate security report')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadedFile(file)
    setUploadProgress(0)

    // Validate file type
    const allowedTypes = ['application/json', 'text/plain', 'text/csv', 'application/xml', 'text/xml']
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.json') && !file.name.endsWith('.txt') && !file.name.endsWith('.csv') && !file.name.endsWith('.xml')) {
      toast.error('Please upload a valid configuration file (JSON, TXT, CSV, or XML)')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('action', 'upload_config')

      const response = await fetch('/api/tools/mfa-session-controls', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setUploadedData(data)
        toast.success('File uploaded and processed successfully')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to upload file')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Failed to upload file')
    } finally {
      setIsLoading(false)
      setUploadProgress(100)
    }
  }

  const importConfiguration = async () => {
    if (!uploadedData || !uploadedData.parsedData) {
      toast.error('No valid file data available for import')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/tools/mfa-session-controls?action=import_config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: uploadedData.parsedData })
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Configuration imported successfully')
        // Refresh all data
        loadDashboardStats()
        loadSessions()
        loadSecurityEvents()
        setUploadedData(null)
        setUploadedFile(null)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to import configuration')
      }
    } catch (error) {
      console.error('Error importing configuration:', error)
      toast.error('Failed to import configuration')
    } finally {
      setIsLoading(false)
    }
  }

  const exportConfiguration = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/tools/mfa-session-controls?action=export_config')
      if (response.ok) {
        const data = await response.json()
        
        // Create and download the export file
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `mfa-config-export-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        toast.success('Configuration exported successfully')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to export configuration')
      }
    } catch (error) {
      console.error('Error exporting configuration:', error)
      toast.error('Failed to export configuration')
    } finally {
      setIsLoading(false)
    }
  }

  const generateSampleData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/tools/mfa-session-controls?action=generate_sample_data', {
        method: 'POST'
      })
      if (response.ok) {
        const data = await response.json()
        toast.success(`Sample data generated: ${data.sessionsAdded} sessions, ${data.eventsAdded} events`)
        // Refresh all data
        loadDashboardStats()
        loadSessions()
        loadSecurityEvents()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to generate sample data')
      }
    } catch (error) {
      console.error('Error generating sample data:', error)
      toast.error('Failed to generate sample data')
    } finally {
      setIsLoading(false)
    }
  }

  const clearUploadedData = () => {
    setUploadedFile(null)
    setUploadedData(null)
    setUploadProgress(0)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-blue-600 bg-blue-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />
      case 'high': return <XCircle className="h-4 w-4" />
      case 'medium': return <AlertCircle className="h-4 w-4" />
      case 'low': return <Info className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">MFA & Session Controls</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive multi-factor authentication and session management system
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={loadDashboardStats}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={generateSecurityReport}>
            <Download className="h-4 w-4 mr-2" />
            Security Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="mfa-setup">MFA Setup</TabsTrigger>
          <TabsTrigger value="session-policies">Session Policies</TabsTrigger>
          <TabsTrigger value="active-sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="security-events">Security Events</TabsTrigger>
          <TabsTrigger value="file-operations">File Operations</TabsTrigger>
          <TabsTrigger value="testing">Testing Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="flex items-center justify-end">
            <Button onClick={async () => { setIsLoading(true); await Promise.all([loadDashboardStats(), loadSessions(), loadSecurityEvents()]); setIsLoading(false); }} disabled={isLoading}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Get Results
            </Button>
          </div>

          {dashboardStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.activeSessions}</div>
                  <p className="text-xs text-muted-foreground">
                    Currently active user sessions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">MFA Setups</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalMFASetups}</div>
                  <p className="text-xs text-muted-foreground">
                    Total MFA configurations
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Security Events Today</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.securityEventsToday}</div>
                  <p className="text-xs text-muted-foreground">
                    Events logged today
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Failed Login Attempts</CardTitle>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.failedLoginAttempts}</div>
                  <p className="text-xs text-muted-foreground">
                    Failed attempts today
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>Latest security events and activities</CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex-1">
                  <Label htmlFor="event-search" className="text-sm font-medium">Search Events</Label>
                  <Input
                    id="event-search"
                    placeholder="Search by message, IP, or user agent..."
                    value={eventSearchTerm}
                    onChange={(e) => setEventSearchTerm(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="sm:w-48">
                  <Label htmlFor="event-severity" className="text-sm font-medium">Severity Filter</Label>
                  <Select value={eventSeverityFilter} onValueChange={setEventSeverityFilter}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="All Severities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:w-48">
                  <Label htmlFor="event-success" className="text-sm font-medium">Status Filter</Label>
                  <Select value={eventSuccessFilter} onValueChange={setEventSuccessFilter}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardStats?.recentEvents
                  ?.filter((event) => {
                    const matchesSearch = !eventSearchTerm ||
                      event.message.toLowerCase().includes(eventSearchTerm.toLowerCase()) ||
                      event.ipAddress.toLowerCase().includes(eventSearchTerm.toLowerCase()) ||
                      event.userAgent?.toLowerCase().includes(eventSearchTerm.toLowerCase());
                    const matchesSeverity = eventSeverityFilter === 'all' || event.severity === eventSeverityFilter;
                    const matchesSuccess = eventSuccessFilter === 'all' ||
                      (eventSuccessFilter === 'success' && event.success) ||
                      (eventSuccessFilter === 'failed' && !event.success);
                    return matchesSearch && matchesSeverity && matchesSuccess;
                  })
                  ?.slice(0, 10)
                  .map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${getSeverityColor(event.severity)}`}>
                        {getSeverityIcon(event.severity)}
                      </div>
                      <div>
                        <h4 className="font-semibold">{event.message}</h4>
                        <p className="text-sm text-muted-foreground">
                          {event.timestamp.toLocaleString()} • {event.ipAddress}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={event.success ? 'default' : 'destructive'}>
                        {event.success ? 'Success' : 'Failed'}
                      </Badge>
                      <Badge variant="outline" className={getSeverityColor(event.severity)}>
                        {event.severity}
                      </Badge>
                    </div>
                  </div>
                ))}
                {(!dashboardStats?.recentEvents ||
                  dashboardStats.recentEvents.filter((event) => {
                    const matchesSearch = !eventSearchTerm ||
                      event.message.toLowerCase().includes(eventSearchTerm.toLowerCase()) ||
                      event.ipAddress.toLowerCase().includes(eventSearchTerm.toLowerCase()) ||
                      event.userAgent?.toLowerCase().includes(eventSearchTerm.toLowerCase());
                    const matchesSeverity = eventSeverityFilter === 'all' || event.severity === eventSeverityFilter;
                    const matchesSuccess = eventSuccessFilter === 'all' ||
                      (eventSuccessFilter === 'success' && event.success) ||
                      (eventSuccessFilter === 'failed' && !event.success);
                    return matchesSearch && matchesSeverity && matchesSuccess;
                  }).length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No security events match your filters</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mfa-setup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>MFA Setup & Configuration</CardTitle>
              <CardDescription>Set up multi-factor authentication for enhanced security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!mfaSetup ? (
                <div className="text-center py-8">
                  <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No MFA Setup Found</h3>
                  <p className="text-muted-foreground mb-4">
                    Create a new MFA setup to enable two-factor authentication
                  </p>
                  <Button onClick={createMFASetup} disabled={isLoading}>
                    {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Shield className="h-4 w-4 mr-2" />}
                    Create MFA Setup
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <Alert>
                    <QrCode className="h-4 w-4" />
                    <AlertDescription>
                      Scan the QR code below with your authenticator app (Google Authenticator, Authy, etc.)
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-center">
                    <div className="p-4 border-2 border-dashed rounded-lg">
                      <img
                        src={mfaSetup.qrCodeUrl}
                        alt="MFA QR Code"
                        className="w-48 h-48"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Secret Key (keep this safe)</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={showSecret ? mfaSetup.secret : '•'.repeat(mfaSetup.secret.length)}
                        readOnly
                        className="font-mono"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSecret(!showSecret)}
                        aria-label={showSecret ? "Hide secret" : "Show secret"}
                      >
                        {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(mfaSetup.secret)
                          toast.success('Secret copied to clipboard')
                        }}
                        aria-label="Copy secret"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Backup Codes</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {(mfaSetup.backupCodes || []).map((code, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-muted rounded">
                          <code className="font-mono text-sm">{code}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(code)
                              toast.success('Backup code copied')
                            }}
                            aria-label={`Copy backup code ${index + 1}`}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Save these backup codes in a safe place. Each code can only be used once.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Verify Setup</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Enter 6-digit code from authenticator"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        maxLength={6}
                      />
                      <Button onClick={verifyTOTP} disabled={isLoading || verificationCode.length !== 6}>
                        {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                        Verify
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="session-policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Management Policies</CardTitle>
              <CardDescription>Configure session timeout, limits, and security policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max-sessions">Maximum Sessions per User</Label>
                  <Input
                    id="max-sessions"
                    type="number"
                    value={sessionPolicies.maxSessions}
                    onChange={(e) => setSessionPolicies(prev => ({ ...prev, maxSessions: parseInt(e.target.value) }))}
                    min={1}
                    max={20}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={sessionPolicies.sessionTimeout}
                    onChange={(e) => setSessionPolicies(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                    min={5}
                    max={480}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="require-mfa"
                    checked={sessionPolicies.requireMFA}
                    onChange={(e) => setSessionPolicies(prev => ({ ...prev, requireMFA: e.target.checked }))}
                  />
                  <Label htmlFor="require-mfa">Require MFA for all logins</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="allow-multiple"
                    checked={sessionPolicies.allowMultipleDevices}
                    onChange={(e) => setSessionPolicies(prev => ({ ...prev, allowMultipleDevices: e.target.checked }))}
                  />
                  <Label htmlFor="allow-multiple">Allow multiple device sessions</Label>
                </div>
              </div>

              <Button onClick={updateSessionPolicies} disabled={isLoading}>
                {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Settings className="h-4 w-4 mr-2" />}
                Update Policies
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active-sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Monitor and manage active user sessions</CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex-1">
                  <Label htmlFor="session-search" className="text-sm font-medium">Search Sessions</Label>
                  <Input
                    id="session-search"
                    placeholder="Search by browser, OS, IP, or location..."
                    value={sessionSearchTerm}
                    onChange={(e) => setSessionSearchTerm(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="sm:w-48">
                  <Label htmlFor="session-status" className="text-sm font-medium">Status Filter</Label>
                  <Select value={sessionStatusFilter} onValueChange={setSessionStatusFilter}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(sessions || [])
                  .filter((session) => {
                    const matchesSearch = !sessionSearchTerm ||
                      (session.browser || '').toLowerCase().includes(sessionSearchTerm.toLowerCase()) ||
                      (session.os || '').toLowerCase().includes(sessionSearchTerm.toLowerCase()) ||
                      session.ipAddress.toLowerCase().includes(sessionSearchTerm.toLowerCase()) ||
                      session.location.toLowerCase().includes(sessionSearchTerm.toLowerCase());
                    const matchesStatus = sessionStatusFilter === 'all' ||
                      (sessionStatusFilter === 'active' && session.isActive) ||
                      (sessionStatusFilter === 'inactive' && !session.isActive);
                    return matchesSearch && matchesStatus;
                  })
                  .map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${session.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <div>
                        <h4 className="font-semibold">
                          {session.browser ?? 'Unknown'} on {session.os ?? 'Unknown'}
                          {session.isCurrentSession && <Badge variant="outline" className="ml-2">Current</Badge>}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {session.location} • {session.ipAddress}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Last activity: {session.lastActivity.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={session.isActive ? 'default' : 'secondary'}>
                        {session.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      {!session.isCurrentSession && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => terminateSession(session.id)}
                          disabled={isLoading}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Terminate
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {((sessions || []).filter((session) => {
                    const matchesSearch = !sessionSearchTerm ||
                      (session.browser || '').toLowerCase().includes(sessionSearchTerm.toLowerCase()) ||
                      (session.os || '').toLowerCase().includes(sessionSearchTerm.toLowerCase()) ||
                      session.ipAddress.toLowerCase().includes(sessionSearchTerm.toLowerCase()) ||
                      session.location.toLowerCase().includes(sessionSearchTerm.toLowerCase());
                  const matchesStatus = sessionStatusFilter === 'all' ||
                    (sessionStatusFilter === 'active' && session.isActive) ||
                    (sessionStatusFilter === 'inactive' && !session.isActive);
                  return matchesSearch && matchesStatus;
                }).length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No sessions match your filters</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security-events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Events Log</CardTitle>
              <CardDescription>Monitor security events and suspicious activities</CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex-1">
                  <Label htmlFor="security-event-search" className="text-sm font-medium">Search Events</Label>
                  <Input
                    id="security-event-search"
                    placeholder="Search by message, IP, user agent..."
                    value={securityEventSearchTerm}
                    onChange={(e) => setSecurityEventSearchTerm(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="sm:w-48">
                  <Label htmlFor="security-event-severity" className="text-sm font-medium">Severity Filter</Label>
                  <Select value={securityEventSeverityFilter} onValueChange={setSecurityEventSeverityFilter}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="All Severities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:w-48">
                  <Label htmlFor="security-event-success" className="text-sm font-medium">Status Filter</Label>
                  <Select value={securityEventSuccessFilter} onValueChange={setSecurityEventSuccessFilter}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(securityEvents || [])
                  .filter((event) => {
                    const matchesSearch = !securityEventSearchTerm ||
                      event.message.toLowerCase().includes(securityEventSearchTerm.toLowerCase()) ||
                      event.ipAddress.toLowerCase().includes(securityEventSearchTerm.toLowerCase()) ||
                      event.userAgent?.toLowerCase().includes(securityEventSearchTerm.toLowerCase());
                    const matchesSeverity = securityEventSeverityFilter === 'all' || event.severity === securityEventSeverityFilter;
                    const matchesSuccess = securityEventSuccessFilter === 'all' ||
                      (securityEventSuccessFilter === 'success' && event.success) ||
                      (securityEventSuccessFilter === 'failed' && !event.success);
                    return matchesSearch && matchesSeverity && matchesSuccess;
                  })
                  .map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${getSeverityColor(event.severity)}`}>
                        {getSeverityIcon(event.severity)}
                      </div>
                      <div>
                        <h4 className="font-semibold">{event.message}</h4>
                        <p className="text-sm text-muted-foreground">
                          {event.timestamp.toLocaleString()} • {event.ipAddress}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          User Agent: {event.userAgent.substring(0, 50)}...
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={event.success ? 'default' : 'destructive'}>
                        {event.success ? 'Success' : 'Failed'}
                      </Badge>
                      <Badge variant="outline" className={getSeverityColor(event.severity)}>
                        {event.severity}
                      </Badge>
                    </div>
                  </div>
                ))}
                {((securityEvents || []).filter((event) => {
                  const matchesSearch = !securityEventSearchTerm ||
                    event.message.toLowerCase().includes(securityEventSearchTerm.toLowerCase()) ||
                    event.ipAddress.toLowerCase().includes(securityEventSearchTerm.toLowerCase()) ||
                    event.userAgent?.toLowerCase().includes(securityEventSearchTerm.toLowerCase());
                  const matchesSeverity = securityEventSeverityFilter === 'all' || event.severity === securityEventSeverityFilter;
                  const matchesSuccess = securityEventSuccessFilter === 'all' ||
                    (securityEventSuccessFilter === 'success' && event.success) ||
                    (securityEventSuccessFilter === 'failed' && !event.success);
                  return matchesSearch && matchesSeverity && matchesSuccess;
                }).length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No security events match your filters</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="file-operations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Import Configuration</CardTitle>
                <CardDescription>Upload and import MFA configuration files</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Upload Configuration File</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="file"
                      accept=".json,.txt,.csv,.xml"
                      onChange={handleFileUpload}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    {uploadedFile && (
                      <Button variant="outline" size="sm" onClick={clearUploadedData}>
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Supported formats: JSON, TXT, CSV, XML (max 10MB)
                  </p>
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="space-y-2">
                    <Label>Uploading...</Label>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}

                {uploadedFile && (
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">File Details</h4>
                      <Badge variant="outline">{uploadedFile.type || 'Unknown'}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Name:</strong> {uploadedFile.name}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      <strong>Size:</strong> {(uploadedFile.size / 1024).toFixed(2)} KB
                    </p>
                    {uploadedData && (
                      <div className="space-y-2">
                        <Label>Preview (first 500 characters)</Label>
                        <Textarea
                          value={JSON.stringify(uploadedData, null, 2).substring(0, 500) + (JSON.stringify(uploadedData, null, 2).length > 500 ? '...' : '')}
                          readOnly
                          rows={6}
                          className="font-mono text-xs"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button 
                    onClick={importConfiguration} 
                    disabled={isLoading || !uploadedData}
                    className="flex-1"
                  >
                    {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                    Import Configuration
                  </Button>
                  <Button variant="outline" onClick={clearUploadedData} disabled={!uploadedFile}>
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Configuration</CardTitle>
                <CardDescription>Download current MFA configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Export Options</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• MFA Settings and Configurations</p>
                      <p>• Session Policies and Rules</p>
                      <p>• Security Event Logs</p>
                      <p>• Active Session Data</p>
                      <p>• Dashboard Statistics</p>
                    </div>
                  </div>

                  <Alert>
                    <Download className="h-4 w-4" />
                    <AlertDescription>
                      Export will include all current MFA and session configuration data in JSON format.
                      This file can be imported back into the system or used for backup purposes.
                    </AlertDescription>
                  </Alert>

                  <Button onClick={exportConfiguration} disabled={isLoading} className="w-full">
                    {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                    Export Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Supported File Formats</CardTitle>
                <CardDescription>Information about supported configuration file formats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">JSON Format</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Standard configuration format</p>
                      <p>• Supports all MFA and session settings</p>
                      <p>• Human-readable and editable</p>
                      <p>• Recommended for backups</p>
                    </div>
                    <pre className="mt-3 p-3 bg-muted rounded text-xs font-mono overflow-x-auto">
{`{
  "mfaConfigs": [...],
  "sessionPolicies": {...},
  "securityEvents": [...]
}`}
                    </pre>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Other Formats</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• CSV: For bulk data import</p>
                      <p>• XML: Legacy system compatibility</p>
                      <p>• TXT: Simple configuration files</p>
                      <p>• Automatic format detection</p>
                    </div>
                    <Alert className="mt-3">
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Files are validated and parsed automatically. Invalid or corrupted files will be rejected with detailed error messages.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Test TOTP Verification</CardTitle>
                <CardDescription>Test TOTP code verification with your setup</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Enter TOTP Code</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="000000"
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                    />
                    <Button onClick={testTOTPCode} disabled={isLoading || totpCode.length !== 6}>
                      {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                      Test
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test SMS Verification</CardTitle>
                <CardDescription>Send and verify SMS codes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="+1234567890"
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value)}
                    />
                    <Button onClick={sendSMSCode} disabled={isLoading || !testPhone.trim()}>
                      {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                      Send SMS
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Enter SMS Code</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="000000"
                      value={smsCode}
                      onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                    />
                    <Button onClick={verifySMSCode} disabled={isLoading || smsCode.length !== 6}>
                      {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                      Verify
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Email Verification</CardTitle>
                <CardDescription>Send and verify email codes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="user@example.com"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                    <Button onClick={sendEmailCode} disabled={isLoading || !testEmail.trim()}>
                      {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                      Send Email
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Enter Email Code</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="000000"
                      value={emailCode}
                      onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                    />
                    <Button onClick={verifyEmailCode} disabled={isLoading || emailCode.length !== 6}>
                      {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                      Verify
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common testing and management actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" onClick={generateSampleData} disabled={isLoading} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Generate Sample Data
                </Button>
                <Button variant="outline" onClick={createMFASetup} disabled={isLoading} className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Create New MFA Setup
                </Button>
                <Button variant="outline" onClick={generateSecurityReport} disabled={isLoading} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Security Report
                </Button>
                <Button variant="outline" onClick={() => { loadSessions(); loadSecurityEvents(); loadDashboardStats() }} disabled={isLoading} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh All Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}