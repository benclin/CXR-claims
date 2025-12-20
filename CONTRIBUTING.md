# Contributing Components to WEX Design System

This guide explains how to contribute new components to the WEX Design System. All contributions must follow the patterns and rules established in [WEX_COMPONENT_RULES.md](WEX_COMPONENT_RULES.md).

---

## When to Contribute

Before proposing a new component, ask yourself:

1. **Is it reusable?** The component should be useful across multiple applications or contexts.
2. **Is it non-domain-specific?** Avoid business logic or app-specific components.
3. **Does it already exist?** Check if a similar component is already in the library.
4. **Does it belong in a design system?** Utility functions, hooks, or page layouts typically don't belong here.

If all answers are favorable, proceed with an RFC.

---

## Approval Process

### 1. Submit an RFC Issue

Open a GitHub Issue with:

- **Title**: `RFC: Wex{ComponentName}`
- **Description**: What problem does this component solve?
- **Use Cases**: Where will this component be used?
- **Proposed API**: Show example usage code
- **Dependencies**: Any third-party libraries required?

### 2. Design System Team Review

The Design System Team will review and provide feedback. Wait for explicit approval before beginning implementation.

---

## Component Requirements

All components must comply with [WEX_COMPONENT_RULES.md](WEX_COMPONENT_RULES.md). Key requirements:

- **No raw colors** - Use Tailwind utilities that resolve to CSS variables
- **CVA for variants** - Use class-variance-authority with semantic names
- **forwardRef required** - All components must forward refs
- **Focus states** - All interactive elements need visible focus indicators
- **Min target sizes** - Use `min-h-target min-w-target` for interactive elements

---

## Understanding the WEX Wrapper Architecture

Before building components, understand why and how WEX wraps shadcn/ui components.

### Why We Wrap shadcn Components

WEX doesn't fork shadcn—it wraps it. This approach provides:

1. **Namespace Pattern**: Cleaner imports with `WexDialog.Content` instead of separate `DialogContent` imports
2. **WEX Variants**: Custom `intent` props (success, warning, info) that enforce brand compliance
3. **Curated Updates**: The WEX team vets upstream changes before they reach app teams
4. **Consistency**: All teams use identical component APIs and behaviors

### The Namespace Pattern

For compound components (Dialog, Sheet, Card, etc.), we use Object.assign to create a namespace:

```tsx
// This allows: <WexDialog.Content> instead of <DialogContent>
export const WexDialog = Object.assign(WexDialogRoot, {
  Content: DialogContent,
  Header: DialogHeader,
  // ...
});
```

### Critical: Object.assign with Shared Radix Primitives

**This is the most important technical detail for contributors.**

Some shadcn components share the same underlying Radix primitive:

- `Dialog` and `Sheet` both use `@radix-ui/react-dialog`
- They share the **same Root object reference**

If you do this:

```tsx
// ❌ WRONG - Mutates shared primitive
export const WexDialog = Object.assign(Dialog, { Content: DialogContent });
export const WexSheet = Object.assign(Sheet, { Content: SheetContent });
// Sheet overwrites Dialog's Content because they're the same object!
```

Instead, create a **new wrapper function** to avoid mutation:

```tsx
// ✅ CORRECT - Creates isolated object
const WexDialogRoot = Object.assign(
  // New function that wraps the original
  ((props: React.ComponentProps<typeof Dialog>) => <Dialog {...props} />) as typeof Dialog,
  {
    Content: DialogContent,
    Header: DialogHeader,
    // ...
  }
);
export const WexDialog = WexDialogRoot;
```

This pattern:
1. Creates a new function (not mutating the original)
2. Assigns namespace properties to the new function
3. Keeps each component's namespace isolated

### Components Requiring This Pattern

Apply the wrapper function pattern when:
- The component uses a Radix primitive that might be shared
- You're wrapping: `Dialog`, `Sheet`, `AlertDialog`, `Popover`, `DropdownMenu`, `ContextMenu`

