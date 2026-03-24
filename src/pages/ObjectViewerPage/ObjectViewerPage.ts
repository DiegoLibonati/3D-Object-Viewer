import type { Page } from "@/types/pages";

import { Control } from "@/components/Control/Control";

import { ObjectViewer } from "@/core/ObjectViewer";

import assets from "@/assets/export";

import "@/pages/ObjectViewerPage/ObjectViewerPage.css";

export const ObjectViewerPage = (): Page => {
  const main = document.createElement("main") as Page;
  main.className = "object-viewer-page";

  main.innerHTML = `
    <canvas
        class="viewer__canvas"
        aria-label="3D object viewer"
    ></canvas>

    <div>

        <div class="controls" role="group" aria-label="Object navigation controls"></div>

        <div class="alert" role="alertdialog" aria-modal="true" aria-labelledby="alert-title">
            <div class="alert__wrapper">
                <h2 class="alert__title" id="alert-title"></h2>
                <button class="alert__button" aria-label="Close dialog">Close</button>
            </div>
        </div>

        <form class="upload" aria-label="Upload 3D model">
            <label for="upload__file" class="upload__label">Browse a Model</label>
            <input
                type="file"
                id="upload__file"
                class="upload__input"
                hidden
                accept=".glb,.gltf"
            />
        </form>

    </div>
  `;

  const canvas = main.querySelector<HTMLCanvasElement>(".viewer__canvas")!;
  const controls = main.querySelector<HTMLDivElement>(".controls");

  const controlArrowLeft = Control({
    label: "Left",
    srcImg: assets.images.ArrowPng,
    className: "control--left",
  });
  const controlArrowRight = Control({
    label: "Right",
    srcImg: assets.images.ArrowPng,
    className: "control--right",
  });

  controls?.append(controlArrowLeft, controlArrowRight);

  const viewer = new ObjectViewer(canvas, main);

  main.cleanup = (): void => {
    viewer.dispose();
  };

  return main;
};
