/**
 * Vite plugin to generate CSS from design-tokens.json at build time
 * This allows the app to import JSON directly and get CSS automatically
 */

import type { Plugin } from 'vite';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function generateCSSFromJSON(theme: { light: Record<string, string>; dark: Record<string, string> }) {
  let css = `/* ============================================================
   WEX TOKEN EMISSION LAYER
   ============================================================
   AUTO-GENERATED from design-tokens.json - DO NOT EDIT
   ============================================================ */

:root {
`;

  // Light mode tokens
  Object.entries(theme.light)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([token, value]) => {
      css += `  ${token}: ${value};\n`;
    });

  css += `}

.dark {
`;

  // Dark mode tokens
  Object.entries(theme.dark)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([token, value]) => {
      css += `  ${token}: ${value};\n`;
    });

  css += `}
`;

  return css;
}

function loadBridgeFiles() {
  const bridgesRoot = join(__dirname, '..', 'packages', 'design-tokens');
  const shadcnBridge = join(bridgesRoot, 'shadcn-bridge.css');
  const componentsBridge = join(bridgesRoot, 'components-bridge.css');
  
  let bridgeCSS = '';
  
  if (existsSync(shadcnBridge)) {
    bridgeCSS += readFileSync(shadcnBridge, 'utf-8') + '\n';
  }
  
  if (existsSync(componentsBridge)) {
    bridgeCSS += readFileSync(componentsBridge, 'utf-8') + '\n';
  }
  
  return bridgeCSS;
}

export function tokensCSSPlugin(): Plugin {
  const tokensJSONPath = join(__dirname, '..', 'packages', 'design-tokens', 'design-tokens.json');
  const virtualModuleId = '\0virtual:@wex/design-tokens.css';
  
  return {
    name: 'tokens-css',
    enforce: 'pre', // Run before other plugins
    resolveId(id) {
      // Intercept @wex/design-tokens imports
      if (id === '@wex/design-tokens' || id === '@wex/design-tokens/css') {
        return virtualModuleId;
      }
      return null;
    },
    load(id) {
      // Handle virtual module
      if (id === virtualModuleId) {
        if (!existsSync(tokensJSONPath)) {
          throw new Error(`design-tokens.json not found at ${tokensJSONPath}`);
        }
        
        const theme = JSON.parse(readFileSync(tokensJSONPath, 'utf-8'));
        const tokensCSS = generateCSSFromJSON(theme);
        const bridgeCSS = loadBridgeFiles();
        
        return tokensCSS + '\n' + bridgeCSS;
      }
      return null;
    },
  };
}

