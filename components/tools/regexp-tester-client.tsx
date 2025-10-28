'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { copyToClipboard, downloadFile } from '../../lib/utils';
import { useToast } from '../ui/toaster';
import { Copy, Download, CheckCircle, XCircle } from 'lucide-react';

export function RegexpTesterClient() {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState('g');
  const [matches, setMatches] = useState<RegExpExecArray[]>([]);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!pattern) {
      setMatches([]);
      setError('');
      setIsValid(false);
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      setIsValid(true);
      setError('');

      if (testString) {
        const results: RegExpExecArray[] = [];
        let match;
        const regexCopy = new RegExp(regex);

        while ((match = regexCopy.exec(testString)) !== null) {
          results.push(match);
          if (!regex.global) break;
        }

        setMatches(results);
      } else {
        setMatches([]);
      }
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : 'Invalid regex pattern');
      setMatches([]);
    }
  }, [pattern, testString, flags]);

  const copyMatches = () => {
    const matchText = matches.map((match, index) =>
      `Match ${index + 1}: "${match[0]}" at position ${match.index}`
    ).join('\n');
    copyToClipboard(matchText);
    toast({ title: 'Success', description: 'Matches copied to clipboard' });
  };

  const downloadMatches = () => {
    const matchText = matches.map((match, index) =>
      `Match ${index + 1}: "${match[0]}" at position ${match.index}`
    ).join('\n');
    downloadFile(matchText, 'regex-matches.txt', 'text/plain');
  };

  const toggleFlag = (flag: string) => {
    setFlags(prev => prev.includes(flag)
      ? prev.replace(flag, '')
      : prev + flag
    );
  };

  return (
    <div className="space-y-6">
      {/* Pattern Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Regular Expression Pattern
            {isValid ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern (e.g., \w+@\w+\.\w+)"
              className="font-mono"
            />
          </div>

          {/* Flags */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'g', label: 'Global', desc: 'Find all matches' },
              { key: 'i', label: 'Case Insensitive', desc: 'Ignore case' },
              { key: 'm', label: 'Multiline', desc: '^ and $ match line starts/ends' },
              { key: 's', label: 'Dot All', desc: '. matches newlines' },
              { key: 'u', label: 'Unicode', desc: 'Unicode support' },
              { key: 'y', label: 'Sticky', desc: 'Sticky matching' }
            ].map(({ key, label, desc }) => (
              <Button
                key={key}
                variant={flags.includes(key) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleFlag(key)}
                title={desc}
              >
                {key} - {label}
              </Button>
            ))}
          </div>

          {error && (
            <div className="text-red-500 text-sm font-mono bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test String Input */}
      <Card>
        <CardHeader>
          <CardTitle>Test String</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Enter text to test against the regex pattern..."
            className="code-editor min-h-[200px]"
          />
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Matches ({matches.length})</CardTitle>
            {matches.length > 0 && (
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={copyMatches}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={downloadMatches}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {matches.length === 0 ? (
            <div className="text-muted-foreground">
              {testString ? 'No matches found' : 'Enter a test string to see matches'}
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((match, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">Match {index + 1}</Badge>
                    <span className="text-sm text-muted-foreground">
                      Position: {match.index}
                    </span>
                  </div>
                  <div className="font-mono bg-muted p-2 rounded text-sm">
                    &ldquo;{match[0]}&rdquo;
                  </div>
                  {match.length > 1 && (
                    <div className="mt-2">
                      <div className="text-sm font-semibold mb-1">Groups:</div>
                      <div className="grid gap-1">
                        {match.slice(1).map((group, groupIndex) => (
                          <div key={groupIndex} className="text-sm">
                            <span className="font-mono">Group {groupIndex + 1}:</span> &ldquo;{group}&rdquo;
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Button
              variant="outline"
              className="justify-start text-left h-auto p-4"
              onClick={() => {
                setPattern('\\w+@\\w+\\.\\w+');
                setTestString('Contact us at support@example.com or admin@test.org');
              }}
            >
              <div>
                <div className="font-semibold">Email Addresses</div>
                <div className="text-sm text-muted-foreground">\w+@\w+\.\w+</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start text-left h-auto p-4"
              onClick={() => {
                setPattern('\\d{3}-\\d{3}-\\d{4}');
                setTestString('Call me at 555-123-4567 or 999-888-7777');
              }}
            >
              <div>
                <div className="font-semibold">Phone Numbers</div>
                <div className="text-sm text-muted-foreground">\d{3}-\d{3}-\d{4}</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start text-left h-auto p-4"
              onClick={() => {
                setPattern('https?://\\S+');
                setTestString('Visit https://example.com and http://test.org for more info');
              }}
            >
              <div>
                <div className="font-semibold">URLs</div>
                <div className="text-sm text-muted-foreground">https?://\S+</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start text-left h-auto p-4"
              onClick={() => {
                setPattern('#[0-9a-fA-F]{6}');
                setTestString('Colors: #FF0000, #00FF00, #0000FF, #invalid');
              }}
            >
              <div>
                <div className="font-semibold">Hex Colors</div>
                <div className="text-sm text-muted-foreground">#[0-9a-fA-F]{6}</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start text-left h-auto p-4"
              onClick={() => {
                setPattern('\\b\\d{4}-\\d{2}-\\d{2}\\b');
                setTestString('Dates: 2023-12-25, 2024-01-01, invalid-date');
              }}
            >
              <div>
                <div className="font-semibold">ISO Dates</div>
                <div className="text-sm text-muted-foreground">\b\d{4}-\d{2}-\d{2}\b</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start text-left h-auto p-4"
              onClick={() => {
                setPattern('\\b\\w+\\b');
                setTestString('Hello world! This is a test.');
              }}
            >
              <div>
                <div className="font-semibold">Words</div>
                <div className="text-sm text-muted-foreground">\b\w+\b</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Help */}
      <Card>
        <CardHeader>
          <CardTitle>Regex Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">Common Patterns</h4>
              <div className="space-y-1 text-sm">
                <div><code>\d</code> - Digit (0-9)</div>
                <div><code>\w</code> - Word character (a-z, A-Z, 0-9, _)</div>
                <div><code>\s</code> - Whitespace</div>
                <div><code>.</code> - Any character</div>
                <div><code>\b</code> - Word boundary</div>
                <div><code>^</code> - Start of string/line</div>
                <div><code>$</code> - End of string/line</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Quantifiers</h4>
              <div className="space-y-1 text-sm">
                <div><code>*</code> - Zero or more</div>
                <div><code>+</code> - One or more</div>
                <div><code>?</code> - Zero or one</div>
                <div><code>{'{n}'}</code> - Exactly n times</div>
                <div><code>{'{n,}'}</code> - n or more times</div>
                <div><code>{'{n,m}'}</code> - Between n and m times</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}