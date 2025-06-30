/**
 * WebGL vertex shader where position of the vertexes is set directly.
 */
var vertexShaderSource = "\nattribute vec2 a_position;\nuniform vec2 u_translation;\n\nvoid main() {\n    gl_Position = vec4(a_position + u_translation, 0.0, 1.0);\n}\n";
/**
 * WebGL fragment shader
 */
var fragmentShaderSource = "\nprecision mediump float;\n\nvoid main() {\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n}\n";
var maxCells = 64;
var cellSize = 2.0 / maxCells;
main();
function main() {
    var canvas = document.querySelector("canvas");
    if (!canvas) {
        throw new Error("Canvas element not found. Please ensure there is a <canvas> element in the HTML.");
    }
    var gl = canvas.getContext("webgl");
    if (!gl) {
        throw new Error("WebGL not supported. Please use a browser that supports WebGL.");
    }
    // Create WebGL program with vertex and fragment shaders
    var vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    var fragmentShader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    var program = createProgram(gl, vertexShader, fragmentShader);
    setupVertexShaderData(gl, program);
    updateCanvasSize(gl, canvas);
    window.addEventListener("resize", function () {
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
function createShader(gl, sourceCode, type) {
    var shader = gl.createShader(type);
    if (!shader) {
        throw new Error("Could not create shader.");
    }
    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var info = gl.getShaderInfoLog(shader);
        throw new Error("Could not compile WebGL program. \n\n".concat(info));
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
function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        var info = gl.getProgramInfoLog(program);
        throw new Error("Could not compile WebGL program. \n\n".concat(info));
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
function setupVertexShaderData(gl, program) {
    // Create a buffer with the positions of the vertices of the triangles
    // The y-coordinate is inverted because source example starts top left
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var positions = new Float32Array([
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
    var positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
}
/**
 * Updates the canvas size/resolution, viewport and resolution uniform variable.
 * @param gl The WebGL rendering context.
 * @param program The WebGL program.
 * @param canvas The HTML canvas element.
 */
function updateCanvasSize(gl, canvas) {
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
function startAnimation(gl, program, startTime) {
    var translationLocation = gl.getUniformLocation(program, "u_translation");
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Start the animation loop
    var render = function (currentTime) {
        var elapsedTime = currentTime - startTime;
        var animationFrame = Math.floor(elapsedTime / 100) % maxCells;
        gl.clear(gl.COLOR_BUFFER_BIT);
        // Draw cells
        for (var cellX = 0; cellX < maxCells; cellX++) {
            var cellY = cellX ^ animationFrame;
            // Set the translation for the current cell
            // Cell position * cell size, normalized to the range [-1, 1]
            // The y-coordinate is inverted because source example starts top left
            gl.uniform2f(translationLocation, cellX * cellSize - 1, cellY * -cellSize + 1);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
        requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
}
