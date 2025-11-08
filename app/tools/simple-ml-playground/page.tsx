import { Metadata } from 'next'
import SimpleMLPlaygroundClient from '@/components/tools/SimpleMLPlaygroundClient'
import { SHARED_METADATA } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Simple ML Playground - Interactive Machine Learning Tool | MultiTool Platform',
  description: 'Experiment with machine learning algorithms in our interactive playground. Train models, visualize data, and explore AI concepts with our user-friendly ML tool. Perfect for beginners and data scientists.',
  keywords: [
    'machine learning playground',
    'interactive ML tool',
    'data visualization',
    'model training',
    'AI experiments',
    'supervised learning',
    'unsupervised learning',
    'regression analysis',
    'classification models',
    'neural networks',
    'data science tool',
    'ML algorithms',
    'predictive modeling',
    'feature engineering',
    'model evaluation',
    'machine learning tutorial',
    'AI playground',
    'data science platform',
    'ML model builder',
    'predictive analytics',
    'data mining',
    'statistical modeling',
    'deep learning',
    'computer vision',
    'natural language processing',
    'reinforcement learning',
    'model deployment',
    'AI education',
    'machine learning for beginners'
  ],
  ...SHARED_METADATA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://multitoolplatform.com'),
  alternates: {
    canonical: '/tools/simple-ml-playground',
  },
  openGraph: {
    title: 'Simple ML Playground - Interactive Machine Learning Tool | MultiTool Platform',
    description: 'Experiment with machine learning algorithms in our interactive playground. Train models, visualize data, and explore AI concepts with our user-friendly ML tool.',
    url: '/tools/simple-ml-playground',
    siteName: 'Multi Tool Platform',
    images: [
      {
        url: '/og-simple-ml-playground.jpg',
        width: 1200,
        height: 630,
        alt: 'Simple ML Playground - Interactive Machine Learning Tool',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Simple ML Playground - Interactive Machine Learning Tool',
    description: 'Experiment with machine learning algorithms in our interactive playground. Train models, visualize data, and explore AI concepts.',
    images: ['/og-simple-ml-playground.jpg'],
    creator: '@multitoolplatform',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'machine learning tools',
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Simple ML Playground - Interactive Machine Learning Tool",
  "description": "Experiment with machine learning algorithms in our interactive playground. Train models, visualize data, and explore AI concepts with our user-friendly ML tool.",
  "url": "https://multitoolplatform.com/tools/simple-ml-playground",
  "applicationCategory": "MachineLearningTool",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Interactive model training and testing",
    "Data visualization and exploration",
    "Multiple ML algorithms support",
    "Real-time model evaluation",
    "Feature engineering tools",
    "Hyperparameter tuning",
    "Model comparison and selection",
    "Export trained models",
    "Beginner-friendly interface",
    "Educational tutorials and guides",
    "Dataset upload and preprocessing",
    "Performance metrics and analysis"
  ],
  "screenshot": "/og-simple-ml-playground.jpg",
  "author": {
    "@type": "Organization",
    "name": "Multi Tool Platform"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Multi Tool Platform"
  },
  "datePublished": new Date().toISOString().split('T')[0],
  "dateModified": new Date().toISOString().split('T')[0]
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://multitoolplatform.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Tools",
      "item": "https://multitoolplatform.com/tools"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Simple ML Playground",
      "item": "https://multitoolplatform.com/tools/simple-ml-playground"
    }
  ]
};

