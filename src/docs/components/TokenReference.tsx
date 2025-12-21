import { Section } from "./Section";
import { WexAlert } from "@/components/wex";
import { Palette } from "lucide-react";

/**
 * Token row data structure
 */
export interface TokenRow {
  /** The element or variant name (e.g., "Primary Button", "Success Alert") */
  element: string;
  /** The CSS property (e.g., "Background", "Text", "Border") */
  property: string;
  /** The token/CSS variable name (e.g., "--primary", "--success") */
  token: string;
}

/**
 * Props for TokenReference component
 */
export interface TokenReferenceProps {
  /** Array of token mappings to display */
  tokens: TokenRow[];
  /** Optional className for styling */
  className?: string;
}

/**
 * TokenReference - Displays CSS variable tokens used by a component
 * 
 * This section is primarily for developers using @wex/design-tokens only
 * who want to recreate component styling with their own implementations.
 * 
 * @example
 * <TokenReference
 *   tokens={[
 *     { element: "Primary", property: "Background", token: "--primary" },
 *     { element: "Primary", property: "Text", token: "--primary-foreground" },
 *   ]}
 * />
 */
export function TokenReference({ tokens, className }: TokenReferenceProps) {
  if (!tokens || tokens.length === 0) {
    return null;
  }

  return (
    <Section 
      title="Design Tokens" 
      description="CSS variables used by this component."
      className={className}
    >
      <WexAlert intent="info" className="mb-6">
        <Palette className="h-4 w-4" />
        <WexAlert.Title>For @wex/design-tokens users</WexAlert.Title>
        <WexAlert.Description>
          This reference is for teams using the tokens-only package who want to 
          recreate component styling. If you're using{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded text-xs">@wex/components</code>, 
          these tokens are applied automatically.
        </WexAlert.Description>
      </WexAlert>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-foreground">
                Variant / Element
              </th>
              <th className="text-left py-3 px-4 font-medium text-foreground">
                Property
              </th>
              <th className="text-left py-3 px-4 font-medium text-foreground">
                Token
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tokens.map((row, index) => (
              <tr key={`${row.element}-${row.property}-${index}`}>
                <td className="py-3 px-4 text-foreground">{row.element}</td>
                <td className="py-3 px-4 text-muted-foreground">{row.property}</td>
                <td className="py-3 px-4">
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
                    {row.token}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

/**
 * Helper function to create token rows for components with standard intent variants
 * (default, destructive, success, warning, info)
 */
export function createIntentTokens(_componentName: string): TokenRow[] {
  return [
    // Default
    { element: "Default", property: "Background", token: "--background" },
    { element: "Default", property: "Text", token: "--foreground" },
    { element: "Default", property: "Border", token: "--border" },
    
    // Primary (for buttons)
    { element: "Primary", property: "Background", token: "--primary" },
    { element: "Primary", property: "Text", token: "--primary-foreground" },
    { element: "Primary", property: "Hover", token: "--primary-hover" },
    
    // Destructive
    { element: "Destructive", property: "Background", token: "--destructive" },
    { element: "Destructive", property: "Text", token: "--destructive-foreground" },
    
    // Success
    { element: "Success", property: "Background", token: "--success" },
    { element: "Success", property: "Text", token: "--success-foreground" },
    
    // Warning
    { element: "Warning", property: "Background", token: "--warning" },
    { element: "Warning", property: "Text", token: "--warning-foreground" },
    
    // Info
    { element: "Info", property: "Background", token: "--info" },
    { element: "Info", property: "Text", token: "--info-foreground" },
  ];
}

/**
 * Helper function to create token rows for basic components
 * (Card, Dialog, Input, etc. that use standard background/border/foreground)
 */
export function createBasicTokens(): TokenRow[] {
  return [
    { element: "Container", property: "Background", token: "--background" },
    { element: "Container", property: "Border", token: "--border" },
    { element: "Text", property: "Primary", token: "--foreground" },
    { element: "Text", property: "Muted", token: "--muted-foreground" },
    { element: "Focus Ring", property: "Color", token: "--ring" },
  ];
}

