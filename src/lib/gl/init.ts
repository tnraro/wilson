import { createProgram, createShader } from "./webgl";
import fruitVert from "./fruit.vertex.glsl?raw";
import fruitFrag from "./fruit.fragment.glsl?raw";

export const createContext = (canvas: HTMLCanvasElement) => {
  const gl = canvas.getContext("webgl2");
  if (gl == null) throw new Error("WebGL2: Can't use WebGL2");

  const fruit = {
    program: createProgram(gl,
      createShader(gl, gl.VERTEX_SHADER, fruitVert),
      createShader(gl, gl.FRAGMENT_SHADER, fruitFrag)),
  };

  return {
    fruit,
  };
}
