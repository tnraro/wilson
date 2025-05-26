<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import { on } from "svelte/events";

  const toLocalCoords = (x: number, y: number) => {
    const cr = cask.getBoundingClientRect();
    const scale = cr.width / width;
    return {
      x: (x - cr.x) / scale,
      y: height - (y - cr.y) / scale,
    };
  };
  const mouse = (e: MouseEvent) => {
    e.preventDefault();
    const { x, y } = toLocalCoords(e.x, e.y);
    tx = x;
    ty = y;

    onmouse?.({
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

    onmouse?.({
      type: e.type === "touchend" ? "click" : "move",
      x,
      y,
    });
  };

  interface Props {
    width: number;
    height: number;
    scale: number;
    isDangerous?: boolean;
    children?: Snippet;
    onmouse?: (e: { type: "click" | "move"; x: number; y: number }) => void;
  }
  let {
    width,
    height,
    scale,
    isDangerous = false,
    children,
    onmouse,
  }: Props = $props();

  let tx = 0;
  let ty = 0;
  let it = 0;
  let isDangerousAnimationRunning = $state(false);

  $effect(() => {
    if (isDangerous && !isDangerousAnimationRunning) {
      it = 0;
      isDangerousAnimationRunning = true;
    }
  });

  onMount(() => {
    const unsubscribes = [
      on(window, "touchmove", touch, { passive: false }),
      on(window, "touchstart", touch, { passive: false }),
    ];
    return () => {
      unsubscribes.forEach((clear) => clear());
    };
  });

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
    onanimationiteration={(e) => {
      it++;
      if (!isDangerous && it % 2 === 0) {
        isDangerousAnimationRunning = false;
      }
    }}
  ></div>
  {@render children?.()}
</div>

<svelte:window
  onmousemove={mouse}
  onclick={mouse}
  ontouchend={touch}
  oncontextmenu={(e) => {
    e.preventDefault();
    e.stopPropagation();
  }}
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
      background:
        linear-gradient($bg, $bg) padding-box,
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
          background:
            linear-gradient($bg, $bg) padding-box,
            radial-gradient(
                farthest-corner at top,
                color.$tomato-12,
                color.$tomato-10,
                color.$indigo-8 120%
              )
              border-box;
          animation: 0.3s infinite alternate pulse ease-in-out;
          box-shadow:
            0 0 4rem rgba(color.$tomato-8, 0.3),
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
