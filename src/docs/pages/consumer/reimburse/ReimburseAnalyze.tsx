import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ConsumerNavigation } from "../ConsumerNavigation";
import { WexCard, WexSpinner } from "@/components/wex";
import { useReimbursement } from "./ReimbursementContext";
import { ProgressIndicator, AIStatusIndicator, ModeSelector } from "./components";
import { getFlowById } from "./flow/registry";
import { useReimburseFlowNav } from "./hooks/useReimburseFlowNav";

export default function ReimburseAnalyze({
  onModalClose: _onModalClose,
}: {
  onModalClose?: () => void;
} = {}) {
  const [searchParams] = useSearchParams();
  const { state } = useReimbursement();
  const { goNext } = useReimburseFlowNav();

  const isModal = state.layoutModes.entryMode === "modal";

  // Get layout modes from URL params or state
  const layoutModes = useMemo(() => {
    const modes = { ...state.layoutModes };
    const progressMode = searchParams.get("progressMode");
    const aiCommunication = searchParams.get("aiCommunication");
    
    if (progressMode && ["none", "implicit", "stepper"].includes(progressMode)) {
      modes.progressMode = progressMode as "none" | "implicit" | "stepper";
    }
    if (aiCommunication && ["minimal", "detailed", "prominent"].includes(aiCommunication)) {
      modes.aiCommunication = aiCommunication as "minimal" | "detailed" | "prominent";
    }
    
    return modes;
  }, [state.layoutModes, searchParams]);

  const activeFlow = useMemo(() => getFlowById(state.flowId), [state.flowId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      goNext("analyze");
    }, 3000);
    return () => clearTimeout(timer);
  }, [goNext]);

  // Middle content (scrollable area)
  const middleContent = (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <WexSpinner className="h-8 w-8 text-primary" />
      </div>
      <p className="text-sm font-medium text-foreground">Analyzing your document...</p>
    </div>
  );

  // For modal mode, use fixed layout structure matching ReimburseDocs
  if (isModal) {
    return (
      <div className="flex flex-col h-full max-h-[90vh]">
        {/* Fixed header - empty but maintains same height as ReimburseDocs */}
        <div className="flex-shrink-0 px-6 pt-6 pb-4">
          <h1 className="text-[30px] font-bold leading-[40px] tracking-[-0.63px] invisible">Reimburse Myself</h1>
        </div>
        {/* Scrollable middle content */}
        <div className="flex-1 overflow-y-auto px-6">
          <div className="mx-auto max-w-[600px] space-y-6 py-4">
            {middleContent}
          </div>
        </div>
        {/* Fixed footer with progress indicator */}
        <div className="flex-shrink-0 px-6 pt-4 pb-6 border-t">
          <ProgressIndicator
            mode={layoutModes.progressMode}
            currentStep="analyze"
            steps={activeFlow.getProgressSteps(state)}
          />
        </div>
      </div>
    );
  }

  // For fullpage mode, render with navigation and card wrapper
  return (
    <div className="min-h-screen bg-[#F1FAFE]">
      <ConsumerNavigation />

      <div className="mx-auto max-w-[1440px] px-8 py-8">
        <div className="mx-auto max-w-[1376px] space-y-6">
          <h1 className="text-[30px] font-bold leading-[40px] tracking-[-0.63px] text-foreground">Reimburse Myself</h1>

          <div className="mx-auto max-w-[720px]">
            <WexCard>
              <WexCard.Content className="space-y-6 p-8">
                <ProgressIndicator
                  mode={layoutModes.progressMode}
                  currentStep="analyze"
                  steps={activeFlow.getProgressSteps(state)}
                />
                <AIStatusIndicator
                  mode={layoutModes.aiCommunication}
                  isAnalyzing={true}
                  isComplete={false}
                />

                {middleContent}
              </WexCard.Content>
            </WexCard>
          </div>
        </div>
      </div>
      <ModeSelector />
    </div>
  );
}

