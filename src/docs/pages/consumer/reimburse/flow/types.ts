import type { ReimbursementState } from "../ReimbursementContext";

export type FlowMode = "routes" | "wizard";

export interface FlowStep {
  id: string;
  label: string;
  path?: string;
}

export interface FlowDefinition {
  id: string;
  name: string;
  description: string;
  mode: FlowMode;
  steps: FlowStep[];
  getNext: (state: ReimbursementState, currentStepId: string) => string | null;
  getBack: (state: ReimbursementState, currentStepId: string) => string | null;
  getProgressSteps: (state: ReimbursementState) => FlowStep[];
}

