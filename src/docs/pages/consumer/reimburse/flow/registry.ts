import type { FlowDefinition } from "./types";
import { mvpLinearV1 } from "./flows/mvpLinearV1";
import { visionLinearV1 } from "./flows/visionLinearV1";
import { visionAltStepsV1 } from "./flows/visionAltStepsV1";
import { visionWizardV1 } from "./flows/visionWizardV1";

export const DEFAULT_FLOW_ID = mvpLinearV1.id;

export const FLOW_REGISTRY: Record<string, FlowDefinition> = {
  [mvpLinearV1.id]: mvpLinearV1,
  [visionLinearV1.id]: visionLinearV1,
  [visionAltStepsV1.id]: visionAltStepsV1,
  [visionWizardV1.id]: visionWizardV1,
};

export function getFlowById(flowId: string | null | undefined): FlowDefinition {
  if (!flowId) {
    return FLOW_REGISTRY[DEFAULT_FLOW_ID];
  }
  return FLOW_REGISTRY[flowId] ?? FLOW_REGISTRY[DEFAULT_FLOW_ID];
}

