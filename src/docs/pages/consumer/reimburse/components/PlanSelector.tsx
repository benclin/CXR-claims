import { WexSelect, WexRadioGroup } from "@/components/wex";
import { PlanCard } from "./PlanCard";
import { getAllPlans } from "./planData";

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
      <div className="relative w-[320px]">
        <WexSelect
          value={value || undefined}
          onValueChange={onValueChange}
        >
          <WexSelect.Trigger className={`h-14 w-full pt-5 pb-2 ${value ? "has-value" : ""}`}>
            <WexSelect.Value placeholder=" " />
          </WexSelect.Trigger>
          <WexSelect.Content className="w-[var(--radix-select-trigger-width)]">
            <WexSelect.Item value="medical-fsa">Medical FSA</WexSelect.Item>
            <WexSelect.Item value="lifestyle-spending-2026">Lifestyle Spending Account 2026</WexSelect.Item>
            <WexSelect.Item value="lifestyle-spending-2025">Lifestyle Spending Account 2025</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
        <label className={`absolute pointer-events-none origin-top-left transition-all duration-200 ease-out left-3 text-sm ${
          value 
            ? "top-2 scale-75 -translate-y-2.5 text-wex-floatlabel-label-focus-fg" 
            : "top-4 scale-100 translate-y-0 text-wex-floatlabel-label-fg"
        }`}>
          {label}
        </label>
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

