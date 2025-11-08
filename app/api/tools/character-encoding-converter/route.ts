import { NextRequest, NextResponse } from 'next/server';
import iconv from 'iconv-lite';

export async function POST(request: NextRequest) {
  try {
    const { action, data, encoding, sourceEncoding, targetEncoding, errorHandling = 'replace', replacementChar = '�' } = await request.json();

    switch (action) {
      case 'detect': {
        // Detect encoding from binary data
        const buffer = Buffer.from(data, 'base64');

        // Check for BOM (Byte Order Mark)
        let detectedEncoding = "utf-8";
        let confidence = 0.5;

        if (buffer.length >= 3) {
          if (buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
            detectedEncoding = "utf-8";
            confidence = 1.0;
          } else if (buffer.length >= 4) {
            if (buffer[0] === 0x00 && buffer[1] === 0x00 && buffer[2] === 0xFE && buffer[3] === 0xFF) {
              detectedEncoding = "utf-32be";
              confidence = 1.0;
            } else if (buffer[0] === 0xFF && buffer[1] === 0xFE && buffer[2] === 0x00 && buffer[3] === 0x00) {
              detectedEncoding = "utf-32le";
              confidence = 1.0;
            }
          }
          if (buffer.length >= 2 && confidence < 1.0) {
            if (buffer[0] === 0xFE && buffer[1] === 0xFF) {
              detectedEncoding = "utf-16be";
              confidence = 1.0;
            } else if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
              detectedEncoding = "utf-16le";
              confidence = 1.0;
            }
          }
        }

        // Basic heuristic detection if no BOM
        if (confidence < 1.0) {
          const highBytes = buffer.filter(byte => byte > 127).length;
          const totalBytes = buffer.length;

          if (highBytes === 0) {
            detectedEncoding = "ascii";
            confidence = 0.8;
          } else if (highBytes / totalBytes > 0.3) {
            detectedEncoding = "utf-8";
            confidence = 0.7;
          } else {
            detectedEncoding = "iso-8859-1";
            confidence = 0.6;
          }
        }

        // Detect anomalies
        const anomalies = detectAnomalies(buffer, detectedEncoding);

        return NextResponse.json({
          encoding: detectedEncoding,
          confidence,
          language: null,
          anomalies,
        });
      }

      case 'convert': {
        // Convert encoding
        const buffer = Buffer.from(data, 'base64');
        const actualSourceEncoding = sourceEncoding === "auto" ? "utf-8" : sourceEncoding;

        let convertedText: string;
        let convertedBuffer: Buffer;

        try {
          convertedText = iconv.decode(buffer, actualSourceEncoding);

          convertedBuffer = iconv.encode(convertedText, targetEncoding);
        } catch (err) {
          if (errorHandling === "strict") {
            throw err;
          }
          // Fallback conversion
          convertedText = buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, replacementChar);
          convertedBuffer = Buffer.from(convertedText, 'utf-8');
        }

        const byteChanges = Math.abs(convertedBuffer.length - buffer.length);
        const originalText = buffer.toString('utf-8');
        const charChanges = Math.abs(convertedText.length - originalText.length);

        return NextResponse.json({
          originalEncoding: actualSourceEncoding,
          targetEncoding,
          convertedText,
          convertedData: convertedBuffer.toString('base64'),
          byteChanges,
          characterChanges: charChanges,
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Character encoding API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

function detectAnomalies(data: Buffer, encoding: string): any[] {
  const anomalies: any[] = [];

  try {
    // Try to decode and check for issues
    const text = iconv.decode(data, encoding);

    // Check for null bytes or unusual characters
    let nullByteCount = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i] === 0) nullByteCount++;
    }

    if (nullByteCount > data.length * 0.1) {
      anomalies.push({
        position: -1,
        character: "",
        issue: "High number of null bytes detected, might be binary data"
      });
    }

    // Check for control characters (except common ones)
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      if (charCode < 32 && charCode !== 9 && charCode !== 10 && charCode !== 13) {
        anomalies.push({
          position: i,
          character: String.fromCharCode(charCode),
          issue: `Unexpected control character (U+${charCode.toString(16).toUpperCase()})`
        });
      }
    }

  } catch (err) {
    anomalies.push({
      position: -1,
      character: "",
      issue: `Decoding error: ${err instanceof Error ? err.message : 'Unknown error'}`
    });
  }

  return anomalies;
}