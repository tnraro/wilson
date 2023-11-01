import { createProgram, createShader } from "./webgl";

export const initProgram = (gl: WebGL2RenderingContext, vertex: string, fragment: string) => {
  const program = createProgram(gl,
    createShader(gl, gl.VERTEX_SHADER, vertex),
    createShader(gl, gl.FRAGMENT_SHADER, fragment));
  return program;
}

export const initGl = (canvas: HTMLCanvasElement) => {
  const gl = canvas.getContext("webgl2");
  if (gl == null) throw new Error("WebGL2: Can't use WebGL2");

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  return gl;
}

export const initAttr = <AttrNameBy extends Record<string, string>>(gl: WebGL2RenderingContext, program: WebGLProgram, attrNameBy: AttrNameBy) => {
  return objectMap(attrNameBy, (name) => gl.getAttribLocation(program, name));
}
export const initUniform = <UniformNameBy extends Record<string, string>>(gl: WebGL2RenderingContext, program: WebGLProgram, uniformBy: UniformNameBy) => {
  return objectMap(uniformBy, (name) => gl.getUniformLocation(program, name));
}

export const setRect = (gl: WebGL2RenderingContext) => {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, 0.5]),
    gl.STATIC_DRAW
  );
};

// utils
const objectMap = <Obj extends Record<string, unknown>, ReturnType>(
  obj: Obj,
  fn: <K extends keyof Obj>(value: Obj[K], key: K) => ReturnType) => {
  const result = {} as any;
  for (const key of Object.keys(obj) as (keyof Obj)[]) {
    result[key] = fn(obj[key], key);
  }
  return result as Record<keyof Obj, ReturnType>;
}