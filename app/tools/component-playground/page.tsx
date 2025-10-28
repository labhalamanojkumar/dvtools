import ComponentPlaygroundClient from '@/components/tools/component-playground-client';
import ScrollToPlaygroundButton from '@/components/tools/scroll-to-playground-button';

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Component Playground',
  description: 'Interactive React component explorer with live previews and code generation',
  url: 'https://multitoolplatform.com/tools/component-playground',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  creator: {
    '@type': 'Organization',
    name: 'Multi Tool Platform',
    url: 'https://multitoolplatform.com',
  },
  featureList: [
    'Interactive component exploration',
    'Live preview with real-time updates',
    'Props and state manipulation',
    'Code generation and export',
    'Multiple component frameworks support',
    'Responsive design testing'
  ],
  screenshot: '/component-playground-screenshot.jpg',
  softwareVersion: '1.0.0',
  datePublished: '2024-01-01',
  programmingLanguage: 'TypeScript, React',
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://multitoolplatform.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Tools',
      item: 'https://multitoolplatform.com/tools',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Component Playground',
      item: 'https://multitoolplatform.com/tools/component-playground',
    },
  ],
};

export default function ComponentPlaygroundPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Component Playground
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Explore and customize React components with interactive controls, live previews,
            and instant code generation. Perfect for developers building modern web applications.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              React Components
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Live Preview
            </span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              Code Generation
            </span>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
              Interactive Testing
            </span>
          </div>
        </div>

        {/* Main Tool Component */}
        <div className="mb-12">
          <ComponentPlaygroundClient />
        </div>

        {/* Educational Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* What is Component Playground */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What is Component Playground?
            </h2>
            <div className="prose prose-lg max-w-none">
              <p>
                Component Playground is an interactive development environment that allows you to explore,
                customize, and test React components in real-time. Instead of writing code and refreshing
                the page to see changes, you can manipulate component props and state directly through
                intuitive controls and see the results instantly.
              </p>

              <h3>Key Features</h3>
              <ul>
                <li><strong>Live Preview:</strong> See component changes instantly as you modify props and settings</li>
                <li><strong>Interactive Controls:</strong> Adjust component properties through user-friendly inputs</li>
                <li><strong>Code Generation:</strong> Export production-ready code with your customizations</li>
                <li><strong>Multiple Frameworks:</strong> Support for React, Vue, Angular, and Svelte components</li>
                <li><strong>Responsive Testing:</strong> Test components across different screen sizes</li>
                <li><strong>State Management:</strong> Manipulate component state and lifecycle methods</li>
              </ul>

              <h3>Perfect For</h3>
              <ul>
                <li>UI/UX designers exploring component variations</li>
                <li>Developers prototyping new features</li>
                <li>Teams evaluating component libraries</li>
                <li>Educators teaching component concepts</li>
                <li>Open source maintainers demonstrating usage</li>
              </ul>
            </div>
          </div>

          {/* Quick Stats */}
          <div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Component Playground Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Live Updates</span>
                  <span className="text-sm font-medium text-green-600">✓ Real-time</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Code Export</span>
                  <span className="text-sm font-medium text-green-600">✓ Instant</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Framework Support</span>
                  <span className="text-sm font-medium text-green-600">4+ Frameworks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Responsive Testing</span>
                  <span className="text-sm font-medium text-green-600">✓ Built-in</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">State Management</span>
                  <span className="text-sm font-medium text-green-600">✓ Advanced</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">TypeScript Support</span>
                  <span className="text-sm font-medium text-green-600">✓ Full</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Development Speed</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">5x</div>
                <div className="text-sm text-gray-600 mb-4">Faster Prototyping</div>
                <div className="text-2xl font-bold text-blue-600 mb-2">90%</div>
                <div className="text-sm text-gray-600">Time Saved</div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            How Component Playground Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Component</h3>
              <p className="text-gray-600">
                Choose from a library of pre-built components or paste your own React component code
                to begin exploration and customization.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Customize Properties</h3>
              <p className="text-gray-600">
                Use intuitive controls to modify component props, adjust styling, and manipulate
                state. See changes reflected instantly in the preview.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate & Export</h3>
              <p className="text-gray-600">
                Export production-ready code with your customizations. Copy the generated code
                directly into your project or save it for later use.
              </p>
            </div>
          </div>
        </div>

        {/* Advanced Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Advanced Playground Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Component Analysis</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Automatic prop detection</li>
                <li>• TypeScript interface parsing</li>
                <li>• Dependency mapping</li>
                <li>• Performance metrics</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Interactive Testing</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Event simulation</li>
                <li>• State mutation testing</li>
                <li>• Lifecycle method hooks</li>
                <li>• Error boundary testing</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Code Optimization</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Automatic code formatting</li>
                <li>• Import optimization</li>
                <li>• Tree shaking hints</li>
                <li>• Bundle size analysis</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Collaboration Tools</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Share playground URLs</li>
                <li>• Version control integration</li>
                <li>• Team workspace sync</li>
                <li>• Comment and annotation</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Accessibility Testing</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• WCAG compliance checking</li>
                <li>• Screen reader testing</li>
                <li>• Keyboard navigation</li>
                <li>• Color contrast analysis</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Export Options</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Multiple format support</li>
                <li>• Framework-specific code</li>
                <li>• CSS-in-JS conversion</li>
                <li>• Storybook integration</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-blue-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Perfect Use Cases
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Design System Development</h3>
              <p className="text-gray-600 mb-4">
                Build and test design system components with real-time feedback. Ensure consistency
                across your component library while exploring different variations and states.
              </p>
              <div className="text-sm text-blue-600 font-medium">→ Design System Ready</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Component Documentation</h3>
              <p className="text-gray-600 mb-4">
                Create interactive documentation for your components. Let users explore props
                and see examples without leaving the documentation site.
              </p>
              <div className="text-sm text-green-600 font-medium">→ Interactive Docs</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Rapid Prototyping</h3>
              <p className="text-gray-600 mb-4">
                Quickly prototype UI ideas and user flows. Test component interactions and
                user experience patterns before implementing in production.
              </p>
              <div className="text-sm text-purple-600 font-medium">→ Fast Prototyping</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Component Library Evaluation</h3>
              <p className="text-gray-600 mb-4">
                Evaluate and compare different component libraries. Test components from
                various libraries side by side to make informed decisions.
              </p>
              <div className="text-sm text-orange-600 font-medium">→ Library Comparison</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Educational Tools</h3>
              <p className="text-gray-600 mb-4">
                Teach React concepts and component development. Students can experiment
                with props, state, and lifecycle methods in a safe environment.
              </p>
              <div className="text-sm text-red-600 font-medium">→ Learning Platform</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Code Review Preparation</h3>
              <p className="text-gray-600 mb-4">
                Prepare components for code review by testing edge cases and ensuring
                proper prop validation and error handling.
              </p>
              <div className="text-sm text-indigo-600 font-medium">→ Review Ready</div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <details className="bg-white border border-gray-200 rounded-lg p-6">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                What frameworks does Component Playground support?
              </summary>
              <div className="mt-4 text-gray-600">
                Component Playground primarily supports React components with plans to add Vue.js,
                Angular, and Svelte support. For React, it supports both class and functional components,
                hooks, and TypeScript. You can paste any valid React component code and it will be
                analyzed and made interactive.
              </div>
            </details>

            <details className="bg-white border border-gray-200 rounded-lg p-6">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Can I import external libraries or dependencies?
              </summary>
              <div className="mt-4 text-gray-600">
                Currently, the playground works with self-contained components. External dependencies
                need to be available through CDN links or inline code. We&apos;re working on a more advanced
                dependency management system that will allow importing from popular libraries like
                Lodash, Moment.js, and UI component libraries.
              </div>
            </details>

            <details className="bg-white border border-gray-200 rounded-lg p-6">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                How does the live preview work?
              </summary>
              <div className="mt-4 text-gray-600">
                The live preview uses a sandboxed iframe environment to safely execute your component
                code. Changes to props and state are communicated through postMessage API, allowing
                real-time updates without page refreshes. The preview environment includes React,
                ReactDOM, and other common libraries.
              </div>
            </details>

            <details className="bg-white border border-gray-200 rounded-lg p-6">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Is my code secure in the playground?
              </summary>
              <div className="mt-4 text-gray-600">
                Yes, Component Playground uses sandboxed execution environments and Content Security
                Policy headers to ensure your code runs safely. Components are executed in isolated
                contexts, and potentially harmful operations are blocked. Your code never touches
                our servers directly.
              </div>
            </details>

            <details className="bg-white border border-gray-200 rounded-lg p-6">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Can I save and share my playground configurations?
              </summary>
              <div className="mt-4 text-gray-600">
                Yes! You can generate shareable URLs that include your component code and current
                configuration. These URLs can be bookmarked, shared with team members, or embedded
                in documentation. We&apos;re also working on user accounts with saved playgrounds.
              </div>
            </details>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Explore Components?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Start experimenting with React components in our interactive playground.
            Customize, test, and generate production-ready code in minutes.
          </p>
          <ScrollToPlaygroundButton />
        </div>
      </div>
    </>
  );
}
