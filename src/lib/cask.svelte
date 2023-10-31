<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  const toLocalCoords = (x: number, y: number) => {
    const cr = cask.getBoundingClientRect();
    const scale = cr.width / width;
    return {
      x: (x - cr.x) / scale,
      y: height - (y - cr.y) / scale,
    };
  };
  const mouse = (e: MouseEvent) => {
    const { x, y } = toLocalCoords(e.x, e.y);
    tx = x;
    ty = y;

    dispatch("mouse", {
      type: e.type === "click" ? "click" : "move",
      x,
      y,
    });
  };
  const touch = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      tx = e.touches[0].clientX;
      ty = e.touches[0].clientY;
    }
    const { x, y } = toLocalCoords(tx, ty);

    dispatch("mouse", {
      type: e.type === "touchend" ? "click" : "move",
      x,
      y,
    });
  };

  export let width: number;
  export let height: number;
  export let scale: number;
  export let isDangerous = false;

  let tx = 0;
  let ty = 0;
  let it = 0;
  let isDangerousAnimationRunning = false;

  $: {
    if (isDangerous && !isDangerousAnimationRunning) {
      it = 0;
      isDangerousAnimationRunning = true;
    }
  }

  let cask: HTMLDivElement;
</script>

<div
  bind:this={cask}
  class="cask"
  style:---width={width}
  style:---height={height}
  style:---scale={scale}
>
  <div
    class="cask__border"
    class:cask__border--dangerous={isDangerous || isDangerousAnimationRunning}
    on:animationiteration={(e) => {
      it++;
      if (!isDangerous && it % 2 === 0) {
        isDangerousAnimationRunning = false;
      }
    }}
  />
  <slot />
</div>

<svelte:window
  on:mousemove|preventDefault={mouse}
  on:click|preventDefault={mouse}
  on:touchmove|preventDefault|nonpassive={touch}
  on:touchstart|preventDefault|nonpassive={touch}
  on:touchend|preventDefault={touch}
/>

<style lang="scss">
  @use "../style/color";
  $border: 0.5rem;
  $bg: color.$slate-2;
  .cask {
    width: calc(var(---width) * var(---scale) * 1px);
    max-width: calc(
      var(---width) / (var(---height) + 1) * 100dvh - $border * 2
    );
    aspect-ratio: var(---width) / calc(var(---height) + 1);
    position: relative;
    margin: $border;
    user-select: none;
    box-sizing: border-box;
    &__border {
      width: 100%;
      aspect-ratio: var(---width) / var(---height);
      position: absolute;
      border: $border solid transparent;
      bottom: -$border;
      left: -$border;
      border-radius: 2rem;
      background: linear-gradient($bg, $bg) padding-box,
        linear-gradient(color.$indigo-7, color.$indigo-8) border-box;
      &--dangerous {
        &::before {
          content: "";
          width: 100%;
          height: 100%;
          position: absolute;
          border: $border solid transparent;
          top: -$border;
          left: -$border;
          border-radius: 2rem;
          background: linear-gradient($bg, $bg) padding-box,
            radial-gradient(
                farthest-corner at top,
                color.$tomato-12,
                color.$tomato-10,
                color.$indigo-8 120%
              )
              border-box;
          animation: 0.3s infinite alternate pulse ease-in-out;
          box-shadow: 0 0 4rem rgba(color.$tomato-8, 0.3),
            0 0 2rem rgba(color.$tomato-8, 0.3),
            0 0 1rem rgba(color.$tomato-8, 0.3);
        }
      }
    }
  }
  @keyframes pulse {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
