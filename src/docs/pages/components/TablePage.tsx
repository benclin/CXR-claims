import * as React from "react";
import { ComponentPage } from "@/docs/components/ComponentPage";
import { Section } from "@/docs/components/Section";
import { ExampleCard } from "@/docs/components/ExampleCard";
import { CodeBlock } from "@/docs/components/CodeBlock";
import { Guidance } from "@/docs/components/ProseBlock";
import { TokenReference, type TokenRow } from "@/docs/components/TokenReference";
import { WexTable, WexBadge, WexButton, WexCheckbox } from "@/components/wex";

// Token mappings for WexTable
// Layer 3 component tokens
const tableTokens: TokenRow[] = [
  { element: "Header", property: "Background", token: "--wex-component-table-header-bg" },
  { element: "Header", property: "Text", token: "--wex-component-table-header-fg" },
  { element: "Row", property: "Background", token: "--wex-component-table-row-bg" },
  { element: "Row (Hover)", property: "Background", token: "--wex-component-table-row-hover-bg" },
  { element: "Row (Selected)", property: "Background", token: "--wex-component-table-selected-bg" },
  { element: "Row (Selected)", property: "Text", token: "--wex-component-table-selected-fg" },
  { element: "Cell", property: "Text", token: "--wex-component-table-cell-fg" },
  { element: "Border", property: "Color", token: "--wex-component-table-border" },
  { element: "Focus Ring", property: "Color", token: "--wex-component-table-focus-ring" },
];

const invoices = [
  { invoice: "INV001", status: "Paid", amount: "$250.00", method: "Credit Card" },
  { invoice: "INV002", status: "Pending", amount: "$150.00", method: "PayPal" },
  { invoice: "INV003", status: "Unpaid", amount: "$350.00", method: "Bank Transfer" },
  { invoice: "INV004", status: "Paid", amount: "$450.00", method: "Credit Card" },
];

