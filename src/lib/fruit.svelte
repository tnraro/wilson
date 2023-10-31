<script lang="ts">
  import { type No, fruitData } from "./fruit";

  export let no: No = 1;
  export let x: number = 0;
  export let y: number = 0;
  export let rotation: number = 0;

  $: data = fruitData[no];
</script>

<img
  class="fruit"
  style:---x="{x}px"
  style:---y="{y}px"
  style:---radius="{data.radius}px"
  style:---rotation="{rotation}rad"
  src={data.image.src}
  alt={data.i18n.ko_KR.name}
/>

<style lang="scss">
  .fruit {
    width: calc(var(---radius) * 2 * 1.1 * var(---scale));
    aspect-ratio: 1;
    position: absolute;
    transform: translate(-50%, -50%) rotate(calc(var(---rotation) * -1));
    left: calc(var(---x) * var(---scale));
    top: calc(100% - var(---y) * var(---scale));
    object-fit: cover;
    z-index: 2;
  }
</style>
