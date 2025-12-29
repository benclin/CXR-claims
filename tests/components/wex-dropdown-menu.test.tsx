/**
 * WexDropdownMenu Component Tests
 *
 * Comprehensive tests covering:
 * - Rendering and composition
 * - Open/close behavior
 * - Item interactions
 * - Keyboard navigation
 * - Submenus
 * - Checkbox and radio items
 * - Accessibility
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { WexDropdownMenu, WexButton } from "@/components/wex";

describe("WexDropdownMenu", () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("renders trigger without crashing", () => {
      render(
        <WexDropdownMenu>
          <WexDropdownMenu.Trigger asChild>
            <WexButton>Open Menu</WexButton>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content>
            <WexDropdownMenu.Item>Item 1</WexDropdownMenu.Item>
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      );
      expect(screen.getByRole("button", { name: "Open Menu" })).toBeInTheDocument();
    });

    it("does not render content when closed", () => {
      render(
        <WexDropdownMenu>
          <WexDropdownMenu.Trigger asChild>
            <WexButton>Trigger</WexButton>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content>
            <WexDropdownMenu.Item>Hidden Item</WexDropdownMenu.Item>
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      );
      expect(screen.queryByText("Hidden Item")).not.toBeInTheDocument();
    });

    it("renders content when open prop is true", () => {
      render(
        <WexDropdownMenu open>
          <WexDropdownMenu.Trigger asChild>
            <WexButton>Trigger</WexButton>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content>
            <WexDropdownMenu.Item>First Item</WexDropdownMenu.Item>
            <WexDropdownMenu.Item>Second Item</WexDropdownMenu.Item>
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      );
      expect(screen.getByText("First Item")).toBeInTheDocument();
      expect(screen.getByText("Second Item")).toBeInTheDocument();
    });

    it("renders labels and separators", () => {
      render(
        <WexDropdownMenu open>
          <WexDropdownMenu.Trigger asChild>
            <WexButton>Trigger</WexButton>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content>
            <WexDropdownMenu.Label>My Account</WexDropdownMenu.Label>
            <WexDropdownMenu.Separator />
            <WexDropdownMenu.Item>Profile</WexDropdownMenu.Item>
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      );
      expect(screen.getByText("My Account")).toBeInTheDocument();
      expect(screen.getByText("Profile")).toBeInTheDocument();
    });

    it("renders shortcuts", () => {
      render(
        <WexDropdownMenu open>
          <WexDropdownMenu.Trigger asChild>
            <WexButton>Trigger</WexButton>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content>
            <WexDropdownMenu.Item>
              Save <WexDropdownMenu.Shortcut>⌘S</WexDropdownMenu.Shortcut>
            </WexDropdownMenu.Item>
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      );
      expect(screen.getByText("⌘S")).toBeInTheDocument();
    });
  });

  // ============================================
  // OPEN/CLOSE BEHAVIOR
  // ============================================
  describe("Open/Close Behavior", () => {
    it("opens when trigger is clicked", async () => {
      const user = userEvent.setup();
      render(
        <WexDropdownMenu>
          <WexDropdownMenu.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content>
            <WexDropdownMenu.Item>Item</WexDropdownMenu.Item>
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("shows menu when opened", async () => {
      const user = userEvent.setup();
      render(
        <div>
          <WexDropdownMenu>
            <WexDropdownMenu.Trigger asChild>
              <WexButton>Open</WexButton>
            </WexDropdownMenu.Trigger>
            <WexDropdownMenu.Content>
              <WexDropdownMenu.Item>Item</WexDropdownMenu.Item>
            </WexDropdownMenu.Content>
          </WexDropdownMenu>
          <button>Outside</button>
        </div>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("closes when Escape is pressed", async () => {
      const user = userEvent.setup();
      render(
        <WexDropdownMenu>
          <WexDropdownMenu.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content>
            <WexDropdownMenu.Item>Item</WexDropdownMenu.Item>
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("menu")).toBeInTheDocument();

      await user.keyboard("{Escape}");
      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      });
    });

    it("closes when item is selected", async () => {
      const user = userEvent.setup();
      render(
        <WexDropdownMenu>
          <WexDropdownMenu.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content>
            <WexDropdownMenu.Item>Select Me</WexDropdownMenu.Item>
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      await user.click(screen.getByRole("menuitem", { name: "Select Me" }));

      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      });
    });
  });

  // ============================================
  // ITEM INTERACTIONS
  // ============================================
  describe("Item Interactions", () => {
    it("calls onSelect when item is clicked", async () => {
      const user = userEvent.setup();
      const handleSelect = vi.fn();

      render(
        <WexDropdownMenu>
          <WexDropdownMenu.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content>
            <WexDropdownMenu.Item onSelect={handleSelect}>
              Clickable Item
            </WexDropdownMenu.Item>
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      await user.click(screen.getByRole("menuitem", { name: "Clickable Item" }));

      expect(handleSelect).toHaveBeenCalled();
    });

    it("disabled items cannot be selected", async () => {
      const user = userEvent.setup();
      const handleSelect = vi.fn();

      render(
        <WexDropdownMenu>
          <WexDropdownMenu.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content>
            <WexDropdownMenu.Item disabled onSelect={handleSelect}>
              Disabled Item
            </WexDropdownMenu.Item>
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      await user.click(screen.getByRole("menuitem", { name: "Disabled Item" }));

      expect(handleSelect).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // KEYBOARD NAVIGATION
  // ============================================
  describe("Keyboard Navigation", () => {
    it("opens with Enter key", async () => {
      const user = userEvent.setup();
      render(
        <WexDropdownMenu>
          <WexDropdownMenu.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content>
            <WexDropdownMenu.Item>Item</WexDropdownMenu.Item>
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      );

      const trigger = screen.getByRole("button", { name: "Open" });
      trigger.focus();
      await user.keyboard("{Enter}");

      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("opens with Space key", async () => {
      const user = userEvent.setup();
      render(
        <WexDropdownMenu>
          <WexDropdownMenu.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content>
            <WexDropdownMenu.Item>Item</WexDropdownMenu.Item>
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      );

      const trigger = screen.getByRole("button", { name: "Open" });
      trigger.focus();
      await user.keyboard(" ");

      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("opens with ArrowDown key", async () => {
      const user = userEvent.setup();
      render(
        <WexDropdownMenu>
          <WexDropdownMenu.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content>
            <WexDropdownMenu.Item>Item</WexDropdownMenu.Item>
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      );

      const trigger = screen.getByRole("button", { name: "Open" });
      trigger.focus();
      await user.keyboard("{ArrowDown}");

      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("navigates items with ArrowDown", async () => {
      const user = userEvent.setup();
      render(
        <WexDropdownMenu>
          <WexDropdownMenu.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content>
            <WexDropdownMenu.Item>Item 1</WexDropdownMenu.Item>
            <WexDropdownMenu.Item>Item 2</WexDropdownMenu.Item>
            <WexDropdownMenu.Item>Item 3</WexDropdownMenu.Item>
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");

      // Check that items can be navigated
      const items = screen.getAllByRole("menuitem");
      expect(items.some((item) => item.getAttribute("data-highlighted") !== null)).toBe(
        true
      );
    });

    it("navigates items with ArrowUp", async () => {
      const user = userEvent.setup();
      render(
        <WexDropdownMenu>
          <WexDropdownMenu.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content>
            <WexDropdownMenu.Item>Item 1</WexDropdownMenu.Item>
            <WexDropdownMenu.Item>Item 2</WexDropdownMenu.Item>
            <WexDropdownMenu.Item>Item 3</WexDropdownMenu.Item>
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      await user.keyboard("{ArrowUp}");

      const items = screen.getAllByRole("menuitem");
      expect(items.some((item) => item.getAttribute("data-highlighted") !== null)).toBe(
        true
      );
    });

    it("selects item with Enter", async () => {
      const user = userEvent.setup();
      const handleSelect = vi.fn();

      render(
        <WexDropdownMenu>
          <WexDropdownMenu.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content>
            <WexDropdownMenu.Item onSelect={handleSelect}>Item</WexDropdownMenu.Item>
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Enter}");

      expect(handleSelect).toHaveBeenCalled();
    });

    it("skips disabled items during navigation", async () => {
      const user = userEvent.setup();
      render(
        <WexDropdownMenu>
          <WexDropdownMenu.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content>
            <WexDropdownMenu.Item>Item 1</WexDropdownMenu.Item>
            <WexDropdownMenu.Item disabled>Disabled</WexDropdownMenu.Item>
            <WexDropdownMenu.Item>Item 3</WexDropdownMenu.Item>
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");

      // Disabled item should be skipped
      const item3 = screen.getByRole("menuitem", { name: "Item 3" });
      expect(item3).toHaveAttribute("data-highlighted");
    });
  });

  // ============================================
  // CHECKBOX ITEMS
  // ============================================
  describe("Checkbox Items", () => {
    it("toggles checkbox items", async () => {
      const user = userEvent.setup();
      const CheckboxMenu = () => {
        const [checked, setChecked] = useState(false);
        return (
          <WexDropdownMenu>
            <WexDropdownMenu.Trigger asChild>
              <WexButton>Open</WexButton>
            </WexDropdownMenu.Trigger>
            <WexDropdownMenu.Content>
              <WexDropdownMenu.CheckboxItem
                checked={checked}
                onCheckedChange={setChecked}
              >
                Show Toolbar
              </WexDropdownMenu.CheckboxItem>
            </WexDropdownMenu.Content>
          </WexDropdownMenu>
        );
      };

      render(<CheckboxMenu />);

      await user.click(screen.getByRole("button", { name: "Open" }));
      const checkbox = screen.getByRole("menuitemcheckbox", { name: "Show Toolbar" });
      expect(checkbox).toHaveAttribute("aria-checked", "false");

      await user.click(checkbox);

      // Reopen menu to verify state
      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(
        screen.getByRole("menuitemcheckbox", { name: "Show Toolbar" })
      ).toHaveAttribute("aria-checked", "true");
    });
  });

  // ============================================
  // RADIO ITEMS
  // ============================================
  describe("Radio Items", () => {
    it("selects radio items", async () => {
      const user = userEvent.setup();
      const RadioMenu = () => {
        const [value, setValue] = useState("small");
        return (
          <WexDropdownMenu>
            <WexDropdownMenu.Trigger asChild>
              <WexButton>Open</WexButton>
            </WexDropdownMenu.Trigger>
            <WexDropdownMenu.Content>
              <WexDropdownMenu.RadioGroup value={value} onValueChange={setValue}>
                <WexDropdownMenu.RadioItem value="small">Small</WexDropdownMenu.RadioItem>
                <WexDropdownMenu.RadioItem value="medium">Medium</WexDropdownMenu.RadioItem>
                <WexDropdownMenu.RadioItem value="large">Large</WexDropdownMenu.RadioItem>
              </WexDropdownMenu.RadioGroup>
            </WexDropdownMenu.Content>
          </WexDropdownMenu>
        );
      };

      render(<RadioMenu />);

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("menuitemradio", { name: "Small" })).toHaveAttribute(
        "aria-checked",
        "true"
      );

      await user.click(screen.getByRole("menuitemradio", { name: "Large" }));

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("menuitemradio", { name: "Large" })).toHaveAttribute(
        "aria-checked",
        "true"
      );
      expect(screen.getByRole("menuitemradio", { name: "Small" })).toHaveAttribute(
        "aria-checked",
        "false"
      );
    });
  });

  // ============================================
  // SUBMENUS
  // ============================================
  describe("Submenus", () => {
    it("renders submenus", async () => {
      const user = userEvent.setup();
      render(
        <WexDropdownMenu>
          <WexDropdownMenu.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content>
            <WexDropdownMenu.Sub>
              <WexDropdownMenu.SubTrigger>More Options</WexDropdownMenu.SubTrigger>
              <WexDropdownMenu.SubContent>
                <WexDropdownMenu.Item>Sub Item 1</WexDropdownMenu.Item>
                <WexDropdownMenu.Item>Sub Item 2</WexDropdownMenu.Item>
              </WexDropdownMenu.SubContent>
            </WexDropdownMenu.Sub>
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByText("More Options")).toBeInTheDocument();
    });

    it("opens submenu on hover", async () => {
      const user = userEvent.setup();
      render(
        <WexDropdownMenu>
          <WexDropdownMenu.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content>
            <WexDropdownMenu.Sub>
              <WexDropdownMenu.SubTrigger>More Options</WexDropdownMenu.SubTrigger>
              <WexDropdownMenu.SubContent>
                <WexDropdownMenu.Item>Sub Item 1</WexDropdownMenu.Item>
              </WexDropdownMenu.SubContent>
            </WexDropdownMenu.Sub>
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      await user.hover(screen.getByText("More Options"));

      await waitFor(() => {
        expect(screen.getByText("Sub Item 1")).toBeInTheDocument();
      });
    });

    it("opens submenu with ArrowRight", async () => {
      const user = userEvent.setup();
      render(
        <WexDropdownMenu>
          <WexDropdownMenu.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content>
            <WexDropdownMenu.Sub>
              <WexDropdownMenu.SubTrigger>More Options</WexDropdownMenu.SubTrigger>
              <WexDropdownMenu.SubContent>
                <WexDropdownMenu.Item>Sub Item 1</WexDropdownMenu.Item>
              </WexDropdownMenu.SubContent>
            </WexDropdownMenu.Sub>
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowRight}");

      await waitFor(() => {
        expect(screen.getByText("Sub Item 1")).toBeInTheDocument();
      });
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe("Accessibility", () => {
    it("has menu role on content", async () => {
      const user = userEvent.setup();
      render(
        <WexDropdownMenu>
          <WexDropdownMenu.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content>
            <WexDropdownMenu.Item>Item</WexDropdownMenu.Item>
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("has menuitem role on items", async () => {
      const user = userEvent.setup();
      render(
        <WexDropdownMenu>
          <WexDropdownMenu.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content>
            <WexDropdownMenu.Item>Item 1</WexDropdownMenu.Item>
            <WexDropdownMenu.Item>Item 2</WexDropdownMenu.Item>
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getAllByRole("menuitem")).toHaveLength(2);
    });

    it("trigger has aria-haspopup", () => {
      render(
        <WexDropdownMenu>
          <WexDropdownMenu.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content>
            <WexDropdownMenu.Item>Item</WexDropdownMenu.Item>
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      );

      expect(screen.getByRole("button", { name: "Open" })).toHaveAttribute(
        "aria-haspopup",
        "menu"
      );
    });

    it("trigger has aria-expanded", async () => {
      const user = userEvent.setup();
      render(
        <WexDropdownMenu>
          <WexDropdownMenu.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content>
            <WexDropdownMenu.Item>Item</WexDropdownMenu.Item>
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      );

      const trigger = screen.getByRole("button", { name: "Open" });
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("disabled items have aria-disabled", async () => {
      const user = userEvent.setup();
      render(
        <WexDropdownMenu>
          <WexDropdownMenu.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content>
            <WexDropdownMenu.Item disabled>Disabled</WexDropdownMenu.Item>
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("menuitem", { name: "Disabled" })).toHaveAttribute(
        "aria-disabled",
        "true"
      );
    });
  });

  // ============================================
  // CONTROLLED MODE
  // ============================================
  describe("Controlled Mode", () => {
    it("supports controlled open state", async () => {
      const user = userEvent.setup();
      const ControlledMenu = () => {
        const [open, setOpen] = useState(false);
        return (
          <>
            <span data-testid="state">{open ? "open" : "closed"}</span>
            <WexDropdownMenu open={open} onOpenChange={setOpen}>
              <WexDropdownMenu.Trigger asChild>
                <WexButton>Open</WexButton>
              </WexDropdownMenu.Trigger>
              <WexDropdownMenu.Content>
                <WexDropdownMenu.Item>Item</WexDropdownMenu.Item>
              </WexDropdownMenu.Content>
            </WexDropdownMenu>
          </>
        );
      };

      render(<ControlledMenu />);
      expect(screen.getByTestId("state")).toHaveTextContent("closed");

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByTestId("state")).toHaveTextContent("open");
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("handles many items", async () => {
      const user = userEvent.setup();
      const items = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);

      render(
        <WexDropdownMenu>
          <WexDropdownMenu.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content>
            {items.map((item) => (
              <WexDropdownMenu.Item key={item}>{item}</WexDropdownMenu.Item>
            ))}
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getAllByRole("menuitem")).toHaveLength(20);
    });

    it("handles rapid open/close", async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <WexDropdownMenu>
          <WexDropdownMenu.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content>
            <WexDropdownMenu.Item>Item</WexDropdownMenu.Item>
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      );

      const trigger = screen.getByRole("button", { name: "Open" });

      await user.click(trigger);
      await user.keyboard("{Escape}");
      await user.click(trigger);
      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      });
    });

    it("works with single item", async () => {
      const user = userEvent.setup();
      render(
        <WexDropdownMenu>
          <WexDropdownMenu.Trigger asChild>
            <WexButton>Open</WexButton>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content>
            <WexDropdownMenu.Item>Only Item</WexDropdownMenu.Item>
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("menuitem", { name: "Only Item" })).toBeInTheDocument();
    });
  });
});
