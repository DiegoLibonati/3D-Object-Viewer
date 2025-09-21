import { ObjectViewer } from "@src/models/ObjectViewer";
import { getElements } from "@src/helpers/getElements";

const onInit = () => {
  const { canvas } = getElements();

  new ObjectViewer(canvas);
};

document.addEventListener("DOMContentLoaded", onInit);
