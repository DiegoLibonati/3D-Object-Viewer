import { ControlProps } from "@src/entities/props";

import "@src/components/Control/Control.css";

export const Control = ({
  srcImg,
  label,
  className,
}: ControlProps): HTMLDivElement => {
  const divRoot = document.createElement("div");
  divRoot.className = `control ${className ?? ""} `;

  divRoot.innerHTML = `
    <h2 class="control__label">${label}</h2>
    <img
        src="${srcImg}"
        id=${label.toLowerCase()}
        alt="${label}"
        class="control__image"
    />
  `;

  return divRoot;
};
