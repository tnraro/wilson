<script lang="ts">
  import fruitsUv from "asset/fruits.json";
  import fruitsTexture from "asset/fruits.webp";
  import { fruitData, type No } from "lib/fruit";
  import fragmentShaderSource from "lib/gl/fruit.fragment.glsl?raw";
  import vertexShaderSource from "lib/gl/fruit.vertex.glsl?raw";
  import { createProgram, createShader } from "lib/gl/webgl";
  import { multiply, rotation, scaling, translation } from "lib/math";
  import { onMount } from "svelte";

  const setRect = (gl: WebGL2RenderingContext) => {
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5]),
      gl.STATIC_DRAW
    );
  };

  const fruits: { no: No; x: number; y: number; rotation: number }[] = [
    { no: 1, x: 1, y: 0.25, rotation: Math.random() * Math.PI * 2 },
    { no: 2, x: 2, y: 0.5, rotation: Math.random() * Math.PI * 2 },
    { no: 3, x: 3, y: 1.0, rotation: Math.random() * Math.PI * 2 },
    { no: 4, x: 4, y: 1.5, rotation: Math.random() * Math.PI * 2 },
    { no: 8, x: 1, y: 7, rotation: Math.random() * Math.PI * 2 },
    { no: 7, x: 2, y: 5.25, rotation: Math.random() * Math.PI * 2 },
    { no: 6, x: 3, y: 3.75, rotation: Math.random() * Math.PI * 2 },
    { no: 5, x: 4, y: 2.5, rotation: Math.random() * Math.PI * 2 },
    { no: 5, x: 3, y: 2.5, rotation: Math.random() * Math.PI * 2 },
    { no: 11, x: 1, y: 2.5, rotation: Math.random() * Math.PI * 2 },
  ];

  const vaos: { [K in No]: WebGLVertexArrayObject } = {} as any;

  const createVao = (
    gl: WebGL2RenderingContext,
    positionAttributeLocation: number,
    texcoordAttributeLocation: number,
    uv: number[]
  ) => {
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setRect(gl);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texcoordAttributeLocation);
    gl.vertexAttribPointer(texcoordAttributeLocation, 2, gl.FLOAT, true, 0, 0);

    return vao;
  };

  let canvas: HTMLCanvasElement;

  onMount(() => {
    const gl = canvas.getContext("webgl2");
    if (!gl) {
      alert("can't use webgl2");
      return;
    }
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    const program = createProgram(gl, vertexShader, fragmentShader);

    const positionAttributeLocation = gl.getAttribLocation(
      program,
      "a_position"
    );
    const texcoordAttributeLocation = gl.getAttribLocation(
      program,
      "a_texcoord"
    );

    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const matrixLocation = gl.getUniformLocation(program, "u_matrix");

    for (const fruit of Object.values(fruitData)) {
      vaos[fruit.no] = createVao(
        gl,
        positionAttributeLocation,
        texcoordAttributeLocation,
        fruitsUv[fruit.no]
      )!;
    }

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 255, 255])
    );
    const image = new Image();
    image.src = fruitsTexture;
    image.addEventListener(
      "load",
      () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
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

    gl.canvas.width = 500;
    gl.canvas.height = 800;

    // render

    const render = () => {
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      gl.uniform2f(resolutionLocation, 5, 8);

      for (const fruit of fruits) {
        fruit.rotation =  Math.random() * Math.PI * 2;
        const { radius } = fruitData[fruit.no];

        const loc = translation(fruit.x, fruit.y);
        const rot = rotation(fruit.rotation);
        const sca = scaling(radius * 2, radius * 2);

        let mat = multiply(sca, rot);
        mat = multiply(mat, loc);

        gl.bindVertexArray(vaos[fruit.no]);

        gl.uniformMatrix3fv(matrixLocation, false, mat);
        gl.texParameteri(
          gl.TEXTURE_2D,
          gl.TEXTURE_MIN_FILTER,
          gl.LINEAR_MIPMAP_LINEAR
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
      }
      // setTimeout(render, 100);
      requestAnimationFrame(render);
    };
    render();
  });
</script>

<canvas bind:this={canvas} />

<style>
  canvas {
    outline: 1px solid red;
  }
</style>
