import { screen } from "@testing-library/dom";

import type { ControlProps } from "@/types/props";
import type { ControlComponent } from "@/types/components";

import { Control } from "@/components/Control/Control";

const renderComponent = (props: ControlProps): ControlComponent => {
  const container = Control(props);
  document.body.appendChild(container);
  return container;
};

describe("Control Component", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  const defaultProps: ControlProps = {
    srcImg: "/images/test.png",
    label: "Test Control",
  };

  it("should render the control component with correct structure", () => {
    renderComponent(defaultProps);

    const control = document.querySelector<HTMLDivElement>(".control");
    expect(control).toBeInTheDocument();
  });

  it("should render the label correctly", () => {
    renderComponent(defaultProps);

    const label = screen.getByRole("heading", { name: "Test Control" });
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass("control__label");
  });

  it("should render the image with correct attributes", () => {
    renderComponent(defaultProps);

    const image = screen.getByAltText("Test Control");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/images/test.png");
    expect(image).toHaveAttribute("id", "test");
    expect(image).toHaveClass("control__image");
  });

  it("should apply additional className when provided", () => {
    const propsWithClass: ControlProps = {
      ...defaultProps,
      className: "custom-class",
    };

    renderComponent(propsWithClass);

    const control = document.querySelector<HTMLDivElement>(".control");
    expect(control).toHaveClass("control");
    expect(control).toHaveClass("custom-class");
  });

  it("should not add extra className when not provided", () => {
    renderComponent(defaultProps);

    const control = document.querySelector<HTMLDivElement>(".control");
    expect(control).toHaveClass("control");
    expect(control?.className.trim()).toBe("control");
  });
});
