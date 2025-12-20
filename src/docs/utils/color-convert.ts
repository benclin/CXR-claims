/**
 * Color Conversion Utilities
 * 
 * Provides functions to convert between color formats:
 * - Hex (#RRGGBB) ↔ HSL (H S% L%)
 * - RGB ↔ HSL
 * 
 * WEX tokens use HSL format: "208 100% 32%"
 */

export interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

/**
 * Parse HSL string to HSL object
 * Input: "208 100% 32%" or "208, 100%, 32%"
 */
export function parseHSL(hslString: string): HSL | null {
  const cleaned = hslString.replace(/%/g, "").trim();
  const parts = cleaned.split(/[\s,]+/).map((s) => parseFloat(s.trim()));
  
  if (parts.length < 3 || parts.some(isNaN)) {
    return null;
  }
  
  return { h: parts[0], s: parts[1], l: parts[2] };
}

/**
 * Format HSL object to WEX token string
 * Output: "208 100% 32%"
 */
export function formatHSL(hsl: HSL): string {
  return `${Math.round(hsl.h)} ${Math.round(hsl.s)}% ${Math.round(hsl.l)}%`;
}

/**
 * Convert hex color to RGB
 * Input: "#0052A5" or "#05A" (shorthand)
 */
export function hexToRGB(hex: string): RGB | null {
  const cleaned = hex.replace("#", "").trim();
  
  let r: number, g: number, b: number;
  
  if (cleaned.length === 3) {
    r = parseInt(cleaned[0] + cleaned[0], 16);
    g = parseInt(cleaned[1] + cleaned[1], 16);
    b = parseInt(cleaned[2] + cleaned[2], 16);
  } else if (cleaned.length === 6) {
    r = parseInt(cleaned.slice(0, 2), 16);
    g = parseInt(cleaned.slice(2, 4), 16);
    b = parseInt(cleaned.slice(4, 6), 16);
  } else {
    return null;
  }
  
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return null;
  }
  
  return { r, g, b };
}

/**
 * Convert RGB to hex color
 * Output: "#0052A5"
 */
export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
}

/**
 * Convert RGB to HSL
 */
export function rgbToHSL(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  
  let h = 0;
  let s = 0;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert HSL to RGB
 */
export function hslToRGB(hsl: HSL): RGB {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;
  
  let r: number, g: number, b: number;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Convert hex to HSL
 * Input: "#0052A5"
 * Output: { h: 208, s: 100, l: 32 }
 */
export function hexToHSL(hex: string): HSL | null {
  const rgb = hexToRGB(hex);
  if (!rgb) return null;
  return rgbToHSL(rgb);
}

/**
 * Convert HSL to hex
 * Input: { h: 208, s: 100, l: 32 }
 * Output: "#0052A5"
 */
export function hslToHex(hsl: HSL): string {
  const rgb = hslToRGB(hsl);
  return rgbToHex(rgb);
}

/**
 * Convert WEX token string to hex
 * Input: "208 100% 32%"
 * Output: "#0052A5"
 */
export function tokenToHex(tokenValue: string): string | null {
  const hsl = parseHSL(tokenValue);
  if (!hsl) return null;
  return hslToHex(hsl);
}

/**
 * Convert hex to WEX token string
 * Input: "#0052A5"
 * Output: "208 100% 32%"
 */
export function hexToToken(hex: string): string | null {
  const hsl = hexToHSL(hex);
  if (!hsl) return null;
  return formatHSL(hsl);
}

/**
 * Validate if a string is a valid hex color
 */
export function isValidHex(hex: string): boolean {
  const cleaned = hex.replace("#", "").trim();
  return /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(cleaned);
}

/**
 * Validate if a string is a valid HSL token
 */
export function isValidHSLToken(token: string): boolean {
  const hsl = parseHSL(token);
  if (!hsl) return false;
  return hsl.h >= 0 && hsl.h <= 360 && hsl.s >= 0 && hsl.s <= 100 && hsl.l >= 0 && hsl.l <= 100;
}

