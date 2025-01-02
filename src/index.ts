import { ObjectViewer } from "./models/ObjectViewer";
import { getElements } from "./helpers/getElements";

const onInit = () => {
  const { canvas } = getElements();

  new ObjectViewer(canvas);
};

document.addEventListener("DOMContentLoaded", onInit);
