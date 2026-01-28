import { WexCard, WexButton, WexRadioGroup } from "@/components/wex";
import { Info } from "lucide-react";
import type { PlanCardData } from "./planData";

/**
 * PlanCard Component
 * 
 * Displays plan information in a card format.
 * Used across all reimbursement flow pages.
 */
export function PlanCard({
  title,
  dateRange,
  balance,
  finalFilingDate,
  finalServiceDate,
  selected,
  onSelect,
  showRadioButton = false,
  radioButtonId,
  className,
}: PlanCardData & {
  selected?: boolean;
  onSelect?: () => void;
  showRadioButton?: boolean;
  radioButtonId?: string;
  className?: string;
}) {
  const cardClasses = `border border-border w-[325px] shrink-0 ${
    selected ? "ring-2 ring-primary" : ""
  } ${onSelect ? "cursor-pointer hover:border-primary transition-colors" : ""} ${className || ""}`;

  return (
    <WexCard className={cardClasses} onClick={onSelect}>
      <WexCard.Content className="p-4 space-y-2">
        {/* Header with title, date range, and info icon or radio button */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-0.5">
            <p className="text-base font-semibold text-foreground leading-6 tracking-[-0.176px]">
              {title}
            </p>
            <p className="text-[11px] font-normal text-muted-foreground leading-4 tracking-[0.055px]">
              {dateRange}
            </p>
          </div>
          {showRadioButton && radioButtonId ? (
            <div
              className="h-7 w-7 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.();
              }}
            >
              <WexRadioGroup.Item
                value={radioButtonId}
                id={radioButtonId}
                className="h-4 w-4"
              />
            </div>
          ) : (
            <WexButton
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              aria-label="Account information"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </WexButton>
          )}
        </div>

        {/* Balance and dates */}
        <div className="flex flex-col gap-1 pt-2">
          <div className="flex items-center">
            <p className="text-xl font-bold text-foreground leading-8 tracking-[-0.34px]">
              {balance}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-sm leading-6 tracking-[-0.084px]">
            <span className="text-muted-foreground">Final Filing Date:</span>
            <span className="text-foreground">{finalFilingDate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm leading-6 tracking-[-0.084px]">
            <span className="text-muted-foreground">Final Service Date:</span>
            <span className="text-foreground">{finalServiceDate}</span>
          </div>
        </div>
      </WexCard.Content>
    </WexCard>
  );
}

