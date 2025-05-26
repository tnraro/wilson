<script lang="ts">
  import { type No, fruitData } from "./fruit";

  interface Props {
    no?: No;
    x?: number;
    y?: number;
    rotation?: number;
  }
  let { no = 1, x = 0, y = 0, rotation = 0 }: Props = $props();

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
