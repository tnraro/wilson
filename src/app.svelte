<script lang="ts">
  import Game from "lib/game.svelte";
</script>

<main>
  <Game />
</main>

<style lang="scss">
  main {
    user-select: none;
    display: flex;
    max-height: 100svh;
    min-height: 100svh;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
</style>