For components with unique primitives (Button, Card, Badge), the simpler Object.assign is safe.

---

## Step-by-Step: Building a WEX Component

### 1. File Naming Convention

- **Location**: `src/components/wex/wex-{component-name}.tsx`
- **Export Name**: `Wex{ComponentName}` (PascalCase with Wex prefix)

Examples:
- `wex-badge.tsx` → `WexBadge`
- `wex-alert-dialog.tsx` → `WexAlertDialog`

### 2. Simple Component Template

For components without sub-parts:

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * WexComponentName - WEX Design System Component
 *
 * Brief description of what this component does.
 *
 * @example
 * <WexComponentName intent="default">Content</WexComponentName>
 */

const wexComponentVariants = cva(
  // Base styles - no raw colors!
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      intent: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      intent: "default",
      size: "default",
    },
  }
);

export interface WexComponentNameProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof wexComponentVariants> {}

const WexComponentName = React.forwardRef<HTMLDivElement, WexComponentNameProps>(
  ({ className, intent, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(wexComponentVariants({ intent, size }), className)}
        {...props}
      />
    );
  }
);
WexComponentName.displayName = "WexComponentName";

export { WexComponentName, wexComponentVariants };
```

### 3. Compound Component Template (Namespace Pattern)

For components with sub-parts (like Card, Dialog, etc.):

```tsx
import * as React from "react";
import {
  BaseComponent,
  ComponentPart1,
  ComponentPart2,
} from "@/components/ui/base-component";

/**
 * WexComponentName - WEX Design System Component
 *
 * Uses namespace pattern: WexComponentName.Part1, WexComponentName.Part2
 *
 * @example
 * <WexComponentName>
 *   <WexComponentName.Part1>Title</WexComponentName.Part1>
 *   <WexComponentName.Part2>Content</WexComponentName.Part2>
 * </WexComponentName>
 */

// For components using shared Radix primitives (Dialog, Sheet, etc.),
// use the wrapper function pattern to avoid mutation:
const WexComponentNameRoot: typeof BaseComponent & {
  Part1: typeof ComponentPart1;
  Part2: typeof ComponentPart2;
} = Object.assign(
  // Create new function - do NOT mutate BaseComponent directly
  ((props: React.ComponentProps<typeof BaseComponent>) => (
    <BaseComponent {...props} />
  )) as typeof BaseComponent,
  {
    Part1: ComponentPart1,
    Part2: ComponentPart2,
  }
);

export const WexComponentName = WexComponentNameRoot;
```

For components that do NOT share Radix primitives (Card, Tabs, etc.), the simpler pattern is acceptable:

```tsx
export const WexComponentName = Object.assign(BaseComponent, {
  Part1: ComponentPart1,
  Part2: ComponentPart2,
});
```

### 4. Technical Must-Haves Checklist

Before submitting, verify:

- [ ] Component uses `React.forwardRef`
- [ ] `displayName` is set
- [ ] Uses CVA with semantic variant names (`intent`, not `color`)
- [ ] Only uses WEX tokens via Tailwind (no raw hex/rgb/hsl values)
- [ ] Interactive elements have focus-visible ring pattern
- [ ] Buttons/controls have `min-h-target min-w-target`
- [ ] JSDoc comment with `@example` usage

---

## Documentation Page

Create a documentation page at `src/docs/pages/components/{ComponentName}Page.tsx`:

```tsx
import React from "react";
import { WexComponentName } from "@/components/wex";
import { Section } from "@/docs/components/Section";
import { ExampleCard } from "@/docs/components/ExampleCard";
import { CodeBlock } from "@/docs/components/CodeBlock";

