import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "lil-gui";

import { ObjectViewer } from "./ObjectViewer";

jest.mock("../helpers/getElements", () => ({
  getElements: jest.fn(() => ({
    inputFile: document.createElement("input"),
    buttonModal: document.createElement("button"),
    modalText: document.createElement("div"),
    modalContainer: document.createElement("div"),
  })),
}));

describe("ObjectViewer", () => {
  let canvas: HTMLCanvasElement;
  let objectViewer: ObjectViewer;

  beforeEach(() => {
    canvas = document.createElement("canvas");
    objectViewer = new ObjectViewer(canvas);
  });

  test("It must initialize the class correctly.", () => {
    expect(objectViewer).toBeDefined();
    expect(THREE.Scene).toHaveBeenCalled();
    expect(THREE.PerspectiveCamera).toHaveBeenCalled();
    expect(THREE.WebGLRenderer).toHaveBeenCalled();
    expect(OrbitControls).toHaveBeenCalled();
    expect(GUI).toHaveBeenCalled();
    expect(THREE.AmbientLight).toHaveBeenCalled();
    expect(THREE.PointLight).toHaveBeenCalled();
    expect(objectViewer["renderer"].render).toHaveBeenCalled();
  });

  test("It must render the scene when you do a resize.", () => {
    const resizeEvent = new Event("resize");
    window.dispatchEvent(resizeEvent);

    expect(objectViewer["camera"].updateProjectionMatrix).toHaveBeenCalled();
    expect(objectViewer["renderer"].setSize).toHaveBeenCalled();
    expect(objectViewer["renderer"].setPixelRatio).toHaveBeenCalled();
  });

  test("It must change the object when the arrows are touched.", () => {
    const mockObject = { name: "TestObject", mesh: new THREE.Mesh() } as any;
    objectViewer["objects"].push(mockObject);
    objectViewer["currentObject"] = mockObject;

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));

    expect(objectViewer["currentObject"]).not.toBe(mockObject);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));

    expect(objectViewer["currentObject"]).toBe(mockObject);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));

    expect(objectViewer["currentObject"]).not.toBe(mockObject);
  });
});
