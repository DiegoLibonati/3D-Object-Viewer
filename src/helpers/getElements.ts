export const getElements = () => ({
  canvas: document.querySelector(".viewer__canvas") as HTMLCanvasElement,
  rightKeyboard: document.getElementById("right") as HTMLImageElement,
  leftKeyboard: document.getElementById("left") as HTMLImageElement,
  inputFile: document.querySelector(".upload__input") as HTMLInputElement,
  modalContainer: document.querySelector(".alert") as HTMLElement,
  modalText: document.querySelector(".alert__title") as HTMLHeadingElement,
  buttonModal: document.querySelector(".alert__button") as HTMLButtonElement,
});
