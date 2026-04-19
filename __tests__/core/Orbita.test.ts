import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

import type { Page } from "@/types/pages";

import { Orbita } from "@/core/Orbita";

interface MockScene {
  add: jest.Mock;
  remove: jest.Mock;
  clear: jest.Mock;
  traverse: jest.Mock;
  background: null;
}

interface MockRenderer {
  setSize: jest.Mock;
  setPixelRatio: jest.Mock;
  render: jest.Mock;
  dispose: jest.Mock;
}

interface MockCamera {
  position: { z: number; x: number; y: number };
  aspect: number;
  updateProjectionMatrix: jest.Mock;
}

interface MockControls {
  enableDamping: boolean;
  update: jest.Mock;
  dispose: jest.Mock;
}

interface MockGui {
  addFolder: jest.Mock;
  destroy: jest.Mock;
}

const createContainer = (): Page => {
  const main = document.createElement("main") as Page;
  main.innerHTML = `
    <input class="upload__input" type="file" />
    <button class="alert__button" aria-label="Close dialog">Close</button>
    <div class="alert" style="display: none">
      <h2 class="alert__title"></h2>
    </div>
  `;
  document.body.appendChild(main);
  return main;
};

describe("Orbita", () => {
  let canvas: HTMLCanvasElement;
  let container: Page;
  let orbita: Orbita;
  let mockCancelAnimationFrame: jest.SpyInstance;
  let sceneInstance: MockScene;
  let rendererInstance: MockRenderer;
  let cameraInstance: MockCamera;
  let controlsInstance: MockControls;
  let guiInstance: MockGui;

  beforeEach(() => {
    jest.spyOn(global, "requestAnimationFrame").mockReturnValue(1);
    mockCancelAnimationFrame = jest
      .spyOn(global, "cancelAnimationFrame")
      .mockImplementation(() => {
        // empty fn
      });

    global.URL.createObjectURL = jest.fn().mockReturnValue("blob:mock");
    global.URL.revokeObjectURL = jest.fn();

    canvas = document.createElement("canvas");
    container = createContainer();
    orbita = new Orbita(canvas, container);

    sceneInstance = (THREE.Scene as unknown as jest.Mock).mock.results[0]!
      .value as MockScene;
    rendererInstance = (THREE.WebGLRenderer as jest.Mock).mock.results[0]!
      .value as MockRenderer;
    cameraInstance = (THREE.PerspectiveCamera as unknown as jest.Mock).mock
      .results[0]!.value as MockCamera;
    controlsInstance = (OrbitControls as jest.Mock).mock.results[0]!
      .value as MockControls;
    guiInstance = (GUI as jest.Mock).mock.results[0]!.value as MockGui;
  });

  afterEach(() => {
    orbita.dispose();
    document.body.innerHTML = "";
  });

  describe("constructor", () => {
    it("should set camera z position to 10", () => {
      expect(cameraInstance.position.z).toBe(10);
    });

    it("should add camera and lights to the scene", () => {
      expect(sceneInstance.add).toHaveBeenCalled();
    });

    it("should enable orbit controls damping", () => {
      expect(controlsInstance.enableDamping).toBe(true);
    });

    it("should start the animation loop", () => {
      expect(rendererInstance.render).toHaveBeenCalled();
    });

    it("should initialize the gui with folders on first navigation", () => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      expect(guiInstance.addFolder).toHaveBeenCalled();
    });
  });

  describe("dispose", () => {
    it("should cancel the animation frame", () => {
      orbita.dispose();
      expect(mockCancelAnimationFrame).toHaveBeenCalledWith(1);
    });

    it("should remove window resize and keydown event listeners", () => {
      const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
      orbita.dispose();
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "resize",
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function)
      );
    });

    it("should destroy the gui", () => {
      orbita.dispose();
      expect(guiInstance.destroy).toHaveBeenCalled();
    });

    it("should dispose controls and renderer", () => {
      orbita.dispose();
      expect(controlsInstance.dispose).toHaveBeenCalled();
      expect(rendererInstance.dispose).toHaveBeenCalled();
    });

    it("should clear the scene", () => {
      orbita.dispose();
      expect(sceneInstance.clear).toHaveBeenCalled();
    });

    it("should not cancel animation frame on second dispose call", () => {
      orbita.dispose();
      mockCancelAnimationFrame.mockClear();
      orbita.dispose();
      expect(mockCancelAnimationFrame).not.toHaveBeenCalled();
    });
  });

  describe("onWindowResize", () => {
    it("should call updateProjectionMatrix on the camera", () => {
      cameraInstance.updateProjectionMatrix.mockClear();
      window.dispatchEvent(new UIEvent("resize"));
      expect(cameraInstance.updateProjectionMatrix).toHaveBeenCalledTimes(1);
    });

    it("should update renderer size and pixel ratio", () => {
      rendererInstance.setSize.mockClear();
      rendererInstance.setPixelRatio.mockClear();
      window.dispatchEvent(new UIEvent("resize"));
      expect(rendererInstance.setSize).toHaveBeenCalledTimes(1);
      expect(rendererInstance.setPixelRatio).toHaveBeenCalledTimes(1);
    });
  });

  describe("onKeyDown", () => {
    it("should navigate to the next object on ArrowRight", () => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      expect((TextGeometry as unknown as jest.Mock).mock.calls[0][0]).toBe(
        "ConeGeometry"
      );
    });

    it("should navigate to the previous object on ArrowLeft", () => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      (TextGeometry as unknown as jest.Mock).mockClear();
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
      expect((TextGeometry as unknown as jest.Mock).mock.calls[0][0]).toBe(
        "BoxGeometry"
      );
    });

    it("should wrap to the last object on ArrowLeft from the first", () => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
      expect((TextGeometry as unknown as jest.Mock).mock.calls[0][0]).toBe(
        "TorusKnotGeometry"
      );
    });

    it("should wrap to the first object on ArrowRight from the last", () => {
      for (let i = 0; i < 13; i++) {
        window.dispatchEvent(
          new KeyboardEvent("keydown", { key: "ArrowRight" })
        );
      }
      (TextGeometry as unknown as jest.Mock).mockClear();
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      expect((TextGeometry as unknown as jest.Mock).mock.calls[0][0]).toBe(
        "BoxGeometry"
      );
    });

    it("should ignore non-arrow keys", () => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
      expect(sceneInstance.clear).not.toHaveBeenCalled();
    });
  });

  describe("onCloseModal", () => {
    it("should set the alert display to none when the close button is clicked", async () => {
      const user = userEvent.setup();
      const modal = container.querySelector<HTMLDivElement>(".alert")!;
      modal.style.display = "flex";

      await user.click(screen.getByRole("button", { name: /close dialog/i }));

      expect(modal.style.display).toBe("none");
    });
  });

  describe("onFileChange", () => {
    const dispatchFileChange = (file: File | null): void => {
      const inputFile =
        container.querySelector<HTMLInputElement>(".upload__input")!;
      if (file) {
        Object.defineProperty(inputFile, "files", {
          value: [file],
          configurable: true,
        });
      }
      inputFile.dispatchEvent(new Event("change"));
    };

    it("should do nothing when no file is selected", async () => {
      dispatchFileChange(null);
      await waitFor(() => {
        const modal = container.querySelector<HTMLDivElement>(".alert")!;
        expect(modal.style.display).not.toBe("flex");
      });
    });

    it("should show success modal with filename after successful model load", async () => {
      const mockFile = new File(["content"], "model.glb", {
        type: "model/gltf-binary",
      });
      const mockGltf = { scene: { children: [{}] } };

      (GLTFLoader as unknown as jest.Mock).mockImplementationOnce(() => ({
        loadAsync: jest.fn().mockResolvedValue(mockGltf),
      }));

      dispatchFileChange(mockFile);

      await waitFor(() => {
        expect(
          container.querySelector<HTMLDivElement>(".alert")!.style.display
        ).toBe("flex");
      });

      expect(
        container.querySelector<HTMLHeadingElement>(".alert__title")!.innerHTML
      ).toContain("model.glb");
    });

    it("should show error modal when model loading fails", async () => {
      const mockFile = new File(["content"], "bad.glb", {
        type: "model/gltf-binary",
      });

      (GLTFLoader as unknown as jest.Mock).mockImplementationOnce(() => ({
        loadAsync: jest.fn().mockRejectedValue(new Error("Load failed")),
      }));

      dispatchFileChange(mockFile);

      await waitFor(() => {
        expect(
          container.querySelector<HTMLDivElement>(".alert")!.style.display
        ).toBe("flex");
      });

      expect(
        container.querySelector<HTMLHeadingElement>(".alert__title")!.innerHTML
      ).toContain("Error loading model");
    });
  });
});
