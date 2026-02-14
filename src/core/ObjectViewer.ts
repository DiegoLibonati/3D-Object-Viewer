import * as THREE from "three";
import { GUI } from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { Font } from "three/examples/jsm/loaders/FontLoader.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import type { Object, Sizes } from "@/types/app";
import type { Page } from "@/types/pages";

import textures from "@/constants/textures";
import objects from "@/constants/objects";

export class ObjectViewer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;

  private gui: GUI;
  private font: Font | null = null;

  private sizes: Sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  private objects: Object[] = [...objects];
  private currentObject: Object = this.objects[0]!;

  private boundOnWindowResize: (event: UIEvent) => void;
  private boundOnKeyDown: (event: KeyboardEvent) => void;
  private boundOnFileChange: (event: Event) => void;
  private boundOnCloseModal: () => void;

  private animationFrameId: number | null = null;

  private inputFile: HTMLInputElement | null = null;
  private buttonModal: HTMLButtonElement | null = null;

  constructor(
    public canvas: HTMLCanvasElement,
    private container: Page
  ) {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.sizes.width / this.sizes.height,
      1,
      100
    );

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });

    this.controls = new OrbitControls(this.camera, canvas);

    this.gui = new GUI();

    this.boundOnWindowResize = this.onWindowResize.bind(this);
    this.boundOnKeyDown = this.onKeyDown.bind(this);
    this.boundOnFileChange = (event: Event): void => {
      void this.onFileChange(event);
    };
    this.boundOnCloseModal = this.onCloseModal.bind(this);

    this.addCamera();
    this.addLights();
    this.addEventListeners();

    this.configScene();
    this.configControls();

    this.loadFont(() => {
      this.renderCurrentObject();
    });

    this.render();
    this.animate();
  }

  private addCamera(): void {
    this.camera.position.z = 10;
    this.scene.add(this.camera);
  }

  private addLights(): void {
    const ambientLight = new THREE.AmbientLight("#FFFFFF", 0.5);
    const pointLight = new THREE.PointLight("#FFFFFF", 0.5);

    pointLight.position.set(2, 3, 4);

    this.scene.add(pointLight);
    this.scene.add(ambientLight);
  }

  private addEventListeners(): void {
    this.inputFile =
      this.container.querySelector<HTMLInputElement>(".upload__input");
    this.buttonModal =
      this.container.querySelector<HTMLButtonElement>(".alert__button");

    window.addEventListener("resize", this.boundOnWindowResize);
    window.addEventListener("keydown", this.boundOnKeyDown);
    this.inputFile?.addEventListener("change", this.boundOnFileChange);
    this.buttonModal?.addEventListener("click", this.boundOnCloseModal);
  }

  private addObject(object: Object): void {
    this.objects.push(object);
  }

  private configScene(): void {
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    this.scene.background = cubeTextureLoader.load(textures);
  }

  private configControls(): void {
    this.controls.enableDamping = true;
  }

  private loadFont(callback: () => void): void {
    const fontLoader = new FontLoader();

    fontLoader.load(
      "./fonts/helvetiker_regular.typeface.json",
      (font: Font) => {
        this.font = font;
        callback();
      }
    );
  }

  private render(): void {
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.render(this.scene, this.camera);
  }

  private renderCurrentObject(): void {
    const cubeTextureLoader = new THREE.CubeTextureLoader();

    const folderModel = this.gui.addFolder("Model");
    const folderText = this.gui.addFolder("Text");

    const material = new THREE.MeshStandardMaterial({
      envMap: cubeTextureLoader.load(textures),
      metalness: 0.766,
      roughness: 0.041,
      color: "#ffffff",
    });

    const meshModel = this.currentObject.mesh;

    meshModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = material;

        if (
          !folderModel.controllers.find(
            (controller) => controller.property === "color"
          )
        ) {
          folderModel.addColor(material, "color").name("Color");
        }
      }
    });

    const textGeometry = new TextGeometry(this.currentObject.name, {
      font: this.font!,
      size: 0.5,
      height: 0.2,
      curveSegments: 5,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 4,
    });
    textGeometry.center();
    const meshText = new THREE.Mesh(textGeometry, material);
    meshText.position.y = 2;

    folderModel
      .add(meshModel.position, "x")
      .min(-100)
      .max(100)
      .step(1)
      .name("Axis X");
    folderModel
      .add(meshModel.position, "y")
      .min(-100)
      .max(100)
      .step(1)
      .name("Axis Y");
    folderModel
      .add(meshModel.position, "z")
      .min(-100)
      .max(100)
      .step(1)
      .name("Axis Z");
    folderModel
      .add(meshModel.scale, "x")
      .min(-100)
      .max(100)
      .step(1)
      .name("Scale X");
    folderModel
      .add(meshModel.scale, "y")
      .min(-100)
      .max(100)
      .step(1)
      .name("Scale Y");
    folderModel
      .add(meshModel.scale, "z")
      .min(-100)
      .max(100)
      .step(1)
      .name("Scale Z");

    folderText.add(meshText, "visible").name("Is visible");

    this.scene.add(meshModel);
    this.scene.add(meshText);
  }

  private onWindowResize(): void {
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;

    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private onKeyDown(event: KeyboardEvent): void {
    const validKeys = ["ArrowRight", "ArrowLeft"];
    const { key } = event;

    if (!validKeys.includes(key)) return;

    switch (key) {
      case "ArrowRight": {
        const indexOfCurrentObject = this.objects.indexOf(this.currentObject);
        const nextIndex = indexOfCurrentObject + 1;

        if (nextIndex >= this.objects.length)
          this.currentObject = this.objects[0]!;
        else this.currentObject = this.objects[nextIndex]!;

        this.updateScene();
        break;
      }
      case "ArrowLeft": {
        const indexOfCurrentObject = this.objects.indexOf(this.currentObject);
        const prevIndex = indexOfCurrentObject - 1;

        if (prevIndex < 0)
          this.currentObject = this.objects[this.objects.length - 1]!;
        else this.currentObject = this.objects[prevIndex]!;

        this.updateScene();
        break;
      }
      default:
        break;
    }
  }

  private async onFileChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const loader = new GLTFLoader();
    const url = URL.createObjectURL(file);

    try {
      const gltf = await loader.loadAsync(url);
      const sceneChild = gltf.scene.children[0];

      this.addObject({
        name: file.name,
        mesh: sceneChild as THREE.Mesh,
      });
      this.onOpenModal(
        `Your model ${file.name} was added. Use the arrows of your keyboard to find your custom model.`
      );
      this.updateScene();

      URL.revokeObjectURL(url);
    } catch {
      this.onOpenModal(`Error loading model. Please try a different file.`);
      URL.revokeObjectURL(url);
    }
  }

  private onOpenModal(message: string): void {
    const modalContainer = this.container.querySelector<HTMLElement>(".alert");
    const modalText =
      this.container.querySelector<HTMLHeadingElement>(".alert__title");

    if (modalText) modalText.innerHTML = message;
    if (modalContainer) modalContainer.style.display = "flex";
  }

  private onCloseModal(): void {
    const modalContainer = this.container.querySelector<HTMLElement>(".alert");
    if (modalContainer) modalContainer.style.display = "none";
  }

  private updateScene(): void {
    this.scene.clear();

    this.gui.destroy();
    this.gui = new GUI();

    this.addLights();
    this.renderCurrentObject();
  }

  private animate(): void {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
  }

  public dispose(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    window.removeEventListener("resize", this.boundOnWindowResize);
    window.removeEventListener("keydown", this.boundOnKeyDown);
    if (this.inputFile) {
      this.inputFile.removeEventListener("change", this.boundOnFileChange);
    }
    if (this.buttonModal) {
      this.buttonModal.removeEventListener("click", this.boundOnCloseModal);
    }

    this.gui.destroy();
    this.controls.dispose();

    this.scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      const geometry = object.geometry as THREE.BufferGeometry | undefined;
      if (geometry && "dispose" in geometry) {
        geometry.dispose();
      }

      const material = object.material as
        | THREE.Material
        | THREE.Material[]
        | undefined;

      if (material) {
        if (Array.isArray(material)) {
          material.forEach((mat) => {
            if ("dispose" in mat && typeof mat.dispose === "function") {
              mat.dispose();
            }
          });
        } else {
          if ("dispose" in material && typeof material.dispose === "function") {
            material.dispose();
          }
        }
      }
    });

    this.renderer.dispose();
    this.scene.clear();
    this.objects = [];
  }
}
