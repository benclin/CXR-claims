import { WexAlert, WexBadge } from "@/components/wex";
import { CheckCircle2, Sparkles, Loader2 } from "lucide-react";

/**
 * AIStatusIndicator Component
 * 
 * Displays AI analysis status with different communication levels:
 * - minimal: Subtle messaging
 * - detailed: Expanded explanations
 * - prominent: Highlighted status indicators
 */
export function AIStatusIndicator({
  mode,
  isAnalyzing,
  isComplete,
  extractedFieldsCount = 0,
}: {
  mode: "minimal" | "detailed" | "prominent";
  isAnalyzing?: boolean;
  isComplete?: boolean;
  extractedFieldsCount?: number;
}) {
  if (mode === "minimal") {
    if (isAnalyzing) {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Analyzing receipt...</span>
        </div>
      );
    }
    if (isComplete) {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <span>Analysis complete</span>
        </div>
      );
    }
    return null;
  }

  if (mode === "detailed") {
    if (isAnalyzing) {
      return (
        <WexAlert intent="info">
          <Sparkles className="h-4 w-4" />
          <WexAlert.Title>AI Analysis in Progress</WexAlert.Title>
          <WexAlert.Description>
            Our AI is extracting information from your receipt. This typically takes 2-3 seconds.
            You'll be able to review and edit the extracted data on the next screen.
          </WexAlert.Description>
        </WexAlert>
      );
    }
    if (isComplete) {
      return (
        <WexAlert intent="success">
          <CheckCircle2 className="h-4 w-4" />
          <WexAlert.Title>Form Auto-Filled</WexAlert.Title>
          <WexAlert.Description>
            We extracted {extractedFieldsCount} field{extractedFieldsCount !== 1 ? "s" : ""} from your receipt.
            Review and adjust as needed.
          </WexAlert.Description>
        </WexAlert>
      );
    }
    return null;
  }

  // Prominent mode
  if (isAnalyzing) {
    return (
      <div className="rounded-lg border-2 border-primary bg-primary/5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <WexBadge intent="info" size="sm">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Analyzing
              </WexBadge>
            </div>
            <p className="mt-1 text-sm font-medium text-foreground">
              Extracting information from your receipt...
            </p>
            <p className="text-xs text-muted-foreground">
              This will take just a few seconds
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="rounded-lg border-2 border-success bg-success/5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-5 w-5 text-success" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <WexBadge intent="success" size="sm">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Analysis Complete
              </WexBadge>
            </div>
            <p className="mt-1 text-sm font-medium text-foreground">
              {extractedFieldsCount} field{extractedFieldsCount !== 1 ? "s" : ""} extracted successfully
            </p>
            <p className="text-xs text-muted-foreground">
              Review and edit the information below
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

