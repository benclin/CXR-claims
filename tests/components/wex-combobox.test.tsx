/**
 * WexCombobox Component Tests
 *
 * Comprehensive tests covering:
 * - Rendering and composition
 * - Search/filter behavior
 * - Selection behavior
 * - Keyboard navigation
 * - Controlled and uncontrolled modes
 * - Accessibility
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { WexCombobox } from "@/components/wex";

const defaultOptions = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
];

describe("WexCombobox", () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("renders trigger without crashing", () => {
      render(
        <WexCombobox options={defaultOptions} placeholder="Select option" />
      );
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("shows placeholder when no value selected", () => {
      render(<WexCombobox options={defaultOptions} placeholder="Choose..." />);
      expect(screen.getByText("Choose...")).toBeInTheDocument();
    });

    it("displays selected value", () => {
      render(
        <WexCombobox
          options={defaultOptions}
          value="react"
          placeholder="Select option"
        />
      );
      expect(screen.getByText("React")).toBeInTheDocument();
    });

    it("accepts className prop", () => {
      render(
        <WexCombobox
          options={defaultOptions}
          placeholder="Select"
          className="custom-class"
        />
      );
      expect(screen.getByRole("combobox")).toHaveClass("custom-class");
    });
  });

  // ============================================
  // DISABLED STATE TESTS
  // ============================================
  describe("Disabled State", () => {
    it("is disabled when disabled prop is true", () => {
      render(
        <WexCombobox options={defaultOptions} disabled placeholder="Disabled" />
      );
      expect(screen.getByRole("combobox")).toBeDisabled();
    });

    it("cannot open when disabled", async () => {
      const user = userEvent.setup();
      render(
        <WexCombobox options={defaultOptions} disabled placeholder="Disabled" />
      );

      await user.click(screen.getByRole("combobox"));
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  // ============================================
  // OPEN/CLOSE BEHAVIOR
  // ============================================
  describe("Open/Close Behavior", () => {
    it("opens dropdown when clicked", async () => {
      const user = userEvent.setup();
      render(<WexCombobox options={defaultOptions} placeholder="Select" />);

      await user.click(screen.getByRole("combobox"));
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("shows all options when opened", async () => {
      const user = userEvent.setup();
      render(<WexCombobox options={defaultOptions} placeholder="Select" />);

      await user.click(screen.getByRole("combobox"));

      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("Vue")).toBeInTheDocument();
      expect(screen.getByText("Angular")).toBeInTheDocument();
    });

    it("closes when clicking outside", async () => {
      const user = userEvent.setup();
      render(
        <div>
          <WexCombobox options={defaultOptions} placeholder="Select" />
          <button>Outside</button>
        </div>
      );

      await user.click(screen.getByRole("combobox"));
      expect(screen.getByRole("listbox")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Outside" }));
      await waitFor(() => {
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
      });
    });

    it("closes when Escape is pressed", async () => {
      const user = userEvent.setup();
      render(<WexCombobox options={defaultOptions} placeholder="Select" />);

      await user.click(screen.getByRole("combobox"));
      expect(screen.getByRole("listbox")).toBeInTheDocument();

      await user.keyboard("{Escape}");
      await waitFor(() => {
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
      });
    });
  });

  // ============================================
  // SEARCH/FILTER BEHAVIOR
  // ============================================
  describe("Search/Filter Behavior", () => {
    it("filters options when typing", async () => {
      const user = userEvent.setup();
      render(<WexCombobox options={defaultOptions} placeholder="Select" />);

      await user.click(screen.getByRole("combobox"));

      // Find the search input inside the popover
      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, "react");

      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.queryByText("Vue")).not.toBeInTheDocument();
    });

    it("shows no results message when no matches", async () => {
      const user = userEvent.setup();
      render(<WexCombobox options={defaultOptions} placeholder="Select" />);

      await user.click(screen.getByRole("combobox"));

      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, "xyz");

      expect(screen.getByText(/no.*found/i)).toBeInTheDocument();
    });

    it("clears search when selecting", async () => {
      const user = userEvent.setup();
      const ControlledCombobox = () => {
        const [value, setValue] = useState<string>("");
        return (
          <WexCombobox
            options={defaultOptions}
            value={value}
            onValueChange={setValue}
            placeholder="Select"
          />
        );
      };

      render(<ControlledCombobox />);

      await user.click(screen.getByRole("combobox"));
      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, "react");
      await user.click(screen.getByText("React"));

      // Reopen to check search is cleared
      await user.click(screen.getByRole("combobox"));
      expect(screen.getByText("Vue")).toBeInTheDocument();
    });

    it("is case insensitive", async () => {
      const user = userEvent.setup();
      render(<WexCombobox options={defaultOptions} placeholder="Select" />);

      await user.click(screen.getByRole("combobox"));

      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, "REACT");

      expect(screen.getByText("React")).toBeInTheDocument();
    });
  });

  // ============================================
  // SELECTION BEHAVIOR
  // ============================================
  describe("Selection Behavior", () => {
    it("selects item when clicked", async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(
        <WexCombobox
          options={defaultOptions}
          onValueChange={handleValueChange}
          placeholder="Select"
        />
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByText("Vue"));

      expect(handleValueChange).toHaveBeenCalledWith("vue");
    });

    it("closes dropdown after selection", async () => {
      const user = userEvent.setup();
      render(<WexCombobox options={defaultOptions} placeholder="Select" />);

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByText("React"));

      await waitFor(() => {
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
      });
    });

    it("displays selected label", async () => {
      const user = userEvent.setup();
      const ControlledCombobox = () => {
        const [value, setValue] = useState<string>("");
        return (
          <WexCombobox
            options={defaultOptions}
            value={value}
            onValueChange={setValue}
            placeholder="Select"
          />
        );
      };

      render(<ControlledCombobox />);

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByText("Angular"));

      expect(screen.getByText("Angular")).toBeInTheDocument();
    });

    it("displays selected value in trigger", () => {
      render(
        <WexCombobox
          options={defaultOptions}
          value="react"
          placeholder="Select"
        />
      );

      // The selected value should be visible in the trigger button
      expect(screen.getByRole("combobox")).toHaveTextContent("React");
    });
  });

  // ============================================
  // KEYBOARD NAVIGATION
  // ============================================
  describe("Keyboard Navigation", () => {
    it("opens with Enter key", async () => {
      const user = userEvent.setup();
      render(<WexCombobox options={defaultOptions} placeholder="Select" />);

      const trigger = screen.getByRole("combobox");
      trigger.focus();
      await user.keyboard("{Enter}");

      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("navigates options with ArrowDown", async () => {
      const user = userEvent.setup();
      render(<WexCombobox options={defaultOptions} placeholder="Select" />);

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");

      // Check that options can be navigated
      const options = screen.getAllByRole("option");
      expect(options.length).toBeGreaterThan(0);
    });

    it("selects with Enter key", async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(
        <WexCombobox
          options={defaultOptions}
          onValueChange={handleValueChange}
          placeholder="Select"
        />
      );

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Enter}");

      expect(handleValueChange).toHaveBeenCalled();
    });

    it("can be focused with Tab", async () => {
      const user = userEvent.setup();
      render(<WexCombobox options={defaultOptions} placeholder="Select" />);

      await user.tab();
      expect(screen.getByRole("combobox")).toHaveFocus();
    });
  });

  // ============================================
  // CONTROLLED MODE
  // ============================================
  describe("Controlled Mode", () => {
    it("supports controlled value", async () => {
      const user = userEvent.setup();
      const ControlledCombobox = () => {
        const [value, setValue] = useState<string>("");
        return (
          <>
            <span data-testid="value">{value || "none"}</span>
            <WexCombobox
              options={defaultOptions}
              value={value}
              onValueChange={setValue}
              placeholder="Select"
            />
          </>
        );
      };

      render(<ControlledCombobox />);
      expect(screen.getByTestId("value")).toHaveTextContent("none");

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByText("Svelte"));

      expect(screen.getByTestId("value")).toHaveTextContent("svelte");
    });

    it("external value change updates display", () => {
      const { rerender } = render(
        <WexCombobox options={defaultOptions} value="" placeholder="Select" />
      );

      expect(screen.getByText("Select")).toBeInTheDocument();

      rerender(
        <WexCombobox options={defaultOptions} value="vue" placeholder="Select" />
      );

      expect(screen.getByText("Vue")).toBeInTheDocument();
    });
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================
  describe("Accessibility", () => {
    it("has combobox role on trigger", () => {
      render(<WexCombobox options={defaultOptions} placeholder="Select" />);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("has listbox role on dropdown", async () => {
      const user = userEvent.setup();
      render(<WexCombobox options={defaultOptions} placeholder="Select" />);

      await user.click(screen.getByRole("combobox"));
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("has option role on items", async () => {
      const user = userEvent.setup();
      render(<WexCombobox options={defaultOptions} placeholder="Select" />);

      await user.click(screen.getByRole("combobox"));
      expect(screen.getAllByRole("option").length).toBeGreaterThan(0);
    });

    it("has aria-expanded attribute", async () => {
      const user = userEvent.setup();
      render(<WexCombobox options={defaultOptions} placeholder="Select" />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("selected option has aria-selected", async () => {
      const user = userEvent.setup();
      render(
        <WexCombobox
          options={defaultOptions}
          value="react"
          placeholder="Select"
        />
      );

      await user.click(screen.getByRole("combobox"));
      expect(screen.getByRole("option", { name: "React" })).toHaveAttribute(
        "aria-selected",
        "true"
      );
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("handles empty options array", async () => {
      const user = userEvent.setup();
      render(<WexCombobox options={[]} placeholder="Select" />);

      await user.click(screen.getByRole("combobox"));
      expect(screen.getByText(/no.*found/i)).toBeInTheDocument();
    });

    it("handles single option", async () => {
      const user = userEvent.setup();
      const singleOption = [{ value: "only", label: "Only Option" }];

      render(<WexCombobox options={singleOption} placeholder="Select" />);

      await user.click(screen.getByRole("combobox"));
      expect(screen.getByText("Only Option")).toBeInTheDocument();
    });

    it("handles many options", async () => {
      const user = userEvent.setup();
      const manyOptions = Array.from({ length: 50 }, (_, i) => ({
        value: `option-${i}`,
        label: `Option ${i + 1}`,
      }));

      render(<WexCombobox options={manyOptions} placeholder="Select" />);

      await user.click(screen.getByRole("combobox"));
      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });

    it("handles options with special characters", async () => {
      const user = userEvent.setup();
      const specialOptions = [
        { value: "c++", label: "C++" },
        { value: "c#", label: "C#" },
        { value: "f#", label: "F#" },
      ];

      render(<WexCombobox options={specialOptions} placeholder="Select" />);

      await user.click(screen.getByRole("combobox"));
      expect(screen.getByText("C++")).toBeInTheDocument();
      expect(screen.getByText("C#")).toBeInTheDocument();
    });

    it("handles rapid selection changes", async () => {
      const user = userEvent.setup({ delay: null });
      const handleValueChange = vi.fn();

      render(
        <WexCombobox
          options={defaultOptions}
          onValueChange={handleValueChange}
          placeholder="Select"
        />
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByText("React"));

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByText("Vue"));

      expect(handleValueChange).toHaveBeenLastCalledWith("vue");
    });

    it("works with long option labels", async () => {
      const user = userEvent.setup();
      const longOptions = [
        { value: "long", label: "This is a very long option label that might overflow" },
      ];

      render(<WexCombobox options={longOptions} placeholder="Select" />);

      await user.click(screen.getByRole("combobox"));
      expect(screen.getByText(/This is a very long/)).toBeInTheDocument();
    });
  });
});
