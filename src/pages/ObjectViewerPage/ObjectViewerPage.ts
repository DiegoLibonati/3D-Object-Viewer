import { Control } from "@src/components/Control/Control";

import { ObjectViewer } from "@src/core/ObjectViewer";

import assets from "@src/assets/export";

import "@src/pages/ObjectViewerPage/ObjectViewerPage.css";

export const ObjectViewerPage = (): HTMLDivElement => {
  const divRoot = document.createElement("div");
  divRoot.className = "object-viewer-page";

  divRoot.innerHTML = `
    <canvas
        class="viewer__canvas"
        aria-label="Canvas for 3D visualization"
    ></canvas>

    <div>

        <div class="controls" aria-labelledby="controls__title"></div>

        <div class="alert" aria-live="polite">
            <div class="alert__wrapper">
                <h2 class="alert__title"></h2>
                <button class="alert__button" aria-label="Close alert">Close</button>
            </div>
        </div>

        <form class="upload">
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

  const canvas = divRoot.querySelector<HTMLCanvasElement>(".viewer__canvas");
  const controls = divRoot.querySelector<HTMLDivElement>(".controls");

  const controlArrowLeft = Control({
    label: "Left",
    srcImg: assets.images.Arrow,
    className: "control--left",
  });
  const controlArrowRight = Control({
    label: "Right",
    srcImg: assets.images.Arrow,
    className: "control--right",
  });

  controls?.append(controlArrowLeft, controlArrowRight);

  new ObjectViewer(canvas!);

  return divRoot;
};
