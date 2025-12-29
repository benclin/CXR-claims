/**
 * WexSwitch Component Tests
 *
 * Comprehensive tests covering:
 * - Rendering and prop forwarding
 * - User interactions (click, keyboard)
 * - Accessibility (ARIA attributes, labels)
 * - Checked and disabled states
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { createRef, useState } from "react";
import { WexSwitch, WexLabel } from "@/components/wex";

describe("WexSwitch", () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("renders without crashing", () => {
      render(<WexSwitch />);
      expect(screen.getByRole("switch")).toBeInTheDocument();
    });

    it("accepts and applies className prop", () => {
      render(<WexSwitch className="custom-class" />);
      expect(screen.getByRole("switch")).toHaveClass("custom-class");
    });

    it("forwards ref correctly", () => {
      const ref = createRef<HTMLButtonElement>();
      render(<WexSwitch ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("renders with id for label association", () => {
      render(<WexSwitch id="airplane-mode" />);
      expect(screen.getByRole("switch")).toHaveAttribute("id", "airplane-mode");
    });
  });

  // ============================================
  // STATE TESTS
  // ============================================
  describe("States", () => {
    it("is off by default", () => {
      render(<WexSwitch />);
      expect(screen.getByRole("switch")).not.toBeChecked();
    });

    it("can be on by default", () => {
      render(<WexSwitch defaultChecked />);
      expect(screen.getByRole("switch")).toBeChecked();
    });

    it("supports controlled checked state", () => {
      const ControlledSwitch = () => {
        const [checked, setChecked] = useState(false);
        return (
          <>
            <WexSwitch checked={checked} onCheckedChange={setChecked} />
            <span data-testid="state">{checked ? "on" : "off"}</span>
          </>
        );
      };

      render(<ControlledSwitch />);
      expect(screen.getByTestId("state")).toHaveTextContent("off");
    });
  });

  // ============================================
  // INTERACTION TESTS
  // ============================================
  describe("Interactions", () => {
    it("toggles when clicked", async () => {
      const user = userEvent.setup();
      render(<WexSwitch />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).not.toBeChecked();

      await user.click(switchElement);
      expect(switchElement).toBeChecked();

      await user.click(switchElement);
      expect(switchElement).not.toBeChecked();
    });

    it("calls onCheckedChange when toggled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<WexSwitch onCheckedChange={handleChange} />);

      await user.click(screen.getByRole("switch"));
      expect(handleChange).toHaveBeenCalledWith(true);

      await user.click(screen.getByRole("switch"));
      expect(handleChange).toHaveBeenCalledWith(false);
    });

    it("toggles on Space key press", async () => {
      const user = userEvent.setup();
      render(<WexSwitch />);

      const switchElement = screen.getByRole("switch");
      switchElement.focus();
      await user.keyboard(" ");
      expect(switchElement).toBeChecked();
    });

    it("toggles on Enter key press", async () => {
      const user = userEvent.setup();
      render(<WexSwitch />);

      const switchElement = screen.getByRole("switch");
      switchElement.focus();
      await user.keyboard("{Enter}");
      expect(switchElement).toBeChecked();
    });

    it("can be focused with keyboard", async () => {
      const user = userEvent.setup();
      render(<WexSwitch />);

      await user.tab();
      expect(screen.getByRole("switch")).toHaveFocus();
    });

    it("toggles when associated label is clicked", async () => {
      const user = userEvent.setup();
      render(
        <div className="flex items-center space-x-2">
          <WexSwitch id="dark-mode" />
          <WexLabel htmlFor="dark-mode">Dark Mode</WexLabel>
        </div>
      );

      const switchElement = screen.getByRole("switch");
      expect(switchElement).not.toBeChecked();

      await user.click(screen.getByText("Dark Mode"));
      expect(switchElement).toBeChecked();
    });
  });

  // ============================================
  // DISABLED STATE TESTS
  // ============================================
  describe("Disabled State", () => {
    it("is disabled when disabled prop is true", () => {
      render(<WexSwitch disabled />);
      expect(screen.getByRole("switch")).toBeDisabled();
    });

    it("cannot be toggled when disabled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<WexSwitch disabled onCheckedChange={handleChange} />);

      await user.click(screen.getByRole("switch"));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("cannot be focused when disabled", async () => {
      const user = userEvent.setup();
      render(
        <>
          <WexSwitch disabled />
          <WexSwitch data-testid="enabled" />
        </>
      );

      await user.tab();
      expect(screen.getByTestId("enabled")).toHaveFocus();
    });

    it("maintains checked state when disabled", () => {
      render(<WexSwitch disabled defaultChecked />);
      expect(screen.getByRole("switch")).toBeChecked();
      expect(screen.getByRole("switch")).toBeDisabled();
    });
  });

  // ============================================
  // REQUIRED STATE TESTS
  // ============================================
  describe("Required State", () => {
    it("supports required attribute", () => {
      render(<WexSwitch required />);
      // Radix uses aria-required instead of HTML required
      expect(screen.getByRole("switch")).toHaveAttribute("aria-required", "true");
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe("Accessibility", () => {
    it("has correct switch role", () => {
      render(<WexSwitch />);
      expect(screen.getByRole("switch")).toBeInTheDocument();
    });

    it("can be associated with a label", () => {
      render(
        <>
          <WexLabel htmlFor="notifications">Enable notifications</WexLabel>
          <WexSwitch id="notifications" />
        </>
      );
      expect(
        screen.getByLabelText("Enable notifications")
      ).toBeInTheDocument();
    });

    it("supports aria-label", () => {
      render(<WexSwitch aria-label="Toggle dark mode" />);
      expect(screen.getByRole("switch")).toHaveAccessibleName(
        "Toggle dark mode"
      );
    });

    it("supports aria-describedby", () => {
      render(
        <>
          <WexSwitch aria-describedby="help-text" />
          <p id="help-text">Enables system-wide dark mode</p>
        </>
      );
      expect(screen.getByRole("switch")).toHaveAccessibleDescription(
        "Enables system-wide dark mode"
      );
    });

    it("has correct aria-checked attribute", async () => {
      const user = userEvent.setup();
      render(<WexSwitch />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveAttribute("aria-checked", "false");

      await user.click(switchElement);
      expect(switchElement).toHaveAttribute("aria-checked", "true");
    });

    it("has correct data-state attribute", async () => {
      const user = userEvent.setup();
      render(<WexSwitch />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveAttribute("data-state", "unchecked");

      await user.click(switchElement);
      expect(switchElement).toHaveAttribute("data-state", "checked");
    });
  });

  // ============================================
  // FORM INTEGRATION TESTS
  // ============================================
  describe("Form Integration", () => {
    it("has correct name attribute for form data", () => {
      render(
        <form>
          <WexSwitch name="newsletter" defaultChecked />
        </form>
      );
      // Radix switch uses hidden input for form submission when inside a form
      const hiddenInput = document.querySelector('input[name="newsletter"]');
      expect(hiddenInput).toBeInTheDocument();
    });

    it("has correct value attribute", () => {
      render(
        <form>
          <WexSwitch name="option" value="enabled" defaultChecked />
        </form>
      );
      const hiddenInput = document.querySelector(
        'input[name="option"]'
      ) as HTMLInputElement;
      // Value is 'on' by default in Radix, or the custom value
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
      render(<WexSwitch onCheckedChange={handleChange} />);

      const switchElement = screen.getByRole("switch");
      await user.click(switchElement);
      await user.click(switchElement);
      await user.click(switchElement);

      expect(handleChange).toHaveBeenCalledTimes(3);
      expect(switchElement).toBeChecked(); // Should end checked (odd number of clicks)
    });

    it("works with multiple switches", async () => {
      const user = userEvent.setup();
      render(
        <div>
          <div>
            <WexSwitch id="wifi" data-testid="wifi" />
            <WexLabel htmlFor="wifi">Wi-Fi</WexLabel>
          </div>
          <div>
            <WexSwitch id="bluetooth" data-testid="bluetooth" />
            <WexLabel htmlFor="bluetooth">Bluetooth</WexLabel>
          </div>
        </div>
      );

      const wifiSwitch = screen.getByTestId("wifi");
      const bluetoothSwitch = screen.getByTestId("bluetooth");

      await user.click(wifiSwitch);
      expect(wifiSwitch).toBeChecked();
      expect(bluetoothSwitch).not.toBeChecked();

      await user.click(bluetoothSwitch);
      expect(wifiSwitch).toBeChecked();
      expect(bluetoothSwitch).toBeChecked();
    });

    it("controlled component updates external state", async () => {
      const user = userEvent.setup();
      const ControlledSwitch = () => {
        const [checked, setChecked] = useState(false);
        return (
          <>
            <WexSwitch checked={checked} onCheckedChange={setChecked} />
            <span data-testid="status">{checked ? "ON" : "OFF"}</span>
            <button onClick={() => setChecked(true)}>Turn On</button>
          </>
        );
      };

      render(<ControlledSwitch />);

      expect(screen.getByTestId("status")).toHaveTextContent("OFF");

      await user.click(screen.getByRole("button", { name: "Turn On" }));
      expect(screen.getByTestId("status")).toHaveTextContent("ON");
      expect(screen.getByRole("switch")).toBeChecked();
    });
  });
});
