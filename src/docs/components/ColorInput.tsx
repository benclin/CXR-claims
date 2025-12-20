/**
 * ColorInput Component
 * 
 * A color input that supports both hex and HSL formats.
 * - Displays color swatch preview
 * - Hex input with auto-conversion to HSL
 * - HSL value display
 * - Native color picker integration
 */

import * as React from "react";
import { WexInput, WexLabel } from "@/components/wex";
import { hexToToken, tokenToHex, isValidHex, parseHSL, formatHSL } from "@/docs/utils/color-convert";
import { cn } from "@/lib/utils";

interface ColorInputProps {
  /** CSS variable name (e.g., "--wex-primary") */
  token: string;
  /** Display label */
  label: string;
  /** Current HSL value (WEX format: "208 100% 32%") */
  value: string;
  /** Called when value changes */
  onChange: (value: string) => void;
  /** Optional description */
  description?: string;
  /** Optional className */
  className?: string;
}

export function ColorInput({
  token,
  label,
  value,
  onChange,
  description,
  className,
}: ColorInputProps) {
  const [hexValue, setHexValue] = React.useState("");
  const [isHexFocused, setIsHexFocused] = React.useState(false);
  
  // Sync hex value from HSL value
  React.useEffect(() => {
    if (!isHexFocused) {
      const hex = tokenToHex(value);
      if (hex) {
        setHexValue(hex);
      }
    }
  }, [value, isHexFocused]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let hex = e.target.value;
    
    // Auto-add # if missing
    if (hex && !hex.startsWith("#")) {
      hex = "#" + hex;
    }
    
    setHexValue(hex);
    
    // Convert to HSL if valid
    if (isValidHex(hex)) {
      const hsl = hexToToken(hex);
      if (hsl) {
        onChange(hsl);
      }
    }
  };

  const handleHexBlur = () => {
    setIsHexFocused(false);
    // Reset to current value if invalid
    const hex = tokenToHex(value);
    if (hex) {
      setHexValue(hex);
    }
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setHexValue(hex.toUpperCase());
    
    const hsl = hexToToken(hex);
    if (hsl) {
      onChange(hsl);
    }
  };

  const handleHSLChange = (component: "h" | "s" | "l", newValue: string) => {
    const parsed = parseHSL(value);
    if (!parsed) return;
    
    const numValue = parseInt(newValue, 10);
    if (isNaN(numValue)) return;
    
    const updated = { ...parsed, [component]: numValue };
    
    // Clamp values
    updated.h = Math.max(0, Math.min(360, updated.h));
    updated.s = Math.max(0, Math.min(100, updated.s));
    updated.l = Math.max(0, Math.min(100, updated.l));
    
    onChange(formatHSL(updated));
  };

  const hsl = parseHSL(value);
  const displayHex = tokenToHex(value) || "#000000";

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <WexLabel className="text-sm font-medium">{label}</WexLabel>
        <code className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          {token}
        </code>
      </div>
      
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      
      <div className="flex items-center gap-3">
        {/* Color swatch with native picker */}
        <div className="relative">
          <div
            className="w-10 h-10 rounded-md border border-border shadow-sm cursor-pointer"
            style={{ backgroundColor: `hsl(${value})` }}
          />
          <input
            type="color"
            value={displayHex}
            onChange={handleColorPickerChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            title="Pick color"
          />
        </div>
        
        {/* Hex input */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-8">Hex</span>
            <WexInput
              value={hexValue}
              onChange={handleHexChange}
              onFocus={() => setIsHexFocused(true)}
              onBlur={handleHexBlur}
              placeholder="#000000"
              className="font-mono text-sm h-8"
            />
          </div>
        </div>
        
        {/* HSL inputs */}
        <div className="flex items-center gap-1">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-muted-foreground">H</span>
            <WexInput
              type="number"
              min={0}
              max={360}
              value={hsl?.h ?? 0}
              onChange={(e) => handleHSLChange("h", e.target.value)}
              className="w-14 h-8 text-xs text-center font-mono"
            />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-muted-foreground">S%</span>
            <WexInput
              type="number"
              min={0}
              max={100}
              value={hsl?.s ?? 0}
              onChange={(e) => handleHSLChange("s", e.target.value)}
              className="w-14 h-8 text-xs text-center font-mono"
            />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-muted-foreground">L%</span>
            <WexInput
              type="number"
              min={0}
              max={100}
              value={hsl?.l ?? 0}
              onChange={(e) => handleHSLChange("l", e.target.value)}
              className="w-14 h-8 text-xs text-center font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact color input for palette ramps
 */
interface CompactColorInputProps {
  step: number;
  value: string;
  onChange: (value: string) => void;
}

export function CompactColorInput({ step, value, onChange }: CompactColorInputProps) {
  const [hexValue, setHexValue] = React.useState("");
  
  React.useEffect(() => {
    const hex = tokenToHex(value);
    if (hex) {
      setHexValue(hex);
    }
  }, [value]);

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setHexValue(hex.toUpperCase());
    
    const hsl = hexToToken(hex);
    if (hsl) {
      onChange(hsl);
    }
  };

  const displayHex = tokenToHex(value) || "#000000";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        <div
          className="w-8 h-8 rounded border border-border cursor-pointer"
          style={{ backgroundColor: `hsl(${value})` }}
        />
        <input
          type="color"
          value={displayHex}
          onChange={handleColorPickerChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          title={`Edit ${step}`}
        />
      </div>
      <span className="text-[10px] text-muted-foreground">{step}</span>
    </div>
  );
}

