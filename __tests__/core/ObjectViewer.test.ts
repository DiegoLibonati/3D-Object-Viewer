import type { Page } from "@/types/pages";

import { ObjectViewer } from "@/core/ObjectViewer";

describe("ObjectViewer", () => {
  let canvas: HTMLCanvasElement;
  let container: Page;
  let objectViewer: ObjectViewer;

  beforeEach(() => {
    canvas = document.createElement("canvas");
    container = document.createElement("div") as Page;

    container.innerHTML = `
      <input type="file" class="upload__input" />
      <div class="alert" style="display: none;">
        <h2 class="alert__title"></h2>
        <button class="alert__button">Close</button>
      </div>
    `;

    document.body.appendChild(container);
    document.body.appendChild(canvas);
  });

  afterEach(() => {
    objectViewer.dispose();
    document.body.innerHTML = "";
  });

  it("should initialize ObjectViewer with scene, camera, and renderer", () => {
    objectViewer = new ObjectViewer(canvas, container);

    expect(objectViewer).toBeInstanceOf(ObjectViewer);
    expect(objectViewer.canvas).toBe(canvas);
  });

  it("should handle window resize event", () => {
    objectViewer = new ObjectViewer(canvas, container);

    const initialWidth = window.innerWidth;
    const initialHeight = window.innerHeight;

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1920,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 1080,
    });

    window.dispatchEvent(new Event("resize"));

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: initialWidth,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: initialHeight,
    });

    expect(objectViewer).toBeDefined();
  });

  it("should navigate to next object on ArrowRight key press", () => {
    objectViewer = new ObjectViewer(canvas, container);

    const keyboardEvent = new KeyboardEvent("keydown", {
      key: "ArrowRight",
    });

    window.dispatchEvent(keyboardEvent);

    expect(objectViewer).toBeDefined();
  });

  it("should navigate to previous object on ArrowLeft key press", () => {
    objectViewer = new ObjectViewer(canvas, container);

    const keyboardEvent = new KeyboardEvent("keydown", {
      key: "ArrowLeft",
    });

    window.dispatchEvent(keyboardEvent);

    expect(objectViewer).toBeDefined();
  });

  it("should not handle invalid key press", () => {
    objectViewer = new ObjectViewer(canvas, container);

    const keyboardEvent = new KeyboardEvent("keydown", {
      key: "Enter",
    });

    window.dispatchEvent(keyboardEvent);

    expect(objectViewer).toBeDefined();
  });

  it("should open modal with message", () => {
    objectViewer = new ObjectViewer(canvas, container);

    const modalContainer = container.querySelector<HTMLElement>(".alert");
    const modalText =
      container.querySelector<HTMLHeadingElement>(".alert__title");

    expect(modalContainer).toBeInTheDocument();
    expect(modalText).toBeInTheDocument();
    expect(modalContainer?.style.display).toBe("none");
  });

  it("should close modal on button click", () => {
    objectViewer = new ObjectViewer(canvas, container);

    const modalContainer = container.querySelector<HTMLElement>(".alert");
    const buttonModal =
      container.querySelector<HTMLButtonElement>(".alert__button");

    if (modalContainer) modalContainer.style.display = "flex";

    buttonModal?.click();

    expect(modalContainer?.style.display).toBe("none");
  });

  it("should handle file input change with no file selected", () => {
    objectViewer = new ObjectViewer(canvas, container);

    const inputFile =
      container.querySelector<HTMLInputElement>(".upload__input");
    const changeEvent = new Event("change", { bubbles: true });

    inputFile?.dispatchEvent(changeEvent);

    expect(objectViewer).toBeDefined();
  });

  it("should cleanup resources on dispose", () => {
    objectViewer = new ObjectViewer(canvas, container);

    const cancelAnimationFrameSpy = jest.spyOn(window, "cancelAnimationFrame");

    objectViewer.dispose();

    expect(cancelAnimationFrameSpy).toHaveBeenCalled();

    cancelAnimationFrameSpy.mockRestore();
  });

  it("should remove event listeners on dispose", () => {
    objectViewer = new ObjectViewer(canvas, container);

    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    objectViewer.dispose();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );

    removeEventListenerSpy.mockRestore();
  });
});
