import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ConsumerNavigation } from "../ConsumerNavigation";
import { useReimbursement } from "./ReimbursementContext";
import { getFlowById } from "./flow/registry";
import { useReimburseFlowNav } from "./hooks/useReimburseFlowNav";
import {
  WexButton,
  WexCard,
  WexTable,
  WexCheckbox,
  WexAlert,
  WexSeparator,
  WexLabel,
} from "@/components/wex";
import { Pencil, ShoppingCart, CheckCircle2, X, ChevronDown, ChevronRight } from "lucide-react";
import { AvailableBalanceSection, ProgressIndicator, ModeSelector } from "./components";

export default function ReimburseConfirm({
  onModalClose,
}: {
  onModalClose?: () => void;
} = {}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, updateState } = useReimbursement();
  const { goBack } = useReimburseFlowNav();

  const isModal = state.layoutModes.entryMode === "modal";

  // Get layout modes from URL params or state
  const layoutModes = useMemo(() => {
    const modes = { ...state.layoutModes };
    const progressMode = searchParams.get("progressMode");
    
    if (progressMode && ["none", "implicit", "stepper"].includes(progressMode)) {
      modes.progressMode = progressMode as "none" | "implicit" | "stepper";
    }
    
    return modes;
  }, [state.layoutModes, searchParams]);
  const activeFlow = useMemo(() => getFlowById(state.flowId), [state.flowId]);
  const [acceptedTerms, setAcceptedTerms] = useState(state.acceptedTerms || false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleSubmit = () => {
    if (acceptedTerms) {
      setShowSuccessBanner(true);
      updateState({ acceptedTerms: true });
    }
  };

  const toggleRow = (rowId: string) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };

  // Get form data from state
  const getAccountLabel = (accountValue: string) => {
    if (accountValue === "medical-fsa") return "Medical FSA";
    if (accountValue === "lifestyle-spending-2026") return "Lifestyle Spending Account 2026";
    if (accountValue === "lifestyle-spending-2025") return "Lifestyle Spending Account 2025";
    return "Medical FSA";
  };
  const accountLabel = getAccountLabel(state.account);
  const recipientLabel = state.category === "me" ? "Me" : state.category === "provider" ? "Provider" : "Dependent";
  const expenseLabel = state.category || "Office Visit";
  const amount = state.amount || "$150.00";
  const approvedAmount = amount;

  // Middle content (scrollable area)
  const middleContent = (
    <>
      {showSuccessBanner && (
        <WexAlert intent="success" className="w-full">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <CheckCircle2 className="h-5 w-5 text-success mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="text-success font-semibold text-sm mb-1">Claim Approved!</div>
                <div className="text-foreground text-sm">
                  Great news! Your claim has been approved. You will be paid out according to account setup.
                </div>
              </div>
            </div>
            <WexButton
              variant="ghost"
              size="sm"
              className="h-6 w-6 text-success hover:text-success hover:bg-success/10 shrink-0"
              onClick={() => setShowSuccessBanner(false)}
            >
              <X className="h-4 w-4" />
            </WexButton>
          </div>
        </WexAlert>
      )}

      <AvailableBalanceSection selectedAccount={state.account} />

      <WexSeparator />

      <div className="space-y-4">
                <h2 className="text-base font-semibold text-foreground">Transaction Summary</h2>
                <div className="overflow-hidden rounded-md border">
                  <WexTable>
                    <WexTable.Header>
                      <WexTable.Row>
                        <WexTable.Head className="text-xs font-medium">From</WexTable.Head>
                        <WexTable.Head className="text-xs font-medium">To</WexTable.Head>
                        <WexTable.Head className="text-xs font-medium">Expense</WexTable.Head>
                        <WexTable.Head className="text-right text-xs font-medium">Amount</WexTable.Head>
                        <WexTable.Head className="text-right text-xs font-medium">Approved Amount</WexTable.Head>
                        {!showSuccessBanner && (
                          <WexTable.Head className="text-right text-xs font-medium">Actions</WexTable.Head>
                        )}
                      </WexTable.Row>
                    </WexTable.Header>
                    <WexTable.Body>
                      <>
                        <WexTable.Row>
                          <WexTable.Cell>
                            <WexButton
                              variant="ghost"
                              onClick={() => toggleRow("claim-1")}
                              className="flex items-center gap-2 hover:opacity-80 transition-opacity h-auto p-0"
                            >
                              {expandedRow === "claim-1" ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span>{accountLabel}</span>
                            </WexButton>
                          </WexTable.Cell>
                          <WexTable.Cell>{recipientLabel}</WexTable.Cell>
                          <WexTable.Cell>{expenseLabel}</WexTable.Cell>
                          <WexTable.Cell className="text-right">{amount}</WexTable.Cell>
                          <WexTable.Cell className="text-right">{approvedAmount}</WexTable.Cell>
                          {!showSuccessBanner && (
                            <WexTable.Cell className="text-right">
                              <div className="flex items-center justify-end gap-3">
                                <WexButton intent="primary" variant="link" className="text-xs h-auto p-0 text-destructive hover:underline">
                                  Remove
                                </WexButton>
                                <WexButton intent="secondary" size="sm" className="h-7 px-3">
                                  <Pencil className="h-3.5 w-3.5" />
                                  Edit
                                </WexButton>
                              </div>
                            </WexTable.Cell>
                          )}
                        </WexTable.Row>
                        {expandedRow === "claim-1" && (
                          <WexTable.Row>
                            <WexTable.Cell colSpan={showSuccessBanner ? 5 : 6} className="bg-muted">
                              <div className="px-4 py-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground mb-1">Provider</p>
                                    <p className="font-medium text-foreground">{state.provider || "Dr. Jorge Doe"}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground mb-1">Date of Service</p>
                                    <p className="font-medium text-foreground">{state.serviceDate || "06/20/2026"}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground mb-1">Category</p>
                                    <p className="font-medium text-foreground">{state.category || "Medical"}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground mb-1">Type</p>
                                    <p className="font-medium text-foreground">Office Visit</p>
                                  </div>
                                  <div className="col-span-2">
                                    <p className="text-muted-foreground mb-1">Description</p>
                                    <p className="font-medium text-foreground">Office visit for routine checkup</p>
                                  </div>
                                </div>
                              </div>
                            </WexTable.Cell>
                          </WexTable.Row>
                        )}
                      </>
                    </WexTable.Body>
                  </WexTable>
                </div>
                {!showSuccessBanner && (
                  <WexButton intent="secondary" className="w-fit">
                    + Add Another
                  </WexButton>
                )}
              </div>

              {!showSuccessBanner && (
                <>
                  <WexSeparator />

                  <div className="space-y-3">
                    <h3 className="text-base font-semibold text-foreground">Claims Terms and Conditions</h3>
                    <WexCard>
                      <WexCard.Content className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <WexCheckbox
                            id="terms"
                            checked={acceptedTerms}
                            onCheckedChange={(checked) => {
                              const newValue = Boolean(checked);
                              setAcceptedTerms(newValue);
                              updateState({ acceptedTerms: newValue });
                            }}
                          />
                          <WexLabel htmlFor="terms" className="text-sm text-foreground leading-relaxed">
                            I have read, understand, and agree to the{" "}
                            <WexButton intent="primary" variant="link" className="h-auto p-0 underline-offset-2">
                              Terms and Conditions
                            </WexButton>
                            .
                          </WexLabel>
                        </div>
                      </WexCard.Content>
                    </WexCard>
                  </div>
                </>
              )}
          </>
        );

  // Buttons (fixed at bottom)
  const buttons = !showSuccessBanner ? (
    <div className="flex items-center justify-between">
      <WexButton intent="secondary" onClick={() => goBack("confirm")}>
        Previous
      </WexButton>
      <div className="flex gap-3">
        <WexButton variant="ghost">
          <ShoppingCart className="h-4 w-4" />
          Save for Later
        </WexButton>
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
        <WexButton intent="primary" disabled={!acceptedTerms} onClick={handleSubmit}>
          Submit
        </WexButton>
      </div>
    </div>
  ) : null;

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
        {buttons && (
          <div className="flex-shrink-0 px-6 pt-4 pb-6 border-t">
            {buttons}
          </div>
        )}
      </div>
    );
  }

  // For fullpage mode, use original structure
  return (
    <div className="min-h-screen bg-[#F1FAFE]">
      <ConsumerNavigation />

      <div className="mx-auto max-w-[1440px] px-8 py-8">
        <div className="mx-auto max-w-[1376px] space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-[30px] font-bold leading-[40px] tracking-[-0.63px] text-foreground">Reimburse Myself</h1>
          </div>

          <WexCard>
            <WexCard.Content className="space-y-6 p-6">
              <ProgressIndicator
                mode={layoutModes.progressMode}
                currentStep="confirm"
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