export default function SimpleMLPlaygroundPage() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Simple ML Playground
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Interactive machine learning environment for experimenting with algorithms, training models,
            and exploring AI concepts. Perfect for beginners learning data science and experienced
            practitioners prototyping ML solutions with intuitive visualizations and real-time feedback.
          </p>

          {/* Key Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">🧠</div>
              <h3 className="font-semibold mb-1">Interactive Training</h3>
              <p className="text-sm text-muted-foreground">
                Train ML models with real-time feedback and visualization
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold mb-1">Data Visualization</h3>
              <p className="text-sm text-muted-foreground">
                Explore datasets with interactive charts and graphs
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold mb-1">Algorithm Library</h3>
              <p className="text-sm text-muted-foreground">
                Access popular ML algorithms for various use cases
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl mb-2">📈</div>
              <h3 className="font-semibold mb-1">Model Evaluation</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive metrics and performance analysis
              </p>
            </div>
          </div>
        </div>

        {/* Tool Component */}
        <SimpleMLPlaygroundClient />

        {/* Documentation Section */}
        <div className="mt-16 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">How to Use</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow these steps to start experimenting with machine learning in our interactive playground
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Getting Started */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">1. Upload Your Data</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Upload CSV files or use built-in sample datasets</p>
                  <p>• Automatic data type detection and preprocessing</p>
                  <p>• Handle missing values and data cleaning</p>
                  <p>• Preview data structure and statistics</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">2. Explore & Visualize</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Interactive data visualization and exploration</p>
                  <p>• Generate statistical summaries and insights</p>
                  <p>• Identify patterns and correlations in data</p>
                  <p>• Create custom charts and plots</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">3. Select Algorithm</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Choose from classification, regression, clustering</p>
                  <p>• Select appropriate algorithm for your data type</p>
                  <p>• Configure algorithm-specific parameters</p>
                  <p>• Compare different algorithms side-by-side</p>
                </div>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">4. Train & Evaluate</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Train models with one-click execution</p>
                  <p>• Real-time training progress and metrics</p>
                  <p>• Evaluate model performance with multiple metrics</p>
                  <p>• Cross-validation and overfitting detection</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">5. Tune & Optimize</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Hyperparameter tuning with grid/random search</p>
                  <p>• Feature selection and engineering</p>
                  <p>• Model comparison and ensemble methods</p>
                  <p>• Automated model optimization</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">6. Deploy & Share</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Export trained models for deployment</p>
                  <p>• Generate predictions on new data</p>
                  <p>• Share experiments and results</p>
                  <p>• Create reproducible ML pipelines</p>
                </div>
              </div>
            </div>
          </div>

          {/* Supported Algorithms */}
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Supported Machine Learning Algorithms</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">LR</span>
                </div>
                <div>
                  <div className="font-medium">Linear Regression</div>
                  <div className="text-sm text-muted-foreground">Predict continuous values</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">RF</span>
                </div>
                <div>
                  <div className="font-medium">Random Forest</div>
                  <div className="text-sm text-muted-foreground">Ensemble classification/regression</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">SVM</span>
                </div>
                <div>
                  <div className="font-medium">SVM</div>
                  <div className="text-sm text-muted-foreground">Support Vector Machines</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400">KNN</span>
                </div>
                <div>
                  <div className="font-medium">K-Nearest Neighbors</div>
                  <div className="text-sm text-muted-foreground">Instance-based learning</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">NN</span>
                </div>
                <div>
                  <div className="font-medium">Neural Networks</div>
                  <div className="text-sm text-muted-foreground">Deep learning models</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-500/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">KMC</span>
                </div>
                <div>
                  <div className="font-medium">K-Means Clustering</div>
                  <div className="text-sm text-muted-foreground">Unsupervised clustering</div>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">How It Works</h3>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📤</span>
                </div>
                <h4 className="font-semibold mb-2">1. Data Preparation</h4>
                <p className="text-sm text-muted-foreground">
                  Upload and preprocess your data with automatic cleaning,
                  normalization, and feature engineering tools.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🧠</span>
                </div>
                <h4 className="font-semibold mb-2">2. Model Training</h4>
                <p className="text-sm text-muted-foreground">
                  Select algorithms, configure parameters, and train models
                  with real-time progress tracking and visualization.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h4 className="font-semibold mb-2">3. Analysis & Deployment</h4>
                <p className="text-sm text-muted-foreground">
                  Evaluate model performance, generate insights, and deploy
                  trained models for production use.
                </p>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Common Use Cases</h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Predictive Analytics</h4>
                <p className="text-sm text-muted-foreground">
                  Build models to predict customer behavior, sales trends,
                  and business outcomes using historical data.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Classification Tasks</h4>
                <p className="text-sm text-muted-foreground">
                  Categorize data into classes such as spam detection,
                  sentiment analysis, and image recognition.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Data Exploration</h4>
                <p className="text-sm text-muted-foreground">
                  Understand data patterns, identify outliers, and discover
                  hidden relationships through interactive visualization.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Educational Learning</h4>
                <p className="text-sm text-muted-foreground">
                  Learn machine learning concepts through hands-on experimentation
                  with real datasets and immediate feedback.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Prototype Development</h4>
                <p className="text-sm text-muted-foreground">
                  Quickly prototype ML solutions, test hypotheses, and validate
                  approaches before full-scale implementation.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">A/B Testing Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Analyze experiment results, measure statistical significance,
                  and optimize conversion rates using ML techniques.
                </p>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="text-blue-600 dark:text-blue-400 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Machine Learning Best Practices
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
                  <div>
                    <strong>Data Quality:</strong> Ensure clean, representative data before training models to achieve better results.
                  </div>
                  <div>
                    <strong>Feature Engineering:</strong> Create meaningful features that capture important patterns in your data.
                  </div>
                  <div>
                    <strong>Cross-Validation:</strong> Use proper validation techniques to assess model generalization performance.
                  </div>
                  <div>
                    <strong>Hyperparameter Tuning:</strong> Optimize model parameters systematically rather than guessing.
                  </div>
                  <div>
                    <strong>Model Interpretability:</strong> Understand why your model makes certain predictions, especially for critical applications.
                  </div>
                  <div>
                    <strong>Version Control:</strong> Track experiments, models, and data versions for reproducible results.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Do I need coding experience to use the ML playground?</h4>
                <p className="text-sm text-muted-foreground">
                  No coding experience is required. The playground features an intuitive drag-and-drop interface
                  with visual tools for data preparation, model training, and result visualization.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">What types of data can I upload?</h4>
                <p className="text-sm text-muted-foreground">
                  The playground supports CSV files and various data formats. You can also use built-in sample
                  datasets to get started quickly without uploading your own data.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">How accurate are the trained models?</h4>
                <p className="text-sm text-muted-foreground">
                  Model accuracy depends on your data quality, feature selection, and algorithm choice.
                  The playground provides comprehensive evaluation metrics to help you assess performance.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Can I export my trained models?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, you can export trained models in various formats for deployment in production
                  environments or further development in other ML frameworks.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Is my data secure and private?</h4>
                <p className="text-sm text-muted-foreground">
                  All data processing happens locally in your browser. Your datasets and trained models
                  are not uploaded to any servers, ensuring complete privacy and security.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">What algorithms are available?</h4>
                <p className="text-sm text-muted-foreground">
                  The playground includes popular algorithms for classification, regression, and clustering,
                  including linear models, tree-based methods, neural networks, and ensemble techniques.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
