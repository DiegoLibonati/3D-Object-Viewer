import * as THREE from "three";
import { GUI } from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { Object, Sizes } from "../entities/entities";

import { getElements } from "../helpers/getElements";
import { ENVIROMENT_MAPS_TEXTURES } from "../constants/textures";
import { objects } from "../constants/objects";

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
  private currentObject: Object = this.objects[0];

  constructor(public canvas: HTMLCanvasElement) {
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

    this.addCamera();
    this.addLights();
    this.addEventListeners();

    this.configScene();
    this.configControls();

    this.loadFont(() => {
      if (this.currentObject) this.renderCurrentObject();
    });

    this.render();
    this.animate();
  }

  private addCamera() {
    this.camera.position.z = 10;

    this.scene.add(this.camera);
  }

  private addLights() {
    const ambientLight = new THREE.AmbientLight("#FFFFFF", 0.5);
    const pointLight = new THREE.PointLight("#FFFFFF", 0.5);

    pointLight.position.set(2, 3, 4);

    this.scene.add(pointLight);
    this.scene.add(ambientLight);
  }

  private addEventListeners() {
    const { inputFile, buttonModal } = getElements();

    window.addEventListener("resize", this.onWindowResize.bind(this));
    window.addEventListener("keydown", this.onKeyDown.bind(this));

    inputFile?.addEventListener("change", this.onFileChange.bind(this));
    buttonModal?.addEventListener("click", this.onCloseModal.bind(this));
  }

  private addObject(object: Object) {
    this.objects.push(object);
  }

  private configScene() {
    const cubeTextureLoader = new THREE.CubeTextureLoader();

    this.scene.background = cubeTextureLoader.load(ENVIROMENT_MAPS_TEXTURES);
  }

  private configControls() {
    this.controls.enableDamping = true;
  }

  private loadFont(callback: () => void) {
    const fontLoader = new FontLoader();
    const fontPath = "./fonts/helvetiker_regular.typeface.json";

    fontLoader.load(fontPath, (font: Font) => {
      this.font = font;
      callback();
    });
  }

  private render() {
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderer.render(this.scene, this.camera);
  }

  private renderCurrentObject() {
    const cubeTextureLoader = new THREE.CubeTextureLoader();

    // Gui
    const folderModel = this.gui.addFolder("Model");
    const folderText = this.gui.addFolder("Text");

    // Material
    const material = new THREE.MeshStandardMaterial({
      envMap: cubeTextureLoader.load(ENVIROMENT_MAPS_TEXTURES),
      metalness: 0.766,
      roughness: 0.041,
      color: "#ffffff",
    });

    // Model
    const meshModel = this.currentObject.mesh;
    meshModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = material;
        if (
          !folderModel.controllers.find(
            (controller) => controller.property === "color"
          )
        )
          folderModel.addColor(child.material, "color").name("Color");
      }
    });

    // Text
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

  private onWindowResize() {
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;

    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private onKeyDown(event: KeyboardEvent) {
    const validKeys = ["ArrowRight", "ArrowLeft"];
    const { key } = event;

    if (!validKeys.includes(key)) return;

    switch (key) {
      case "ArrowRight": {
        const indexOfCurrentObject = this.objects.indexOf(this.currentObject);
        const nextIndex = indexOfCurrentObject + 1;

        if (nextIndex >= this.objects.length)
          this.currentObject = this.objects[0];
        else this.currentObject = this.objects[nextIndex];

        this.updateScene();
        break;
      }
      case "ArrowLeft": {
        const indexOfCurrentObject = this.objects.indexOf(this.currentObject);
        const prevIndex = indexOfCurrentObject - 1;

        if (prevIndex < 0)
          this.currentObject = this.objects[this.objects.length - 1];
        else this.currentObject = this.objects[prevIndex];

        this.updateScene();
        break;
      }
      default:
        break;
    }
  }

  private async onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) return;

    const loader = new GLTFLoader();
    const url = URL.createObjectURL(file);

    try {
      const gltf = await loader.loadAsync(url);
      this.addObject({
        name: file.name,
        mesh: gltf.scene.children[0] as THREE.Mesh,
      });
      this.onOpenModal(
        `Your model ${file.name} was added. Use the arrows of your keyboard to find your custom model.`
      );
      this.updateScene();
    } catch (error) {
      console.error("Error loading model:", error);
      this.onOpenModal(`Error to load this class of model`);
    }
  }

  private onOpenModal(message: string) {
    const { modalText, modalContainer } = getElements();

    modalText.innerHTML = message;
    modalContainer.style.display = "flex";
  }

  private onCloseModal() {
    const { modalContainer } = getElements();

    modalContainer.style.display = "none";
  }

  private updateScene() {
    this.scene.clear();

    this.gui.destroy();
    this.gui = new GUI();

    this.addLights();
    this.renderCurrentObject();
  }

  private animate() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate.bind(this));
  }
}
