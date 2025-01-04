import "@testing-library/jest-dom";

import fs from "fs";
import path from "path";

const INITIAL_HTML: string = fs.readFileSync(
  path.resolve(__dirname, "../../index.html"),
  "utf8"
);

export const OFFICIAL_BODY = INITIAL_HTML.match(
  /<body[^>]*>([\s\S]*?)<\/body>/i
)![1];

// Mocks

jest.mock("three/examples/jsm/loaders/GLTFLoader.js", () => {
  return {
    GLTFLoader: jest.fn(() => ({
      loadAsync: jest.fn().mockResolvedValue({
        scene: {
          children: [
            {
              isMesh: true,
            },
          ],
        },
      }),
    })),
  };
});

jest.mock("three/examples/jsm/loaders/FontLoader.js", () => {
  return {
    FontLoader: jest.fn(() => ({
      load: jest.fn((_, onLoad) => onLoad({})),
    })),
  };
});

jest.mock("three/examples/jsm/geometries/TextGeometry.js", () => {
  return {
    TextGeometry: jest.fn(() => ({
      center: jest.fn(),
    })),
  };
});

jest.mock("three/examples/jsm/controls/OrbitControls.js", () => {
  return {
    OrbitControls: jest.fn(() => ({
      update: jest.fn(),
    })),
  };
});

jest.mock("lil-gui", () => {
  const originalLilGui = jest.requireActual("lil-gui");

  return {
    ...originalLilGui,
    GUI: jest.fn(() => ({
      destroy: jest.fn(),
      addFolder: jest.fn(() => ({
        add: jest.fn((_, property) => {
          if (property === "visible") {
            return {
              name: jest.fn(() => {}),
            };
          }
          return {
            min: jest.fn(() => ({
              max: jest.fn(() => ({
                step: jest.fn(() => ({
                  name: jest.fn(() => {}),
                })),
              })),
            })),
          };
        }),
      })),
    })),
  };
});

jest.mock("three", () => {
  const originalThree = jest.requireActual("three");

  return {
    ...originalThree,
    Scene: jest.fn(() => ({
      add: jest.fn(),
      clear: jest.fn(),
    })),
    PerspectiveCamera: jest.fn(() => ({
      position: { z: 0, x: 0, y: 0 },
      updateProjectionMatrix: jest.fn(),
    })),
    WebGLRenderer: jest.fn(() => ({
      setSize: jest.fn(),
      setPixelRatio: jest.fn(),
      render: jest.fn(),
    })),
    AmbientLight: jest.fn(),
    PointLight: jest.fn(() => ({
      position: { set: jest.fn() },
    })),
    CubeTextureLoader: jest.fn(() => ({
      load: jest.fn(),
    })),
    MeshStandardMaterial: jest.fn(),
    Mesh: jest.fn(() => ({
      traverse: jest.fn(),
      position: { z: 0, x: 0, y: 0 },
      scale: { z: 0, x: 0, y: 0 },
    })),
    BoxGeometry: jest.fn(),
    ConeGeometry: jest.fn(),
    CapsuleGeometry: jest.fn(),
    CircleGeometry: jest.fn(),
    CylinderGeometry: jest.fn(),
    DodecahedronGeometry: jest.fn(),
    IcosahedronGeometry: jest.fn(),
    OctahedronGeometry: jest.fn(),
    PlaneGeometry: jest.fn(),
    RingGeometry: jest.fn(),
    SphereGeometry: jest.fn(),
    TetrahedronGeometry: jest.fn(),
    TorusGeometry: jest.fn(),
    TorusKnotGeometry: jest.fn(),
  };
});
