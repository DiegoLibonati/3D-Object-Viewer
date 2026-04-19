# Orbita

## Educational Purpose

This project was created primarily for **educational and learning purposes**.  
While it is well-structured and could technically be used in production, it is **not intended for commercialization**.  
The main goal is to explore and demonstrate best practices, patterns, and technologies in software development.

## Getting Started without Docker

1. Clone the repository
2. Navigate to the project folder
3. Execute: `npm install`
4. Execute: `npm run dev`

The application will open automatically at `http://localhost:3000`

## Getting Started with Docker

1. Clone the repository with `git clone "repository link"`
2. Execute: `npm install` or `yarn install` in the terminal
3. Execute: `docker-compose -f dev.docker-compose.yml build --no-cache` in the terminal
4. Once built, you must execute the command: `docker-compose -f dev.docker-compose.yml up --force-recreate` in the terminal

NOTE: You have to be standing in the folder containing the: `dev.docker-compose.yml` and you need to install `Docker Desktop` if you are in Windows.

## Description

**Orbita** is a browser-based 3D object viewer built with Three.js and vanilla TypeScript. It lets you explore, inspect, and customize 3D geometry and imported models directly in the browser — no installation, no plugins, no frameworks.

**Built-in geometry library**

The application ships with 14 predefined Three.js geometries: Box, Cone, Capsule, Circle, Cylinder, Dodecahedron, Icosahedron, Octahedron, Plane, Ring, Sphere, Tetrahedron, Torus, and Torus Knot. You can cycle through all of them using the Arrow Left / Arrow Right keys on your keyboard, or the on-screen navigation controls. Each geometry is rendered with a physically-based metallic material and placed inside a cube-map environment to simulate realistic reflections.

**GLTF / GLB model import**

Beyond the built-in shapes, Orbita supports importing your own 3D models in `.glb` or `.gltf` format. Once loaded, the model is added to the navigation queue alongside the built-in geometries, so you can jump to it with the arrow keys. A modal notification confirms when the model was successfully added or alerts you if something went wrong during the load.

**Live property controls**

Every object in the scene exposes a real-time control panel powered by lil-gui:

- **Position** — move the model along the X, Y, and Z axes independently.
- **Scale** — resize the model on each axis individually (X, Y, Z).
- **Color** — pick any color for the material in real time.
- **Text visibility** — toggle the 3D floating label that displays the object name above the geometry.

All changes are reflected instantly in the canvas without any page reload.

**Camera and scene**

The camera is orbit-controlled, meaning you can rotate around the object by clicking and dragging, zoom in and out with the scroll wheel, and pan by right-clicking. Damping is enabled to give the movement a natural, smooth feel. The scene background is a preloaded environment cube map that provides ambient lighting and reflections, making metallic materials look realistic out of the box.

**Fully responsive**

The canvas automatically adapts to the browser window size. Resizing the window updates the camera aspect ratio and the renderer resolution on the fly, so the scene always fills the viewport correctly regardless of the screen size or device.

## Technologies used

1. Typescript
2. CSS3
3. HTML5
4. Vite
5. Nginx
6. Docker
7. Three JS

## Libraries used

#### Dependencies

```
"lil-gui": "^0.17.0"
"three": "^0.148.0"
```

#### devDependencies

```
"@eslint/js": "^9.39.2"
"@testing-library/dom": "^10.4.0"
"@testing-library/jest-dom": "^6.6.3"
"@testing-library/user-event": "^14.5.2"
"@types/jest": "^30.0.0"
"@types/three": "^0.161.2"
"eslint": "^9.39.2"
"eslint-config-prettier": "^10.1.8"
"eslint-plugin-prettier": "^5.5.5"
"globals": "^17.3.0"
"husky": "^9.1.7"
"jest": "^30.3.0"
"jest-environment-jsdom": "^30.3.0"
"lint-staged": "^16.2.7"
"prettier": "^3.8.1"
"ts-jest": "^29.4.6"
"typescript": "^5.3.3"
"typescript-eslint": "^8.54.0"
"vite": "^7.1.6"
```

## Portfolio Link

[`https://www.diegolibonati.com.ar/#/project/orbita`](https://www.diegolibonati.com.ar/#/project/orbita)

## Testing

1. Navigate to the project folder
2. Execute: `npm test`

For coverage report:

```bash
npm run test:coverage
```

## Security

### npm audit

Check for vulnerabilities in dependencies:

```bash
npm audit
```

## Known Issues

None at the moment.
