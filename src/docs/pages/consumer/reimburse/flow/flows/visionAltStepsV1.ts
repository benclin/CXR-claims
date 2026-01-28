import type { FlowDefinition } from "../types";

export const visionAltStepsV1: FlowDefinition = {
  id: "vision-alt-steps-v1",
  name: "Vision - Alternate Steps V1",
  description: "Upload-first flow that reorders the reimbursement steps.",
  mode: "routes",
  steps: [
    { id: "docs", label: "Upload Documents", path: "/reimburse/docs" },
    { id: "analyze", label: "Analyze", path: "/reimburse/analyze" },
    { id: "review", label: "Review", path: "/reimburse/review" },
    { id: "myself", label: "Claim Details", path: "/reimburse" },
    { id: "confirm", label: "Confirm", path: "/reimburse/confirm" },
  ],
  getNext: (_state, currentStepId) => {
    const index = visionAltStepsV1.steps.findIndex((step) => step.id === currentStepId);
    if (index < 0 || index >= visionAltStepsV1.steps.length - 1) {
      return null;
    }
    return visionAltStepsV1.steps[index + 1].id;
  },
  getBack: (_state, currentStepId) => {
    const index = visionAltStepsV1.steps.findIndex((step) => step.id === currentStepId);
    if (index <= 0) {
      return null;
    }
    return visionAltStepsV1.steps[index - 1].id;
  },
  getProgressSteps: () => visionAltStepsV1.steps,
};

