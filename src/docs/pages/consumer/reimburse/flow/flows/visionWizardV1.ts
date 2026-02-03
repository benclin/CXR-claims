import type { FlowDefinition } from "../types";

export const visionWizardV1: FlowDefinition = {
  id: "vision-wizard-v1",
  name: "Vision - Wizard V1",
  description: "Questionnaire-style wizard for reimbursement intake.",
  mode: "wizard",
  steps: [
    { id: "expenseType", label: "Expense Type", path: "/reimburse/wizard" },
    { id: "plan", label: "Plan & Balance", path: "/reimburse/wizard" },
    { id: "upload", label: "Upload Receipt", path: "/reimburse/wizard" },
    { id: "review", label: "Confirm Details", path: "/reimburse/wizard" },
  ],
  getNext: (_state, currentStepId) => {
    const index = visionWizardV1.steps.findIndex((step) => step.id === currentStepId);
    if (index < 0 || index >= visionWizardV1.steps.length - 1) {
      return null;
    }
    return visionWizardV1.steps[index + 1].id;
  },
  getBack: (_state, currentStepId) => {
    const index = visionWizardV1.steps.findIndex((step) => step.id === currentStepId);
    if (index <= 0) {
      return null;
    }
    return visionWizardV1.steps[index - 1].id;
  },
  getProgressSteps: () => visionWizardV1.steps,
};

