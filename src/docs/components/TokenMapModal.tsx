/**
 * TokenMapModal Component
 * 
 * Modal displaying the full WEX token mapping reference.
 * Shows: WEX Token → Tailwind Utility → Components
 */

import * as React from "react";
import { WexDialog, WexInput, WexBadge } from "@/components/wex";
import { Search } from "lucide-react";
import { TOKEN_MAPPINGS } from "@/docs/components/TokenMapping";

interface TokenMapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TokenMapModal({ open, onOpenChange }: TokenMapModalProps) {
  const [search, setSearch] = React.useState("");

  const filteredTokens = React.useMemo(() => {
    const query = search.toLowerCase();
    return Object.entries(TOKEN_MAPPINGS).filter(([token, data]) => {
      if (!query) return true;
      return (
        token.toLowerCase().includes(query) ||
        data.tailwindUtilities.some((u) => u.toLowerCase().includes(query)) ||
        data.components.some((c) => c.toLowerCase().includes(query))
      );
    });
  }, [search]);

  return (
    <WexDialog open={open} onOpenChange={onOpenChange}>
      <WexDialog.Content className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <WexDialog.Header>
          <WexDialog.Title>Token Mapping Reference</WexDialog.Title>
          <WexDialog.Description>
            Complete reference showing how WEX design tokens map to Tailwind utilities and components.
          </WexDialog.Description>
        </WexDialog.Header>

        {/* Search */}
        <div className="px-6 py-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <WexInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tokens, utilities, or components..."
              className="pl-9"
            />
          </div>
        </div>

        {/* Token List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {filteredTokens.map(([token, data]) => (
              <div
                key={token}
                className="p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
              >
                {/* Token Name */}
                <code className="text-sm font-mono text-primary font-medium">
                  {token}
                </code>

                {/* Tailwind Utilities */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="text-xs text-muted-foreground mr-1">Tailwind:</span>
                  {data.tailwindUtilities.map((utility) => (
                    <code
                      key={utility}
                      className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono"
                    >
                      {utility}
                    </code>
                  ))}
                </div>

                {/* Components */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="text-xs text-muted-foreground mr-1">Components:</span>
                  {data.components.map((component) => (
                    <WexBadge
                      key={component}
                      intent="secondary"
                      className="text-[10px] px-1.5 py-0"
                    >
                      {component}
                    </WexBadge>
                  ))}
                </div>
              </div>
            ))}

            {filteredTokens.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No tokens found matching "{search}"
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground">
            {filteredTokens.length} of {Object.keys(TOKEN_MAPPINGS).length} tokens shown
          </p>
        </div>
      </WexDialog.Content>
    </WexDialog>
  );
}

