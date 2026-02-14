import { screen } from "@testing-library/dom";
import type { Page } from "@/types/pages";

import { ObjectViewerPage } from "@/pages/ObjectViewerPage/ObjectViewerPage";

import { ObjectViewer } from "@/core/ObjectViewer";

jest.mock("@/core/ObjectViewer");

const renderPage = (): Page => {
  const container = ObjectViewerPage();
  document.body.appendChild(container);
  return container;
};

describe("ObjectViewerPage", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  it("should render the page with correct structure", () => {
    renderPage();

    const main = document.querySelector<HTMLElement>(".object-viewer-page");
    expect(main).toBeInTheDocument();
    expect(main?.tagName).toBe("MAIN");
  });

  it("should render the canvas element", () => {
    renderPage();

    const canvas = document.querySelector<HTMLCanvasElement>(".viewer__canvas");
    expect(canvas).toBeInTheDocument();
    expect(canvas?.tagName).toBe("CANVAS");
    expect(canvas).toHaveAttribute("aria-label", "Canvas for 3D visualization");
  });

  it("should render the controls container", () => {
    renderPage();

    const controls = document.querySelector<HTMLDivElement>(".controls");
    expect(controls).toBeInTheDocument();
    expect(controls).toHaveAttribute("aria-labelledby", "controls__title");
  });

  it("should render left control component", () => {
    renderPage();

    const leftControl =
      document.querySelector<HTMLDivElement>(".control--left");
    expect(leftControl).toBeInTheDocument();
    expect(leftControl).toHaveClass("control");

    const leftLabel = screen.getByRole("heading", { name: "Left" });
    expect(leftLabel).toBeInTheDocument();
  });

  it("should render right control component", () => {
    renderPage();

    const rightControl =
      document.querySelector<HTMLDivElement>(".control--right");
    expect(rightControl).toBeInTheDocument();
    expect(rightControl).toHaveClass("control");

    const rightLabel = screen.getByRole("heading", { name: "Right" });
    expect(rightLabel).toBeInTheDocument();
  });

  it("should render the alert dialog", () => {
    renderPage();

    const alert = document.querySelector<HTMLDivElement>(".alert");
    const alertWrapper =
      document.querySelector<HTMLDivElement>(".alert__wrapper");
    const alertTitle =
      document.querySelector<HTMLHeadingElement>(".alert__title");
    const alertButton = screen.getByRole("button", { name: "Close alert" });

    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute("aria-live", "polite");
    expect(alertWrapper).toBeInTheDocument();
    expect(alertTitle).toBeInTheDocument();
    expect(alertButton).toBeInTheDocument();
    expect(alertButton).toHaveClass("alert__button");
  });

  it("should render the upload form", () => {
    renderPage();

    const form = document.querySelector<HTMLFormElement>(".upload");
    expect(form).toBeInTheDocument();
    expect(form?.tagName).toBe("FORM");
  });

  it("should render the file input with correct attributes", () => {
    renderPage();

    const label = screen.getByText("Browse a Model");
    const input = document.querySelector<HTMLInputElement>(".upload__input");

    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("for", "upload__file");
    expect(label).toHaveClass("upload__label");

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "file");
    expect(input).toHaveAttribute("id", "upload__file");
    expect(input).toHaveAttribute("accept", ".glb,.gltf");
    expect(input).toHaveAttribute("hidden");
  });

  it("should initialize ObjectViewer with canvas and page", () => {
    const page = renderPage();

    const canvas = document.querySelector<HTMLCanvasElement>(".viewer__canvas");

    expect(ObjectViewer).toHaveBeenCalledTimes(1);
    expect(ObjectViewer).toHaveBeenCalledWith(canvas, page);
  });

  it("should have cleanup method that calls viewer dispose", () => {
    const mockDispose = jest.fn();
    (ObjectViewer as jest.Mock).mockImplementation(() => ({
      dispose: mockDispose,
    }));

    const page = renderPage();

    expect(page.cleanup).toBeDefined();
    expect(typeof page.cleanup).toBe("function");

    page.cleanup?.();

    expect(mockDispose).toHaveBeenCalledTimes(1);
  });
});
