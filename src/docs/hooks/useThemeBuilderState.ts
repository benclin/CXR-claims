/**
 * useThemeBuilderState Hook
 * 
 * Manages Theme Builder application state:
 * - Selected item (global category or component key)
 * - Last visited page for exit navigation
 * - Unsaved changes tracking
 * - Mode (light/dark) with issue counts
 */

import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import complianceData from "@/docs/registry/compliance.json";
import type { ComplianceResult } from "@/docs/hooks/useA11yCompliance";

export type ThemeBuilderSelection = 
  | { type: "global"; category: GlobalCategory }
  | { type: "component"; key: string };

export type GlobalCategory = 
  | "surfaces"
  | "text"
  | "borders"
  | "focus"
  | "radii"
  | "brand";

const STORAGE_KEY_LAST_PAGE = "wex-theme-builder-last-page";
const STORAGE_KEY_SELECTION = "wex-theme-builder-selection";

/**
 * Get the last visited page before entering Theme Builder
 */
function getLastVisitedPage(): string {
  if (typeof window === "undefined") return "/";
  return sessionStorage.getItem(STORAGE_KEY_LAST_PAGE) || "/";
}

/**
 * Save the current page as last visited (for exit navigation)
 */
function saveLastVisitedPage(path: string): void {
  if (typeof window === "undefined") return;
  if (path !== "/theme-builder") {
    sessionStorage.setItem(STORAGE_KEY_LAST_PAGE, path);
  }
}

/**
 * Get saved selection from session storage
 */
function getSavedSelection(): ThemeBuilderSelection | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY_SELECTION);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Save selection to session storage
 */
function saveSelection(selection: ThemeBuilderSelection): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY_SELECTION, JSON.stringify(selection));
}

/**
 * Calculate a11y issue counts per mode
 */
function getA11yIssueCounts(): { light: number; dark: number } {
  let light = 0;
  let dark = 0;

  Object.entries(complianceData).forEach(([key, value]) => {
    if (key === "_meta") return;
    const comp = value as ComplianceResult;
    
    const lightStatus = comp.modes?.light?.status ?? comp.status;
    const darkStatus = comp.modes?.dark?.status ?? comp.status;
    
    if (lightStatus === "fail" || lightStatus === "partial") {
      light++;
    }
    if (darkStatus === "fail" || darkStatus === "partial") {
      dark++;
    }
  });

  return { light, dark };
}

/**
 * Get components with a11y issues for the given mode
 */
export function getComponentsWithIssues(mode: "light" | "dark"): string[] {
  const failing: string[] = [];

  Object.entries(complianceData).forEach(([key, value]) => {
    if (key === "_meta") return;
    const comp = value as ComplianceResult;
    const modeStatus = comp.modes?.[mode]?.status ?? comp.status;
    
    if (modeStatus === "fail" || modeStatus === "partial") {
      failing.push(key);
    }
  });

  return failing;
}

export function useThemeBuilderState() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Selection state
  const [selection, setSelectionState] = React.useState<ThemeBuilderSelection>(() => {
    const saved = getSavedSelection();
    return saved || { type: "global", category: "surfaces" };
  });
  
  // Editing mode (light/dark)
  const [editMode, setEditMode] = React.useState<"light" | "dark">("light");
  
  // A11y issue counts per mode
  const issueCounts = React.useMemo(() => getA11yIssueCounts(), []);
  
  // Track last visited page for exit navigation
  React.useEffect(() => {
    saveLastVisitedPage(location.pathname);
  }, [location.pathname]);

  // Set selection and persist
  const setSelection = React.useCallback((newSelection: ThemeBuilderSelection) => {
    setSelectionState(newSelection);
    saveSelection(newSelection);
  }, []);

  // Exit Theme Builder - navigate to last visited page
  const exitThemeBuilder = React.useCallback(() => {
    const lastPage = getLastVisitedPage();
    navigate(lastPage);
  }, [navigate]);

  // Select a global category
  const selectGlobal = React.useCallback((category: GlobalCategory) => {
    setSelection({ type: "global", category });
  }, [setSelection]);

  // Select a component
  const selectComponent = React.useCallback((key: string) => {
    setSelection({ type: "component", key });
  }, [setSelection]);

  return {
    selection,
    setSelection,
    selectGlobal,
    selectComponent,
    editMode,
    setEditMode,
    issueCounts,
    exitThemeBuilder,
  };
}

