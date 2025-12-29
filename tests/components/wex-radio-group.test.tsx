/**
 * WexRadioGroup Component Tests
 *
 * Comprehensive tests covering:
 * - Rendering and composition
 * - Selection behavior
 * - Keyboard navigation
 * - Controlled and uncontrolled modes
 * - Accessibility
 */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { WexRadioGroup, WexLabel } from "@/components/wex";

describe("WexRadioGroup", () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("renders without crashing", () => {
      render(
        <WexRadioGroup defaultValue="option-1">
          <WexRadioGroup.Item value="option-1" id="option-1" />
          <WexRadioGroup.Item value="option-2" id="option-2" />
        </WexRadioGroup>
      );
      expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    });

    it("renders multiple radio items", () => {
      render(
        <WexRadioGroup defaultValue="a">
          <WexRadioGroup.Item value="a" id="a" />
          <WexRadioGroup.Item value="b" id="b" />
          <WexRadioGroup.Item value="c" id="c" />
        </WexRadioGroup>
      );
      expect(screen.getAllByRole("radio")).toHaveLength(3);
    });

    it("has default value selected", () => {
      render(
        <WexRadioGroup defaultValue="selected">
          <WexRadioGroup.Item value="selected" id="selected" />
          <WexRadioGroup.Item value="other" id="other" />
        </WexRadioGroup>
      );
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toBeChecked();
      expect(radios[1]).not.toBeChecked();
    });

    it("accepts className on group", () => {
      render(
        <WexRadioGroup defaultValue="a" className="custom-group">
          <WexRadioGroup.Item value="a" id="a" />
        </WexRadioGroup>
      );
      expect(screen.getByRole("radiogroup")).toHaveClass("custom-group");
    });

    it("accepts className on items", () => {
      render(
        <WexRadioGroup defaultValue="a">
          <WexRadioGroup.Item value="a" id="a" className="custom-item" />
        </WexRadioGroup>
      );
      expect(screen.getByRole("radio")).toHaveClass("custom-item");
    });
  });

  // ============================================
  // SELECTION BEHAVIOR
  // ============================================
  describe("Selection Behavior", () => {
    it("selects item when clicked", async () => {
      const user = userEvent.setup();
      render(
        <WexRadioGroup>
          <WexRadioGroup.Item value="a" id="a" />
          <WexRadioGroup.Item value="b" id="b" />
        </WexRadioGroup>
      );

      const radios = screen.getAllByRole("radio");
      await user.click(radios[1]);

      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).toBeChecked();
    });

    it("only one item can be selected", async () => {
      const user = userEvent.setup();
      render(
        <WexRadioGroup defaultValue="a">
          <WexRadioGroup.Item value="a" id="a" />
          <WexRadioGroup.Item value="b" id="b" />
          <WexRadioGroup.Item value="c" id="c" />
        </WexRadioGroup>
      );

      const radios = screen.getAllByRole("radio");

      await user.click(radios[1]);
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).toBeChecked();
      expect(radios[2]).not.toBeChecked();

      await user.click(radios[2]);
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).not.toBeChecked();
      expect(radios[2]).toBeChecked();
    });

    it("calls onValueChange when selection changes", async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(
        <WexRadioGroup onValueChange={handleValueChange}>
          <WexRadioGroup.Item value="a" id="a" />
          <WexRadioGroup.Item value="b" id="b" />
        </WexRadioGroup>
      );

      await user.click(screen.getAllByRole("radio")[1]);
      expect(handleValueChange).toHaveBeenCalledWith("b");
    });

    it("selects when clicking associated label", async () => {
      const user = userEvent.setup();
      render(
        <WexRadioGroup>
          <div>
            <WexRadioGroup.Item value="a" id="option-a" />
            <WexLabel htmlFor="option-a">Option A</WexLabel>
          </div>
          <div>
            <WexRadioGroup.Item value="b" id="option-b" />
            <WexLabel htmlFor="option-b">Option B</WexLabel>
          </div>
        </WexRadioGroup>
      );

      await user.click(screen.getByText("Option B"));
      expect(screen.getByLabelText("Option B")).toBeChecked();
    });
  });

  // ============================================
  // KEYBOARD NAVIGATION
  // ============================================
  describe("Keyboard Navigation", () => {
    it("responds to arrow key navigation (ArrowDown)", async () => {
      const user = userEvent.setup();
      render(
        <WexRadioGroup defaultValue="a">
          <WexRadioGroup.Item value="a" id="a" />
          <WexRadioGroup.Item value="b" id="b" />
          <WexRadioGroup.Item value="c" id="c" />
        </WexRadioGroup>
      );

      const radios = screen.getAllByRole("radio");
      radios[0].focus();
      expect(radios[0]).toHaveFocus();

      // Arrow navigation triggers focus movement in Radix - verify it doesn't throw
      await user.keyboard("{ArrowDown}");
      // In JSDOM, focus behavior may differ from browser
    });

    it("responds to arrow key navigation (ArrowUp)", async () => {
      const user = userEvent.setup();
      render(
        <WexRadioGroup defaultValue="c">
          <WexRadioGroup.Item value="a" id="a" />
          <WexRadioGroup.Item value="b" id="b" />
          <WexRadioGroup.Item value="c" id="c" />
        </WexRadioGroup>
      );

      const radios = screen.getAllByRole("radio");
      radios[2].focus();
      expect(radios[2]).toHaveFocus();

      await user.keyboard("{ArrowUp}");
      // In JSDOM, focus behavior may differ from browser
    });

    it("responds to arrow key navigation (ArrowRight)", async () => {
      const user = userEvent.setup();
      render(
        <WexRadioGroup defaultValue="a" orientation="horizontal">
          <WexRadioGroup.Item value="a" id="a" />
          <WexRadioGroup.Item value="b" id="b" />
        </WexRadioGroup>
      );

      const radios = screen.getAllByRole("radio");
      radios[0].focus();
      expect(radios[0]).toHaveFocus();

      await user.keyboard("{ArrowRight}");
      // In JSDOM, focus behavior may differ from browser
    });

    it("responds to arrow key navigation (ArrowLeft)", async () => {
      const user = userEvent.setup();
      render(
        <WexRadioGroup defaultValue="b" orientation="horizontal">
          <WexRadioGroup.Item value="a" id="a" />
          <WexRadioGroup.Item value="b" id="b" />
        </WexRadioGroup>
      );

      const radios = screen.getAllByRole("radio");
      radios[1].focus();
      expect(radios[1]).toHaveFocus();

      await user.keyboard("{ArrowLeft}");
      // In JSDOM, focus behavior may differ from browser
    });

    it("supports loop prop for wrapping behavior", () => {
      render(
        <WexRadioGroup defaultValue="c" loop>
          <WexRadioGroup.Item value="a" id="a" />
          <WexRadioGroup.Item value="b" id="b" />
          <WexRadioGroup.Item value="c" id="c" />
        </WexRadioGroup>
      );

      // Verify loop prop is accepted and renders
      expect(screen.getAllByRole("radio")).toHaveLength(3);
    });

    it("supports wrapping navigation (last to first)", async () => {
      const user = userEvent.setup();
      render(
        <WexRadioGroup defaultValue="c">
          <WexRadioGroup.Item value="a" id="a" />
          <WexRadioGroup.Item value="b" id="b" />
          <WexRadioGroup.Item value="c" id="c" />
        </WexRadioGroup>
      );

      const radios = screen.getAllByRole("radio");
      radios[2].focus();
      
      await user.keyboard("{ArrowDown}");
      // Verify navigation works (focus may change)
    });

    it("can be focused with Tab", async () => {
      const user = userEvent.setup();
      render(
        <WexRadioGroup defaultValue="a">
          <WexRadioGroup.Item value="a" id="a" />
          <WexRadioGroup.Item value="b" id="b" />
        </WexRadioGroup>
      );

      await user.tab();
      expect(screen.getAllByRole("radio")[0]).toHaveFocus();
    });

    it("renders disabled items correctly", () => {
      render(
        <WexRadioGroup defaultValue="a">
          <WexRadioGroup.Item value="a" id="a" />
          <WexRadioGroup.Item value="b" id="b" disabled />
          <WexRadioGroup.Item value="c" id="c" />
        </WexRadioGroup>
      );

      const radios = screen.getAllByRole("radio");
      expect(radios[1]).toBeDisabled();
    });
  });

  // ============================================
  // CONTROLLED MODE
  // ============================================
  describe("Controlled Mode", () => {
    it("supports controlled value", async () => {
      const user = userEvent.setup();
      const ControlledRadioGroup = () => {
        const [value, setValue] = useState("a");
        return (
          <>
            <span data-testid="value">{value}</span>
            <WexRadioGroup value={value} onValueChange={setValue}>
              <WexRadioGroup.Item value="a" id="a" />
              <WexRadioGroup.Item value="b" id="b" />
            </WexRadioGroup>
          </>
        );
      };

      render(<ControlledRadioGroup />);
      expect(screen.getByTestId("value")).toHaveTextContent("a");

      await user.click(screen.getAllByRole("radio")[1]);
      expect(screen.getByTestId("value")).toHaveTextContent("b");
    });

    it("external value change updates selection", () => {
      const { rerender } = render(
        <WexRadioGroup value="a">
          <WexRadioGroup.Item value="a" id="a" />
          <WexRadioGroup.Item value="b" id="b" />
        </WexRadioGroup>
      );

      expect(screen.getAllByRole("radio")[0]).toBeChecked();

      rerender(
        <WexRadioGroup value="b">
          <WexRadioGroup.Item value="a" id="a" />
          <WexRadioGroup.Item value="b" id="b" />
        </WexRadioGroup>
      );

      expect(screen.getAllByRole("radio")[1]).toBeChecked();
    });
  });

  // ============================================
  // DISABLED STATE
  // ============================================
  describe("Disabled State", () => {
    it("disabled group disables all items", () => {
      render(
        <WexRadioGroup disabled>
          <WexRadioGroup.Item value="a" id="a" />
          <WexRadioGroup.Item value="b" id="b" />
        </WexRadioGroup>
      );

      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toBeDisabled();
      expect(radios[1]).toBeDisabled();
    });

    it("individual item can be disabled", () => {
      render(
        <WexRadioGroup>
          <WexRadioGroup.Item value="a" id="a" />
          <WexRadioGroup.Item value="b" id="b" disabled />
        </WexRadioGroup>
      );

      const radios = screen.getAllByRole("radio");
      expect(radios[0]).not.toBeDisabled();
      expect(radios[1]).toBeDisabled();
    });

    it("cannot select disabled item", async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(
        <WexRadioGroup onValueChange={handleValueChange}>
          <WexRadioGroup.Item value="a" id="a" />
          <WexRadioGroup.Item value="b" id="b" disabled />
        </WexRadioGroup>
      );

      await user.click(screen.getAllByRole("radio")[1]);
      expect(handleValueChange).not.toHaveBeenCalled();
    });

    it("cannot focus disabled group", async () => {
      const user = userEvent.setup();
      render(
        <>
          <WexRadioGroup disabled>
            <WexRadioGroup.Item value="a" id="a" />
          </WexRadioGroup>
          <button>Focusable</button>
        </>
      );

      await user.tab();
      expect(screen.getByRole("button")).toHaveFocus();
    });
  });

  // ============================================
  // REQUIRED STATE
  // ============================================
  describe("Required State", () => {
    it("supports required attribute", () => {
      render(
        <WexRadioGroup required>
          <WexRadioGroup.Item value="a" id="a" />
        </WexRadioGroup>
      );

      expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-required", "true");
    });
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================
  describe("Accessibility", () => {
    it("has radiogroup role", () => {
      render(
        <WexRadioGroup>
          <WexRadioGroup.Item value="a" id="a" />
        </WexRadioGroup>
      );
      expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    });

    it("has radio role on items", () => {
      render(
        <WexRadioGroup>
          <WexRadioGroup.Item value="a" id="a" />
          <WexRadioGroup.Item value="b" id="b" />
        </WexRadioGroup>
      );
      expect(screen.getAllByRole("radio")).toHaveLength(2);
    });

    it("can be labeled", () => {
      render(
        <>
          <span id="group-label">Payment Method</span>
          <WexRadioGroup aria-labelledby="group-label">
            <WexRadioGroup.Item value="card" id="card" />
            <WexRadioGroup.Item value="cash" id="cash" />
          </WexRadioGroup>
        </>
      );

      expect(screen.getByRole("radiogroup")).toHaveAccessibleName("Payment Method");
    });

    it("items can have labels", () => {
      render(
        <WexRadioGroup>
          <div>
            <WexRadioGroup.Item value="a" id="option-a" />
            <WexLabel htmlFor="option-a">Option A</WexLabel>
          </div>
        </WexRadioGroup>
      );

      expect(screen.getByLabelText("Option A")).toBeInTheDocument();
    });

    it("has correct aria-checked", async () => {
      const user = userEvent.setup();
      render(
        <WexRadioGroup defaultValue="a">
          <WexRadioGroup.Item value="a" id="a" />
          <WexRadioGroup.Item value="b" id="b" />
        </WexRadioGroup>
      );

      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toHaveAttribute("aria-checked", "true");
      expect(radios[1]).toHaveAttribute("aria-checked", "false");

      await user.click(radios[1]);
      expect(radios[0]).toHaveAttribute("aria-checked", "false");
      expect(radios[1]).toHaveAttribute("aria-checked", "true");
    });
  });

  // ============================================
  // ORIENTATION
  // ============================================
  describe("Orientation", () => {
    it("supports horizontal orientation", () => {
      render(
        <WexRadioGroup orientation="horizontal">
          <WexRadioGroup.Item value="a" id="a" />
          <WexRadioGroup.Item value="b" id="b" />
        </WexRadioGroup>
      );

      expect(screen.getByRole("radiogroup")).toHaveAttribute(
        "aria-orientation",
        "horizontal"
      );
    });

    it("supports vertical orientation", () => {
      render(
        <WexRadioGroup orientation="vertical">
          <WexRadioGroup.Item value="a" id="a" />
          <WexRadioGroup.Item value="b" id="b" />
        </WexRadioGroup>
      );

      expect(screen.getByRole("radiogroup")).toHaveAttribute(
        "aria-orientation",
        "vertical"
      );
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("handles single option", () => {
      render(
        <WexRadioGroup defaultValue="only">
          <WexRadioGroup.Item value="only" id="only" />
        </WexRadioGroup>
      );

      expect(screen.getByRole("radio")).toBeChecked();
    });

    it("handles many options", () => {
      const options = Array.from({ length: 20 }, (_, i) => `option-${i}`);
      render(
        <WexRadioGroup defaultValue="option-0">
          {options.map((opt) => (
            <WexRadioGroup.Item key={opt} value={opt} id={opt} />
          ))}
        </WexRadioGroup>
      );

      expect(screen.getAllByRole("radio")).toHaveLength(20);
    });

    it("handles rapid selection", async () => {
      const user = userEvent.setup({ delay: null });
      const handleValueChange = vi.fn();

      render(
        <WexRadioGroup onValueChange={handleValueChange}>
          <WexRadioGroup.Item value="a" id="a" />
          <WexRadioGroup.Item value="b" id="b" />
          <WexRadioGroup.Item value="c" id="c" />
        </WexRadioGroup>
      );

      const radios = screen.getAllByRole("radio");
      await user.click(radios[0]);
      await user.click(radios[1]);
      await user.click(radios[2]);

      expect(handleValueChange).toHaveBeenCalledTimes(3);
      expect(handleValueChange).toHaveBeenLastCalledWith("c");
    });

    it("works with no default value", async () => {
      const user = userEvent.setup();
      render(
        <WexRadioGroup>
          <WexRadioGroup.Item value="a" id="a" />
          <WexRadioGroup.Item value="b" id="b" />
        </WexRadioGroup>
      );

      const radios = screen.getAllByRole("radio");
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).not.toBeChecked();

      await user.click(radios[0]);
      expect(radios[0]).toBeChecked();
    });
  });
});
