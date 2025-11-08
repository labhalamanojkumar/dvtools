import { NextRequest, NextResponse } from "next/server";

interface ColorStop {
  color: string;
  position: number;
}

interface ColorPalette {
  name: string;
  colors: string[];
  gradient?: {
    angle: number;
    stops: ColorStop[];
  };
  accessibility?: {
    contrastRatio: number;
    wcagLevel: 'AA' | 'AAA';
    isAccessible: boolean;
  };
}

interface ColorPaletteRequest {
  baseColor?: string;
  paletteType: 'analogous' | 'complementary' | 'triadic' | 'tetradic' | 'monochromatic' | 'split-complementary';
  colorCount: number;
  includeGradient: boolean;
  checkAccessibilityFlag: boolean;
  backgroundColor?: string;
}

interface ColorPaletteResponse {
  success: boolean;
  palettes?: ColorPalette[];
  error?: string;
}

// Color utility functions
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  const lightness = l / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;
  if (s === 0) {
    r = g = b = lightness;
  } else {
    const q = lightness < 0.5 ? lightness * (1 + s) : lightness + s - lightness * s;
    const p = 2 * lightness - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

// Generate color palette based on type
function generatePalette(baseColor: string, type: string, count: number): string[] {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return [];

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors: string[] = [baseColor];

  switch (type) {
    case 'analogous':
      for (let i = 1; i < count; i++) {
        const newHue = (hsl.h + (i * 30)) % 360;
        const newRgb = hslToRgb(newHue, hsl.s, hsl.l);
        colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
      }
      break;

    case 'complementary':
      const complementHue = (hsl.h + 180) % 360;
      const complementRgb = hslToRgb(complementHue, hsl.s, hsl.l);
      colors.push(rgbToHex(complementRgb.r, complementRgb.g, complementRgb.b));
      break;

    case 'triadic':
      for (let i = 1; i < 3 && colors.length < count; i++) {
        const newHue = (hsl.h + (i * 120)) % 360;
        const newRgb = hslToRgb(newHue, hsl.s, hsl.l);
        colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
      }
      break;

    case 'tetradic':
      const tetradic1 = (hsl.h + 90) % 360;
      const tetradic2 = (hsl.h + 180) % 360;
      const tetradic3 = (hsl.h + 270) % 360;
      const rgb1 = hslToRgb(tetradic1, hsl.s, hsl.l);
      const rgb2 = hslToRgb(tetradic2, hsl.s, hsl.l);
      const rgb3 = hslToRgb(tetradic3, hsl.s, hsl.l);
      colors.push(
        rgbToHex(rgb1.r, rgb1.g, rgb1.b),
        rgbToHex(rgb2.r, rgb2.g, rgb2.b),
        rgbToHex(rgb3.r, rgb3.g, rgb3.b)
      );
      break;

    case 'monochromatic':
      for (let i = 1; i < count; i++) {
        const newLightness = Math.max(10, Math.min(90, hsl.l + (i - count/2) * 20));
        const newRgb = hslToRgb(hsl.h, hsl.s, newLightness);
        colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
      }
      break;

    case 'split-complementary':
      const split1 = (hsl.h + 150) % 360;
      const split2 = (hsl.h + 210) % 360;
      const splitRgb1 = hslToRgb(split1, hsl.s, hsl.l);
      const splitRgb2 = hslToRgb(split2, hsl.s, hsl.l);
      colors.push(
        rgbToHex(splitRgb1.r, splitRgb1.g, splitRgb1.b),
        rgbToHex(splitRgb2.r, splitRgb2.g, splitRgb2.b)
      );
      break;
  }

  return colors.slice(0, count);
}

// Calculate contrast ratio between two colors
function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 1;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Check WCAG compliance
function checkAccessibility(textColor: string, backgroundColor: string): { contrastRatio: number; wcagLevel: 'AA' | 'AAA'; isAccessible: boolean } {
  const ratio = getContrastRatio(textColor, backgroundColor);
  const aaNormal = ratio >= 4.5;
  const aaLarge = ratio >= 3.0;
  const aaaNormal = ratio >= 7.0;
  const aaaLarge = ratio >= 4.5;

  return {
    contrastRatio: Math.round(ratio * 100) / 100,
    wcagLevel: aaaNormal ? 'AAA' : aaNormal ? 'AA' : 'AA',
    isAccessible: aaNormal
  };
}

// Generate gradient stops
function generateGradientStops(colors: string[]): ColorStop[] {
  const stops: ColorStop[] = [];
  colors.forEach((color, index) => {
    stops.push({
      color,
      position: Math.round((index / (colors.length - 1)) * 100)
    });
  });
  return stops;
}

export async function POST(request: NextRequest) {
  try {
    const body: ColorPaletteRequest = await request.json();
    const { baseColor, paletteType, colorCount, includeGradient, checkAccessibilityFlag, backgroundColor } = body;

    if (!baseColor || !paletteType || !colorCount) {
      return NextResponse.json({
        success: false,
        error: "Missing required parameters: baseColor, paletteType, and colorCount"
      }, { status: 400 });
    }

    if (colorCount < 1 || colorCount > 10) {
      return NextResponse.json({
        success: false,
        error: "colorCount must be between 1 and 10"
      }, { status: 400 });
    }

    // Generate color palette
    const colors = generatePalette(baseColor, paletteType, colorCount);

    if (colors.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Failed to generate color palette"
      }, { status: 500 });
    }

    const palettes: ColorPalette[] = [{
      name: `${paletteType.charAt(0).toUpperCase() + paletteType.slice(1)} Palette`,
      colors
    }];

    // Add gradient if requested
    if (includeGradient) {
      palettes[0].gradient = {
        angle: 90,
        stops: generateGradientStops(colors)
      };
    }

    // Check accessibility if requested
    if (checkAccessibilityFlag && backgroundColor) {
      const accessibility = checkAccessibility(colors[0], backgroundColor);
      palettes[0].accessibility = accessibility;
    }

    return NextResponse.json({
      success: true,
      palettes
    });

  } catch (error) {
    console.error("Color palette generation error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Color Palette Studio API",
    endpoints: {
      POST: "/api/tools/color-palette-studio",
      description: "Generate color palettes with accessibility checking"
    }
  });
}
