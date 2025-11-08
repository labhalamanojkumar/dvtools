'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Upload,
  Play,
  BarChart3,
  TrendingUp,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Database,
  Brain,
  Target,
  ScatterChart,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react'
import { toast } from 'sonner'

interface Dataset {
  id: string
  name: string
  size: number
  columns: string[]
  rows: number
  data: any[][]
  preview: any[][]
  createdAt: Date
}

interface Model {
  id: string
  name: string
  type: 'classification' | 'regression' | 'clustering'
  algorithm: string
  status: 'training' | 'completed' | 'failed'
  accuracy?: number
  parameters: Record<string, any>
  trainingTime?: number
  createdAt: Date
}

interface Prediction {
  id: string
  modelId: string
  input: Record<string, any>
  output: any
  confidence?: number
  createdAt: Date
}

const SimpleMLPlaygroundClient: React.FC = () => {
  const [activeTab, setActiveTab] = useState('data')
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null)
  const [models, setModels] = useState<Model[]>([])
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isPreprocessing, setIsPreprocessing] = useState(false)
  const [preprocessingOperations, setPreprocessingOperations] = useState<any[]>([])
  const [evaluationResults, setEvaluationResults] = useState<any>(null)
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [remoteUrl, setRemoteUrl] = useState('')

  // Sample datasets for demo
  const sampleDatasets = [
    {
      name: 'Iris Flower Dataset',
      description: 'Classic dataset for classification with 150 samples of iris flowers',
      features: ['sepal_length', 'sepal_width', 'petal_length', 'petal_width', 'species'],
      size: 150,
      type: 'classification'
    },
    {
      name: 'Boston Housing',
      description: 'Regression dataset for predicting house prices',
      features: ['crim', 'zn', 'indus', 'chas', 'nox', 'rm', 'age', 'dis', 'rad', 'tax', 'ptratio', 'b', 'lstat', 'medv'],
      size: 506,
      type: 'regression'
    },
    {
      name: 'Wine Quality',
      description: 'Dataset for predicting wine quality based on chemical properties',
      features: ['fixed_acidity', 'volatile_acidity', 'citric_acid', 'residual_sugar', 'chlorides', 'free_sulfur_dioxide', 'total_sulfur_dioxide', 'density', 'pH', 'sulphates', 'alcohol', 'quality'],
      size: 1599,
      type: 'regression'
    }
  ]

  // Load datasets and models on component mount
  useEffect(() => {
    loadDatasets()
    loadModels()
  }, [])

  const loadDatasets = async () => {
    try {
      const response = await fetch('/api/tools/simple-ml-playground?type=datasets')
      if (response.ok) {
        const data = await response.json()
        // Transform API data to match component interface
        const transformedDatasets = data.datasets.map((d: any) => ({
          id: d.id,
          name: d.name,
          size: d.size,
          columns: d.columns,
          rows: d.rows,
          data: [], // We'll load this when needed
          preview: [], // We'll load this when needed
          createdAt: new Date(d.createdAt)
        }))
        setDatasets(transformedDatasets)
      }
    } catch (error) {
      console.error('Error loading datasets:', error)
      toast.error('Failed to load datasets')
    }
  }

  const loadModels = async () => {
    try {
      const response = await fetch('/api/tools/simple-ml-playground?type=models')
      if (response.ok) {
        const data = await response.json()
        // Transform API data to match component interface
        const transformedModels = data.models.map((m: any) => ({
          id: m.id,
          name: m.name,
          type: m.type,
          algorithm: m.algorithm,
          status: m.status,
          accuracy: m.accuracy,
          trainingTime: m.trainingTime,
          parameters: m.parameters || {},
          createdAt: new Date(m.createdAt)
        }))
        setModels(transformedModels)
      }
    } catch (error) {
      console.error('Error loading models:', error)
      toast.error('Failed to load models')
    }
  }

  const algorithms = {
    classification: [
      { name: 'Logistic Regression', value: 'logistic_regression' },
      { name: 'Decision Tree', value: 'decision_tree' },
      { name: 'Random Forest', value: 'random_forest' },
      { name: 'SVM', value: 'svm' },
      { name: 'K-Nearest Neighbors', value: 'knn' },
      { name: 'Naive Bayes', value: 'naive_bayes' }
    ],
    regression: [
      { name: 'Linear Regression', value: 'linear_regression' },
      { name: 'Decision Tree Regressor', value: 'decision_tree_regressor' },
      { name: 'Random Forest Regressor', value: 'random_forest_regressor' },
      { name: 'SVR', value: 'svr' },
      { name: 'Gradient Boosting', value: 'gradient_boosting' }
    ],
    clustering: [
      { name: 'K-Means', value: 'kmeans' },
      { name: 'Hierarchical Clustering', value: 'hierarchical' },
      { name: 'DBSCAN', value: 'dbscan' },
      { name: 'Gaussian Mixture', value: 'gaussian_mixture' }
    ]
  }

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Client-side enforce: max 100MB
    const MAX_UPLOAD_BYTES = 100 * 1024 * 1024 // 100 MB
    if (file.size && file.size > MAX_UPLOAD_BYTES) {
      toast.error('File too large for direct upload. For files larger than 100MB, use "Load from URL" and provide a cloud-hosted link (S3, Google Drive direct-download link, etc.).')
      return
    }

    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/tools/simple-ml-playground/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        const newDataset: Dataset = {
          id: data.dataset.id,
          name: data.dataset.name,
          size: data.dataset.size,
          columns: data.dataset.columns,
          rows: data.dataset.rows,
          data: [], // API doesn't return full data for performance
          preview: data.dataset.preview,
          createdAt: new Date(data.dataset.createdAt)
        }

        setDatasets(prev => [...prev, newDataset])
        setSelectedDataset(newDataset)
        toast.success(`Dataset "${newDataset.name}" uploaded successfully`)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to upload file')
      }
    } catch (error) {
      toast.error('Failed to upload file')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleLoadFromUrl = useCallback(async () => {
    if (!remoteUrl.trim()) {
      toast.error('Please enter a URL')
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch('/api/tools/simple-ml-playground/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: remoteUrl.trim() })
      })

      if (!response.ok) {
        const err = await response.json()
        toast.error(err.error || 'Failed to load dataset from URL')
        return
      }

      const data = await response.json()
      const ds = data.dataset
      const newDataset: Dataset = {
        id: ds.id,
        name: ds.name,
        size: ds.size,
        columns: ds.columns || [],
        rows: ds.rows || 0,
        data: [],
        preview: ds.preview || [],
        createdAt: new Date(ds.createdAt)
      }

      setDatasets(prev => [...prev, newDataset])
      setSelectedDataset(newDataset)
      toast.success(`Dataset "${newDataset.name}" loaded/registered successfully`)
      setRemoteUrl('')
    } catch (error) {
      console.error('Error loading remote dataset:', error)
      toast.error('Failed to load dataset from URL')
    } finally {
      setIsLoading(false)
    }
  }, [remoteUrl])

  const loadSampleDataset = useCallback(async (datasetName: string) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/tools/simple-ml-playground', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'load_sample',
          datasetName
        })
      })

      if (response.ok) {
        const data = await response.json()
        const newDataset: Dataset = {
          id: data.dataset.id,
          name: data.dataset.name,
          size: data.dataset.size,
          columns: data.dataset.columns,
          rows: data.dataset.rows,
          data: [], // API doesn't return full data for performance
          preview: data.dataset.preview,
          createdAt: new Date(data.dataset.createdAt)
        }

        setDatasets(prev => [...prev, newDataset])
        setSelectedDataset(newDataset)
        toast.success(`Sample dataset "${datasetName}" loaded successfully`)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to load sample dataset')
      }
    } catch (error) {
      toast.error('Failed to load sample dataset')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const trainModel = useCallback(async (algorithm: string, type: 'classification' | 'regression' | 'clustering') => {
    if (!selectedDataset) {
      toast.error('Please select a dataset first')
      return
    }

    setIsTraining(true)
    setTrainingProgress(0)

    try {
      const response = await fetch('/api/tools/simple-ml-playground/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          algorithm,
          datasetId: selectedDataset.id,
          modelName: `${algorithm.replace(/_/g, ' ')} Model`
        })
      })

      if (response.ok) {
        const data = await response.json()
        const newModel: Model = {
          id: data.model.id,
          name: data.model.name,
          type: data.model.type,
          algorithm: data.model.algorithm,
          status: data.model.status,
          parameters: data.model.parameters || {},
          createdAt: new Date(data.model.createdAt)
        }

        setModels(prev => [...prev, newModel])

        // Poll for training progress
        const pollInterval = setInterval(async () => {
          try {
            const statusResponse = await fetch(`/api/tools/simple-ml-playground/train?modelId=${newModel.id}`)
            if (statusResponse.ok) {
              const statusData = await statusResponse.json()
              const modelData = statusData.model

              setTrainingProgress(modelData.progress || 0)

              if (modelData.status === 'completed' || modelData.status === 'failed') {
                clearInterval(pollInterval)
                setIsTraining(false)
                setTrainingProgress(0)

                // Update model with final data
                const updatedModel: Model = {
                  id: modelData.id,
                  name: modelData.name,
                  type: modelData.type,
                  algorithm: modelData.algorithm,
                  status: modelData.status,
                  accuracy: modelData.accuracy,
                  trainingTime: modelData.trainingTime,
                  parameters: modelData.parameters || {},
                  createdAt: new Date(modelData.createdAt)
                }

                setModels(prev => prev.map(m => m.id === newModel.id ? updatedModel : m))
                setSelectedModel(updatedModel)

                if (modelData.status === 'completed') {
                  toast.success(`Model trained successfully with ${Math.round((modelData.accuracy || 0) * 100)}% accuracy`)
                  setActiveTab('evaluation')
                } else {
                  toast.error(modelData.error || 'Model training failed')
                }
              }
            }
          } catch (error) {
            console.error('Error polling training status:', error)
          }
        }, 1000)

      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to start model training')
        setIsTraining(false)
        setTrainingProgress(0)
      }
    } catch (error) {
      console.error('Error starting model training:', error)
      toast.error('Failed to start model training')
      setIsTraining(false)
      setTrainingProgress(0)
    }
  }, [selectedDataset])

    const makePrediction = useCallback(async (input: Record<string, any>) => {
    if (!selectedModel) {
      toast.error('Please select a trained model first')
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch('/api/tools/simple-ml-playground/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId: selectedModel.id,
          inputData: [Object.values(input)] // Convert to array format expected by API
        })
      })

      if (response.ok) {
        const data = await response.json()
        const prediction = data.predictions[0]

        const newPrediction: Prediction = {
          id: Date.now().toString(),
          modelId: selectedModel.id,
          input,
          output: prediction.prediction,
          confidence: prediction.confidence,
          createdAt: new Date()
        }

        setPredictions(prev => [newPrediction, ...prev])
        toast.success('Prediction completed successfully')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Prediction failed')
      }
    } catch (error) {
      toast.error('Prediction failed')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedModel])

  const applyPreprocessing = useCallback(async (operations: any[]) => {
    if (!selectedDataset) {
      toast.error('Please select a dataset first')
      return
    }

    try {
      setIsPreprocessing(true)
      const response = await fetch('/api/tools/simple-ml-playground/preprocess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datasetId: selectedDataset.id,
          operations
        })
      })

      if (response.ok) {
        const data = await response.json()
        // Update the selected dataset with processed data
        const updatedDataset: Dataset = {
          ...selectedDataset,
          rows: data.dataset.rows,
          preview: data.dataset.preview
        }
        setSelectedDataset(updatedDataset)
        // Update in datasets list
        setDatasets(prev => prev.map(d => d.id === selectedDataset.id ? updatedDataset : d))
        setPreprocessingOperations(operations)
        toast.success('Preprocessing completed successfully')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Preprocessing failed')
      }
    } catch (error) {
      toast.error('Preprocessing failed')
      console.error(error)
    } finally {
      setIsPreprocessing(false)
    }
  }, [selectedDataset])

  const evaluateModel = useCallback(async () => {
    if (!selectedModel || !selectedDataset) {
      toast.error('Please select a model and dataset first')
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch('/api/tools/simple-ml-playground/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId: selectedModel.id,
          datasetId: selectedDataset.id,
          task: selectedModel.type
        })
      })

      if (response.ok) {
        const data = await response.json()
        setEvaluationResults(data.evaluation)
        toast.success('Model evaluation completed successfully')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Evaluation failed')
      }
    } catch (error) {
      toast.error('Evaluation failed')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedModel, selectedDataset])

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Data
          </TabsTrigger>
          <TabsTrigger value="preprocessing" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Preprocessing
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Training
          </TabsTrigger>
          <TabsTrigger value="evaluation" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Evaluation
          </TabsTrigger>
          <TabsTrigger value="prediction" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Prediction
          </TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Data Upload & Management
              </CardTitle>
              <CardDescription>
                Upload your CSV dataset or choose from sample datasets to get started with machine learning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label htmlFor="file-upload">Upload CSV File</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-gray-500">
                    Upload a CSV file with headers in the first row (max 100MB). For larger files, use the "Load from URL" option below.
                  </p>

                  <div className="mt-3 space-y-2">
                    <Label htmlFor="remote-url">Load from URL (S3 / Google Drive direct link)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="remote-url"
                        placeholder="https://storage.example.com/your-dataset.csv"
                        value={remoteUrl}
                        onChange={(e) => setRemoteUrl(e.target.value)}
                      />
                      <Button onClick={handleLoadFromUrl} disabled={isLoading}>
                        <Download className="w-4 h-4 mr-2" />
                        Load
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">For Google Drive, use a direct-download link (drive file id with &export=download or an S3 pre-signed URL).</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Sample Datasets</Label>
                  <div className="space-y-2">
                    {sampleDatasets.map((dataset) => (
                      <Button
                        key={dataset.name}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => loadSampleDataset(dataset.name)}
                      >
                        <Database className="w-4 h-4 mr-2" />
                        <div className="text-left">
                          <div className="font-medium">{dataset.name}</div>
                          <div className="text-xs text-gray-500">
                            {dataset.size} samples • {dataset.type}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {datasets.length > 0 && (
                <div className="space-y-4">
                  <Separator />
                  <div>
                    <Label>Your Datasets</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                      {datasets.map((dataset) => (
                        <Card 
                          key={dataset.id}
                          className={`cursor-pointer transition-colors ${
                            selectedDataset?.id === dataset.id 
                              ? 'ring-2 ring-blue-500' 
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                          onClick={() => setSelectedDataset(dataset)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{dataset.name}</h4>
                              <Badge variant="secondary">{dataset.rows} rows</Badge>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">
                              {dataset.columns.length} columns
                            </p>
                            <div className="text-xs text-gray-400">
                              {dataset.size} KB
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedDataset && (
                <div className="space-y-4">
                  <Separator />
                  <div>
                    <Label>Dataset Preview</Label>
                    <ScrollArea className="h-64 w-full border rounded-md">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            {selectedDataset.columns.map((col, idx) => (
                              <th key={idx} className="text-left p-2 font-medium">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {selectedDataset.preview.map((row, idx) => (
                            <tr key={idx} className="border-b">
                              {row.map((cell, cellIdx) => (
                                <td key={cellIdx} className="p-2 text-sm">
                                  {typeof cell === 'number' ? cell.toFixed(2) : cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </ScrollArea>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preprocessing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Data Preprocessing
              </CardTitle>
              <CardDescription>
                Clean and prepare your data for machine learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDataset ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Dataset Statistics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span>Total Rows:</span>
                          <Badge>{selectedDataset.rows}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Columns:</span>
                          <Badge>{selectedDataset.columns.length}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Numeric Columns:</span>
                          <Badge>
                            {selectedDataset.columns.filter(col => 
                              selectedDataset.preview.some((row: any[]) => typeof row[selectedDataset.columns.indexOf(col)] === 'number')
                            ).length}
                          </Badge>
                        </div>
                        {preprocessingOperations.length > 0 && (
                          <div className="pt-4 border-t">
                            <Label className="text-sm font-medium">Applied Operations:</Label>
                            <div className="mt-2 space-y-1">
                              {preprocessingOperations.map((op, idx) => (
                                <Badge key={idx} variant="outline" className="mr-2">
                                  {op.type} ({op.method || 'default'})
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Preprocessing Options</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => applyPreprocessing([{ type: 'missing_values', method: 'drop' }])}
                          disabled={isPreprocessing}
                        >
                          Handle Missing Values (Drop)
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => applyPreprocessing([{ type: 'missing_values', method: 'mean' }])}
                          disabled={isPreprocessing}
                        >
                          Handle Missing Values (Mean)
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => applyPreprocessing([{ type: 'normalize', method: 'standard' }])}
                          disabled={isPreprocessing}
                        >
                          Standardize Features
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => applyPreprocessing([{ type: 'normalize', method: 'minmax' }])}
                          disabled={isPreprocessing}
                        >
                          Normalize Features (Min-Max)
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => applyPreprocessing([{ type: 'encode_categorical', method: 'label' }])}
                          disabled={isPreprocessing}
                        >
                          Encode Categorical Variables
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => applyPreprocessing([
                            { type: 'missing_values', method: 'drop' },
                            { type: 'normalize', method: 'standard' },
                            { type: 'encode_categorical', method: 'label' }
                          ])}
                          disabled={isPreprocessing}
                        >
                          Apply All Preprocessing
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {isPreprocessing && (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-center space-x-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Applying preprocessing...</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Please upload or select a dataset first to access preprocessing tools.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Model Training
              </CardTitle>
              <CardDescription>
                Train machine learning models on your prepared data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDataset ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(algorithms).map(([type, algos]) => (
                      <Card key={type}>
                        <CardHeader>
                          <CardTitle className="text-lg capitalize">{type}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {algos.map((algo) => (
                            <Button
                              key={algo.value}
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => trainModel(algo.value, type as any)}
                              disabled={isTraining}
                            >
                              {algo.name}
                            </Button>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {isTraining && (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Training Progress</span>
                            <span>{trainingProgress}%</span>
                          </div>
                          <Progress value={trainingProgress} className="w-full" />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {models.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Trained Models</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {models.map((model) => (
                            <div 
                              key={model.id}
                              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                selectedModel?.id === model.id 
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                              }`}
                              onClick={() => setSelectedModel(model)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">{model.name}</h4>
                                <Badge variant={
                                  model.status === 'completed' ? 'default' :
                                  model.status === 'failed' ? 'destructive' : 'secondary'
                                }>
                                  {model.status}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-500 space-y-1">
                                <div>Algorithm: {model.algorithm}</div>
                                <div>Type: {model.type}</div>
                                {model.accuracy && (
                                  <div>Accuracy: {Math.round(model.accuracy * 100)}%</div>
                                )}
                                {model.trainingTime && (
                                  <div>Training Time: {model.trainingTime.toFixed(1)}s</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Please upload or select a dataset first to train models.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Model Evaluation
              </CardTitle>
              <CardDescription>
                Evaluate and analyze your trained models
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedModel ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {selectedModel.accuracy ? Math.round(selectedModel.accuracy * 100) : 0}%
                            </div>
                            <p className="text-sm text-gray-500">Accuracy</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {selectedModel.trainingTime ? selectedModel.trainingTime.toFixed(1) : 0}s
                            </div>
                            <p className="text-sm text-gray-500">Training Time</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {selectedModel.algorithm.replace(/_/g, ' ')}
                            </div>
                            <p className="text-sm text-gray-500">Algorithm</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                              {selectedModel.type}
                            </div>
                            <p className="text-sm text-gray-500">Type</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <Button 
                      onClick={evaluateModel}
                      disabled={isLoading || !selectedDataset}
                      className="ml-4"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <BarChart3 className="w-4 h-4 mr-2" />
                      )}
                      Run Evaluation
                    </Button>
                  </div>

                  {evaluationResults && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Model Performance Metrics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {selectedModel.type === 'classification' ? (
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Accuracy:</span>
                                <span>{Math.round((evaluationResults.metrics.accuracy || 0) * 100)}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Precision:</span>
                                <span>{Math.round((evaluationResults.metrics.precision || 0) * 100)}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Recall:</span>
                                <span>{Math.round((evaluationResults.metrics.recall || 0) * 100)}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>F1-Score:</span>
                                <span>{Math.round((evaluationResults.metrics.f1Score || 0) * 100)}%</span>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>MSE:</span>
                                <span>{(evaluationResults.metrics.mse || 0).toFixed(4)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>RMSE:</span>
                                <span>{(evaluationResults.metrics.rmse || 0).toFixed(4)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>MAE:</span>
                                <span>{(evaluationResults.metrics.mae || 0).toFixed(4)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>R²:</span>
                                <span>{(evaluationResults.metrics.r2 || 0).toFixed(4)}</span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Feature Importance</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {evaluationResults.featureImportance.slice(0, 10).map((feature: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between">
                                <span className="text-sm">{feature.feature}</span>
                                <div className="flex items-center space-x-2">
                                  <div className="w-24 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full" 
                                      style={{ width: `${feature.importance * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-gray-500 w-12">
                                    {Math.round(feature.importance * 100)}%
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {selectedModel.type === 'classification' && evaluationResults.visualizations && (
                        <Card className="md:col-span-2">
                          <CardHeader>
                            <CardTitle>Confusion Matrix</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                  {evaluationResults.visualizations.confusionMatrix.data[0][0]}
                                </div>
                                <p className="text-sm text-gray-500">True Negative</p>
                              </div>
                              <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                                <div className="text-2xl font-bold text-red-600">
                                  {evaluationResults.visualizations.confusionMatrix.data[0][1]}
                                </div>
                                <p className="text-sm text-gray-500">False Positive</p>
                              </div>
                              <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                                <div className="text-2xl font-bold text-red-600">
                                  {evaluationResults.visualizations.confusionMatrix.data[1][0]}
                                </div>
                                <p className="text-sm text-gray-500">False Negative</p>
                              </div>
                              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                  {evaluationResults.visualizations.confusionMatrix.data[1][1]}
                                </div>
                                <p className="text-sm text-gray-500">True Positive</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}

                  {!evaluationResults && (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center text-gray-500">
                          <BarChart3 className="w-12 h-12 mx-auto mb-4" />
                          <p>Click "Run Evaluation" to analyze your model's performance</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Please train a model first to view evaluation metrics.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prediction" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Make Predictions
              </CardTitle>
              <CardDescription>
                Use your trained model to make predictions on new data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedModel ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Prediction Input</CardTitle>
                      <CardDescription>
                        Enter values for each feature to get a prediction
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        {selectedDataset?.columns.slice(0, -1).map((column) => (
                          <div key={column} className="space-y-2">
                            <Label htmlFor={column}>{column}</Label>
                            <Input
                              id={column}
                              type="number"
                              placeholder={`Enter ${column}`}
                            />
                          </div>
                        ))}
                      </div>
                      <Button 
                        onClick={() => {
                          const inputs: Record<string, any> = {}
                          selectedDataset?.columns.slice(0, -1).forEach(column => {
                            const element = document.getElementById(column) as HTMLInputElement
                            inputs[column] = parseFloat(element?.value || '0')
                          })
                          makePrediction(inputs)
                        }}
                        className="w-full"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Make Prediction
                      </Button>
                    </CardContent>
                  </Card>

                  {predictions.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Predictions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {predictions.slice(0, 5).map((prediction) => (
                            <div key={prediction.id} className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Prediction Result:</span>
                                <Badge variant="secondary">
                                  {typeof prediction.output === 'number' 
                                    ? prediction.output.toFixed(2) 
                                    : prediction.output}
                                </Badge>
                              </div>
                              {prediction.confidence && (
                                <div className="text-sm text-gray-500 mb-2">
                                  Confidence: {Math.round(prediction.confidence * 100)}%
                                </div>
                              )}
                              <div className="text-xs text-gray-400">
                                {prediction.createdAt.toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Please train and select a model first to make predictions.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SimpleMLPlaygroundClient
