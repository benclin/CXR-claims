/**
 * WexDrawer Component Tests
 *
 * Note: The Drawer component uses vaul which has limited JSDOM compatibility.
 * Some interaction tests are simplified or skipped due to pointer capture
 * and transform parsing issues in the test environment.
 *
 * Comprehensive tests covering:
 * - Rendering and composition
 * - Open/close behavior (controlled mode)
 * - Accessibility (ARIA attributes)
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { WexDrawer, WexButton, WexInput } from "@/components/wex";

describe("WexDrawer", () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("renders trigger without crashing", () => {
      render(
        <WexDrawer>
          <WexDrawer.Trigger asChild>
            <WexButton>Open Drawer</WexButton>
          </WexDrawer.Trigger>
          <WexDrawer.Content>
            <WexDrawer.Header>
              <WexDrawer.Title>Drawer Title</WexDrawer.Title>
            </WexDrawer.Header>
          </WexDrawer.Content>
        </WexDrawer>
      );
      expect(screen.getByText("Open Drawer")).toBeInTheDocument();
    });

    it("does not render content when closed", () => {
      render(
        <WexDrawer>
          <WexDrawer.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDrawer.Trigger>
          <WexDrawer.Content>
            <WexDrawer.Title>Hidden Content</WexDrawer.Title>
          </WexDrawer.Content>
        </WexDrawer>
      );
      expect(screen.queryByText("Hidden Content")).not.toBeInTheDocument();
    });

    it("renders content when open prop is true", () => {
      render(
        <WexDrawer open>
          <WexDrawer.Content>
            <WexDrawer.Header>
              <WexDrawer.Title>Test Drawer</WexDrawer.Title>
              <WexDrawer.Description>Drawer description</WexDrawer.Description>
            </WexDrawer.Header>
          </WexDrawer.Content>
        </WexDrawer>
      );
      expect(screen.getByText("Test Drawer")).toBeInTheDocument();
      expect(screen.getByText("Drawer description")).toBeInTheDocument();
    });

    it("renders header, footer, and description", () => {
      render(
        <WexDrawer open>
          <WexDrawer.Content>
            <WexDrawer.Header>
              <WexDrawer.Title>Title</WexDrawer.Title>
              <WexDrawer.Description>Description</WexDrawer.Description>
            </WexDrawer.Header>
            <p>Main content</p>
            <WexDrawer.Footer>Footer Content</WexDrawer.Footer>
          </WexDrawer.Content>
        </WexDrawer>
      );
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
      expect(screen.getByText("Main content")).toBeInTheDocument();
      expect(screen.getByText("Footer Content")).toBeInTheDocument();
    });
  });

  // ============================================
  // OPEN/CLOSE BEHAVIOR (Controlled Mode)
  // Note: Vaul has JSDOM compatibility issues with user interactions
  // ============================================
  describe("Open/Close Behavior", () => {
    it("opens when trigger is clicked", async () => {
      const user = userEvent.setup();
      render(
        <WexDrawer>
          <WexDrawer.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDrawer.Trigger>
          <WexDrawer.Content>
            <WexDrawer.Title>Drawer Content</WexDrawer.Title>
          </WexDrawer.Content>
        </WexDrawer>
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("calls onOpenChange when opened", async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();

      render(
        <WexDrawer onOpenChange={handleOpenChange}>
          <WexDrawer.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDrawer.Trigger>
          <WexDrawer.Content>
            <WexDrawer.Title>Drawer</WexDrawer.Title>
          </WexDrawer.Content>
        </WexDrawer>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });

    // Note: Close tests are simplified due to vaul JSDOM issues
    it("shows content when controlled open=true", () => {
      render(
        <WexDrawer open>
          <WexDrawer.Content>
            <WexDrawer.Title>Visible</WexDrawer.Title>
          </WexDrawer.Content>
        </WexDrawer>
      );
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("hides content when controlled open=false", () => {
      render(
        <WexDrawer open={false}>
          <WexDrawer.Content>
            <WexDrawer.Title>Hidden</WexDrawer.Title>
          </WexDrawer.Content>
        </WexDrawer>
      );
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe("Accessibility", () => {
    it("has correct dialog role", () => {
      render(
        <WexDrawer open>
          <WexDrawer.Content>
            <WexDrawer.Title>Drawer</WexDrawer.Title>
          </WexDrawer.Content>
        </WexDrawer>
      );
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("has aria-labelledby pointing to title", () => {
      render(
        <WexDrawer open>
          <WexDrawer.Content>
            <WexDrawer.Title>My Drawer Title</WexDrawer.Title>
          </WexDrawer.Content>
        </WexDrawer>
      );
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAccessibleName("My Drawer Title");
    });

    it("has aria-describedby pointing to description", () => {
      render(
        <WexDrawer open>
          <WexDrawer.Content>
            <WexDrawer.Title>Title</WexDrawer.Title>
            <WexDrawer.Description>Drawer description text</WexDrawer.Description>
          </WexDrawer.Content>
        </WexDrawer>
      );
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAccessibleDescription("Drawer description text");
    });
  });

  // ============================================
  // COMPOSITION TESTS
  // ============================================
  describe("Composition", () => {
    it("supports mobile action sheet pattern", () => {
      render(
        <WexDrawer open>
          <WexDrawer.Content>
            <WexDrawer.Header>
              <WexDrawer.Title>Select Action</WexDrawer.Title>
            </WexDrawer.Header>
            <div>
              <WexButton>Edit</WexButton>
              <WexButton>Share</WexButton>
              <WexButton intent="destructive">Delete</WexButton>
            </div>
          </WexDrawer.Content>
        </WexDrawer>
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    });

    it("supports form inside drawer", () => {
      render(
        <WexDrawer open>
          <WexDrawer.Content>
            <WexDrawer.Header>
              <WexDrawer.Title>New Item</WexDrawer.Title>
            </WexDrawer.Header>
            <form>
              <WexInput name="title" placeholder="Title" />
              <WexDrawer.Footer>
                <WexButton type="submit">Save</WexButton>
              </WexDrawer.Footer>
            </form>
          </WexDrawer.Content>
        </WexDrawer>
      );

      expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    it("supports nested scrollable content", () => {
      render(
        <WexDrawer open>
          <WexDrawer.Content>
            <WexDrawer.Header>
              <WexDrawer.Title>Scrollable Content</WexDrawer.Title>
            </WexDrawer.Header>
            <div style={{ maxHeight: "200px", overflow: "auto" }}>
              {Array.from({ length: 20 }, (_, i) => (
                <p key={i}>Item {i + 1}</p>
              ))}
            </div>
          </WexDrawer.Content>
        </WexDrawer>
      );

      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 20")).toBeInTheDocument();
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("renders multiple drawers correctly", () => {
      render(
        <>
          <WexDrawer>
            <WexDrawer.Trigger asChild>
              <WexButton>Drawer 1</WexButton>
            </WexDrawer.Trigger>
            <WexDrawer.Content>
              <WexDrawer.Title>First Drawer</WexDrawer.Title>
            </WexDrawer.Content>
          </WexDrawer>
          <WexDrawer>
            <WexDrawer.Trigger asChild>
              <WexButton>Drawer 2</WexButton>
            </WexDrawer.Trigger>
            <WexDrawer.Content>
              <WexDrawer.Title>Second Drawer</WexDrawer.Title>
            </WexDrawer.Content>
          </WexDrawer>
        </>
      );

      expect(screen.getByRole("button", { name: "Drawer 1" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Drawer 2" })).toBeInTheDocument();
    });

    it("works without header", () => {
      render(
        <WexDrawer open>
          <WexDrawer.Content>
            <WexDrawer.Title>Simple Drawer</WexDrawer.Title>
            <p>Just content, no header wrapper</p>
          </WexDrawer.Content>
        </WexDrawer>
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Just content, no header wrapper")).toBeInTheDocument();
    });
  });
});
