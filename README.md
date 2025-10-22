# 3D-Object-Viewer

## Educational Purpose

This project was created primarily for **educational and learning purposes**.  
While it is well-structured and could technically be used in production, it is **not intended for commercialization**.  
The main goal is to explore and demonstrate best practices, patterns, and technologies in software development.

## Getting Started without Docker

1. Clone the repository
2. Join to the correct path of the clone
3. Execute: `yarn install` or `npm install`
4. Execute: `yarn run dev` or `npm run dev`

## Getting Started with Docker

1. Clone the repository with `git clone "repository link"`
2. Execute: `npm install` or `yarn install` in the terminal
3. Execute: `docker-compose -f dev.docker-compose.yml build --no-cache` in the terminal
4. Once built, you must execute the command: `docker-compose -f dev.docker-compose.yml up --force-recreate` in the terminal

NOTE: You have to be standing in the folder containing the: `dev.docker-compose.yml` and you need to install `Docker Desktop` if you are in Windows.

## Description

This page allows you to visualize objects in 3D. In addition to being able to change different properties live through a menu. You can also import models as gltf or glb to visualize them and change their properties. These properties are the position on the canvas (x,y,z), the scale: width, height or depth. You can also hide the title, change the color, metallicity and roughness. It is a 100% responsive page

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
"@testing-library/dom": "^10.4.0"
"@testing-library/jest-dom": "^6.6.3"
"@testing-library/user-event": "^14.5.2"
"@types/jest": "^29.5.14"
"@types/three": "^0.161.2"
"jest": "^29.7.0"
"jest-environment-jsdom": "^29.7.0"
"ts-jest": "^29.2.5"
"ts-node": "^10.9.2"
"typescript": "^5.3.3"
"vite": "^7.1.6"
```

## Portfolio Link

[`https://www.diegolibonati.com.ar/#/project/3D-Object-Viewer`](https://www.diegolibonati.com.ar/#/project/3D-Object-Viewer)

## Video

https://www.youtube.com/watch?v=EYpagLf3rKw&ab_channel=Die

## Testing

1. Join to the correct path of the clone
2. Execute: `yarn test` or `npm test`

## Known Issues
