'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Copy,
  Clock,
  Globe,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useToast } from '@/components/ui/toaster';
import { format, parseISO, addHours } from 'date-fns';

const TIMEZONES = [
  { name: 'UTC', offset: 0 },
  { name: 'EST (New York)', offset: -5 },
  { name: 'PST (Los Angeles)', offset: -8 },
  { name: 'GMT (London)', offset: 0 },
  { name: 'CET (Paris)', offset: 1 },
  { name: 'IST (India)', offset: 5.5 },
  { name: 'JST (Tokyo)', offset: 9 },
  { name: 'AEST (Sydney)', offset: 10 },
];

export default function DateTimezoneToolClient() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 16));
  const [fromTimezone, setFromTimezone] = useState('0');
  const [toTimezone, setToTimezone] = useState('0');
  const [convertedTime, setConvertedTime] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const { toast } = useToast();

  const handleConvert = () => {
    try {
      const date = parseISO(selectedDate);
      const fromOffset = parseFloat(fromTimezone);
      const toOffset = parseFloat(toTimezone);
      const diff = toOffset - fromOffset;
      
      const converted = addHours(date, diff);
      setConvertedTime(format(converted, 'PPpp'));
      
      toast({
        title: 'Converted',
        description: 'Time converted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to convert time',
        variant: 'destructive',
      });
    }
  };

  const handleTimestampConvert = () => {
    try {
      const ts = parseInt(timestamp);
      const date = new Date(ts * 1000);
      setConvertedTime(format(date, 'PPpp'));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid timestamp',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Time copied to clipboard',
    });
  };

  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Date & Timezone Converter</h1>
          <p className="text-muted-foreground">
            Convert dates, times, and timestamps across timezones
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Clock className="mr-1 h-3 w-3" />
          Time Tools
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About This Tool</CardTitle>
          <CardDescription>
            Professional timezone converter and timestamp tool for developers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Convert dates and times between different timezones, work with Unix timestamps, and format dates for international applications. Essential for coordinating across global teams and handling time-sensitive data.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                Key Features
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Convert between timezones</li>
                <li>• Unix timestamp converter</li>
                <li>• Current time in multiple zones</li>
                <li>• Date format conversion</li>
                <li>• Copy results instantly</li>
                <li>• Support major timezones</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <Globe className="mr-2 h-4 w-4 text-primary" />
                Use Cases
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Schedule international meetings</li>
                <li>• Convert API timestamps</li>
                <li>• Debug time-related issues</li>
                <li>• Coordinate global teams</li>
                <li>• Handle user timezones</li>
                <li>• Parse log timestamps</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Convert Time</CardTitle>
          <CardDescription>Convert between timezones or work with timestamps</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="convert">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="convert">Timezone Converter</TabsTrigger>
              <TabsTrigger value="timestamp">Timestamp Converter</TabsTrigger>
            </TabsList>

            <TabsContent value="convert" className="space-y-4">
              <div className="space-y-2">
                <Label>Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From Timezone</Label>
                  <Select value={fromTimezone} onValueChange={setFromTimezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map(tz => (
                        <SelectItem key={tz.offset} value={tz.offset.toString()}>
                          {tz.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>To Timezone</Label>
                  <Select value={toTimezone} onValueChange={setToTimezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map(tz => (
                        <SelectItem key={tz.offset} value={tz.offset.toString()}>
                          {tz.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleConvert} className="w-full">
                <Clock className="mr-2 h-4 w-4" />
                Convert
              </Button>
            </TabsContent>

            <TabsContent value="timestamp" className="space-y-4">
              <div className="space-y-2">
                <Label>Unix Timestamp (seconds)</Label>
                <Input
                  type="number"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  placeholder="1234567890"
                />
              </div>

              <Button onClick={handleTimestampConvert} className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Convert Timestamp
              </Button>
            </TabsContent>
          </Tabs>

          {convertedTime && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Converted Time</p>
                  <p className="font-semibold">{convertedTime}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(convertedTime)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TIMEZONES.slice(0, 8).map((tz) => {
              const now = addHours(new Date(), tz.offset);
              return (
                <div key={tz.name} className="p-3 border rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">{tz.name}</p>
                  <p className="font-semibold">{format(now, 'HH:mm')}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
