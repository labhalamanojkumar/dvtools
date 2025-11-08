import { NextRequest, NextResponse } from 'next/server';

// Dynamic imports to handle missing packages gracefully
let protobufjs: any = null;
let avsc: any = null;
let msgpack: any = null;

try {
  protobufjs = require('protobufjs');
} catch (e) {
  console.warn('protobufjs not available');
}

try {
  avsc = require('avsc');
} catch (e) {
  console.warn('avsc not available');
}

try {
  msgpack = require('msgpack-lite');
} catch (e) {
  console.warn('msgpack-lite not available');
}

export async function POST(request: NextRequest) {
  try {
    const { action, format, data, schema, messageType } = await request.json();

    if (!action || !format) {
      return NextResponse.json(
        { error: 'Missing required fields: action and format' },
        { status: 400 }
      );
    }

    if (!protobufjs && !avsc && !msgpack) {
      return NextResponse.json(
        { error: 'No serialization libraries available. Please install protobufjs, avsc, or msgpack-lite' },
        { status: 500 }
      );
    }

    let result: any;

    switch (action) {
      case 'serialize':
        if (!data) {
          return NextResponse.json(
            { error: 'Missing data for serialization' },
            { status: 400 }
          );
        }

        switch (format) {
          case 'protobuf':
            if (!protobufjs) throw new Error('protobufjs library not available');
            if (!schema || !messageType) {
              return NextResponse.json(
                { error: 'Missing schema or messageType for protobuf serialization' },
                { status: 400 }
              );
            }

            const root = protobufjs.parse(schema).root;
            const MessageType = root.lookupType(messageType);
            const errMsg = MessageType.verify(data);
            if (errMsg) {
              throw new Error(`Protobuf validation error: ${errMsg}`);
            }
            const message = MessageType.create(data);
            result = MessageType.encode(message).finish();
            break;

          case 'avro':
            if (!avsc) throw new Error('avsc library not available');
            if (!schema) {
              return NextResponse.json(
                { error: 'Missing schema for avro serialization' },
                { status: 400 }
              );
            }

            const type = avsc.Type.forSchema(schema);
            result = type.toBuffer(data);
            break;

          case 'msgpack':
            if (!msgpack) throw new Error('msgpack-lite library not available');
            result = msgpack.encode(data);
            break;

          default:
            return NextResponse.json(
              { error: 'Unsupported serialization format' },
              { status: 400 }
            );
        }
        break;

      case 'deserialize':
        if (!data) {
          return NextResponse.json(
            { error: 'Missing data for deserialization' },
            { status: 400 }
          );
        }

        const inputData = new Uint8Array(data);

        switch (format) {
          case 'protobuf':
            if (!protobufjs) throw new Error('protobufjs library not available');
            if (!schema || !messageType) {
              return NextResponse.json(
                { error: 'Missing schema or messageType for protobuf deserialization' },
                { status: 400 }
              );
            }

            const root = protobufjs.parse(schema).root;
            const MessageType = root.lookupType(messageType);
            const decodedMessage = MessageType.decode(inputData);
            result = MessageType.toObject(decodedMessage);
            break;

          case 'avro':
            if (!avsc) throw new Error('avsc library not available');
            if (!schema) {
              return NextResponse.json(
                { error: 'Missing schema for avro deserialization' },
                { status: 400 }
              );
            }

            const type = avsc.Type.forSchema(schema);
            result = type.fromBuffer(inputData);
            break;

          case 'msgpack':
            if (!msgpack) throw new Error('msgpack-lite library not available');
            result = msgpack.decode(inputData);
            break;

          default:
            return NextResponse.json(
              { error: 'Unsupported deserialization format' },
              { status: 400 }
            );
        }
        break;

      case 'detect':
        if (!data) {
          return NextResponse.json(
            { error: 'Missing data for detection' },
            { status: 400 }
          );
        }

        const detectData = new Uint8Array(data);
        let detectedFormat: string | null = null;
        let deserializedResult: any = null;

        // Try MessagePack first (most common)
        if (msgpack) {
          try {
            deserializedResult = msgpack.decode(detectData);
            detectedFormat = 'msgpack';
          } catch (e) {
            // Continue to next format
          }
        }

        // Try Avro if MessagePack failed
        if (!detectedFormat && avsc) {
          try {
            // For detection, we'll try with a generic schema or just attempt decode
            // This is simplified - real implementation would be more sophisticated
            deserializedResult = avsc.decode(detectData);
            detectedFormat = 'avro';
          } catch (e) {
            // Continue to next format
          }
        }

        // Protobuf detection is complex without schema, so we'll skip it for auto-detection
        // Users should manually specify protobuf format with schema

        if (!detectedFormat) {
          return NextResponse.json(
            { error: 'Unable to detect serialization format. Try manual deserialization with specific format.' },
            { status: 400 }
          );
        }

        result = {
          format: detectedFormat,
          data: deserializedResult
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "serialize", "deserialize", or "detect"' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      result: action === 'serialize' ? Array.from(result) : result,
      format,
      action
    });

  } catch (error) {
    console.error('Serialization API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Serialization operation failed' },
      { status: 500 }
    );
  }
}