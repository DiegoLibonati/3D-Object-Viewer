import { screen } from "@testing-library/dom";

import { ControlProps } from "@src/entities/props";

import { Control } from "@src/components/Control/Control";

type RenderComponent = {
  container: HTMLDivElement;
  props: ControlProps;
};

const renderComponent = (props: ControlProps): RenderComponent => {
  const container = Control(props);
  document.body.appendChild(container);
  return { container: container, props: props };
};

describe("Control.ts", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("General Tests.", () => {
    test("It should render the component structure", () => {
      const props: ControlProps = {
        srcImg: "/test-image.png",
        label: "Test Control",
      };

      const { container } = renderComponent(props);

      expect(container).toBeInstanceOf(HTMLDivElement);
      expect(container.className).toContain("control");
    });

    test("It should return HTMLDivElement", () => {
      const props: ControlProps = {
        srcImg: "/image.png",
        label: "Control",
      };

      const { container } = renderComponent(props);

      expect(container.tagName).toBe("DIV");
    });

    test("It should render all required elements", () => {
      const props: ControlProps = {
        srcImg: "/test.png",
        label: "My Control",
      };

      renderComponent(props);

      const label = screen.getByText("My Control");
      const image = screen.getByAltText("My Control");

      expect(label).toBeInTheDocument();
      expect(image).toBeInTheDocument();
    });

    test("It should have correct CSS classes", () => {
      const props: ControlProps = {
        srcImg: "/test.png",
        label: "Test",
      };

      renderComponent(props);

      const label =
        document.querySelector<HTMLHeadingElement>(".control__label");
      const image = document.querySelector<HTMLImageElement>(".control__image");

      expect(label).toBeInTheDocument();
      expect(image).toBeInTheDocument();
    });
  });

  describe("Props Rendering Tests.", () => {
    test("It should display correct label text", () => {
      const props: ControlProps = {
        srcImg: "/image.png",
        label: "Jump Button",
      };

      renderComponent(props);

      const label = screen.getByText("Jump Button");

      expect(label).toBeInTheDocument();
      expect(label.textContent).toBe("Jump Button");
    });

    test("It should render image with correct src", () => {
      const props: ControlProps = {
        srcImg: "/controls/jump.png",
        label: "Jump",
      };

      renderComponent(props);

      const image = screen.getByAltText("Jump") as HTMLImageElement;

      expect(image.src).toContain("/controls/jump.png");
    });

    test("It should use label as alt text for image", () => {
      const props: ControlProps = {
        srcImg: "/image.png",
        label: "Left Arrow",
      };

      renderComponent(props);

      const image = screen.getByAltText("Left Arrow");

      expect(image).toHaveAttribute("alt", "Left Arrow");
    });

    test("It should render label as h2 element", () => {
      const props: ControlProps = {
        srcImg: "/image.png",
        label: "Control Label",
      };

      renderComponent(props);

      const label =
        document.querySelector<HTMLHeadingElement>(".control__label");

      expect(label).toBeInstanceOf(HTMLHeadingElement);
      expect(label!.tagName).toBe("H2");
    });
  });

  describe("Image ID Tests.", () => {
    test("It should set image id from lowercase label", () => {
      const props: ControlProps = {
        srcImg: "/image.png",
        label: "Jump",
      };

      renderComponent(props);

      const image = document.querySelector<HTMLImageElement>("#jump");

      expect(image).toBeInTheDocument();
    });

    test("It should handle labels with mixed case", () => {
      const props: ControlProps = {
        srcImg: "/image.png",
        label: "UpArrow",
      };

      renderComponent(props);

      const image = document.querySelector<HTMLImageElement>("#uparrow");

      expect(image).toBeInTheDocument();
    });
  });

  describe("ClassName Tests.", () => {
    test("It should have base control class without additional className", () => {
      const props: ControlProps = {
        srcImg: "/image.png",
        label: "Test",
      };

      const { container } = renderComponent(props);

      expect(container).toHaveClass("control");
    });

    test("It should append additional className when provided", () => {
      const props: ControlProps = {
        srcImg: "/image.png",
        label: "Test",
        className: "custom-class",
      };

      const { container } = renderComponent(props);

      expect(container).toHaveClass("control");
      expect(container).toHaveClass("custom-class");
    });

    test("It should handle multiple additional classes", () => {
      const props: ControlProps = {
        srcImg: "/image.png",
        label: "Test",
        className: "class-one class-two",
      };

      const { container } = renderComponent(props);

      expect(container).toHaveClass("control");
      expect(container).toHaveClass("class-one");
      expect(container).toHaveClass("class-two");
    });

    test("It should handle undefined className", () => {
      const props: ControlProps = {
        srcImg: "/image.png",
        label: "Test",
        className: undefined,
      };

      const { container } = renderComponent(props);

      expect(container).toHaveClass("control");
      expect(container.className).toContain("control");
    });

    test("It should use nullish coalescing for className", () => {
      const props: ControlProps = {
        srcImg: "/image.png",
        label: "Test",
      };

      const { container } = renderComponent(props);

      expect(container.className).toContain("control");
    });

    test("It should handle empty string className", () => {
      const props: ControlProps = {
        srcImg: "/image.png",
        label: "Test",
        className: "",
      };

      const { container } = renderComponent(props);

      expect(container).toHaveClass("control");
    });
  });

  describe("Image Source Tests.", () => {
    test("It should handle relative image paths", () => {
      const props: ControlProps = {
        srcImg: "./images/control.png",
        label: "Control",
      };

      renderComponent(props);

      const image = screen.getByAltText("Control") as HTMLImageElement;

      expect(image.src).toContain("images/control.png");
    });

    test("It should handle absolute image paths", () => {
      const props: ControlProps = {
        srcImg: "/assets/controls/arrow.png",
        label: "Arrow",
      };

      renderComponent(props);

      const image = screen.getByAltText("Arrow") as HTMLImageElement;

      expect(image.src).toContain("/assets/controls/arrow.png");
    });

    test("It should handle external image URLs", () => {
      const props: ControlProps = {
        srcImg: "https://example.com/control.png",
        label: "External",
      };

      renderComponent(props);

      const image = screen.getByAltText("External") as HTMLImageElement;

      expect(image.src).toBe("https://example.com/control.png");
    });

    test("It should handle different image formats", () => {
      const formats = ["jpg", "png", "gif", "svg"];

      formats.forEach((format) => {
        document.body.innerHTML = "";

        const props: ControlProps = {
          srcImg: `/image.${format}`,
          label: `${format.toUpperCase()} Image`,
        };

        renderComponent(props);

        const image = screen.getByAltText(
          `${format.toUpperCase()} Image`
        ) as HTMLImageElement;

        expect(image.src).toContain(`.${format}`);
      });
    });
  });

  describe("Multiple Controls Tests.", () => {
    test("It should render multiple controls independently", () => {
      const props1: ControlProps = {
        srcImg: "/left.png",
        label: "Left",
      };

      const props2: ControlProps = {
        srcImg: "/right.png",
        label: "Right",
      };

      renderComponent(props1);
      renderComponent(props2);

      const leftLabel = screen.getByText("Left");
      const rightLabel = screen.getByText("Right");
      const allControls = document.querySelectorAll<HTMLDivElement>(".control");

      expect(leftLabel).toBeInTheDocument();
      expect(rightLabel).toBeInTheDocument();
      expect(allControls.length).toBe(2);
    });

    test("It should maintain separate content for each control", () => {
      const props1: ControlProps = {
        srcImg: "/image1.png",
        label: "Control A",
      };

      const props2: ControlProps = {
        srcImg: "/image2.png",
        label: "Control B",
      };

      const { container: control1 } = renderComponent(props1);
      const { container: control2 } = renderComponent(props2);

      const label1 =
        control1.querySelector<HTMLHeadingElement>(".control__label");
      const label2 =
        control2.querySelector<HTMLHeadingElement>(".control__label");
      const image1 = control1.querySelector<HTMLImageElement>("img");
      const image2 = control2.querySelector<HTMLImageElement>("img");

      expect(label1?.textContent).toBe("Control A");
      expect(label2?.textContent).toBe("Control B");
      expect(image1!.src).toContain("image1.png");
      expect(image2!.src).toContain("image2.png");
    });

    test("It should have unique ids for each control image", () => {
      const props1: ControlProps = {
        srcImg: "/image.png",
        label: "First",
      };

      const props2: ControlProps = {
        srcImg: "/image.png",
        label: "Second",
      };

      renderComponent(props1);
      renderComponent(props2);

      const image1 = document.querySelector<HTMLImageElement>("#first");
      const image2 = document.querySelector<HTMLImageElement>("#second");

      expect(image1).toBeInTheDocument();
      expect(image2).toBeInTheDocument();
      expect(image1?.id).not.toBe(image2?.id);
    });
  });

  describe("Edge Cases Tests.", () => {
    test("It should handle empty label", () => {
      const props: ControlProps = {
        srcImg: "/image.png",
        label: "",
      };

      renderComponent(props);

      const label =
        document.querySelector<HTMLHeadingElement>(".control__label");

      expect(label).toBeInTheDocument();
      expect(label?.textContent).toBe("");
    });

    test("It should handle special characters in label", () => {
      const props: ControlProps = {
        srcImg: "/image.png",
        label: "Control & Button <test>",
      };

      renderComponent(props);

      const label =
        document.querySelector<HTMLHeadingElement>(".control__label");

      expect(label?.textContent).toContain("Control & Button");
    });

    test("It should handle empty srcImg", () => {
      const props: ControlProps = {
        srcImg: "",
        label: "Empty Source",
      };

      renderComponent(props);

      const image = screen.getByAltText("Empty Source") as HTMLImageElement;

      expect(image).toBeInTheDocument();
    });
  });

  describe("DOM Structure Tests.", () => {
    test("It should have correct structure", () => {
      const props: ControlProps = {
        srcImg: "/image.png",
        label: "Test",
      };

      const { container } = renderComponent(props);

      const label =
        container.querySelector<HTMLHeadingElement>(".control__label");
      const image =
        container.querySelector<HTMLImageElement>(".control__image");

      expect(label).toBeInTheDocument();
      expect(image).toBeInTheDocument();
    });

    test("It should nest label and image inside control div", () => {
      const props: ControlProps = {
        srcImg: "/image.png",
        label: "Test",
      };

      const { container } = renderComponent(props);

      expect(
        container.querySelector<HTMLHeadingElement>(".control__label")
      ).toBeInTheDocument();
      expect(
        container.querySelector<HTMLImageElement>(".control__image")
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility Tests.", () => {
    test("It should have alt text on image", () => {
      const props: ControlProps = {
        srcImg: "/image.png",
        label: "Accessible Control",
      };

      renderComponent(props);

      const image = screen.getByAltText("Accessible Control");

      expect(image).toHaveAttribute("alt");
      expect(image.getAttribute("alt")).toBe("Accessible Control");
    });

    test("It should use descriptive alt text from label", () => {
      const props: ControlProps = {
        srcImg: "/jump.png",
        label: "Jump Action",
      };

      renderComponent(props);

      const image = screen.getByAltText("Jump Action") as HTMLImageElement;

      expect(image.alt).toBe("Jump Action");
    });

    test("It should be findable by alt text", () => {
      const props: ControlProps = {
        srcImg: "/image.png",
        label: "Findable Control",
      };

      renderComponent(props);

      const image = screen.getByAltText("Findable Control");

      expect(image).toBeInTheDocument();
    });
  });
});
