// Objects
import * as THREE from "three";

import { Object } from "../entities/entities";

export const objects: Object[] = [
  {
    name: "BoxGeometry",
    mesh: new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2)),
  },
  {
    name: "ConeGeometry",
    mesh: new THREE.Mesh(new THREE.ConeGeometry(2, 2, 16, 16)),
  },
  {
    name: "CapsuleGeometry",
    mesh: new THREE.Mesh(new THREE.CapsuleGeometry(1, 1, 4, 8)),
  },
  {
    name: "CircleGeometry",
    mesh: new THREE.Mesh(new THREE.CircleGeometry(1, 32)),
  },
  {
    name: "CylinderGeometry",
    mesh: new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 1, 32)),
  },
  {
    name: "DodecahedronGeometry",
    mesh: new THREE.Mesh(new THREE.DodecahedronGeometry(1, 0)),
  },
  {
    name: "IcosahedronGeometry",
    mesh: new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0)),
  },
  {
    name: "OctahedronGeometry",
    mesh: new THREE.Mesh(new THREE.OctahedronGeometry(1, 0)),
  },
  {
    name: "PlaneGeometry",
    mesh: new THREE.Mesh(new THREE.PlaneGeometry(1, 1)),
  },
  {
    name: "RingGeometry",
    mesh: new THREE.Mesh(new THREE.RingGeometry(1, 1.5, 32)),
  },
  {
    name: "SphereGeometry",
    mesh: new THREE.Mesh(new THREE.SphereGeometry(1, 16, 32)),
  },
  {
    name: "TetrahedronGeometry",
    mesh: new THREE.Mesh(new THREE.TetrahedronGeometry(1, 0)),
  },
  {
    name: "TorusGeometry",
    mesh: new THREE.Mesh(new THREE.TorusGeometry(1, 0.2, 8, 33)),
  },
  {
    name: "TorusKnotGeometry",
    mesh: new THREE.Mesh(new THREE.TorusKnotGeometry(1, 0.2, 8, 33)),
  },
];
