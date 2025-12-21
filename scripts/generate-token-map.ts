#!/usr/bin/env npx tsx
/**
 * Token Component Map Generator
 * 
 * Automatically scans component files and generates tokenComponentMap.ts
 * based on actual Tailwind class usage patterns.
 * 
 * Usage:
 *   npx tsx scripts/generate-token-map.ts
 *   npm run generate:token-map
 * 
 * This script:
 * 1. Greps all component files for token patterns
 * 2. Parses context to determine component, variant, and state
 * 3. Outputs updated tokenComponentMap.ts
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

// =============================================================================
// CONFIGURATION
// =============================================================================

const COMPONENTS_DIR = "src/components";
const OUTPUT_FILE = "src/docs/data/tokenComponentMap.generated.ts";

// Token patterns to search for
const TOKEN_PATTERNS: Record<string, RegExp[]> = {
  primary: [
    /\bbg-primary\b/,
    /\btext-primary\b/,
    /\bborder-primary\b/,
    /\bring-primary\b/,
    /\bbg-primary\/\d+/,
  ],
  destructive: [
    /\bbg-destructive\b/,
    /\btext-destructive\b/,
    /\bborder-destructive\b/,
  ],
  success: [
    /\bbg-success\b/,
    /\btext-success\b/,
    /\bborder-success\b/,
  ],
  warning: [
    /\bbg-warning\b/,
    /\btext-warning\b/,
    /\bborder-warning\b/,
  ],
  info: [
    /\bbg-info\b/,
    /\btext-info\b/,
    /\bborder-info\b/,
  ],
  muted: [
    /\bbg-muted\b/,
    /\btext-muted-foreground\b/,
  ],
  accent: [
    /\bbg-accent\b/,
    /\btext-accent-foreground\b/,
  ],
  background: [
    /\bbg-background\b/,
  ],
  ring: [
    /\bring-ring\b/,
    /\bfocus-visible:ring-ring\b/,
    /\bfocus:ring-ring\b/,
  ],
  border: [
    /\bbg-border\b/,
    /\bborder-border\b/,
    /\bborder-input\b/,
  ],
};

// State detection patterns
const STATE_PATTERNS: Record<string, RegExp> = {
  checked: /data-\[state=checked\]/,
  unchecked: /data-\[state=unchecked\]/,
  hover: /\bhover:/,
  focus: /\bfocus:/,
  "focus-visible": /\bfocus-visible:/,
  disabled: /\bdisabled:/,
  active: /data-\[state=active\]/,
  open: /data-\[state=open\]/,
  on: /data-\[state=on\]/,
  selected: /data-\[selected/,
};

interface ComponentUsage {
  component: string;
  variant: string;
  state: string;
  renderability: "easy" | "hard";
  tailwindClasses: string[];
  filePath: string;
  lineNumber: number;
}

interface TokenUsages {
  [token: string]: ComponentUsage[];
}

// =============================================================================
// HELPERS
// =============================================================================

function getComponentName(filePath: string): string {
  const fileName = path.basename(filePath, ".tsx");
  // Convert kebab-case to PascalCase and handle "wex-" prefix
  if (fileName.startsWith("wex-")) {
    const parts = fileName.replace("wex-", "Wex").split("-");
    return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join("");
  }
  return fileName.charAt(0).toUpperCase() + fileName.slice(1);
}

function detectState(line: string): { state: string; renderability: "easy" | "hard" } {
  for (const [state, pattern] of Object.entries(STATE_PATTERNS)) {
    if (pattern.test(line)) {
      // Hard states require user interaction
      const hardStates = ["hover", "focus", "focus-visible"];
      return {
        state,
        renderability: hardStates.includes(state) ? "hard" : "easy",
      };
    }
  }
  return { state: "default", renderability: "easy" };
}

function extractClasses(line: string, tokenPatterns: RegExp[]): string[] {
  const classes: string[] = [];
  for (const pattern of tokenPatterns) {
    const match = line.match(pattern);
    if (match) {
      classes.push(match[0]);
    }
  }
  return classes;
}

function detectVariant(line: string, componentName: string): string {
  // Look for variant-like patterns
  const variantPatterns = [
    /variant:\s*["'](\w+)["']/,
    /intent:\s*["'](\w+)["']/,
    /(\w+):\s*{[^}]*className/,
  ];
  
  for (const pattern of variantPatterns) {
    const match = line.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return "default";
}

// =============================================================================
// MAIN SCAN FUNCTION
// =============================================================================

function scanComponents(): TokenUsages {
  const usages: TokenUsages = {};
  
  // Initialize token arrays
  for (const token of Object.keys(TOKEN_PATTERNS)) {
    usages[token] = [];
  }
  
  // Get all component files
  const files = execSync(`find ${COMPONENTS_DIR} -name "*.tsx" -type f`, { encoding: "utf-8" })
    .split("\n")
    .filter(f => f.trim());
  
  for (const filePath of files) {
    const componentName = getComponentName(filePath);
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      for (const [token, patterns] of Object.entries(TOKEN_PATTERNS)) {
        const classes = extractClasses(line, patterns);
        if (classes.length > 0) {
          const { state, renderability } = detectState(line);
          const variant = detectVariant(line, componentName);
          
          usages[token].push({
            component: componentName,
            variant,
            state,
            renderability,
            tailwindClasses: classes,
            filePath,
            lineNumber: i + 1,
          });
        }
      }
    }
  }
  
  return usages;
}

// =============================================================================
// OUTPUT GENERATION
// =============================================================================

function generateOutput(usages: TokenUsages): string {
  const lines: string[] = [
    "/**",
    " * Token Component Map - AUTO-GENERATED",
    " * ",
    " * Generated by scripts/generate-token-map.ts",
    ` * Last updated: ${new Date().toISOString()}`,
    " * ",
    " * DO NOT EDIT MANUALLY - Run 'npm run generate:token-map' to regenerate",
    " */",
    "",
    "export interface ComponentUsage {",
    "  component: string;",
    '  variant: string;',
    '  state: string;',
    '  renderability: "easy" | "hard";',
    "  tailwindClasses: string[];",
    "}",
    "",
  ];
  
  // Generate constants for each token
  for (const [token, tokenUsages] of Object.entries(usages)) {
    if (tokenUsages.length === 0) continue;
    
    const constName = `${token.toUpperCase()}_USAGES`;
    lines.push(`export const ${constName}: ComponentUsage[] = [`);
    
    // Deduplicate by component+variant+state
    const seen = new Set<string>();
    for (const usage of tokenUsages) {
      const key = `${usage.component}:${usage.variant}:${usage.state}`;
      if (seen.has(key)) continue;
      seen.add(key);
      
      lines.push("  {");
      lines.push(`    component: "${usage.component}",`);
      lines.push(`    variant: "${usage.variant}",`);
      lines.push(`    state: "${usage.state}",`);
      lines.push(`    renderability: "${usage.renderability}",`);
      lines.push(`    tailwindClasses: ${JSON.stringify(usage.tailwindClasses)},`);
      lines.push("  },");
    }
    
    lines.push("];");
    lines.push("");
  }
  
  // Generate summary
  lines.push("// =============================================================================");
  lines.push("// SUMMARY");
  lines.push("// =============================================================================");
  lines.push("");
  lines.push("export const TOKEN_SUMMARY = {");
  for (const [token, tokenUsages] of Object.entries(usages)) {
    const easy = tokenUsages.filter(u => u.renderability === "easy").length;
    const hard = tokenUsages.filter(u => u.renderability === "hard").length;
    lines.push(`  ${token}: { total: ${tokenUsages.length}, easy: ${easy}, hard: ${hard} },`);
  }
  lines.push("};");
  
  return lines.join("\n");
}

// =============================================================================
// MAIN
// =============================================================================

function main() {
  console.log("🔍 Scanning components for token usage...\n");
  
  const usages = scanComponents();
  
  // Print summary
  console.log("📊 Token Usage Summary:");
  console.log("═".repeat(50));
  for (const [token, tokenUsages] of Object.entries(usages)) {
    if (tokenUsages.length === 0) continue;
    const easy = tokenUsages.filter(u => u.renderability === "easy").length;
    const hard = tokenUsages.filter(u => u.renderability === "hard").length;
    console.log(`  ${token.padEnd(15)} ${tokenUsages.length} usages (${easy} easy, ${hard} hard)`);
  }
  console.log("═".repeat(50));
  
  // Generate output
  const output = generateOutput(usages);
  fs.writeFileSync(OUTPUT_FILE, output);
  
  console.log(`\n✅ Generated ${OUTPUT_FILE}`);
  console.log("\n📝 Next steps:");
  console.log("   1. Review the generated file");
  console.log("   2. Compare with tokenComponentMap.ts");
  console.log("   3. Update descriptions and variant names as needed");
}

main();

