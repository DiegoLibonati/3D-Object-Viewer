import { getElements } from "./getElements";

import { OFFICIAL_BODY } from "../../tests/jest.constants";

describe("getElements.ts", () => {
  describe("General Tests.", () => {
    beforeEach(() => {
      document.body.innerHTML = OFFICIAL_BODY;
    });

    afterEach(() => {
      document.body.innerHTML = "";
    });

    test("It must render the elements of the document that the 'getElements' function exports.", () => {
      const {
        canvas,
        buttonModal,
        inputFile,
        leftKeyboard,
        modalContainer,
        modalText,
        rightKeyboard,
      } = getElements();

      expect(canvas).toBeInTheDocument();
      expect(buttonModal).toBeInTheDocument();
      expect(inputFile).toBeInTheDocument();
      expect(leftKeyboard).toBeInTheDocument();
      expect(modalContainer).toBeInTheDocument();
      expect(modalText).toBeInTheDocument();
      expect(rightKeyboard).toBeInTheDocument();
    });
  });
});
