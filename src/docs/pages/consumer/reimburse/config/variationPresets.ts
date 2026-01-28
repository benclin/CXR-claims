import type { ReimbursementState } from "../ReimbursementContext";

/**
 * Variation Preset Configuration
 * 
 * Defines preset combinations of variant and layout modes for easy selection.
 * Each preset represents a complete configuration that can be applied with one click.
 */

export interface VariationPreset {
  id: string;
  name: string;
  description: string;
  variant: "mvp" | "vision";
  layoutModes: ReimbursementState["layoutModes"];
  flowId?: string;
}

/**
 * All available variation presets
 */
export const VARIATION_PRESETS: VariationPreset[] = [
  {
    id: "mvp-fullpage-standard",
    name: "MVP - Full Page Standard",
    description: "MVP variant with full page entry, standard layouts",
    variant: "mvp",
    flowId: "reimburse-linear-v1",
    layoutModes: {
      entryMode: "fullpage",
      planSelectionMode: "dropdown",
      progressMode: "none",
      uploadLayout: "standard",
      reviewLayout: "form",
      aiCommunication: "minimal",
    },
  },
  {
    id: "mvp-fullpage-stepper",
    name: "MVP - Full Page with Stepper",
    description: "MVP variant with full page entry and stepper progress indicator",
    variant: "mvp",
    flowId: "reimburse-linear-v1",
    layoutModes: {
      entryMode: "fullpage",
      planSelectionMode: "dropdown",
      progressMode: "stepper",
      uploadLayout: "standard",
      reviewLayout: "form",
      aiCommunication: "minimal",
    },
  },
  {
    id: "mvp-fullpage-cards",
    name: "MVP - Full Page with Cards",
    description: "MVP variant with full page entry and card-based plan selection",
    variant: "mvp",
    flowId: "reimburse-linear-v1",
    layoutModes: {
      entryMode: "fullpage",
      planSelectionMode: "cards",
      progressMode: "none",
      uploadLayout: "standard",
      reviewLayout: "form",
      aiCommunication: "minimal",
    },
  },
  {
    id: "mvp-modal-standard",
    name: "MVP - Modal Standard",
    description: "MVP variant with modal entry, standard layouts",
    variant: "mvp",
    flowId: "reimburse-linear-v1",
    layoutModes: {
      entryMode: "modal",
      planSelectionMode: "dropdown",
      progressMode: "none",
      uploadLayout: "standard",
      reviewLayout: "form",
      aiCommunication: "minimal",
    },
  },
  {
    id: "vision-fullpage-standard",
    name: "Vision - Full Page Standard",
    description: "Vision variant with full page entry, standard layouts",
    variant: "vision",
    flowId: "reimburse-linear-v1",
    layoutModes: {
      entryMode: "fullpage",
      planSelectionMode: "dropdown",
      progressMode: "none",
      uploadLayout: "standard",
      reviewLayout: "form",
      aiCommunication: "minimal",
    },
  },
  {
    id: "vision-fullpage-stepper",
    name: "Vision - Full Page with Stepper",
    description: "Vision variant with full page entry and stepper progress indicator",
    variant: "vision",
    flowId: "reimburse-linear-v1",
    layoutModes: {
      entryMode: "fullpage",
      planSelectionMode: "dropdown",
      progressMode: "stepper",
      uploadLayout: "standard",
      reviewLayout: "form",
      aiCommunication: "minimal",
    },
  },
  {
    id: "vision-wizard-fullpage",
    name: "Vision - Wizard Full Page",
    description: "Vision wizard flow with full page entry and stepper progress indicator",
    variant: "vision",
    flowId: "vision-wizard-v1",
    layoutModes: {
      entryMode: "fullpage",
      planSelectionMode: "dropdown",
      progressMode: "stepper",
      uploadLayout: "standard",
      reviewLayout: "form",
      aiCommunication: "minimal",
    },
  },
  {
    id: "vision-altsteps-fullpage",
    name: "Vision - Alternate Steps Full Page",
    description: "Vision alternate flow with upload-first step order",
    variant: "vision",
    flowId: "vision-alt-steps-v1",
    layoutModes: {
      entryMode: "fullpage",
      planSelectionMode: "dropdown",
      progressMode: "stepper",
      uploadLayout: "standard",
      reviewLayout: "form",
      aiCommunication: "minimal",
    },
  },
  {
    id: "vision-fullpage-cards",
    name: "Vision - Full Page with Cards",
    description: "Vision variant with full page entry and card-based plan selection",
    variant: "vision",
    flowId: "reimburse-linear-v1",
    layoutModes: {
      entryMode: "fullpage",
      planSelectionMode: "cards",
      progressMode: "none",
      uploadLayout: "standard",
      reviewLayout: "form",
      aiCommunication: "minimal",
    },
  },
  {
    id: "vision-modal-compact",
    name: "Vision - Modal Compact",
    description: "Vision variant with modal entry and compact layouts",
    variant: "vision",
    flowId: "reimburse-linear-v1",
    layoutModes: {
      entryMode: "modal",
      planSelectionMode: "dropdown",
      progressMode: "implicit",
      uploadLayout: "compact",
      reviewLayout: "summary",
      aiCommunication: "detailed",
    },
  },
  {
    id: "vision-modal-prominent",
    name: "Vision - Modal with Prominent AI",
    description: "Vision variant with modal entry and prominent AI communication",
    variant: "vision",
    flowId: "reimburse-linear-v1",
    layoutModes: {
      entryMode: "modal",
      planSelectionMode: "cards",
      progressMode: "stepper",
      uploadLayout: "split",
      reviewLayout: "split",
      aiCommunication: "prominent",
    },
  },
];

/**
 * Find a preset that matches the current state exactly
 */
export function findMatchingPreset(
  variant: "mvp" | "vision",
  layoutModes: ReimbursementState["layoutModes"]
): VariationPreset | null {
  return (
    VARIATION_PRESETS.find(
      (preset) =>
        preset.variant === variant &&
        preset.layoutModes.entryMode === layoutModes.entryMode &&
        preset.layoutModes.planSelectionMode === layoutModes.planSelectionMode &&
        preset.layoutModes.progressMode === layoutModes.progressMode &&
        preset.layoutModes.uploadLayout === layoutModes.uploadLayout &&
        preset.layoutModes.reviewLayout === layoutModes.reviewLayout &&
        preset.layoutModes.aiCommunication === layoutModes.aiCommunication
    ) || null
  );
}

/**
 * Get a preset by ID
 */
export function getPresetById(id: string): VariationPreset | null {
  return VARIATION_PRESETS.find((preset) => preset.id === id) || null;
}

