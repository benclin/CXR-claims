/**
 * WexAccordion Component Tests
 *
 * Comprehensive tests covering:
 * - Rendering and composition
 * - Expand/collapse behavior
 * - Keyboard navigation
 * - Single vs multiple modes
 * - Accessibility (ARIA attributes)
 */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { WexAccordion } from "@/components/wex";

describe("WexAccordion", () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("renders without crashing", () => {
      render(
        <WexAccordion type="single" collapsible>
          <WexAccordion.Item value="item-1">
            <WexAccordion.Trigger>Is it accessible?</WexAccordion.Trigger>
            <WexAccordion.Content>Yes, it is.</WexAccordion.Content>
          </WexAccordion.Item>
        </WexAccordion>
      );
      expect(screen.getByText("Is it accessible?")).toBeInTheDocument();
    });

    it("renders multiple items", () => {
      render(
        <WexAccordion type="single" collapsible>
          <WexAccordion.Item value="item-1">
            <WexAccordion.Trigger>First</WexAccordion.Trigger>
            <WexAccordion.Content>First content</WexAccordion.Content>
          </WexAccordion.Item>
          <WexAccordion.Item value="item-2">
            <WexAccordion.Trigger>Second</WexAccordion.Trigger>
            <WexAccordion.Content>Second content</WexAccordion.Content>
          </WexAccordion.Item>
          <WexAccordion.Item value="item-3">
            <WexAccordion.Trigger>Third</WexAccordion.Trigger>
            <WexAccordion.Content>Third content</WexAccordion.Content>
          </WexAccordion.Item>
        </WexAccordion>
      );
      expect(screen.getByText("First")).toBeInTheDocument();
      expect(screen.getByText("Second")).toBeInTheDocument();
      expect(screen.getByText("Third")).toBeInTheDocument();
    });

    it("renders with default expanded item", () => {
      render(
        <WexAccordion type="single" defaultValue="item-1">
          <WexAccordion.Item value="item-1">
            <WexAccordion.Trigger>Open Item</WexAccordion.Trigger>
            <WexAccordion.Content>Visible content</WexAccordion.Content>
          </WexAccordion.Item>
        </WexAccordion>
      );
      expect(screen.getByText("Visible content")).toBeInTheDocument();
    });

    it("hides content by default when collapsible", () => {
      render(
        <WexAccordion type="single" collapsible>
          <WexAccordion.Item value="item-1">
            <WexAccordion.Trigger>Collapsed Item</WexAccordion.Trigger>
            <WexAccordion.Content>Hidden content</WexAccordion.Content>
          </WexAccordion.Item>
        </WexAccordion>
      );
      expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
    });

    it("accepts className on item", () => {
      render(
        <WexAccordion type="single" collapsible>
          <WexAccordion.Item value="item-1" className="custom-item">
            <WexAccordion.Trigger>Trigger</WexAccordion.Trigger>
            <WexAccordion.Content>Content</WexAccordion.Content>
          </WexAccordion.Item>
        </WexAccordion>
      );
      // Find the accordion item by its class
      const item = document.querySelector(".custom-item");
      expect(item).toBeInTheDocument();
    });
  });

  // ============================================
  // EXPAND/COLLAPSE BEHAVIOR
  // ============================================
  describe("Expand/Collapse Behavior", () => {
    it("expands item when trigger is clicked", async () => {
      const user = userEvent.setup();
      render(
        <WexAccordion type="single" collapsible>
          <WexAccordion.Item value="item-1">
            <WexAccordion.Trigger>Click Me</WexAccordion.Trigger>
            <WexAccordion.Content>Now you see me</WexAccordion.Content>
          </WexAccordion.Item>
        </WexAccordion>
      );

      expect(screen.queryByText("Now you see me")).not.toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Click Me" }));

      expect(screen.getByText("Now you see me")).toBeInTheDocument();
    });

    it("collapses item when clicked again (collapsible mode)", async () => {
      const user = userEvent.setup();
      render(
        <WexAccordion type="single" collapsible defaultValue="item-1">
          <WexAccordion.Item value="item-1">
            <WexAccordion.Trigger>Toggle Me</WexAccordion.Trigger>
            <WexAccordion.Content>Collapsible content</WexAccordion.Content>
          </WexAccordion.Item>
        </WexAccordion>
      );

      expect(screen.getByText("Collapsible content")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Toggle Me" }));

      expect(screen.queryByText("Collapsible content")).not.toBeInTheDocument();
    });

    it("cannot collapse in non-collapsible single mode", async () => {
      const user = userEvent.setup();
      render(
        <WexAccordion type="single" defaultValue="item-1">
          <WexAccordion.Item value="item-1">
            <WexAccordion.Trigger>Always Open</WexAccordion.Trigger>
            <WexAccordion.Content>Cannot collapse</WexAccordion.Content>
          </WexAccordion.Item>
        </WexAccordion>
      );

      expect(screen.getByText("Cannot collapse")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Always Open" }));

      // Still visible because collapsible is false
      expect(screen.getByText("Cannot collapse")).toBeInTheDocument();
    });

    it("closes other items in single mode", async () => {
      const user = userEvent.setup();
      render(
        <WexAccordion type="single" collapsible defaultValue="item-1">
          <WexAccordion.Item value="item-1">
            <WexAccordion.Trigger>First</WexAccordion.Trigger>
            <WexAccordion.Content>First content</WexAccordion.Content>
          </WexAccordion.Item>
          <WexAccordion.Item value="item-2">
            <WexAccordion.Trigger>Second</WexAccordion.Trigger>
            <WexAccordion.Content>Second content</WexAccordion.Content>
          </WexAccordion.Item>
        </WexAccordion>
      );

      expect(screen.getByText("First content")).toBeInTheDocument();
      expect(screen.queryByText("Second content")).not.toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Second" }));

      expect(screen.queryByText("First content")).not.toBeInTheDocument();
      expect(screen.getByText("Second content")).toBeInTheDocument();
    });
  });

  // ============================================
  // MULTIPLE MODE TESTS
  // ============================================
  describe("Multiple Mode", () => {
    it("allows multiple items open in multiple mode", async () => {
      const user = userEvent.setup();
      render(
        <WexAccordion type="multiple">
          <WexAccordion.Item value="item-1">
            <WexAccordion.Trigger>First</WexAccordion.Trigger>
            <WexAccordion.Content>First content</WexAccordion.Content>
          </WexAccordion.Item>
          <WexAccordion.Item value="item-2">
            <WexAccordion.Trigger>Second</WexAccordion.Trigger>
            <WexAccordion.Content>Second content</WexAccordion.Content>
          </WexAccordion.Item>
        </WexAccordion>
      );

      await user.click(screen.getByRole("button", { name: "First" }));
      await user.click(screen.getByRole("button", { name: "Second" }));

      expect(screen.getByText("First content")).toBeInTheDocument();
      expect(screen.getByText("Second content")).toBeInTheDocument();
    });

    it("can close individual items in multiple mode", async () => {
      const user = userEvent.setup();
      render(
        <WexAccordion type="multiple" defaultValue={["item-1", "item-2"]}>
          <WexAccordion.Item value="item-1">
            <WexAccordion.Trigger>First</WexAccordion.Trigger>
            <WexAccordion.Content>First content</WexAccordion.Content>
          </WexAccordion.Item>
          <WexAccordion.Item value="item-2">
            <WexAccordion.Trigger>Second</WexAccordion.Trigger>
            <WexAccordion.Content>Second content</WexAccordion.Content>
          </WexAccordion.Item>
        </WexAccordion>
      );

      expect(screen.getByText("First content")).toBeInTheDocument();
      expect(screen.getByText("Second content")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "First" }));

      expect(screen.queryByText("First content")).not.toBeInTheDocument();
      expect(screen.getByText("Second content")).toBeInTheDocument();
    });
  });

  // ============================================
  // KEYBOARD NAVIGATION TESTS
  // ============================================
  describe("Keyboard Navigation", () => {
    it("toggles with Enter key", async () => {
      const user = userEvent.setup();
      render(
        <WexAccordion type="single" collapsible>
          <WexAccordion.Item value="item-1">
            <WexAccordion.Trigger>Toggle</WexAccordion.Trigger>
            <WexAccordion.Content>Content</WexAccordion.Content>
          </WexAccordion.Item>
        </WexAccordion>
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
        <WexAccordion type="single" collapsible>
          <WexAccordion.Item value="item-1">
            <WexAccordion.Trigger>Toggle</WexAccordion.Trigger>
            <WexAccordion.Content>Content</WexAccordion.Content>
          </WexAccordion.Item>
        </WexAccordion>
      );

      const trigger = screen.getByRole("button", { name: "Toggle" });
      trigger.focus();

      await user.keyboard(" ");
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("moves focus with ArrowDown key", async () => {
      const user = userEvent.setup();
      render(
        <WexAccordion type="single" collapsible>
          <WexAccordion.Item value="item-1">
            <WexAccordion.Trigger>First</WexAccordion.Trigger>
            <WexAccordion.Content>Content 1</WexAccordion.Content>
          </WexAccordion.Item>
          <WexAccordion.Item value="item-2">
            <WexAccordion.Trigger>Second</WexAccordion.Trigger>
            <WexAccordion.Content>Content 2</WexAccordion.Content>
          </WexAccordion.Item>
        </WexAccordion>
      );

      const first = screen.getByRole("button", { name: "First" });
      first.focus();

      await user.keyboard("{ArrowDown}");
      expect(screen.getByRole("button", { name: "Second" })).toHaveFocus();
    });

    it("moves focus with ArrowUp key", async () => {
      const user = userEvent.setup();
      render(
        <WexAccordion type="single" collapsible>
          <WexAccordion.Item value="item-1">
            <WexAccordion.Trigger>First</WexAccordion.Trigger>
            <WexAccordion.Content>Content 1</WexAccordion.Content>
          </WexAccordion.Item>
          <WexAccordion.Item value="item-2">
            <WexAccordion.Trigger>Second</WexAccordion.Trigger>
            <WexAccordion.Content>Content 2</WexAccordion.Content>
          </WexAccordion.Item>
        </WexAccordion>
      );

      const second = screen.getByRole("button", { name: "Second" });
      second.focus();

      await user.keyboard("{ArrowUp}");
      expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
    });

    it("moves focus to first item with Home key", async () => {
      const user = userEvent.setup();
      render(
        <WexAccordion type="single" collapsible>
          <WexAccordion.Item value="item-1">
            <WexAccordion.Trigger>First</WexAccordion.Trigger>
            <WexAccordion.Content>Content 1</WexAccordion.Content>
          </WexAccordion.Item>
          <WexAccordion.Item value="item-2">
            <WexAccordion.Trigger>Second</WexAccordion.Trigger>
            <WexAccordion.Content>Content 2</WexAccordion.Content>
          </WexAccordion.Item>
          <WexAccordion.Item value="item-3">
            <WexAccordion.Trigger>Third</WexAccordion.Trigger>
            <WexAccordion.Content>Content 3</WexAccordion.Content>
          </WexAccordion.Item>
        </WexAccordion>
      );

      const third = screen.getByRole("button", { name: "Third" });
      third.focus();

      await user.keyboard("{Home}");
      expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
    });

    it("moves focus to last item with End key", async () => {
      const user = userEvent.setup();
      render(
        <WexAccordion type="single" collapsible>
          <WexAccordion.Item value="item-1">
            <WexAccordion.Trigger>First</WexAccordion.Trigger>
            <WexAccordion.Content>Content 1</WexAccordion.Content>
          </WexAccordion.Item>
          <WexAccordion.Item value="item-2">
            <WexAccordion.Trigger>Second</WexAccordion.Trigger>
            <WexAccordion.Content>Content 2</WexAccordion.Content>
          </WexAccordion.Item>
          <WexAccordion.Item value="item-3">
            <WexAccordion.Trigger>Third</WexAccordion.Trigger>
            <WexAccordion.Content>Content 3</WexAccordion.Content>
          </WexAccordion.Item>
        </WexAccordion>
      );

      const first = screen.getByRole("button", { name: "First" });
      first.focus();

      await user.keyboard("{End}");
      expect(screen.getByRole("button", { name: "Third" })).toHaveFocus();
    });

    it("can be focused with Tab", async () => {
      const user = userEvent.setup();
      render(
        <WexAccordion type="single" collapsible>
          <WexAccordion.Item value="item-1">
            <WexAccordion.Trigger>Focus Me</WexAccordion.Trigger>
            <WexAccordion.Content>Content</WexAccordion.Content>
          </WexAccordion.Item>
        </WexAccordion>
      );

      await user.tab();
      expect(screen.getByRole("button", { name: "Focus Me" })).toHaveFocus();
    });
  });

  // ============================================
  // CONTROLLED MODE TESTS
  // ============================================
  describe("Controlled Mode", () => {
    it("supports controlled value in single mode", async () => {
      const user = userEvent.setup();
      const ControlledAccordion = () => {
        const [value, setValue] = useState<string | undefined>("item-1");
        return (
          <>
            <span data-testid="current">{value || "none"}</span>
            <WexAccordion
              type="single"
              collapsible
              value={value}
              onValueChange={setValue}
            >
              <WexAccordion.Item value="item-1">
                <WexAccordion.Trigger>First</WexAccordion.Trigger>
                <WexAccordion.Content>Content 1</WexAccordion.Content>
              </WexAccordion.Item>
              <WexAccordion.Item value="item-2">
                <WexAccordion.Trigger>Second</WexAccordion.Trigger>
                <WexAccordion.Content>Content 2</WexAccordion.Content>
              </WexAccordion.Item>
            </WexAccordion>
          </>
        );
      };

      render(<ControlledAccordion />);
      expect(screen.getByTestId("current")).toHaveTextContent("item-1");

      await user.click(screen.getByRole("button", { name: "Second" }));
      expect(screen.getByTestId("current")).toHaveTextContent("item-2");
    });

    it("supports controlled value in multiple mode", async () => {
      const user = userEvent.setup();
      const ControlledAccordion = () => {
        const [value, setValue] = useState<string[]>(["item-1"]);
        return (
          <>
            <span data-testid="current">{value.join(",") || "none"}</span>
            <WexAccordion type="multiple" value={value} onValueChange={setValue}>
              <WexAccordion.Item value="item-1">
                <WexAccordion.Trigger>First</WexAccordion.Trigger>
                <WexAccordion.Content>Content 1</WexAccordion.Content>
              </WexAccordion.Item>
              <WexAccordion.Item value="item-2">
                <WexAccordion.Trigger>Second</WexAccordion.Trigger>
                <WexAccordion.Content>Content 2</WexAccordion.Content>
              </WexAccordion.Item>
            </WexAccordion>
          </>
        );
      };

      render(<ControlledAccordion />);
      expect(screen.getByTestId("current")).toHaveTextContent("item-1");

      await user.click(screen.getByRole("button", { name: "Second" }));
      expect(screen.getByTestId("current")).toHaveTextContent("item-1,item-2");
    });
  });

  // ============================================
  // DISABLED STATE TESTS
  // ============================================
  describe("Disabled State", () => {
    it("cannot expand disabled item", async () => {
      const user = userEvent.setup();
      render(
        <WexAccordion type="single" collapsible>
          <WexAccordion.Item value="item-1" disabled>
            <WexAccordion.Trigger>Disabled</WexAccordion.Trigger>
            <WexAccordion.Content>Cannot see this</WexAccordion.Content>
          </WexAccordion.Item>
        </WexAccordion>
      );

      await user.click(screen.getByRole("button", { name: "Disabled" }));
      expect(screen.queryByText("Cannot see this")).not.toBeInTheDocument();
    });

    it("skips disabled items during keyboard navigation", async () => {
      const user = userEvent.setup();
      render(
        <WexAccordion type="single" collapsible>
          <WexAccordion.Item value="item-1">
            <WexAccordion.Trigger>First</WexAccordion.Trigger>
            <WexAccordion.Content>Content 1</WexAccordion.Content>
          </WexAccordion.Item>
          <WexAccordion.Item value="item-2" disabled>
            <WexAccordion.Trigger>Disabled</WexAccordion.Trigger>
            <WexAccordion.Content>Content 2</WexAccordion.Content>
          </WexAccordion.Item>
          <WexAccordion.Item value="item-3">
            <WexAccordion.Trigger>Third</WexAccordion.Trigger>
            <WexAccordion.Content>Content 3</WexAccordion.Content>
          </WexAccordion.Item>
        </WexAccordion>
      );

      const first = screen.getByRole("button", { name: "First" });
      first.focus();

      await user.keyboard("{ArrowDown}");
      // Should skip disabled and go to Third
      expect(screen.getByRole("button", { name: "Third" })).toHaveFocus();
    });

    it("disabled trigger has data-disabled attribute", () => {
      render(
        <WexAccordion type="single" collapsible>
          <WexAccordion.Item value="item-1" disabled>
            <WexAccordion.Trigger>Disabled</WexAccordion.Trigger>
            <WexAccordion.Content>Content</WexAccordion.Content>
          </WexAccordion.Item>
        </WexAccordion>
      );

      expect(screen.getByRole("button", { name: "Disabled" })).toHaveAttribute(
        "data-disabled"
      );
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe("Accessibility", () => {
    it("trigger has button role", () => {
      render(
        <WexAccordion type="single" collapsible>
          <WexAccordion.Item value="item-1">
            <WexAccordion.Trigger>Trigger</WexAccordion.Trigger>
            <WexAccordion.Content>Content</WexAccordion.Content>
          </WexAccordion.Item>
        </WexAccordion>
      );
      expect(screen.getByRole("button", { name: "Trigger" })).toBeInTheDocument();
    });

    it("trigger has aria-expanded attribute", async () => {
      const user = userEvent.setup();
      render(
        <WexAccordion type="single" collapsible>
          <WexAccordion.Item value="item-1">
            <WexAccordion.Trigger>Toggle</WexAccordion.Trigger>
            <WexAccordion.Content>Content</WexAccordion.Content>
          </WexAccordion.Item>
        </WexAccordion>
      );

      const trigger = screen.getByRole("button", { name: "Toggle" });
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("trigger has aria-controls pointing to content", async () => {
      const user = userEvent.setup();
      render(
        <WexAccordion type="single" collapsible>
          <WexAccordion.Item value="item-1">
            <WexAccordion.Trigger>Toggle</WexAccordion.Trigger>
            <WexAccordion.Content>Content</WexAccordion.Content>
          </WexAccordion.Item>
        </WexAccordion>
      );

      const trigger = screen.getByRole("button", { name: "Toggle" });
      expect(trigger).toHaveAttribute("aria-controls");

      await user.click(trigger);
      const contentId = trigger.getAttribute("aria-controls");
      expect(document.getElementById(contentId!)).toHaveTextContent("Content");
    });

    it("content has region role when expanded", async () => {
      const user = userEvent.setup();
      render(
        <WexAccordion type="single" collapsible>
          <WexAccordion.Item value="item-1">
            <WexAccordion.Trigger>Toggle</WexAccordion.Trigger>
            <WexAccordion.Content>Content</WexAccordion.Content>
          </WexAccordion.Item>
        </WexAccordion>
      );

      await user.click(screen.getByRole("button", { name: "Toggle" }));
      expect(screen.getByRole("region")).toBeInTheDocument();
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("handles many items", () => {
      const items = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);
      render(
        <WexAccordion type="single" collapsible>
          {items.map((item) => (
            <WexAccordion.Item key={item} value={item}>
              <WexAccordion.Trigger>{item}</WexAccordion.Trigger>
              <WexAccordion.Content>Content for {item}</WexAccordion.Content>
            </WexAccordion.Item>
          ))}
        </WexAccordion>
      );

      expect(screen.getAllByRole("button")).toHaveLength(20);
    });

    it("handles rapid toggling", async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <WexAccordion type="single" collapsible>
          <WexAccordion.Item value="item-1">
            <WexAccordion.Trigger>Toggle</WexAccordion.Trigger>
            <WexAccordion.Content>Content</WexAccordion.Content>
          </WexAccordion.Item>
        </WexAccordion>
      );

      const trigger = screen.getByRole("button", { name: "Toggle" });

      await user.click(trigger);
      await user.click(trigger);
      await user.click(trigger);

      // Should end up open (odd number of clicks)
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("works with complex content", async () => {
      const user = userEvent.setup();
      render(
        <WexAccordion type="single" collapsible>
          <WexAccordion.Item value="item-1">
            <WexAccordion.Trigger>
              <span>📋</span> Complex Trigger
            </WexAccordion.Trigger>
            <WexAccordion.Content>
              <div>
                <h3>Heading</h3>
                <p>Paragraph text</p>
                <ul>
                  <li>List item 1</li>
                  <li>List item 2</li>
                </ul>
              </div>
            </WexAccordion.Content>
          </WexAccordion.Item>
        </WexAccordion>
      );

      await user.click(screen.getByRole("button"));
      expect(screen.getByRole("heading", { name: "Heading" })).toBeInTheDocument();
      expect(screen.getByText("Paragraph text")).toBeInTheDocument();
      expect(screen.getAllByRole("listitem")).toHaveLength(2);
    });

    it("handles single item accordion", async () => {
      const user = userEvent.setup();
      render(
        <WexAccordion type="single" collapsible>
          <WexAccordion.Item value="only">
            <WexAccordion.Trigger>Only Item</WexAccordion.Trigger>
            <WexAccordion.Content>Only Content</WexAccordion.Content>
          </WexAccordion.Item>
        </WexAccordion>
      );

      await user.click(screen.getByRole("button", { name: "Only Item" }));
      expect(screen.getByText("Only Content")).toBeInTheDocument();
    });
  });
});
