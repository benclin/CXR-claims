import{r as x,j as e,a0 as t}from"./index-urLV_LK0.js";import{C as m}from"./ComponentPage-C2zoMjhl.js";import{S as a}from"./Section-BDuybAGy.js";import{E as c,P as p,T as g}from"./PropsTable-BWmn1gzY.js";import{C as h}from"./CodeBlock-Bh2zMKrN.js";import{G as j}from"./ProseBlock-BbiPo51l.js";import"./circle-question-mark--obbUVeM.js";import"./sun-mFmjR0E-.js";import"./contrast-1QdVzTcJ.js";import"./eye-ezJlzfli.js";import"./flask-conical-CRYNWlC5.js";import"./prism-css-CqCv82Nj.js";const u=[{name:"currentPage",type:"number",required:!0,description:"Current active page"},{name:"totalPages",type:"number",required:!0,description:"Total number of pages"},{name:"onPageChange",type:"(page: number) => void",description:"Callback when page changes"},{name:"siblingCount",type:"number",default:"1",description:"Number of siblings on each side"}],P=[{element:"Item",property:"Background",token:"--wex-component-pagination-item-bg"},{element:"Item",property:"Text",token:"--wex-component-pagination-item-fg"},{element:"Item (Hover)",property:"Background",token:"--wex-component-pagination-item-hover-bg"},{element:"Item (Active)",property:"Background",token:"--wex-component-pagination-active-bg"},{element:"Item (Active)",property:"Text",token:"--wex-component-pagination-active-fg"},{element:"Disabled",property:"Opacity",token:"--wex-component-pagination-disabled-opacity"}];function A(){const[n,s]=x.useState(5),[o,d]=x.useState(10),l=250,i=Math.ceil(l/o);return e.jsxs(m,{title:"Pagination",description:"Complete pagination with rows per page, page report, jump to page, and first/last navigation.",status:"stable",registryKey:"pagination",children:[e.jsx(a,{title:"Overview",children:e.jsx(c,{children:e.jsx(t,{children:e.jsxs(t.Content,{children:[e.jsx(t.Item,{children:e.jsx(t.Previous,{href:"#"})}),e.jsx(t.Item,{children:e.jsx(t.Link,{href:"#",children:"1"})}),e.jsx(t.Item,{children:e.jsx(t.Link,{href:"#",isActive:!0,children:"2"})}),e.jsx(t.Item,{children:e.jsx(t.Link,{href:"#",children:"3"})}),e.jsx(t.Item,{children:e.jsx(t.Next,{href:"#"})})]})})})}),e.jsx(a,{title:"First & Last Buttons",description:"Navigate to first or last page.",children:e.jsx(c,{children:e.jsx(t,{children:e.jsxs(t.Content,{children:[e.jsx(t.Item,{children:e.jsx(t.First,{href:"#"})}),e.jsx(t.Item,{children:e.jsx(t.Previous,{href:"#"})}),e.jsx(t.Item,{children:e.jsx(t.Link,{href:"#",children:"1"})}),e.jsx(t.Item,{children:e.jsx(t.Ellipsis,{})}),e.jsx(t.Item,{children:e.jsx(t.Link,{href:"#",isActive:!0,children:"5"})}),e.jsx(t.Item,{children:e.jsx(t.Ellipsis,{})}),e.jsx(t.Item,{children:e.jsx(t.Link,{href:"#",children:"10"})}),e.jsx(t.Item,{children:e.jsx(t.Next,{href:"#"})}),e.jsx(t.Item,{children:e.jsx(t.Last,{href:"#"})})]})})})}),e.jsx(a,{title:"Rows Per Page",description:"Let users control page size.",children:e.jsx(c,{children:e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(t.RowsPerPage,{value:o,onChange:d,options:[10,25,50,100]}),e.jsxs("span",{className:"text-sm text-muted-foreground",children:["Current: ",o," rows per page"]})]})})}),e.jsx(a,{title:"Page Report",description:"Show current range and total.",children:e.jsx(c,{children:e.jsxs("div",{className:"space-y-4",children:[e.jsx(t.PageReport,{currentPage:n,totalPages:i,totalItems:l,pageSize:o}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx("button",{onClick:()=>s(r=>Math.max(1,r-1)),className:"px-3 py-1 text-sm border rounded hover:bg-accent",children:"Prev"}),e.jsx("button",{onClick:()=>s(r=>Math.min(i,r+1)),className:"px-3 py-1 text-sm border rounded hover:bg-accent",children:"Next"})]})]})})}),e.jsx(a,{title:"Jump To Page",description:"Direct page number input.",children:e.jsx(c,{children:e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(t.JumpToPage,{currentPage:n,totalPages:i,onPageChange:s}),e.jsxs("span",{className:"text-sm text-muted-foreground",children:["Page ",n," of ",i]})]})})}),e.jsxs(a,{title:"Complete Example",description:"All pagination features combined.",children:[e.jsx(c,{children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(t.RowsPerPage,{value:o,onChange:d,options:[10,25,50]}),e.jsx(t.PageReport,{currentPage:n,totalPages:i,totalItems:l,pageSize:o})]}),e.jsx(t,{children:e.jsxs(t.Content,{children:[e.jsx(t.Item,{children:e.jsx(t.First,{href:"#",onClick:()=>s(1)})}),e.jsx(t.Item,{children:e.jsx(t.Previous,{href:"#",onClick:()=>s(r=>Math.max(1,r-1))})}),e.jsx(t.Item,{children:e.jsx(t.Link,{href:"#",isActive:n===1,onClick:()=>s(1),children:"1"})}),n>3&&e.jsx(t.Item,{children:e.jsx(t.Ellipsis,{})}),n>2&&n<i&&e.jsx(t.Item,{children:e.jsx(t.Link,{href:"#",isActive:!0,children:n})}),n<i-2&&e.jsx(t.Item,{children:e.jsx(t.Ellipsis,{})}),e.jsx(t.Item,{children:e.jsx(t.Link,{href:"#",isActive:n===i,onClick:()=>s(i),children:i})}),e.jsx(t.Item,{children:e.jsx(t.Next,{href:"#",onClick:()=>s(r=>Math.min(i,r+1))})}),e.jsx(t.Item,{children:e.jsx(t.Last,{href:"#",onClick:()=>s(i)})})]})}),e.jsx("div",{className:"flex justify-end",children:e.jsx(t.JumpToPage,{currentPage:n,totalPages:i,onPageChange:s})})]})}),e.jsx(j,{children:"Combine RowsPerPage, PageReport, and JumpToPage with the base Pagination component for a complete data table pagination experience."})]}),e.jsx(a,{title:"Accessibility",children:e.jsxs("div",{className:"space-y-4 text-foreground",children:[e.jsxs("div",{className:"rounded-lg border border-border bg-card p-4",children:[e.jsx("h3",{className:"font-medium mb-2",children:"ARIA Requirements"}),e.jsxs("ul",{className:"text-sm text-muted-foreground list-disc list-inside space-y-1",children:[e.jsxs("li",{children:[e.jsx("code",{className:"bg-muted px-1 rounded",children:'nav role="navigation"'}),": Wraps pagination"]}),e.jsxs("li",{children:[e.jsx("code",{className:"bg-muted px-1 rounded",children:'aria-label="Pagination"'}),": Describes the component"]}),e.jsxs("li",{children:[e.jsx("code",{className:"bg-muted px-1 rounded",children:'aria-current="page"'}),": Marks the active page"]})]})]}),e.jsxs("div",{className:"rounded-lg border border-border bg-card p-4",children:[e.jsx("h3",{className:"font-medium mb-2",children:"Keyboard Navigation"}),e.jsxs("ul",{className:"text-sm text-muted-foreground list-disc list-inside space-y-1",children:[e.jsx("li",{children:"Tab: Navigate between page links"}),e.jsx("li",{children:"Enter: Activate link"})]})]})]})}),e.jsxs(a,{title:"Usage",children:[e.jsx(h,{code:`import { WexPagination } from "@/components/wex";

// Basic pagination
<WexPagination>
  <WexPagination.Content>
    <WexPagination.Item>
      <WexPagination.Previous href="#" />
    </WexPagination.Item>
    <WexPagination.Item>
      <WexPagination.Link href="#" isActive>1</WexPagination.Link>
    </WexPagination.Item>
    <WexPagination.Item>
      <WexPagination.Next href="#" />
    </WexPagination.Item>
  </WexPagination.Content>
</WexPagination>

// First & Last buttons
<WexPagination.First href="#" />
<WexPagination.Last href="#" />

// Rows per page
<WexPagination.RowsPerPage
  value={rowsPerPage}
  onChange={setRowsPerPage}
  options={[10, 25, 50, 100]}
/>

// Page report
<WexPagination.PageReport
  currentPage={5}
  totalPages={25}
  totalItems={250}
  pageSize={10}
/>

// Jump to page
<WexPagination.JumpToPage
  currentPage={5}
  totalPages={25}
  onPageChange={setCurrentPage}
/>`}),e.jsxs("div",{className:"mt-4 text-sm text-muted-foreground",children:[e.jsx("p",{children:e.jsx("strong",{children:"New Components:"})}),e.jsxs("ul",{className:"list-disc list-inside mt-2 space-y-1",children:[e.jsxs("li",{children:[e.jsx("code",{className:"bg-muted px-1 rounded",children:"PaginationFirst"}),": Jump to first page"]}),e.jsxs("li",{children:[e.jsx("code",{className:"bg-muted px-1 rounded",children:"PaginationLast"}),": Jump to last page"]}),e.jsxs("li",{children:[e.jsx("code",{className:"bg-muted px-1 rounded",children:"RowsPerPage"}),": Page size selector"]}),e.jsxs("li",{children:[e.jsx("code",{className:"bg-muted px-1 rounded",children:"PageReport"}),': Shows "X-Y of Z items"']}),e.jsxs("li",{children:[e.jsx("code",{className:"bg-muted px-1 rounded",children:"JumpToPage"}),": Direct page input"]})]})]})]}),e.jsx(a,{title:"API Reference",children:e.jsx(p,{props:u})}),e.jsx(g,{tokens:P,className:"mt-12"})]})}export{A as default};
