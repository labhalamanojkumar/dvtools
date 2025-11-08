import { NextRequest, NextResponse } from "next/server";

interface LoremIpsumRequest {
  type: 'paragraphs' | 'sentences' | 'words' | 'characters';
  count: number;
  format?: 'plain' | 'html';
  startWithLorem?: boolean;
}

interface LoremIpsumResponse {
  success: boolean;
  text?: string;
  error?: string;
}

// Lorem ipsum word bank
const loremWords = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea",
  "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit",
  "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla",
  "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident",
  "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id",
  "est", "laborum"
];

// Generate a random sentence
function generateSentence(): string {
  const sentenceLength = Math.floor(Math.random() * 8) + 8; // 8-16 words
  const words = [];

  for (let i = 0; i < sentenceLength; i++) {
    words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
  }

  // Capitalize first word and add period
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(' ') + '.';
}

// Generate a random paragraph
function generateParagraph(): string {
  const sentenceCount = Math.floor(Math.random() * 4) + 3; // 3-7 sentences
  const sentences = [];

  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence());
  }

  return sentences.join(' ');
}

// Generate lorem ipsum text
function generateLoremIpsum(request: LoremIpsumRequest): string {
  const { type, count, startWithLorem = true } = request;
  let result = '';

  switch (type) {
    case 'paragraphs':
      const paragraphs = [];
      for (let i = 0; i < count; i++) {
        paragraphs.push(generateParagraph());
      }
      result = paragraphs.join('\n\n');
      break;

    case 'sentences':
      const sentences = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence());
      }
      result = sentences.join(' ');
      break;

    case 'words':
      const words = [];
      for (let i = 0; i < count; i++) {
        words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
      }
      result = words.join(' ');
      break;

    case 'characters':
      const chars = [];
      for (let i = 0; i < count; i++) {
        chars.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
      }
      result = chars.join(' ').substring(0, count);
      break;

    default:
      throw new Error('Invalid type specified');
  }

  // Optionally start with "Lorem ipsum dolor sit amet..."
  if (startWithLorem && (type === 'paragraphs' || type === 'sentences')) {
    result = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + result;
  }

  return result.trim();
}

export async function POST(request: NextRequest) {
  try {
    const body: LoremIpsumRequest = await request.json();

    // Validate request
    if (!body.type || !['paragraphs', 'sentences', 'words', 'characters'].includes(body.type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid type. Must be one of: paragraphs, sentences, words, characters'
      }, { status: 400 });
    }

    if (!body.count || body.count < 1 || body.count > 1000) {
      return NextResponse.json({
        success: false,
        error: 'Count must be between 1 and 1000'
      }, { status: 400 });
    }

    // Generate lorem ipsum
    const text = generateLoremIpsum(body);

    // Format response
    let formattedText = text;
    if (body.format === 'html' && body.type === 'paragraphs') {
      formattedText = text.split('\n\n').map(p => `<p>${p}</p>`).join('\n');
    }

    return NextResponse.json({
      success: true,
      text: formattedText
    });

  } catch (error) {
    console.error('Lorem ipsum generation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate lorem ipsum text'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Lorem Ipsum Generator API',
    usage: {
      endpoint: 'POST /api/tools/lorem-ipsum-generator',
      body: {
        type: 'paragraphs | sentences | words | characters',
        count: 'number (1-1000)',
        format: 'plain | html (optional)',
        startWithLorem: 'boolean (optional, default: true)'
      }
    }
  });
}