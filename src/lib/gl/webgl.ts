export const createShader = (
  gl: WebGL2RenderingContext,
  type: number,
  source: string
) => {
  const shader = gl.createShader(type);
  if (shader == null) throw new Error("WebGL2: no shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader;
  }
  const log = gl.getShaderInfoLog(shader);
  gl.deleteShader(shader);
  throw new Error(`WebGL2: ${log}`);
};

export const createProgram = (
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) => {
  const program = gl.createProgram();
  if (program == null) throw new Error("WebGL2: no program");
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return program;
  }
  const log = gl.getProgramInfoLog(program);
  gl.deleteProgram(program);
  throw new Error(`WebGL2: ${log}`);
};
