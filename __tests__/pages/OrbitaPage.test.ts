import { screen } from "@testing-library/dom";

import type { Page } from "@/types/pages";

import OrbitaPage from "@/pages/OrbitaPage/OrbitaPage";

const renderPage = (): Page => {
  const element = OrbitaPage();
  document.body.appendChild(element);
  return element;
};

describe("OrbitaPage", () => {
  let mockCancelAnimationFrame: jest.SpyInstance;
  let page: Page;

  beforeEach(() => {
    jest.spyOn(global, "requestAnimationFrame").mockReturnValue(1);
    mockCancelAnimationFrame = jest
      .spyOn(global, "cancelAnimationFrame")
      .mockImplementation(() => {
        // empty fn
      });

    page = renderPage();
  });

  afterEach(() => {
    page.cleanup?.();
    document.body.innerHTML = "";
    jest.restoreAllMocks();
  });

  describe("rendering", () => {
    it("should render a main element", () => {
      expect(page.tagName).toBe("MAIN");
    });

    it("should apply the orbita-page class", () => {
      expect(page).toHaveClass("orbita-page");
    });

    it("should render a canvas element with the correct aria-label", () => {
      const canvas = page.querySelector<HTMLCanvasElement>(".orbita__canvas");
      expect(canvas).toBeInTheDocument();
      expect(canvas).toHaveAttribute("aria-label", "Orbita");
    });

    it("should render the navigation controls group", () => {
      expect(
        screen.getByRole("group", { name: /object navigation controls/i })
      ).toBeInTheDocument();
    });

    it("should render the Left control image", () => {
      expect(screen.getByRole("img", { name: "Left" })).toBeInTheDocument();
    });

    it("should render the Right control image", () => {
      expect(screen.getByRole("img", { name: "Right" })).toBeInTheDocument();
    });

    it("should render exactly two control images inside the controls group", () => {
      const controls = page.querySelector<HTMLDivElement>(".controls")!;
      const images = controls.querySelectorAll<HTMLImageElement>("img");
      expect(images).toHaveLength(2);
    });

    it("should render the alert dialog", () => {
      expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    });

    it("should render the close button inside the alert dialog", () => {
      expect(
        screen.getByRole("button", { name: /close dialog/i })
      ).toBeInTheDocument();
    });

    it("should render the upload form", () => {
      expect(
        screen.getByRole("form", { name: /upload 3D model/i })
      ).toBeInTheDocument();
    });

    it("should render the file input accepting glb and gltf formats", () => {
      const input = page.querySelector<HTMLInputElement>(".upload__input");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("accept", ".glb,.gltf");
      expect(input).toHaveAttribute("type", "file");
    });

    it("should render the browse label linked to the file input", () => {
      expect(screen.getByText("Browse a Model")).toBeInTheDocument();
    });
  });

  describe("cleanup", () => {
    it("should expose a cleanup method", () => {
      expect(typeof page.cleanup).toBe("function");
    });

    it("should cancel the orbita animation frame when cleanup is called", () => {
      page.cleanup?.();
      expect(mockCancelAnimationFrame).toHaveBeenCalledWith(1);
    });
  });
});
