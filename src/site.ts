/**
 * WebGL vertex shader where position of the vertexes is set directly.
 */
const vertexShaderSource = `
attribute vec2 a_position;
uniform vec2 u_translation;

void main() {
    gl_Position = vec4(a_position + u_translation, 0.0, 1.0);
}
`;

/**
 * WebGL fragment shader
 */
const fragmentShaderSource = `
precision mediump float;

void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`;

const maxCells = 64;
const cellSize = 2.0 / maxCells;

main();

function main(): void {
  const canvas = document.querySelector("canvas");
  if (!canvas) {
    throw new Error(
      "Canvas element not found. Please ensure there is a <canvas> element in the HTML."
    );
  }

  const gl = canvas.getContext("webgl");
  if (!gl) {
    throw new Error(
      "WebGL not supported. Please use a browser that supports WebGL."
    );
  }

  // Create WebGL program with vertex and fragment shaders
  const vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  const fragmentShader = createShader(
    gl,
    fragmentShaderSource,
    gl.FRAGMENT_SHADER
  );
  const program = createProgram(gl, vertexShader, fragmentShader);

  setupVertexShaderData(gl, program);

  updateCanvasSize(gl, canvas);
  window.addEventListener("resize", () => {
    updateCanvasSize(gl, canvas);
  });

  startAnimation(gl, program, performance.now());
}

/**
 * Creates a WebGL shader from the provided source code and type.
 * Copied from: https://developer.mozilla.org/en-US/docs/Web/API/WebGLShader
 * @param gl The WebGL rendering context.
 * @param sourceCode The GLSL source code for the shader.
 * @param type The type of shader (VERTEX_SHADER or FRAGMENT_SHADER).
 * @returns The created WebGLShader.
 */
function createShader(
  gl: WebGLRenderingContext,
  sourceCode: string,
  type: GLenum
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("Could not create shader.");
  }

  gl.shaderSource(shader, sourceCode);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    throw new Error(`Could not compile WebGL program. \n\n${info}`);
  }

  return shader;
}

/**
 * Creates a WebGL program by attaching the provided vertex and fragment shaders.
 * @param gl The WebGL rendering context.
 * @param vertexShader The compiled vertex shader.
 * @param fragmentShader The compiled fragment shader.
 * @returns The created WebGLProgram.
 */
function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    throw new Error(`Could not compile WebGL program. \n\n${info}`);
  }

  gl.useProgram(program);

  return program;
}

/**
 * Sets up the vertex shader data by creating a buffer for the vertex positions
 * and binding it to the shader's attribute.
 * @param gl The WebGL rendering context.
 * @param program The WebGL program.
 */
function setupVertexShaderData(
  gl: WebGLRenderingContext,
  program: WebGLProgram
): void {
  // Create a buffer with the positions of the vertices of the triangles
  // The y-coordinate is inverted because source example starts top left
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = new Float32Array([
    0,
    0,
    cellSize,
    0,
    0,
    -cellSize,
    0,
    -cellSize,
    cellSize,
    0,
    cellSize,
    -cellSize,
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  // Bind the position buffer to the shader's attribute
  const positionLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
}

/**
 * Updates the canvas size/resolution, viewport and resolution uniform variable.
 * @param gl The WebGL rendering context.
 * @param program The WebGL program.
 * @param canvas The HTML canvas element.
 */
function updateCanvasSize(
  gl: WebGLRenderingContext,
  canvas: HTMLCanvasElement
): void {
  // Set the canvas size/resolution
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  // Set the viewport to match the canvas size
  gl.viewport(0, 0, canvas.width, canvas.height);
}

/**
 * Starts the animation loop, updating the time uniform variable and drawing triangles.
 * @param gl The WebGL rendering context.
 * @param program The WebGL program.
 */
function startAnimation(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  startTime: DOMHighResTimeStamp
): void {
  const translationLocation = gl.getUniformLocation(program, "u_translation");

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Start the animation loop
  const render = (currentTime: DOMHighResTimeStamp) => {
    const elapsedTime = currentTime - startTime;
    const animationFrame = Math.floor(elapsedTime / 100) % maxCells;

    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw cells
    for (let cellX = 0; cellX < maxCells; cellX++) {
      const cellY = cellX ^ animationFrame;

      // Set the translation for the current cell
      // Cell position * cell size, normalized to the range [-1, 1]
      // The y-coordinate is inverted because source example starts top left
      gl.uniform2f(
        translationLocation,
        cellX * cellSize - 1,
        cellY * -cellSize + 1
      );

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
}
