import type { FlowDefinition } from "../types";

export const visionLinearV1: FlowDefinition = {
  id: "reimburse-linear-v1",
  name: "Reimburse - Linear V1",
  description: "Current linear reimbursement flow.",
  mode: "routes",
  steps: [
    { id: "myself", label: "Select Account", path: "/reimburse" },
    { id: "docs", label: "Upload Documents", path: "/reimburse/docs" },
    { id: "analyze", label: "Analyze", path: "/reimburse/analyze" },
    { id: "review", label: "Review", path: "/reimburse/review" },
    { id: "confirm", label: "Confirm", path: "/reimburse/confirm" },
  ],
  getNext: (_state, currentStepId) => {
    const index = visionLinearV1.steps.findIndex((step) => step.id === currentStepId);
    if (index < 0 || index >= visionLinearV1.steps.length - 1) {
      return null;
    }
    return visionLinearV1.steps[index + 1].id;
  },
  getBack: (_state, currentStepId) => {
    const index = visionLinearV1.steps.findIndex((step) => step.id === currentStepId);
    if (index <= 0) {
      return null;
    }
    return visionLinearV1.steps[index - 1].id;
  },
  getProgressSteps: () => visionLinearV1.steps,
};

