<script lang="ts">
  import { onMount } from "svelte";

  const resize = () => {
    if (canvas == null) return;

    const dpr = devicePixelRatio;
    const rect = canvas.getBoundingClientRect();

    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);

    const needResize = canvas.width !== w || canvas.height !== h;

    if (!needResize) return;
    canvas.width = w;
    canvas.height = h;
  };

  export let canvas: HTMLCanvasElement;

  onMount(() => {
    resize();
  });
</script>

<canvas bind:this={canvas} />

<svelte:window on:resize={resize} />

<style>
  canvas {
    position: absolute;
    user-select: none;
    width: 100%;
    aspect-ratio: var(---width) / calc(var(---height) + 2);
    bottom: 0;
    border-radius: 1rem;
    z-index: 1;
  }
</style>
