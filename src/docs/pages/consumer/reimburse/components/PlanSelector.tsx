import { WexSelect, WexRadioGroup } from "@/components/wex";
import { PlanCard } from "./PlanCard";
import { getAllPlans } from "./planData";
import { FloatLabelSelect } from "../../components/FloatLabelSelect";

/**
 * PlanSelector Component
 * 
 * Handles plan selection in two modes:
 * - dropdown: WexSelect implementation (current)
 * - cards: Selectable PlanCard components
 */
export function PlanSelector({
  mode,
  value,
  onValueChange,
  label = "Pay from",
}: {
  mode: "dropdown" | "cards";
  value?: string;
  onValueChange: (value: string) => void;
  label?: string;
}) {
  if (mode === "dropdown") {
    return (
      <div className="w-[320px]">
        <FloatLabelSelect
          label={label}
          value={value || undefined}
          onValueChange={onValueChange}
        >
          <WexSelect.Item value="medical-fsa">Medical FSA</WexSelect.Item>
          <WexSelect.Item value="lifestyle-spending-2026">Lifestyle Spending Account 2026</WexSelect.Item>
          <WexSelect.Item value="lifestyle-spending-2025">Lifestyle Spending Account 2025</WexSelect.Item>
        </FloatLabelSelect>
      </div>
    );
  }

  // Cards mode: selectable plan cards with radio buttons
  const allPlans = getAllPlans();
  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <WexRadioGroup value={value} onValueChange={onValueChange} className="flex flex-wrap gap-4">
        {allPlans.map((plan) => (
          <PlanCard
            key={plan.value}
            title={plan.data.title}
            dateRange={plan.data.dateRange}
            balance={plan.data.balance}
            finalFilingDate={plan.data.finalFilingDate}
            finalServiceDate={plan.data.finalServiceDate}
            selected={value === plan.value}
            onSelect={() => onValueChange(plan.value)}
            showRadioButton={true}
            radioButtonId={plan.value}
          />
        ))}
      </WexRadioGroup>
    </div>
  );
}

