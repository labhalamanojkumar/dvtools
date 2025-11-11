'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Copy,
  Download,
  Upload,
  Type,
  RefreshCw,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

const ASCII_FONTS = {
  standard: {
    name: 'Standard',
    chars: {
      'A': ['  _   ', ' / \\  ', '/ _ \\ ', '|_| |'],
      'B': [' ___  ', '| _ ) ', '| _ \\ ', '|___/'],
      'C': ['  ___ ', ' / __|', '| (__ ', ' \\___|'],
      'D': [' ___  ', '|   \\ ', '| |) |', '|___/'],
      'E': [' ___ ', '| __|', '| _| ', '|___|'],
      'F': [' ___ ', '| __|', '| _| ', '|_|  '],
      'G': ['  ___ ', ' / __|', '| (_ |', ' \\___|'],
      'H': [' _  _ ', '| || |', '| __ |', '|_||_|'],
      'I': [' ___ ', '|_ _|', ' | | ', '|___|'],
      'J': ['  ___ ', ' |_  |', '  | | ', ' |___|'],
      'K': [' _  __', '| |/ /', '| \' < ', '|_|\\_\\'],
      'L': [' _   ', '| |  ', '| |__', '|____|'],
      'M': [' __  __ ', '|  \\/  |', '| |\\/| |', '|_|  |_|'],
      'N': [' _  _ ', '| \\| |', '| .` |', '|_|\\_|'],
      'O': ['  ___  ', ' / _ \\ ', '| (_) |', ' \\___/ '],
      'P': [' ___ ', '| _ \\', '|  _/', '|_|  '],
      'Q': ['  ___  ', ' / _ \\ ', '| (_) |', ' \\__\\_\\'],
      'R': [' ___ ', '| _ \\', '|   /', '|_|_\\'],
      'S': ['  ___ ', ' / __|', ' \\__ \\', ' |___/'],
      'T': [' _____ ', '|_   _|', '  | |  ', '  |_|  '],
      'U': [' _   _ ', '| | | |', '| |_| |', ' \\___/ '],
      'V': [' \\   / ', '  \\ / ', '   V  ', '   |  '],
      'W': [' __      __', ' \\ \\    / /', '  \\ \\/\\/ / ', '   \\_/\\_/  '],
      'X': [' __  __', ' \\ \\/ /', '  >  < ', ' /_/\\_\\'],
      'Y': [' __   __', ' \\ \\ / /', '  \\ V / ', '   |_|  '],
      'Z': [' ____', '|_  /', ' / / ', '/___|'],
      ' ': ['    ', '    ', '    ', '    '],
    },
  },
  block: {
    name: 'Block',
    chars: {
      'A': ['█████╗ ', '██╔══██╗', '███████║', '██╔══██║', '██║  ██║'],
      'B': ['██████╗ ', '██╔══██╗', '██████╔╝', '██╔══██╗', '██████╔╝'],
      'C': [' ██████╗', '██╔════╝', '██║     ', '██║     ', '╚██████╗'],
      'D': ['██████╗ ', '██╔══██╗', '██║  ██║', '██║  ██║', '██████╔╝'],
      'E': ['███████╗', '██╔════╝', '█████╗  ', '██╔══╝  ', '███████╗'],
      'F': ['███████╗', '██╔════╝', '█████╗  ', '██╔══╝  ', '██║     '],
      'G': [' ██████╗ ', '██╔════╝ ', '██║  ███╗', '██║   ██║', '╚██████╔╝'],
      'H': ['██╗  ██╗', '██║  ██║', '███████║', '██╔══██║', '██║  ██║'],
      'I': ['██╗', '██║', '██║', '██║', '██║'],
      'J': ['     ██╗', '     ██║', '     ██║', '██   ██║', '╚█████╔╝'],
      'K': ['██╗  ██╗', '██║ ██╔╝', '█████╔╝ ', '██╔═██╗ ', '██║  ██╗'],
      'L': ['██╗     ', '██║     ', '██║     ', '██║     ', '███████╗'],
      'M': ['███╗   ███╗', '████╗ ████║', '██╔████╔██║', '██║╚██╔╝██║', '██║ ╚═╝ ██║'],
      'N': ['███╗   ██╗', '████╗  ██║', '██╔██╗ ██║', '██║╚██╗██║', '██║ ╚████║'],
      'O': [' ██████╗ ', '██╔═══██╗', '██║   ██║', '██║   ██║', '╚██████╔╝'],
      'P': ['██████╗ ', '██╔══██╗', '██████╔╝', '██╔═══╝ ', '██║     '],
      'Q': [' ██████╗ ', '██╔═══██╗', '██║   ██║', '██║▄▄ ██║', '╚██████╔╝'],
      'R': ['██████╗ ', '██╔══██╗', '██████╔╝', '██╔══██╗', '██║  ██║'],
      'S': ['███████╗', '██╔════╝', '███████╗', '╚════██║', '███████║'],
      'T': ['████████╗', '╚══██╔══╝', '   ██║   ', '   ██║   ', '   ██║   '],
      'U': ['██╗   ██╗', '██║   ██║', '██║   ██║', '██║   ██║', '╚██████╔╝'],
      'V': ['██╗   ██╗', '██║   ██║', '██║   ██║', '╚██╗ ██╔╝', ' ╚████╔╝ '],
      'W': ['██╗    ██╗', '██║    ██║', '██║ █╗ ██║', '██║███╗██║', '╚███╔███╔╝'],
      'X': ['██╗  ██╗', '╚██╗██╔╝', ' ╚███╔╝ ', ' ██╔██╗ ', '██╔╝ ██╗'],
      'Y': ['██╗   ██╗', '╚██╗ ██╔╝', ' ╚████╔╝ ', '  ╚██╔╝  ', '   ██║   '],
      'Z': ['███████╗', '╚══███╔╝', '  ███╔╝ ', ' ███╔╝  ', '███████╗'],
      ' ': ['        ', '        ', '        ', '        ', '        '],
    },
  },
  small: {
    name: 'Small',
    chars: {
      'A': [' _. ', '/_\\'],
      'B': ['|_)', '|_)'],
      'C': ['|_ ', '|_ '],
      'D': ['|\\', '|/'],
      'E': ['|_ ', '|_'],
      'F': ['|_ ', '|  '],
      'G': ['|_ ', '|_>'],
      'H': ['|_|', '| |'],
      'I': ['|', '|'],
      'J': [' |', '_|'],
      'K': ['|/ ', '|\\'],
      'L': ['|  ', '|_ '],
      'M': ['|\\/|', '|  |'],
      'N': ['|\\|', '| |'],
      'O': ['/ \\', '\\_/'],
      'P': ['|_)', '|  '],
      'Q': ['/ \\', '\\_\\\\'],
      'R': ['|_)', '| \\'],
      'S': ['/_ ', '\\_\\'],
      'T': ['_|_', ' | '],
      'U': ['| |', '|_|'],
      'V': ['\\/', ' | '],
      'W': ['\\  /', ' \\/ '],
      'X': ['\\/', '/\\'],
      'Y': ['\\/', ' | '],
      'Z': ['__', '/_'],
      ' ': ['  ', '  '],
    },
  },
};

