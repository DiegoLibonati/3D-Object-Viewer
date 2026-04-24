import { screen } from "@testing-library/dom";

import type { ControlProps } from "@/types/props";
import type { ControlComponent } from "@/types/components";

import Control from "@/components/Control/Control";

const defaultProps: ControlProps = {
  srcImg: "/images/arrow.png",
  label: "Left",
  className: "control--left",
};

const renderComponent = (
  props: Partial<ControlProps> = {}
): ControlComponent => {
  const element = Control({ ...defaultProps, ...props });
  document.body.appendChild(element);
  return element;
};

describe("Control", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("rendering", () => {
    it("should render a div element", () => {
      const element = renderComponent();
      expect(element.tagName).toBe("DIV");
    });

    it("should apply the base control class", () => {
      const element = renderComponent();
      expect(element).toHaveClass("control");
    });

    it("should apply the provided custom className", () => {
      const element = renderComponent({ className: "control--right" });
      expect(element).toHaveClass("control--right");
    });

    it("should render the label text as an h2 heading", () => {
      renderComponent({ label: "Right" });
      expect(
        screen.getByRole("heading", { level: 2, name: "Right" })
      ).toBeInTheDocument();
    });

    it("should render an image with the alt attribute matching the label", () => {
      renderComponent({ label: "Left" });
      expect(screen.getByRole("img", { name: "Left" })).toBeInTheDocument();
    });

    it("should render an image with the provided srcImg", () => {
      renderComponent({ srcImg: "/images/arrow.png", label: "Left" });
      const img = screen.getByRole("img", { name: "Left" });
      expect(img).toHaveAttribute("src", "/images/arrow.png");
    });

    it("should set the image id to the lowercase version of the label", () => {
      renderComponent({ label: "Left" });
      expect(
        document.querySelector<HTMLImageElement>("#left")
      ).toBeInTheDocument();
    });

    it("should derive the id from an uppercase label correctly", () => {
      renderComponent({ label: "Right" });
      expect(
        document.querySelector<HTMLImageElement>("#right")
      ).toBeInTheDocument();
    });
  });

  describe("className", () => {
    it("should include only the base control class when className is not provided", () => {
      const element = Control({ srcImg: "/images/arrow.png", label: "Test" });
      document.body.appendChild(element);
      expect(element).toHaveClass("control");
      expect(element).not.toHaveClass("control--left");
      expect(element).not.toHaveClass("control--right");
    });

    it("should include both base and custom class when className is provided", () => {
      const element = renderComponent({ className: "control--left" });
      expect(element).toHaveClass("control");
      expect(element).toHaveClass("control--left");
    });
  });
});
