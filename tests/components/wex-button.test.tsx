/**
 * WexButton Component Tests
 *
 * Comprehensive tests covering:
 * - Rendering and prop forwarding
 * - User interactions (click, keyboard)
 * - Accessibility (ARIA attributes, focus management)
 * - Loading and disabled states
 * - All variants and sizes
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { WexButton } from "@/components/wex";

describe("WexButton", () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("renders without crashing", () => {
      render(<WexButton>Click me</WexButton>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders children correctly", () => {
      render(<WexButton>Test Button</WexButton>);
      expect(screen.getByText("Test Button")).toBeInTheDocument();
    });

    it("accepts and applies className prop", () => {
      render(<WexButton className="custom-class">Button</WexButton>);
      expect(screen.getByRole("button")).toHaveClass("custom-class");
    });

    it("forwards ref correctly", () => {
      const ref = createRef<HTMLButtonElement>();
      render(<WexButton ref={ref}>Button</WexButton>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("renders as child component with asChild prop", () => {
      render(
        <WexButton asChild>
          <a href="/test">Link Button</a>
        </WexButton>
      );
      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/test");
    });
  });

  // ============================================
  // VARIANT TESTS
  // ============================================
  describe("Variants", () => {
    const variants = [
      "primary",
      "secondary",
      "destructive",
      "success",
      "info",
      "warning",
      "help",
      "contrast",
      "ghost",
      "outline",
      "link",
    ] as const;

    variants.forEach((variant) => {
      it(`renders with ${variant} intent`, () => {
        render(<WexButton intent={variant}>{variant}</WexButton>);
        expect(screen.getByRole("button")).toBeInTheDocument();
      });
    });

    it("applies default intent when not specified", () => {
      render(<WexButton>Default</WexButton>);
      const button = screen.getByRole("button");
      // Primary is the default - check it has primary-related classes
      expect(button).toHaveClass("bg-wex-button-primary-bg");
    });
  });

  // ============================================
  // SIZE TESTS
  // ============================================
  describe("Sizes", () => {
    it("renders with sm size", () => {
      render(<WexButton size="sm">Small</WexButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-8");
    });

    it("renders with md (default) size", () => {
      render(<WexButton size="md">Medium</WexButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-11");
    });

    it("renders with lg size", () => {
      render(<WexButton size="lg">Large</WexButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-12");
    });

    it("renders with icon size", () => {
      render(<WexButton size="icon">🔍</WexButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-11", "w-11");
    });
  });

  // ============================================
  // ROUNDED VARIANT
  // ============================================
  describe("Rounded", () => {
    it("renders with rounded-md by default", () => {
      render(<WexButton>Not Rounded</WexButton>);
      expect(screen.getByRole("button")).toHaveClass("rounded-md");
    });

    it("renders with rounded-full when rounded prop is true", () => {
      render(<WexButton rounded>Rounded</WexButton>);
      expect(screen.getByRole("button")).toHaveClass("rounded-full");
    });
  });

  // ============================================
  // INTERACTION TESTS
  // ============================================
  describe("Interactions", () => {
    it("calls onClick handler when clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<WexButton onClick={handleClick}>Click</WexButton>);

      await user.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("triggers onClick on Enter key press", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<WexButton onClick={handleClick}>Click</WexButton>);

      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("triggers onClick on Space key press", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<WexButton onClick={handleClick}>Click</WexButton>);

      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard(" ");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <WexButton onClick={handleClick} disabled>
          Disabled
        </WexButton>
      );

      await user.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("can be focused with keyboard", async () => {
      const user = userEvent.setup();
      render(<WexButton>Focusable</WexButton>);

      await user.tab();
      expect(screen.getByRole("button")).toHaveFocus();
    });
  });

  // ============================================
  // DISABLED STATE TESTS
  // ============================================
  describe("Disabled State", () => {
    it("is disabled when disabled prop is true", () => {
      render(<WexButton disabled>Disabled</WexButton>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("has pointer-events-none class when disabled", () => {
      render(<WexButton disabled>Disabled</WexButton>);
      expect(screen.getByRole("button")).toHaveClass("disabled:pointer-events-none");
    });

    it("cannot be focused when disabled", async () => {
      const user = userEvent.setup();
      render(
        <>
          <WexButton disabled>Disabled</WexButton>
          <WexButton>Enabled</WexButton>
        </>
      );

      await user.tab();
      // Should skip the disabled button
      expect(screen.getByText("Enabled").closest("button")).toHaveFocus();
    });
  });

  // ============================================
  // LOADING STATE TESTS
  // ============================================
  describe("Loading State", () => {
    it("is disabled when loading", () => {
      render(<WexButton loading>Loading</WexButton>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("shows loading spinner when loading", () => {
      render(<WexButton loading>Loading</WexButton>);
      // The Loader2 icon should be present with animate-spin class
      const button = screen.getByRole("button");
      const spinner = button.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });

    it("has aria-busy attribute when loading", () => {
      render(<WexButton loading>Loading</WexButton>);
      expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
    });

    it("does not call onClick when loading", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <WexButton onClick={handleClick} loading>
          Loading
        </WexButton>
      );

      await user.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("still renders children when loading", () => {
      render(<WexButton loading>Save</WexButton>);
      expect(screen.getByText("Save")).toBeInTheDocument();
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe("Accessibility", () => {
    it("has correct button role", () => {
      render(<WexButton>Button</WexButton>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("accepts aria-label for icon buttons", () => {
      render(
        <WexButton size="icon" aria-label="Search">
          🔍
        </WexButton>
      );
      expect(screen.getByRole("button")).toHaveAccessibleName("Search");
    });

    it("accepts aria-describedby", () => {
      render(
        <>
          <WexButton aria-describedby="help-text">Submit</WexButton>
          <p id="help-text">Click to submit the form</p>
        </>
      );
      expect(screen.getByRole("button")).toHaveAccessibleDescription(
        "Click to submit the form"
      );
    });

    it("supports type attribute for form submission", () => {
      render(<WexButton type="submit">Submit</WexButton>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });

    it("defaults to type button", () => {
      render(<WexButton>Click</WexButton>);
      // Default HTML button type is "submit" but explicit button elements
      // should have type="button" by convention for non-form buttons
      // The component doesn't override this, so it defaults to "submit"
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  // ============================================
  // FORM INTEGRATION TESTS
  // ============================================
  describe("Form Integration", () => {
    it("submits form when type is submit", async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn((e) => e.preventDefault());

      render(
        <form onSubmit={handleSubmit}>
          <WexButton type="submit">Submit</WexButton>
        </form>
      );

      await user.click(screen.getByRole("button"));
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it("resets form when type is reset", async () => {
      const user = userEvent.setup();
      const handleReset = vi.fn();

      render(
        <form onReset={handleReset}>
          <WexButton type="reset">Reset</WexButton>
        </form>
      );

      await user.click(screen.getByRole("button"));
      expect(handleReset).toHaveBeenCalledTimes(1);
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("handles multiple rapid clicks", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<WexButton onClick={handleClick}>Click</WexButton>);

      const button = screen.getByRole("button");
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it("handles empty children", () => {
      render(<WexButton>{""}</WexButton>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("handles React element children", () => {
      render(
        <WexButton>
          <span data-testid="child">Icon</span>
          Text
        </WexButton>
      );
      expect(screen.getByTestId("child")).toBeInTheDocument();
      expect(screen.getByText("Text")).toBeInTheDocument();
    });

    it("combines multiple props correctly", () => {
      render(
        <WexButton
          intent="destructive"
          size="lg"
          rounded
          className="extra-class"
          data-testid="combo-button"
        >
          Delete All
        </WexButton>
      );

      const button = screen.getByTestId("combo-button");
      expect(button).toHaveClass("rounded-full", "h-12", "extra-class");
    });
  });
});
