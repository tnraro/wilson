<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Canvas from "./canvas.svelte";
  import Cask from "./cask.svelte";
  import { fruitData, type No } from "./fruit";
  import { createGame, run, type Game } from "./game";
  import { BackgroundRenderer } from "./system/background-renderer";
  import { gameoverSystem } from "./system/gameover-system";
  import { PromotionSystem } from "./system/promotion-system";
  import { UiRenderer } from "./system/ui-renderer";
  import { Webgl2Renderer } from "./system/webgl2-renderer";

  const cask = { width: 5, height: 6, scale: 100 };

  let canvas: HTMLCanvasElement;
  let ui: HTMLCanvasElement;
  let bg: HTMLCanvasElement;

  let game: Game | undefined;
  let currentFruit: No = 1;

  let isDangerous = false;

  let unsubscribes: (() => void)[] = [];

  onMount(() => {
    game = createGame({
      cask,
      systems: [
        new Webgl2Renderer(canvas),
        new BackgroundRenderer(bg, cask.width, cask.height),
        new UiRenderer(ui, cask.width, cask.height),
        new PromotionSystem(),
        gameoverSystem,
      ],
    });
    unsubscribes.push(
      game.isDangerousSignal.subscribe((value) => {
        isDangerous = value;
      })
    );
    unsubscribes.push(
      game.next.signal.subscribe((value) => {
        currentFruit = value[0];
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
    game.context.mouseX = Math.max(Math.min(e.detail.x, cask.width - radius), radius);
    if (e.detail.type === "click") {
      if (game.context.isSpawnDelaying) return;
      game.context.isSpawnDelaying = true;
      setTimeout(() => {
        if (game == null) return;
        game.context.isSpawnDelaying = false;
      }, 500);
      game.fruits.add(game.context.mouseX, game.context.mouseY);
      game.next.next();
    }
  }}
  {isDangerous}
>
  <Canvas bind:canvas={bg} />
  <Canvas bind:canvas />
  <Canvas bind:canvas={ui} />
</Cask>
