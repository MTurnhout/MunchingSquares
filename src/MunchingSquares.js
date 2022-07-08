class MunchingSquares {
  static #maxCells = 64;

  #canvasContext2d;
  #count = 1;

  /**
   * @param {CanvasRenderingContext2D} canvasContext2d
   */
  constructor(canvasContext2d) {
    this.#canvasContext2d = canvasContext2d;
  }

  drawFrame() {
    const canvas = this.#canvasContext2d.canvas;
    const cellWidth = Math.floor(canvas.width / MunchingSquares.#maxCells);
    const cellHeight = Math.floor(canvas.height / MunchingSquares.#maxCells);

    this.#canvasContext2d.fillStyle = "black";
    this.#canvasContext2d.fillRect(0, 0, canvas.width, canvas.height);

    this.#canvasContext2d.fillStyle = "white";
    for (let y = 0; y < MunchingSquares.#maxCells; y++) {
      for (let x = 0; x < MunchingSquares.#maxCells; x++) {
        if (y === (x ^ this.#count)) {
          this.#canvasContext2d.fillRect(
            x * cellWidth,
            y * cellHeight,
            cellWidth,
            cellHeight
          );
        }
      }
    }

    if (this.#count >= MunchingSquares.#maxCells) {
      this.#count = 1;
    } else {
      this.#count++;
    }
  }
}
