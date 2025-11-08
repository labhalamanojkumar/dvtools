import { NextRequest, NextResponse } from 'next/server';
import zlib from 'zlib';
import { promisify } from 'util';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Dynamic imports to handle missing packages gracefully
let pako: any = null;
let zstd: any = null;

// Try to import compression libraries
try {
  pako = require('pako');
} catch (e) {
  console.warn('pako not available');
}

// zstd-wasm is optional and loaded dynamically
// Server-side only - try multiple fallbacks because some published packages
// don't include the expected `lib/index.js`. We keep this as a function
// so bundlers won't try to resolve it at build time.
const loadZstd = () => {
  if (typeof window === 'undefined') {
    // Use a runtime-evaluated require to avoid bundlers (webpack/next) trying
    // to resolve these modules at build time. This lets us attempt different
    // entry points at runtime in the Node server environment.
    const safeRequire = (p: string) => {
      try {
        // eslint-disable-next-line no-eval
        const req = eval('require');
        return req(p);
      } catch (e) {
        return null;
      }
    };

    const candidates = [
      '@bokuweb/zstd-wasm',
      '@bokuweb/zstd-wasm/lib/index.js',
      '@bokuweb/zstd-wasm/zstd.js',
      '@bokuweb/zstd-wasm/zstd',
      '@bokuweb/zstd-wasm/wasm',
    ];

    for (const c of candidates) {
      if (!c) continue;
      const mod = safeRequire(c);
      if (mod) return mod;
    }

    return null;
  }
  return null;
};

// Load zstd only when needed, not at module load time
// This prevents webpack from trying to resolve it during build

// Promisify Node.js zlib functions for Brotli
const brotliCompress = promisify(zlib.brotliCompress);
const brotliDecompress = promisify(zlib.brotliDecompress);

interface CompressionRequest {
  action: 'compress' | 'decompress';
  data: string; // base64 encoded string
  algorithm: 'gzip' | 'brotli' | 'zstd';
  level?: number;
  fileName?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CompressionRequest = await request.json();
    const { action, data, algorithm, level = 6 } = body;

    if (!action || !data || !algorithm) {
      return NextResponse.json(
        { error: 'Missing required parameters: action, data, algorithm' },
        { status: 400 }
      );
    }

    // Convert base64 to Uint8Array
    let inputData: Uint8Array;
    try {
      const binaryString = Buffer.from(data, 'base64');
      inputData = new Uint8Array(binaryString);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid base64 data' },
        { status: 400 }
      );
    }

    // Check for reasonable file size limits (100MB max)
    if (inputData.length > 100 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 100MB' },
        { status: 400 }
      );
    }

    const originalSize = inputData.length;
    const startTime = Date.now();

    let result: Uint8Array;
    let compressedSize: number;

    try {
      if (action === 'compress') {
        switch (algorithm) {
          case 'gzip':
            if (!pako) {
              return NextResponse.json(
                { error: 'pako library not available. Install: npm install pako' },
                { status: 500 }
              );
            }
            result = pako.gzip(inputData, { level: Math.min(level, 9) });
            compressedSize = result.length;
            break;

          case 'brotli':
            const brotliOptions = {
              params: {
                [zlib.constants.BROTLI_PARAM_QUALITY]: Math.min(level, 11),
              },
            };
            const brotliCompressed = await brotliCompress(inputData, brotliOptions);
            result = new Uint8Array(brotliCompressed);
            compressedSize = result.length;
            break;

          case 'zstd':
            const zstdLib = loadZstd();
            if (!zstdLib) {
              return NextResponse.json(
                { error: 'zstd library not available. Install: npm install @bokuweb/zstd-wasm' },
                { status: 500 }
              );
            }
            const zstdLevel = Math.min(level, 22);
            result = await zstdLib.compress(inputData, zstdLevel);
            compressedSize = result.length;
            break;

          default:
            return NextResponse.json(
              { error: `Unsupported algorithm: ${algorithm}. Available: gzip, brotli, zstd` },
              { status: 400 }
            );
        }
      } else if (action === 'decompress') {
        switch (algorithm) {
          case 'gzip':
            if (!pako) {
              return NextResponse.json(
                { error: 'pako library not available. Install: npm install pako' },
                { status: 500 }
              );
            }
            result = pako.ungzip(inputData);
            compressedSize = inputData.length;
            break;

          case 'brotli':
            const brotliDecompressed = await brotliDecompress(inputData);
            result = new Uint8Array(brotliDecompressed);
            compressedSize = inputData.length;
            break;

          case 'zstd':
            const zstdLibDecompress = loadZstd();
            if (!zstdLibDecompress) {
              return NextResponse.json(
                { error: 'zstd library not available. Install: npm install @bokuweb/zstd-wasm' },
                { status: 500 }
              );
            }
            result = await zstdLibDecompress.decompress(inputData);
            compressedSize = inputData.length;
            break;

          default:
            return NextResponse.json(
              { error: `Unsupported algorithm: ${algorithm}. Available: gzip, brotli, zstd` },
              { status: 400 }
            );
        }
      } else {
        return NextResponse.json(
          { error: `Invalid action: ${action}. Use "compress" or "decompress"` },
          { status: 400 }
        );
      }

      const compressionTime = Date.now() - startTime;
      
      // Convert result to base64
      const resultBase64 = Buffer.from(result).toString('base64');
      
      // Calculate compression ratio correctly
      let compressionRatio: number;
      if (action === 'compress') {
        compressionRatio = originalSize > 0 ? ((originalSize - compressedSize) / originalSize) * 100 : 0;
      } else {
        compressionRatio = 0;
      }

      if (action === 'compress') {
        return NextResponse.json({
          success: true,
          compressedData: resultBase64,
          originalSize,
          compressedSize,
          compressionRatio: Math.round(compressionRatio * 100) / 100,
          compressionTime,
          algorithm,
        });
      } else {
        return NextResponse.json({
          success: true,
          decompressedData: resultBase64,
          decompressedSize: result.length,
          algorithm,
        });
      }

    } catch (error: any) {
      console.error(`${action} failed with ${algorithm}:`, error);
      return NextResponse.json(
        { 
          error: `${action} with ${algorithm} failed: ${error.message}`,
          details: error.toString(),
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Compression API error:', error);
    return NextResponse.json(
      { error: 'Invalid request format', details: error.message },
      { status: 400 }
    );
  }
}