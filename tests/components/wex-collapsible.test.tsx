/**
 * WexCollapsible Component Tests
 *
 * Comprehensive tests covering:
 * - Rendering and composition
 * - Expand/collapse behavior
 * - Keyboard interactions
 * - Controlled and uncontrolled modes
 * - Accessibility
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { WexCollapsible, WexButton } from "@/components/wex";

describe("WexCollapsible", () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("renders trigger without crashing", () => {
      render(
        <WexCollapsible>
          <WexCollapsible.Trigger asChild>
            <WexButton>Toggle</WexButton>
          </WexCollapsible.Trigger>
          <WexCollapsible.Content>Hidden content</WexCollapsible.Content>
        </WexCollapsible>
      );
      expect(screen.getByRole("button", { name: "Toggle" })).toBeInTheDocument();
    });

    it("hides content by default", () => {
      render(
        <WexCollapsible>
          <WexCollapsible.Trigger asChild>
            <WexButton>Toggle</WexButton>
          </WexCollapsible.Trigger>
          <WexCollapsible.Content>Hidden content</WexCollapsible.Content>
        </WexCollapsible>
      );
      expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
    });

    it("shows content when open prop is true", () => {
      render(
        <WexCollapsible open>
          <WexCollapsible.Trigger asChild>
            <WexButton>Toggle</WexButton>
          </WexCollapsible.Trigger>
          <WexCollapsible.Content>Visible content</WexCollapsible.Content>
        </WexCollapsible>
      );
      expect(screen.getByText("Visible content")).toBeInTheDocument();
    });

    it("shows content when defaultOpen is true", () => {
      render(
        <WexCollapsible defaultOpen>
          <WexCollapsible.Trigger asChild>
            <WexButton>Toggle</WexButton>
          </WexCollapsible.Trigger>
          <WexCollapsible.Content>Default open content</WexCollapsible.Content>
        </WexCollapsible>
      );
      expect(screen.getByText("Default open content")).toBeInTheDocument();
    });

    it("accepts className prop", () => {
      render(
        <WexCollapsible className="custom-class">
          <WexCollapsible.Trigger asChild>
            <WexButton>Toggle</WexButton>
          </WexCollapsible.Trigger>
          <WexCollapsible.Content>Content</WexCollapsible.Content>
        </WexCollapsible>
      );
      // Find the collapsible root by its custom class
      const collapsible = document.querySelector(".custom-class");
      expect(collapsible).toBeInTheDocument();
    });
  });

  // ============================================
  // EXPAND/COLLAPSE BEHAVIOR
  // ============================================
  describe("Expand/Collapse Behavior", () => {
    it("toggles content when trigger is clicked", async () => {
      const user = userEvent.setup();
      render(
        <WexCollapsible>
          <WexCollapsible.Trigger asChild>
            <WexButton>Toggle</WexButton>
          </WexCollapsible.Trigger>
          <WexCollapsible.Content>Toggleable content</WexCollapsible.Content>
        </WexCollapsible>
      );

      expect(screen.queryByText("Toggleable content")).not.toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Toggle" }));
      expect(screen.getByText("Toggleable content")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Toggle" }));
      expect(screen.queryByText("Toggleable content")).not.toBeInTheDocument();
    });

    it("calls onOpenChange when toggled", async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();

      render(
        <WexCollapsible onOpenChange={handleOpenChange}>
          <WexCollapsible.Trigger asChild>
            <WexButton>Toggle</WexButton>
          </WexCollapsible.Trigger>
          <WexCollapsible.Content>Content</WexCollapsible.Content>
        </WexCollapsible>
      );

      await user.click(screen.getByRole("button", { name: "Toggle" }));
      expect(handleOpenChange).toHaveBeenCalledWith(true);

      await user.click(screen.getByRole("button", { name: "Toggle" }));
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });

    it("updates data-state attribute on toggle", async () => {
      const user = userEvent.setup();
      render(
        <WexCollapsible>
          <WexCollapsible.Trigger asChild>
            <WexButton>Toggle</WexButton>
          </WexCollapsible.Trigger>
          <WexCollapsible.Content>Content</WexCollapsible.Content>
        </WexCollapsible>
      );

      const trigger = screen.getByRole("button", { name: "Toggle" });
      expect(trigger).toHaveAttribute("data-state", "closed");

      await user.click(trigger);
      expect(trigger).toHaveAttribute("data-state", "open");
    });
  });

  // ============================================
  // CONTROLLED MODE TESTS
  // ============================================
  describe("Controlled Mode", () => {
    it("supports controlled open state", async () => {
      const user = userEvent.setup();
      const ControlledCollapsible = () => {
        const [open, setOpen] = useState(false);
        return (
          <>
            <span data-testid="state">{open ? "open" : "closed"}</span>
            <WexCollapsible open={open} onOpenChange={setOpen}>
              <WexCollapsible.Trigger asChild>
                <WexButton>Toggle</WexButton>
              </WexCollapsible.Trigger>
              <WexCollapsible.Content>Content</WexCollapsible.Content>
            </WexCollapsible>
          </>
        );
      };

      render(<ControlledCollapsible />);
      expect(screen.getByTestId("state")).toHaveTextContent("closed");

      await user.click(screen.getByRole("button", { name: "Toggle" }));
      expect(screen.getByTestId("state")).toHaveTextContent("open");
    });

    it("external control works", async () => {
      const user = userEvent.setup();
      const ControlledCollapsible = () => {
        const [open, setOpen] = useState(false);
        return (
          <>
            <WexButton onClick={() => setOpen(!open)}>External Toggle</WexButton>
            <WexCollapsible open={open} onOpenChange={setOpen}>
              <WexCollapsible.Trigger asChild>
                <WexButton>Internal Toggle</WexButton>
              </WexCollapsible.Trigger>
              <WexCollapsible.Content>Content</WexCollapsible.Content>
            </WexCollapsible>
          </>
        );
      };

      render(<ControlledCollapsible />);
      expect(screen.queryByText("Content")).not.toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "External Toggle" }));
      expect(screen.getByText("Content")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Internal Toggle" }));
      expect(screen.queryByText("Content")).not.toBeInTheDocument();
    });
  });

  // ============================================
  // KEYBOARD INTERACTIONS
  // ============================================
  describe("Keyboard Interactions", () => {
    it("toggles with Enter key", async () => {
      const user = userEvent.setup();
      render(
        <WexCollapsible>
          <WexCollapsible.Trigger asChild>
            <WexButton>Toggle</WexButton>
          </WexCollapsible.Trigger>
          <WexCollapsible.Content>Content</WexCollapsible.Content>
        </WexCollapsible>
      );

      const trigger = screen.getByRole("button", { name: "Toggle" });
      trigger.focus();

      await user.keyboard("{Enter}");
      expect(screen.getByText("Content")).toBeInTheDocument();

      await user.keyboard("{Enter}");
      expect(screen.queryByText("Content")).not.toBeInTheDocument();
    });

    it("toggles with Space key", async () => {
      const user = userEvent.setup();
      render(
        <WexCollapsible>
          <WexCollapsible.Trigger asChild>
            <WexButton>Toggle</WexButton>
          </WexCollapsible.Trigger>
          <WexCollapsible.Content>Content</WexCollapsible.Content>
        </WexCollapsible>
      );

      const trigger = screen.getByRole("button", { name: "Toggle" });
      trigger.focus();

      await user.keyboard(" ");
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("can be focused with Tab", async () => {
      const user = userEvent.setup();
      render(
        <WexCollapsible>
          <WexCollapsible.Trigger asChild>
            <WexButton>Toggle</WexButton>
          </WexCollapsible.Trigger>
          <WexCollapsible.Content>Content</WexCollapsible.Content>
        </WexCollapsible>
      );

      await user.tab();
      expect(screen.getByRole("button", { name: "Toggle" })).toHaveFocus();
    });
  });

  // ============================================
  // DISABLED STATE TESTS
  // ============================================
  describe("Disabled State", () => {
    it("cannot toggle when disabled", async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();

      render(
        <WexCollapsible disabled onOpenChange={handleOpenChange}>
          <WexCollapsible.Trigger asChild>
            <WexButton>Toggle</WexButton>
          </WexCollapsible.Trigger>
          <WexCollapsible.Content>Content</WexCollapsible.Content>
        </WexCollapsible>
      );

      await user.click(screen.getByRole("button", { name: "Toggle" }));
      expect(handleOpenChange).not.toHaveBeenCalled();
      expect(screen.queryByText("Content")).not.toBeInTheDocument();
    });

    it("has data-disabled attribute when disabled", () => {
      render(
        <WexCollapsible disabled>
          <WexCollapsible.Trigger asChild>
            <WexButton>Toggle</WexButton>
          </WexCollapsible.Trigger>
          <WexCollapsible.Content>Content</WexCollapsible.Content>
        </WexCollapsible>
      );

      expect(screen.getByRole("button", { name: "Toggle" })).toHaveAttribute(
        "data-disabled"
      );
    });

    it("cannot be focused when trigger button is disabled", async () => {
      const user = userEvent.setup();
      render(
        <>
          <WexCollapsible>
            <WexCollapsible.Trigger asChild>
              <WexButton disabled>Disabled Trigger</WexButton>
            </WexCollapsible.Trigger>
            <WexCollapsible.Content>Content</WexCollapsible.Content>
          </WexCollapsible>
          <WexButton>Focusable</WexButton>
        </>
      );

      await user.tab();
      expect(screen.getByRole("button", { name: "Focusable" })).toHaveFocus();
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe("Accessibility", () => {
    it("trigger has aria-expanded attribute", async () => {
      const user = userEvent.setup();
      render(
        <WexCollapsible>
          <WexCollapsible.Trigger asChild>
            <WexButton>Toggle</WexButton>
          </WexCollapsible.Trigger>
          <WexCollapsible.Content>Content</WexCollapsible.Content>
        </WexCollapsible>
      );

      const trigger = screen.getByRole("button", { name: "Toggle" });
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("trigger has aria-controls pointing to content", async () => {
      const user = userEvent.setup();
      render(
        <WexCollapsible>
          <WexCollapsible.Trigger asChild>
            <WexButton>Toggle</WexButton>
          </WexCollapsible.Trigger>
          <WexCollapsible.Content>Content</WexCollapsible.Content>
        </WexCollapsible>
      );

      const trigger = screen.getByRole("button", { name: "Toggle" });
      expect(trigger).toHaveAttribute("aria-controls");

      await user.click(trigger);
      const contentId = trigger.getAttribute("aria-controls");
      expect(document.getElementById(contentId!)).toHaveTextContent("Content");
    });

    it("supports aria-label on trigger", () => {
      render(
        <WexCollapsible>
          <WexCollapsible.Trigger aria-label="Toggle section">
            ▼
          </WexCollapsible.Trigger>
          <WexCollapsible.Content>Content</WexCollapsible.Content>
        </WexCollapsible>
      );

      expect(
        screen.getByRole("button", { name: "Toggle section" })
      ).toBeInTheDocument();
    });
  });

  // ============================================
  // COMPOSITION TESTS
  // ============================================
  describe("Composition", () => {
    it("works with custom trigger", async () => {
      const user = userEvent.setup();
      render(
        <WexCollapsible>
          <WexCollapsible.Trigger asChild>
            <button className="custom-trigger">Custom Toggle</button>
          </WexCollapsible.Trigger>
          <WexCollapsible.Content>Content</WexCollapsible.Content>
        </WexCollapsible>
      );

      await user.click(screen.getByRole("button", { name: "Custom Toggle" }));
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("works without asChild on trigger", async () => {
      const user = userEvent.setup();
      render(
        <WexCollapsible>
          <WexCollapsible.Trigger>Simple Toggle</WexCollapsible.Trigger>
          <WexCollapsible.Content>Content</WexCollapsible.Content>
        </WexCollapsible>
      );

      await user.click(screen.getByRole("button", { name: "Simple Toggle" }));
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("supports complex content", async () => {
      const user = userEvent.setup();
      render(
        <WexCollapsible>
          <WexCollapsible.Trigger asChild>
            <WexButton>Show Details</WexButton>
          </WexCollapsible.Trigger>
          <WexCollapsible.Content>
            <div>
              <h3>Details Section</h3>
              <p>Paragraph content</p>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
              <WexButton>Action</WexButton>
            </div>
          </WexCollapsible.Content>
        </WexCollapsible>
      );

      await user.click(screen.getByRole("button", { name: "Show Details" }));

      expect(
        screen.getByRole("heading", { name: "Details Section" })
      ).toBeInTheDocument();
      expect(screen.getByText("Paragraph content")).toBeInTheDocument();
      expect(screen.getAllByRole("listitem")).toHaveLength(2);
      expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
    });

    it("supports icon toggle button", async () => {
      const user = userEvent.setup();
      render(
        <WexCollapsible>
          <div className="flex items-center justify-between">
            <span>Title</span>
            <WexCollapsible.Trigger asChild>
              <WexButton size="icon" intent="ghost" aria-label="Toggle content">
                ▼
              </WexButton>
            </WexCollapsible.Trigger>
          </div>
          <WexCollapsible.Content>Expanded content</WexCollapsible.Content>
        </WexCollapsible>
      );

      await user.click(
        screen.getByRole("button", { name: "Toggle content" })
      );
      expect(screen.getByText("Expanded content")).toBeInTheDocument();
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("handles rapid toggling", async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <WexCollapsible>
          <WexCollapsible.Trigger asChild>
            <WexButton>Toggle</WexButton>
          </WexCollapsible.Trigger>
          <WexCollapsible.Content>Content</WexCollapsible.Content>
        </WexCollapsible>
      );

      const trigger = screen.getByRole("button", { name: "Toggle" });

      await user.click(trigger);
      await user.click(trigger);
      await user.click(trigger);

      // Odd number of clicks = open
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("handles empty content", async () => {
      const user = userEvent.setup();
      render(
        <WexCollapsible>
          <WexCollapsible.Trigger asChild>
            <WexButton>Toggle</WexButton>
          </WexCollapsible.Trigger>
          <WexCollapsible.Content>{""}</WexCollapsible.Content>
        </WexCollapsible>
      );

      // Should still toggle without error
      await user.click(screen.getByRole("button", { name: "Toggle" }));
      expect(screen.getByRole("button")).toHaveAttribute("data-state", "open");
    });

    it("works with multiple collapsibles", async () => {
      const user = userEvent.setup();
      render(
        <div>
          <WexCollapsible>
            <WexCollapsible.Trigger asChild>
              <WexButton>First</WexButton>
            </WexCollapsible.Trigger>
            <WexCollapsible.Content>First content</WexCollapsible.Content>
          </WexCollapsible>
          <WexCollapsible>
            <WexCollapsible.Trigger asChild>
              <WexButton>Second</WexButton>
            </WexCollapsible.Trigger>
            <WexCollapsible.Content>Second content</WexCollapsible.Content>
          </WexCollapsible>
        </div>
      );

      await user.click(screen.getByRole("button", { name: "First" }));
      expect(screen.getByText("First content")).toBeInTheDocument();
      expect(screen.queryByText("Second content")).not.toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Second" }));
      expect(screen.getByText("First content")).toBeInTheDocument();
      expect(screen.getByText("Second content")).toBeInTheDocument();
    });

    it("handles nested collapsibles", async () => {
      const user = userEvent.setup();
      render(
        <WexCollapsible>
          <WexCollapsible.Trigger asChild>
            <WexButton>Outer</WexButton>
          </WexCollapsible.Trigger>
          <WexCollapsible.Content>
            <WexCollapsible>
              <WexCollapsible.Trigger asChild>
                <WexButton>Inner</WexButton>
              </WexCollapsible.Trigger>
              <WexCollapsible.Content>Nested content</WexCollapsible.Content>
            </WexCollapsible>
          </WexCollapsible.Content>
        </WexCollapsible>
      );

      await user.click(screen.getByRole("button", { name: "Outer" }));
      expect(screen.getByRole("button", { name: "Inner" })).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Inner" }));
      expect(screen.getByText("Nested content")).toBeInTheDocument();
    });
  });
});
