import "@testing-library/jest-dom";

import { mockAssets } from "@tests/__mocks__/assets.mock";

const mockThreeSceneAdd = jest.fn();
const mockThreeSceneRemove = jest.fn();
const mockThreeSceneClear = jest.fn();
const mockThreeSceneTraverse = jest.fn();
const mockThreePerspectiveCameraUpdateProjectionMatrix = jest.fn();
const mockThreeWebGLRendererSetSize = jest.fn();
const mockThreeWebGLRendererSetPixelRatio = jest.fn();
const mockThreeWebGLRendererRender = jest.fn();
const mockThreeWebGLRendererDispose = jest.fn();
const mockThreePointLightPositionSet = jest.fn();
const mockThreeCubeTextureLoaderLoad = jest.fn(() => ({}));
const mockThreeMeshTraverse = jest.fn();
const mockThreeBufferGeometryDispose = jest.fn();
const mockThreeMaterialDispose = jest.fn();
const mockThreeBoxGeometryDispose = jest.fn();
const mockThreeConeGeometryDispose = jest.fn();
const mockThreeCylinderGeometryDispose = jest.fn();
const mockThreeDodecahedronGeometryDispose = jest.fn();
const mockThreeIcosahedronGeometryDispose = jest.fn();
const mockThreeOctahedronGeometryDispose = jest.fn();
const mockThreeSphereGeometryDispose = jest.fn();
const mockThreeTetrahedronGeometryDispose = jest.fn();
const mockThreeTorusGeometryDispose = jest.fn();
const mockThreeTorusKnotGeometryDispose = jest.fn();
const mockThreeCapsuleGeometryDispose = jest.fn();
const mockThreeCircleGeometryDispose = jest.fn();
const mockThreePlaneGeometryDispose = jest.fn();
const mockThreeRingGeometryDispose = jest.fn();
const mockThreeTubeGeometryDispose = jest.fn();
const mockThreeLatheGeometryDispose = jest.fn();
const mockThreeShapeGeometryDispose = jest.fn();
const mockThreeExtrudeGeometryDispose = jest.fn();
const mockThreeEdgesGeometryDispose = jest.fn();
const mockThreeWireframeGeometryDispose = jest.fn();

const mockGuiName = jest.fn();
const mockGuiStep = jest.fn(() => ({
  name: mockGuiName,
}));
const mockGuiMax = jest.fn(() => ({
  step: mockGuiStep,
}));
const mockGuiMin = jest.fn(() => ({
  max: mockGuiMax,
}));
const mockGuiAdd = jest.fn(() => ({
  min: mockGuiMin,
  name: mockGuiName,
}));
const mockGuiAddColor = jest.fn(() => ({
  name: mockGuiName,
}));
const mockGuiFolderAdd = jest.fn(() => mockGuiAdd());
const mockGuiFolder = jest.fn(() => ({
  add: mockGuiFolderAdd,
  addColor: mockGuiAddColor,
  controllers: [],
}));
const mockGuiDestroy = jest.fn();

const mockThreeGTFLLoaderLoad = jest.fn();
const mockThreeGTFLLoaderLoadAsync = jest.fn();

const mockThreeFontLoaderLoad = jest.fn();

const mockThreeTextGeometryCenter = jest.fn();

const mockThreeOrbitControlsUpdate = jest.fn();
const mockThreeOrbitControlsDispose = jest.fn();

