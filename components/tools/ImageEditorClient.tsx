"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  Download,
  Undo,
  Redo,
  Crop,
  Palette,
  Image as ImageIcon,
  Square,
  Circle,
  ArrowRight,
  Minus,
} from "lucide-react";
import { useToast } from "@/components/ui/toaster";

interface ImageState {
  image: HTMLImageElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  originalWidth: number;
  originalHeight: number;
  currentWidth: number;
  currentHeight: number;
  scale: number;
  rotation: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
  annotations: Annotation[];
  history: ImageData[];
  historyIndex: number;
  cropArea?: CropArea;
}

interface Point {
  x: number;
  y: number;
}

interface Annotation {
  id: string;
  type: 'text' | 'arrow' | 'rectangle' | 'circle' | 'line' | 'freehand';
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  color: string;
  strokeWidth: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold';
  italic?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  points?: Point[];
  visible: boolean;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  sepia: number;
  grayscale: number;
}

const tools = [
  { id: 'select', name: 'Select', icon: '👆' },
  { id: 'crop', name: 'Crop', icon: '✂️' },
  { id: 'text', name: 'Text', icon: '📝' },
  { id: 'draw', name: 'Draw', icon: '✏️' },
  { id: 'shapes', name: 'Shapes', icon: '⬜' },
  { id: 'filters', name: 'Filters', icon: '🎨' },
];

const shapeTools: Array<{ id: 'rectangle' | 'circle' | 'arrow' | 'line'; name: string; icon: any }> = [
  { id: 'rectangle', name: 'Rectangle', icon: Square },
  { id: 'circle', name: 'Circle', icon: Circle },
  { id: 'arrow', name: 'Arrow', icon: ArrowRight },
  { id: 'line', name: 'Line', icon: Minus },
];

const colors = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  '#FFC0CB', '#A52A2A', '#808080', '#000080', '#008000'
];

