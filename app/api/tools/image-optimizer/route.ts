import { NextResponse } from 'next/server';

// Simple server-side image conversion route using `sharp` if available.
// This route accepts POST JSON { image: dataUrl, format: 'webp'|'jpeg'|'png'|'avif', quality: number }
// and returns the converted binary image. If `sharp` is not installed, the route responds
// with 501 and a helpful message so the developer can install the dependency.

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image, format = 'jpeg', quality = 80 } = body as {
      image: string;
      format?: string;
      quality?: number;
    };

    if (!image || typeof image !== 'string') {
      return NextResponse.json({ error: 'Missing image data' }, { status: 400 });
    }

    const matches = image.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      return NextResponse.json({ error: 'Invalid data URL' }, { status: 400 });
    }

    const mime = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');

    let sharp: any;
    try {
      // Dynamic require so app doesn't fail if `sharp` isn't installed.
      // In production you should add `sharp` to dependencies and install it.
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      sharp = require('sharp');
    } catch (e) {
      return NextResponse.json(
        {
          error:
            'Server converter not available. Please install `sharp` in the project (npm i sharp) to enable server-side image conversion.',
        },
        { status: 501 },
      );
    }

    try {
      const pipeline = sharp(buffer);
      const normalizedFormat = (format || 'jpeg').toLowerCase();

      let outBuffer: Buffer;
      switch (normalizedFormat) {
        case 'webp':
          outBuffer = await pipeline.webp({ quality: Math.round(quality) }).toBuffer();
          break;
        case 'avif':
          outBuffer = await pipeline.avif({ quality: Math.round(quality) }).toBuffer();
          break;
        case 'png':
          outBuffer = await pipeline.png().toBuffer();
          break;
        case 'jpeg':
        case 'jpg':
        default:
          outBuffer = await pipeline.jpeg({ quality: Math.round(quality) }).toBuffer();
          break;
      }

      const contentType = `image/${normalizedFormat === 'jpg' ? 'jpeg' : normalizedFormat}`;

      // Convert Node Buffer to Uint8Array for the Response body
      const uint8 = new Uint8Array(outBuffer);

      return new Response(uint8, {
        status: 200,
        headers: {
          'Content-Type': contentType,
        },
      });
    } catch (err: any) {
      return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
