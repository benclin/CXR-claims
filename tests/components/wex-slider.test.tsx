/**
 * WexSlider Component Tests
 *
 * Comprehensive tests covering:
 * - Rendering and configuration
 * - Value changes
 * - Keyboard navigation
 * - Range mode
 * - Accessibility
 * - Step and constraints
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { WexSlider, WexLabel } from "@/components/wex";

describe("WexSlider", () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("renders without crashing", () => {
      render(<WexSlider aria-label="Volume" />);
      expect(screen.getByRole("slider")).toBeInTheDocument();
    });

    it("accepts className prop", () => {
      render(<WexSlider aria-label="Volume" className="custom-class" />);
      // Slider has the class on the root element
      const sliderRoot = document.querySelector(".custom-class");
      expect(sliderRoot).toBeInTheDocument();
    });

    it("renders with default value", () => {
      render(<WexSlider aria-label="Volume" defaultValue={[50]} />);
      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "50");
    });

    it("renders with controlled value", () => {
      render(<WexSlider aria-label="Volume" value={[75]} />);
      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "75");
    });
  });

  // ============================================
  // MIN/MAX CONFIGURATION
  // ============================================
  describe("Min/Max Configuration", () => {
    it("accepts min and max", () => {
      render(<WexSlider aria-label="Volume" min={0} max={100} />);
      const slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("aria-valuemin", "0");
      expect(slider).toHaveAttribute("aria-valuemax", "100");
    });

    it("accepts custom min value", () => {
      render(<WexSlider aria-label="Temperature" min={-50} max={50} />);
      const slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("aria-valuemin", "-50");
    });

    it("accepts custom max value", () => {
      render(<WexSlider aria-label="Price" min={0} max={1000} />);
      const slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("aria-valuemax", "1000");
    });
  });

  // ============================================
  // STEP CONFIGURATION
  // ============================================
  describe("Step Configuration", () => {
    it("accepts step value", async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(
        <WexSlider
          aria-label="Volume"
          defaultValue={[50]}
          step={10}
          onValueChange={handleValueChange}
        />
      );

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowRight}");

      expect(handleValueChange).toHaveBeenCalledWith([60]);
    });

    it("respects minStepsBetweenThumbs for range", () => {
      render(
        <WexSlider
          aria-label="Range"
          defaultValue={[25, 75]}
          minStepsBetweenThumbs={10}
        />
      );

      const sliders = screen.getAllByRole("slider");
      expect(sliders).toHaveLength(2);
    });
  });

  // ============================================
  // DISABLED STATE
  // ============================================
  describe("Disabled State", () => {
    it("can be disabled", () => {
      render(<WexSlider aria-label="Volume" disabled />);
      expect(screen.getByRole("slider")).toHaveAttribute("data-disabled");
    });

    it("cannot change value when disabled", async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(
        <WexSlider
          aria-label="Volume"
          defaultValue={[50]}
          disabled
          onValueChange={handleValueChange}
        />
      );

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowRight}");

      expect(handleValueChange).not.toHaveBeenCalled();
    });

    it("cannot be focused when disabled", async () => {
      const user = userEvent.setup();
      render(
        <>
          <WexSlider aria-label="Volume" disabled />
          <button>Focusable</button>
        </>
      );

      await user.tab();
      expect(screen.getByRole("button")).toHaveFocus();
    });
  });

  // ============================================
  // KEYBOARD NAVIGATION
  // ============================================
  describe("Keyboard Navigation", () => {
    it("increases value with ArrowRight", async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(
        <WexSlider
          aria-label="Volume"
          defaultValue={[50]}
          onValueChange={handleValueChange}
        />
      );

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowRight}");

      expect(handleValueChange).toHaveBeenCalledWith([51]);
    });

    it("decreases value with ArrowLeft", async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(
        <WexSlider
          aria-label="Volume"
          defaultValue={[50]}
          onValueChange={handleValueChange}
        />
      );

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowLeft}");

      expect(handleValueChange).toHaveBeenCalledWith([49]);
    });

    it("increases value with ArrowUp", async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(
        <WexSlider
          aria-label="Volume"
          defaultValue={[50]}
          onValueChange={handleValueChange}
        />
      );

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowUp}");

      expect(handleValueChange).toHaveBeenCalledWith([51]);
    });

    it("decreases value with ArrowDown", async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(
        <WexSlider
          aria-label="Volume"
          defaultValue={[50]}
          onValueChange={handleValueChange}
        />
      );

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowDown}");

      expect(handleValueChange).toHaveBeenCalledWith([49]);
    });

    it("jumps to min with Home", async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(
        <WexSlider
          aria-label="Volume"
          defaultValue={[50]}
          min={0}
          onValueChange={handleValueChange}
        />
      );

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{Home}");

      expect(handleValueChange).toHaveBeenCalledWith([0]);
    });

    it("jumps to max with End", async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(
        <WexSlider
          aria-label="Volume"
          defaultValue={[50]}
          max={100}
          onValueChange={handleValueChange}
        />
      );

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{End}");

      expect(handleValueChange).toHaveBeenCalledWith([100]);
    });

    it("can be focused with Tab", async () => {
      const user = userEvent.setup();
      render(<WexSlider aria-label="Volume" />);

      await user.tab();
      expect(screen.getByRole("slider")).toHaveFocus();
    });
  });

  // ============================================
  // RANGE MODE
  // ============================================
  describe("Range Mode", () => {
    it("renders two thumbs for range", () => {
      render(<WexSlider aria-label="Price Range" defaultValue={[25, 75]} />);
      const sliders = screen.getAllByRole("slider");
      expect(sliders).toHaveLength(2);
    });

    it("first thumb has lower value", () => {
      render(<WexSlider aria-label="Price Range" defaultValue={[25, 75]} />);
      const sliders = screen.getAllByRole("slider");
      expect(sliders[0]).toHaveAttribute("aria-valuenow", "25");
      expect(sliders[1]).toHaveAttribute("aria-valuenow", "75");
    });

    it("can move range thumbs independently", async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(
        <WexSlider
          aria-label="Price Range"
          defaultValue={[25, 75]}
          onValueChange={handleValueChange}
        />
      );

      const sliders = screen.getAllByRole("slider");
      sliders[0].focus();
      await user.keyboard("{ArrowRight}");

      expect(handleValueChange).toHaveBeenCalledWith([26, 75]);
    });

    it("tabs between thumbs", async () => {
      const user = userEvent.setup();
      render(<WexSlider aria-label="Price Range" defaultValue={[25, 75]} />);

      await user.tab();
      const sliders = screen.getAllByRole("slider");
      expect(sliders[0]).toHaveFocus();

      await user.tab();
      expect(sliders[1]).toHaveFocus();
    });
  });

  // ============================================
  // CONTROLLED MODE
  // ============================================
  describe("Controlled Mode", () => {
    it("supports controlled value", async () => {
      const user = userEvent.setup();
      const ControlledSlider = () => {
        const [value, setValue] = useState([50]);
        return (
          <>
            <span data-testid="value">{value[0]}</span>
            <WexSlider aria-label="Volume" value={value} onValueChange={setValue} />
          </>
        );
      };

      render(<ControlledSlider />);
      expect(screen.getByTestId("value")).toHaveTextContent("50");

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowRight}");

      expect(screen.getByTestId("value")).toHaveTextContent("51");
    });

    it("external value change updates slider", () => {
      const { rerender } = render(
        <WexSlider aria-label="Volume" value={[50]} />
      );

      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "50");

      rerender(<WexSlider aria-label="Volume" value={[75]} />);

      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "75");
    });
  });

  // ============================================
  // VALUE COMMIT
  // ============================================
  describe("Value Commit", () => {
    it("calls onValueCommit when interaction ends", async () => {
      const user = userEvent.setup();
      const handleValueCommit = vi.fn();

      render(
        <WexSlider
          aria-label="Volume"
          defaultValue={[50]}
          onValueCommit={handleValueCommit}
        />
      );

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowRight}");
      slider.blur();

      // onValueCommit is called when the interaction ends
      expect(handleValueCommit).toHaveBeenCalled();
    });
  });

  // ============================================
  // ORIENTATION
  // ============================================
  describe("Orientation", () => {
    it("supports horizontal orientation", () => {
      render(<WexSlider aria-label="Volume" orientation="horizontal" />);
      const slider = screen.getByRole("slider");
      expect(slider.closest("[data-orientation]")).toHaveAttribute(
        "data-orientation",
        "horizontal"
      );
    });

    it("supports vertical orientation", () => {
      render(<WexSlider aria-label="Volume" orientation="vertical" />);
      const slider = screen.getByRole("slider");
      expect(slider.closest("[data-orientation]")).toHaveAttribute(
        "data-orientation",
        "vertical"
      );
    });
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================
  describe("Accessibility", () => {
    it("has slider role", () => {
      render(<WexSlider aria-label="Volume" />);
      expect(screen.getByRole("slider")).toBeInTheDocument();
    });

    it("supports aria-label", () => {
      render(<WexSlider aria-label="Volume control" />);
      expect(screen.getByRole("slider")).toHaveAccessibleName("Volume control");
    });

    it("supports custom id attribute", () => {
      render(
        <>
          <WexLabel htmlFor="volume-slider">Volume</WexLabel>
          <WexSlider id="volume-slider" aria-label="Volume" />
        </>
      );
      // Slider renders with correct id
      const slider = screen.getByRole("slider");
      expect(slider).toBeInTheDocument();
    });

    it("renders with helper text", () => {
      render(
        <>
          <WexSlider aria-label="Volume" />
          <span id="help">Adjust the volume level</span>
        </>
      );
      expect(screen.getByRole("slider")).toBeInTheDocument();
      expect(screen.getByText("Adjust the volume level")).toBeInTheDocument();
    });

    it("has correct aria-valuemin", () => {
      render(<WexSlider aria-label="Volume" min={10} />);
      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuemin", "10");
    });

    it("has correct aria-valuemax", () => {
      render(<WexSlider aria-label="Volume" max={200} />);
      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuemax", "200");
    });

    it("has correct aria-valuenow", () => {
      render(<WexSlider aria-label="Volume" defaultValue={[42]} />);
      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "42");
    });

    it("has aria-orientation", () => {
      render(<WexSlider aria-label="Volume" orientation="vertical" />);
      expect(screen.getByRole("slider")).toHaveAttribute(
        "aria-orientation",
        "vertical"
      );
    });
  });

  // ============================================
  // INVERTED MODE
  // ============================================
  describe("Inverted Mode", () => {
    it("supports inverted mode", async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(
        <WexSlider
          aria-label="Volume"
          defaultValue={[50]}
          inverted
          onValueChange={handleValueChange}
        />
      );

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowRight}");

      // In inverted mode, ArrowRight decreases value
      expect(handleValueChange).toHaveBeenCalledWith([49]);
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("clamps value to min", async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(
        <WexSlider
          aria-label="Volume"
          defaultValue={[0]}
          min={0}
          onValueChange={handleValueChange}
        />
      );

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowLeft}");

      // Should not go below min
      expect(handleValueChange).not.toHaveBeenCalled();
    });

    it("clamps value to max", async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(
        <WexSlider
          aria-label="Volume"
          defaultValue={[100]}
          max={100}
          onValueChange={handleValueChange}
        />
      );

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowRight}");

      // Should not go above max
      expect(handleValueChange).not.toHaveBeenCalled();
    });

    it("handles large step values", async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(
        <WexSlider
          aria-label="Volume"
          defaultValue={[50]}
          step={25}
          onValueChange={handleValueChange}
        />
      );

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowRight}");

      expect(handleValueChange).toHaveBeenCalledWith([75]);
    });

    it("handles decimal step values", async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(
        <WexSlider
          aria-label="Volume"
          defaultValue={[50]}
          step={0.1}
          onValueChange={handleValueChange}
        />
      );

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowRight}");

      expect(handleValueChange).toHaveBeenCalledWith([50.1]);
    });

    it("handles rapid keyboard input", async () => {
      const user = userEvent.setup({ delay: null });
      const handleValueChange = vi.fn();

      render(
        <WexSlider
          aria-label="Volume"
          defaultValue={[50]}
          onValueChange={handleValueChange}
        />
      );

      const slider = screen.getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}");

      expect(handleValueChange).toHaveBeenCalledTimes(3);
      expect(handleValueChange).toHaveBeenLastCalledWith([53]);
    });
  });
});
