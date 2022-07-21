import { MunchingSquaresRenderer } from "./js/MunchingSquaresRenderer.js";

window.addEventListener("load", () => {
  const canvasElement = document.querySelector("canvas");
  const canvasContext2d = canvasElement.getContext("2d");
  const munchingSquares = new MunchingSquaresRenderer(canvasContext2d);

  setCanvasSize();
  window.addEventListener("resize", () => {
    setCanvasSize();
  });

  setInterval(() => {
    munchingSquares.drawFrame();
  }, 1000 / 10);

  function setCanvasSize() {
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;
  }
});
