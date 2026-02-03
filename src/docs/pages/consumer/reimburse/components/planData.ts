/**
 * Plan Card Data Helper
 * 
 * Provides plan data mapping for account values.
 * Used across all reimbursement flow pages.
 */

export interface PlanCardData {
  title: string;
  dateRange: string;
  balance: string;
  finalFilingDate: string;
  finalServiceDate: string;
}

export function getPlanCardData(accountValue: string): PlanCardData {
  const plans: Record<string, PlanCardData> = {
    "medical-fsa": {
      title: "Medical FSA",
      dateRange: "01/01/2026 - 12/31/2026",
      balance: "$2,734.76",
      finalFilingDate: "04/30/2027",
      finalServiceDate: "12/31/2026",
    },
    "lifestyle-spending-2026": {
      title: "Lifestyle Spending Account",
      dateRange: "01/01/2026 - 12/31/2026",
      balance: "$250.00",
      finalFilingDate: "04/30/2027",
      finalServiceDate: "12/31/2026",
    },
    "lifestyle-spending-2025": {
      title: "Lifestyle Spending Account",
      dateRange: "01/01/2025 - 12/31/2025",
      balance: "$250.00",
      finalFilingDate: "04/30/2026",
      finalServiceDate: "12/31/2025",
    },
  };
  return plans[accountValue] || plans["medical-fsa"];
}

/**
 * Get all available plans (for card selection mode)
 */
export function getAllPlans(): Array<{ value: string; data: PlanCardData }> {
  return [
    { value: "medical-fsa", data: getPlanCardData("medical-fsa") },
    { value: "lifestyle-spending-2026", data: getPlanCardData("lifestyle-spending-2026") },
    { value: "lifestyle-spending-2025", data: getPlanCardData("lifestyle-spending-2025") },
  ];
}

