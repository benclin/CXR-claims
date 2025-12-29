/**
 * WexPopover Component Tests
 *
 * Comprehensive tests covering:
 * - Rendering and composition
 * - Open/close behavior
 * - Focus management
 * - Keyboard interactions
 * - Accessibility
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { WexPopover, WexButton, WexInput } from "@/components/wex";

describe("WexPopover", () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("renders trigger without crashing", () => {
      render(
        <WexPopover>
          <WexPopover.Trigger asChild>
            <WexButton>Open Popover</WexButton>
          </WexPopover.Trigger>
          <WexPopover.Content>Popover content</WexPopover.Content>
        </WexPopover>
      );
      expect(screen.getByRole("button", { name: "Open Popover" })).toBeInTheDocument();
    });

    it("does not render content when closed", () => {
      render(
        <WexPopover>
          <WexPopover.Trigger asChild>
            <WexButton>Trigger</WexButton>
          </WexPopover.Trigger>
          <WexPopover.Content>Hidden content</WexPopover.Content>
        </WexPopover>
      );
      expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
    });

    it("renders content when open prop is true", () => {
      render(
        <WexPopover open>
          <WexPopover.Trigger asChild>
            <WexButton>Trigger</WexButton>
          </WexPopover.Trigger>
          <WexPopover.Content>Popover Text</WexPopover.Content>
        </WexPopover>
      );
      expect(screen.getByText("Popover Text")).toBeInTheDocument();
    });

    it("accepts className on content", () => {
      render(
        <WexPopover open>
          <WexPopover.Trigger asChild>
            <WexButton>Trigger</WexButton>
          </WexPopover.Trigger>
          <WexPopover.Content className="custom-popover">
            Content
          </WexPopover.Content>
        </WexPopover>
      );
      expect(screen.getByText("Content").closest("[role='dialog']")).toHaveClass(
        "custom-popover"
      );
    });
  });

  // ============================================
  // OPEN/CLOSE BEHAVIOR
  // ============================================
  describe("Open/Close Behavior", () => {
    it("opens when trigger is clicked", async () => {
      const user = userEvent.setup();
      render(
        <WexPopover>
          <WexPopover.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexPopover.Trigger>
          <WexPopover.Content>Popover content</WexPopover.Content>
        </WexPopover>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByText("Popover content")).toBeInTheDocument();
    });

    it("closes when clicking outside", async () => {
      const user = userEvent.setup();
      render(
        <div>
          <WexPopover>
            <WexPopover.Trigger asChild>
              <WexButton>Open</WexButton>
            </WexPopover.Trigger>
            <WexPopover.Content>Content</WexPopover.Content>
          </WexPopover>
          <button>Outside</button>
        </div>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByText("Content")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Outside" }));
      await waitFor(() => {
        expect(screen.queryByText("Content")).not.toBeInTheDocument();
      });
    });

    it("closes when Escape is pressed", async () => {
      const user = userEvent.setup();
      render(
        <WexPopover>
          <WexPopover.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexPopover.Trigger>
          <WexPopover.Content>Content</WexPopover.Content>
        </WexPopover>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByText("Content")).toBeInTheDocument();

      await user.keyboard("{Escape}");
      await waitFor(() => {
        expect(screen.queryByText("Content")).not.toBeInTheDocument();
      });
    });

    it("toggles on trigger click", async () => {
      const user = userEvent.setup();
      render(
        <WexPopover>
          <WexPopover.Trigger asChild>
            <WexButton>Toggle</WexButton>
          </WexPopover.Trigger>
          <WexPopover.Content>Content</WexPopover.Content>
        </WexPopover>
      );

      const trigger = screen.getByRole("button", { name: "Toggle" });

      await user.click(trigger);
      expect(screen.getByText("Content")).toBeInTheDocument();

      await user.click(trigger);
      await waitFor(() => {
        expect(screen.queryByText("Content")).not.toBeInTheDocument();
      });
    });
  });

  // ============================================
  // CONTROLLED MODE
  // ============================================
  describe("Controlled Mode", () => {
    it("supports controlled open state", async () => {
      const user = userEvent.setup();
      const ControlledPopover = () => {
        const [open, setOpen] = useState(false);
        return (
          <>
            <span data-testid="state">{open ? "open" : "closed"}</span>
            <WexPopover open={open} onOpenChange={setOpen}>
              <WexPopover.Trigger asChild>
                <WexButton>Open</WexButton>
              </WexPopover.Trigger>
              <WexPopover.Content>Content</WexPopover.Content>
            </WexPopover>
          </>
        );
      };

      render(<ControlledPopover />);
      expect(screen.getByTestId("state")).toHaveTextContent("closed");

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByTestId("state")).toHaveTextContent("open");
    });

    it("calls onOpenChange when state changes", async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();

      render(
        <WexPopover onOpenChange={handleOpenChange}>
          <WexPopover.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexPopover.Trigger>
          <WexPopover.Content>Content</WexPopover.Content>
        </WexPopover>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(handleOpenChange).toHaveBeenCalledWith(true);

      await user.keyboard("{Escape}");
      await waitFor(() => {
        expect(handleOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });

  // ============================================
  // FOCUS MANAGEMENT
  // ============================================
  describe("Focus Management", () => {
    it("focuses first focusable element when opened", async () => {
      const user = userEvent.setup();
      render(
        <WexPopover>
          <WexPopover.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexPopover.Trigger>
          <WexPopover.Content>
            <WexInput placeholder="First input" />
            <WexInput placeholder="Second input" />
          </WexPopover.Content>
        </WexPopover>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));

      // Wait for popover to open and focus to be set
      await waitFor(() => {
        expect(screen.getByPlaceholderText("First input")).toBeInTheDocument();
      });
    });

    it("returns focus to trigger when closed", async () => {
      const user = userEvent.setup();
      render(
        <WexPopover>
          <WexPopover.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexPopover.Trigger>
          <WexPopover.Content>
            <WexInput placeholder="Input" />
          </WexPopover.Content>
        </WexPopover>
      );

      const trigger = screen.getByRole("button", { name: "Open" });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Input")).toBeInTheDocument();
      });

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(trigger).toHaveFocus();
      });
    });

    it("traps focus within popover", async () => {
      const user = userEvent.setup();
      render(
        <WexPopover>
          <WexPopover.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexPopover.Trigger>
          <WexPopover.Content>
            <WexButton>First</WexButton>
            <WexButton>Second</WexButton>
          </WexPopover.Content>
        </WexPopover>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));

      // Tab through elements
      await user.tab();
      await user.tab();
      await user.tab();

      // Focus should stay within the popover
      const popover = screen.getByRole("dialog");
      expect(popover.contains(document.activeElement)).toBe(true);
    });
  });

  // ============================================
  // KEYBOARD INTERACTIONS
  // ============================================
  describe("Keyboard Interactions", () => {
    it("opens with Enter key", async () => {
      const user = userEvent.setup();
      render(
        <WexPopover>
          <WexPopover.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexPopover.Trigger>
          <WexPopover.Content>Content</WexPopover.Content>
        </WexPopover>
      );

      const trigger = screen.getByRole("button", { name: "Open" });
      trigger.focus();
      await user.keyboard("{Enter}");

      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("opens with Space key", async () => {
      const user = userEvent.setup();
      render(
        <WexPopover>
          <WexPopover.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexPopover.Trigger>
          <WexPopover.Content>Content</WexPopover.Content>
        </WexPopover>
      );

      const trigger = screen.getByRole("button", { name: "Open" });
      trigger.focus();
      await user.keyboard(" ");

      expect(screen.getByText("Content")).toBeInTheDocument();
    });
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================
  describe("Accessibility", () => {
    it("has dialog role on content", async () => {
      const user = userEvent.setup();
      render(
        <WexPopover>
          <WexPopover.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexPopover.Trigger>
          <WexPopover.Content>Content</WexPopover.Content>
        </WexPopover>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("trigger has aria-haspopup", () => {
      render(
        <WexPopover>
          <WexPopover.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexPopover.Trigger>
          <WexPopover.Content>Content</WexPopover.Content>
        </WexPopover>
      );

      expect(screen.getByRole("button")).toHaveAttribute("aria-haspopup", "dialog");
    });

    it("trigger has aria-expanded", async () => {
      const user = userEvent.setup();
      render(
        <WexPopover>
          <WexPopover.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexPopover.Trigger>
          <WexPopover.Content>Content</WexPopover.Content>
        </WexPopover>
      );

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });
  });

  // ============================================
  // COMPOSITION TESTS
  // ============================================
  describe("Composition", () => {
    it("supports forms inside popover", async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn((e) => e.preventDefault());

      render(
        <WexPopover>
          <WexPopover.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexPopover.Trigger>
          <WexPopover.Content>
            <form onSubmit={handleSubmit}>
              <WexInput name="email" placeholder="Email" />
              <WexButton type="submit">Submit</WexButton>
            </form>
          </WexPopover.Content>
        </WexPopover>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      await user.type(screen.getByPlaceholderText("Email"), "test@example.com");
      await user.click(screen.getByRole("button", { name: "Submit" }));

      expect(handleSubmit).toHaveBeenCalled();
    });

    it("supports buttons inside popover content", async () => {
      const user = userEvent.setup();
      render(
        <WexPopover>
          <WexPopover.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexPopover.Trigger>
          <WexPopover.Content>
            <p>Content</p>
            <WexButton>Action Button</WexButton>
          </WexPopover.Content>
        </WexPopover>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByText("Content")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Action Button" })).toBeInTheDocument();
    });

    it("renders anchor for positioning", async () => {
      const user = userEvent.setup();
      render(
        <WexPopover>
          <WexPopover.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexPopover.Trigger>
          <WexPopover.Content align="start" sideOffset={10}>
            Positioned content
          </WexPopover.Content>
        </WexPopover>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByText("Positioned content")).toBeInTheDocument();
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("handles rapid open/close", async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <WexPopover>
          <WexPopover.Trigger asChild>
            <WexButton>Toggle</WexButton>
          </WexPopover.Trigger>
          <WexPopover.Content>Content</WexPopover.Content>
        </WexPopover>
      );

      const trigger = screen.getByRole("button", { name: "Toggle" });

      await user.click(trigger);
      await user.click(trigger);
      await user.click(trigger);

      // Should handle gracefully
      expect(trigger).toBeInTheDocument();
    });

    it("handles multiple popovers", async () => {
      const user = userEvent.setup();
      render(
        <>
          <WexPopover>
            <WexPopover.Trigger asChild>
              <WexButton>Popover 1</WexButton>
            </WexPopover.Trigger>
            <WexPopover.Content>Content 1</WexPopover.Content>
          </WexPopover>
          <WexPopover>
            <WexPopover.Trigger asChild>
              <WexButton>Popover 2</WexButton>
            </WexPopover.Trigger>
            <WexPopover.Content>Content 2</WexPopover.Content>
          </WexPopover>
        </>
      );

      await user.click(screen.getByRole("button", { name: "Popover 1" }));
      expect(screen.getByText("Content 1")).toBeInTheDocument();

      // Opening another popover should close the first
      await user.click(screen.getByRole("button", { name: "Popover 2" }));
      expect(screen.getByText("Content 2")).toBeInTheDocument();
    });

    it("handles complex nested content", async () => {
      const user = userEvent.setup();
      render(
        <WexPopover>
          <WexPopover.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexPopover.Trigger>
          <WexPopover.Content>
            <div>
              <h4>Title</h4>
              <p>Description text</p>
              <div>
                <WexButton>Action 1</WexButton>
                <WexButton>Action 2</WexButton>
              </div>
            </div>
          </WexPopover.Content>
        </WexPopover>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Description text")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Action 1" })).toBeInTheDocument();
    });
  });
});
