import type * as THREE from "three";

export interface Object {
  name: string;
  mesh: THREE.Mesh;
}

export interface Sizes {
  width: number;
  height: number;
}
