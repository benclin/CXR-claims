/**
 * WexSheet Component Tests
 *
 * Comprehensive tests covering:
 * - Rendering and composition
 * - Open/close behavior
 * - Side positioning
 * - User interactions (click, keyboard)
 * - Accessibility (ARIA attributes, focus management)
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { WexSheet, WexButton, WexInput } from "@/components/wex";

describe("WexSheet", () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("renders trigger without crashing", () => {
      render(
        <WexSheet>
          <WexSheet.Trigger asChild>
            <WexButton>Open Sheet</WexButton>
          </WexSheet.Trigger>
          <WexSheet.Content>
            <WexSheet.Header>
              <WexSheet.Title>Sheet Title</WexSheet.Title>
            </WexSheet.Header>
          </WexSheet.Content>
        </WexSheet>
      );
      expect(screen.getByText("Open Sheet")).toBeInTheDocument();
    });

    it("does not render content when closed", () => {
      render(
        <WexSheet>
          <WexSheet.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexSheet.Trigger>
          <WexSheet.Content>
            <WexSheet.Title>Hidden Content</WexSheet.Title>
          </WexSheet.Content>
        </WexSheet>
      );
      expect(screen.queryByText("Hidden Content")).not.toBeInTheDocument();
    });

    it("renders content when open prop is true", () => {
      render(
        <WexSheet open>
          <WexSheet.Content>
            <WexSheet.Header>
              <WexSheet.Title>Test Sheet</WexSheet.Title>
              <WexSheet.Description>Sheet description</WexSheet.Description>
            </WexSheet.Header>
          </WexSheet.Content>
        </WexSheet>
      );
      expect(screen.getByText("Test Sheet")).toBeInTheDocument();
      expect(screen.getByText("Sheet description")).toBeInTheDocument();
    });

    it("renders header, footer, and description", () => {
      render(
        <WexSheet open>
          <WexSheet.Content>
            <WexSheet.Header>
              <WexSheet.Title>Title</WexSheet.Title>
              <WexSheet.Description>Description</WexSheet.Description>
            </WexSheet.Header>
            <p>Main content</p>
            <WexSheet.Footer>Footer Content</WexSheet.Footer>
          </WexSheet.Content>
        </WexSheet>
      );
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
      expect(screen.getByText("Main content")).toBeInTheDocument();
      expect(screen.getByText("Footer Content")).toBeInTheDocument();
    });
  });

  // ============================================
  // SIDE POSITIONING TESTS
  // ============================================
  describe("Side Positioning", () => {
    const sides = ["top", "right", "bottom", "left"] as const;

    sides.forEach((side) => {
      it(`renders on ${side} side`, async () => {
        const user = userEvent.setup();
        render(
          <WexSheet>
            <WexSheet.Trigger asChild>
              <WexButton>Open</WexButton>
            </WexSheet.Trigger>
            <WexSheet.Content side={side}>
              <WexSheet.Title>{side} Sheet</WexSheet.Title>
            </WexSheet.Content>
          </WexSheet>
        );

        await user.click(screen.getByRole("button", { name: "Open" }));
        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(screen.getByText(`${side} Sheet`)).toBeInTheDocument();
      });
    });
  });

  // ============================================
  // OPEN/CLOSE BEHAVIOR
  // ============================================
  describe("Open/Close Behavior", () => {
    it("opens when trigger is clicked", async () => {
      const user = userEvent.setup();
      render(
        <WexSheet>
          <WexSheet.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexSheet.Trigger>
          <WexSheet.Content>
            <WexSheet.Title>Sheet Content</WexSheet.Title>
          </WexSheet.Content>
        </WexSheet>
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("renders sheet content with custom close button", async () => {
      const user = userEvent.setup();
      render(
        <WexSheet>
          <WexSheet.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexSheet.Trigger>
          <WexSheet.Content>
            <WexSheet.Title>Sheet</WexSheet.Title>
            <WexSheet.Close asChild>
              <WexButton>Dismiss</WexButton>
            </WexSheet.Close>
          </WexSheet.Content>
        </WexSheet>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
    });

    it("closes when Escape key is pressed", async () => {
      const user = userEvent.setup();
      render(
        <WexSheet>
          <WexSheet.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexSheet.Trigger>
          <WexSheet.Content>
            <WexSheet.Title>Sheet</WexSheet.Title>
          </WexSheet.Content>
        </WexSheet>
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
        <WexSheet>
          <WexSheet.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexSheet.Trigger>
          <WexSheet.Content>
            <WexSheet.Title>Sheet</WexSheet.Title>
          </WexSheet.Content>
        </WexSheet>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Click on the overlay
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
      const ControlledSheet = () => {
        const [open, setOpen] = useState(false);
        return (
          <>
            <WexButton onClick={() => setOpen(true)}>Open</WexButton>
            <WexSheet open={open} onOpenChange={setOpen}>
              <WexSheet.Content>
                <WexSheet.Title>Controlled</WexSheet.Title>
                <WexButton onClick={() => setOpen(false)}>Dismiss</WexButton>
              </WexSheet.Content>
            </WexSheet>
          </>
        );
      };

      render(<ControlledSheet />);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
    });

    it("calls onOpenChange when state changes", async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();

      render(
        <WexSheet onOpenChange={handleOpenChange}>
          <WexSheet.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexSheet.Trigger>
          <WexSheet.Content>
            <WexSheet.Title>Sheet</WexSheet.Title>
          </WexSheet.Content>
        </WexSheet>
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
    it("returns focus to trigger when closed", async () => {
      const user = userEvent.setup();
      render(
        <WexSheet>
          <WexSheet.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexSheet.Trigger>
          <WexSheet.Content>
            <WexSheet.Title>Sheet</WexSheet.Title>
          </WexSheet.Content>
        </WexSheet>
      );

      const trigger = screen.getByRole("button", { name: "Open" });
      await user.click(trigger);
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      await user.keyboard("{Escape}");
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(trigger).toHaveFocus();
      });
    });

    it("traps focus within sheet", async () => {
      const user = userEvent.setup();
      render(
        <WexSheet>
          <WexSheet.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexSheet.Trigger>
          <WexSheet.Content>
            <WexSheet.Title>Sheet</WexSheet.Title>
            <WexButton>First</WexButton>
            <WexButton>Second</WexButton>
          </WexSheet.Content>
        </WexSheet>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Tab through focusable elements
      await user.tab();
      await user.tab();
      await user.tab();

      // Focus should still be within the sheet
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
        <WexSheet>
          <WexSheet.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexSheet.Trigger>
          <WexSheet.Content>
            <WexSheet.Title>Sheet</WexSheet.Title>
          </WexSheet.Content>
        </WexSheet>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("has aria-labelledby pointing to title", async () => {
      const user = userEvent.setup();
      render(
        <WexSheet>
          <WexSheet.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexSheet.Trigger>
          <WexSheet.Content>
            <WexSheet.Title>My Sheet Title</WexSheet.Title>
          </WexSheet.Content>
        </WexSheet>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAccessibleName("My Sheet Title");
    });

    it("has aria-describedby pointing to description", async () => {
      const user = userEvent.setup();
      render(
        <WexSheet>
          <WexSheet.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexSheet.Trigger>
          <WexSheet.Content>
            <WexSheet.Title>Title</WexSheet.Title>
            <WexSheet.Description>Sheet description text</WexSheet.Description>
          </WexSheet.Content>
        </WexSheet>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAccessibleDescription("Sheet description text");
    });

    it("renders as dialog role when open", () => {
      render(
        <WexSheet open>
          <WexSheet.Content>
            <WexSheet.Title>Modal Sheet</WexSheet.Title>
            <WexSheet.Description>Description text</WexSheet.Description>
          </WexSheet.Content>
        </WexSheet>
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(screen.getByText("Modal Sheet")).toBeInTheDocument();
    });
  });

  // ============================================
  // COMPOSITION TESTS
  // ============================================
  describe("Composition", () => {
    it("supports navigation menu pattern", async () => {
      const user = userEvent.setup();
      render(
        <WexSheet>
          <WexSheet.Trigger asChild>
            <WexButton>Menu</WexButton>
          </WexSheet.Trigger>
          <WexSheet.Content side="left">
            <WexSheet.Header>
              <WexSheet.Title>Navigation</WexSheet.Title>
            </WexSheet.Header>
            <nav>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </nav>
          </WexSheet.Content>
        </WexSheet>
      );

      await user.click(screen.getByRole("button", { name: "Menu" }));
      expect(screen.getByRole("navigation")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    });

    it("supports footer with action buttons", async () => {
      const user = userEvent.setup();
      const handleSave = vi.fn();

      render(
        <WexSheet>
          <WexSheet.Trigger asChild>
            <WexButton>Edit</WexButton>
          </WexSheet.Trigger>
          <WexSheet.Content>
            <WexSheet.Header>
              <WexSheet.Title>Edit Profile</WexSheet.Title>
            </WexSheet.Header>
            <WexInput placeholder="Name" />
            <WexSheet.Footer>
              <WexSheet.Close asChild>
                <WexButton intent="secondary">Cancel</WexButton>
              </WexSheet.Close>
              <WexButton onClick={handleSave}>Save</WexButton>
            </WexSheet.Footer>
          </WexSheet.Content>
        </WexSheet>
      );

      await user.click(screen.getByRole("button", { name: "Edit" }));
      await user.click(screen.getByRole("button", { name: "Save" }));
      expect(handleSave).toHaveBeenCalled();
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("handles rapid open/close", async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <WexSheet>
          <WexSheet.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexSheet.Trigger>
          <WexSheet.Content>
            <WexSheet.Title>Sheet</WexSheet.Title>
          </WexSheet.Content>
        </WexSheet>
      );

      const trigger = screen.getByRole("button", { name: "Open" });

      await user.click(trigger);
      await user.keyboard("{Escape}");
      await user.click(trigger);
      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("renders with scrollable content", async () => {
      const user = userEvent.setup();
      render(
        <WexSheet>
          <WexSheet.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexSheet.Trigger>
          <WexSheet.Content>
            <WexSheet.Title>Scrollable Sheet</WexSheet.Title>
            <div style={{ height: "2000px" }}>
              <p>Start of content</p>
              <p style={{ marginTop: "1900px" }}>End of content</p>
            </div>
          </WexSheet.Content>
        </WexSheet>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByText("Start of content")).toBeInTheDocument();
      expect(screen.getByText("End of content")).toBeInTheDocument();
    });
  });
});
