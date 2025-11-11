'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Send,
  Plug,
  PlugZap,
  Trash2,
  Clock,
  Activity,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Copy,
  Download,
} from 'lucide-react';

interface Message {
  id: number;
  type: 'sent' | 'received' | 'system' | 'error';
  content: string;
  timestamp: Date;
}

export default function WebSocketTesterClient() {
  const [url, setUrl] = useState('wss://echo.websocket.org/');
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const messageIdCounter = useRef(0);

  const addMessage = (type: Message['type'], content: string) => {
    const newMessage: Message = {
      id: messageIdCounter.current++,
      type,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const connect = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus('connecting');
    setConnectionError(null);
    addMessage('system', `Connecting to ${url}...`);

    try {
      const websocket = new WebSocket(url);

      websocket.onopen = () => {
        setIsConnected(true);
        setConnectionStatus('connected');
        setConnectionError(null);
        addMessage('system', 'Connected successfully');
      };

      websocket.onmessage = (event) => {
        addMessage('received', event.data);
      };

      websocket.onerror = (error) => {
        setConnectionStatus('error');
        setConnectionError('WebSocket error occurred');
        addMessage('error', 'Connection error occurred');
      };

      websocket.onclose = () => {
        setIsConnected(false);
        setConnectionStatus('disconnected');
        addMessage('system', 'Connection closed');
        ws.current = null;
      };

      ws.current = websocket;
    } catch (error: any) {
      setConnectionStatus('error');
      setConnectionError(error.message);
      addMessage('error', `Failed to connect: ${error.message}`);
    }
  };

  const disconnect = () => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
      setIsConnected(false);
      setConnectionStatus('disconnected');
    }
  };

  const sendMessage = () => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      addMessage('error', 'Not connected to WebSocket server');
      return;
    }

    if (!message.trim()) {
      return;
    }

    try {
      ws.current.send(message);
      addMessage('sent', message);
      setMessage('');
    } catch (error: any) {
      addMessage('error', `Failed to send message: ${error.message}`);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    messageIdCounter.current = 0;
  };

  const downloadLog = () => {
    const log = messages
      .map((msg) => `[${msg.timestamp.toLocaleTimeString()}] [${msg.type.toUpperCase()}] ${msg.content}`)
      .join('\n');
    const blob = new Blob([log], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `websocket-log-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyLog = () => {
    const log = messages
      .map((msg) => `[${msg.timestamp.toLocaleTimeString()}] [${msg.type.toUpperCase()}] ${msg.content}`)
      .join('\n');
    navigator.clipboard.writeText(log);
  };

  useEffect(() => {
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return (
          <Badge variant="default" className="bg-green-500">
            <Activity className="mr-1 h-3 w-3" />
            Connected
          </Badge>
        );
      case 'connecting':
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3 animate-spin" />
            Connecting...
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Error
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertCircle className="mr-1 h-3 w-3" />
            Disconnected
          </Badge>
        );
    }
  };

  const getMessageIcon = (type: Message['type']) => {
    switch (type) {
      case 'sent':
        return <Send className="h-4 w-4 text-blue-500" />;
      case 'received':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'system':
        return <Activity className="h-4 w-4 text-gray-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">WebSocket Tester</h1>
          <p className="text-muted-foreground">
            Test WebSocket connections and monitor real-time messages
          </p>
        </div>
        {getStatusBadge()}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About This Tool</CardTitle>
          <CardDescription>
            Professional WebSocket tester for real-time connection debugging and monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Connect to WebSocket servers, send and receive messages, and monitor connection status in real-time. Perfect for testing WebSocket APIs, debugging real-time applications, chat systems, and live notification services.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                Key Features
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Connect to any WebSocket server (wss://, ws://)</li>
                <li>• Send and receive messages in real-time</li>
                <li>• Live connection status monitoring</li>
                <li>• Message history with timestamps</li>
                <li>• Download conversation logs</li>
                <li>• Color-coded message types</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <Activity className="mr-2 h-4 w-4 text-primary" />
                Use Cases
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Test WebSocket API endpoints</li>
                <li>• Debug real-time applications</li>
                <li>• Monitor WebSocket connections</li>
                <li>• Validate message formats</li>
                <li>• Test chat applications</li>
                <li>• Verify Socket.IO endpoints</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connection</CardTitle>
          <CardDescription>
            Enter WebSocket URL and establish connection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="wss://echo.websocket.org/"
              disabled={isConnected}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isConnected) {
                  connect();
                }
              }}
            />
            {isConnected ? (
              <Button onClick={disconnect} variant="destructive">
                <PlugZap className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
            ) : (
              <Button onClick={connect} disabled={connectionStatus === 'connecting'}>
                <Plug className="mr-2 h-4 w-4" />
                Connect
              </Button>
            )}
          </div>

          {connectionError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{connectionError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Send and receive WebSocket messages</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyLog} disabled={messages.length === 0}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Log
              </Button>
              <Button variant="outline" size="sm" onClick={downloadLog} disabled={messages.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="destructive" size="sm" onClick={clearMessages} disabled={messages.length === 0}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="messages">
            <TabsList>
              <TabsTrigger value="messages">Message Log</TabsTrigger>
              <TabsTrigger value="send">Send Message</TabsTrigger>
            </TabsList>

            <TabsContent value="messages" className="mt-4">
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No messages yet. Connect to a WebSocket server to start.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-2 p-2 rounded ${
                          msg.type === 'error'
                            ? 'bg-red-50 dark:bg-red-950'
                            : msg.type === 'system'
                            ? 'bg-gray-50 dark:bg-gray-900'
                            : msg.type === 'sent'
                            ? 'bg-blue-50 dark:bg-blue-950'
                            : 'bg-green-50 dark:bg-green-950'
                        }`}
                      >
                        {getMessageIcon(msg.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium capitalize">{msg.type}</span>
                            <span className="text-xs text-muted-foreground">
                              {msg.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="text-sm break-all font-mono">{msg.content}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="send" className="mt-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Message Content</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter message to send..."
                  className="min-h-[200px] font-mono text-sm"
                  disabled={!isConnected}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey && isConnected) {
                      sendMessage();
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Press Ctrl+Enter to send message quickly
                </p>
              </div>
              <Button onClick={sendMessage} disabled={!isConnected || !message.trim()} className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Test URLs</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          <div className="flex items-center justify-between p-2 border rounded">
            <div>
              <p className="font-medium text-sm">Echo Server</p>
              <code className="text-xs text-muted-foreground">wss://echo.websocket.org/</code>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUrl('wss://echo.websocket.org/')}
            >
              Use
            </Button>
          </div>
          <div className="flex items-center justify-between p-2 border rounded">
            <div>
              <p className="font-medium text-sm">WebSocket.org Echo</p>
              <code className="text-xs text-muted-foreground">wss://ws.postman-echo.com/raw</code>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUrl('wss://ws.postman-echo.com/raw')}
            >
              Use
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
