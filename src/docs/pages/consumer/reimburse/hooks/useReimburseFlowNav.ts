import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useReimbursement } from "../ReimbursementContext";
import { getFlowById } from "../flow/registry";

export function useReimburseFlowNav() {
  const navigate = useNavigate();
  const { state } = useReimbursement();
  const flow = useMemo(() => getFlowById(state.flowId), [state.flowId]);

  const getStepPath = (stepId: string) =>
    flow.steps.find((step) => step.id === stepId)?.path ?? null;

  const goToStep = (stepId: string) => {
    const path = getStepPath(stepId);
    if (path) {
      navigate(path);
    }
  };

  const goNext = (currentStepId: string) => {
    const nextStepId = flow.getNext(state, currentStepId);
    if (nextStepId) {
      goToStep(nextStepId);
    }
  };

  const goBack = (currentStepId: string) => {
    const previousStepId = flow.getBack(state, currentStepId);
    if (previousStepId) {
      goToStep(previousStepId);
    }
  };

  return {
    flow,
    goNext,
    goBack,
    goToStep,
    getStepPath,
  };
}

