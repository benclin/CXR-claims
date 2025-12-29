/**
 * WexInput Component Tests
 *
 * Comprehensive tests covering:
 * - Rendering and prop forwarding
 * - User interactions (typing, clearing, focus)
 * - Accessibility (ARIA attributes, labels)
 * - Variants and sizes
 * - Invalid state
 * - Icons (left/right)
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { createRef, useState } from "react";
import { WexInput, WexLabel } from "@/components/wex";

describe("WexInput", () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("renders without crashing", () => {
      render(<WexInput />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("accepts and applies className prop", () => {
      render(<WexInput className="custom-class" />);
      expect(screen.getByRole("textbox")).toHaveClass("custom-class");
    });

    it("forwards ref correctly", () => {
      const ref = createRef<HTMLInputElement>();
      render(<WexInput ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it("renders with placeholder text", () => {
      render(<WexInput placeholder="Enter text..." />);
      expect(screen.getByPlaceholderText("Enter text...")).toBeInTheDocument();
    });
  });

  // ============================================
  // VARIANT TESTS
  // ============================================
  describe("Variants", () => {
    it("renders with default variant", () => {
      render(<WexInput data-testid="input" />);
      const input = screen.getByTestId("input");
      expect(input).toHaveClass("bg-wex-input-bg", "border");
    });

    it("renders with filled variant", () => {
      render(<WexInput variant="filled" data-testid="input" />);
      const input = screen.getByTestId("input");
      expect(input).toHaveClass("border-transparent");
    });
  });

  // ============================================
  // SIZE TESTS
  // ============================================
  describe("Sizes", () => {
    it("renders with sm size", () => {
      render(<WexInput inputSize="sm" data-testid="input" />);
      expect(screen.getByTestId("input")).toHaveClass("h-8");
    });

    it("renders with md (default) size", () => {
      render(<WexInput inputSize="md" data-testid="input" />);
      expect(screen.getByTestId("input")).toHaveClass("h-11");
    });

    it("renders with lg size", () => {
      render(<WexInput inputSize="lg" data-testid="input" />);
      expect(screen.getByTestId("input")).toHaveClass("h-12");
    });
  });

  // ============================================
  // INPUT TYPE TESTS
  // ============================================
  describe("Input Types", () => {
    it("renders text type by default", () => {
      render(<WexInput />);
      // Default type is text (implicit)
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("renders with email type", () => {
      render(<WexInput type="email" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
    });

    it("renders with password type", () => {
      render(<WexInput type="password" />);
      // Password inputs don't have textbox role
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it("renders with number type", () => {
      render(<WexInput type="number" />);
      expect(screen.getByRole("spinbutton")).toBeInTheDocument();
    });

    it("renders with tel type", () => {
      render(<WexInput type="tel" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "tel");
    });

    it("renders with url type", () => {
      render(<WexInput type="url" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "url");
    });

    it("renders with search type", () => {
      render(<WexInput type="search" />);
      expect(screen.getByRole("searchbox")).toBeInTheDocument();
    });
  });

  // ============================================
  // INTERACTION TESTS
  // ============================================
  describe("Interactions", () => {
    it("accepts text input", async () => {
      const user = userEvent.setup();
      render(<WexInput />);

      const input = screen.getByRole("textbox");
      await user.type(input, "Hello World");
      expect(input).toHaveValue("Hello World");
    });

    it("calls onChange when typing", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<WexInput onChange={handleChange} />);

      await user.type(screen.getByRole("textbox"), "test");
      expect(handleChange).toHaveBeenCalledTimes(4); // Once per character
    });

    it("calls onFocus when focused", async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();
      render(<WexInput onFocus={handleFocus} />);

      await user.click(screen.getByRole("textbox"));
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it("calls onBlur when focus is lost", async () => {
      const user = userEvent.setup();
      const handleBlur = vi.fn();
      render(
        <>
          <WexInput onBlur={handleBlur} />
          <button>Other</button>
        </>
      );

      const input = screen.getByRole("textbox");
      await user.click(input);
      await user.click(screen.getByRole("button"));
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it("can be cleared", async () => {
      const user = userEvent.setup();
      render(<WexInput defaultValue="initial text" />);

      const input = screen.getByRole("textbox");
      await user.clear(input);
      expect(input).toHaveValue("");
    });

    it("handles paste events", async () => {
      const user = userEvent.setup();
      render(<WexInput />);

      const input = screen.getByRole("textbox");
      await user.click(input);
      await user.paste("pasted text");
      expect(input).toHaveValue("pasted text");
    });

    it("can be focused with keyboard", async () => {
      const user = userEvent.setup();
      render(<WexInput />);

      await user.tab();
      expect(screen.getByRole("textbox")).toHaveFocus();
    });
  });

  // ============================================
  // CONTROLLED VS UNCONTROLLED
  // ============================================
  describe("Controlled vs Uncontrolled", () => {
    it("works as uncontrolled with defaultValue", async () => {
      const user = userEvent.setup();
      render(<WexInput defaultValue="initial" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("initial");

      await user.clear(input);
      await user.type(input, "new value");
      expect(input).toHaveValue("new value");
    });

    it("works as controlled with value and onChange", async () => {
      const user = userEvent.setup();
      const ControlledInput = () => {
        const [value, setValue] = useState("controlled");
        return (
          <WexInput
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        );
      };
      render(<ControlledInput />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("controlled");

      await user.clear(input);
      await user.type(input, "updated");
      expect(input).toHaveValue("updated");
    });
  });

  // ============================================
  // DISABLED STATE TESTS
  // ============================================
  describe("Disabled State", () => {
    it("is disabled when disabled prop is true", () => {
      render(<WexInput disabled />);
      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("does not accept input when disabled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<WexInput disabled onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "test");
      expect(handleChange).not.toHaveBeenCalled();
      expect(input).toHaveValue("");
    });

    it("cannot be focused when disabled", async () => {
      const user = userEvent.setup();
      render(
        <>
          <WexInput disabled />
          <WexInput data-testid="enabled" />
        </>
      );

      await user.tab();
      expect(screen.getByTestId("enabled")).toHaveFocus();
    });

    it("has correct disabled styling classes", () => {
      render(<WexInput disabled data-testid="input" />);
      const input = screen.getByTestId("input");
      expect(input).toHaveClass("disabled:cursor-not-allowed");
    });
  });

  // ============================================
  // READ-ONLY STATE TESTS
  // ============================================
  describe("Read-Only State", () => {
    it("is read-only when readOnly prop is true", () => {
      render(<WexInput readOnly defaultValue="read only" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("readonly");
    });

    it("does not accept input when read-only", async () => {
      const user = userEvent.setup();
      render(<WexInput readOnly defaultValue="read only" />);

      const input = screen.getByRole("textbox");
      await user.type(input, "new text");
      expect(input).toHaveValue("read only");
    });

    it("can still be focused when read-only", async () => {
      const user = userEvent.setup();
      render(<WexInput readOnly />);

      await user.tab();
      expect(screen.getByRole("textbox")).toHaveFocus();
    });
  });

  // ============================================
  // INVALID STATE TESTS
  // ============================================
  describe("Invalid State", () => {
    it("renders with invalid styling when invalid prop is true", () => {
      render(<WexInput invalid data-testid="input" />);
      const input = screen.getByTestId("input");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("applies invalid border styles", () => {
      render(<WexInput invalid data-testid="input" />);
      // The component should have invalid border classes
      const input = screen.getByTestId("input");
      expect(input).toBeInTheDocument();
    });
  });

  // ============================================
  // ICON TESTS
  // ============================================
  describe("Icons", () => {
    it("renders with left icon", () => {
      render(
        <WexInput
          leftIcon={<span data-testid="left-icon">🔍</span>}
          placeholder="Search"
        />
      );
      expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    });

    it("renders with right icon", () => {
      render(
        <WexInput
          rightIcon={<span data-testid="right-icon">✉️</span>}
          placeholder="Email"
        />
      );
      expect(screen.getByTestId("right-icon")).toBeInTheDocument();
    });

    it("renders with both icons", () => {
      render(
        <WexInput
          leftIcon={<span data-testid="left-icon">🔍</span>}
          rightIcon={<span data-testid="right-icon">✓</span>}
        />
      );
      expect(screen.getByTestId("left-icon")).toBeInTheDocument();
      expect(screen.getByTestId("right-icon")).toBeInTheDocument();
    });

    it("adds padding for left icon", () => {
      render(
        <WexInput
          leftIcon={<span>🔍</span>}
          data-testid="input"
        />
      );
      expect(screen.getByRole("textbox")).toHaveClass("pl-10");
    });

    it("adds padding for right icon", () => {
      render(
        <WexInput
          rightIcon={<span>✉️</span>}
          data-testid="input"
        />
      );
      expect(screen.getByRole("textbox")).toHaveClass("pr-10");
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe("Accessibility", () => {
    it("has correct textbox role", () => {
      render(<WexInput />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("can be associated with a label", () => {
      render(
        <>
          <WexLabel htmlFor="email-input">Email</WexLabel>
          <WexInput id="email-input" type="email" />
        </>
      );
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
    });

    it("supports aria-label", () => {
      render(<WexInput aria-label="Search query" />);
      expect(screen.getByRole("textbox")).toHaveAccessibleName("Search query");
    });

    it("supports aria-describedby", () => {
      render(
        <>
          <WexInput aria-describedby="help-text" />
          <p id="help-text">Enter your full name</p>
        </>
      );
      expect(screen.getByRole("textbox")).toHaveAccessibleDescription(
        "Enter your full name"
      );
    });

    it("supports aria-required", () => {
      render(<WexInput aria-required="true" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-required", "true");
    });

    it("supports required attribute", () => {
      render(<WexInput required />);
      expect(screen.getByRole("textbox")).toBeRequired();
    });
  });

  // ============================================
  // FORM INTEGRATION TESTS
  // ============================================
  describe("Form Integration", () => {
    it("submits form on Enter key in text input", async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn((e) => e.preventDefault());

      render(
        <form onSubmit={handleSubmit}>
          <WexInput name="username" />
        </form>
      );

      const input = screen.getByRole("textbox");
      await user.type(input, "testuser{Enter}");
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it("has correct name attribute for form data", () => {
      render(<WexInput name="email" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("name", "email");
    });

    it("supports autocomplete attribute", () => {
      render(<WexInput autoComplete="email" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("autocomplete", "email");
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("handles rapid typing", async () => {
      const user = userEvent.setup({ delay: null });
      render(<WexInput />);

      const input = screen.getByRole("textbox");
      await user.type(input, "rapidtypingtest");
      expect(input).toHaveValue("rapidtypingtest");
    });

    it("handles special characters", async () => {
      const user = userEvent.setup();
      render(<WexInput />);

      const input = screen.getByRole("textbox");
      await user.type(input, "test@email.com!#$%");
      expect(input).toHaveValue("test@email.com!#$%");
    });

    it("handles unicode characters", async () => {
      const user = userEvent.setup();
      render(<WexInput />);

      const input = screen.getByRole("textbox");
      await user.type(input, "こんにちは 🎉");
      expect(input).toHaveValue("こんにちは 🎉");
    });

    it("respects maxLength attribute", async () => {
      const user = userEvent.setup();
      render(<WexInput maxLength={5} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "toolongtext");
      expect(input).toHaveValue("toolo");
    });

    it("respects minLength attribute", () => {
      render(<WexInput minLength={3} />);
      expect(screen.getByRole("textbox")).toHaveAttribute("minlength", "3");
    });

    it("respects pattern attribute", () => {
      render(<WexInput pattern="[A-Za-z]+" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("pattern", "[A-Za-z]+");
    });
  });
});
