'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  Download,
  Copy,
  Palette,
  Zap,
  Heart,
  Star,
  Grid3X3,
  List,
  Filter,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

interface IconData {
  id: string;
  name: string;
  category: string;
  tags: string[];
  svg: string;
  viewBox: string;
  downloads: number;
  likes: number;
  isPremium: boolean;
}

interface IllustrationData {
  id: string;
  name: string;
  category: string;
  tags: string[];
  svg: string;
  viewBox: string;
  style: 'outline' | 'filled' | 'duotone';
  downloads: number;
  likes: number;
  isPremium: boolean;
}

const ICON_CATEGORIES = [
  'all', 'ui', 'arrows', 'social', 'commerce', 'media', 'navigation',
  'communication', 'weather', 'time', 'health', 'food', 'transportation'
];

const ILLUSTRATION_STYLES = ['outline', 'filled', 'duotone'];

export default function IconLibraryClient() {
  const [activeTab, setActiveTab] = useState<'icons' | 'illustrations'>('icons');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [iconSize, setIconSize] = useState(24);
  const [iconColor, setIconColor] = useState('#000000');
  const [showGrid, setShowGrid] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [downloaded, setDownloaded] = useState<Set<string>>(new Set());
  const [icons, setIcons] = useState<IconData[]>([]);
  const [illustrations, setIllustrations] = useState<IllustrationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();

  // Comprehensive icon data from popular libraries
  useEffect(() => {
    const comprehensiveIcons: IconData[] = [
      // Lucide Icons (UI/Navigation)
      {
        id: 'search',
        name: 'Search',
        category: 'ui',
        tags: ['search'],
        svg: '<path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>',
        viewBox: '0 0 24 24',
        downloads: 1250,
        likes: 89,
        isPremium: false,
      },
      {
        id: 'home',
        name: 'Home',
        category: 'ui',
        tags: ['home'],
        svg: '<path d="M3 12l2 2 4-4 4 4 4-4 4 4 2-2M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>',
        viewBox: '0 0 24 24',
        downloads: 2100,
        likes: 156,
        isPremium: false,
      },
      {
        id: 'user',
        name: 'User',
        category: 'ui',
        tags: ['user'],
        svg: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m8-10a4 4 0 100-8 4 4 0 000 8z"/>',
        viewBox: '0 0 24 24',
        downloads: 1800,
        likes: 134,
        isPremium: false,
      },
      {
        id: 'settings',
        name: 'Settings',
        category: 'ui',
        tags: ['settings'],
        svg: '<path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z M12 9a3 3 0 100 6 3 3 0 000-6z"/>',
        viewBox: '0 0 24 24',
        downloads: 1650,
        likes: 98,
        isPremium: false,
      },
      {
        id: 'heart',
        name: 'Heart',
        category: 'ui',
        tags: ['heart'],
        svg: '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>',
        viewBox: '0 0 24 24',
        downloads: 2100,
        likes: 156,
        isPremium: false,
      },
      {
        id: 'star',
        name: 'Star',
        category: 'ui',
        tags: ['star'],
        svg: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
        viewBox: '0 0 24 24',
        downloads: 1450,
        likes: 112,
        isPremium: false,
      },
      {
        id: 'menu',
        name: 'Menu',
        category: 'ui',
        tags: ['menu'],
        svg: '<path d="M3 12h18M3 6h18M3 18h18"/>',
        viewBox: '0 0 24 24',
        downloads: 980,
        likes: 67,
        isPremium: false,
      },
      {
        id: 'close',
        name: 'Close',
        category: 'ui',
        tags: ['close'],
        svg: '<path d="M18 6L6 18M6 6l12 12"/>',
        viewBox: '0 0 24 24',
        downloads: 1200,
        likes: 89,
        isPremium: false,
      },
      {
        id: 'plus',
        name: 'Plus',
        category: 'ui',
        tags: ['plus'],
        svg: '<path d="M12 5v14M5 12h14"/>',
        viewBox: '0 0 24 24',
        downloads: 1350,
        likes: 94,
        isPremium: false,
      },
      {
        id: 'minus',
        name: 'Minus',
        category: 'ui',
        tags: ['minus'],
        svg: '<path d="M5 12h14"/>',
        viewBox: '0 0 24 24',
        downloads: 890,
        likes: 56,
        isPremium: false,
      },
      {
        id: 'check',
        name: 'Check',
        category: 'ui',
        tags: ['check'],
        svg: '<path d="M20 6L9 17l-5-5"/>',
        viewBox: '0 0 24 24',
        downloads: 1100,
        likes: 78,
        isPremium: false,
      },
      {
        id: 'chevron-down',
        name: 'Chevron down',
        category: 'ui',
        tags: ['chevron-down'],
        svg: '<path d="M6 9l6 6 6-6"/>',
        viewBox: '0 0 24 24',
        downloads: 950,
        likes: 45,
        isPremium: false,
      },
      {
        id: 'chevron-up',
        name: 'Chevron up',
        category: 'ui',
        tags: ['chevron-up'],
        svg: '<path d="M18 15l-6-6-6 6"/>',
        viewBox: '0 0 24 24',
        downloads: 920,
        likes: 43,
        isPremium: false,
      },
      {
        id: 'chevron-left',
        name: 'Chevron left',
        category: 'ui',
        tags: ['chevron-left'],
        svg: '<path d="M15 18l-6-6 6-6"/>',
        viewBox: '0 0 24 24',
        downloads: 880,
        likes: 41,
        isPremium: false,
      },
      {
        id: 'chevron-right',
        name: 'Chevron right',
        category: 'ui',
        tags: ['chevron-right'],
        svg: '<path d="M9 18l6-6-6-6"/>',
        viewBox: '0 0 24 24',
        downloads: 890,
        likes: 45,
        isPremium: false,
      },
      {
        id: 'arrow-right',
        name: 'Arrow right',
        category: 'ui',
        tags: ['arrow-right'],
        svg: '<path d="M5 12h14M12 5l7 7-7 7"/>',
        viewBox: '0 0 24 24',
        downloads: 890,
        likes: 45,
        isPremium: false,
      },
      {
        id: 'arrow-left',
        name: 'Arrow left',
        category: 'ui',
        tags: ['arrow-left'],
        svg: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
        viewBox: '0 0 24 24',
        downloads: 870,
        likes: 43,
        isPremium: false,
      },
      {
        id: 'arrow-up',
        name: 'Arrow up',
        category: 'ui',
        tags: ['arrow-up'],
        svg: '<path d="M12 19V5M5 12l7-7 7 7"/>',
        viewBox: '0 0 24 24',
        downloads: 850,
        likes: 41,
        isPremium: false,
      },
      {
        id: 'arrow-down',
        name: 'Arrow down',
        category: 'ui',
        tags: ['arrow-down'],
        svg: '<path d="M12 5v14M19 12l-7 7-7-7"/>',
        viewBox: '0 0 24 24',
        downloads: 860,
        likes: 42,
        isPremium: false,
      },
      // Social Media Icons
      {
        id: 'github',
        name: 'Github',
        category: 'ui',
        tags: ['github'],
        svg: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>',
        viewBox: '0 0 24 24',
        downloads: 3200,
        likes: 234,
        isPremium: false,
      },
      {
        id: 'twitter',
        name: 'Twitter',
        category: 'ui',
        tags: ['twitter'],
        svg: '<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>',
        viewBox: '0 0 24 24',
        downloads: 2800,
        likes: 198,
        isPremium: false,
      },
      {
        id: 'linkedin',
        name: 'Linkedin',
        category: 'ui',
        tags: ['linkedin'],
        svg: '<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 2a2 2 0 11-4 0 2 2 0 014 0z"/>',
        viewBox: '0 0 24 24',
        downloads: 2400,
        likes: 176,
        isPremium: false,
      },
      {
        id: 'facebook',
        name: 'Facebook',
        category: 'ui',
        tags: ['facebook'],
        svg: '<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>',
        viewBox: '0 0 24 24',
        downloads: 3500,
        likes: 267,
        isPremium: false,
      },
      {
        id: 'instagram',
        name: 'Instagram',
        category: 'ui',
        tags: ['instagram'],
        svg: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.332.014 7.052.072 3.197.225.225 3.197.072 7.052c-.062 1.28-.072 1.689-.072 4.948 0 3.259.01 3.668.072 4.948.153 3.855 3.125 6.827 7.08 6.98C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 3.855-.153 6.827-3.125 6.98-7.08.062-1.28.072-1.689.072-4.948 0-3.259-.01-3.668-.072-4.948C23.775 3.197 20.803.225 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>',
        viewBox: '0 0 24 24',
        downloads: 2900,
        likes: 203,
        isPremium: false,
      },
      {
        id: 'youtube',
        name: 'Youtube',
        category: 'ui',
        tags: ['youtube'],
        svg: '<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>',
        viewBox: '0 0 24 24',
        downloads: 2600,
        likes: 189,
        isPremium: false,
      },
      // Media Icons
      {
        id: 'play',
        name: 'Play',
        category: 'ui',
        tags: ['play'],
        svg: '<path d="M8 5v14l11-7z"/>',
        viewBox: '0 0 24 24',
        downloads: 1400,
        likes: 98,
        isPremium: false,
      },
      {
        id: 'pause',
        name: 'Pause',
        category: 'ui',
        tags: ['pause'],
        svg: '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>',
        viewBox: '0 0 24 24',
        downloads: 1200,
        likes: 87,
        isPremium: false,
      },
      {
        id: 'volume-up',
        name: 'Volume up',
        category: 'ui',
        tags: ['volume-up'],
        svg: '<path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>',
        viewBox: '0 0 24 24',
        downloads: 1100,
        likes: 76,
        isPremium: false,
      },
      {
        id: 'camera',
        name: 'Camera',
        category: 'ui',
        tags: ['camera'],
        svg: '<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z M12 13a3 3 0 100-6 3 3 0 000 6z"/>',
        viewBox: '0 0 24 24',
        downloads: 1300,
        likes: 92,
        isPremium: false,
      },
      {
        id: 'image',
        name: 'Image',
        category: 'ui',
        tags: ['image'],
        svg: '<path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>',
        viewBox: '0 0 24 24',
        downloads: 1500,
        likes: 105,
        isPremium: false,
      },
      {
        id: 'video',
        name: 'Video',
        category: 'ui',
        tags: ['video'],
        svg: '<path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>',
        viewBox: '0 0 24 24',
        downloads: 1250,
        likes: 89,
        isPremium: false,
      },
      // Commerce Icons
      {
        id: 'shopping-cart',
        name: 'Shopping cart',
        category: 'ui',
        tags: ['shopping-cart'],
        svg: '<path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 4m0 0l-1.5 9M7 13v4a2 2 0 002 2h6a2 2 0 002-2v-4M7 13l-1.5-9M7 13h10m0 0v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4"/>',
        viewBox: '0 0 24 24',
        downloads: 1600,
        likes: 118,
        isPremium: false,
      },
      {
        id: 'credit-card',
        name: 'Credit card',
        category: 'ui',
        tags: ['credit-card'],
        svg: '<path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2H3V4zM3 10h18v8a1 1 0 01-1 1H4a1 1 0 01-1-1v-8zM7 15h4M7 18h4"/>',
        viewBox: '0 0 24 24',
        downloads: 1400,
        likes: 97,
        isPremium: false,
      },
      {
        id: 'dollar-sign',
        name: 'Dollar sign',
        category: 'ui',
        tags: ['dollar-sign'],
        svg: '<path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>',
        viewBox: '0 0 24 24',
        downloads: 1200,
        likes: 83,
        isPremium: false,
      },
      // Weather Icons
      {
        id: 'sun',
        name: 'Sun',
        category: 'ui',
        tags: ['sun'],
        svg: '<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 6.34L4.93 4.93M19.07 19.07l1.41 1.41M12 17a5 5 0 100-10 5 5 0 000 10z"/>',
        viewBox: '0 0 24 24',
        downloads: 1100,
        likes: 76,
        isPremium: false,
      },
      {
        id: 'cloud',
        name: 'Cloud',
        category: 'ui',
        tags: ['cloud'],
        svg: '<path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>',
        viewBox: '0 0 24 24',
        downloads: 950,
        likes: 62,
        isPremium: false,
      },
      {
        id: 'rain',
        name: 'Rain',
        category: 'ui',
        tags: ['rain'],
        svg: '<path d="M16 18v-2M8 18v-2M12 18v-2M16 14v-2M8 14v-2M12 14v-2M16 10v-2M8 10v-2M12 10v-2"/>',
        viewBox: '0 0 24 24',
        downloads: 870,
        likes: 58,
        isPremium: false,
      },
      // Time Icons
      {
        id: 'clock',
        name: 'Clock',
        category: 'ui',
        tags: ['clock'],
        svg: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/>',
        viewBox: '0 0 24 24',
        downloads: 1300,
        likes: 91,
        isPremium: false,
      },
      {
        id: 'calendar',
        name: 'Calendar',
        category: 'ui',
        tags: ['calendar'],
        svg: '<path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>',
        viewBox: '0 0 24 24',
        downloads: 1450,
        likes: 102,
        isPremium: false,
      },
      // Health Icons
      {
        id: 'heart-pulse',
        name: 'Heart pulse',
        category: 'ui',
        tags: ['heart-pulse'],
        svg: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
        viewBox: '0 0 24 24',
        downloads: 1200,
        likes: 85,
        isPremium: false,
      },
      {
        id: 'stethoscope',
        name: 'Stethoscope',
        category: 'ui',
        tags: ['stethoscope'],
        svg: '<path d="M4.8 2.3A.3.3 0 105 2h4a.3.3 0 00.3-.3l-1-3a.3.3 0 00-.6 0l-1 3zM7 2v2M12 2v2M21 15v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6M21 15l-3-8a2 2 0 00-2-1.5l-4 .5a2 2 0 01-2-2l.5-4a2 2 0 00-1.5-2L7 2M21 15H3"/>',
        viewBox: '0 0 24 24',
        downloads: 900,
        likes: 63,
        isPremium: false,
      },
      // Food Icons
      {
        id: 'coffee',
        name: 'Coffee',
        category: 'ui',
        tags: ['coffee'],
        svg: '<path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/>',
        viewBox: '0 0 24 24',
        downloads: 1100,
        likes: 78,
        isPremium: false,
      },
      {
        id: 'pizza',
        name: 'Pizza',
        category: 'ui',
        tags: ['pizza'],
        svg: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/>',
        viewBox: '0 0 24 24',
        downloads: 1050,
        likes: 72,
        isPremium: false,
      },
      // Transportation Icons
      {
        id: 'car',
        name: 'Car',
        category: 'ui',
        tags: ['car'],
        svg: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-.3-2.2 0C11.7 10.3 11 11.1 11 12v3c0 .6.4 1 1 1h2M2 5h2l2 12h16M7 5l1 7h8"/>',
        viewBox: '0 0 24 24',
        downloads: 1250,
        likes: 89,
        isPremium: false,
      },
      {
        id: 'plane',
        name: 'Plane',
        category: 'ui',
        tags: ['plane'],
        svg: '<path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16z"/>',
        viewBox: '0 0 24 24',
        downloads: 1150,
        likes: 81,
        isPremium: false,
      },
      // Communication Icons
      {
        id: 'mail',
        name: 'Mail',
        category: 'ui',
        tags: ['mail'],
        svg: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6"/>',
        viewBox: '0 0 24 24',
        downloads: 1400,
        likes: 96,
        isPremium: false,
      },
      {
        id: 'phone',
        name: 'Phone',
        category: 'ui',
        tags: ['phone'],
        svg: '<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>',
        viewBox: '0 0 24 24',
        downloads: 1300,
        likes: 91,
        isPremium: false,
      },
      {
        id: 'message-circle',
        name: 'Message circle',
        category: 'ui',
        tags: ['message-circle'],
        svg: '<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>',
        viewBox: '0 0 24 24',
        downloads: 1200,
        likes: 84,
        isPremium: false,
      },
      // Additional UI Icons
      {
        id: 'eye',
        name: 'Eye',
        category: 'ui',
        tags: ['eye'],
        svg: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z"/>',
        viewBox: '0 0 24 24',
        downloads: 1100,
        likes: 76,
        isPremium: false,
      },
      {
        id: 'eye-off',
        name: 'Eye off',
        category: 'ui',
        tags: ['eye-off'],
        svg: '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24m-3.06 3.06L3 3m3.06 3.06L3 21m18-18l-3.06 3.06"/>',
        viewBox: '0 0 24 24',
        downloads: 950,
        likes: 65,
        isPremium: false,
      },
      {
        id: 'trash',
        name: 'Trash',
        category: 'ui',
        tags: ['trash'],
        svg: '<path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>',
        viewBox: '0 0 24 24',
        downloads: 1200,
        likes: 83,
        isPremium: false,
      },
      {
        id: 'edit',
        name: 'Edit',
        category: 'ui',
        tags: ['edit'],
        svg: '<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>',
        viewBox: '0 0 24 24',
        downloads: 1350,
        likes: 94,
        isPremium: false,
      },
      {
        id: 'download',
        name: 'Download',
        category: 'ui',
        tags: ['download'],
        svg: '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
        viewBox: '0 0 24 24',
        downloads: 1250,
        likes: 89,
        isPremium: false,
      },
      {
        id: 'upload',
        name: 'Upload',
        category: 'ui',
        tags: ['upload'],
        svg: '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
        viewBox: '0 0 24 24',
        downloads: 1150,
        likes: 81,
        isPremium: false,
      },
      {
        id: 'share',
        name: 'Share',
        category: 'ui',
        tags: ['share'],
        svg: '<path d="M4 12a1 1 0 101 1h6a1 1 0 001-1V9a1 1 0 00-1-1H9a1 1 0 000-2h2a3 3 0 013 3v2a3 3 0 01-3 3H5a3 3 0 01-3-3V9a3 3 0 013-3h2a1 1 0 000 2H5a1 1 0 00-1 1v3zm10-1a1 1 0 00-1-1h-2a1 1 0 000 2h2a1 1 0 001-1zm-1 5a1 1 0 011 1v2a3 3 0 01-3 3H9a1 1 0 01-1-1v-2a1 1 0 011-1h2a1 1 0 001-1z"/>',
        viewBox: '0 0 24 24',
        downloads: 1100,
        likes: 76,
        isPremium: false,
      },
      {
        id: 'bookmark',
        name: 'Bookmark',
        category: 'ui',
        tags: ['bookmark'],
        svg: '<path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>',
        viewBox: '0 0 24 24',
        downloads: 1050,
        likes: 72,
        isPremium: false,
      },
      {
        id: 'flag',
        name: 'Flag',
        category: 'ui',
        tags: ['flag'],
        svg: '<path d="M4 21V3a1 1 0 011-1h10a1 1 0 011 1v18M4 12h16M4 7h16"/>',
        viewBox: '0 0 24 24',
        downloads: 950,
        likes: 65,
        isPremium: false,
      },
      {
        id: 'bell',
        name: 'Bell',
        category: 'ui',
        tags: ['bell'],
        svg: '<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>',
        viewBox: '0 0 24 24',
        downloads: 1200,
        likes: 84,
        isPremium: false,
      },
      {
        id: 'lock',
        name: 'Lock',
        category: 'ui',
        tags: ['lock'],
        svg: '<path d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-10V7a6 6 0 00-12 0v0a3 3 0 00-3 3v8a3 3 0 003 3h12a3 3 0 003-3v-8a3 3 0 00-3-3z"/>',
        viewBox: '0 0 24 24',
        downloads: 1300,
        likes: 91,
        isPremium: false,
      },
      {
        id: 'unlock',
        name: 'Unlock',
        category: 'ui',
        tags: ['unlock'],
        svg: '<path d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-10V7a6 6 0 00-12 0v0a3 3 0 00-3 3v8a3 3 0 003 3h12a3 3 0 003-3v-8a3 3 0 00-3-3z M9 7V7a3 3 0 016 0v0"/>',
        viewBox: '0 0 24 24',
        downloads: 1100,
        likes: 76,
        isPremium: false,
      },
      {
        id: 'globe',
        name: 'Globe',
        category: 'ui',
        tags: ['globe'],
        svg: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>',
        viewBox: '0 0 24 24',
        downloads: 1150,
        likes: 81,
        isPremium: false,
      },
      {
        id: 'map-pin',
        name: 'Map pin',
        category: 'ui',
        tags: ['map-pin'],
        svg: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 7a3 3 0 100 6 3 3 0 000-6z"/>',
        viewBox: '0 0 24 24',
        downloads: 1250,
        likes: 89,
        isPremium: false,
      },
      {
        id: 'zoom-in',
        name: 'Zoom in',
        category: 'ui',
        tags: ['zoom-in'],
        svg: '<path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z M10 7v4m0 0v4m0-4h4m-4 0H6"/>',
        viewBox: '0 0 24 24',
        downloads: 1050,
        likes: 72,
        isPremium: false,
      },
      {
        id: 'zoom-out',
        name: 'Zoom out',
        category: 'ui',
        tags: ['zoom-out'],
        svg: '<path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z M13 10H7"/>',
        viewBox: '0 0 24 24',
        downloads: 950,
        likes: 65,
        isPremium: false,
      },
      {
        id: 'filter',
        name: 'Filter',
        category: 'ui',
        tags: ['filter'],
        svg: '<path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>',
        viewBox: '0 0 24 24',
        downloads: 1100,
        likes: 76,
        isPremium: false,
      },
      {
        id: 'grid',
        name: 'Grid',
        category: 'ui',
        tags: ['grid'],
        svg: '<path d="M3 3h7v7H3V3z M14 3h7v7h-7V3z M14 14h7v7h-7v-7z M3 14h7v7H3v-7z"/>',
        viewBox: '0 0 24 24',
        downloads: 1050,
        likes: 72,
        isPremium: false,
      },
      {
        id: 'list',
        name: 'List',
        category: 'ui',
        tags: ['list'],
        svg: '<path d="M4 6h16M4 10h16M4 14h16M4 18h16"/>',
        viewBox: '0 0 24 24',
        downloads: 1000,
        likes: 68,
        isPremium: false,
      },
      {
        id: 'more-vertical',
        name: 'More vertical',
        category: 'ui',
        tags: ['more-vertical'],
        svg: '<path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>',
        viewBox: '0 0 24 24',
        downloads: 950,
        likes: 65,
        isPremium: false,
      },
      {
        id: 'more-horizontal',
        name: 'More horizontal',
        category: 'ui',
        tags: ['more-horizontal'],
        svg: '<path d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/>',
        viewBox: '0 0 24 24',
        downloads: 920,
        likes: 63,
        isPremium: false,
      },
    ];

    const comprehensiveIllustrations: IllustrationData[] = [
      {
        id: 'rocket-launch',
        name: 'Rocket Launch',
        category: 'technology',
        tags: ['rocket', 'launch', 'space', 'startup', 'growth'],
        svg: '<path d="<path d="<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/><path d="M12 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M8 12l2 2 4-4"/>"/>"/>',
        viewBox: '0 0 24 24',
        style: 'outline',
        downloads: 756,
        likes: 67,
        isPremium: true,
      },
      {
        id: 'team-collaboration',
        name: 'Team Collaboration',
        category: 'business',
        tags: ['team', 'collaboration', 'people', 'work', 'meeting'],
        svg: '<path d="<path d="<circle cx="12" cy="7" r="4"/><path d="M5.5 21v-2a4 4 0 0 1 4-4h5a4 4 0 0 1 4 4v2"/><circle cx="9" cy="7" r="2"/><circle cx="15" cy="7" r="2"/><path d="M9 12v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2"/><path d="M12 14v4"/><path d="M10 16h4"/>"/>"/>',
        viewBox: '0 0 24 24',
        style: 'filled',
        downloads: 1234,
        likes: 98,
        isPremium: false,
      },
      {
        id: 'data-analytics',
        name: 'Data Analytics',
        category: 'business',
        tags: ['data', 'analytics', 'chart', 'graph', 'statistics'],
        svg: '<path d="<path d="<path d="M3 3v18h18"/><path d="M7 12l4-4 4 4 4-8"/><circle cx="7" cy="12" r="1"/><circle cx="11" cy="8" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="19" cy="4" r="1"/>"/>"/>',
        viewBox: '0 0 24 24',
        style: 'outline',
        downloads: 892,
        likes: 74,
        isPremium: false,
      },
      {
        id: 'cloud-computing',
        name: 'Cloud Computing',
        category: 'technology',
        tags: ['cloud', 'computing', 'server', 'network', 'infrastructure'],
        svg: '<path d="<path d="<path d="M12 2C8.13 2 5 5.13 5 9c0 2.76 2.24 5 5 5h6c2.76 0 5-2.24 5-5 0-3.87-3.13-7-7-7z"/><path d="M12 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/><path d="M8 16c-1.1 0-2 .9-2 2v2h12v-2c0-1.1-.9-2-2-2H8z"/>"/>"/>',
        viewBox: '0 0 24 24',
        style: 'duotone',
        downloads: 654,
        likes: 52,
        isPremium: true,
      },
      {
        id: 'mobile-development',
        name: 'Mobile Development',
        category: 'technology',
        tags: ['mobile', 'development', 'phone', 'app', 'smartphone'],
        svg: '<path d="<path d="<rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><circle cx="12" cy="18" r="1"/><rect x="7" y="6" width="10" height="8" rx="1" ry="1"/><path d="M9 8h6M9 10h4M9 12h6"/>"/>"/>',
        viewBox: '0 0 24 24',
        style: 'outline',
        downloads: 743,
        likes: 61,
        isPremium: false,
      },
      {
        id: 'artificial-intelligence',
        name: 'Artificial Intelligence',
        category: 'technology',
        tags: ['ai', 'artificial intelligence', 'robot', 'machine learning', 'automation'],
        svg: '<path d="<path d="<circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/><path d="M12 6v6M9 9h6"/><circle cx="12" cy="12" r="1"/>"/>"/>',
        viewBox: '0 0 24 24',
        style: 'filled',
        downloads: 567,
        likes: 43,
        isPremium: true,
      },
      {
        id: 'customer-support',
        name: 'Customer Support',
        category: 'business',
        tags: ['support', 'customer', 'help', 'service', 'chat'],
        svg: '<path d="<path d="<circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/><circle cx="12" cy="12" r="1"/>"/>"/>',
        viewBox: '0 0 24 24',
        style: 'outline',
        downloads: 834,
        likes: 69,
        isPremium: false,
      },
      {
        id: 'online-shopping',
        name: 'Online Shopping',
        category: 'commerce',
        tags: ['shopping', 'ecommerce', 'cart', 'buy', 'online'],
        svg: '<path d=""/>',
        viewBox: '0 0 24 24',
        style: 'filled',
        downloads: 923,
        likes: 76,
        isPremium: false,
      },
      {
        id: 'remote-work',
        name: 'Remote Work',
        category: 'business',
        tags: ['remote', 'work', 'home office', 'laptop', 'flexible'],
        svg: '<path d="<path d="<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="M15 9h4M7 13h10"/><rect x="8" y="15" width="8" height="1"/>"/>"/>',
        viewBox: '0 0 24 24',
        style: 'outline',
        downloads: 678,
        likes: 54,
        isPremium: false,
      },
      {
        id: 'cyber-security',
        name: 'Cyber Security',
        category: 'technology',
        tags: ['security', 'cyber', 'protection', 'shield', 'safe'],
        svg: '<path d="<path d="<path d="M12 2l8 4v8c0 5.55-3.84 10.74-9 12-5.16-1.26-9-6.45-9-12V6l8-4z"/><path d="M12 8l4 4-4 4-4-4 4-4z"/>"/>"/>',
        viewBox: '0 0 24 24',
        style: 'duotone',
        downloads: 445,
        likes: 38,
        isPremium: true,
      },
      {
        id: 'sustainable-energy',
        name: 'Sustainable Energy',
        category: 'environment',
        tags: ['sustainable', 'energy', 'green', 'eco', 'renewable'],
        svg: '<path d="<path d="<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/><circle cx="12" cy="12" r="3"/><path d="M12 9v6M9 12h6"/>"/>"/>',
        viewBox: '0 0 24 24',
        style: 'outline',
        downloads: 567,
        likes: 45,
        isPremium: false,
      },
      {
        id: 'education-learning',
        name: 'Education & Learning',
        category: 'education',
        tags: ['education', 'learning', 'book', 'study', 'knowledge'],
        svg: '<path d="<path d="<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/><rect x="8" y="14" width="8" height="6" rx="1"/><path d="M10 16h4M10 18h4"/>"/>"/>',
        viewBox: '0 0 24 24',
        style: 'filled',
        downloads: 789,
        likes: 63,
        isPremium: false,
      },
      {
        id: 'healthcare-medical',
        name: 'Healthcare & Medical',
        category: 'health',
        tags: ['healthcare', 'medical', 'hospital', 'doctor', 'care'],
        svg: '<path d="<path d="<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/><path d="M12 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>"/>"/>',
        viewBox: '0 0 24 24',
        style: 'outline',
        downloads: 634,
        likes: 51,
        isPremium: false,
      },
      {
        id: 'finance-investment',
        name: 'Finance & Investment',
        category: 'finance',
        tags: ['finance', 'investment', 'money', 'growth', 'wealth'],
        svg: '<path d=""/>',
        viewBox: '0 0 24 24',
        style: 'duotone',
        downloads: 523,
        likes: 42,
        isPremium: true,
      },
      {
        id: 'travel-tourism',
        name: 'Travel & Tourism',
        category: 'travel',
        tags: ['travel', 'tourism', 'vacation', 'journey', 'adventure'],
        svg: '<path d="<path d="<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/><path d="M12 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>"/>"/>',
        viewBox: '0 0 24 24',
        style: 'outline',
        downloads: 712,
        likes: 58,
        isPremium: false,
      },
      {
        id: 'gaming-entertainment',
        name: 'Gaming & Entertainment',
        category: 'entertainment',
        tags: ['gaming', 'entertainment', 'game', 'fun', 'play'],
        svg: '<path d="<path d="<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="9" cy="12" r="2"/><circle cx="15" cy="12" r="2"/><path d="M8 16h8"/><circle cx="12" cy="18" r="1"/>"/>"/>',
        viewBox: '0 0 24 24',
        style: 'filled',
        downloads: 845,
        likes: 67,
        isPremium: false,
      },
      {
        id: 'social-networking',
        name: 'Social Networking',
        category: 'social',
        tags: ['social', 'networking', 'community', 'connection', 'friends'],
        svg: '<path d="<path d="<circle cx="12" cy="12" r="10"/><circle cx="9" cy="9" r="2"/><circle cx="15" cy="9" r="2"/><circle cx="12" cy="15" r="2"/><path d="M9 12l3 3 3-3"/>"/>"/>',
        viewBox: '0 0 24 24',
        style: 'outline',
        downloads: 756,
        likes: 62,
        isPremium: false,
      },
      {
        id: 'content-creation',
        name: 'Content Creation',
        category: 'creative',
        tags: ['content', 'creation', 'creative', 'design', 'art'],
        svg: '<path d="<path d="<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h10M7 12h10M7 17h7"/><circle cx="16" cy="17" r="2"/><path d="M14 17l2-2 2 2"/>"/>"/>',
        viewBox: '0 0 24 24',
        style: 'duotone',
        downloads: 634,
        likes: 51,
        isPremium: true,
      },
      {
        id: 'blockchain-crypto',
        name: 'Blockchain & Crypto',
        category: 'technology',
        tags: ['blockchain', 'crypto', 'bitcoin', 'digital currency', 'decentralized'],
        svg: '<path d="<path d="<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/><circle cx="12" cy="12" r="3"/><path d="M12 9v6M9 12h6"/>"/>"/>',
        viewBox: '0 0 24 24',
        style: 'outline',
        downloads: 423,
        likes: 35,
        isPremium: true,
      },
      {
        id: 'smart-home',
        name: 'Smart Home',
        category: 'technology',
        tags: ['smart home', 'iot', 'automation', 'connected', 'house'],
        svg: '<path d="<path d="<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/><circle cx="12" cy="16" r="1"/><path d="M8 16h8"/>"/>"/>',
        viewBox: '0 0 24 24',
        style: 'filled',
        downloads: 567,
        likes: 46,
        isPremium: false,
      },
      {
        id: 'virtual-reality',
        name: 'Virtual Reality',
        category: 'technology',
        tags: ['vr', 'virtual reality', 'metaverse', 'immersive', '3d'],
        svg: '<path d="<path d="<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/><circle cx="9" cy="10" r="1"/><circle cx="15" cy="10" r="1"/>"/>"/>',
        viewBox: '0 0 24 24',
        style: 'duotone',
        downloads: 345,
        likes: 28,
        isPremium: true,
      },
      {
        id: 'agile-development',
        name: 'Agile Development',
        category: 'technology',
        tags: ['agile', 'development', 'scrum', 'sprint', 'iteration'],
        svg: '<path d="<path d="<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h10M7 12h10M7 17h7"/><circle cx="16" cy="17" r="2"/><path d="M14 17l2-2 2 2"/><rect x="5" y="5" width="14" height="14" rx="1" fill="none"/>"/>"/>',
        viewBox: '0 0 24 24',
        style: 'outline',
        downloads: 456,
        likes: 37,
        isPremium: false,
      },
      {
        id: 'data-privacy',
        name: 'Data Privacy',
        category: 'technology',
        tags: ['privacy', 'data', 'security', 'gdpr', 'protection'],
        svg: '<path d="<path d="<path d="M12 2l8 4v8c0 5.55-3.84 10.74-9 12-5.16-1.26-9-6.45-9-12V6l8-4z"/><path d="M12 8l4 4-4 4-4-4 4-4z"/><circle cx="12" cy="12" r="1"/>"/>"/>',
        viewBox: '0 0 24 24',
        style: 'filled',
        downloads: 378,
        likes: 31,
        isPremium: true,
      },
    ];

    setIcons(comprehensiveIcons);
    setIllustrations(comprehensiveIllustrations);
    setIsLoading(false);
  }, []);

  const filteredIcons = useMemo(() => {
    return icons.filter(icon => {
      const matchesSearch = searchQuery === '' ||
        icon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        icon.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || icon.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [icons, searchQuery, selectedCategory]);

  const filteredIllustrations = useMemo(() => {
    return illustrations.filter(illustration => {
      const matchesSearch = searchQuery === '' ||
        illustration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        illustration.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStyle = selectedStyle === 'all' || illustration.style === selectedStyle;

      return matchesSearch && matchesStyle;
    });
  }, [illustrations, searchQuery, selectedStyle]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
        toast({
          title: "Removed from favorites",
          description: "Icon removed from your favorites",
        });
      } else {
        newFavorites.add(id);
        toast({
          title: "Added to favorites",
          description: "Icon added to your favorites",
        });
      }
      return newFavorites;
    });
  }, [toast]);

  const downloadIcon = useCallback((icon: IconData | IllustrationData, format: 'svg' | 'png' = 'svg') => {
    if (format === 'svg') {
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.viewBox}" width="${iconSize}" height="${iconSize}">
  <g fill="${iconColor}">
    ${icon.svg}
  </g>
</svg>`;

      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${icon.name.toLowerCase().replace(/\s+/g, '-')}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloaded(prev => new Set([...prev, icon.id]));
      toast({
        title: "Icon downloaded",
        description: "SVG file has been downloaded successfully",
      });
    }
  }, [iconSize, iconColor, toast]);

  const copyToClipboard = useCallback((icon: IconData | IllustrationData) => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.viewBox}" width="${iconSize}" height="${iconSize}">
  <g fill="${iconColor}">
    ${icon.svg}
  </g>
</svg>`;

    navigator.clipboard.writeText(svgContent).then(() => {
      setDownloaded(prev => new Set([...prev, icon.id]));
      toast({
        title: "Copied to clipboard",
        description: "SVG code copied successfully",
      });
    });
  }, [iconSize, iconColor, toast]);

  const renderIconGrid = (items: (IconData | IllustrationData)[], type: 'icon' | 'illustration') => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="w-full aspect-square bg-muted rounded" />
                <div className="h-3 bg-muted rounded mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className={`grid gap-4 ${showGrid ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6' : 'grid-cols-1'}`}>
        {items.map((item) => (
          <Card key={item.id} className="group hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="relative">
                <div
                  className="w-full aspect-square flex items-center justify-center bg-muted/50 rounded-lg mb-3 group-hover:bg-muted/70 transition-colors cursor-pointer"
                  style={{ color: iconColor }}
                  onClick={() => {
                    // Preview functionality - could open a modal or show larger preview
                    toast({
                      title: "Preview",
                      description: `Previewing ${item.name}`,
                    });
                  }}
                >
                  <svg
                    viewBox={item.viewBox}
                    className="w-8 h-8"
                    fill="currentColor"
                    dangerouslySetInnerHTML={{ __html: item.svg }}
                  />
                </div>

                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => toggleFavorite(item.id)}
                  >
                    <Heart
                      className={`w-3 h-3 ${favorites.has(item.id) ? 'fill-red-500 text-red-500' : ''}`}
                    />
                  </Button>
                </div>

                {item.isPremium && (
                  <Badge variant="secondary" className="absolute top-2 left-2 text-xs">
                    Pro
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-sm truncate">{item.name}</h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    {item.downloads}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {item.likes}
                  </span>
                </div>

                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-7 text-xs"
                    onClick={() => copyToClipboard(item)}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-7 text-xs"
                    onClick={() => downloadIcon(item)}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    SVG
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Icon & Illustration Library</h1>
        <p className="text-muted-foreground">
          Browse thousands of free SVG icons and illustrations for your projects
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'icons' | 'illustrations')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="icons">Icons</TabsTrigger>
          <TabsTrigger value="illustrations">Illustrations</TabsTrigger>
        </TabsList>

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Filters Sidebar */}
          <Card className="w-full lg:w-80 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search */}
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search icons..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category/Style Filter */}
              <div className="space-y-2">
                <Label>{activeTab === 'icons' ? 'Category' : 'Style'}</Label>
                <Select
                  value={activeTab === 'icons' ? selectedCategory : selectedStyle}
                  onValueChange={activeTab === 'icons' ? setSelectedCategory : setSelectedStyle}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {activeTab === 'icons' ? (
                      ICON_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))
                    ) : (
                      ['all', ...ILLUSTRATION_STYLES].map(style => (
                        <SelectItem key={style} value={style}>
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Size Control */}
              <div className="space-y-2">
                <Label>Size</Label>
                <Select value={iconSize.toString()} onValueChange={(value) => setIconSize(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16">16px</SelectItem>
                    <SelectItem value="20">20px</SelectItem>
                    <SelectItem value="24">24px</SelectItem>
                    <SelectItem value="32">32px</SelectItem>
                    <SelectItem value="48">48px</SelectItem>
                    <SelectItem value="64">64px</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Color Picker */}
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={iconColor}
                    onChange={(e) => setIconColor(e.target.value)}
                    className="w-8 h-8 rounded border cursor-pointer"
                  />
                  <Input
                    value={iconColor}
                    onChange={(e) => setIconColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* View Options */}
              <div className="space-y-3">
                <Label>View Options</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-grid"
                    checked={showGrid}
                    onCheckedChange={(checked) => setShowGrid(checked === true)}
                  />
                  <Label htmlFor="show-grid">Grid view</Label>
                </div>
              </div>

              <Separator />

              {/* Stats */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Total {activeTab}:</span>
                  <span>{activeTab === 'icons' ? icons.length : illustrations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Favorites:</span>
                  <span>{favorites.size}</span>
                </div>
                <div className="flex justify-between">
                  <span>Downloaded:</span>
                  <span>{downloaded.size}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold capitalize">
                  {activeTab} ({activeTab === 'icons' ? filteredIcons.length : filteredIllustrations.length})
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowGrid(!showGrid)}
                >
                  {showGrid ? <Grid3X3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {activeTab === 'icons' ? (
              renderIconGrid(filteredIcons, 'icon')
            ) : (
              renderIconGrid(filteredIllustrations, 'illustration')
            )}

            {(activeTab === 'icons' ? filteredIcons : filteredIllustrations).length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No {activeTab} found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
}