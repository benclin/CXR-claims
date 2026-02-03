import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { WexCard, WexButton, WexLabel, WexSwitch, WexRadioGroup, WexSelect } from "@/components/wex";
import { Settings, X, Copy } from "lucide-react";
import { useReimbursement } from "../ReimbursementContext";
import { FLOW_REGISTRY } from "../flow/registry";
import { getPresetById } from "../config/variationPresets";

/**
 * ModeSelector Component
 * 
 * Dev/demo tool for toggling layout modes.
 * Always visible for prototype layout testing.
 */
export function ModeSelector() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { state, updateLayoutModes, updateState } = useReimbursement();
  const [isOpen, setIsOpen] = useState(false);
  const flowOptions = useMemo(() => Object.values(FLOW_REGISTRY), []);
  const isHome = location.pathname === "/" || location.pathname === "";
  const allHomePresets = useMemo(
    () =>
      [
        // MVP fullpage presets
        getPresetById("mvp-fullpage-standard"),
        getPresetById("mvp-fullpage-cards"),
        // MVP modal presets
        getPresetById("mvp-modal-standard"),
        getPresetById("mvp-modal-cards"),
        // Vision fullpage presets
        getPresetById("vision-wizard-fullpage"),
        getPresetById("vision-fullpage-stepper"),
        // Vision modal presets
        getPresetById("vision-wizard-modal"),
        getPresetById("vision-modal-stepper"),
      ].filter(
        (preset): preset is NonNullable<ReturnType<typeof getPresetById>> => Boolean(preset)
      ),
    []
  );

  // Determine which settings are relevant for the current page
  const relevantSettings = useMemo(() => {
    const path = location.pathname;
    
    // Homepage - only Entry Mode
    if (path === "/" || path === "") {
      return ["entryMode"];
    }
    
    // Reimburse Myself page - Entry Mode, Plan Selection, Progress
    if (path === "/reimburse" || path === "/reimburse/") {
      return ["entryMode", "planSelectionMode", "progressMode"];
    }
    
    // Reimburse Docs page - Progress, Upload Layout
    if (path === "/reimburse/docs") {
      return ["progressMode", "uploadLayout"];
    }
    
    // Reimburse Analyze page - Progress, AI Communication
    if (path === "/reimburse/analyze") {
      return ["progressMode", "aiCommunication"];
    }
    
    // Reimburse Review page - Progress, Review Layout
    if (path === "/reimburse/review") {
      return ["progressMode", "reviewLayout"];
    }
    
    // Reimburse Confirm page - Progress only
    if (path === "/reimburse/confirm") {
      return ["progressMode"];
    }
    
    // Default: show all settings for other pages
    return ["entryMode", "planSelectionMode", "progressMode", "uploadLayout", "reviewLayout", "aiCommunication"];
  }, [location.pathname]);

  useEffect(() => {
    // Sync URL params to state on mount
    const entryMode = searchParams.get("entryMode");
    const planSelectionMode = searchParams.get("planSelectionMode");
    const progressMode = searchParams.get("progressMode");
    const uploadLayout = searchParams.get("uploadLayout");
    const reviewLayout = searchParams.get("reviewLayout");
    const aiCommunication = searchParams.get("aiCommunication");
    const variant = searchParams.get("variant");
    const flowId = searchParams.get("flowId");

    const updates: Partial<typeof state.layoutModes> = {};
    if (entryMode && ["fullpage", "modal", "drawer"].includes(entryMode)) {
      updates.entryMode = entryMode as "fullpage" | "modal" | "drawer";
    }
    if (planSelectionMode && ["dropdown", "cards"].includes(planSelectionMode)) {
      updates.planSelectionMode = planSelectionMode as "dropdown" | "cards";
    }
    if (progressMode && ["none", "implicit", "stepper"].includes(progressMode)) {
      updates.progressMode = progressMode as "none" | "implicit" | "stepper";
    }
    if (uploadLayout && ["standard", "compact", "split"].includes(uploadLayout)) {
      updates.uploadLayout = uploadLayout as "standard" | "compact" | "split";
    }
    if (reviewLayout && ["form", "summary", "split"].includes(reviewLayout)) {
      updates.reviewLayout = reviewLayout as "form" | "summary" | "split";
    }
    if (aiCommunication && ["minimal", "detailed", "prominent"].includes(aiCommunication)) {
      updates.aiCommunication = aiCommunication as "minimal" | "detailed" | "prominent";
    }

    if (Object.keys(updates).length > 0) {
      updateLayoutModes(updates);
    }

    // Sync variant from URL
    if (variant && ["mvp", "vision"].includes(variant)) {
      updateState({ variant: variant as "mvp" | "vision" });
    }
    if (flowId) {
      updateState({ flowId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Sync when URL params change

  const handleModeChange = (key: keyof typeof state.layoutModes, value: string, closeAfterChange = false) => {
    updateLayoutModes({ [key]: value });
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    newParams.set(key, value);
    setSearchParams(newParams, { replace: true });
    
    // Close selector if requested (for button clicks on homepage)
    if (closeAfterChange) {
      setIsOpen(false);
    }
  };

  const handleVariantChange = (value: string) => {
    const newVariant = value as "mvp" | "vision";
    updateState({ variant: newVariant });
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    newParams.set("variant", newVariant);
    setSearchParams(newParams, { replace: true });
  };

  const handleFlowChange = (value: string) => {
    updateState({ flowId: value });
    const newParams = new URLSearchParams(searchParams);
    newParams.set("flowId", value);
    setSearchParams(newParams, { replace: true });

    const selectedFlow = FLOW_REGISTRY[value];
    if (!selectedFlow) {
      return;
    }

    if (selectedFlow.mode === "wizard") {
      if (location.pathname !== "/reimburse/wizard") {
        navigate("/reimburse/wizard");
      }
      return;
    }

    const currentPath = location.pathname;
    const matchesCurrent = selectedFlow.steps.some((step) => step.path === currentPath);
    if (!matchesCurrent) {
      const firstPath = selectedFlow.steps.find((step) => step.path)?.path;
      if (firstPath) {
        navigate(firstPath);
      }
    }
  };

  const applyPreset = (preset: NonNullable<ReturnType<typeof getPresetById>>) => {
    updateState({ variant: preset.variant, flowId: preset.flowId ?? state.flowId });
    updateLayoutModes(preset.layoutModes);

    const newParams = new URLSearchParams(searchParams);
    newParams.set("variant", preset.variant);
    if (preset.flowId) {
      newParams.set("flowId", preset.flowId);
    }
    (Object.entries(preset.layoutModes) as Array<[keyof typeof preset.layoutModes, string]>).forEach(
      ([key, value]) => newParams.set(String(key), value)
    );
    setSearchParams(newParams, { replace: true });
    setIsOpen(false);
  };

  const handleEntryModeChange = (value: string) => {
    handleModeChange("entryMode", value as "fullpage" | "modal");
  };

  const hasCustomizableOptions =
    relevantSettings.includes("planSelectionMode") ||
    relevantSettings.includes("progressMode") ||
    relevantSettings.includes("uploadLayout") ||
    relevantSettings.includes("reviewLayout") ||
    relevantSettings.includes("aiCommunication");

  return (
    <>
      {/* Toggle Button */}
      <div className="fixed bottom-6 left-6 z-[100]">
        <WexButton
          intent="secondary"
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          <Settings className="h-5 w-5" />
        </WexButton>
      </div>

      {/* Mode Selector Panel */}
      {isOpen && (
        <div 
          className="fixed bottom-24 left-6 z-[100] w-80"
        >
          <WexCard className="shadow-xl">
            <WexCard.Header className="flex flex-row items-center justify-between space-y-0 pb-4">
              <WexCard.Title className="text-base">Prototype Variations</WexCard.Title>
              <WexButton
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </WexButton>
            </WexCard.Header>
            <WexCard.Content className="space-y-4">
              {/* Mode Selector - Toggle Buttons */}
              <div className="space-y-1.5">
                <WexLabel className="text-xs">Mode</WexLabel>
                <div className="flex items-center gap-2">
                  <WexButton
                    variant={state.variant === "mvp" ? "solid" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleVariantChange("mvp")}
                  >
                    MVP
                  </WexButton>
                  <WexButton
                    variant={state.variant === "vision" ? "solid" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleVariantChange("vision")}
                  >
                    Vision
                  </WexButton>
                </div>
              </div>

              {/* Entry Mode Selector - Toggle Buttons (Homepage only) */}
              {isHome ? (
                <div className="space-y-1.5">
                  <WexLabel className="text-xs">Entry</WexLabel>
                  <div className="flex items-center gap-2">
                    <WexButton
                      variant={state.layoutModes.entryMode === "fullpage" ? "solid" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEntryModeChange("fullpage")}
                    >
                      Full Page
                    </WexButton>
                    <WexButton
                      variant={state.layoutModes.entryMode === "modal" ? "solid" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEntryModeChange("modal")}
                    >
                      Modal
                    </WexButton>
                  </div>
                </div>
              ) : null}

              {/* Preset Options (Homepage only) */}
              {isHome ? (
                <div className="space-y-2">
                  <WexLabel className="text-xs">
                    {state.variant === "mvp" ? "MVP" : "Vision"} Variants
                  </WexLabel>
                  <div className="space-y-2">
                    {allHomePresets
                      .filter(
                        (preset) =>
                          preset.variant === state.variant &&
                          preset.layoutModes.entryMode === state.layoutModes.entryMode
                      )
                      .map((preset) => {
                        const isSelected = 
                          preset.variant === state.variant && 
                          preset.layoutModes.entryMode === state.layoutModes.entryMode &&
                          (preset.flowId ? preset.flowId === state.flowId : true) &&
                          preset.layoutModes.planSelectionMode === state.layoutModes.planSelectionMode;
                        
                        return (
                          <WexButton
                            key={preset.id}
                            variant={isSelected ? "solid" : "outline"}
                            size="sm"
                            className="w-full justify-start h-auto py-2"
                            onClick={() => applyPreset(preset)}
                          >
                            <div className="text-left w-full">
                              <div className="font-medium truncate">{preset.name}</div>
                              <div className={`text-xs line-clamp-2 ${isSelected ? "text-white" : "text-muted-foreground"}`}>
                                {preset.description}
                              </div>
                            </div>
                          </WexButton>
                        );
                      })}
                  </div>
                </div>
              ) : (
                <>
                  {/* Mode Selector - Toggle Buttons (Non-homepage only) */}
                  <div className="space-y-1.5">
                    <WexLabel className="text-xs">Mode</WexLabel>
                    <div className="flex items-center gap-2">
                      <WexButton
                        variant={state.variant === "mvp" ? "solid" : "outline"}
                        size="sm"
                        className="flex-1"
                        onClick={() => handleVariantChange("mvp")}
                      >
                        MVP
                      </WexButton>
                      <WexButton
                        variant={state.variant === "vision" ? "solid" : "outline"}
                        size="sm"
                        className="flex-1"
                        onClick={() => handleVariantChange("vision")}
                      >
                        Vision
                      </WexButton>
                    </div>
                  </div>

                  {/* Flow Selector - Only show for Vision mode when not on homepage */}
                  {state.variant === "vision" ? (
                    <div className="space-y-1.5">
                      <WexLabel className="text-xs">Flow</WexLabel>
                      <WexSelect
                        value={state.flowId}
                        onValueChange={handleFlowChange}
                      >
                        <WexSelect.Trigger className="w-full">
                          <WexSelect.Value placeholder="Select flow" />
                        </WexSelect.Trigger>
                        <WexSelect.Content className="z-[200]">
                          {flowOptions.map((flow) => (
                            <WexSelect.Item key={flow.id} value={flow.id}>
                              {flow.name}
                            </WexSelect.Item>
                          ))}
                        </WexSelect.Content>
                      </WexSelect>
                    </div>
                  ) : null}
                </>
              )}

              {/* Entry Mode Selector - Toggle Buttons (Non-homepage only) */}
              {relevantSettings.includes("entryMode") && !isHome && (
                <div className="space-y-1.5">
                  <WexLabel className="text-xs">Entry</WexLabel>
                  <div className="flex items-center gap-2">
                    <WexButton
                      variant={state.layoutModes.entryMode === "fullpage" ? "solid" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEntryModeChange("fullpage")}
                    >
                      Full Page
                    </WexButton>
                    <WexButton
                      variant={state.layoutModes.entryMode === "modal" ? "solid" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEntryModeChange("modal")}
                    >
                      Modal
                    </WexButton>
                  </div>
                </div>
              )}

              {/* Customize Page - Only show when options are available */}
              {hasCustomizableOptions && (
                <div className="space-y-4">
                  <WexLabel className="text-xs">Customize Page</WexLabel>

                  {/* Page Layouts - Radio Group (2 options) */}
                  {relevantSettings.includes("planSelectionMode") && (
                    <div className="space-y-2">
                      <WexRadioGroup
                        value={state.layoutModes.planSelectionMode}
                        onValueChange={(value) => handleModeChange("planSelectionMode", value)}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <WexRadioGroup.Item value="dropdown" id="plan-dropdown" />
                            <WexLabel htmlFor="plan-dropdown" className="text-xs font-normal cursor-pointer">
                              Drop Downs
                            </WexLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <WexRadioGroup.Item value="cards" id="plan-cards" />
                            <WexLabel htmlFor="plan-cards" className="text-xs font-normal cursor-pointer">
                              Card Selector
                            </WexLabel>
                          </div>
                        </div>
                      </WexRadioGroup>
                    </div>
                  )}

                  {/* Progress Indicator - Toggle (on/off) */}
                  {relevantSettings.includes("progressMode") && (
                    <div className="flex items-center justify-between">
                      <WexLabel className="text-xs">Progress Stepper</WexLabel>
                      <WexSwitch
                        checked={state.layoutModes.progressMode === "stepper"}
                        onCheckedChange={(checked) =>
                          handleModeChange("progressMode", checked ? "stepper" : "none")
                        }
                      />
                    </div>
                  )}

                  {/* Upload Layout - Radio Group (3 options) */}
                  {relevantSettings.includes("uploadLayout") && (
                    <div className="space-y-2">
                      <WexLabel className="text-xs">Upload Layout</WexLabel>
                      <WexRadioGroup
                        value={state.layoutModes.uploadLayout}
                        onValueChange={(value) => handleModeChange("uploadLayout", value)}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <WexRadioGroup.Item value="standard" id="upload-standard" />
                            <WexLabel htmlFor="upload-standard" className="text-xs font-normal cursor-pointer">
                              Standard
                            </WexLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <WexRadioGroup.Item value="compact" id="upload-compact" />
                            <WexLabel htmlFor="upload-compact" className="text-xs font-normal cursor-pointer">
                              Compact
                            </WexLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <WexRadioGroup.Item value="split" id="upload-split" />
                            <WexLabel htmlFor="upload-split" className="text-xs font-normal cursor-pointer">
                              Split
                            </WexLabel>
                          </div>
                        </div>
                      </WexRadioGroup>
                    </div>
                  )}

                  {/* Review Layout - Radio Group (3 options) */}
                  {relevantSettings.includes("reviewLayout") && (
                    <div className="space-y-2">
                      <WexLabel className="text-xs">Review Layout</WexLabel>
                      <WexRadioGroup
                        value={state.layoutModes.reviewLayout}
                        onValueChange={(value) => handleModeChange("reviewLayout", value)}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <WexRadioGroup.Item value="form" id="review-form" />
                            <WexLabel htmlFor="review-form" className="text-xs font-normal cursor-pointer">
                              Form
                            </WexLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <WexRadioGroup.Item value="summary" id="review-summary" />
                            <WexLabel htmlFor="review-summary" className="text-xs font-normal cursor-pointer">
                              Summary
                            </WexLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <WexRadioGroup.Item value="split" id="review-split" />
                            <WexLabel htmlFor="review-split" className="text-xs font-normal cursor-pointer">
                              Split
                            </WexLabel>
                          </div>
                        </div>
                      </WexRadioGroup>
                    </div>
                  )}

                  {/* AI Communication - Radio Group (3 options) */}
                  {relevantSettings.includes("aiCommunication") && (
                    <div className="space-y-2">
                      <WexLabel className="text-xs">AI Communication</WexLabel>
                      <WexRadioGroup
                        value={state.layoutModes.aiCommunication}
                        onValueChange={(value) => handleModeChange("aiCommunication", value)}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <WexRadioGroup.Item value="minimal" id="ai-minimal" />
                            <WexLabel htmlFor="ai-minimal" className="text-xs font-normal cursor-pointer">
                              Minimal
                            </WexLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <WexRadioGroup.Item value="detailed" id="ai-detailed" />
                            <WexLabel htmlFor="ai-detailed" className="text-xs font-normal cursor-pointer">
                              Detailed
                            </WexLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <WexRadioGroup.Item value="prominent" id="ai-prominent" />
                            <WexLabel htmlFor="ai-prominent" className="text-xs font-normal cursor-pointer">
                              Prominent
                            </WexLabel>
                          </div>
                        </div>
                      </WexRadioGroup>
                    </div>
                  )}
                </div>
              )}

              {/* Copy URL Button */}
              <WexButton
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Shareable Link
              </WexButton>
            </WexCard.Content>
          </WexCard>
        </div>
      )}
    </>
  );
}

