'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Plus,
  Play,
  Pause,
  Square,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
  Settings,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Copy,
  Share,
  Filter,
  Search,
  Calendar,
  Activity,
  PieChart,
  LineChart,
  ScatterChart
} from 'lucide-react'

interface Experiment {
  id: string
  name: string
  description: string
  status: 'draft' | 'running' | 'paused' | 'completed' | 'stopped'
  variants: Variant[]
  metrics: Metric[]
  targetAudience: string
  startDate?: Date
  endDate?: Date
  duration: number // in days
  trafficAllocation: number // percentage
  confidenceLevel: number
  statisticalSignificance: number
  winner?: string
  createdAt: Date
  updatedAt: Date
}

interface Variant {
  id: string
  name: string
  description: string
  trafficPercentage: number
  visitors: number
  conversions: number
  conversionRate: number
  confidence: number
  isControl: boolean
}

interface Metric {
  id?: string
  name: string
  type: 'conversion' | 'engagement' | 'revenue'
  goal: 'maximize' | 'minimize'
  baseline: number
  target: number
}

interface ExperimentResult {
  experimentId: string
  variantId: string
  metricId: string
  value: number
  timestamp: Date
  confidence: number
  statisticalSignificance: number
}

export default function ABTestManagerClient() {
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentTab, setCurrentTab] = useState('overview')
  const [liveExperiment, setLiveExperiment] = useState<Experiment | null>(null)
  const [isLiveMode, setIsLiveMode] = useState(false)
  const [liveMode, setLiveMode] = useState<Record<string, boolean>>({})
  const [liveData, setLiveData] = useState<Record<string, any>>({})
  const eventSourceRef = useRef<EventSource | null>(null)

  // Form states for creating experiments
  const [newExperiment, setNewExperiment] = useState({
    name: '',
    description: '',
    targetAudience: '',
    duration: 14,
    trafficAllocation: 100,
    confidenceLevel: 95
  })

  const [newVariants, setNewVariants] = useState([
    { name: 'Control', description: 'Original version', trafficPercentage: 50, isControl: true },
    { name: 'Variant A', description: 'Test version', trafficPercentage: 50, isControl: false }
  ])

  const [newMetrics, setNewMetrics] = useState<Metric[]>([
    { name: 'Conversion Rate', type: 'conversion' as const, goal: 'maximize' as const, baseline: 0, target: 0 }
  ])

  useEffect(() => {
    loadExperiments()
  }, [])

  // Real-time updates effect
  useEffect(() => {
    if (selectedExperiment && isLiveMode && selectedExperiment.status === 'running') {
      startLiveUpdates(selectedExperiment.id)
    } else {
      stopLiveUpdates()
    }

    return () => stopLiveUpdates()
  }, [selectedExperiment, isLiveMode])

  // Cleanup live connections when component unmounts
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  const startLiveUpdates = (experimentId: string) => {
    stopLiveUpdates() // Clean up any existing connection

    const eventSource = new EventSource(`/api/tools/ab-test-manager/${experimentId}/live`)
    eventSourceRef.current = eventSource

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'experiment') {
          setLiveExperiment(data.experiment)
          // Update the experiment in the main list
          setExperiments(prev => prev.map(exp =>
            exp.id === data.experiment.id ? data.experiment : exp
          ))
          // Update selected experiment if it's the live one
          if (selectedExperiment?.id === data.experiment.id) {
            setSelectedExperiment(data.experiment)
          }
        }
      } catch (error) {
        console.error('Error parsing live update:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('Live update error:', error)
      toast.error('Lost connection to live updates')
      setIsLiveMode(false)
    }
  }

  const stopLiveUpdates = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    setLiveExperiment(null)
  }

  const toggleLiveMode = (experimentId: string, enabled: boolean) => {
    setLiveMode(prev => ({ ...prev, [experimentId]: enabled }))

    if (enabled) {
      // Start live updates for this experiment
      const eventSource = new EventSource(`/api/tools/ab-test-manager/${experimentId}/live`)
      eventSourceRef.current = eventSource

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'experiment') {
            setLiveData(prev => ({ ...prev, [experimentId]: data.experiment }))
            // Update the experiment in the main list
            setExperiments(prev => prev.map(exp =>
              exp.id === data.experiment.id ? data.experiment : exp
            ))
            // Update selected experiment if it's the live one
            if (selectedExperiment?.id === data.experiment.id) {
              setSelectedExperiment(data.experiment)
            }
          }
        } catch (error) {
          console.error('Error parsing live update:', error)
        }
      }

      eventSource.onerror = (error) => {
        console.error('Live update error:', error)
        toast.error('Lost connection to live updates')
        setLiveMode(prev => ({ ...prev, [experimentId]: false }))
      }
    } else {
      // Stop live updates
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
      setLiveData(prev => {
        const newData = { ...prev }
        delete newData[experimentId]
        return newData
      })
    }
  }

  const loadExperiments = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/tools/ab-test-manager')
      if (response.ok) {
        const data = await response.json()
        setExperiments(data.experiments || [])
      }
    } catch (error) {
      console.error('Error loading experiments:', error)
      toast.error('Failed to load experiments')
    } finally {
      setIsLoading(false)
    }
  }

  const createExperiment = async () => {
    if (!newExperiment.name.trim()) {
      toast.error('Experiment name is required')
      return
    }

    if (newVariants.length < 2) {
      toast.error('At least 2 variants are required')
      return
    }

    if (newMetrics.length === 0) {
      toast.error('At least 1 metric is required')
      return
    }

    setIsLoading(true)
    try {
      const experimentData = {
        ...newExperiment,
        variants: newVariants.map((v, index) => ({
          ...v,
          id: `variant_${index + 1}`,
          visitors: 0,
          conversions: 0,
          conversionRate: 0,
          confidence: 0
        })),
        metrics: newMetrics.map((m, index) => ({
          ...m,
          id: `metric_${index + 1}`
        })),
        status: 'draft',
        statisticalSignificance: 0
      }

      const response = await fetch('/api/tools/ab-test-manager', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(experimentData)
      })

      if (response.ok) {
        toast.success('Experiment created successfully')
        setIsCreateDialogOpen(false)
        resetForm()
        loadExperiments()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create experiment')
      }
    } catch (error) {
      console.error('Error creating experiment:', error)
      toast.error('Failed to create experiment')
    } finally {
      setIsLoading(false)
    }
  }

  const startExperiment = async (experimentId: string) => {
    try {
      const response = await fetch(`/api/tools/ab-test-manager/${experimentId}/start`, {
        method: 'POST'
      })

      if (response.ok) {
        toast.success('Experiment started successfully')
        loadExperiments()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to start experiment')
      }
    } catch (error) {
      console.error('Error starting experiment:', error)
      toast.error('Failed to start experiment')
    }
  }

  const stopExperiment = async (experimentId: string) => {
    try {
      const response = await fetch(`/api/tools/ab-test-manager/${experimentId}/stop`, {
        method: 'POST'
      })

      if (response.ok) {
        toast.success('Experiment stopped successfully')
        loadExperiments()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to stop experiment')
      }
    } catch (error) {
      console.error('Error stopping experiment:', error)
      toast.error('Failed to stop experiment')
    }
  }

  const deleteExperiment = async (experimentId: string) => {
    if (!confirm('Are you sure you want to delete this experiment?')) return

    try {
      const response = await fetch(`/api/tools/ab-test-manager/${experimentId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Experiment deleted successfully')
        loadExperiments()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete experiment')
      }
    } catch (error) {
      console.error('Error deleting experiment:', error)
      toast.error('Failed to delete experiment')
    }
  }

  const resetForm = () => {
    setNewExperiment({
      name: '',
      description: '',
      targetAudience: '',
      duration: 14,
      trafficAllocation: 100,
      confidenceLevel: 95
    })
    setNewVariants([
      { name: 'Control', description: 'Original version', trafficPercentage: 50, isControl: true },
      { name: 'Variant A', description: 'Test version', trafficPercentage: 50, isControl: false }
    ])
    setNewMetrics([
      { name: 'Conversion Rate', type: 'conversion' as const, goal: 'maximize' as const, baseline: 0, target: 0 }
    ])
  }

  const addVariant = () => {
    const newVariant = {
      name: `Variant ${String.fromCharCode(65 + newVariants.length - 1)}`,
      description: '',
      trafficPercentage: 0,
      isControl: false
    }
    setNewVariants([...newVariants, newVariant])
  }

  const removeVariant = (index: number) => {
    if (newVariants.length <= 2) {
      toast.error('At least 2 variants are required')
      return
    }
    setNewVariants(newVariants.filter((_, i) => i !== index))
  }

  const addMetric = () => {
    const newMetric = {
      name: 'New Metric',
      type: 'conversion' as const,
      goal: 'maximize' as const,
      baseline: 0,
      target: 0
    }
    setNewMetrics([...newMetrics, newMetric])
  }

  const removeMetric = (index: number) => {
    setNewMetrics(newMetrics.filter((_, i) => i !== index))
  }

  const filteredExperiments = experiments.filter(exp => {
    const matchesSearch = exp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || exp.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500'
      case 'paused': return 'bg-yellow-500'
      case 'completed': return 'bg-blue-500'
      case 'stopped': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className="h-4 w-4" />
      case 'paused': return <Pause className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'stopped': return <Square className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">A/B Test Manager</h1>
          <p className="text-muted-foreground mt-2">
            Create, manage, and analyze A/B tests with statistical significance testing
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Experiment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Experiment</DialogTitle>
              <DialogDescription>
                Set up a new A/B test with variants, metrics, and targeting
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exp-name">Experiment Name</Label>
                  <Input
                    id="exp-name"
                    value={newExperiment.name}
                    onChange={(e) => setNewExperiment({...newExperiment, name: e.target.value})}
                    placeholder="e.g., Homepage CTA Button Test"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exp-audience">Target Audience</Label>
                  <Input
                    id="exp-audience"
                    value={newExperiment.targetAudience}
                    onChange={(e) => setNewExperiment({...newExperiment, targetAudience: e.target.value})}
                    placeholder="e.g., All users, Premium users"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exp-description">Description</Label>
                <Textarea
                  id="exp-description"
                  value={newExperiment.description}
                  onChange={(e) => setNewExperiment({...newExperiment, description: e.target.value})}
                  placeholder="Describe the hypothesis and goals of this experiment"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exp-duration">Duration (days)</Label>
                  <Input
                    id="exp-duration"
                    type="number"
                    value={newExperiment.duration}
                    onChange={(e) => setNewExperiment({...newExperiment, duration: parseInt(e.target.value)})}
                    min={1}
                    max={365}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exp-traffic">Traffic Allocation (%)</Label>
                  <Input
                    id="exp-traffic"
                    type="number"
                    value={newExperiment.trafficAllocation}
                    onChange={(e) => setNewExperiment({...newExperiment, trafficAllocation: parseInt(e.target.value)})}
                    min={1}
                    max={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exp-confidence">Confidence Level (%)</Label>
                  <Input
                    id="exp-confidence"
                    type="number"
                    value={newExperiment.confidenceLevel}
                    onChange={(e) => setNewExperiment({...newExperiment, confidenceLevel: parseInt(e.target.value)})}
                    min={80}
                    max={99}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Variants</Label>
                  <Button variant="outline" size="sm" onClick={addVariant}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Variant
                  </Button>
                </div>
                {newVariants.map((variant, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>Variant Name</Label>
                          <Input
                            value={variant.name}
                            onChange={(e) => {
                              const updated = [...newVariants]
                              updated[index].name = e.target.value
                              setNewVariants(updated)
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Input
                            value={variant.description}
                            onChange={(e) => {
                              const updated = [...newVariants]
                              updated[index].description = e.target.value
                              setNewVariants(updated)
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Traffic %</Label>
                          <Input
                            type="number"
                            value={variant.trafficPercentage}
                            onChange={(e) => {
                              const updated = [...newVariants]
                              updated[index].trafficPercentage = parseInt(e.target.value)
                              setNewVariants(updated)
                            }}
                            min={0}
                            max={100}
                          />
                        </div>
                        <div className="flex items-center space-x-2 pt-8">
                          <input
                            type="radio"
                            name="control"
                            checked={variant.isControl}
                            onChange={() => {
                              const updated = newVariants.map((v, i) => ({
                                ...v,
                                isControl: i === index
                              }))
                              setNewVariants(updated)
                            }}
                          />
                          <Label>Control</Label>
                          {newVariants.length > 2 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeVariant(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Metrics</Label>
                  <Button variant="outline" size="sm" onClick={addMetric}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Metric
                  </Button>
                </div>
                {newMetrics.map((metric, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-5 gap-4">
                        <div className="space-y-2">
                          <Label>Metric Name</Label>
                          <Input
                            value={metric.name}
                            onChange={(e) => {
                              const updated = [...newMetrics]
                              updated[index].name = e.target.value
                              setNewMetrics(updated)
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select
                            value={metric.type}
                            onValueChange={(value) => {
                              const updated = [...newMetrics]
                              updated[index].type = value as 'conversion' | 'engagement' | 'revenue'
                              setNewMetrics(updated)
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="conversion">Conversion</SelectItem>
                              <SelectItem value="engagement">Engagement</SelectItem>
                              <SelectItem value="revenue">Revenue</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Goal</Label>
                          <Select
                            value={metric.goal}
                            onValueChange={(value) => {
                              const updated = [...newMetrics]
                              updated[index].goal = value as 'maximize' | 'minimize'
                              setNewMetrics(updated)
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="maximize">Maximize</SelectItem>
                              <SelectItem value="minimize">Minimize</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Baseline</Label>
                          <Input
                            type="number"
                            value={metric.baseline}
                            onChange={(e) => {
                              const updated = [...newMetrics]
                              updated[index].baseline = parseFloat(e.target.value)
                              setNewMetrics(updated)
                            }}
                            step="0.01"
                          />
                        </div>
                        <div className="flex items-center pt-8">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeMetric(index)}
                            disabled={newMetrics.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createExperiment} disabled={isLoading}>
                  {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                  Create Experiment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="experiments">Experiments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Experiments</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{experiments.length}</div>
                <p className="text-xs text-muted-foreground">
                  {experiments.filter(e => e.status === 'running').length} running
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Tests</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {experiments.filter(e => e.status === 'running').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {experiments.filter(e => e.status === 'completed').length} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Improvement</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12.5%</div>
                <p className="text-xs text-muted-foreground">
                  Across all metrics
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Statistical Power</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground">
                  Average confidence
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Experiments</CardTitle>
              <CardDescription>Your latest A/B test results and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {experiments.slice(0, 5).map((experiment) => (
                  <div key={experiment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(experiment.status)}`} />
                      <div>
                        <h4 className="font-semibold">{experiment.name}</h4>
                        <p className="text-sm text-muted-foreground">{experiment.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={experiment.status === 'running' ? 'default' : 'secondary'}>
                        {experiment.status}
                      </Badge>
                      {experiment.winner && (
                        <Badge variant="outline" className="text-green-600">
                          Winner: {experiment.winner}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {experiments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No experiments yet. Create your first A/B test to get started!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experiments" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search experiments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="stopped">Stopped</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={loadExperiments}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="grid gap-4">
            {filteredExperiments.map((experiment) => (
              <Card key={experiment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(experiment.status)}`} />
                      <div>
                        <CardTitle className="text-lg">{experiment.name}</CardTitle>
                        <CardDescription>{experiment.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={experiment.status === 'running' ? 'default' : 'secondary'}>
                        {getStatusIcon(experiment.status)}
                        <span className="ml-1">{experiment.status}</span>
                      </Badge>
                      {experiment.winner && (
                        <Badge variant="outline" className="text-green-600">
                          Winner: {experiment.winner}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Variants</p>
                      <p className="font-semibold">{experiment.variants.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Visitors</p>
                      <p className="font-semibold">
                        {experiment.variants.reduce((sum, v) => sum + v.visitors, 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-semibold">{experiment.duration} days</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Confidence</p>
                      <p className="font-semibold">{experiment.confidenceLevel}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {experiment.status === 'draft' && (
                        <Button size="sm" onClick={() => startExperiment(experiment.id)}>
                          <Play className="h-4 w-4 mr-2" />
                          Start
                        </Button>
                      )}
                      {experiment.status === 'running' && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => startExperiment(experiment.id)}>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => stopExperiment(experiment.id)}>
                            <Square className="h-4 w-4 mr-2" />
                            Stop
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline" onClick={() => setSelectedExperiment(experiment)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => deleteExperiment(experiment.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Experiment Analytics</CardTitle>
              <CardDescription>Detailed analysis of your A/B test performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select an experiment to view detailed analytics</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Experiment Settings</CardTitle>
              <CardDescription>Configure default settings for your A/B tests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Default Confidence Level</Label>
                  <Select defaultValue="95">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="90">90%</SelectItem>
                      <SelectItem value="95">95%</SelectItem>
                      <SelectItem value="99">99%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default Test Duration</Label>
                  <Select defaultValue="14">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedExperiment && (
        <Dialog open={!!selectedExperiment} onOpenChange={() => setSelectedExperiment(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle>{selectedExperiment.name}</DialogTitle>
                  <DialogDescription>{selectedExperiment.description}</DialogDescription>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${liveMode[selectedExperiment.id] ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                    <span className="text-sm text-muted-foreground">
                      {liveMode[selectedExperiment.id] ? 'Live' : 'Static'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`live-mode-${selectedExperiment.id}`} className="text-sm">
                      Live Mode
                    </Label>
                    <Switch
                      id={`live-mode-${selectedExperiment.id}`}
                      checked={liveMode[selectedExperiment.id] || false}
                      onCheckedChange={(checked) => toggleLiveMode(selectedExperiment.id, checked)}
                    />
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Visitors</p>
                        <p className="font-semibold">
                          {(liveMode[selectedExperiment.id] && liveData[selectedExperiment.id]
                            ? liveData[selectedExperiment.id].variants.reduce((sum: number, v: any) => sum + v.visitors, 0)
                            : selectedExperiment.variants.reduce((sum, v) => sum + v.visitors, 0)
                          ).toLocaleString()}
                          {liveMode[selectedExperiment.id] && (
                            <span className="text-xs text-green-600 ml-1">●</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Conversion Rate</p>
                        <p className="font-semibold">
                          {(() => {
                            const variants = liveMode[selectedExperiment.id] && liveData[selectedExperiment.id]
                              ? liveData[selectedExperiment.id].variants
                              : selectedExperiment.variants;
                            return variants.length > 0
                              ? (variants.reduce((sum: number, v: any) => sum + v.conversionRate, 0) / variants.length).toFixed(2)
                              : '0.00';
                          })()}%
                          {liveMode[selectedExperiment.id] && (
                            <span className="text-xs text-green-600 ml-1">●</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Best Performer</p>
                        <p className="font-semibold">
                          {(() => {
                            const variants = liveMode[selectedExperiment.id] && liveData[selectedExperiment.id]
                              ? liveData[selectedExperiment.id].variants
                              : selectedExperiment.variants;
                            return variants.reduce((best: any, current: any) =>
                              current.conversionRate > best.conversionRate ? current : best,
                              variants[0]
                            )?.name || 'N/A';
                          })()}
                          {liveMode[selectedExperiment.id] && (
                            <span className="text-xs text-green-600 ml-1">●</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Confidence</p>
                        <p className="font-semibold">
                          {(liveMode[selectedExperiment.id] && liveData[selectedExperiment.id]
                            ? liveData[selectedExperiment.id].confidenceLevel
                            : selectedExperiment.confidenceLevel
                          )}%
                          {liveMode[selectedExperiment.id] && (
                            <span className="text-xs text-green-600 ml-1">●</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Variant Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Variant</TableHead>
                        <TableHead>Visitors</TableHead>
                        <TableHead>Conversions</TableHead>
                        <TableHead>Conversion Rate</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(() => {
                        const variants = liveMode[selectedExperiment.id] && liveData[selectedExperiment.id]
                          ? liveData[selectedExperiment.id].variants
                          : selectedExperiment.variants;
                        return variants.map((variant: any) => (
                          <TableRow key={variant.id}>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {variant.isControl && <Badge variant="outline">Control</Badge>}
                                <span className="font-medium">{variant.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {variant.visitors.toLocaleString()}
                              {liveMode[selectedExperiment.id] && (
                                <span className="text-xs text-green-600 ml-1">●</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {variant.conversions.toLocaleString()}
                              {liveMode[selectedExperiment.id] && (
                                <span className="text-xs text-green-600 ml-1">●</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {variant.conversionRate.toFixed(2)}%
                              {liveMode[selectedExperiment.id] && (
                                <span className="text-xs text-green-600 ml-1">●</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Progress value={variant.confidence} className="w-16" />
                                <span className="text-sm">{variant.confidence.toFixed(1)}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {(liveMode[selectedExperiment.id] && liveData[selectedExperiment.id]
                                ? liveData[selectedExperiment.id].winner === variant.name
                                : selectedExperiment.winner === variant.name
                              ) && (
                                <Badge className="bg-green-500">Winner</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ));
                      })()}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Experiment Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-gray-400 rounded-full" />
                      <div>
                        <p className="font-medium">Created</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedExperiment.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {selectedExperiment.startDate && (
                      <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <div>
                          <p className="font-medium">Started</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedExperiment.startDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedExperiment.endDate && (
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          selectedExperiment.status === 'completed' ? 'bg-blue-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <p className="font-medium">
                            {selectedExperiment.status === 'completed' ? 'Completed' : 'Stopped'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {selectedExperiment.endDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
