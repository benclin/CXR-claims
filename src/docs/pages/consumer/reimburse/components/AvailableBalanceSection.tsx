import { PlanCard } from "./PlanCard";
import { getPlanCardData, getAllPlans } from "./planData";

/**
 * AvailableBalanceSection Component
 * 
 * Displays available balance information.
 * Can show all plans (first screen) or selected plan (subsequent screens).
 */
export function AvailableBalanceSection({
  selectedAccount,
  showAll = false,
}: {
  selectedAccount?: string;
  showAll?: boolean;
}) {
  if (showAll) {
    // Show all three plans (first screen)
    const allPlans = getAllPlans();
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground leading-8 tracking-[-0.34px]">
          Available Balance
        </h2>
        
        <div className="flex flex-wrap gap-6 items-start">
          {allPlans.map((plan) => (
            <PlanCard
              key={plan.value}
              title={plan.data.title}
              dateRange={plan.data.dateRange}
              balance={plan.data.balance}
              finalFilingDate={plan.data.finalFilingDate}
              finalServiceDate={plan.data.finalServiceDate}
            />
          ))}
        </div>
      </div>
    );
  }

  // Show selected plan only (subsequent screens)
  if (!selectedAccount) {
    return null;
  }

  const planData = getPlanCardData(selectedAccount);
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground leading-8 tracking-[-0.34px]">
        Available Balance
      </h2>
      
      <div className="flex gap-6 items-start">
        <PlanCard
          title={planData.title}
          dateRange={planData.dateRange}
          balance={planData.balance}
          finalFilingDate={planData.finalFilingDate}
          finalServiceDate={planData.finalServiceDate}
        />
      </div>
    </div>
  );
}

