import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ConsumerNavigation } from "../ConsumerNavigation";
import { useReimbursement } from "./ReimbursementContext";
import { getFlowById } from "./flow/registry";
import { useReimburseFlowNav } from "./hooks/useReimburseFlowNav";
import {
  WexButton,
  WexCard,
  WexCheckbox,
  WexAlert,
  WexSeparator,
  WexLabel,
  WexBadge,
} from "@/components/wex";
import { Info, Upload, X, FileText, Check } from "lucide-react";
import { AvailableBalanceSection, ProgressIndicator, ModeSelector } from "./components";

export default function ReimburseDocs({
  onModalClose,
}: {
  onModalClose?: () => void;
} = {}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, updateState } = useReimbursement();
  const { goNext, goBack, goToStep } = useReimburseFlowNav();
  const [autoAnalyze, setAutoAnalyze] = useState(state.autoAnalyze ?? true);
  const [uploads, setUploads] = useState<Array<{ name: string; size: string; status: "uploaded"; date: string }>>(
    (state.uploadedFiles || []).map((file) => ({ ...file, status: file.status ?? "uploaded" }))
  );

  const hasUploads = uploads.length > 0;

  // Get layout modes from URL params or state
  const layoutModes = useMemo(() => {
    const modes = { ...state.layoutModes };
    const progressMode = searchParams.get("progressMode");
    const uploadLayout = searchParams.get("uploadLayout");
    
    if (progressMode && ["none", "implicit", "stepper"].includes(progressMode)) {
      modes.progressMode = progressMode as "none" | "implicit" | "stepper";
    }
    if (uploadLayout && ["standard", "compact", "split"].includes(uploadLayout)) {
      modes.uploadLayout = uploadLayout as "standard" | "compact" | "split";
    }
    
    return modes;
  }, [state.layoutModes, searchParams]);

  const activeFlow = useMemo(() => getFlowById(state.flowId), [state.flowId]);

  const handleRemove = (name: string) => {
    const newUploads = uploads.filter((file) => file.name !== name);
    setUploads(newUploads);
    updateState({ uploadedFiles: newUploads });
  };

  const handleMockUpload = () => {
    // Mock upload - add a file when button is clicked
    const newFile = { name: "Receipt.pdf", size: "184 KB", status: "uploaded" as const, date: "Jan 16" };
    const newUploads = [...uploads, newFile];
    setUploads(newUploads);
    updateState({ uploadedFiles: newUploads });
  };

  const handleNext = () => {
    updateState({ autoAnalyze });
    if (autoAnalyze) {
      goNext("docs");
    } else {
      goToStep("review");
    }
  };

  const isModal = layoutModes.entryMode === "modal";

  // Middle content (scrollable area)
  const middleContent = (
    <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-foreground">Do you have a receipt or documentation?</h2>
          <Info className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className={`rounded-lg border border-dashed bg-card p-6 ${isModal ? "w-full" : "max-w-2xl mx-auto"}`}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center">
              <WexButton intent="primary" className={isModal ? "w-full" : "min-w-[200px]"} onClick={handleMockUpload}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Valid Documentation
              </WexButton>
            </div>
          </div>
          {!hasUploads ? (
            <p className="mt-3 text-center text-sm text-muted-foreground">Drag and drop files here to upload.</p>
          ) : (
            <div className="mt-4 space-y-2">
              {uploads.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between rounded-lg border bg-muted px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-foreground">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.size} • Added {file.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <WexBadge intent="success" className="flex items-center gap-1 text-xs">
                      <Check className="h-3.5 w-3.5" />
                      Uploaded
                    </WexBadge>
                    <WexButton variant="ghost" size="sm" onClick={() => handleRemove(file.name)}>
                      <X className="h-4 w-4" />
                    </WexButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-start gap-2">
            <WexCheckbox
              id="auto-analyze"
              checked={autoAnalyze}
              onCheckedChange={(checked) => setAutoAnalyze(Boolean(checked))}
            />
            <WexLabel htmlFor="auto-analyze" className="flex items-center gap-1 text-sm text-foreground">
              Auto-analyze my claims info <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </WexLabel>
          </div>
          <p className="text-xs text-muted-foreground">
            We are unable to auto-analyze multiple documents.
          </p>
        </div>

        {/* Progress indicator at bottom for modal mode */}
        {isModal && (
          <div className="pt-4">
            <ProgressIndicator
              mode={layoutModes.progressMode}
              currentStep="docs"
              steps={activeFlow.getProgressSteps(state)}
            />
          </div>
        )}
      </div>
    );

  // Buttons (fixed at bottom)
  const buttons = (
    <div className="flex items-center justify-between">
      <WexButton 
        variant="ghost" 
        onClick={() => {
          if (isModal && onModalClose) {
            onModalClose();
          } else {
            navigate("/");
          }
        }}
      >
        Cancel
      </WexButton>
      <div className="flex items-center gap-2">
        <WexButton intent="secondary" onClick={() => goBack("docs")}>
          Previous
        </WexButton>
        <WexButton intent="primary" onClick={handleNext}>
          Next
        </WexButton>
      </div>
    </div>
  );

  // For modal mode, use fixed layout structure
  if (isModal) {
    return (
      <div className="flex flex-col h-full max-h-[90vh]">
        {/* Fixed header with title */}
        <div className="flex-shrink-0 px-6 pt-6 pb-4">
          <h1 className="text-[30px] font-bold leading-[40px] tracking-[-0.63px] text-foreground">Reimburse Myself</h1>
        </div>
        {/* Scrollable middle content */}
        <div className="flex-1 overflow-y-auto px-6">
          <div className="mx-auto max-w-[600px] space-y-6 py-4">
            {middleContent}
          </div>
        </div>
        {/* Fixed footer with buttons */}
        <div className="flex-shrink-0 px-6 pt-4 pb-6 border-t">
          {buttons}
        </div>
      </div>
    );
  }

  // For fullpage mode, use original structure
  const content = (
    <>
      {middleContent}
      {buttons}
    </>
  );

  // For fullpage mode, render with navigation and card wrapper
  return (
    <div className="min-h-screen bg-[#F1FAFE]">
      <ConsumerNavigation />

      <div className="mx-auto max-w-[1440px] px-8 py-8">
        <div className="mx-auto max-w-[1376px] space-y-6">
          <h1 className="text-[30px] font-bold leading-[40px] tracking-[-0.63px] text-foreground">Reimburse Myself</h1>

          <WexCard>
            <WexCard.Content className="space-y-6 p-6">
              <ProgressIndicator
                mode={layoutModes.progressMode}
                currentStep="docs"
                steps={activeFlow.getProgressSteps(state)}
              />
              <AvailableBalanceSection selectedAccount={state.account} />

              <WexSeparator />

              {content}
            </WexCard.Content>
          </WexCard>

          <WexAlert intent="default" className="bg-transparent p-0 text-xs text-muted-foreground">
            <WexAlert.Description>
              We collect information about the use of this portal (for example, how long you are on the
              portal, the pages you visit, etc.) so that we can understand and improve user experience.
              For more information about our privacy practices, click here.
            </WexAlert.Description>
          </WexAlert>
        </div>
      </div>
      <ModeSelector />
    </div>
  );
}

