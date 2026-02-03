import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
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
  WexTooltip,
} from "@/components/wex";
import { Info, Upload, X, FileText, Check, ChevronRight, Smartphone } from "lucide-react";
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
  const [sessionId] = useState<string>(() => Math.random().toString(36).substring(7));

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

  // Get flowId from URL params or state
  const currentFlowId = useMemo(() => {
    const urlFlowId = searchParams.get("flowId");
    return urlFlowId || state.flowId;
  }, [searchParams, state.flowId]);

  const activeFlow = useMemo(() => getFlowById(currentFlowId), [currentFlowId]);
  
  // Vision 2 - AI First Intake uses reimburse-linear-v1 flow
  // Check both state.flowId and activeFlow.id for reliability
  const isVision2 = useMemo(() => {
    const flowId = currentFlowId || activeFlow.id;
    const isVision2Flow = flowId === "reimburse-linear-v1";
    const variant = searchParams.get("variant") || state.variant;
    const isVisionVariant = variant === "vision";
    return isVisionVariant && isVision2Flow;
  }, [currentFlowId, activeFlow.id, searchParams, state.variant]);

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

  const handleManualEntry = () => {
    // Navigate to manual entry flow (skip upload)
    updateState({ autoAnalyze: false });
    goToStep("review");
  };

  const isModal = layoutModes.entryMode === "modal";

  // Upload Zone Component
  const UploadZone = () => (
    <div className={`rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/5 p-8 transition-colors hover:bg-muted/10 ${hasUploads ? "border-primary/50 bg-primary/5" : ""}`}>
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">Click or drag to upload</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Upload your receipt (PDF, JPG, or PNG) and our AI will pre-fill the details for you.
          </p>
        </div>
        <div className="pt-2">
          <WexButton intent="primary" size="lg" className="min-w-[200px]" onClick={handleMockUpload}>
            Select File
          </WexButton>
        </div>
      </div>
    </div>
  );

  // File List Component
  const FileList = () => (
    <div className="space-y-3">
      {uploads.map((file) => (
        <div
          key={file.name}
          className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {file.size} • Added {file.date}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <WexBadge intent="success" className="flex items-center gap-1.5 px-2.5 py-0.5">
              <Check className="h-3.5 w-3.5" />
              Uploaded
            </WexBadge>
            <WexButton variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleRemove(file.name)}>
              <X className="h-4 w-4" />
            </WexButton>
          </div>
        </div>
      ))}
    </div>
  );

  // Sidebar Component (Mobile Upload & Manual Entry)
  const Sidebar = () => (
    <div className="space-y-6">
      {/* Mobile Upload Card */}
      <div className="rounded-xl border bg-blue-50/50 p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Smartphone className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Upload from mobile</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Receipt on your phone? Scan this code to sync instantly.
            </p>
          </div>
        </div>
        <div className="flex justify-center bg-white p-4 rounded-xl border shadow-sm max-w-[200px] mx-auto">
          <QRCodeSVG
            value={`${window.location.origin}/mobile-upload?session=${sessionId}`}
            size={120}
            level="H"
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Manual Entry Option */}
      <button 
        onClick={handleManualEntry}
        className="w-full group flex items-center justify-between p-4 rounded-xl border bg-card hover:border-primary/50 hover:shadow-md transition-all text-left"
      >
        <div className="space-y-1">
          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">No receipt?</h3>
          <p className="text-sm text-muted-foreground">Enter details manually</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </button>
    </div>
  );

  // Vision Layout
  const VisionLayout = () => (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-lg font-medium text-muted-foreground">
          Tell us about your expense to get your money back faster.
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {!hasUploads ? (
            <UploadZone />
          ) : (
            <div className="space-y-6">
              <FileList />
              <div className="flex items-center justify-center pt-4">
                <WexButton variant="outline" onClick={handleMockUpload}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Another File
                </WexButton>
              </div>
            </div>
          )}

          {/* Auto-analyze Toggle (Subtle) */}
          <div className="flex items-start gap-3 pt-4 px-4">
            <WexCheckbox
              id="auto-analyze"
              checked={autoAnalyze}
              onCheckedChange={(checked) => setAutoAnalyze(Boolean(checked))}
            />
            <div className="space-y-1">
              <WexLabel htmlFor="auto-analyze" className="font-medium cursor-pointer">
                Auto-analyze extracted details
              </WexLabel>
              <p className="text-xs text-muted-foreground">
                We'll scan your document and pre-fill the claim form for you to review.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="lg:col-span-1">
          <Sidebar />
        </div>
      </div>
    </div>
  );

  // Legacy/MVP Content
  const LegacyContent = (
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
              id="auto-analyze-legacy"
              checked={autoAnalyze}
              onCheckedChange={(checked) => setAutoAnalyze(Boolean(checked))}
            />
            <WexLabel htmlFor="auto-analyze-legacy" className="flex items-center gap-1 text-sm text-foreground">
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
    <div className="flex items-center justify-between pt-6 border-t mt-8">
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
        <WexButton intent="primary" onClick={handleNext} disabled={!hasUploads && autoAnalyze}>
          Next
        </WexButton>
      </div>
    </div>
  );

  // Determine content based on variant - Vision 2 gets the new layout
  // Debug: Log the values to help troubleshoot
  console.log("ReimburseDocs Debug:", {
    variant: state.variant,
    flowId: state.flowId,
    currentFlowId,
    activeFlowId: activeFlow.id,
    isVision2,
    searchParams: Object.fromEntries(searchParams.entries())
  });
  
  const content = isVision2 ? <VisionLayout /> : LegacyContent;

  // For modal mode
  if (isModal) {
    return (
      <div className="flex flex-col h-full max-h-[90vh]">
        {/* Fixed header with title */}
        <div className="flex-shrink-0 px-6 pt-6 pb-4">
          <h1 className="text-[30px] font-bold leading-[40px] tracking-[-0.63px] text-foreground">Reimburse Myself</h1>
        </div>
        {/* Scrollable middle content */}
        <div className="flex-1 overflow-y-auto px-6">
          <div className="mx-auto max-w-[1000px] space-y-6 py-4">
            {content}
          </div>
        </div>
        {/* Fixed footer with buttons */}
        <div className="flex-shrink-0 px-6 pb-6 bg-background">
          {buttons}
        </div>
      </div>
    );
  }

  // For fullpage mode
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
              {buttons}
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