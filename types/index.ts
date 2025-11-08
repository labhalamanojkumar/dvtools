import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: string;
  category: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  status: "ACTIVE" | "SUSPENDED" | "BANNED";
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface ToolSession {
  id: string;
  userId?: string;
  toolType: string;
  duration?: number;
  success: boolean;
  createdAt: Date;
}

export interface AnalyticsData {
  totalUsers: number;
  totalSessions: number;
  activeToday: number;
  toolUsage: {
    toolType: string;
    _count: number;
  }[];
}

export interface SEOReport {
  id: string;
  page: string;
  title?: string;
  description?: string;
  impressions: number;
  clicks: number;
  ctr: number;
  avgPosition: number;
  performanceScore?: number;
  accessibilityScore?: number;
  seoScore?: number;
  reportDate: Date;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resource?: string;
  resourceId?: string;
  details?: any;
  ipAddress?: string;
  createdAt: Date;
}

export interface DatabaseConfig {
  type: "postgresql" | "mysql";
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
}

// Binary Viewer & Hex Inspector
export interface HexViewerResult {
  lines: string[];
  asciiLines: string[];
  offsets: string[];
  totalBytes: number;
  displayedBytes: number;
  startOffset: number;
  endOffset: number;
  bytesPerLine: number;
}

export interface HexViewerConfig {
  bytesPerLine: number;
  showAscii: boolean;
  showLineNumbers: boolean;
  offsetFormat: "hex" | "decimal";
  startOffset: number;
  maxLines: number;
}

export interface HexViewerSearchResult {
  offset: number;
  length: number;
  context: number[];
  type: "hex" | "text";
}

// Compression Tools
export interface CompressionResult {
  algorithm: "gzip" | "brotli" | "zstd";
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  compressionTime: number;
  compressedData: Uint8Array;
}

export interface CompressionComparison {
  originalSize: number;
  results: CompressionResult[];
  bestAlgorithm: string;
  bestRatio: number;
}

// Serialization Converters
export interface SerializationResult {
  format: "protobuf" | "avro" | "msgpack";
  serializedData: Uint8Array;
  size: number;
  schema?: any;
  validationErrors?: string[];
}

export interface ProtobufConfig {
  protoDefinition: string;
  messageType: string;
}

export interface AvroConfig {
  schema: any;
  registryUrl?: string;
}

export interface MessagePackConfig {
  options?: {
    codec?: any;
  };
}

// CSV/TSV Encoder-Decoder
export interface CSVParseResult {
  data: any[];
  errors?: any[];
  meta?: any;
  rows: number;
  columns: number;
}

export interface CSVValidationResult {
  isValid: boolean;
  errors: {
    row: number;
    column: string;
    message: string;
  }[];
  dataTypes: Record<string, Set<string>>;
  totalRows: number;
  totalColumns: number;
}

export interface CSVTransformResult {
  originalRows: number;
  transformedRows: number;
  selectedColumns: string[] | null;
  appliedFilters: string[];
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
  data: any[];
}

// Character Encoding Converter
export interface EncodingDetectionResult {
  encoding: string;
  confidence: number;
  language?: string;
  anomalies: {
    position: number;
    character: string;
    issue: string;
  }[];
}

export interface EncodingConversionResult {
  originalEncoding: string;
  targetEncoding: string;
  originalData: Uint8Array;
  convertedData: Uint8Array;
  convertedText: string;
  byteChanges: number;
  characterChanges: number;
}

export interface EncodingConfig {
  sourceEncoding: string;
  targetEncoding: string;
  detectAutomatically: boolean;
  handleErrors: "strict" | "replace" | "ignore";
  replacementChar: string;
}

// License Types (Shared across tools)
export interface LicenseInfo {
  license?: string;
}

export interface LicenseIssue {
  package: string;
  license: string;
  compatibility: "compatible" | "incompatible" | "unknown";
  issues: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  parentId?: string;
  parent?: Category;
  children: Category[];
  posts: {
    category: Category;
  }[];
  _count: {
    posts: number;
  };
  sortOrder: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type PostType = 'BLOG' | 'NEWS' | 'UPDATE' | 'ANNOUNCEMENT' | 'TUTORIAL' | 'ARTICLE';

export interface PostComment {
  id: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  isApproved: boolean;
  parentId?: string;
  parent?: PostComment;
  replies: PostComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  markdownContent?: string;
  type: PostType;
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImage?: string;
  authorId: string;
  author: {
    id: string;
    name?: string;
    email: string;
    image?: string;
  };
  publishedAt?: Date;
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  likes: number;
  shares: number;
  featured: boolean;
  isPinned: boolean;
  allowComments: boolean;
  categories: {
    category: {
      id: string;
      name: string;
      slug: string;
      description?: string;
      color?: string;
      icon?: string;
    };
  }[];
  tags: {
    tag: {
      id: string;
      name: string;
      slug: string;
      description?: string;
      color?: string;
    };
  }[];
  comments: PostComment[];
}
