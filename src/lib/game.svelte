<script lang="ts">
  import { onMount } from "svelte";
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

  let canvas = $state<HTMLCanvasElement>(null!);
  let ui = $state<HTMLCanvasElement>(null!);
  let bg = $state<HTMLCanvasElement>(null!);
  let gameOver: HTMLDialogElement;

  let game: Game | undefined;
  let currentFruit: No = 1;

  let score = $state(0);

  let isDangerous = $state(false);

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
    const unsubscribes: (() => void)[] = [];
    unsubscribes.push(
      game.isDangerousSignal.subscribe((value) => {
        isDangerous = value;
      })
    );
    unsubscribes.push(
      game.isRunningSignal.subscribe((value) => {
        const isGameOver = !value;
        if (isGameOver) {
          console.log("게임 오버");
          score = game?.score.signal.value ?? 0;
          game?.score.save();
          gameOver.showModal();
        }
      })
    );
    unsubscribes.push(
      game.next.signal.subscribe((value) => {
        currentFruit = value[0];
      })
    );
    unsubscribes.push(run(game!));

    return () => {
      for (const unsubscribe of unsubscribes) {
        unsubscribe();
      }
      game = undefined;
    };
  });
</script>

<Cask
  {...cask}
  onmouse={(e) => {
    if (game == null) return;
    if (!game.isRunningSignal.value) {
      return;
    }
    const radius = fruitData[currentFruit].radius;
    game.context.mouseX = Math.max(Math.min(e.x, cask.width - radius), radius);
    if (e.type === "click") {
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
<dialog bind:this={gameOver}>
  <form class="game-over">
    <h1 class="game-over__title">{score}점</h1>
    <button
      class="game-over__button"
      onclick={() => {
        location.reload();
      }}>다시하기</button
    >
  </form>
</dialog>

<style lang="scss">
  @use "../style/color";
  dialog {
    background: transparent;
    padding: 0;
    border: none;
    outline: none;
    overflow: visible;
  }
  .game-over {
    display: flex;
    flex-flow: column;
    gap: 0.5rem;
    user-select: none;
    color: color.$slate-12;
    background: rgba(color.$slate-3, 0.8);
    padding: 1rem 1.5rem;
    border-radius: 1rem;
    box-sizing: border-box;
    &__title {
      font-size: 2rem;
      font-weight: 900;
    }
    &__button {
      appearance: none;
      background: transparent;
      outline: none;
      border: none;
      padding: 0.5rem 1rem;
      color: color.$slate-12;
      border-radius: 0.25rem;
      &:active {
        background: color.$slate-5;
      }
      &:focus {
        outline: 2px solid color.$slate-7;
      }
    }
  }
</style>