export default function ImageEditorClient() {
  const [imageState, setImageState] = useState<ImageState | null>(null);
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedShape, setSelectedShape] = useState<'rectangle' | 'circle' | 'arrow' | 'line'>('rectangle');
  const [selectedColor, setSelectedColor] = useState('#FF0000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontBold, setFontBold] = useState(false);
  const [fontItalic, setFontItalic] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [isDraggingHandle, setIsDraggingHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [cursor, setCursor] = useState('crosshair');
  const [isDrawing, setIsDrawing] = useState(false);
  const [filters, setFilters] = useState<FilterSettings>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 0,
    sepia: 0,
    grayscale: 0,
  });

  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [currentAnnotation, setCurrentAnnotation] = useState<Omit<Annotation, 'id'> | null>(null);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const inlineEditorRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Refs for synchronous drag state to avoid stale React state during continuous mousemove
  const draggingHandleRef = useRef<string | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const movingAnnotationRef = useRef<string | null>(null);
  const resizingAnnotationRef = useRef<string | null>(null);
  const resizeStartRef = useRef<{ x: number; y: number } | null>(null);
  // Store the initial crop area at the start of a drag (used for aspect-lock)
  const initialCropRef = useRef<CropArea | null>(null);
  // Toggle to true to enable crop debug logs in the browser console
  const DEBUG_CROP = false;
  const { toast } = useToast();

  const loadImage = useCallback(async (file: File) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }, []);

  function renderCanvas(state: ImageState) {
    const { ctx, canvas, image, scale, rotation, flipHorizontal, flipVertical, annotations, cropArea } = state;

    // Check if canvas has valid dimensions
    if (canvas.width === 0 || canvas.height === 0) {
      console.warn('Cannot render canvas with invalid dimensions');
      return;
    }

    try {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Save context
      ctx.save();

      // Apply transformations
      ctx.translate(canvas.width / 2, canvas.height / 2);
      if (rotation) ctx.rotate((rotation * Math.PI) / 180);
      if (flipHorizontal) ctx.scale(-1, 1);
      if (flipVertical) ctx.scale(1, -1);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      // Apply scale
      if (scale !== 1) {
        ctx.scale(scale, scale);
      }

      // Draw image
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Apply filters
      applyFilters(ctx, canvas, filters);

      // Restore context
      ctx.restore();

      // Update display canvas
      if (canvasRef.current) {
        const displayCtx = canvasRef.current.getContext('2d', { willReadFrequently: true });
        if (displayCtx) {
          canvasRef.current.width = canvas.width;
          canvasRef.current.height = canvas.height;
          displayCtx.drawImage(canvas, 0, 0);

          // Draw crop area overlay on display canvas immediately after image copy
          if (cropArea && selectedTool === 'crop') {
            displayCtx.strokeStyle = '#00FF00';
            displayCtx.lineWidth = 2;
            displayCtx.setLineDash([5, 5]);
            displayCtx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
            displayCtx.setLineDash([]);

            // Draw resize handles
            const handleSize = 8;
            displayCtx.fillStyle = '#00FF00';
            displayCtx.strokeStyle = '#FFFFFF';
            displayCtx.lineWidth = 1;

            // Corner handles
            const corners = [
              { x: cropArea.x, y: cropArea.y }, // top-left
              { x: cropArea.x + cropArea.width, y: cropArea.y }, // top-right
              { x: cropArea.x, y: cropArea.y + cropArea.height }, // bottom-left
              { x: cropArea.x + cropArea.width, y: cropArea.y + cropArea.height }, // bottom-right
            ];

            corners.forEach(corner => {
              displayCtx.fillRect(corner.x - handleSize/2, corner.y - handleSize/2, handleSize, handleSize);
              displayCtx.strokeRect(corner.x - handleSize/2, corner.y - handleSize/2, handleSize, handleSize);
            });

            // Edge handles (midpoints)
            const edges = [
              { x: cropArea.x + cropArea.width/2, y: cropArea.y }, // top
              { x: cropArea.x + cropArea.width, y: cropArea.y + cropArea.height/2 }, // right
              { x: cropArea.x + cropArea.width/2, y: cropArea.y + cropArea.height }, // bottom
              { x: cropArea.x, y: cropArea.y + cropArea.height/2 }, // left
            ];

            edges.forEach(edge => {
              displayCtx.fillRect(edge.x - handleSize/2, edge.y - handleSize/2, handleSize, handleSize);
              displayCtx.strokeRect(edge.x - handleSize/2, edge.y - handleSize/2, handleSize, handleSize);
            });
          }

          // Draw annotations on display canvas
          annotations.filter(ann => ann.visible).forEach(annotation => {
            drawAnnotation(displayCtx, annotation);

            // If this annotation is selected, draw a selection box/outline and a small drag handle
            try {
              if (selectedAnnotationId && annotation.id === selectedAnnotationId) {
                if (annotation.type === 'text') {
                  const bounds = getTextBounds(displayCtx, annotation);
                  displayCtx.save();
                  displayCtx.strokeStyle = '#FFD700';
                  displayCtx.lineWidth = 1.5;
                  displayCtx.setLineDash([4, 3]);
                  displayCtx.strokeRect(bounds.x - 4, bounds.y - 4, bounds.width + 8, bounds.height + 8);
                  displayCtx.restore();
                  // draw a small circular drag handle at top-left
                  displayCtx.beginPath();
                  displayCtx.fillStyle = '#FFD700';
                  displayCtx.strokeStyle = '#222';
                  const hx = bounds.x - 8;
                  const hy = bounds.y - 8;
                  displayCtx.arc(hx, hy, 6, 0, Math.PI * 2);
                  displayCtx.fill();
                  displayCtx.stroke();
                  // draw bottom-right resize handle when text box is present
                  const brx = (annotation.width && annotation.width > 0) ? (bounds.x + annotation.width) : (bounds.x + bounds.width);
                  const bry = bounds.y + (annotation.height || bounds.height);
                  displayCtx.save();
                  displayCtx.fillStyle = '#FFD700';
                  displayCtx.fillRect(brx - 6, bry - 6, 12, 12);
                  displayCtx.strokeStyle = '#222';
                  displayCtx.strokeRect(brx - 6, bry - 6, 12, 12);
                  displayCtx.restore();
                } else if (annotation.width && annotation.height) {
                  displayCtx.save();
                  displayCtx.strokeStyle = '#FFD700';
                  displayCtx.lineWidth = 1.5;
                  displayCtx.setLineDash([4, 3]);
                  displayCtx.strokeRect(annotation.x - 4, annotation.y - 4, (annotation.width || 0) + 8, (annotation.height || 0) + 8);
                  displayCtx.restore();
                }
              }
            } catch (e) {
              // ignore selection drawing errors
            }
          });
        }
      }
    } catch (error) {
      // If rendering fails, we silently fail and keep editor stable
    }
  }

  

  const initializeCanvas = useCallback((img: HTMLImageElement) => {
    // Validate image dimensions
    if (img.naturalWidth === 0 || img.naturalHeight === 0) {
      throw new Error('Invalid image dimensions');
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Canvas context not available');

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Validate canvas was created with correct dimensions
    if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
      throw new Error('Failed to set canvas dimensions');
    }

    const newState: ImageState = {
      image: img,
      canvas,
      ctx,
      originalWidth: img.naturalWidth,
      originalHeight: img.naturalHeight,
      currentWidth: img.naturalWidth,
      currentHeight: img.naturalHeight,
      scale: 1,
      rotation: 0,
      flipHorizontal: false,
      flipVertical: false,
      annotations: [],
      history: [],
      historyIndex: -1,
      cropArea: selectedTool === 'crop' ? {
        x: 0,
        y: 0,
        width: img.naturalWidth,
        height: img.naturalHeight
      } : undefined,
    };

    setImageState(newState);
    saveToHistory(newState);
    renderCanvas(newState);
  }, [selectedTool]);

  const saveToHistory = useCallback((state: ImageState) => {
    // Validate canvas before saving to history
    if (!state.canvas || state.canvas.width === 0 || state.canvas.height === 0) {
      console.warn('Cannot save invalid canvas state to history');
      return;
    }

    try {
      const imageData = state.ctx.getImageData(0, 0, state.canvas.width, state.canvas.height);
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(imageData);

      if (newHistory.length > 50) { // Limit history to 50 states
        newHistory.shift();
      }

      state.history = newHistory;
      state.historyIndex = newHistory.length - 1;
    } catch (error) {
      console.error('Failed to save canvas state to history:', error);
    }
  }, []);

  

  const applyFilters = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, filters: FilterSettings) => {
    // Check if canvas has valid dimensions
    if (canvas.width === 0 || canvas.height === 0) {
      return;
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Brightness
      r *= filters.brightness / 100;
      g *= filters.brightness / 100;
      b *= filters.brightness / 100;

      // Contrast
      const contrast = filters.contrast / 100;
      r = ((r - 128) * contrast) + 128;
      g = ((g - 128) * contrast) + 128;
      b = ((b - 128) * contrast) + 128;

      // Saturation
      const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
      r = gray + (r - gray) * (filters.saturation / 100);
      g = gray + (g - gray) * (filters.saturation / 100);
      b = gray + (b - gray) * (filters.saturation / 100);

      // Hue (simplified)
      if (filters.hue !== 0) {
        const hue = filters.hue * Math.PI / 180;
        const cos = Math.cos(hue);
        const sin = Math.sin(hue);
        const newR = r * (0.299 + 0.701 * cos + 0.168 * sin) +
                    g * (0.587 - 0.587 * cos + 0.330 * sin) +
                    b * (0.114 - 0.114 * cos - 0.497 * sin);
        const newG = r * (0.299 - 0.299 * cos - 0.328 * sin) +
                    g * (0.587 + 0.413 * cos + 0.035 * sin) +
                    b * (0.114 - 0.114 * cos + 0.292 * sin);
        const newB = r * (0.299 - 0.300 * cos + 1.250 * sin) +
                    g * (0.587 - 0.588 * cos - 1.050 * sin) +
                    b * (0.114 + 0.886 * cos - 0.203 * sin);
        r = newR;
        g = newG;
        b = newB;
      }

      // Grayscale
      if (filters.grayscale > 0) {
        const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
        r = r * (1 - filters.grayscale / 100) + gray * (filters.grayscale / 100);
        g = g * (1 - filters.grayscale / 100) + gray * (filters.grayscale / 100);
        b = b * (1 - filters.grayscale / 100) + gray * (filters.grayscale / 100);
      }

      // Sepia
      if (filters.sepia > 0) {
        const sepiaR = r * (1 - filters.sepia / 100) + (r * 0.393 + g * 0.769 + b * 0.189) * (filters.sepia / 100);
        const sepiaG = g * (1 - filters.sepia / 100) + (r * 0.349 + g * 0.686 + b * 0.168) * (filters.sepia / 100);
        const sepiaB = b * (1 - filters.sepia / 100) + (r * 0.272 + g * 0.534 + b * 0.131) * (filters.sepia / 100);
        r = sepiaR;
        g = sepiaG;
        b = sepiaB;
      }

      // Clamp values
      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, b));
    }

    ctx.putImageData(imageData, 0, 0);

    // Apply blur if needed
    if (filters.blur > 0) {
      ctx.filter = `blur(${filters.blur}px)`;
      ctx.drawImage(canvas, 0, 0);
      ctx.filter = 'none';
    }
  }, []);

  const getResizeHandleAt = useCallback((x: number, y: number, cropArea: CropArea): string | null => {
    if (!cropArea) return null;

    // increase handle hit area for easier interaction
    const handleSize = 12;
    const tolerance = handleSize / 2;

    // Check corners
    if (Math.abs(x - cropArea.x) <= tolerance && Math.abs(y - cropArea.y) <= tolerance) {
      return 'nw'; // northwest
    }
    if (Math.abs(x - (cropArea.x + cropArea.width)) <= tolerance && Math.abs(y - cropArea.y) <= tolerance) {
      return 'ne'; // northeast
    }
    if (Math.abs(x - cropArea.x) <= tolerance && Math.abs(y - (cropArea.y + cropArea.height)) <= tolerance) {
      return 'sw'; // southwest
    }
    if (Math.abs(x - (cropArea.x + cropArea.width)) <= tolerance && Math.abs(y - (cropArea.y + cropArea.height)) <= tolerance) {
      return 'se'; // southeast
    }

    // Check edges
    if (Math.abs(x - (cropArea.x + cropArea.width/2)) <= tolerance && Math.abs(y - cropArea.y) <= tolerance) {
      return 'n'; // north
    }
    if (Math.abs(x - (cropArea.x + cropArea.width)) <= tolerance && Math.abs(y - (cropArea.y + cropArea.height/2)) <= tolerance) {
      return 'e'; // east
    }
    if (Math.abs(x - (cropArea.x + cropArea.width/2)) <= tolerance && Math.abs(y - (cropArea.y + cropArea.height)) <= tolerance) {
      return 's'; // south
    }
    if (Math.abs(x - cropArea.x) <= tolerance && Math.abs(y - (cropArea.y + cropArea.height/2)) <= tolerance) {
      return 'w'; // west
    }

    return null;
  }, []);

  const drawAnnotation = useCallback((ctx: CanvasRenderingContext2D, annotation: Annotation) => {
    ctx.strokeStyle = annotation.color;
    ctx.fillStyle = annotation.color;
    ctx.lineWidth = annotation.strokeWidth;

    switch (annotation.type) {
      case 'text':
        if (annotation.text) {
          const fontParts = [];
          if (annotation.italic) fontParts.push('italic');
          fontParts.push(`${annotation.fontWeight === 'bold' ? 'bold' : 'normal'}`);
          fontParts.push(`${annotation.fontSize || 16}px`);
          fontParts.push(annotation.fontFamily || 'Arial');
          ctx.font = fontParts.join(' ');
          // handle alignment and wrapping
          const align = annotation.textAlign || 'left';
          ctx.textAlign = align as CanvasTextAlign;
          const x = annotation.x;
          const y = annotation.y;
          if (annotation.width && annotation.width > 0) {
            // wrap text inside width
            wrapText(ctx, annotation.text, x, y, annotation.width, (annotation.fontSize || 16) * 1.2, align);
          } else {
            ctx.fillText(annotation.text, x, y);
          }
        }
        break;
      case 'rectangle':
        if (annotation.width && annotation.height) {
          ctx.strokeRect(annotation.x, annotation.y, annotation.width, annotation.height);
        }
        break;
      case 'circle':
        if (annotation.width) {
          const radius = annotation.width / 2;
          ctx.beginPath();
          ctx.arc(annotation.x + radius, annotation.y + radius, radius, 0, 2 * Math.PI);
          ctx.stroke();
        }
        break;
      case 'line':
        if (annotation.width) {
          ctx.beginPath();
          ctx.moveTo(annotation.x, annotation.y);
          ctx.lineTo(annotation.x + annotation.width, annotation.y);
          ctx.stroke();
        }
        break;
      case 'arrow':
        if (annotation.width) {
          // Draw line
          ctx.beginPath();
          ctx.moveTo(annotation.x, annotation.y);
          ctx.lineTo(annotation.x + annotation.width, annotation.y);
          ctx.stroke();

          // Draw arrowhead
          const headLength = 10;
          const angle = Math.atan2(0, annotation.width);
          ctx.beginPath();
          ctx.moveTo(annotation.x + annotation.width, annotation.y);
          ctx.lineTo(annotation.x + annotation.width - headLength * Math.cos(angle - Math.PI / 6),
                    annotation.y - headLength * Math.sin(angle - Math.PI / 6));
          ctx.moveTo(annotation.x + annotation.width, annotation.y);
          ctx.lineTo(annotation.x + annotation.width - headLength * Math.cos(angle + Math.PI / 6),
                    annotation.y - headLength * Math.sin(angle + Math.PI / 6));
          ctx.stroke();
        }
        break;
      case 'freehand':
        if (annotation.points && annotation.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(annotation.points[0].x, annotation.points[0].y);
          for (let i = 1; i < annotation.points.length; i++) {
            ctx.lineTo(annotation.points[i].x, annotation.points[i].y);
          }
          ctx.stroke();
        }
        break;
    }
  }, []);

  // Simple text wrapper for canvas
  const wrapText = useCallback((ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, align: string = 'left') => {
    const words = text.split(' ');
    let line = '';
    let cursorY = y;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        // draw the line
        let drawX = x;
        if (align === 'center') drawX = x + maxWidth / 2;
        if (align === 'right') drawX = x + maxWidth;
        ctx.fillText(line.trim(), drawX, cursorY);
        line = words[n] + ' ';
        cursorY += lineHeight;
      } else {
        line = testLine;
      }
    }
    // draw last line
    if (line) {
      let drawX = x;
      if (align === 'center') drawX = x + maxWidth / 2;
      if (align === 'right') drawX = x + maxWidth;
      ctx.fillText(line.trim(), drawX, cursorY);
    }
  }, []);

  // Helper: get text bounds for an annotation using the provided ctx
  const getTextBounds = useCallback((ctx: CanvasRenderingContext2D, ann: Annotation) => {
    const fontSize = ann.fontSize || 16;
    ctx.save();
    ctx.font = `${fontSize}px Arial`;
    const metrics = ctx.measureText(ann.text || '');
    const width = metrics.width;
    const height = fontSize; // approximate using fontSize
    ctx.restore();
    // Text is drawn at (x, y) using baseline; we treat y as baseline
    return { x: ann.x, y: ann.y - height, width, height };
  }, []);

  const isPointInAnnotation = useCallback((x: number, y: number, ann: Annotation, ctx: CanvasRenderingContext2D) => {
    const padding = 8; // increase hit area for easier selection
    if (ann.type === 'text' && ann.text) {
      const b = getTextBounds(ctx, ann);
      // consider width-wrapped boxes too
      if (ann.width && ann.width > 0) {
        return x >= (b.x - padding) && x <= (b.x + ann.width + padding) && y >= (b.y - padding) && y <= (b.y + b.height * 3 + padding);
      }
      return x >= (b.x - padding) && x <= (b.x + b.width + padding) && y >= (b.y - padding) && y <= (b.y + b.height + padding);
    }
    // Fallback: basic rectangle hit for shapes
    if ((ann.type === 'rectangle' || ann.type === 'circle' || ann.type === 'line' || ann.type === 'arrow') && ann.width && ann.height) {
      return x >= ann.x && x <= ann.x + (ann.width || 0) && y >= ann.y && y <= ann.y + (ann.height || 0);
    }
    return false;
  }, [getTextBounds]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const img = await loadImage(file);
      initializeCanvas(img);
      toast({
        title: "Image loaded",
        description: `Successfully loaded ${file.name}`,
      });
    } catch (error) {
      toast({
        title: "Error loading image",
        description: "Failed to load the selected image",
        variant: "destructive",
      });
    }
  }, [loadImage, initializeCanvas, toast]);

  const handleCanvasMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!imageState || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    // Prefer the display canvas backing size for accurate mapping (handles DPR)
    const backingWidth = canvasRef.current.width || imageState.canvas.width;
    const backingHeight = canvasRef.current.height || imageState.canvas.height;
    const scaleX = backingWidth / rect.width;
    const scaleY = backingHeight / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

  // mouse coordinates computed for debugging removed

    // Check for clicking on existing annotations when in select/text mode
    if ((selectedTool === 'select' || selectedTool === 'text') && imageState.annotations && imageState.annotations.length) {
      try {
        const ctxForHit = imageState.ctx;
        for (let i = imageState.annotations.length - 1; i >= 0; i--) {
          const ann = imageState.annotations[i];
          // First check the small drag handle (top-left) for quick grabs
          if (ann.type === 'text') {
            const b = getTextBounds(ctxForHit, ann);
            const hx = b.x - 8;
            const hy = b.y - 8;
            const handleTolerance = 10;
            if (Math.abs(x - hx) <= handleTolerance && Math.abs(y - hy) <= handleTolerance) {
              setSelectedAnnotationId(ann.id);
              const { id, ...rest } = ann as any;
              setCurrentAnnotation({ ...(rest as Omit<Annotation, 'id'>) });
              setTextInput(ann.text || '');
              setShowTextInput(true);
              movingAnnotationRef.current = ann.id;
              dragStartRef.current = { x, y };
              setIsDrawing(true);
              return;
            }
          }

          if (isPointInAnnotation(x, y, ann, ctxForHit)) {
            // Select this annotation
            setSelectedAnnotationId(ann.id);
            // populate currentAnnotation (omit id)
            const { id, ...rest } = ann as any;
            setCurrentAnnotation({ ...(rest as Omit<Annotation, 'id'>) });
            setTextInput(ann.text || '');
            setShowTextInput(true);
            // Begin moving the annotation
            // If clicking near bottom-right of a selected annotation, start resizing instead
            const b = getTextBounds(ctxForHit, ann);
            const brx = (ann.width && ann.width > 0) ? (b.x + ann.width) : (b.x + b.width);
            const bry = b.y + (ann.height || b.height);
            const resizeTolerance = 12;
            if (Math.abs(x - brx) <= resizeTolerance && Math.abs(y - bry) <= resizeTolerance) {
              resizingAnnotationRef.current = ann.id;
              resizeStartRef.current = { x, y };
            } else {
              movingAnnotationRef.current = ann.id;
            }
            dragStartRef.current = { x, y };
            setIsDrawing(true);
            return;
          }
        }
      } catch (e) {
        // ignore hit-test failures
      }
    }

    setIsDrawing(true);

    if (selectedTool === 'crop' && imageState.cropArea) {
      // Check if clicking on a resize handle
      const handle = getResizeHandleAt(x, y, imageState.cropArea);
      if (handle) {
        setIsDraggingHandle(handle);
        setDragStart({ x, y });
        // Keep synchronous refs in sync so mousemove can read immediately
        draggingHandleRef.current = handle;
        dragStartRef.current = { x, y };
        // capture initial crop area for aspect-ratio/center modifiers
        initialCropRef.current = imageState.cropArea ? { ...imageState.cropArea } : { x, y, width: 0, height: 0 };
        return;
      }
    }

    switch (selectedTool) {
      case 'crop':
        // Starting new crop area
        setImageState(prev => prev ? {
          ...prev,
          cropArea: { x, y, width: 0, height: 0 }
        } : null);
        // also set drag start ref so drawing the crop uses synchronous coords
        dragStartRef.current = { x, y };
        // store starting area for modifier behavior
        initialCropRef.current = { x, y, width: 0, height: 0 };
        break;
      case 'text':
        setCurrentAnnotation({
          type: 'text',
          x,
          y,
          color: selectedColor,
          strokeWidth,
          fontSize,
          text: '',
          visible: true,
        });
        setShowTextInput(true);
        break;
      case 'draw':
        setCurrentAnnotation({
          type: 'freehand',
          x,
          y,
          color: selectedColor,
          strokeWidth,
          points: [{ x, y }],
          visible: true,
        });
        break;
      case 'shapes':
        setCurrentAnnotation({
          type: selectedShape as Annotation['type'],
          x,
          y,
          color: selectedColor,
          strokeWidth,
          visible: true,
        });
        break;
    }
  }, [imageState, selectedTool, selectedShape, selectedColor, strokeWidth, fontSize, getResizeHandleAt, isPointInAnnotation]);

  const handleCanvasMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!imageState || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const backingWidth = canvasRef.current.width || imageState.canvas.width;
    const backingHeight = canvasRef.current.height || imageState.canvas.height;
    const scaleX = backingWidth / rect.width;
    const scaleY = backingHeight / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    // Update cursor based on hover position
    if (selectedTool === 'crop' && imageState.cropArea) {
      const handle = getResizeHandleAt(x, y, imageState.cropArea);
      if (handle) {
        const cursorMap: { [key: string]: string } = {
          'nw': 'nw-resize',
          'ne': 'ne-resize',
          'sw': 'sw-resize',
          'se': 'se-resize',
          'n': 'n-resize',
          'e': 'e-resize',
          's': 's-resize',
          'w': 'w-resize',
        };
        setCursor(cursorMap[handle] || 'crosshair');
      } else {
        setCursor('crosshair');
      }
    } else {
      setCursor('crosshair');
    }

  // If nothing is drawing, nothing to do. However crop operations should
  // still be handled even when there's no currentAnnotation.
      if (!isDrawing) return;
      if (selectedTool !== 'crop' && !currentAnnotation && !movingAnnotationRef.current) return;

      // Handle moving an existing annotation (select tool or editing text)
      const movingId = movingAnnotationRef.current;
      if (movingId && imageState.annotations) {
        const start = dragStartRef.current ?? { x, y };
        const dx = x - start.x;
        const dy = y - start.y;

        setImageState(prev => {
          if (!prev) return prev;
          const updated = prev.annotations.map(a => a.id === movingId ? ({ ...a, x: (a.x || 0) + dx, y: (a.y || 0) + dy } as Annotation) : a);
          const newState = { ...prev, annotations: updated } as ImageState;
          try {
            renderCanvas(newState);
          } catch (e) {
            // ignore
          }
          return newState;
        });

        // Update drag start for continuous deltas
        dragStartRef.current = { x, y };
        return;
      }

      // Handle resizing of a selected annotation
      const resizingId = resizingAnnotationRef.current;
      if (resizingId && imageState.annotations) {
        const ann = imageState.annotations.find(a => a.id === resizingId);
        if (ann) {
          // compute new width/height relative to ann.x/ann.y
          const newWidth = Math.max(20, x - ann.x);
          const newHeight = Math.max((ann.fontSize || 16), y - ann.y + (ann.fontSize || 16));
          setImageState(prev => {
            if (!prev) return prev;
            const updated = prev.annotations.map(a => a.id === resizingId ? ({ ...a, width: newWidth, height: newHeight } as Annotation) : a);
            const newState = { ...prev, annotations: updated } as ImageState;
            try { renderCanvas(newState); } catch (e) { /* ignore */ }
            return newState;
          });
          // update resize start for continuous deltas
          resizeStartRef.current = { x, y };
          return;
        }
      }

    // Prefer synchronous refs to avoid stale state during fast mouse moves
    const activeHandle = draggingHandleRef.current ?? isDraggingHandle;
    const startPoint = dragStartRef.current ?? dragStart;

    // Handle crop area resizing using refs for immediate responsiveness
    if (selectedTool === 'crop' && activeHandle && imageState.cropArea && startPoint) {
      const deltaX = x - startPoint.x;
      const deltaY = y - startPoint.y;
      const newCropArea = { ...imageState.cropArea };

      switch (activeHandle) {
        case 'nw':
          newCropArea.x += deltaX;
          newCropArea.y += deltaY;
          newCropArea.width -= deltaX;
          newCropArea.height -= deltaY;
          break;
        case 'ne':
          newCropArea.y += deltaY;
          newCropArea.width += deltaX;
          newCropArea.height -= deltaY;
          break;
        case 'sw':
          newCropArea.x += deltaX;
          newCropArea.width -= deltaX;
          newCropArea.height += deltaY;
          break;
        case 'se':
          newCropArea.width += deltaX;
          newCropArea.height += deltaY;
          break;
        case 'n':
          newCropArea.y += deltaY;
          newCropArea.height -= deltaY;
          break;
        case 'e':
          newCropArea.width += deltaX;
          break;
        case 's':
          newCropArea.height += deltaY;
          break;
        case 'w':
          newCropArea.x += deltaX;
          newCropArea.width -= deltaX;
          break;
      }

      // Ensure minimum size
      if (newCropArea.width < 10) newCropArea.width = 10;
      if (newCropArea.height < 10) newCropArea.height = 10;

      // Ensure within bounds
      if (newCropArea.x < 0) {
        newCropArea.width += newCropArea.x;
        newCropArea.x = 0;
      }
      if (newCropArea.y < 0) {
        newCropArea.height += newCropArea.y;
        newCropArea.y = 0;
      }
      if (newCropArea.x + newCropArea.width > imageState.currentWidth) {
        newCropArea.width = imageState.currentWidth - newCropArea.x;
      }
      if (newCropArea.y + newCropArea.height > imageState.currentHeight) {
        newCropArea.height = imageState.currentHeight - newCropArea.y;
      }

      // Apply modifier keys
      const startCrop = initialCropRef.current;
      if (event.shiftKey) {
        // Constrain to square while dragging (common UX)
        const signW = Math.sign(newCropArea.width) || 1;
        const signH = Math.sign(newCropArea.height) || 1;
        const size = Math.max(Math.abs(newCropArea.width), Math.abs(newCropArea.height));
        newCropArea.width = size * signW;
        newCropArea.height = size * signH;

        // Adjust origin for corner handles so the handle being dragged moves
        if (startCrop) {
          if (activeHandle.includes('w')) {
            newCropArea.x = startCrop.x + (startCrop.width - newCropArea.width);
          }
          if (activeHandle.includes('n')) {
            newCropArea.y = startCrop.y + (startCrop.height - newCropArea.height);
          }
        }
      }

      if (event.altKey && !activeHandle) {
        // Alt while drawing (no active handle) - center the crop on the start point
        newCropArea.x = startPoint.x - newCropArea.width / 2;
        newCropArea.y = startPoint.y - newCropArea.height / 2;
      }

  if (DEBUG_CROP) console.debug('crop-drag', { activeHandle, startPoint, x, y, shift: event.shiftKey, alt: event.altKey, newCropArea });
  // Updated crop area during drag — update state and render overlay
  setImageState(prev => prev ? { ...prev, cropArea: newCropArea } : null);
      // Render immediately so the user sees the crop area move with the cursor
      try {
        const tempState = { ...imageState, cropArea: newCropArea } as ImageState;
        renderCanvas(tempState);
      } catch (e) {
        // ignore render errors during drag
      }
      // Continue handling; don't wait for mouse up
      return;
    }

    switch (selectedTool) {
      case 'crop':
        if (imageState.cropArea) {
          const width = x - imageState.cropArea.x;
          const height = y - imageState.cropArea.y;
          const updatedCropArea = { ...imageState.cropArea, width, height };
          // Apply modifier keys while drawing a new crop
          const startCrop = initialCropRef.current;
          if (event.shiftKey) {
            // Constrain to square while drawing
            const signW = Math.sign(updatedCropArea.width) || 1;
            const signH = Math.sign(updatedCropArea.height) || 1;
            const size = Math.max(Math.abs(updatedCropArea.width), Math.abs(updatedCropArea.height));
            updatedCropArea.width = size * signW;
            updatedCropArea.height = size * signH;
            if (startCrop) {
              // if drawing from a start point, adjust origin so the drag direction is preserved
              updatedCropArea.x = startCrop.x;
              updatedCropArea.y = startCrop.y;
            }
          }
          if (event.altKey) {
            // center from start point
            const sx = dragStartRef.current?.x ?? imageState.cropArea.x;
            const sy = dragStartRef.current?.y ?? imageState.cropArea.y;
            updatedCropArea.x = sx - updatedCropArea.width / 2;
            updatedCropArea.y = sy - updatedCropArea.height / 2;
          }
          setImageState(prev => prev ? {
            ...prev,
            cropArea: updatedCropArea
          } : null);

          if (DEBUG_CROP) console.debug('crop-draw', { start: dragStartRef.current, x, y, shift: event.shiftKey, alt: event.altKey, updatedCropArea });
          // Render live while drawing the new crop area so the overlay follows
          try {
            const tempState = { ...imageState, cropArea: updatedCropArea } as ImageState;
            renderCanvas(tempState);
          } catch (e) {
            // ignore render errors during drag
          }
        }
        break;
      case 'draw':
        if (currentAnnotation?.points) {
          currentAnnotation.points.push({ x, y });
        }
        break;
      case 'shapes':
        if (currentAnnotation) {
          const width = x - currentAnnotation.x!;
          const height = y - currentAnnotation.y!;
          setCurrentAnnotation(prev => prev ? {
            ...prev,
            width,
            height,
          } : null);
        }
        break;
    }

    // Don't render during mouse move - let mouse up handle it
  }, [isDrawing, imageState, currentAnnotation, selectedTool, isDraggingHandle, dragStart, getResizeHandleAt]);


  // Focus inline editor when a text annotation is selected
  useEffect(() => {
    if (selectedAnnotationId && inlineEditorRef.current) {
      try {
        inlineEditorRef.current.focus();
        // place caret at end
        const len = inlineEditorRef.current.value.length;
        inlineEditorRef.current.setSelectionRange(len, len);
      } catch (e) {
        // ignore focus errors
      }
    }
  }, [selectedAnnotationId]);
  

  const handleCanvasMouseUp = useCallback(() => {
    if (!isDrawing || !imageState) return;

    // Clear synchronous refs and React state for dragging
    draggingHandleRef.current = null;
    dragStartRef.current = null;
    initialCropRef.current = null;
    if (DEBUG_CROP) console.debug('crop-up');
    setIsDraggingHandle(null);
    setDragStart(null);

    setIsDrawing(false);

    // Don't add text annotations automatically - wait for user input
    // If we were moving an annotation, finalize move and save
    if (movingAnnotationRef.current) {
      movingAnnotationRef.current = null;
      try { saveToHistory(imageState); } catch (e) { /* ignore */ }
      renderCanvas(imageState);
      return;
    }

    if (resizingAnnotationRef.current) {
      resizingAnnotationRef.current = null;
      resizeStartRef.current = null;
      try { saveToHistory(imageState); } catch (e) { /* ignore */ }
      renderCanvas(imageState);
      return;
    }

    if (selectedTool === 'text' && !selectedAnnotationId) {
      // If in text tool and not editing an existing annotation, wait for user input
      return;
    }

    // If there's no current annotation (e.g., crop/draw finished), just save history
    if (!currentAnnotation) {
      try {
        saveToHistory(imageState);
      } catch (e) {
        // ignore
      }
      renderCanvas(imageState);
      return;
    }

    // Add annotation to state
    const annotation: Annotation = {
      id: Date.now().toString(),
      ...currentAnnotation,
    } as Annotation;

    if (selectedAnnotationId) {
      // Editing existing annotation: update by id
      setImageState(prev => {
        if (!prev) return prev;
        const updated = prev.annotations.map(a => a.id === selectedAnnotationId ? { ...a, ...annotation } : a);
        return { ...prev, annotations: updated } as ImageState;
      });
      setSelectedAnnotationId(null);
    } else {
      setImageState(prev => prev ? ({
        ...prev,
        annotations: [...prev.annotations, annotation],
      }) : null);
    }

    setCurrentAnnotation(null);
    saveToHistory(imageState);

    // Render the canvas after any state changes
    renderCanvas(imageState);
  }, [isDrawing, imageState, currentAnnotation, selectedTool, saveToHistory, selectedAnnotationId]);

  const applyCrop = useCallback(() => {
    if (!imageState?.cropArea || !imageState.canvas) return;

    const { cropArea } = imageState;
    const { x, y, width, height } = cropArea;

    // Validate crop area dimensions
    const absWidth = Math.abs(width);
    const absHeight = Math.abs(height);

    // Validate crop area dimensions - allow minimum 10px crops
    const minCropSize = 10;
    if (absWidth < minCropSize || absHeight < minCropSize) {
      toast({
        title: "Crop area too small",
        description: `Please select an area of at least ${minCropSize}×${minCropSize} pixels`,
        variant: "destructive",
      });
      return;
    }

    // Validate source canvas dimensions
    if (imageState.canvas.width === 0 || imageState.canvas.height === 0) {
      toast({
        title: "Canvas error",
        description: "Image canvas is not properly initialized",
        variant: "destructive",
      });
      return;
    }

    // Create new canvas with cropped dimensions
    const newCanvas = document.createElement('canvas');
    const newCtx = newCanvas.getContext('2d', { willReadFrequently: true });
    if (!newCtx) {
      toast({
        title: "Canvas error",
        description: "Failed to create canvas context",
        variant: "destructive",
      });
      return;
    }

    newCanvas.width = absWidth;
    newCanvas.height = absHeight;

    // Calculate source coordinates (handle negative dimensions)
    const sourceX = width < 0 ? x + width : x;
    const sourceY = height < 0 ? y + height : y;

    try {
      // Draw cropped area
      newCtx.drawImage(
        imageState.canvas,
        sourceX, sourceY, absWidth, absHeight,
        0, 0, absWidth, absHeight
      );

      const newState: ImageState = {
        ...imageState,
        canvas: newCanvas,
        ctx: newCtx,
        currentWidth: absWidth,
        currentHeight: absHeight,
        cropArea: undefined,
      };

      // Update state with the new cropped canvas and save to history
      setImageState(newState);
      try {
        saveToHistory(newState);
      } catch (err) {
        // continue even if history save fails
        console.warn('saveToHistory failed after crop:', err);
      }

      // Re-render with the new state
      renderCanvas(newState);

      toast({
        title: "Crop applied",
        description: `Image cropped to ${absWidth} × ${absHeight}`,
      });
    } catch (error) {
      console.error('applyCrop error:', error);
      toast({
        title: "Crop failed",
        description: "Failed to apply crop operation",
        variant: "destructive",
      });
    }
  }, [imageState, saveToHistory, toast]);

  const undo = useCallback(() => {
    if (!imageState || imageState.historyIndex <= 0) return;

    try {
      const previousState = imageState.history[imageState.historyIndex - 1];
      if (!previousState) return;

      // Create a temporary canvas to get the dimensions from the image data
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = previousState.width;
      tempCanvas.height = previousState.height;

      // Put the image data onto the temporary canvas
      const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
      if (!tempCtx) return;

      tempCtx.putImageData(previousState, 0, 0);

      // Update the main canvas with the restored state
      imageState.canvas.width = previousState.width;
      imageState.canvas.height = previousState.height;
      imageState.ctx.putImageData(previousState, 0, 0);

      setImageState(prev => prev ? {
        ...prev,
        currentWidth: previousState.width,
        currentHeight: previousState.height,
        historyIndex: prev.historyIndex - 1,
      } : null);

      renderCanvas(imageState);
    } catch (error) {
      console.error('Failed to undo:', error);
      toast({
        title: "Undo failed",
        description: "Could not restore previous state",
        variant: "destructive",
      });
    }
  }, [imageState, toast]);

  const redo = useCallback(() => {
    if (!imageState || imageState.historyIndex >= imageState.history.length - 1) return;

    try {
      const nextState = imageState.history[imageState.historyIndex + 1];
      if (!nextState) return;

      // Update the main canvas dimensions and content
      imageState.canvas.width = nextState.width;
      imageState.canvas.height = nextState.height;
      imageState.ctx.putImageData(nextState, 0, 0);

      setImageState(prev => prev ? {
        ...prev,
        currentWidth: nextState.width,
        currentHeight: nextState.height,
        historyIndex: prev.historyIndex + 1,
      } : null);

      renderCanvas(imageState);
    } catch (error) {
      console.error('Failed to redo:', error);
      toast({
        title: "Redo failed",
        description: "Could not restore next state",
        variant: "destructive",
      });
    }
  }, [imageState, toast]);

  const addTextAnnotation = useCallback(() => {
    if (!currentAnnotation || !textInput.trim() || !imageState) return;

    const annotationData = {
      ...currentAnnotation,
      text: textInput.trim(),
    } as Omit<Annotation, 'id'>;

    // merge style states into the annotation data
    annotationData.fontSize = fontSize;
    annotationData.fontFamily = fontFamily;
    annotationData.fontWeight = fontBold ? 'bold' : 'normal';
    annotationData.italic = fontItalic;
    annotationData.textAlign = textAlign;

    // If editing an existing annotation, update it by id
    if (selectedAnnotationId) {
      const newAnnotations = imageState.annotations.map(a => a.id === selectedAnnotationId ? ({ ...a, ...annotationData, id: a.id } as Annotation) : a);
      const newState: ImageState = { ...imageState, annotations: newAnnotations };
      setImageState(newState);
      try { saveToHistory(newState); } catch (e) { /* ignore */ }
      try { renderCanvas(newState); } catch (e) { /* ignore */ }
      setSelectedAnnotationId(null);
    } else {
      const annotation: Annotation = {
        id: Date.now().toString(),
        ...annotationData,
      } as Annotation;
      const newState: ImageState = { ...imageState, annotations: [...imageState.annotations, annotation] };
      setImageState(newState);
      try { saveToHistory(newState); } catch (e) { /* ignore */ }
      try { renderCanvas(newState); } catch (e) { /* ignore */ }
    }

    setCurrentAnnotation(null);
    setTextInput('');
    setShowTextInput(false);
  }, [currentAnnotation, textInput, imageState, saveToHistory, selectedAnnotationId]);

  const downloadImage = useCallback(() => {
    if (!imageState) return;

    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = imageState.canvas.toDataURL();
    link.click();
  }, [imageState]);

  useEffect(() => {
    if (imageState && selectedTool === 'crop') {
      setImageState(prev => {
        if (!prev) return null;

        const newState = {
          ...prev,
          cropArea: prev.cropArea || {
            x: 0,
            y: 0,
            width: prev.currentWidth,
            height: prev.currentHeight
          }
        };
        return newState;
      });
    }
  }, [selectedTool]);

  // Re-render canvas when filters change
  useEffect(() => {
    if (imageState) {
      renderCanvas(imageState);
    }
  }, [filters, imageState]);

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      {!imageState && (
        <Card id="image-upload" data-image-upload>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">
                Drop an image here or click to browse
              </p>
              <p className="text-muted-foreground mb-4">
                Supports JPEG, PNG, WebP, and other common formats
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button onClick={() => fileInputRef.current?.click()}>
                Choose Image
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Editor Interface */}
      {imageState && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Toolbar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Main Tools */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Main Tools</Label>
                <div className="grid grid-cols-2 gap-2">
                  {tools.map((tool) => (
                    <Button
                      key={tool.id}
                      variant={selectedTool === tool.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTool(tool.id)}
                      className="flex flex-col items-center gap-1 h-auto py-3"
                    >
                      <span className="text-lg">{tool.icon}</span>
                      <span className="text-xs">{tool.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Shape Tools */}
              {selectedTool === 'shapes' && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Shapes</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {shapeTools.map((shape) => {
                      const Icon = shape.icon;
                      return (
                        <Button
                          key={shape.id}
                          variant={selectedShape === shape.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedShape(shape.id)}
                          className="flex flex-col items-center gap-1 h-auto py-3"
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-xs">{shape.name}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Color Picker */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Color</Label>
                <div className="grid grid-cols-5 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded border-2 ${
                        selectedColor === color ? 'border-primary' : 'border-muted'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
                <Input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full h-8"
                />
              </div>

              {/* Stroke Width */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Stroke Width: {strokeWidth}px</Label>
                <Slider
                  value={[strokeWidth]}
                  onValueChange={(value) => setStrokeWidth(value[0])}
                  max={20}
                  min={1}
                  step={1}
                />
              </div>

              {/* Font Size */}
              {selectedTool === 'text' && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Font Size: {fontSize}px</Label>
                  <Slider
                    value={[fontSize]}
                    onValueChange={(value) => setFontSize(value[0])}
                    max={72}
                    min={8}
                    step={2}
                  />
                    <div className="flex gap-2 items-center mt-2">
                      <Label className="text-sm">Font</Label>
                      <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="ml-2">
                        <option>Arial</option>
                        <option>Helvetica</option>
                        <option>Times New Roman</option>
                        <option>Verdana</option>
                      </select>
                    </div>
                    <div className="flex gap-2 items-center mt-2">
                      <button onClick={() => setFontBold(b => !b)} className={`px-2 py-1 border ${fontBold ? 'bg-muted' : ''}`}>B</button>
                      <button onClick={() => setFontItalic(i => !i)} className={`px-2 py-1 border ${fontItalic ? 'bg-muted' : ''}`}>I</button>
                      <div className="ml-2">Align:</div>
                      <select value={textAlign} onChange={(e) => setTextAlign(e.target.value as any)} className="ml-2">
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                </div>
              )}

              {/* Text Input */}
              {showTextInput && selectedTool === 'text' && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Enter Text</Label>
                  <Input
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type your text here..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addTextAnnotation();
                      } else if (e.key === 'Escape') {
                        setShowTextInput(false);
                          setCurrentAnnotation(null);
                          setTextInput('');
                          setSelectedAnnotationId(null);
                      }
                    }}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={addTextAnnotation}
                      disabled={!textInput.trim()}
                      className="flex-1"
                    >
                      Add Text
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowTextInput(false);
                        setCurrentAnnotation(null);
                        setTextInput('');
                        setSelectedAnnotationId(null);
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <Separator />
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={undo}
                  disabled={!imageState || imageState.historyIndex <= 0}
                  className="w-full"
                >
                  <Undo className="h-4 w-4 mr-2" />
                  Undo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={redo}
                  disabled={!imageState || imageState.historyIndex >= imageState.history.length - 1}
                  className="w-full"
                >
                  <Redo className="h-4 w-4 mr-2" />
                  Redo
                </Button>
                {selectedTool === 'crop' && imageState.cropArea && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={applyCrop}
                    className="w-full"
                  >
                    <Crop className="h-4 w-4 mr-2" />
                    Apply Crop
                  </Button>
                )}
                <Button
                  variant="default"
                  size="sm"
                  onClick={downloadImage}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Canvas Area */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Image Editor</span>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    {imageState.currentWidth} × {imageState.currentHeight}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-auto max-h-[600px]">
                <div ref={canvasContainerRef} style={{ position: 'relative' }}>
                  <canvas
                  ref={canvasRef}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                  className="cursor-crosshair"
                  style={{ maxWidth: '100%', height: 'auto', cursor }}
                />
                  {/* Inline editor: shown when a text annotation is selected */}
                  {imageState && selectedAnnotationId && (() => {
                    const ann = imageState.annotations.find(a => a.id === selectedAnnotationId);
                    if (!ann || ann.type !== 'text') return null;
                    // compute css position inside container
                    const canvasEl = canvasRef.current;
                    const containerEl = canvasContainerRef.current;
                    if (!canvasEl || !containerEl) return null;
                    const canvasRect = canvasEl.getBoundingClientRect();
                    const containerRect = containerEl.getBoundingClientRect();
                    const backingW = canvasEl.width || imageState.canvas.width;
                    const backingH = canvasEl.height || imageState.canvas.height;
                    const ratioX = canvasRect.width / backingW;
                    const ratioY = canvasRect.height / backingH;
                    const bounds = getTextBounds(imageState.ctx, ann);
                    const left = (bounds.x * ratioX) + (canvasRect.left - containerRect.left);
                    const top = (bounds.y * ratioY) + (canvasRect.top - containerRect.top);
                    const width = Math.max(80, bounds.width * ratioX);
                    const height = Math.max(24, bounds.height * ratioY);

                    return (
                      <textarea
                        ref={(el) => {
                          inlineEditorRef.current = el;
                          // ensure the DOM shows the current text when opening
                          if (el && textInput !== (ann.text || '')) {
                            // set initial textarea content to annotation text
                            // React controlled value will override, so ensure state is synced
                            setTextInput(ann.text || '');
                          }
                        }}
                        value={textInput}
                        onChange={(e) => {
                          const text = e.target.value;
                          setTextInput(text);
                          // live update annotation text while editing
                          setImageState(prev => {
                            if (!prev) return prev;
                            const updated = prev.annotations.map(a => a.id === ann.id ? ({ ...a, text }) : a);
                            const newState = { ...prev, annotations: updated } as ImageState;
                            try { renderCanvas(newState); } catch (e) { /* ignore */ }
                            return newState;
                          });
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            // commit
                            addTextAnnotation();
                            setSelectedAnnotationId(null);
                            setCurrentAnnotation(null);
                          } else if (e.key === 'Escape') {
                            setSelectedAnnotationId(null);
                            setCurrentAnnotation(null);
                          }
                        }}
                        onBlur={() => {
                          // commit on blur
                          addTextAnnotation();
                          setSelectedAnnotationId(null);
                          setCurrentAnnotation(null);
                        }}
                        style={{
                          position: 'absolute',
                          left: left,
                          top: top,
                          minWidth: width,
                          minHeight: height,
                          background: 'rgba(255,255,255,0.95)',
                          border: '1px solid rgba(0,0,0,0.15)',
                          padding: '4px 6px',
                          zIndex: 60,
                          outline: 'none',
                          borderRadius: 4,
                          fontSize: `${ann.fontSize || 16}px`,
                          resize: 'none',
                        }}
                      />
                    );
                  })()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters Panel */}
      {imageState && selectedTool === 'filters' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Image Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label>Brightness: {filters.brightness}%</Label>
                <Slider
                  value={[filters.brightness]}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, brightness: value[0] }))}
                  max={200}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label>Contrast: {filters.contrast}%</Label>
                <Slider
                  value={[filters.contrast]}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, contrast: value[0] }))}
                  max={200}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label>Saturation: {filters.saturation}%</Label>
                <Slider
                  value={[filters.saturation]}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, saturation: value[0] }))}
                  max={200}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label>Hue: {filters.hue}°</Label>
                <Slider
                  value={[filters.hue]}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, hue: value[0] }))}
                  max={180}
                  min={-180}
                />
              </div>
              <div className="space-y-2">
                <Label>Blur: {filters.blur}px</Label>
                <Slider
                  value={[filters.blur]}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, blur: value[0] }))}
                  max={20}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label>Sepia: {filters.sepia}%</Label>
                <Slider
                  value={[filters.sepia]}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, sepia: value[0] }))}
                  max={100}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label>Grayscale: {filters.grayscale}%</Label>
                <Slider
                  value={[filters.grayscale]}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, grayscale: value[0] }))}
                  max={100}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => setFilters({
                    brightness: 100,
                    contrast: 100,
                    saturation: 100,
                    hue: 0,
                    blur: 0,
                    sepia: 0,
                    grayscale: 0,
                  })}
                  className="w-full"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}