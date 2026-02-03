import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ConsumerNavigation } from "../ConsumerNavigation";
import { useReimbursement } from "./ReimbursementContext";
import { EntryWrapper, ModeSelector, ProgressIndicator } from "./components";
import { getFlowById } from "./flow/registry";
import {
  WexButton,
  WexCard,
  WexInput,
  WexLabel,
  WexRadioGroup,
  WexSeparator,
  WexSpinner,
} from "@/components/wex";
import { Baby, Car, Pill, Stethoscope, Upload } from "lucide-react";
import { PlanCard } from "./components/PlanCard";
import { getAllPlans, getPlanCardData } from "./components/planData";

type WizardStepId = "expenseType" | "plan" | "upload" | "review" | "confirm";

const wizardSteps: Array<{ id: WizardStepId; label: string }> = [
  { id: "expenseType", label: "Expense Type" },
  { id: "plan", label: "Plan & Balance" },
  { id: "upload", label: "Upload Receipt" },
  { id: "review", label: "Confirm Details" },
];

const expenseTypeOptions = [
  {
    value: "medical-dental-vision",
    label: "Medical / Dental / Vision",
    icon: Stethoscope,
  },
  { value: "prescription", label: "Prescription", icon: Pill },
  { value: "dependent-care", label: "Dependent care", icon: Baby },
  { value: "transportation", label: "Transportation / Parking", icon: Car },
  { value: "other", label: "Other" },
];

