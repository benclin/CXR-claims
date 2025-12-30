import { WexCard } from "@/components/wex/wex-card";
import { WexSelect } from "@/components/wex/wex-select";
import { WexTable } from "@/components/wex/wex-table";
import { previousPlanYearData, dateRangeOptions } from "./mockData";

/**
 * Previous Plan Year Table Component
 * 
 * Displays previous plan year accounts:
 * - Header with title and date range dropdown
 * - Table with year, account, election amount, claims, forfeited, rollover
 */
export function PreviousPlanYearTable() {
  return (
    <WexCard>
      <WexCard.Content className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Previous Plan Year
            </h2>
            <WexSelect defaultValue="2024">
              <WexSelect.Trigger className="w-[309px]">
                <WexSelect.Value placeholder="Select date range" />
              </WexSelect.Trigger>
              <WexSelect.Content>
                {dateRangeOptions.map((option) => (
                  <WexSelect.Item key={option.value} value={option.value}>
                    {option.label}
                  </WexSelect.Item>
                ))}
              </WexSelect.Content>
            </WexSelect>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <WexTable>
              <WexTable.Header>
                <WexTable.Row>
                  <WexTable.Head>Year</WexTable.Head>
                  <WexTable.Head>Account</WexTable.Head>
                  <WexTable.Head className="text-right">Election Amount</WexTable.Head>
                  <WexTable.Head className="text-right">Claims Processed</WexTable.Head>
                  <WexTable.Head className="text-right">Amount Forfeited</WexTable.Head>
                  <WexTable.Head className="text-right">Amount Rollover</WexTable.Head>
                </WexTable.Row>
              </WexTable.Header>
              <WexTable.Body>
                {previousPlanYearData.map((row) => (
                  <WexTable.Row key={row.id}>
                    <WexTable.Cell>{row.year}</WexTable.Cell>
                    <WexTable.Cell>{row.account}</WexTable.Cell>
                    <WexTable.Cell className="text-right">{row.electionAmount}</WexTable.Cell>
                    <WexTable.Cell className="text-right">{row.claimsProcessed}</WexTable.Cell>
                    <WexTable.Cell className="text-right">{row.amountForfeited}</WexTable.Cell>
                    <WexTable.Cell className="text-right">{row.amountRollover}</WexTable.Cell>
                  </WexTable.Row>
                ))}
              </WexTable.Body>
            </WexTable>
          </div>
        </div>
      </WexCard.Content>
    </WexCard>
  );
}

