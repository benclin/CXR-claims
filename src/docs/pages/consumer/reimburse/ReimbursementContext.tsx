import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

/**
 * Reimbursement Flow State Interface
 * 
 * Manages all state across the 5-step reimbursement flow:
 * 1. ReimburseMyself - Account selection and form entry
 * 2. ReimburseDocs - Document upload
 * 3. ReimburseAnalyze - Analysis processing
 * 4. ReimburseReview - Review extracted data
 * 5. ReimburseConfirm - Final confirmation
 */
export interface ReimbursementState {
  // Form data
  account: string;
  category: string;
  provider: string;
  serviceDate: string;
  amount: string;
  paymentMethod: string;
  
  // Files
  uploadedFiles: Array<{ name: string; size: string; date: string; status?: "uploaded" }>;
  autoAnalyze: boolean;
  
  // Analysis results
  extractedData: {
    startDate?: string;
    endDate?: string;
    amount?: string;
    provider?: string;
    category?: string;
    type?: string;
    description?: string;
  };
  
  // Review/Confirm
  recipient: string;
  didDrive: string;
  acceptedTerms: boolean;
  
  // Variant
  variant: "mvp" | "vision";
  
  // Flow variant
  flowId: string;
  
  // Layout variant modes
  layoutModes: {
    entryMode: "fullpage" | "modal" | "drawer";
    planSelectionMode: "dropdown" | "cards";
    progressMode: "none" | "implicit" | "stepper";
    uploadLayout: "standard" | "compact" | "split";
    reviewLayout: "form" | "summary" | "split";
    aiCommunication: "minimal" | "detailed" | "prominent";
  };
}

interface ReimbursementContextType {
  state: ReimbursementState;
  updateState: (updates: Partial<ReimbursementState>) => void;
  updateLayoutModes: (updates: Partial<ReimbursementState["layoutModes"]>) => void;
  resetState: () => void;
}

const initialState: ReimbursementState = {
  account: "",
  category: "",
  provider: "",
  serviceDate: "",
  amount: "",
  paymentMethod: "direct-deposit",
  uploadedFiles: [],
  autoAnalyze: true,
  extractedData: {},
  recipient: "",
  didDrive: "no",
  acceptedTerms: false,
  variant: "mvp",
  flowId: "mvp-linear-v1",
  layoutModes: {
    entryMode: "fullpage",
    planSelectionMode: "dropdown",
    progressMode: "none",
    uploadLayout: "standard",
    reviewLayout: "form",
    aiCommunication: "minimal",
  },
};

const ReimbursementContext = createContext<ReimbursementContextType | undefined>(undefined);

/**
 * ReimbursementContext Provider
 * 
 * Provides state management for the entire reimbursement flow.
 * Wraps all reimbursement pages to maintain state across navigation.
 */
export function ReimbursementProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ReimbursementState>(initialState);

  const updateState = (updates: Partial<ReimbursementState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const updateLayoutModes = (updates: Partial<ReimbursementState["layoutModes"]>) => {
    setState((prev) => ({
      ...prev,
      layoutModes: { ...prev.layoutModes, ...updates },
    }));
  };

  const resetState = () => {
    setState(initialState);
  };

  return (
    <ReimbursementContext.Provider value={{ state, updateState, updateLayoutModes, resetState }}>
      {children}
    </ReimbursementContext.Provider>
  );
}

/**
 * Custom hook to access ReimbursementContext
 * 
 * @throws Error if used outside ReimbursementProvider
 */
export function useReimbursement() {
  const context = useContext(ReimbursementContext);
  if (context === undefined) {
    throw new Error("useReimbursement must be used within a ReimbursementProvider");
  }
  return context;
}

