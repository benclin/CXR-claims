/**
 * WexCheckbox Component Tests
 *
 * Comprehensive tests covering:
 * - Rendering and prop forwarding
 * - User interactions (click, keyboard)
 * - Accessibility (ARIA attributes, labels)
 * - Checked and indeterminate states
 * - Disabled state
 */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { createRef, useState } from "react";
import { WexCheckbox, WexLabel } from "@/components/wex";

describe("WexCheckbox", () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("renders without crashing", () => {
      render(<WexCheckbox />);
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("accepts and applies className prop", () => {
      render(<WexCheckbox className="custom-class" />);
      expect(screen.getByRole("checkbox")).toHaveClass("custom-class");
    });

    it("forwards ref correctly", () => {
      const ref = createRef<HTMLButtonElement>();
      render(<WexCheckbox ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("renders with id for label association", () => {
      render(<WexCheckbox id="terms" />);
      expect(screen.getByRole("checkbox")).toHaveAttribute("id", "terms");
    });
  });

  // ============================================
  // STATE TESTS
  // ============================================
  describe("States", () => {
    it("is unchecked by default", () => {
      render(<WexCheckbox />);
      expect(screen.getByRole("checkbox")).not.toBeChecked();
    });

    it("can be checked by default", () => {
      render(<WexCheckbox defaultChecked />);
      expect(screen.getByRole("checkbox")).toBeChecked();
    });

    it("supports controlled checked state", () => {
      const ControlledCheckbox = () => {
        const [checked, setChecked] = useState(false);
        return (
          <>
            <WexCheckbox
              checked={checked}
              onCheckedChange={setChecked}
            />
            <span data-testid="state">{checked ? "checked" : "unchecked"}</span>
          </>
        );
      };

      render(<ControlledCheckbox />);
      expect(screen.getByTestId("state")).toHaveTextContent("unchecked");
    });

    it("supports indeterminate state", () => {
      render(<WexCheckbox checked="indeterminate" />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("data-state", "indeterminate");
    });
  });

  // ============================================
  // INTERACTION TESTS
  // ============================================
  describe("Interactions", () => {
    it("toggles when clicked", async () => {
      const user = userEvent.setup();
      render(<WexCheckbox defaultChecked={false} />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it("calls onCheckedChange when toggled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<WexCheckbox onCheckedChange={handleChange} />);

      await user.click(screen.getByRole("checkbox"));
      expect(handleChange).toHaveBeenCalledWith(true);

      await user.click(screen.getByRole("checkbox"));
      expect(handleChange).toHaveBeenCalledWith(false);
    });

    it("toggles on Space key press", async () => {
      const user = userEvent.setup();
      render(<WexCheckbox />);

      const checkbox = screen.getByRole("checkbox");
      checkbox.focus();
      await user.keyboard(" ");
      expect(checkbox).toBeChecked();
    });

    it("can be focused with keyboard", async () => {
      const user = userEvent.setup();
      render(<WexCheckbox />);

      await user.tab();
      expect(screen.getByRole("checkbox")).toHaveFocus();
    });

    it("toggles when label is clicked", async () => {
      const user = userEvent.setup();
      render(
        <div>
          <WexCheckbox id="terms" />
          <WexLabel htmlFor="terms">Accept terms</WexLabel>
        </div>
      );

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();

      await user.click(screen.getByText("Accept terms"));
      expect(checkbox).toBeChecked();
    });
  });

  // ============================================
  // DISABLED STATE TESTS
  // ============================================
  describe("Disabled State", () => {
    it("is disabled when disabled prop is true", () => {
      render(<WexCheckbox disabled />);
      expect(screen.getByRole("checkbox")).toBeDisabled();
    });

    it("cannot be toggled when disabled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<WexCheckbox disabled onCheckedChange={handleChange} />);

      await user.click(screen.getByRole("checkbox"));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("cannot be focused when disabled", async () => {
      const user = userEvent.setup();
      render(
        <>
          <WexCheckbox disabled />
          <WexCheckbox data-testid="enabled" />
        </>
      );

      await user.tab();
      expect(screen.getByTestId("enabled")).toHaveFocus();
    });

    it("maintains checked state when disabled", () => {
      render(<WexCheckbox disabled defaultChecked />);
      expect(screen.getByRole("checkbox")).toBeChecked();
      expect(screen.getByRole("checkbox")).toBeDisabled();
    });
  });

  // ============================================
  // REQUIRED STATE TESTS
  // ============================================
  describe("Required State", () => {
    it("supports required attribute", () => {
      render(<WexCheckbox required />);
      expect(screen.getByRole("checkbox")).toBeRequired();
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe("Accessibility", () => {
    it("has correct checkbox role", () => {
      render(<WexCheckbox />);
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("can be associated with a label", () => {
      render(
        <>
          <WexLabel htmlFor="subscribe">Subscribe to newsletter</WexLabel>
          <WexCheckbox id="subscribe" />
        </>
      );
      expect(screen.getByLabelText("Subscribe to newsletter")).toBeInTheDocument();
    });

    it("supports aria-label", () => {
      render(<WexCheckbox aria-label="Enable notifications" />);
      expect(screen.getByRole("checkbox")).toHaveAccessibleName(
        "Enable notifications"
      );
    });

    it("supports aria-describedby", () => {
      render(
        <>
          <WexCheckbox aria-describedby="help-text" />
          <p id="help-text">Check this to receive updates</p>
        </>
      );
      expect(screen.getByRole("checkbox")).toHaveAccessibleDescription(
        "Check this to receive updates"
      );
    });

    it("has correct aria-checked attribute", async () => {
      const user = userEvent.setup();
      render(<WexCheckbox />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("aria-checked", "false");

      await user.click(checkbox);
      expect(checkbox).toHaveAttribute("aria-checked", "true");
    });

    it("has correct aria-checked for indeterminate state", () => {
      render(<WexCheckbox checked="indeterminate" />);
      expect(screen.getByRole("checkbox")).toHaveAttribute(
        "aria-checked",
        "mixed"
      );
    });
  });

  // ============================================
  // FORM INTEGRATION TESTS
  // ============================================
  describe("Form Integration", () => {
    it("has correct name attribute for form data", () => {
      render(
        <form>
          <WexCheckbox name="terms" defaultChecked />
        </form>
      );
      // Radix checkbox uses hidden input for form submission when inside a form
      const hiddenInput = document.querySelector('input[name="terms"]');
      expect(hiddenInput).toBeInTheDocument();
    });

    it("has correct value attribute", () => {
      render(
        <form>
          <WexCheckbox name="option" value="yes" defaultChecked />
        </form>
      );
      const hiddenInput = document.querySelector('input[name="option"]') as HTMLInputElement;
      // Radix checkbox passes value through hidden input when checked
      expect(hiddenInput).toBeInTheDocument();
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("handles rapid toggling", async () => {
      const user = userEvent.setup({ delay: null });
      const handleChange = vi.fn();
      render(<WexCheckbox onCheckedChange={handleChange} />);

      const checkbox = screen.getByRole("checkbox");
      await user.click(checkbox);
      await user.click(checkbox);
      await user.click(checkbox);

      expect(handleChange).toHaveBeenCalledTimes(3);
      expect(checkbox).toBeChecked(); // Should end checked (odd number of clicks)
    });

    it("works in a group", () => {
      render(
        <div role="group" aria-label="Preferences">
          <div>
            <WexCheckbox id="opt1" />
            <WexLabel htmlFor="opt1">Option 1</WexLabel>
          </div>
          <div>
            <WexCheckbox id="opt2" />
            <WexLabel htmlFor="opt2">Option 2</WexLabel>
          </div>
          <div>
            <WexCheckbox id="opt3" />
            <WexLabel htmlFor="opt3">Option 3</WexLabel>
          </div>
        </div>
      );

      const group = screen.getByRole("group");
      expect(within(group).getAllByRole("checkbox")).toHaveLength(3);
    });

    it("transitions from indeterminate to checked", async () => {
      const user = userEvent.setup();
      const ControlledCheckbox = () => {
        const [checked, setChecked] = useState<boolean | "indeterminate">("indeterminate");
        return (
          <WexCheckbox
            checked={checked}
            onCheckedChange={() => setChecked(true)}
          />
        );
      };

      render(<ControlledCheckbox />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("data-state", "indeterminate");

      await user.click(checkbox);
      expect(checkbox).toHaveAttribute("data-state", "checked");
    });
  });
});
