import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ConsumerNavigation } from "../ConsumerNavigation";
import { useReimbursement } from "./ReimbursementContext";
import { getFlowById } from "./flow/registry";
import { useReimburseFlowNav } from "./hooks/useReimburseFlowNav";
import {
  WexButton,
  WexCard,
  WexFloatLabel,
  WexTextarea,
  WexRadioGroup,
  WexLabel,
  WexSeparator,
  WexAlert,
} from "@/components/wex";
import { AlertCircle } from "lucide-react";
import { AvailableBalanceSection, ProgressIndicator, ModeSelector } from "./components";

export default function ReimburseReview({
  onModalClose,
}: {
  onModalClose?: () => void;
} = {}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, updateState } = useReimbursement();
  const { goNext, goBack } = useReimburseFlowNav();

  const isModal = state.layoutModes.entryMode === "modal";

  // Get layout modes from URL params or state
  const layoutModes = useMemo(() => {
    const modes = { ...state.layoutModes };
    const progressMode = searchParams.get("progressMode");
    const reviewLayout = searchParams.get("reviewLayout");
    
    if (progressMode && ["none", "implicit", "stepper"].includes(progressMode)) {
      modes.progressMode = progressMode as "none" | "implicit" | "stepper";
    }
    if (reviewLayout && ["form", "summary", "split"].includes(reviewLayout)) {
      modes.reviewLayout = reviewLayout as "form" | "summary" | "split";
    }
    
    return modes;
  }, [state.layoutModes, searchParams]);

  const activeFlow = useMemo(() => getFlowById(state.flowId), [state.flowId]);

  // Use extracted data or fallback to form data
  const extractedData = state.extractedData || {};
  const formData = {
    startDate: extractedData.startDate || state.serviceDate || "06/20/2026",
    endDate: extractedData.endDate || state.serviceDate || "06/20/2026",
    amount: extractedData.amount || state.amount || "$150.00",
    provider: extractedData.provider || state.provider || "Dr. Jorge Doe",
    category: extractedData.category || state.category || "Medical",
    type: extractedData.type || "Office Visit",
    description: extractedData.description || "",
  };

  const recipient = state.recipient || "adam";
  const didDrive = state.didDrive || "no";

  const handleRecipientChange = (value: string) => {
    updateState({ recipient: value });
  };

  const handleDriveChange = (value: string) => {
    updateState({ didDrive: value });
  };

  // Middle content (scrollable area)
  const middleContent = (
    <>
      <AvailableBalanceSection selectedAccount={state.account} />

      <WexSeparator />

      <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-foreground">Uploaded document</h2>
                </div>
                <WexAlert intent="info" className="rounded-md bg-primary/5 px-3 py-2 text-xs text-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <WexAlert.Description>
                    The form has been pre-filled for your convenience. Please review and correct any errors to ensure accuracy.
                  </WexAlert.Description>
                </WexAlert>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-3">
                    <div className="grid gap-4">
                      <WexFloatLabel
                        label="Start Date of Service"
                        value={formData.startDate}
                        readOnly
                      />
                      <WexFloatLabel
                        label="End Date of Service"
                        value={formData.endDate}
                        readOnly
                      />
                      <WexFloatLabel
                        label="Amount"
                        value={formData.amount}
                        readOnly
                      />
                      <WexFloatLabel
                        label="Provider"
                        value={formData.provider}
                        readOnly
                      />
                      <WexFloatLabel
                        label="Category"
                        value={formData.category}
                        readOnly
                      />
                      <WexFloatLabel
                        label="Type"
                        value={formData.type}
                        readOnly
                      />
                      <div className="relative">
                        <WexTextarea
                          rows={3}
                          value={formData.description}
                          readOnly
                          placeholder=" "
                          className={`h-auto min-h-[80px] pt-5 pb-2 ${formData.description ? "has-value" : ""}`}
                        />
                        <label className={`absolute pointer-events-none origin-top-left transition-all duration-200 ease-out left-3 text-sm ${
                          formData.description 
                            ? "top-2 scale-75 -translate-y-2.5 text-wex-floatlabel-label-focus-fg" 
                            : "top-4 scale-100 translate-y-0 text-wex-floatlabel-label-fg"
                        }`}>
                          Description
                        </label>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">Recipient</p>
                        <WexRadioGroup value={recipient} onValueChange={handleRecipientChange} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <WexRadioGroup.Item value="adam" id="recipient-adam" />
                            <WexLabel htmlFor="recipient-adam" className="text-sm font-medium text-foreground">
                              Adam Smith
                            </WexLabel>
                          </div>
                          <WexButton intent="primary" variant="link" className="px-0 justify-start h-auto p-0">
                            + Add a dependent
                          </WexButton>
                        </WexRadioGroup>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">
                          Did you drive to receive this product or service?
                        </p>
                        <WexRadioGroup value={didDrive} onValueChange={handleDriveChange} className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <WexRadioGroup.Item value="yes" id="drive-yes" />
                            <WexLabel htmlFor="drive-yes" className="text-sm text-foreground">
                              Yes
                            </WexLabel>
                          </div>
                          <div className="flex items-center gap-2">
                            <WexRadioGroup.Item value="no" id="drive-no" />
                            <WexLabel htmlFor="drive-no" className="text-sm text-foreground">
                              No
                            </WexLabel>
                          </div>
                        </WexRadioGroup>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start justify-center lg:justify-end">
                    <div className="flex h-full w-full max-w-[360px] items-center justify-center rounded-md border bg-muted p-4">
                      <div className="h-[360px] w-[260px] rounded-sm bg-card shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>
          </>
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
      <div className="flex gap-2">
        <WexButton intent="secondary" onClick={() => goBack("review")}>
          Previous
        </WexButton>
        <WexButton intent="primary" onClick={() => goNext("review")}>
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
          <div className="space-y-6 py-4">
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
  return (
    <div className="min-h-screen bg-[#F1FAFE]">
      <ConsumerNavigation />

      <div className="mx-auto max-w-[1440px] px-8 py-8">
        <div className="mx-auto max-w-[1376px] space-y-8">
          <h1 className="text-[30px] font-bold leading-[40px] tracking-[-0.63px] text-foreground">Reimburse Myself</h1>

          <WexCard>
            <WexCard.Content className="space-y-6 p-6">
              <ProgressIndicator
                mode={layoutModes.progressMode}
                currentStep="review"
                steps={activeFlow.getProgressSteps(state)}
              />
              {middleContent}
              {buttons}
            </WexCard.Content>
          </WexCard>
        </div>
      </div>
      <ModeSelector />
    </div>
  );
}