export default function ComponentNamePage() {
  return (
    <article>
      <header className="mb-10">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Component Name
        </h1>
        <p className="text-lg text-muted-foreground">
          Brief description of the component.
        </p>
      </header>

      <Section title="Overview">
        <ExampleCard title="Default" description="Basic usage">
          <WexComponentName>Example</WexComponentName>
        </ExampleCard>
      </Section>

      <Section title="Variants" className="mt-12">
        {/* Add variant examples */}
      </Section>

      <Section title="Usage" className="mt-12">
        <CodeBlock
          code={`import { WexComponentName } from "@/components/wex";

<WexComponentName intent="default">
  Content here
</WexComponentName>`}
        />
      </Section>
    </article>
  );
}
```

**Important**: Wrap examples in `ExampleCard` - this enables automatic accessibility scanning.

---

## Unit Tests

Create a test file at `tests/components/wex-{component-name}.test.tsx`:

```tsx
/**
 * WexComponentName Component Tests
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { WexComponentName } from "@/components/wex";

describe("WexComponentName", () => {
  it("renders without crashing", () => {
    render(<WexComponentName>Content</WexComponentName>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("accepts className prop", () => {
    render(<WexComponentName className="custom-class">Content</WexComponentName>);
    expect(screen.getByText("Content")).toHaveClass("custom-class");
  });

  it("renders with different intents", () => {
    const { rerender } = render(
      <WexComponentName intent="default">Default</WexComponentName>
    );
    expect(screen.getByText("Default")).toBeInTheDocument();

    rerender(<WexComponentName intent="secondary">Secondary</WexComponentName>);
    expect(screen.getByText("Secondary")).toBeInTheDocument();
  });
});
```

---

## Registry Integration

Add your component to `src/docs/registry/components.ts`:

```typescript
{
  name: "Component Name",
  route: "/components/component-name",
  importPath: "@/docs/pages/components/ComponentNamePage",
  description: "Brief description of the component",
  status: "alpha", // Start as alpha, promote after review
  tags: ["category", "type"],
}
```

Status levels:
- `alpha` - Experimental, API may change significantly
- `beta` - API mostly stable, needs more testing
- `stable` - Production-ready

---

## Validation

Before submitting your PR, run:

```bash
# Run unit tests
npm run test:unit

# Run accessibility tests
npm run test:a11y

# Generate test reports
npm run test:unit:report
```

All tests must pass before requesting review.

---

## Submission Workflow

```
1. RFC Issue          → Describe component, wait for approval
2. Feature Branch     → Create from main: feat/wex-{component-name}
3. Build Component    → Follow patterns above
4. Create Docs Page   → With ExampleCard for a11y scanning
5. Write Unit Tests   → Basic render + variant tests
6. Add to Registry    → Status: alpha
7. Run Validation     → npm run test:unit && npm run test:a11y
8. Submit PR          → Link to RFC issue
9. Review             → Address feedback
10. Merge             → Component added to library
```

---

## PR Checklist

Copy this checklist into your PR description:

```markdown
## Component Contribution Checklist

### Component
- [ ] Located at `src/components/wex/wex-{name}.tsx`
- [ ] Uses `Wex` prefix in export name
- [ ] Uses `React.forwardRef` with `displayName`
- [ ] Uses CVA with semantic variant names
- [ ] No raw color values (hex/rgb/hsl)
- [ ] Focus states on interactive elements
- [ ] Min target sizes on buttons/controls

### Documentation
- [ ] Docs page at `src/docs/pages/components/{Name}Page.tsx`
- [ ] Examples wrapped in `ExampleCard`
- [ ] Usage code examples included

### Testing
- [ ] Unit tests at `tests/components/wex-{name}.test.tsx`
- [ ] `npm run test:unit` passes
- [ ] `npm run test:a11y` passes

### Registry
- [ ] Added to `src/docs/registry/components.ts`
- [ ] Status set to `alpha`

### Meta
- [ ] Changelog updated
- [ ] RFC issue linked: #___
```

---

## Questions?

If you have questions about contributing, open an issue with the `question` label or reach out to the Design System Team.