const mockThreeScene = jest.fn(() => ({
  add: mockThreeSceneAdd,
  remove: mockThreeSceneRemove,
  clear: mockThreeSceneClear,
  traverse: mockThreeSceneTraverse,
  background: null,
}));
const mockThreePerspectiveCamera = jest.fn(() => ({
  position: { z: 0, x: 0, y: 0 },
  aspect: 1,
  updateProjectionMatrix: mockThreePerspectiveCameraUpdateProjectionMatrix,
}));
const mockThreeWebGLRenderer = jest.fn(() => ({
  setSize: mockThreeWebGLRendererSetSize,
  setPixelRatio: mockThreeWebGLRendererSetPixelRatio,
  render: mockThreeWebGLRendererRender,
  dispose: mockThreeWebGLRendererDispose,
}));
const mockThreeAmbientLight = jest.fn();
const mockThreePointLight = jest.fn(() => ({
  position: { set: mockThreePointLightPositionSet },
}));
const mockThreeCubeTextureLoader = jest.fn(() => ({
  load: mockThreeCubeTextureLoaderLoad,
}));
const mockThreeMeshStandardMaterial = jest.fn();
const mockThreeMesh = jest.fn(() => ({
  position: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
  traverse: mockThreeMeshTraverse,
}));
const mockThreeBufferGeometry = jest.fn(() => ({
  dispose: mockThreeBufferGeometryDispose,
}));
const mockThreeMaterial = jest.fn(() => ({
  dispose: mockThreeMaterialDispose,
}));
const mockThreeBoxGeometry = jest.fn(() => ({
  dispose: mockThreeBoxGeometryDispose,
}));
const mockThreeConeGeometry = jest.fn(() => ({
  dispose: mockThreeConeGeometryDispose,
}));
const mockThreeCylinderGeometry = jest.fn(() => ({
  dispose: mockThreeCylinderGeometryDispose,
}));
const mockThreeDodecahedronGeometry = jest.fn(() => ({
  dispose: mockThreeDodecahedronGeometryDispose,
}));
const mockThreeIcosahedronGeometry = jest.fn(() => ({
  dispose: mockThreeIcosahedronGeometryDispose,
}));
const mockThreeOctahedronGeometry = jest.fn(() => ({
  dispose: mockThreeOctahedronGeometryDispose,
}));
const mockThreeSphereGeometry = jest.fn(() => ({
  dispose: mockThreeSphereGeometryDispose,
}));
const mockThreeTetrahedronGeometry = jest.fn(() => ({
  dispose: mockThreeTetrahedronGeometryDispose,
}));
const mockThreeTorusGeometry = jest.fn(() => ({
  dispose: mockThreeTorusGeometryDispose,
}));
const mockThreeTorusKnotGeometry = jest.fn(() => ({
  dispose: mockThreeTorusKnotGeometryDispose,
}));
const mockThreeCapsuleGeometry = jest.fn(() => ({
  dispose: mockThreeCapsuleGeometryDispose,
}));
const mockThreeCircleGeometry = jest.fn(() => ({
  dispose: mockThreeCircleGeometryDispose,
}));
const mockThreePlaneGeometry = jest.fn(() => ({
  dispose: mockThreePlaneGeometryDispose,
}));
const mockThreeRingGeometry = jest.fn(() => ({
  dispose: mockThreeRingGeometryDispose,
}));
const mockThreeTubeGeometry = jest.fn(() => ({
  dispose: mockThreeTubeGeometryDispose,
}));
const mockThreeLatheGeometry = jest.fn(() => ({
  dispose: mockThreeLatheGeometryDispose,
}));
const mockThreeShapeGeometry = jest.fn(() => ({
  dispose: mockThreeShapeGeometryDispose,
}));
const mockThreeExtrudeGeometry = jest.fn(() => ({
  dispose: mockThreeExtrudeGeometryDispose,
}));
const mockThreeEdgesGeometry = jest.fn(() => ({
  dispose: mockThreeEdgesGeometryDispose,
}));
const mockThreeWireframeGeometry = jest.fn(() => ({
  dispose: mockThreeWireframeGeometryDispose,
}));

const mockGui = jest.fn(() => ({
  addFolder: mockGuiFolder,
  destroy: mockGuiDestroy,
}));

const mockThreeGTFLLoader = jest.fn(() => ({
  load: mockThreeGTFLLoaderLoad,
  loadAsync: mockThreeGTFLLoaderLoadAsync,
}));

const mockThreeFontLoader = jest.fn(() => ({
  load: mockThreeFontLoaderLoad,
}));

const mockThreeTextGeometry = jest.fn(() => ({
  center: mockThreeTextGeometryCenter,
}));

const mockThreeOrbitControls = jest.fn(() => ({
  enableDamping: false,
  update: mockThreeOrbitControlsUpdate,
  dispose: mockThreeOrbitControlsDispose,
}));

jest.mock("@/assets/export", () => ({
  __esModule: true,
  default: mockAssets,
}));

jest.mock("three", () => ({
  Scene: mockThreeScene,
  PerspectiveCamera: mockThreePerspectiveCamera,
  WebGLRenderer: mockThreeWebGLRenderer,
  AmbientLight: mockThreeAmbientLight,
  PointLight: mockThreePointLight,
  CubeTextureLoader: mockThreeCubeTextureLoader,
  MeshStandardMaterial: mockThreeMeshStandardMaterial,
  Mesh: mockThreeMesh,
  BufferGeometry: mockThreeBufferGeometry,
  Material: mockThreeMaterial,
  BoxGeometry: mockThreeBoxGeometry,
  ConeGeometry: mockThreeConeGeometry,
  CylinderGeometry: mockThreeCylinderGeometry,
  DodecahedronGeometry: mockThreeDodecahedronGeometry,
  IcosahedronGeometry: mockThreeIcosahedronGeometry,
  OctahedronGeometry: mockThreeOctahedronGeometry,
  SphereGeometry: mockThreeSphereGeometry,
  TetrahedronGeometry: mockThreeTetrahedronGeometry,
  TorusGeometry: mockThreeTorusGeometry,
  TorusKnotGeometry: mockThreeTorusKnotGeometry,
  CapsuleGeometry: mockThreeCapsuleGeometry,
  CircleGeometry: mockThreeCircleGeometry,
  PlaneGeometry: mockThreePlaneGeometry,
  RingGeometry: mockThreeRingGeometry,
  TubeGeometry: mockThreeTubeGeometry,
  LatheGeometry: mockThreeLatheGeometry,
  ShapeGeometry: mockThreeShapeGeometry,
  ExtrudeGeometry: mockThreeExtrudeGeometry,
  EdgesGeometry: mockThreeEdgesGeometry,
  WireframeGeometry: mockThreeWireframeGeometry,
}));

jest.mock("lil-gui", () => ({
  GUI: mockGui,
}));

jest.mock("three/examples/jsm/loaders/GLTFLoader.js", () => ({
  GLTFLoader: mockThreeGTFLLoader,
}));

jest.mock("three/examples/jsm/loaders/FontLoader.js", () => ({
  FontLoader: mockThreeFontLoader,
}));

jest.mock("three/examples/jsm/geometries/TextGeometry.js", () => ({
  TextGeometry: mockThreeTextGeometry,
}));

jest.mock("three/examples/jsm/controls/OrbitControls.js", () => ({
  OrbitControls: mockThreeOrbitControls,
}));
