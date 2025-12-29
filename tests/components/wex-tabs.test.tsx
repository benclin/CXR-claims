/**
 * WexTabs Component Tests
 *
 * Comprehensive tests covering:
 * - Rendering and composition
 * - Tab switching behavior
 * - Keyboard navigation (arrow keys)
 * - Accessibility (ARIA attributes, roles)
 * - Controlled and uncontrolled modes
 */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { WexTabs } from "@/components/wex";

describe("WexTabs", () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("renders without crashing", () => {
      render(
        <WexTabs defaultValue="tab1">
          <WexTabs.List>
            <WexTabs.Trigger value="tab1">Tab 1</WexTabs.Trigger>
            <WexTabs.Trigger value="tab2">Tab 2</WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">Content 1</WexTabs.Content>
          <WexTabs.Content value="tab2">Content 2</WexTabs.Content>
        </WexTabs>
      );
      expect(screen.getByRole("tablist")).toBeInTheDocument();
    });

    it("renders all tab triggers", () => {
      render(
        <WexTabs defaultValue="tab1">
          <WexTabs.List>
            <WexTabs.Trigger value="tab1">First Tab</WexTabs.Trigger>
            <WexTabs.Trigger value="tab2">Second Tab</WexTabs.Trigger>
            <WexTabs.Trigger value="tab3">Third Tab</WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">Content 1</WexTabs.Content>
          <WexTabs.Content value="tab2">Content 2</WexTabs.Content>
          <WexTabs.Content value="tab3">Content 3</WexTabs.Content>
        </WexTabs>
      );
      expect(screen.getByRole("tab", { name: "First Tab" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "Second Tab" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "Third Tab" })).toBeInTheDocument();
    });

    it("shows default tab content", () => {
      render(
        <WexTabs defaultValue="tab1">
          <WexTabs.List>
            <WexTabs.Trigger value="tab1">Tab 1</WexTabs.Trigger>
            <WexTabs.Trigger value="tab2">Tab 2</WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">Default Content</WexTabs.Content>
          <WexTabs.Content value="tab2">Other Content</WexTabs.Content>
        </WexTabs>
      );
      expect(screen.getByText("Default Content")).toBeInTheDocument();
    });

    it("hides non-active tab content", () => {
      render(
        <WexTabs defaultValue="tab1">
          <WexTabs.List>
            <WexTabs.Trigger value="tab1">Tab 1</WexTabs.Trigger>
            <WexTabs.Trigger value="tab2">Tab 2</WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">Active Content</WexTabs.Content>
          <WexTabs.Content value="tab2">Hidden Content</WexTabs.Content>
        </WexTabs>
      );
      expect(screen.queryByText("Hidden Content")).not.toBeInTheDocument();
    });

    it("accepts className on triggers", () => {
      render(
        <WexTabs defaultValue="tab1">
          <WexTabs.List>
            <WexTabs.Trigger value="tab1" className="custom-trigger">
              Tab
            </WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">Content</WexTabs.Content>
        </WexTabs>
      );
      expect(screen.getByRole("tab")).toHaveClass("custom-trigger");
    });

    it("accepts className on list", () => {
      render(
        <WexTabs defaultValue="tab1">
          <WexTabs.List className="custom-list">
            <WexTabs.Trigger value="tab1">Tab</WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">Content</WexTabs.Content>
        </WexTabs>
      );
      expect(screen.getByRole("tablist")).toHaveClass("custom-list");
    });

    it("accepts className on content", () => {
      render(
        <WexTabs defaultValue="tab1">
          <WexTabs.List>
            <WexTabs.Trigger value="tab1">Tab</WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1" className="custom-content">
            Content
          </WexTabs.Content>
        </WexTabs>
      );
      expect(screen.getByRole("tabpanel")).toHaveClass("custom-content");
    });
  });

  // ============================================
  // TAB SWITCHING TESTS
  // ============================================
  describe("Tab Switching", () => {
    it("switches content when clicking different tabs", async () => {
      const user = userEvent.setup();
      render(
        <WexTabs defaultValue="tab1">
          <WexTabs.List>
            <WexTabs.Trigger value="tab1">Tab 1</WexTabs.Trigger>
            <WexTabs.Trigger value="tab2">Tab 2</WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">Content for Tab 1</WexTabs.Content>
          <WexTabs.Content value="tab2">Content for Tab 2</WexTabs.Content>
        </WexTabs>
      );

      expect(screen.getByText("Content for Tab 1")).toBeInTheDocument();
      expect(screen.queryByText("Content for Tab 2")).not.toBeInTheDocument();

      await user.click(screen.getByRole("tab", { name: "Tab 2" }));

      expect(screen.queryByText("Content for Tab 1")).not.toBeInTheDocument();
      expect(screen.getByText("Content for Tab 2")).toBeInTheDocument();
    });

    it("updates selected state on tab click", async () => {
      const user = userEvent.setup();
      render(
        <WexTabs defaultValue="tab1">
          <WexTabs.List>
            <WexTabs.Trigger value="tab1">Tab 1</WexTabs.Trigger>
            <WexTabs.Trigger value="tab2">Tab 2</WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">Content 1</WexTabs.Content>
          <WexTabs.Content value="tab2">Content 2</WexTabs.Content>
        </WexTabs>
      );

      const tab1 = screen.getByRole("tab", { name: "Tab 1" });
      const tab2 = screen.getByRole("tab", { name: "Tab 2" });

      expect(tab1).toHaveAttribute("aria-selected", "true");
      expect(tab2).toHaveAttribute("aria-selected", "false");

      await user.click(tab2);

      expect(tab1).toHaveAttribute("aria-selected", "false");
      expect(tab2).toHaveAttribute("aria-selected", "true");
    });
  });

  // ============================================
  // KEYBOARD NAVIGATION TESTS
  // ============================================
  describe("Keyboard Navigation", () => {
    it("moves focus with ArrowRight key", async () => {
      const user = userEvent.setup();
      render(
        <WexTabs defaultValue="tab1">
          <WexTabs.List>
            <WexTabs.Trigger value="tab1">Tab 1</WexTabs.Trigger>
            <WexTabs.Trigger value="tab2">Tab 2</WexTabs.Trigger>
            <WexTabs.Trigger value="tab3">Tab 3</WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">Content 1</WexTabs.Content>
          <WexTabs.Content value="tab2">Content 2</WexTabs.Content>
          <WexTabs.Content value="tab3">Content 3</WexTabs.Content>
        </WexTabs>
      );

      const tab1 = screen.getByRole("tab", { name: "Tab 1" });
      tab1.focus();

      await user.keyboard("{ArrowRight}");
      expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveFocus();

      await user.keyboard("{ArrowRight}");
      expect(screen.getByRole("tab", { name: "Tab 3" })).toHaveFocus();
    });

    it("moves focus with ArrowLeft key", async () => {
      const user = userEvent.setup();
      render(
        <WexTabs defaultValue="tab3">
          <WexTabs.List>
            <WexTabs.Trigger value="tab1">Tab 1</WexTabs.Trigger>
            <WexTabs.Trigger value="tab2">Tab 2</WexTabs.Trigger>
            <WexTabs.Trigger value="tab3">Tab 3</WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">Content 1</WexTabs.Content>
          <WexTabs.Content value="tab2">Content 2</WexTabs.Content>
          <WexTabs.Content value="tab3">Content 3</WexTabs.Content>
        </WexTabs>
      );

      const tab3 = screen.getByRole("tab", { name: "Tab 3" });
      tab3.focus();

      await user.keyboard("{ArrowLeft}");
      expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveFocus();

      await user.keyboard("{ArrowLeft}");
      expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveFocus();
    });

    it("wraps focus from last to first with ArrowRight", async () => {
      const user = userEvent.setup();
      render(
        <WexTabs defaultValue="tab3">
          <WexTabs.List>
            <WexTabs.Trigger value="tab1">Tab 1</WexTabs.Trigger>
            <WexTabs.Trigger value="tab2">Tab 2</WexTabs.Trigger>
            <WexTabs.Trigger value="tab3">Tab 3</WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">Content 1</WexTabs.Content>
          <WexTabs.Content value="tab2">Content 2</WexTabs.Content>
          <WexTabs.Content value="tab3">Content 3</WexTabs.Content>
        </WexTabs>
      );

      const tab3 = screen.getByRole("tab", { name: "Tab 3" });
      tab3.focus();

      await user.keyboard("{ArrowRight}");
      expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveFocus();
    });

    it("wraps focus from first to last with ArrowLeft", async () => {
      const user = userEvent.setup();
      render(
        <WexTabs defaultValue="tab1">
          <WexTabs.List>
            <WexTabs.Trigger value="tab1">Tab 1</WexTabs.Trigger>
            <WexTabs.Trigger value="tab2">Tab 2</WexTabs.Trigger>
            <WexTabs.Trigger value="tab3">Tab 3</WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">Content 1</WexTabs.Content>
          <WexTabs.Content value="tab2">Content 2</WexTabs.Content>
          <WexTabs.Content value="tab3">Content 3</WexTabs.Content>
        </WexTabs>
      );

      const tab1 = screen.getByRole("tab", { name: "Tab 1" });
      tab1.focus();

      await user.keyboard("{ArrowLeft}");
      expect(screen.getByRole("tab", { name: "Tab 3" })).toHaveFocus();
    });

    it("activates tab with Enter key", async () => {
      const user = userEvent.setup();
      render(
        <WexTabs defaultValue="tab1">
          <WexTabs.List>
            <WexTabs.Trigger value="tab1">Tab 1</WexTabs.Trigger>
            <WexTabs.Trigger value="tab2">Tab 2</WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">Content 1</WexTabs.Content>
          <WexTabs.Content value="tab2">Content 2</WexTabs.Content>
        </WexTabs>
      );

      const tab1 = screen.getByRole("tab", { name: "Tab 1" });
      tab1.focus();

      await user.keyboard("{ArrowRight}");
      await user.keyboard("{Enter}");

      expect(screen.getByText("Content 2")).toBeInTheDocument();
    });

    it("activates tab with Space key", async () => {
      const user = userEvent.setup();
      render(
        <WexTabs defaultValue="tab1">
          <WexTabs.List>
            <WexTabs.Trigger value="tab1">Tab 1</WexTabs.Trigger>
            <WexTabs.Trigger value="tab2">Tab 2</WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">Content 1</WexTabs.Content>
          <WexTabs.Content value="tab2">Content 2</WexTabs.Content>
        </WexTabs>
      );

      const tab1 = screen.getByRole("tab", { name: "Tab 1" });
      tab1.focus();

      await user.keyboard("{ArrowRight}");
      await user.keyboard(" ");

      expect(screen.getByText("Content 2")).toBeInTheDocument();
    });

    it("moves focus to first tab with Home key", async () => {
      const user = userEvent.setup();
      render(
        <WexTabs defaultValue="tab3">
          <WexTabs.List>
            <WexTabs.Trigger value="tab1">Tab 1</WexTabs.Trigger>
            <WexTabs.Trigger value="tab2">Tab 2</WexTabs.Trigger>
            <WexTabs.Trigger value="tab3">Tab 3</WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">Content 1</WexTabs.Content>
          <WexTabs.Content value="tab2">Content 2</WexTabs.Content>
          <WexTabs.Content value="tab3">Content 3</WexTabs.Content>
        </WexTabs>
      );

      const tab3 = screen.getByRole("tab", { name: "Tab 3" });
      tab3.focus();

      await user.keyboard("{Home}");
      expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveFocus();
    });

    it("moves focus to last tab with End key", async () => {
      const user = userEvent.setup();
      render(
        <WexTabs defaultValue="tab1">
          <WexTabs.List>
            <WexTabs.Trigger value="tab1">Tab 1</WexTabs.Trigger>
            <WexTabs.Trigger value="tab2">Tab 2</WexTabs.Trigger>
            <WexTabs.Trigger value="tab3">Tab 3</WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">Content 1</WexTabs.Content>
          <WexTabs.Content value="tab2">Content 2</WexTabs.Content>
          <WexTabs.Content value="tab3">Content 3</WexTabs.Content>
        </WexTabs>
      );

      const tab1 = screen.getByRole("tab", { name: "Tab 1" });
      tab1.focus();

      await user.keyboard("{End}");
      expect(screen.getByRole("tab", { name: "Tab 3" })).toHaveFocus();
    });

    it("skips disabled tabs when navigating", async () => {
      const user = userEvent.setup();
      render(
        <WexTabs defaultValue="tab1">
          <WexTabs.List>
            <WexTabs.Trigger value="tab1">Tab 1</WexTabs.Trigger>
            <WexTabs.Trigger value="tab2" disabled>
              Tab 2
            </WexTabs.Trigger>
            <WexTabs.Trigger value="tab3">Tab 3</WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">Content 1</WexTabs.Content>
          <WexTabs.Content value="tab2">Content 2</WexTabs.Content>
          <WexTabs.Content value="tab3">Content 3</WexTabs.Content>
        </WexTabs>
      );

      const tab1 = screen.getByRole("tab", { name: "Tab 1" });
      tab1.focus();

      await user.keyboard("{ArrowRight}");
      // Should skip disabled Tab 2 and go to Tab 3
      expect(screen.getByRole("tab", { name: "Tab 3" })).toHaveFocus();
    });
  });

  // ============================================
  // CONTROLLED MODE TESTS
  // ============================================
  describe("Controlled Mode", () => {
    it("supports controlled value", async () => {
      const user = userEvent.setup();
      const ControlledTabs = () => {
        const [value, setValue] = useState("tab1");
        return (
          <>
            <span data-testid="current-value">{value}</span>
            <WexTabs value={value} onValueChange={setValue}>
              <WexTabs.List>
                <WexTabs.Trigger value="tab1">Tab 1</WexTabs.Trigger>
                <WexTabs.Trigger value="tab2">Tab 2</WexTabs.Trigger>
              </WexTabs.List>
              <WexTabs.Content value="tab1">Content 1</WexTabs.Content>
              <WexTabs.Content value="tab2">Content 2</WexTabs.Content>
            </WexTabs>
          </>
        );
      };

      render(<ControlledTabs />);
      expect(screen.getByTestId("current-value")).toHaveTextContent("tab1");

      await user.click(screen.getByRole("tab", { name: "Tab 2" }));
      expect(screen.getByTestId("current-value")).toHaveTextContent("tab2");
    });

    it("calls onValueChange when tab changes", async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(
        <WexTabs defaultValue="tab1" onValueChange={handleValueChange}>
          <WexTabs.List>
            <WexTabs.Trigger value="tab1">Tab 1</WexTabs.Trigger>
            <WexTabs.Trigger value="tab2">Tab 2</WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">Content 1</WexTabs.Content>
          <WexTabs.Content value="tab2">Content 2</WexTabs.Content>
        </WexTabs>
      );

      await user.click(screen.getByRole("tab", { name: "Tab 2" }));
      expect(handleValueChange).toHaveBeenCalledWith("tab2");
    });
  });

  // ============================================
  // DISABLED STATE TESTS
  // ============================================
  describe("Disabled State", () => {
    it("cannot click disabled tab", async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(
        <WexTabs defaultValue="tab1" onValueChange={handleValueChange}>
          <WexTabs.List>
            <WexTabs.Trigger value="tab1">Tab 1</WexTabs.Trigger>
            <WexTabs.Trigger value="tab2" disabled>
              Tab 2
            </WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">Content 1</WexTabs.Content>
          <WexTabs.Content value="tab2">Content 2</WexTabs.Content>
        </WexTabs>
      );

      await user.click(screen.getByRole("tab", { name: "Tab 2" }));
      expect(handleValueChange).not.toHaveBeenCalled();
    });

    it("disabled tab has aria-disabled attribute", () => {
      render(
        <WexTabs defaultValue="tab1">
          <WexTabs.List>
            <WexTabs.Trigger value="tab1">Tab 1</WexTabs.Trigger>
            <WexTabs.Trigger value="tab2" disabled>
              Tab 2
            </WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">Content 1</WexTabs.Content>
          <WexTabs.Content value="tab2">Content 2</WexTabs.Content>
        </WexTabs>
      );

      expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveAttribute(
        "data-disabled"
      );
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe("Accessibility", () => {
    it("has correct tablist role", () => {
      render(
        <WexTabs defaultValue="tab1">
          <WexTabs.List>
            <WexTabs.Trigger value="tab1">Tab 1</WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">Content</WexTabs.Content>
        </WexTabs>
      );
      expect(screen.getByRole("tablist")).toBeInTheDocument();
    });

    it("has correct tab role on triggers", () => {
      render(
        <WexTabs defaultValue="tab1">
          <WexTabs.List>
            <WexTabs.Trigger value="tab1">Tab 1</WexTabs.Trigger>
            <WexTabs.Trigger value="tab2">Tab 2</WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">Content 1</WexTabs.Content>
          <WexTabs.Content value="tab2">Content 2</WexTabs.Content>
        </WexTabs>
      );
      expect(screen.getAllByRole("tab")).toHaveLength(2);
    });

    it("has correct tabpanel role on content", () => {
      render(
        <WexTabs defaultValue="tab1">
          <WexTabs.List>
            <WexTabs.Trigger value="tab1">Tab 1</WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">Content</WexTabs.Content>
        </WexTabs>
      );
      expect(screen.getByRole("tabpanel")).toBeInTheDocument();
    });

    it("tab has aria-controls pointing to panel", () => {
      render(
        <WexTabs defaultValue="tab1">
          <WexTabs.List>
            <WexTabs.Trigger value="tab1">Tab 1</WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">Content</WexTabs.Content>
        </WexTabs>
      );

      const tab = screen.getByRole("tab");
      const panel = screen.getByRole("tabpanel");
      expect(tab).toHaveAttribute("aria-controls", panel.id);
    });

    it("panel has aria-labelledby pointing to tab", () => {
      render(
        <WexTabs defaultValue="tab1">
          <WexTabs.List>
            <WexTabs.Trigger value="tab1">Tab 1</WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">Content</WexTabs.Content>
        </WexTabs>
      );

      const tab = screen.getByRole("tab");
      const panel = screen.getByRole("tabpanel");
      expect(panel).toHaveAttribute("aria-labelledby", tab.id);
    });

    it("selected tab has aria-selected true", () => {
      render(
        <WexTabs defaultValue="tab1">
          <WexTabs.List>
            <WexTabs.Trigger value="tab1">Tab 1</WexTabs.Trigger>
            <WexTabs.Trigger value="tab2">Tab 2</WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">Content 1</WexTabs.Content>
          <WexTabs.Content value="tab2">Content 2</WexTabs.Content>
        </WexTabs>
      );

      expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveAttribute(
        "aria-selected",
        "true"
      );
      expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveAttribute(
        "aria-selected",
        "false"
      );
    });

    it("selected tab is distinguished", () => {
      render(
        <WexTabs defaultValue="tab1">
          <WexTabs.List>
            <WexTabs.Trigger value="tab1">Tab 1</WexTabs.Trigger>
            <WexTabs.Trigger value="tab2">Tab 2</WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">Content 1</WexTabs.Content>
          <WexTabs.Content value="tab2">Content 2</WexTabs.Content>
        </WexTabs>
      );

      // Selected tab has aria-selected
      expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveAttribute(
        "aria-selected",
        "true"
      );
      expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveAttribute(
        "aria-selected",
        "false"
      );
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("handles many tabs", () => {
      const tabs = Array.from({ length: 10 }, (_, i) => `Tab ${i + 1}`);
      render(
        <WexTabs defaultValue="Tab 1">
          <WexTabs.List>
            {tabs.map((tab) => (
              <WexTabs.Trigger key={tab} value={tab}>
                {tab}
              </WexTabs.Trigger>
            ))}
          </WexTabs.List>
          {tabs.map((tab) => (
            <WexTabs.Content key={tab} value={tab}>
              Content for {tab}
            </WexTabs.Content>
          ))}
        </WexTabs>
      );

      expect(screen.getAllByRole("tab")).toHaveLength(10);
    });

    it("handles tabs with complex content", () => {
      render(
        <WexTabs defaultValue="tab1">
          <WexTabs.List>
            <WexTabs.Trigger value="tab1">
              <span>🏠</span> Home
            </WexTabs.Trigger>
            <WexTabs.Trigger value="tab2">
              <span>⚙️</span> Settings
            </WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">
            <div>
              <h2>Home Content</h2>
              <p>Welcome home!</p>
            </div>
          </WexTabs.Content>
          <WexTabs.Content value="tab2">Settings Content</WexTabs.Content>
        </WexTabs>
      );

      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Welcome home!")).toBeInTheDocument();
    });

    it("works with single tab", () => {
      render(
        <WexTabs defaultValue="only">
          <WexTabs.List>
            <WexTabs.Trigger value="only">Only Tab</WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="only">Only Content</WexTabs.Content>
        </WexTabs>
      );

      expect(screen.getByRole("tab")).toBeInTheDocument();
      expect(screen.getByText("Only Content")).toBeInTheDocument();
    });

    it("handles rapid tab switching", async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <WexTabs defaultValue="tab1">
          <WexTabs.List>
            <WexTabs.Trigger value="tab1">Tab 1</WexTabs.Trigger>
            <WexTabs.Trigger value="tab2">Tab 2</WexTabs.Trigger>
            <WexTabs.Trigger value="tab3">Tab 3</WexTabs.Trigger>
          </WexTabs.List>
          <WexTabs.Content value="tab1">Content 1</WexTabs.Content>
          <WexTabs.Content value="tab2">Content 2</WexTabs.Content>
          <WexTabs.Content value="tab3">Content 3</WexTabs.Content>
        </WexTabs>
      );

      await user.click(screen.getByRole("tab", { name: "Tab 2" }));
      await user.click(screen.getByRole("tab", { name: "Tab 3" }));
      await user.click(screen.getByRole("tab", { name: "Tab 1" }));

      expect(screen.getByText("Content 1")).toBeInTheDocument();
    });
  });
});
