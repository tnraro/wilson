<script lang="ts">
  import fruitUvs from "asset/fruits.json";
  import fruitTextureAtlas from "asset/fruits.webp";
  import fragmentShaderSource from "lib/gl/fruit.fragment.glsl?raw";
  import vertexShaderSource from "lib/gl/fruit.vertex.glsl?raw";
  import { onDestroy, onMount } from "svelte";
  import Canvas from "./canvas.svelte";
  import Cask from "./cask.svelte";
  import { Fruit, FruitConstants, fruitData, type No } from "./fruit";
  import { createGame, run, type Game } from "./game";
  import { initAttr, initGl, initProgram, setRect } from "./gl/helper";
  import { lerp, multiply, rotation, scaling, translation } from "./math";

  const cask = { width: 5, height: 6, scale: 100 };
  const sx = (x: number) => {
    if (canvas == null || game == null) return 0;
    const scale = canvas.width / game.options.cask.width;
    return x * scale;
  };
  const sy = (y: number) => {
    if (canvas == null || game == null) return 0;
    const scale = canvas.height / (game.options.cask.height + 2);
    return (game.options.cask.height + 2 - y) * scale;
  };
  const vaos = {} as { [K in No]: WebGLVertexArrayObject };
  const createFruitVao = (
    gl: WebGL2RenderingContext,
    pos: number,
    uv: number,
    no: No
  ) => {
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

    vaos[no] = vao;

    return vao;
  };

  let canvas: HTMLCanvasElement;
  let ui: HTMLCanvasElement;
  let bg: HTMLCanvasElement;

  let game: Game | undefined;
  let currentFruit: No = 1;
  let nextFruit: No = 1;
  let score = 0;

  let isDangerous = false;

  let unsubscribes: (() => void)[] = [];

  let mouseX = 0;
  let mouseY = 0;

  let isSpawnDelaying = false;

  onMount(() => {
    const gl = initGl(canvas);

    const program = initProgram(gl, vertexShaderSource, fragmentShaderSource);

    const attrBy = initAttr(gl, program, {
      uv: "uv",
      pos: "pos",
    });

    const uniformBy = initAttr(gl, program, {
      resolution: "resolution",
      matrix: "matrix",
    });

    for (const fruit of Object.values(fruitData)) {
      createFruitVao(gl, attrBy.pos, attrBy.uv, fruit.no);
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
      new Uint8Array([0, 0, 0, 0])
    );
    const image = new Image();
    image.src = fruitTextureAtlas;
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
    const markedFruits = new WeakSet<Fruit>();
    game = createGame({
      cask,
      systems: [
        {
          // promote
          update(game) {
            const fruits = game.fruits.signal.value;
            for (const fruit of fruits) {
              game.world.contactsWith(fruit.collider, (other) => {
                if (markedFruits.has(fruit)) return;
                const fruit2 = game.fruits.colliderToFruit.get(other);
                if (fruit2 == null) return;
                if (fruit.no !== fruit2.no) return;
                if (markedFruits.has(fruit2)) return;

                const { pos } = fruit;
                const { pos: pos2 } = fruit2;
                const t = pos2.y < pos.y ? 0.9 : 0.1;
                const center = lerp(pos, pos2, t);
                fruit.rigidBody.setTranslation(center, false);

                const score = fruitData[fruit.no].score;
                game.score.append(score);

                if (fruit.no < 11) {
                  fruit.promote();
                  setTimeout(() => {
                    markedFruits.delete(fruit);
                  }, 100);
                  game.fruits.delete(fruit2);
                } else {
                  game.fruits.delete(fruit);
                  game.fruits.delete(fruit2);
                }
                markedFruits.add(fruit);
                markedFruits.add(fruit2);
              });
            }
          },
        },
        {
          // gameover
          update(game, delta) {
            const fruits = game.fruits.signal.value;
            isDangerous = false;
            for (const fruit of fruits) {
              const { pos } = fruit;
              if (
                pos.x < 0 ||
                pos.x > game.options.cask.width ||
                pos.y > game.options.cask.height ||
                pos.y < 0
              ) {
                if (fruit.out(delta)) {
                  setTimeout(() => {
                    alert(`게임 오버\n${game.score.signal.value}점\n(닫으면 재시작 됩니다)`);
                    location.reload();
                  });
                  throw new Error("게임 오버");
                }
                isDangerous = true;
              } else {
                fruit.in();
              }
            }
          },
        },
        {
          update(game, delta) {
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.useProgram(program);

            gl.uniform2f(
              uniformBy.resolution,
              game.options.cask.width,
              game.options.cask.height + 2
            );
            const fruits = game.fruits.signal.value;
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

            for (const fruit of fruits) {
              const { pos } = fruit;
              const { radius } = fruitData[fruit.no];

              const loc = translation(pos.x, pos.y);
              const rot = rotation(-fruit.rotation);
              const sca = scaling(radius * 2, radius * 2);

              let mat = multiply(sca, rot);
              mat = multiply(mat, loc);

              gl.bindVertexArray(vaos[fruit.no]);

              gl.uniformMatrix3fv(uniformBy.matrix, false, mat);

              gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
            }
            if (!isSpawnDelaying) {
              const { radius } = fruitData[currentFruit];

              const loc = translation(mouseX, mouseY);
              const sca = scaling(radius * 2, radius * 2);

              const mat = multiply(sca, loc);

              gl.bindVertexArray(vaos[currentFruit]);
              gl.uniformMatrix3fv(uniformBy.matrix, false, mat);
              gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
            }
            {
              const x = game.options.cask.width;
              const y = game.options.cask.height + 0.5 + 0.12;
              const size = 0.2;

              const loc = translation(x - 0.3, y);
              const sca = scaling(size * 2, size * 2);

              const mat = multiply(sca, loc);

              gl.bindVertexArray(vaos[nextFruit]);
              gl.uniformMatrix3fv(uniformBy.matrix, false, mat);
              gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
            }
          },
        },
        {
          // bg
          update(game) {
            if (bg == null) return;
            const context = bg.getContext("2d")!;
            context.clearRect(0, 0, bg.width, bg.height);

            const { radius } = fruitData[currentFruit];

            // guideline
            context.beginPath();
            context.strokeStyle = "#43484e" /* slate-7 */;
            context.moveTo(sx(mouseX), sx(2));
            context.lineTo(sx(mouseX), sy(0));
            context.stroke();
          },
        },
        {
          // ui
          update(game) {
            if (ui == null) return;
            const context = ui.getContext("2d")!;
            context.clearRect(0, 0, ui.width, ui.height);
            for (const fruit of game.fruits.signal.value) {
              const { pos, no, timer } = fruit;
              const { radius, } = fruitData[no];

              const x = sx(pos.x);
              const y = sy(pos.y);
              const r = sx(radius);

              if (timer < FruitConstants.MaxTimer) {
                const gradient = context.createRadialGradient(x, y, 0, x, y, r);
                gradient.addColorStop(0, "red");
                gradient.addColorStop(1, "transparent");
                context.fillStyle = gradient;
                context.fillRect(x - r, y - r, r * 2, r * 2);
                context.fillStyle = "pink";
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.font = `bold ${r}px sans-serif`;
                context.fillText(Math.ceil(timer) + "", x, y);
              }
            }
            {
              const x = 0;
              const y = sx(1 + 0.5);
              const fontSize = sx(0.3);
              const text = `${score}점`;
              const chars = (score === 0 ? 0 : Math.log10(score)) + 1;
              const gradient = context.createLinearGradient(
                sx(x + 0.3 * (chars - 4)),
                y,
                sx(x + 0.3 * chars),
                y
              );
              gradient.addColorStop(0, "#edeef0" /* slate-12*/);
              gradient.addColorStop(0.33, "#75c7f0" /* sky-11 */);
              gradient.addColorStop(0.5, "#70b8ff" /* blue-11 */);
              gradient.addColorStop(1, "#5472e4" /* indigo-10 */);
              context.textAlign = "start";
              context.fillStyle = gradient;
              context.font = `bold ${fontSize}px sans-serif`;
              context.strokeStyle = "black";
              context.lineWidth = 4;
              context.strokeText(text, x, y);
              context.fillText(text, x, y);
            }

            {
              const x = sx(game.options.cask.width);
              const y = sx(1 + 0.5);
              const fontSize = sx(0.3);
              const text = `다음`;
              context.textAlign = "end";
              context.strokeText(text, x - fontSize * 2, y);
              context.fillText(text, x - fontSize * 2, y);
            }
          },
        },
      ],
    });
    mouseX = game.options.cask.width / 2;
    mouseY = game.options.cask.height;
    unsubscribes.push(
      game.next.signal.subscribe((value) => {
        currentFruit = value[0];
        nextFruit = value[1];
      })
    );
    unsubscribes.push(
      game.score.signal.subscribe((value) => {
        score = value;
      })
    );
    unsubscribes.push(run(game!));
  });
  onDestroy(() => {
    for (const unsubscribe of unsubscribes) {
      unsubscribe();
    }
    game = undefined;
  });
</script>

<Cask
  {...cask}
  on:mouse={(e) => {
    if (game == null) return;
    const radius = fruitData[currentFruit].radius;
    mouseX = Math.max(Math.min(e.detail.x, cask.width - radius), radius);
    if (e.detail.type === "click") {
      if (isSpawnDelaying) return;
      isSpawnDelaying = true;
      setTimeout(() => {
        isSpawnDelaying = false;
      }, 500);
      game.fruits.add(mouseX, mouseY);
      game.next.next();
    }
  }}
  {isDangerous}
>
  <Canvas bind:canvas={bg} />
  <Canvas bind:canvas />
  <Canvas bind:canvas={ui} />
</Cask>
