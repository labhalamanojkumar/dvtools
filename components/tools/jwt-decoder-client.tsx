'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { copyToClipboard, downloadFile } from '../../lib/utils';
import { useToast } from '../ui/toaster';
import { Copy, Download, Clock, CheckCircle, XCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

export function JwtDecoderClient() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const { toast } = useToast();

  const decodeJwt = () => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      const decodedHeader = JSON.parse(atob(parts[0]));
      const decodedPayload = JSON.parse(atob(parts[1]));

      setHeader(JSON.stringify(decodedHeader, null, 2));
      setPayload(JSON.stringify(decodedPayload, null, 2));

      // Check expiration
      if (decodedPayload.exp) {
        const expiryDate = new Date(decodedPayload.exp * 1000);
        setIsExpired(expiryDate < new Date());
      }

      toast({ title: 'Success', description: 'JWT decoded successfully' });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Invalid JWT token',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-semibold">JWT Token</h3>
          <Textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your JWT token here..."
            className="code-editor min-h-[100px]"
          />
          <Button onClick={decodeJwt} className="mt-4">
            Decode JWT
          </Button>
        </CardContent>
      </Card>

      {header && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Header</h3>
              <pre className="code-editor overflow-auto">
                <code>{header}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Payload</h3>
                {isExpired ? (
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm">Expired</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm">Valid</span>
                  </div>
                )}
              </div>
              <pre className="code-editor overflow-auto">
                <code>{payload}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}