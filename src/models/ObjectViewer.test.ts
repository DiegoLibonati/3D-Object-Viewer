import user from "@testing-library/user-event";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { GUI } from "lil-gui";

import { Object as ObjectOfViewer } from "../entities/entities";

import { ObjectViewer } from "./ObjectViewer";

import { OFFICIAL_BODY } from "../tests/jest.constants";

import { getElements } from "../helpers/getElements";
import { objects as defaultObjects } from "../constants/objects";

beforeEach(() => {
  document.body.innerHTML = OFFICIAL_BODY;
});

afterEach(() => {
  document.body.innerHTML = "";
});

describe("ObjectViewer", () => {
  let camera: THREE.PerspectiveCamera;
  let scene: THREE.Scene;
  let controls: OrbitControls;
  let renderer: THREE.WebGLRenderer;

  let gui: GUI;

  let canvas: HTMLCanvasElement;
  let modalText: HTMLHeadingElement;
  let modalContainer: HTMLElement;
  let inputFile: HTMLInputElement;

  let objectViewer: ObjectViewer;

  let objects: ObjectOfViewer[];

  beforeEach(() => {
    const {
      canvas: canvasElement,
      modalText: modalTextElement,
      modalContainer: modalContainerElement,
      inputFile: inputFileElement,
    } = getElements();

    canvas = canvasElement;
    modalText = modalTextElement;
    modalContainer = modalContainerElement;
    inputFile = inputFileElement;

    objectViewer = new ObjectViewer(canvas);

    camera = objectViewer["camera"];
    scene = objectViewer["scene"];
    controls = objectViewer["controls"];
    renderer = objectViewer["renderer"];

    gui = objectViewer["gui"];

    objects = objectViewer["objects"];
  });

  test("It must initialize the class correctly.", () => {
    expect(objectViewer).toBeDefined();

    expect(THREE.Scene).toHaveBeenCalled();

    expect(THREE.PerspectiveCamera).toHaveBeenCalled();
    expect(THREE.PerspectiveCamera).toHaveBeenCalledWith(
      45,
      expect.any(Number),
      1,
      100
    );

    expect(THREE.WebGLRenderer).toHaveBeenCalled();
    expect(THREE.WebGLRenderer).toHaveBeenCalledWith({
      canvas: canvas,
      antialias: true,
    });

    expect(OrbitControls).toHaveBeenCalled();
    expect(OrbitControls).toHaveBeenCalledWith(camera, canvas);

    expect(GUI).toHaveBeenCalled();
  });

  test("It must add the camera to the scene.", () => {
    objectViewer["addCamera"]();

    expect(camera.position.z).toEqual(10);

    expect(scene.add).toHaveBeenCalled();
    expect(scene.add).toHaveBeenCalledWith(camera);
  });

  test("It must add the lights to the scene.", () => {
    objectViewer["addLights"]();

    expect(THREE.AmbientLight).toHaveBeenCalled();
    expect(THREE.AmbientLight).toHaveBeenCalledWith("#FFFFFF", 0.5);
    expect(THREE.PointLight).toHaveBeenCalled();
    expect(THREE.PointLight).toHaveBeenCalledWith("#FFFFFF", 0.5);

    expect(scene.add).toHaveBeenCalled();
  });

  test("It must add the object to the object list.", () => {
    const object: ObjectOfViewer = {
      name: "Hola",
      mesh: new THREE.Mesh(new THREE.BoxGeometry(120, 120, 120, 2, 2, 2)),
    };

    objectViewer["addObject"](object);

    expect(objects.includes(object)).toBeTruthy();
  });

  test("It must be confugurated the scene.", () => {
    objectViewer["configScene"]();

    expect(THREE.CubeTextureLoader).toHaveBeenCalled();
  });

  test("It must configure the controls.", () => {
    objectViewer["configControls"]();

    expect(controls.enableDamping).toBeTruthy();
  });

  test("it must load the font.", () => {
    const callback = jest.fn();

    objectViewer["loadFont"](callback);

    expect(FontLoader).toHaveBeenCalled();
    expect(callback).toHaveBeenCalled();
  });

  test("It must render the scene.", () => {
    expect(renderer.setSize).toHaveBeenCalled();
    expect(renderer.setPixelRatio).toHaveBeenCalled();
    expect(renderer.render).toHaveBeenCalled();
    expect(renderer.render).toHaveBeenCalledWith(scene, camera);
  });

  test("It must render the actual object being displayed.", () => {
    objectViewer["renderCurrentObject"]();

    expect(THREE.CubeTextureLoader).toHaveBeenCalled();

    expect(gui.addFolder).toHaveBeenCalled();
    expect(gui.addFolder).toHaveBeenCalledWith("Model");
    expect(gui.addFolder).toHaveBeenCalledWith("Text");

    expect(THREE.MeshStandardMaterial).toHaveBeenCalled();
    expect(THREE.MeshStandardMaterial).toHaveBeenCalledWith({
      envMap: undefined,
      metalness: 0.766,
      roughness: 0.041,
      color: "#ffffff",
    });

    expect(TextGeometry).toHaveBeenCalled();
    expect(TextGeometry).toHaveBeenCalledWith(
      objectViewer["currentObject"].name,
      {
        font: expect.any(Object),
        size: 0.5,
        height: 0.2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4,
      }
    );

    expect(THREE.Mesh).toHaveBeenCalled();

    expect(scene.add).toHaveBeenCalled();
  });

  test("It must render the scene when you do a resize.", () => {
    const resizeEvent = new Event("resize");
    window.dispatchEvent(resizeEvent);

    expect(camera.updateProjectionMatrix).toHaveBeenCalled();
    expect(renderer.setSize).toHaveBeenCalled();
    expect(renderer.setPixelRatio).toHaveBeenCalled();
  });

  test("It must change the object when the arrows are touched.", () => {
    const mockObject: ObjectOfViewer = {
      name: "TestObject",
      mesh: new THREE.Mesh(),
    };

    objectViewer["addObject"](mockObject);

    expect(objectViewer["currentObject"]).not.toBe(mockObject);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));

    expect(objectViewer["currentObject"]).toBe(mockObject);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));

    expect(objectViewer["currentObject"]).not.toBe(mockObject);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));

    expect(objectViewer["currentObject"]).toBe(mockObject);
  });

  test("It must upload a file through the input file when the user requests it.", async () => {
    const fileName = "model.gltf";
    global.URL.createObjectURL = jest.fn();

    const file = new File(["dummy content"], fileName, {
      type: "model/gltf+json",
    });

    await user.upload(inputFile, file);

    expect(GLTFLoader).toHaveBeenCalled();
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(objects).toHaveLength(defaultObjects.length + 1);
    expect(modalText).toHaveTextContent(
      `Your model ${fileName} was added. Use the arrows of your keyboard to find your custom model.`
    );
    expect(modalContainer.style.display).toEqual("flex");
  });

  test("It must open the model.", () => {
    const message = "Asd asdasd a";

    objectViewer["onOpenModal"](message);

    expect(modalText).toHaveTextContent(message);
    expect(modalContainer.style.display).toEqual("flex");
  });

  test("It must close the model.", () => {
    objectViewer["onCloseModal"]();

    expect(modalContainer.style.display).toEqual("none");
  });

  test("It must update the scene.", () => {
    objectViewer["updateScene"]();

    expect(scene.clear).toHaveBeenCalled();

    expect(gui.destroy).toHaveBeenCalled();
    expect(gui).toBeDefined();

    expect(THREE.AmbientLight).toHaveBeenCalled();
    expect(THREE.AmbientLight).toHaveBeenCalledWith("#FFFFFF", 0.5);
    expect(THREE.PointLight).toHaveBeenCalled();
    expect(THREE.PointLight).toHaveBeenCalledWith("#FFFFFF", 0.5);

    expect(scene.add).toHaveBeenCalled();

    expect(THREE.CubeTextureLoader).toHaveBeenCalled();

    expect(gui.addFolder).toHaveBeenCalled();
    expect(gui.addFolder).toHaveBeenCalledWith("Model");
    expect(gui.addFolder).toHaveBeenCalledWith("Text");

    expect(THREE.MeshStandardMaterial).toHaveBeenCalled();
    expect(THREE.MeshStandardMaterial).toHaveBeenCalledWith({
      envMap: undefined,
      metalness: 0.766,
      roughness: 0.041,
      color: "#ffffff",
    });

    expect(TextGeometry).toHaveBeenCalled();
    expect(TextGeometry).toHaveBeenCalledWith(
      objectViewer["currentObject"].name,
      {
        font: expect.any(Object),
        size: 0.5,
        height: 0.2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4,
      }
    );

    expect(THREE.Mesh).toHaveBeenCalled();

    expect(scene.add).toHaveBeenCalled();
  });

  test("It should animate the app.", () => {
    objectViewer["animate"]();

    expect(controls.update).toHaveBeenCalled();
    expect(renderer.render).toHaveBeenCalled();
    expect(renderer.render).toHaveBeenCalledWith(scene, camera);
  });
});
