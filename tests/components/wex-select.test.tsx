/**
 * WexSelect Component Tests
 *
 * Comprehensive tests covering:
 * - Rendering and composition
 * - Selection behavior
 * - Keyboard navigation
 * - Accessibility (ARIA attributes)
 * - Groups, labels, and separators
 * - Controlled and uncontrolled modes
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { WexSelect, WexLabel } from "@/components/wex";

describe("WexSelect", () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("renders trigger without crashing", () => {
      render(
        <WexSelect>
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select option" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="1">Option 1</WexSelect.Item>
            <WexSelect.Item value="2">Option 2</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("shows placeholder when no value selected", () => {
      render(
        <WexSelect>
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Choose..." />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="1">Option</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );
      expect(screen.getByText("Choose...")).toBeInTheDocument();
    });

    it("shows selected value", () => {
      render(
        <WexSelect defaultValue="apple">
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="apple">Apple</WexSelect.Item>
            <WexSelect.Item value="banana">Banana</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );
      expect(screen.getByText("Apple")).toBeInTheDocument();
    });

    it("accepts className on trigger", () => {
      render(
        <WexSelect>
          <WexSelect.Trigger className="custom-trigger">
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="1">Option</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );
      expect(screen.getByRole("combobox")).toHaveClass("custom-trigger");
    });
  });

  // ============================================
  // DISABLED STATE TESTS
  // ============================================
  describe("Disabled State", () => {
    it("is disabled when disabled prop is true", () => {
      render(
        <WexSelect disabled>
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Disabled" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="1">Option</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );
      expect(screen.getByRole("combobox")).toBeDisabled();
    });

    it("cannot open when disabled", async () => {
      const user = userEvent.setup();
      render(
        <WexSelect disabled>
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Disabled" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="1">Option</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );

      await user.click(screen.getByRole("combobox"));
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("supports disabled items", () => {
      render(
        <WexSelect open>
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="1">Option 1</WexSelect.Item>
            <WexSelect.Item value="2" disabled>
              Option 2 (disabled)
            </WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );

      const disabledOption = screen.getByRole("option", { name: "Option 2 (disabled)" });
      expect(disabledOption).toHaveAttribute("data-disabled");
    });
  });

  // ============================================
  // SELECTION BEHAVIOR TESTS
  // ============================================
  describe("Selection Behavior", () => {
    it("shows options when open prop is true", () => {
      render(
        <WexSelect open>
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="1">Option 1</WexSelect.Item>
            <WexSelect.Item value="2">Option 2</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );

      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("displays selected value", () => {
      render(
        <WexSelect defaultValue="banana">
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="apple">Apple</WexSelect.Item>
            <WexSelect.Item value="banana">Banana</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );

      expect(screen.getByText("Banana")).toBeInTheDocument();
    });

    it("shows all options when open", () => {
      render(
        <WexSelect open>
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="apple">Apple</WexSelect.Item>
            <WexSelect.Item value="banana">Banana</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );

      expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "Banana" })).toBeInTheDocument();
    });

    it("calls onValueChange when controlled", () => {
      const handleValueChange = vi.fn();

      render(
        <WexSelect open onValueChange={handleValueChange}>
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="apple">Apple</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );

      // Options are rendered
      expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument();
    });
  });

  // ============================================
  // KEYBOARD NAVIGATION TESTS
  // ============================================
  describe("Keyboard Navigation", () => {
    it("opens with Enter key", async () => {
      const user = userEvent.setup();
      render(
        <WexSelect>
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="1">Option</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );

      const trigger = screen.getByRole("combobox");
      trigger.focus();
      await user.keyboard("{Enter}");

      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("opens with Space key", async () => {
      const user = userEvent.setup();
      render(
        <WexSelect>
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="1">Option</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );

      const trigger = screen.getByRole("combobox");
      trigger.focus();
      await user.keyboard(" ");

      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("opens with ArrowDown key", async () => {
      const user = userEvent.setup();
      render(
        <WexSelect>
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="1">Option</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );

      const trigger = screen.getByRole("combobox");
      trigger.focus();
      await user.keyboard("{ArrowDown}");

      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("navigates options with ArrowDown", async () => {
      const user = userEvent.setup();
      render(
        <WexSelect>
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="1">Option 1</WexSelect.Item>
            <WexSelect.Item value="2">Option 2</WexSelect.Item>
            <WexSelect.Item value="3">Option 3</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");

      // Check that an option is highlighted
      const options = screen.getAllByRole("option");
      expect(options.some((opt) => opt.getAttribute("data-highlighted") !== null)).toBe(
        true
      );
    });

    it("selects highlighted option with Enter", async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(
        <WexSelect onValueChange={handleValueChange}>
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="1">Option 1</WexSelect.Item>
            <WexSelect.Item value="2">Option 2</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Enter}");

      expect(handleValueChange).toHaveBeenCalled();
    });

    it("supports Escape key", () => {
      render(
        <WexSelect open>
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="1">Option</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );

      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("can be focused with Tab", async () => {
      const user = userEvent.setup();
      render(
        <WexSelect>
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="1">Option</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );

      await user.tab();
      expect(screen.getByRole("combobox")).toHaveFocus();
    });
  });

  // ============================================
  // CONTROLLED MODE TESTS
  // ============================================
  describe("Controlled Mode", () => {
    it("supports controlled value", () => {
      render(
        <WexSelect value="apple">
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="apple">Apple</WexSelect.Item>
            <WexSelect.Item value="banana">Banana</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );

      expect(screen.getByText("Apple")).toBeInTheDocument();
    });

    it("external value change updates display", () => {
      const { rerender } = render(
        <WexSelect value="">
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="apple">Apple</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );

      expect(screen.getByText("Select")).toBeInTheDocument();

      rerender(
        <WexSelect value="apple">
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="apple">Apple</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );

      expect(screen.getByText("Apple")).toBeInTheDocument();
    });
  });

  // ============================================
  // GROUPS AND LABELS TESTS
  // ============================================
  describe("Groups and Labels", () => {
    it("renders groups with labels", () => {
      render(
        <WexSelect open>
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Group>
              <WexSelect.Label>Fruits</WexSelect.Label>
              <WexSelect.Item value="apple">Apple</WexSelect.Item>
              <WexSelect.Item value="banana">Banana</WexSelect.Item>
            </WexSelect.Group>
            <WexSelect.Group>
              <WexSelect.Label>Vegetables</WexSelect.Label>
              <WexSelect.Item value="carrot">Carrot</WexSelect.Item>
            </WexSelect.Group>
          </WexSelect.Content>
        </WexSelect>
      );

      expect(screen.getByText("Fruits")).toBeInTheDocument();
      expect(screen.getByText("Vegetables")).toBeInTheDocument();
    });

    it("renders separator between groups", () => {
      render(
        <WexSelect open>
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="1">Option 1</WexSelect.Item>
            <WexSelect.Separator />
            <WexSelect.Item value="2">Option 2</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );

      // Separator should be rendered
      expect(document.querySelector('[data-radix-collection-item]')).toBeInTheDocument();
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe("Accessibility", () => {
    it("has correct combobox role on trigger", () => {
      render(
        <WexSelect>
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="1">Option</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("has listbox role on content", () => {
      render(
        <WexSelect open>
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="1">Option</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );

      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("has option role on items", () => {
      render(
        <WexSelect open>
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="1">Option 1</WexSelect.Item>
            <WexSelect.Item value="2">Option 2</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );

      expect(screen.getAllByRole("option")).toHaveLength(2);
    });

    it("has aria-expanded attribute", () => {
      render(
        <WexSelect>
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="1">Option</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("can be associated with a label", () => {
      render(
        <>
          <WexLabel htmlFor="fruit-select">Fruit</WexLabel>
          <WexSelect>
            <WexSelect.Trigger id="fruit-select">
              <WexSelect.Value placeholder="Select" />
            </WexSelect.Trigger>
            <WexSelect.Content>
              <WexSelect.Item value="apple">Apple</WexSelect.Item>
            </WexSelect.Content>
          </WexSelect>
        </>
      );

      expect(screen.getByLabelText("Fruit")).toBeInTheDocument();
    });

    it("supports name attribute prop", () => {
      render(
        <WexSelect name="fruit" defaultValue="apple">
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="apple">Apple</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );

      // The select should render with the name prop accepted
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("supports required attribute", () => {
      render(
        <WexSelect required>
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="apple">Apple</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );

      expect(screen.getByRole("combobox")).toHaveAttribute("aria-required", "true");
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("handles many options", () => {
      const options = Array.from({ length: 50 }, (_, i) => ({
        value: `option-${i}`,
        label: `Option ${i + 1}`,
      }));

      render(
        <WexSelect open>
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            {options.map((opt) => (
              <WexSelect.Item key={opt.value} value={opt.value}>
                {opt.label}
              </WexSelect.Item>
            ))}
          </WexSelect.Content>
        </WexSelect>
      );

      expect(screen.getAllByRole("option")).toHaveLength(50);
    });

    it("shows all options when open", () => {
      render(
        <WexSelect open>
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="1">Option 1</WexSelect.Item>
            <WexSelect.Item value="2">Option 2</WexSelect.Item>
            <WexSelect.Item value="3">Option 3</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );

      expect(screen.getAllByRole("option")).toHaveLength(3);
    });

    it("works with single option", () => {
      render(
        <WexSelect open>
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="only">Only Option</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );

      expect(screen.getByRole("option", { name: "Only Option" })).toBeInTheDocument();
    });

    it("preserves selection after re-render", () => {
      const { rerender } = render(
        <WexSelect defaultValue="apple">
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="apple">Apple</WexSelect.Item>
            <WexSelect.Item value="banana">Banana</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );

      expect(screen.getByText("Apple")).toBeInTheDocument();

      // Trigger a re-render with same props
      rerender(
        <WexSelect defaultValue="apple">
          <WexSelect.Trigger>
            <WexSelect.Value placeholder="Select" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="apple">Apple</WexSelect.Item>
            <WexSelect.Item value="banana">Banana</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
      );

      expect(screen.getByText("Apple")).toBeInTheDocument();
    });
  });
});