export default function ReimburseWizard({
  skipEntryWrapper = false,
  onModalClose,
}: {
  skipEntryWrapper?: boolean;
  onModalClose?: () => void;
} = {}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, updateState } = useReimbursement();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showPlanPicker, setShowPlanPicker] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; previewUrl?: string } | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSkipped, setUploadSkipped] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const layoutModes = useMemo(() => {
    const modes = { ...state.layoutModes };
    const entryMode = searchParams.get("entryMode");
    const progressMode = searchParams.get("progressMode");

    if (entryMode && ["fullpage", "modal", "drawer"].includes(entryMode)) {
      modes.entryMode = entryMode as "fullpage" | "modal" | "drawer";
    }
    if (progressMode && ["none", "implicit", "stepper"].includes(progressMode)) {
      modes.progressMode = progressMode as "none" | "implicit" | "stepper";
    }

    return modes;
  }, [state.layoutModes, searchParams]);

  const activeFlow = useMemo(() => getFlowById(state.flowId), [state.flowId]);
  const currentStep = wizardSteps[currentStepIndex];
  const plans = useMemo(() => getAllPlans(), []);

  useEffect(() => {
    const flowIdParam = searchParams.get("flowId");
    if (flowIdParam) {
      updateState({ flowId: flowIdParam });
      return;
    }
    if (state.flowId !== "vision-wizard-v1") {
      updateState({ flowId: "vision-wizard-v1" });
    }
  }, [searchParams, state.flowId, updateState]);

  useEffect(() => {
    if (!state.account) {
      updateState({ account: plans[0]?.value ?? "medical-fsa" });
    }
  }, [plans, state.account, updateState]);

  useEffect(() => {
    const previewUrl = uploadedFile?.previewUrl;
    if (!previewUrl) {
      return;
    }
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [uploadedFile]);

  const handleBack = () => {
    if (currentStepIndex === 0) {
      if (onModalClose) {
        onModalClose();
        return;
      }
      navigate("/reimburse");
      return;
    }
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentStepIndex((prev) => Math.min(wizardSteps.length - 1, prev + 1));
  };

  const goToStep = (stepId: WizardStepId) => {
    const nextIndex = wizardSteps.findIndex((step) => step.id === stepId);
    if (nextIndex >= 0) {
      setCurrentStepIndex(nextIndex);
    }
  };

  const handleUploadChange = (file: File | null) => {
    setUploadError(null);
    if (!file) {
      setUploadedFile(null);
      return;
    }
    setUploadSkipped(false);
    const isAllowed = file.type.startsWith("image/") || file.type === "application/pdf";
    if (!isAllowed) {
      setUploadError("We couldn't read that file. Please upload a photo or PDF receipt.");
      setUploadedFile(null);
      return;
    }
    const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
    setUploadedFile({ name: file.name, previewUrl });
    updateState({
      amount: state.amount || "120.00",
      serviceDate: state.serviceDate || new Date().toISOString().slice(0, 10),
      uploadedFiles: [
        {
          name: file.name,
          size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
          date: new Date().toLocaleDateString("en-US"),
          status: "uploaded",
        },
      ],
    });
    setIsReading(true);
    setTimeout(() => setIsReading(false), 1200);
  };

  const handleSkipUpload = () => {
    setUploadSkipped(true);
    setUploadedFile(null);
    setUploadError(null);
    setIsReading(false);
    updateState({
      uploadedFiles: [],
      amount: "",
      serviceDate: "",
    });
    handleNext();
  };

  const selectedPlanData = getPlanCardData(state.account || "medical-fsa");
  const isNextDisabled = (() => {
    if (currentStep.id === "expenseType") {
      return !state.category;
    }
    if (currentStep.id === "upload") {
      return !uploadedFile;
    }
    if (currentStep.id === "review") {
      return !state.amount || !state.serviceDate || !uploadedFile;
    }
    return false;
  })();
  const nextLabel = currentStep.id === "plan" ? "Yes, continue" : "Continue";

  const renderStepContent = () => {
    switch (currentStep.id) {
      case "expenseType":
        return (
          <div className="space-y-4">
            <WexLabel className="text-sm text-muted-foreground">Select an expense type</WexLabel>
            <WexRadioGroup
              value={state.category}
              onValueChange={(value) => updateState({ category: value })}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {expenseTypeOptions.map((option) => {
                  const isSelected = state.category === option.value;
                  const Icon = option.icon;
                  return (
                    <label
                      key={option.value}
                      htmlFor={`expense-${option.value}`}
                      className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors ${
                        isSelected ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <WexRadioGroup.Item
                        id={`expense-${option.value}`}
                        value={option.value}
                        className="mt-1"
                      />
                      <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                        {option.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </WexRadioGroup>
          </div>
        );
      case "plan":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <WexLabel className="text-sm text-muted-foreground">Confirm plan and balance</WexLabel>
              {plans.length > 1 ? (
                <WexButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPlanPicker((prev) => !prev)}
                >
                  {showPlanPicker ? "Hide plans" : "Change plan"}
                </WexButton>
              ) : null}
            </div>
            {!showPlanPicker ? (
              <PlanCard {...selectedPlanData} selected />
            ) : (
              <div className="flex flex-wrap gap-3">
                {plans.map((plan) => (
                  <PlanCard
                    key={plan.value}
                    {...plan.data}
                    selected={plan.value === state.account}
                    onSelect={() => {
                      updateState({ account: plan.value });
                      setShowPlanPicker(false);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        );
      case "upload":
        return (
          <div className="space-y-4">
            <div className="rounded-md border border-dashed border-border p-6 text-sm text-muted-foreground max-w-md mx-auto text-center">
              <div className="space-y-2 flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium">Upload receipt</p>
                <p>Photos or PDF files are accepted.</p>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*,application/pdf"
                  onChange={(event) => handleUploadChange(event.target.files?.[0] ?? null)}
                />
                <WexButton
                  intent="primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose file
                </WexButton>
                {uploadedFile ? (
                  <span className="text-foreground text-sm">{uploadedFile.name}</span>
                ) : null}
              </div>
              {isReading ? (
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <WexSpinner className="h-4 w-4" />
                  Reading…
                </div>
              ) : null}
              {uploadError ? (
                <p className="mt-3 text-sm text-muted-foreground">{uploadError}</p>
              ) : null}
              {!uploadError && uploadedFile && !isReading ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  We’ll extract the details and let you review before submitting.
                </p>
              ) : null}
            </div>
          </div>
        );
      case "review":
        return (
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">Expense type</div>
              <WexButton variant="ghost" size="sm" onClick={() => goToStep("expenseType")}>
                Edit
              </WexButton>
            </div>
            <div className="text-foreground font-medium">
              {expenseTypeOptions.find((option) => option.value === state.category)?.label || "—"}
            </div>
            <WexSeparator />
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">Plan</div>
              <WexButton variant="ghost" size="sm" onClick={() => goToStep("plan")}>
                Edit
              </WexButton>
            </div>
            <div className="text-foreground font-medium">{selectedPlanData.title}</div>
            <WexSeparator />
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">Amount & date</div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <WexLabel className="text-xs text-muted-foreground">Amount</WexLabel>
                <WexInput
                  type="text"
                  placeholder="$0.00"
                  value={state.amount}
                  onChange={(event) => updateState({ amount: event.target.value })}
                />
              </div>
              <div className="space-y-1">
                <WexLabel className="text-xs text-muted-foreground">Date of service</WexLabel>
                <WexInput
                  type="date"
                  value={state.serviceDate}
                  onChange={(event) => updateState({ serviceDate: event.target.value })}
                />
              </div>
            </div>
            <WexSeparator />
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">Receipt</div>
              <WexButton variant="ghost" size="sm" onClick={() => goToStep("upload")}>
                Edit
              </WexButton>
            </div>
            <div className="flex items-center gap-3">
              {uploadedFile?.previewUrl ? (
                <img
                  src={uploadedFile.previewUrl}
                  alt="Receipt preview"
                  className="h-16 w-16 rounded border border-border object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded border border-border bg-muted" />
              )}
              <div className="text-foreground">
                {uploadedFile?.name || (uploadSkipped ? "Receipt skipped" : "No receipt uploaded")}
              </div>
            </div>
          </div>
        );
      case "confirm":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">You’re all set</h2>
              <p className="text-sm text-muted-foreground">
                We’ve received your reimbursement request.
              </p>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• We’ll review your receipt within 1–2 business days.</li>
              <li>• We’ll notify you if anything is missing.</li>
              <li>• Approved reimbursements post to your account automatically.</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  const content = (
    <div className="min-h-screen bg-background">
      <ConsumerNavigation />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-foreground">Reimburse Myself</h1>
            <p className="text-sm text-muted-foreground">Answer a few quick questions to get started.</p>
          </div>
        </div>
        <ProgressIndicator
          mode={layoutModes.progressMode}
          currentStep={currentStep.id}
          steps={activeFlow.getProgressSteps(state)}
          skippedStepIds={uploadSkipped ? ["upload"] : []}
        />
        <WexCard>
          <WexCard.Header className="space-y-2">
            <WexLabel className="text-xs uppercase text-muted-foreground">
              Step {currentStepIndex + 1} of {wizardSteps.length}
            </WexLabel>
            <WexCard.Title>{currentStep.label}</WexCard.Title>
          </WexCard.Header>
          <WexCard.Content className="space-y-6">
            {renderStepContent()}
            <div className="flex items-center justify-between">
              <WexButton variant="outline" onClick={handleBack}>
                Back
              </WexButton>
              {currentStep.id === "review" ? (
                <WexButton
                  onClick={() => {
                    navigate("/reimburse/wizard/success");
                  }}
                  disabled={isNextDisabled}
                >
                  Submit reimbursement
                </WexButton>
              ) : currentStep.id === "upload" ? (
                <div className="flex items-center gap-2">
                  <WexButton variant="outline" onClick={handleSkipUpload}>
                    Skip
                  </WexButton>
                  <WexButton onClick={handleNext} disabled={isNextDisabled}>
                    {nextLabel}
                  </WexButton>
                </div>
              ) : (
                <WexButton onClick={handleNext} disabled={isNextDisabled}>
                  {nextLabel}
                </WexButton>
              )}
            </div>
          </WexCard.Content>
        </WexCard>
      </div>
      <ModeSelector />
    </div>
  );

  if (skipEntryWrapper) {
    return content;
  }

  return <EntryWrapper mode={layoutModes.entryMode}>{content}</EntryWrapper>;
}

