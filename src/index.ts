import { ObjectViewerPage } from "@src/pages/ObjectViewerPage/ObjectViewerPage";

const onInit = () => {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  const objectViewerPage = ObjectViewerPage();
  app.appendChild(objectViewerPage);
};

document.addEventListener("DOMContentLoaded", onInit);
