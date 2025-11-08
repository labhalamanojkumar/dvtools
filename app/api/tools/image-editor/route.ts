import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { operation, image, options = {} } = body as {
      operation: string;
      image: string;
      options?: any;
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
      sharp = require('sharp');
    } catch (e) {
      return NextResponse.json(
        {
          error:
            'Server processing not available. Please install `sharp` in the project (npm i sharp) to enable server-side image processing.',
        },
        { status: 501 },
      );
    }

    try {
      let pipeline = sharp(buffer);

      switch (operation) {
        case 'resize':
          const { width, height, fit = 'cover' } = options;
          if (width || height) {
            pipeline = pipeline.resize(width, height, { fit, withoutEnlargement: true });
          }
          break;

        case 'crop':
          const { left, top, cropWidth, cropHeight } = options;
          if (cropWidth && cropHeight) {
            pipeline = pipeline.extract({ left, top, width: cropWidth, height: cropHeight });
          }
          break;

        case 'rotate':
          const { angle = 90 } = options;
          pipeline = pipeline.rotate(angle);
          break;

        case 'flip':
          const { direction = 'horizontal' } = options;
          if (direction === 'horizontal') {
            pipeline = pipeline.flop();
          } else {
            pipeline = pipeline.flip();
          }
          break;

        case 'blur':
          const { sigma = 1 } = options;
          pipeline = pipeline.blur(sigma);
          break;

        case 'sharpen':
          const { sharpenSigma = 1, sharpenFlat = 1, sharpenJagged = 2 } = options;
          pipeline = pipeline.sharpen({ sigma: sharpenSigma, flat: sharpenFlat, jagged: sharpenJagged });
          break;

        case 'brightness':
        case 'contrast':
        case 'saturation':
          // These require more complex processing
          const { value = 1 } = options;
          if (operation === 'brightness') {
            pipeline = pipeline.modulate({ brightness: value });
          } else if (operation === 'contrast') {
            pipeline = pipeline.linear(value, -(0.5 * value) + 0.5);
          } else if (operation === 'saturation') {
            pipeline = pipeline.modulate({ saturation: value });
          }
          break;

        case 'grayscale':
          pipeline = pipeline.grayscale();
          break;

        case 'tint':
          const { tintColor = '#FF0000' } = options;
          pipeline = pipeline.tint(tintColor);
          break;

        case 'compress':
          const { quality = 80, format = 'jpeg' } = options;
          const normalizedFormat = format.toLowerCase();

          switch (normalizedFormat) {
            case 'webp':
              pipeline = pipeline.webp({ quality: Math.round(quality) });
              break;
            case 'avif':
              pipeline = pipeline.avif({ quality: Math.round(quality) });
              break;
            case 'png':
              pipeline = pipeline.png({ compressionLevel: Math.round((100 - quality) / 10) });
              break;
            case 'jpeg':
            case 'jpg':
            default:
              pipeline = pipeline.jpeg({ quality: Math.round(quality) });
              break;
          }
          break;

        default:
          return NextResponse.json({ error: 'Unsupported operation' }, { status: 400 });
      }

      const outBuffer = await pipeline.toBuffer();
      const uint8 = new Uint8Array(outBuffer);

      // Determine content type
      let contentType = 'image/jpeg';
      if (operation === 'compress' && options.format) {
        const fmt = options.format.toLowerCase();
        contentType = `image/${fmt === 'jpg' ? 'jpeg' : fmt}`;
      }

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

// GET endpoint for image information
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const imageUrl = url.searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json({ error: 'Missing image URL' }, { status: 400 });
    }

    let sharp: any;
    try {
      sharp = require('sharp');
    } catch (e) {
      return NextResponse.json(
        { error: 'Sharp not available' },
        { status: 501 },
      );
    }

    // For remote URLs, we'd need to fetch them first
    // For now, return basic info structure
    return NextResponse.json({
      supported: true,
      operations: [
        'resize', 'crop', 'rotate', 'flip', 'blur', 'sharpen',
        'brightness', 'contrast', 'saturation', 'grayscale', 'tint', 'compress'
      ]
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}