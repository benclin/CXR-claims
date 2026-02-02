import type { FlowDefinition } from "../types";

export const mvpLinearV1: FlowDefinition = {
  id: "mvp-linear-v1",
  name: "MVP - Linear V1",
  description: "MVP reimbursement flow without analyze step.",
  mode: "routes",
  steps: [
    { id: "myself", label: "Select Account", path: "/reimburse" },
    { id: "docs", label: "Upload Documents", path: "/reimburse/docs" },
    { id: "review", label: "Review Details", path: "/reimburse/review" },
    { id: "confirm", label: "Confirm", path: "/reimburse/confirm" },
  ],
  getNext: (_state, currentStepId) => {
    const index = mvpLinearV1.steps.findIndex((step) => step.id === currentStepId);
    if (index < 0 || index >= mvpLinearV1.steps.length - 1) {
      return null;
    }
    return mvpLinearV1.steps[index + 1].id;
  },
  getBack: (_state, currentStepId) => {
    const index = mvpLinearV1.steps.findIndex((step) => step.id === currentStepId);
    if (index <= 0) {
      return null;
    }
    return mvpLinearV1.steps[index - 1].id;
  },
  getProgressSteps: () => mvpLinearV1.steps,
};

