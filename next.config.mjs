import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // Optimize for production
  reactStrictMode: true,
  // Enable standalone output for Docker
  output: 'standalone',
  // Increase static generation timeout to 300 seconds for large builds
  staticPageGenerationTimeout: 300,
  // Reduce build trace size
  productionBrowserSourceMaps: false,
  // Disable TypeScript errors during build (run type-check separately)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Experimental features to limit file system access
  experimental: {
    // Disable file tracing to avoid Windows permission issues
  },
  // Webpack configuration to exclude problematic directories
  webpack: (config, { isServer, webpack, dir }) => {
    // Set context to project directory to prevent scanning system directories
    config.context = dir;
    
    // Exclude Windows system directories from scanning
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/.next/**',
        '**/Users/**/AppData/Local/Temp/WinSAT/**',
        '**/Windows/**',
        '**/Program Files/**',
        '**/Program Files (x86)/**',
      ],
    };
    
    // Limit module resolution to project directory
    config.resolve = {
      ...config.resolve,
      modules: [
        'node_modules',
        ...(config.resolve?.modules || []),
      ].filter(Boolean),
      // Prevent resolving from parent directories
      symlinks: false,
    };
    
    // Ignore errors from system directories
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      /Users.*AppData.*Local.*Temp.*WinSAT/,
      /Windows/,
    ];
    
    // Add plugin to catch and ignore permission errors
    config.plugins = [
      ...(config.plugins || []),
      new webpack.IgnorePlugin({
        checkResource(resource, context) {
          // Ignore resources from system directories
          if (resource.includes('WinSAT') || 
              resource.includes('Windows') ||
              resource.includes('Program Files')) {
            return true;
          }
          return false;
        },
      }),
    ];
    
    return config;
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/u/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)