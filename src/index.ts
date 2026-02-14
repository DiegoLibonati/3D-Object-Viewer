import "@/index.css";
import { ObjectViewerPage } from "@/pages/ObjectViewerPage/ObjectViewerPage";

const onInit = (): void => {
  const app = document.querySelector<HTMLDivElement>("#app");

  if (!app) throw new Error(`You must render a container to mount the app.`);

  const objectViewerPage = ObjectViewerPage();
  app.appendChild(objectViewerPage);
};

document.addEventListener("DOMContentLoaded", onInit);
