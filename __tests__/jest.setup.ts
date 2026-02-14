import "@testing-library/jest-dom";

import { mockAssets } from "@tests/__mocks__/assets.mock";

jest.mock("@/assets/export", () => ({
  __esModule: true,
  default: mockAssets,
}));

jest.mock("three", () => ({
  Scene: jest.fn(() => ({
    add: jest.fn(),
    clear: jest.fn(),
    traverse: jest.fn(),
    background: null,
  })),
  PerspectiveCamera: jest.fn(() => ({
    position: { z: 0, x: 0, y: 0 },
    aspect: 1,
    updateProjectionMatrix: jest.fn(),
  })),
  WebGLRenderer: jest.fn(() => ({
    setSize: jest.fn(),
    setPixelRatio: jest.fn(),
    render: jest.fn(),
    dispose: jest.fn(),
  })),
  AmbientLight: jest.fn(),
  PointLight: jest.fn(() => ({
    position: { set: jest.fn() },
  })),
  CubeTextureLoader: jest.fn(() => ({
    load: jest.fn(() => ({})),
  })),
  MeshStandardMaterial: jest.fn(),
  Mesh: jest.fn(() => ({
    position: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    traverse: jest.fn(),
  })),
  BufferGeometry: jest.fn(() => ({
    dispose: jest.fn(),
  })),
  Material: jest.fn(() => ({
    dispose: jest.fn(),
  })),
  BoxGeometry: jest.fn(() => ({ dispose: jest.fn() })),
  ConeGeometry: jest.fn(() => ({ dispose: jest.fn() })),
  CylinderGeometry: jest.fn(() => ({ dispose: jest.fn() })),
  DodecahedronGeometry: jest.fn(() => ({ dispose: jest.fn() })),
  IcosahedronGeometry: jest.fn(() => ({ dispose: jest.fn() })),
  OctahedronGeometry: jest.fn(() => ({ dispose: jest.fn() })),
  SphereGeometry: jest.fn(() => ({ dispose: jest.fn() })),
  TetrahedronGeometry: jest.fn(() => ({ dispose: jest.fn() })),
  TorusGeometry: jest.fn(() => ({ dispose: jest.fn() })),
  TorusKnotGeometry: jest.fn(() => ({ dispose: jest.fn() })),
  CapsuleGeometry: jest.fn(() => ({ dispose: jest.fn() })),
  CircleGeometry: jest.fn(() => ({ dispose: jest.fn() })),
  PlaneGeometry: jest.fn(() => ({ dispose: jest.fn() })),
  RingGeometry: jest.fn(() => ({ dispose: jest.fn() })),
  TubeGeometry: jest.fn(() => ({ dispose: jest.fn() })),
  LatheGeometry: jest.fn(() => ({ dispose: jest.fn() })),
  ShapeGeometry: jest.fn(() => ({ dispose: jest.fn() })),
  ExtrudeGeometry: jest.fn(() => ({ dispose: jest.fn() })),
  EdgesGeometry: jest.fn(() => ({ dispose: jest.fn() })),
  WireframeGeometry: jest.fn(() => ({ dispose: jest.fn() })),
}));

jest.mock("lil-gui", () => ({
  GUI: jest.fn(() => ({
    addFolder: jest.fn(() => ({
      add: jest.fn(() => ({
        min: jest.fn(() => ({
          max: jest.fn(() => ({
            step: jest.fn(() => ({
              name: jest.fn(),
            })),
          })),
        })),
        name: jest.fn(),
      })),
      addColor: jest.fn(() => ({
        name: jest.fn(),
      })),
      controllers: [],
    })),
    destroy: jest.fn(),
  })),
}));

jest.mock("three/examples/jsm/loaders/GLTFLoader.js", () => ({
  GLTFLoader: jest.fn(() => ({
    load: jest.fn(),
    loadAsync: jest.fn(),
  })),
}));

jest.mock("three/examples/jsm/loaders/FontLoader.js", () => ({
  FontLoader: jest.fn(() => ({
    load: jest.fn(),
  })),
}));

jest.mock("three/examples/jsm/geometries/TextGeometry.js", () => ({
  TextGeometry: jest.fn(() => ({
    center: jest.fn(),
  })),
}));

jest.mock("three/examples/jsm/controls/OrbitControls.js", () => ({
  OrbitControls: jest.fn(() => ({
    enableDamping: false,
    update: jest.fn(),
    dispose: jest.fn(),
  })),
}));
