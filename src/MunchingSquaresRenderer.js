export class MunchingSquaresRenderer {
  static #maxCells = 64;

  #canvasContext2d;
  #count = 0;

  /**
   * @param {CanvasRenderingContext2D} canvasContext2d
   */
  constructor(canvasContext2d) {
    this.#canvasContext2d = canvasContext2d;
  }

  drawFrame() {
    const canvas = this.#canvasContext2d.canvas;
    const cellWidth = Math.floor(
      canvas.width / MunchingSquaresRenderer.#maxCells
    );
    const cellHeight = Math.floor(
      canvas.height / MunchingSquaresRenderer.#maxCells
    );

    this.#canvasContext2d.fillStyle = "black";
    this.#canvasContext2d.fillRect(0, 0, canvas.width, canvas.height);

    this.#canvasContext2d.fillStyle = "white";
    for (let x = 0; x < MunchingSquaresRenderer.#maxCells; x++) {
      const y = x ^ this.#count;
      this.#canvasContext2d.fillRect(
        x * cellWidth,
        y * cellHeight,
        cellWidth,
        cellHeight
      );
    }

    if (this.#count >= MunchingSquaresRenderer.#maxCells) {
      this.#count = 0;
    } else {
      this.#count++;
    }
  }
}
