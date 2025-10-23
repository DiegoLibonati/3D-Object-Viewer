import { screen } from "@testing-library/dom";

import { ObjectViewerPage } from "@src/pages/ObjectViewerPage/ObjectViewerPage";

import { ObjectViewer } from "@src/core/ObjectViewer";

import assets from "@src/assets/export";

type RenderComponent = {
  container: HTMLDivElement;
};

const renderComponent = (): RenderComponent => {
  const container = ObjectViewerPage();
  document.body.appendChild(container);
  return { container: container };
};

jest.mock("@src/core/ObjectViewer");

describe("ObjectViewerPage.ts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("General Tests.", () => {
    test("It should render the main component structure", () => {
      const { container } = renderComponent();

      expect(container).toBeInstanceOf(HTMLDivElement);
      expect(container.className).toBe("object-viewer-page");
    });

    test("It should render canvas element", () => {
      renderComponent();

      const canvas =
        document.querySelector<HTMLCanvasElement>(".viewer__canvas");

      expect(canvas).toBeInTheDocument();
      expect(canvas?.tagName).toBe("CANVAS");
    });

    test("It should render controls container", () => {
      renderComponent();

      const controls = document.querySelector<HTMLElement>(".controls");

      expect(controls).toBeInTheDocument();
    });

    test("It should render alert container", () => {
      renderComponent();

      const alert = document.querySelector<HTMLDivElement>(".alert");

      expect(alert).toBeInTheDocument();
    });

    test("It should render upload form", () => {
      renderComponent();

      const uploadForm = document.querySelector<HTMLFormElement>(".upload");

      expect(uploadForm).toBeInTheDocument();
      expect(uploadForm?.tagName).toBe("FORM");
    });
  });

  describe("Canvas Tests.", () => {
    test("It should have canvas with correct class", () => {
      renderComponent();

      const canvas =
        document.querySelector<HTMLCanvasElement>(".viewer__canvas");

      expect(canvas).toHaveClass("viewer__canvas");
    });

    test("It should have canvas with aria-label", () => {
      renderComponent();

      const canvas =
        document.querySelector<HTMLCanvasElement>(".viewer__canvas");

      expect(canvas).toHaveAttribute(
        "aria-label",
        "Canvas for 3D visualization"
      );
    });

    test("It should pass canvas to ObjectViewer", () => {
      renderComponent();

      expect(ObjectViewer).toHaveBeenCalledTimes(1);
      expect(ObjectViewer).toHaveBeenCalledWith(expect.any(HTMLCanvasElement));
    });
  });

  describe("Controls Tests.", () => {
    test("It should render left control", () => {
      renderComponent();

      const leftControl = screen.getByText("Left");

      expect(leftControl).toBeInTheDocument();
    });

    test("It should render right control", () => {
      renderComponent();

      const rightControl = screen.getByText("Right");

      expect(rightControl).toBeInTheDocument();
    });

    test("It should render both controls inside controls container", () => {
      renderComponent();

      const controls = document.querySelector<HTMLElement>(".controls");
      const controlsInside =
        controls?.querySelectorAll<HTMLDivElement>(".control");

      expect(controlsInside?.length).toBe(2);
    });

    test("It should create left control with correct props", () => {
      renderComponent();

      const leftControl =
        document.querySelector<HTMLDivElement>(".control--left");
      const leftImage = leftControl?.querySelector<HTMLImageElement>("img");

      expect(leftControl).toBeInTheDocument();
      expect(leftImage!.src).toContain(assets.images.Arrow);
      expect(leftImage!.alt).toBe("Left");
    });

    test("It should create right control with correct props", () => {
      renderComponent();

      const rightControl =
        document.querySelector<HTMLDivElement>(".control--right");
      const rightImage = rightControl?.querySelector<HTMLImageElement>("img");

      expect(rightControl).toBeInTheDocument();
      expect(rightImage!.src).toContain(assets.images.Arrow);
      expect(rightImage!.alt).toBe("Right");
    });

    test("It should have controls with aria-labelledby", () => {
      renderComponent();

      const controls = document.querySelector<HTMLElement>(".controls");

      expect(controls).toHaveAttribute("aria-labelledby", "controls__title");
    });
  });

  describe("Alert Tests.", () => {
    test("It should render alert wrapper", () => {
      renderComponent();

      const alertWrapper =
        document.querySelector<HTMLDivElement>(".alert__wrapper");

      expect(alertWrapper).toBeInTheDocument();
    });

    test("It should render alert title", () => {
      renderComponent();

      const alertTitle =
        document.querySelector<HTMLHeadingElement>(".alert__title");

      expect(alertTitle).toBeInTheDocument();
      expect(alertTitle?.tagName).toBe("H2");
    });

    test("It should render alert close button", () => {
      renderComponent();

      const closeButton = screen.getByRole("button", { name: /close alert/i });

      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveClass("alert__button");
      expect(closeButton.textContent).toBe("Close");
    });

    test("It should have alert with aria-live", () => {
      renderComponent();

      const alert = document.querySelector<HTMLDivElement>(".alert");

      expect(alert).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("Upload Form Tests.", () => {
    test("It should render upload label", () => {
      renderComponent();

      const label = screen.getByText("Browse a Model");

      expect(label).toBeInTheDocument();
      expect(label.tagName).toBe("LABEL");
      expect(label).toHaveClass("upload__label");
    });

    test("It should render upload input", () => {
      renderComponent();

      const input = document.querySelector<HTMLInputElement>("#upload__file");

      expect(input).toBeInTheDocument();
      expect(input!.type).toBe("file");
    });

    test("It should have hidden attribute on input", () => {
      renderComponent();

      const input = document.querySelector<HTMLInputElement>("#upload__file");

      expect(input).toHaveAttribute("hidden");
    });

    test("It should accept only glb and gltf files", () => {
      renderComponent();

      const input = document.querySelector<HTMLInputElement>("#upload__file");

      expect(input!.accept).toBe(".glb,.gltf");
    });

    test("It should link label to input", () => {
      renderComponent();

      const label = screen.getByText("Browse a Model") as HTMLLabelElement;

      expect(label.htmlFor).toBe("upload__file");
    });

    test("It should have correct input id", () => {
      renderComponent();

      const input = document.querySelector<HTMLInputElement>("#upload__file");

      expect(input?.id).toBe("upload__file");
    });
  });

  describe("ObjectViewer Integration Tests.", () => {
    test("It should instantiate ObjectViewer", () => {
      renderComponent();

      expect(ObjectViewer).toHaveBeenCalled();
    });

    test("It should pass canvas element to ObjectViewer", () => {
      renderComponent();

      const canvas =
        document.querySelector<HTMLCanvasElement>(".viewer__canvas");

      expect(ObjectViewer).toHaveBeenCalledWith(canvas);
    });

    test("It should create ObjectViewer with correct canvas", () => {
      renderComponent();

      const mockInstance = (ObjectViewer as jest.Mock).mock.instances[0];

      expect(mockInstance).toBeDefined();
    });
  });

  describe("Assets Integration Tests.", () => {
    test("It should use assets for control images", () => {
      renderComponent();

      const leftImage =
        document.querySelector<HTMLImageElement>(".control--left img");
      const rightImage = document.querySelector<HTMLImageElement>(
        ".control--right img"
      );

      expect(leftImage!.src).toContain(assets.images.Arrow);
      expect(rightImage!.src).toContain(assets.images.Arrow);
    });

    test("It should use same image for both controls", () => {
      renderComponent();

      const leftImage =
        document.querySelector<HTMLImageElement>(".control--left img");
      const rightImage = document.querySelector<HTMLImageElement>(
        ".control--right img"
      );

      expect(leftImage!.src).toBe(rightImage!.src);
    });
  });

  describe("DOM Structure Tests.", () => {
    test("It should have correct main structure", () => {
      const { container } = renderComponent();

      const canvas =
        container.querySelector<HTMLCanvasElement>(".viewer__canvas");
      const controls = container.querySelector<HTMLElement>(".controls");
      const alert = container.querySelector<HTMLDivElement>(".alert");
      const upload = container.querySelector<HTMLFormElement>(".upload");

      expect(canvas).toBeInTheDocument();
      expect(controls).toBeInTheDocument();
      expect(alert).toBeInTheDocument();
      expect(upload).toBeInTheDocument();
    });

    test("It should nest controls in their container", () => {
      renderComponent();

      const controls = document.querySelector<HTMLElement>(".controls");
      const leftControl =
        controls?.querySelector<HTMLDivElement>(".control--left");
      const rightControl =
        controls?.querySelector<HTMLDivElement>(".control--right");

      expect(leftControl).toBeInTheDocument();
      expect(rightControl).toBeInTheDocument();
    });

    test("It should nest alert elements correctly", () => {
      renderComponent();

      const alert = document.querySelector<HTMLDivElement>(".alert");
      const wrapper = alert?.querySelector<HTMLDivElement>(".alert__wrapper");
      const title = wrapper?.querySelector<HTMLHeadingElement>(".alert__title");
      const button =
        wrapper?.querySelector<HTMLButtonElement>(".alert__button");

      expect(wrapper).toBeInTheDocument();
      expect(title).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });

    test("It should nest upload elements correctly", () => {
      renderComponent();

      const upload = document.querySelector<HTMLFormElement>(".upload");
      const label = upload?.querySelector<HTMLLabelElement>(".upload__label");
      const input = upload?.querySelector<HTMLInputElement>(".upload__input");

      expect(label).toBeInTheDocument();
      expect(input).toBeInTheDocument();
    });
  });

  describe("Control Component Integration Tests.", () => {
    test("It should render Control components with correct labels", () => {
      renderComponent();

      const leftLabel = screen.getByText("Left");
      const rightLabel = screen.getByText("Right");

      expect(leftLabel.tagName).toBe("H2");
      expect(rightLabel.tagName).toBe("H2");
    });

    test("It should render Control components with correct classes", () => {
      renderComponent();

      const leftControl =
        document.querySelector<HTMLDivElement>(".control--left");
      const rightControl =
        document.querySelector<HTMLDivElement>(".control--right");

      expect(leftControl).toHaveClass("control");
      expect(leftControl).toHaveClass("control--left");
      expect(rightControl).toHaveClass("control");
      expect(rightControl).toHaveClass("control--right");
    });

    test("It should render Control components with images", () => {
      renderComponent();

      const leftImage = document.querySelector<HTMLImageElement>(
        ".control--left .control__image"
      );
      const rightImage = document.querySelector<HTMLImageElement>(
        ".control--right .control__image"
      );

      expect(leftImage).toBeInTheDocument();
      expect(rightImage).toBeInTheDocument();
    });
  });

  describe("Accessibility Tests.", () => {
    test("It should have aria-label on canvas", () => {
      renderComponent();

      const canvas =
        document.querySelector<HTMLCanvasElement>(".viewer__canvas");

      expect(canvas).toHaveAttribute("aria-label");
    });

    test("It should have aria-labelledby on controls", () => {
      renderComponent();

      const controls = document.querySelector<HTMLElement>(".controls");

      expect(controls).toHaveAttribute("aria-labelledby");
    });

    test("It should have aria-live on alert", () => {
      renderComponent();

      const alert = document.querySelector<HTMLDivElement>(".alert");

      expect(alert).toHaveAttribute("aria-live");
    });

    test("It should have aria-label on close button", () => {
      renderComponent();

      const closeButton = screen.getByRole("button", { name: /close alert/i });

      expect(closeButton).toHaveAttribute("aria-label", "Close alert");
    });

    test("It should link label to file input", () => {
      renderComponent();

      const label = screen.getByText("Browse a Model") as HTMLLabelElement;
      const input = document.querySelector<HTMLInputElement>("#upload__file");

      expect(label!.htmlFor).toBe(input!.id);
    });
  });
});