export default function TablePage() {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <ComponentPage
      title="Table"
      description="Tabular data display with header, body, footer, and caption."
      status="stable"
      registryKey="table"
    >
      <Section title="Overview">
        <ExampleCard>
          <WexTable>
            <WexTable.Caption>A list of recent invoices.</WexTable.Caption>
            <WexTable.Header>
              <WexTable.Row>
                <WexTable.Head className="w-[100px]">Invoice</WexTable.Head>
                <WexTable.Head>Status</WexTable.Head>
                <WexTable.Head>Method</WexTable.Head>
                <WexTable.Head className="text-right">Amount</WexTable.Head>
              </WexTable.Row>
            </WexTable.Header>
            <WexTable.Body>
              {invoices.map((inv) => (
                <WexTable.Row key={inv.invoice}>
                  <WexTable.Cell className="font-medium">{inv.invoice}</WexTable.Cell>
                  <WexTable.Cell>{inv.status}</WexTable.Cell>
                  <WexTable.Cell>{inv.method}</WexTable.Cell>
                  <WexTable.Cell className="text-right">{inv.amount}</WexTable.Cell>
                </WexTable.Row>
              ))}
            </WexTable.Body>
            <WexTable.Footer>
              <WexTable.Row>
                <WexTable.Cell colSpan={3}>Total</WexTable.Cell>
                <WexTable.Cell className="text-right">$1,200.00</WexTable.Cell>
              </WexTable.Row>
            </WexTable.Footer>
          </WexTable>
        </ExampleCard>
        <Guidance>
          Use tables for displaying structured data. Keep columns minimal and 
          consider responsive patterns for mobile.
        </Guidance>
      </Section>

      <Section title="Variants" description="Different table configurations.">
        <div className="space-y-8">
          <ExampleCard title="With Badges" description="Status indicators in cells.">
            <WexTable>
              <WexTable.Header>
                <WexTable.Row>
                  <WexTable.Head>Invoice</WexTable.Head>
                  <WexTable.Head>Status</WexTable.Head>
                  <WexTable.Head className="text-right">Amount</WexTable.Head>
                </WexTable.Row>
              </WexTable.Header>
              <WexTable.Body>
                {invoices.map((inv) => (
                  <WexTable.Row key={inv.invoice}>
                    <WexTable.Cell className="font-medium">{inv.invoice}</WexTable.Cell>
                    <WexTable.Cell>
                      <WexBadge intent={inv.status === "Paid" ? "default" : inv.status === "Pending" ? "secondary" : "destructive"}>
                        {inv.status}
                      </WexBadge>
                    </WexTable.Cell>
                    <WexTable.Cell className="text-right">{inv.amount}</WexTable.Cell>
                  </WexTable.Row>
                ))}
              </WexTable.Body>
            </WexTable>
          </ExampleCard>

          <ExampleCard title="Selectable Rows" description="Rows with checkbox selection.">
            <WexTable>
              <WexTable.Header>
                <WexTable.Row>
                  <WexTable.Head className="w-[50px]">
                    <WexCheckbox
                      aria-label="Select all invoices"
                      checked={selected.size === invoices.length}
                      onCheckedChange={() => {
                        if (selected.size === invoices.length) setSelected(new Set());
                        else setSelected(new Set(invoices.map(i => i.invoice)));
                      }}
                    />
                  </WexTable.Head>
                  <WexTable.Head>Invoice</WexTable.Head>
                  <WexTable.Head>Status</WexTable.Head>
                  <WexTable.Head className="text-right">Actions</WexTable.Head>
                </WexTable.Row>
              </WexTable.Header>
              <WexTable.Body>
                {invoices.map((inv) => (
                  <WexTable.Row key={inv.invoice} className={selected.has(inv.invoice) ? "bg-muted/50" : ""}>
                    <WexTable.Cell>
                      <WexCheckbox
                        aria-label={`Select invoice ${inv.invoice}`}
                        checked={selected.has(inv.invoice)}
                        onCheckedChange={() => toggleRow(inv.invoice)}
                      />
                    </WexTable.Cell>
                    <WexTable.Cell className="font-medium">{inv.invoice}</WexTable.Cell>
                    <WexTable.Cell>{inv.status}</WexTable.Cell>
                    <WexTable.Cell className="text-right">
                      <WexButton intent="ghost" size="sm" aria-label={`View invoice ${inv.invoice}`}>View</WexButton>
                    </WexTable.Cell>
                  </WexTable.Row>
                ))}
              </WexTable.Body>
            </WexTable>
          </ExampleCard>
        </div>
      </Section>

      <Section title="Accessibility">
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="font-medium mb-2">Semantic Structure</h3>
          <p className="text-sm text-muted-foreground">
            WexTable uses proper HTML table elements (table, thead, tbody, tr, th, td)
            for screen reader compatibility. Use WexTable.Caption for table descriptions.
          </p>
        </div>
      </Section>

      <Section title="Usage">
        <CodeBlock
          code={`import { WexTable, WexBadge } from "@/components/wex";

<WexTable>
  <WexTable.Caption>Invoice list</WexTable.Caption>
  <WexTable.Header>
    <WexTable.Row>
      <WexTable.Head>Invoice</WexTable.Head>
      <WexTable.Head>Status</WexTable.Head>
      <WexTable.Head className="text-right">Amount</WexTable.Head>
    </WexTable.Row>
  </WexTable.Header>
  <WexTable.Body>
    <WexTable.Row>
      <WexTable.Cell>INV001</WexTable.Cell>
      <WexTable.Cell>
        <WexBadge>Paid</WexBadge>
      </WexTable.Cell>
      <WexTable.Cell className="text-right">$250.00</WexTable.Cell>
    </WexTable.Row>
  </WexTable.Body>
  <WexTable.Footer>
    <WexTable.Row>
      <WexTable.Cell colSpan={2}>Total</WexTable.Cell>
      <WexTable.Cell className="text-right">$250.00</WexTable.Cell>
    </WexTable.Row>
  </WexTable.Footer>
</WexTable>`}
        />
      </Section>

      <TokenReference tokens={tableTokens} className="mt-12" />
    </ComponentPage>
  );
}
