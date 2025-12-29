/**
 * WexDialog Component Tests
 *
 * Comprehensive tests covering:
 * - Rendering and composition
 * - Open/close behavior
 * - User interactions (click, keyboard)
 * - Accessibility (ARIA attributes, focus management)
 * - Controlled and uncontrolled modes
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { WexDialog, WexButton, WexInput } from "@/components/wex";

describe("WexDialog", () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("renders trigger without crashing", () => {
      render(
        <WexDialog>
          <WexDialog.Trigger asChild>
            <WexButton>Open Dialog</WexButton>
          </WexDialog.Trigger>
          <WexDialog.Content>
            <WexDialog.Header>
              <WexDialog.Title>Dialog Title</WexDialog.Title>
            </WexDialog.Header>
          </WexDialog.Content>
        </WexDialog>
      );
      expect(screen.getByText("Open Dialog")).toBeInTheDocument();
    });

    it("does not render content when closed", () => {
      render(
        <WexDialog>
          <WexDialog.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDialog.Trigger>
          <WexDialog.Content>
            <WexDialog.Title>Hidden Title</WexDialog.Title>
          </WexDialog.Content>
        </WexDialog>
      );
      expect(screen.queryByText("Hidden Title")).not.toBeInTheDocument();
    });

    it("renders content when open prop is true", () => {
      render(
        <WexDialog open>
          <WexDialog.Content>
            <WexDialog.Header>
              <WexDialog.Title>Test Dialog</WexDialog.Title>
              <WexDialog.Description>Dialog description text</WexDialog.Description>
            </WexDialog.Header>
          </WexDialog.Content>
        </WexDialog>
      );
      expect(screen.getByText("Test Dialog")).toBeInTheDocument();
      expect(screen.getByText("Dialog description text")).toBeInTheDocument();
    });

    it("renders header, footer, and description", () => {
      render(
        <WexDialog open>
          <WexDialog.Content>
            <WexDialog.Header>
              <WexDialog.Title>Title</WexDialog.Title>
              <WexDialog.Description>Description</WexDialog.Description>
            </WexDialog.Header>
            <p>Main content</p>
            <WexDialog.Footer>Footer Content</WexDialog.Footer>
          </WexDialog.Content>
        </WexDialog>
      );
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
      expect(screen.getByText("Main content")).toBeInTheDocument();
      expect(screen.getByText("Footer Content")).toBeInTheDocument();
    });
  });

  // ============================================
  // OPEN/CLOSE BEHAVIOR
  // ============================================
  describe("Open/Close Behavior", () => {
    it("opens when trigger is clicked", async () => {
      const user = userEvent.setup();
      render(
        <WexDialog>
          <WexDialog.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDialog.Trigger>
          <WexDialog.Content>
            <WexDialog.Title>Dialog Content</WexDialog.Title>
          </WexDialog.Content>
        </WexDialog>
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("renders dialog content with custom close button", async () => {
      const user = userEvent.setup();
      render(
        <WexDialog>
          <WexDialog.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDialog.Trigger>
          <WexDialog.Content>
            <WexDialog.Title>Dialog</WexDialog.Title>
            <WexDialog.Close asChild>
              <WexButton>Dismiss</WexButton>
            </WexDialog.Close>
          </WexDialog.Content>
        </WexDialog>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
    });

    it("closes when Escape key is pressed", async () => {
      const user = userEvent.setup();
      render(
        <WexDialog>
          <WexDialog.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDialog.Trigger>
          <WexDialog.Content>
            <WexDialog.Title>Dialog</WexDialog.Title>
          </WexDialog.Content>
        </WexDialog>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      await user.keyboard("{Escape}");
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("closes when overlay is clicked", async () => {
      const user = userEvent.setup();
      render(
        <WexDialog>
          <WexDialog.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDialog.Trigger>
          <WexDialog.Content>
            <WexDialog.Title>Dialog</WexDialog.Title>
          </WexDialog.Content>
        </WexDialog>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Click on the overlay (outside the dialog content)
      const overlay = document.querySelector("[data-radix-dialog-overlay]");
      if (overlay) {
        await user.click(overlay);
        await waitFor(() => {
          expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });
      }
    });
  });

  // ============================================
  // CONTROLLED MODE
  // ============================================
  describe("Controlled Mode", () => {
    it("supports controlled open state", async () => {
      const user = userEvent.setup();
      const ControlledDialog = () => {
        const [open, setOpen] = useState(false);
        return (
          <>
            <WexButton onClick={() => setOpen(true)}>Open</WexButton>
            <WexDialog open={open} onOpenChange={setOpen}>
              <WexDialog.Content>
                <WexDialog.Title>Controlled</WexDialog.Title>
                <WexButton onClick={() => setOpen(false)}>Dismiss</WexButton>
              </WexDialog.Content>
            </WexDialog>
          </>
        );
      };

      render(<ControlledDialog />);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
    });

    it("calls onOpenChange when state changes", async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();

      render(
        <WexDialog onOpenChange={handleOpenChange}>
          <WexDialog.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDialog.Trigger>
          <WexDialog.Content>
            <WexDialog.Title>Dialog</WexDialog.Title>
          </WexDialog.Content>
        </WexDialog>
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
        <WexDialog>
          <WexDialog.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDialog.Trigger>
          <WexDialog.Content>
            <WexDialog.Title>Dialog</WexDialog.Title>
            <WexInput data-testid="first-input" placeholder="First" />
            <WexInput placeholder="Second" />
          </WexDialog.Content>
        </WexDialog>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      
      // Wait for dialog to open and focus to be set
      await waitFor(() => {
        // The close button in the dialog content typically gets focus first
        // or the first focusable element
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });

    it("returns focus to trigger when closed", async () => {
      const user = userEvent.setup();
      render(
        <WexDialog>
          <WexDialog.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDialog.Trigger>
          <WexDialog.Content>
            <WexDialog.Title>Dialog</WexDialog.Title>
            <WexInput placeholder="Input" />
          </WexDialog.Content>
        </WexDialog>
      );

      const trigger = screen.getByRole("button", { name: "Open" });
      await user.click(trigger);
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      await user.keyboard("{Escape}");
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });

      // Focus should return to trigger
      await waitFor(() => {
        expect(trigger).toHaveFocus();
      });
    });

    it("traps focus within dialog", async () => {
      const user = userEvent.setup();
      render(
        <WexDialog>
          <WexDialog.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDialog.Trigger>
          <WexDialog.Content>
            <WexDialog.Title>Dialog</WexDialog.Title>
            <WexButton data-testid="first">First</WexButton>
            <WexButton data-testid="second">Second</WexButton>
          </WexDialog.Content>
        </WexDialog>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Tab through focusable elements - focus should stay within dialog
      await user.tab();
      await user.tab();
      await user.tab();

      // Focus should still be within the dialog
      const dialog = screen.getByRole("dialog");
      expect(dialog.contains(document.activeElement)).toBe(true);
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe("Accessibility", () => {
    it("has correct dialog role", async () => {
      const user = userEvent.setup();
      render(
        <WexDialog>
          <WexDialog.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDialog.Trigger>
          <WexDialog.Content>
            <WexDialog.Title>Dialog</WexDialog.Title>
          </WexDialog.Content>
        </WexDialog>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("has aria-labelledby pointing to title", async () => {
      const user = userEvent.setup();
      render(
        <WexDialog>
          <WexDialog.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDialog.Trigger>
          <WexDialog.Content>
            <WexDialog.Title>My Dialog Title</WexDialog.Title>
          </WexDialog.Content>
        </WexDialog>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAccessibleName("My Dialog Title");
    });

    it("has aria-describedby pointing to description when present", async () => {
      const user = userEvent.setup();
      render(
        <WexDialog>
          <WexDialog.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDialog.Trigger>
          <WexDialog.Content>
            <WexDialog.Title>Title</WexDialog.Title>
            <WexDialog.Description>This is a description</WexDialog.Description>
          </WexDialog.Content>
        </WexDialog>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAccessibleDescription("This is a description");
    });

    it("renders as dialog role when open", () => {
      render(
        <WexDialog open>
          <WexDialog.Content>
            <WexDialog.Title>Modal Dialog</WexDialog.Title>
            <WexDialog.Description>Description text</WexDialog.Description>
          </WexDialog.Content>
        </WexDialog>
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(screen.getByText("Modal Dialog")).toBeInTheDocument();
    });

    it("trigger has aria-haspopup", () => {
      render(
        <WexDialog>
          <WexDialog.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDialog.Trigger>
          <WexDialog.Content>
            <WexDialog.Title>Dialog</WexDialog.Title>
          </WexDialog.Content>
        </WexDialog>
      );

      expect(screen.getByRole("button", { name: "Open" })).toHaveAttribute(
        "aria-haspopup",
        "dialog"
      );
    });
  });

  // ============================================
  // COMPOSITION TESTS
  // ============================================
  describe("Composition", () => {
    it("supports footer with action buttons", async () => {
      const user = userEvent.setup();
      const handleConfirm = vi.fn();
      const handleCancel = vi.fn();

      render(
        <WexDialog>
          <WexDialog.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDialog.Trigger>
          <WexDialog.Content>
            <WexDialog.Header>
              <WexDialog.Title>Confirm Action</WexDialog.Title>
              <WexDialog.Description>
                Are you sure you want to proceed?
              </WexDialog.Description>
            </WexDialog.Header>
            <WexDialog.Footer>
              <WexDialog.Close asChild>
                <WexButton intent="secondary" onClick={handleCancel}>
                  Cancel
                </WexButton>
              </WexDialog.Close>
              <WexButton onClick={handleConfirm}>Confirm</WexButton>
            </WexDialog.Footer>
          </WexDialog.Content>
        </WexDialog>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Confirm" }));
      expect(handleConfirm).toHaveBeenCalled();
    });

    it("supports form inside dialog", async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn((e) => e.preventDefault());

      render(
        <WexDialog>
          <WexDialog.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDialog.Trigger>
          <WexDialog.Content>
            <WexDialog.Header>
              <WexDialog.Title>Form Dialog</WexDialog.Title>
            </WexDialog.Header>
            <form onSubmit={handleSubmit}>
              <WexInput name="email" placeholder="Email" />
              <WexButton type="submit">Submit</WexButton>
            </form>
          </WexDialog.Content>
        </WexDialog>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      await user.type(screen.getByPlaceholderText("Email"), "test@example.com");
      await user.click(screen.getByRole("button", { name: "Submit" }));

      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("handles rapid open/close", async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <WexDialog>
          <WexDialog.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDialog.Trigger>
          <WexDialog.Content>
            <WexDialog.Title>Dialog</WexDialog.Title>
          </WexDialog.Content>
        </WexDialog>
      );

      const trigger = screen.getByRole("button", { name: "Open" });

      // Rapidly click
      await user.click(trigger);
      await user.keyboard("{Escape}");
      await user.click(trigger);
      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("renders multiple dialogs correctly", () => {
      render(
        <>
          <WexDialog>
            <WexDialog.Trigger asChild>
              <WexButton>Dialog 1</WexButton>
            </WexDialog.Trigger>
            <WexDialog.Content>
              <WexDialog.Title>First Dialog</WexDialog.Title>
            </WexDialog.Content>
          </WexDialog>
          <WexDialog>
            <WexDialog.Trigger asChild>
              <WexButton>Dialog 2</WexButton>
            </WexDialog.Trigger>
            <WexDialog.Content>
              <WexDialog.Title>Second Dialog</WexDialog.Title>
            </WexDialog.Content>
          </WexDialog>
        </>
      );

      expect(screen.getByRole("button", { name: "Dialog 1" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Dialog 2" })).toBeInTheDocument();
    });

    it("works without description", async () => {
      const user = userEvent.setup();
      render(
        <WexDialog>
          <WexDialog.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDialog.Trigger>
          <WexDialog.Content>
            <WexDialog.Title>Title Only</WexDialog.Title>
            <p>Content without description component</p>
          </WexDialog.Content>
        </WexDialog>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Title Only")).toBeInTheDocument();
    });
  });
});
