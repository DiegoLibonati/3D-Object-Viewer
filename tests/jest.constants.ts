export const OFFICIAL_BODY = `
  <canvas
    class="viewer__canvas"
    aria-label="Canvas for 3D visualization"
  ></canvas>

  <main>
    <section class="controls" aria-labelledby="controls__title">
      <article class="controls__control controls__control--left">
        <h2 class="controls__label">Left</h2>
        <img
          src="./images/arrow.png"
          id="left"
          alt="Left arrow"
          class="controls__arrow-image"
        />
      </article>

      <article class="controls__control controls__control--right">
        <h2 class="controls__label">Right</h2>
        <img
          src="./images/arrow.png"
          id="right"
          alt="Right arrow"
          class="controls__arrow-image"
        />
      </article>
    </section>

    <section class="alert" aria-live="polite">
      <article class="alert__wrapper">
        <h2 class="alert__title"></h2>
        <button class="alert__button" aria-label="Close alert">Close</button>
      </article>
    </section>

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
  </main>
`;
