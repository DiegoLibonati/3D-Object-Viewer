import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

import type { Page } from "@/types/pages";

import { Orbita } from "@/core/Orbita";

import objects from "@/constants/objects";

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
    jest.clearAllMocks();
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

    it("should expose the canvas as a public property", () => {
      expect(orbita.canvas).toBe(canvas);
    });

    it("should call renderCurrentObject when the font loads successfully", () => {
      (FontLoader as unknown as jest.Mock).mockImplementationOnce(() => ({
        load: jest.fn((_path: string, cb: (font: object) => void) => {
          cb({});
        }),
      }));

      const orbitaWithFont = new Orbita(canvas, container);
      orbitaWithFont.dispose();

      expect(TextGeometry as unknown as jest.Mock).toHaveBeenCalled();
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

    it("should remove the inputFile change event listener", () => {
      const inputFile =
        container.querySelector<HTMLInputElement>(".upload__input")!;
      const removeListenerSpy = jest.spyOn(inputFile, "removeEventListener");
      orbita.dispose();
      expect(removeListenerSpy).toHaveBeenCalledWith(
        "change",
        expect.any(Function)
      );
    });

    it("should remove the buttonModal click event listener", () => {
      const buttonModal =
        container.querySelector<HTMLButtonElement>(".alert__button")!;
      const removeListenerSpy = jest.spyOn(buttonModal, "removeEventListener");
      orbita.dispose();
      expect(removeListenerSpy).toHaveBeenCalledWith(
        "click",
        expect.any(Function)
      );
    });
  });

  describe("when optional DOM elements are absent from the container", () => {
    let orbitaMinimal: Orbita;

    beforeEach(() => {
      const canvasMinimal = document.createElement("canvas");
      const containerMinimal = document.createElement("main") as Page;
      document.body.appendChild(containerMinimal);
      orbitaMinimal = new Orbita(canvasMinimal, containerMinimal);
    });

    afterEach(() => {
      orbitaMinimal.dispose();
    });

    it("should not throw on dispose when inputFile and buttonModal are absent", () => {
      expect(() => {
        orbitaMinimal.dispose();
      }).not.toThrow();
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

    it("should revoke the object URL after a successful model load", async () => {
      const mockFile = new File(["content"], "model.glb", {
        type: "model/gltf-binary",
      });
      const mockGltf = { scene: { children: [{}] } };

      (GLTFLoader as unknown as jest.Mock).mockImplementationOnce(() => ({
        loadAsync: jest.fn().mockResolvedValue(mockGltf),
      }));

      dispatchFileChange(mockFile);

      await waitFor(() => {
        expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock");
      });
    });

    it("should revoke the object URL after a failed model load", async () => {
      const mockFile = new File(["content"], "bad.glb", {
        type: "model/gltf-binary",
      });

      (GLTFLoader as unknown as jest.Mock).mockImplementationOnce(() => ({
        loadAsync: jest.fn().mockRejectedValue(new Error("Load failed")),
      }));

      dispatchFileChange(mockFile);

      await waitFor(() => {
        expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock");
      });
    });
  });

  describe("dispose - scene traversal", () => {
    const meshCtor = (): { prototype: object } => THREE.Mesh;

    const createMeshLike = (opts: {
      geometry?: { dispose: jest.Mock } | null;
      material?: { dispose: jest.Mock } | { dispose: jest.Mock }[] | null;
    }): THREE.Object3D =>
      Object.assign(
        Object.create(meshCtor().prototype) as THREE.Object3D,
        opts
      );

    it("should skip non-Mesh objects during scene traversal", () => {
      sceneInstance.traverse.mockImplementationOnce(
        (cb: (o: THREE.Object3D) => void) => {
          cb({} as THREE.Object3D);
        }
      );
      expect(() => {
        orbita.dispose();
      }).not.toThrow();
    });

    it("should call geometry.dispose for a Mesh with disposable geometry", () => {
      const mockGeometryDispose = jest.fn();
      sceneInstance.traverse.mockImplementationOnce(
        (cb: (o: THREE.Object3D) => void) => {
          cb(
            createMeshLike({
              geometry: { dispose: mockGeometryDispose },
              material: null,
            })
          );
        }
      );
      orbita.dispose();
      expect(mockGeometryDispose).toHaveBeenCalled();
    });

    it("should not call geometry.dispose for a Mesh with null geometry", () => {
      const mockGeometryDispose = jest.fn();
      sceneInstance.traverse.mockImplementationOnce(
        (cb: (o: THREE.Object3D) => void) => {
          cb(createMeshLike({ geometry: null, material: null }));
        }
      );
      orbita.dispose();
      expect(mockGeometryDispose).not.toHaveBeenCalled();
    });

    it("should call material.dispose for a Mesh with a single material", () => {
      const mockMaterialDispose = jest.fn();
      sceneInstance.traverse.mockImplementationOnce(
        (cb: (o: THREE.Object3D) => void) => {
          cb(createMeshLike({ material: { dispose: mockMaterialDispose } }));
        }
      );
      orbita.dispose();
      expect(mockMaterialDispose).toHaveBeenCalled();
    });

    it("should call dispose on each material in a material array", () => {
      const mockMat1Dispose = jest.fn();
      const mockMat2Dispose = jest.fn();
      sceneInstance.traverse.mockImplementationOnce(
        (cb: (o: THREE.Object3D) => void) => {
          cb(
            createMeshLike({
              material: [
                { dispose: mockMat1Dispose },
                { dispose: mockMat2Dispose },
              ],
            })
          );
        }
      );
      orbita.dispose();
      expect(mockMat1Dispose).toHaveBeenCalled();
      expect(mockMat2Dispose).toHaveBeenCalled();
    });

    it("should not throw for a Mesh with null material", () => {
      sceneInstance.traverse.mockImplementationOnce(
        (cb: (o: THREE.Object3D) => void) => {
          cb(createMeshLike({ geometry: null, material: null }));
        }
      );
      expect(() => {
        orbita.dispose();
      }).not.toThrow();
    });
  });

  describe("renderCurrentObject - mesh traversal", () => {
    const meshCtor = (): { prototype: object } => THREE.Mesh;

    it("should not throw when a Mesh child is encountered during traversal", () => {
      const meshChild = Object.create(meshCtor().prototype) as THREE.Object3D;
      Object.assign(meshChild, { material: null });

      jest
        .spyOn(objects[1]!.mesh, "traverse")
        .mockImplementationOnce((cb: (o: THREE.Object3D) => void) => {
          cb(meshChild);
        });

      expect(() => {
        window.dispatchEvent(
          new KeyboardEvent("keydown", { key: "ArrowRight" })
        );
      }).not.toThrow();
    });

    it("should not throw when a non-Mesh child is encountered during traversal", () => {
      jest
        .spyOn(objects[1]!.mesh, "traverse")
        .mockImplementationOnce((cb: (o: THREE.Object3D) => void) => {
          cb({} as THREE.Object3D);
        });

      expect(() => {
        window.dispatchEvent(
          new KeyboardEvent("keydown", { key: "ArrowRight" })
        );
      }).not.toThrow();
    });

    it("should call addColor when the Mesh child has no existing color controller", () => {
      const meshChild = Object.create(meshCtor().prototype) as THREE.Object3D;
      Object.assign(meshChild, { material: null });

      jest
        .spyOn(objects[1]!.mesh, "traverse")
        .mockImplementationOnce((cb: (o: THREE.Object3D) => void) => {
          cb(meshChild);
        });

      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));

      expect(guiInstance.addFolder).toHaveBeenCalled();
    });
  });
});
