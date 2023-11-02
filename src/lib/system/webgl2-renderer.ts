import fruitUvs from "asset/fruits.json";
import fruitTextureAtlas from "asset/fruits.webp";
import { Fruit, fruitData, type No } from "lib/fruit";
import fruitFrag from "lib/gl/fruit.fragment.glsl?raw";
import fruitVert from "lib/gl/fruit.vertex.glsl?raw";
import { initAttr, initGl, initProgram, initUniform, setRect } from "lib/gl/helper";
import type { ISystem } from "./types";
import type { Game } from "lib/game";
import { translation, rotation, scaling, multiply, type IVec2 } from "lib/math";

export class Webgl2Renderer implements ISystem {
  #gl: WebGL2RenderingContext
  #fruit

  constructor(canvas: HTMLCanvasElement) {
    const gl = initGl(canvas);

    const fruitProgram = initProgram(gl, fruitVert, fruitFrag);

    const attrBy = initAttr(gl, fruitProgram, {
      uv: "uv",
      pos: "pos",
    });

    const uniformBy = initUniform(gl, fruitProgram, {
      resolution: "resolution",
      matrix: "matrix",
    });

    const vaoBy = {} as any;
    for (const fruit of Object.values(fruitData)) {
      vaoBy[fruit.no] = Webgl2Renderer.#createFruitVao(gl, attrBy.pos, attrBy.uv, fruit.no);
    }

    const textureAtlas = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textureAtlas);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 0])
    );
    const image = new Image();
    image.src = fruitTextureAtlas;
    image.addEventListener(
      "load",
      () => {
        gl.bindTexture(gl.TEXTURE_2D, textureAtlas);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          image
        );
        gl.generateMipmap(gl.TEXTURE_2D);
      },
      { once: true }
    );

    this.#gl = gl;
    this.#fruit = {
      program: fruitProgram,
      vaoBy,
      attrBy,
      uniformBy,
      textureAtlas,
    } satisfies {
      program: WebGLProgram,
      vaoBy: Record<No, WebGLVertexArrayObject>,
      attrBy: Record<string, number>,
      uniformBy: Record<string, WebGLUniformLocation | null>,
      textureAtlas: WebGLTexture | null,
    }
  }
  update(game: Game) {
    this.#clear();
    this.#initFruit(game.options.cask.width, game.options.cask.height);

    const fruits = game.fruits.signal.value;

    for (const fruit of fruits) {
      this.#drawFruit(fruit);
    }
    this.#drawCurrentFruit(game);
    this.#drawNextFruit(game);
  }
  #clear() {
    const gl = this.#gl;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
  #initFruit(caskWidth: number, caskHeight: number) {
    const gl = this.#gl;
    const { program, uniformBy } = this.#fruit;
    gl.useProgram(program);

    gl.uniform2f(
      uniformBy.resolution,
      caskWidth,
      caskHeight + 2
    );
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR
    );
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_WRAP_S,
      gl.CLAMP_TO_EDGE
    );
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_WRAP_T,
      gl.CLAMP_TO_EDGE
    );
  }
  #drawFruit(fruit: { no: No, pos: IVec2, rotation: number }) {
    const gl = this.#gl;
    const { no, pos } = fruit;
    const { radius } = fruitData[no];

    const loc = translation(pos.x, pos.y);
    const rot = rotation(-fruit.rotation);
    const scale = radius * 2 * 1.1;
    const sca = scaling(scale, scale);

    let mat = multiply(sca, rot);
    mat = multiply(mat, loc);

    gl.bindVertexArray(this.#fruit.vaoBy[no]);
    gl.uniformMatrix3fv(this.#fruit.uniformBy.matrix, false, mat);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }
  #drawCurrentFruit(game: Game) {
    if (!game.context.isSpawnDelaying) {
      this.#drawFruit({
        no: game.next.signal.value[0],
        pos: { x: game.context.mouseX, y: game.context.mouseY },
        rotation: 0,
      });
    }
  }
  #drawNextFruit(game: Game) {
    const gl = this.#gl;
    // TODO: Fruit가 matrix를 지원하지 않아서 수동으로 입력
    const x = game.options.cask.width;
    const y = game.options.cask.height + 0.5 + 0.12;
    const size = 0.2;

    const loc = translation(x - 0.3, y);
    const sca = scaling(size * 2, size * 2);

    const mat = multiply(sca, loc);

    const no = game.next.signal.value[1];

    gl.bindVertexArray(this.#fruit.vaoBy[no]);
    gl.uniformMatrix3fv(this.#fruit.uniformBy.matrix, false, mat);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }
  static #createFruitVao(
    gl: WebGL2RenderingContext,
    pos: number,
    uv: number,
    no: No
  ) {
    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setRect(gl);
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(fruitUvs[no]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(uv);
    gl.vertexAttribPointer(uv, 2, gl.FLOAT, true, 0, 0);

    return vao;
  };
}