export default function TextToASCIIArtClient() {
  const [inputText, setInputText] = useState('');
  const [asciiArt, setAsciiArt] = useState('');
  const [selectedFont, setSelectedFont] = useState<keyof typeof ASCII_FONTS>('standard');
  const { toast } = useToast();

  const generateAsciiArt = useCallback((text: string, font: keyof typeof ASCII_FONTS) => {
    if (!text) {
      setAsciiArt('');
      return;
    }

    const fontData = ASCII_FONTS[font];
    const upperText = text.toUpperCase();
    const lines: string[] = [];
    const height = Object.values(fontData.chars)[0].length;

    for (let i = 0; i < height; i++) {
      lines.push('');
    }

    for (const char of upperText) {
      const charArt = fontData.chars[char as keyof typeof fontData.chars];
      if (charArt) {
        for (let i = 0; i < height; i++) {
          lines[i] += charArt[i] + ' ';
        }
      } else {
        // If character not found, use space
        const spaceArt = fontData.chars[' '];
        for (let i = 0; i < height; i++) {
          lines[i] += spaceArt[i] + ' ';
        }
      }
    }

    setAsciiArt(lines.join('\n'));
  }, []);

  const handleTextChange = (text: string) => {
    setInputText(text);
    generateAsciiArt(text, selectedFont);
  };

  const handleFontChange = (font: string) => {
    setSelectedFont(font as keyof typeof ASCII_FONTS);
    if (inputText) {
      generateAsciiArt(inputText, font as keyof typeof ASCII_FONTS);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      handleTextChange(text);
      toast({
        title: 'File loaded',
        description: 'Text content loaded successfully',
      });
    };
    reader.readAsText(file);
  };

  const copyToClipboard = () => {
    if (!asciiArt) return;
    navigator.clipboard.writeText(asciiArt);
    toast({
      title: 'Copied!',
      description: 'ASCII art copied to clipboard',
    });
  };

  const downloadArt = () => {
    if (!asciiArt) return;
    const blob = new Blob([asciiArt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ascii-art.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: 'Downloaded',
      description: 'ASCII art saved as text file',
    });
  };

  const clearAll = () => {
    setInputText('');
    setAsciiArt('');
  };

  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Text to ASCII Art Converter</h1>
          <p className="text-muted-foreground">
            Convert your text into beautiful ASCII art with multiple font styles
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Type className="mr-1 h-3 w-3" />
          ASCII Art
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About This Tool</CardTitle>
          <CardDescription>
            Professional ASCII art generator for creating text banners, logos, and decorative text
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Transform plain text into eye-catching ASCII art designs. Perfect for creating banners, logos, signatures, and decorative text for documentation, README files, or social media. Choose from multiple font styles and download your creations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                Key Features
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Multiple ASCII art font styles</li>
                <li>• Real-time text conversion</li>
                <li>• Upload text files for conversion</li>
                <li>• Copy to clipboard instantly</li>
                <li>• Download as text file</li>
                <li>• Clean and readable output</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <Sparkles className="mr-2 h-4 w-4 text-primary" />
                Use Cases
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Create README file headers</li>
                <li>• Design terminal banners</li>
                <li>• Generate text logos</li>
                <li>• Create email signatures</li>
                <li>• Make social media posts stand out</li>
                <li>• Add decorative text to documentation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Convert Text</CardTitle>
          <CardDescription>Enter text or upload a file to convert</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Font Style</Label>
              <Select value={selectedFont} onValueChange={handleFontChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ASCII_FONTS).map(([key, font]) => (
                    <SelectItem key={key} value={key}>
                      {font.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Upload Text File</Label>
              <div className="flex gap-2">
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="flex-1"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                </Button>
                <Button variant="outline" onClick={clearAll}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Input Text</Label>
            <Textarea
              value={inputText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Enter text to convert to ASCII art..."
              className="min-h-[100px] font-mono"
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground">
              Maximum 50 characters. Only letters and spaces supported.
            </p>
          </div>

          {asciiArt && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>ASCII Art Output</Label>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={downloadArt}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="bg-muted rounded-md p-4 overflow-x-auto">
                  <pre className="font-mono text-sm whitespace-pre">{asciiArt}</pre>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
