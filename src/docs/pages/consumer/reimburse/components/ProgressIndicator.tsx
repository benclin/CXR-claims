import { Check } from "lucide-react";
import type { FlowStep } from "../flow/types";

/**
 * ProgressIndicator Component
 * 
 * Displays progress through the reimbursement flow.
 * Supports three modes: none, implicit, and stepper.
 */

export function ProgressIndicator({
  mode,
  currentStep,
  steps,
}: {
  mode: "none" | "implicit" | "stepper";
  currentStep: string;
  steps: FlowStep[];
}) {
  if (mode === "none" || steps.length === 0) {
    return null;
  }

  const currentIndex = steps.findIndex((step) => step.id === currentStep);
  const currentStepIndex = currentIndex >= 0 ? currentIndex : 0;

  if (mode === "implicit") {
    // Subtle breadcrumb-style indicator
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">
          {steps[currentStepIndex].label}
        </span>
        <span>•</span>
        <span>Step {currentStepIndex + 1} of {steps.length}</span>
      </div>
    );
  }

  // Stepper mode: explicit step indicator
  return (
    <div className="flex flex-wrap items-center gap-2 py-4">
      {steps.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
                  isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : isCurrent
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-muted bg-background text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-semibold">{index + 1}</span>
                )}
              </div>
              <span
                className={`ml-2 text-sm font-medium whitespace-nowrap ${
                  isCurrent
                    ? "text-foreground"
                    : isCompleted
                    ? "text-muted-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-4 h-0.5 w-8 ${
                  isCompleted ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

