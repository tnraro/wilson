<script lang="ts">
  import { fruitData, type No } from "./fruit";

  export let next: No;
</script>

<section>
  <h1>Next</h1>
  <img src={fruitData[next].image.src} alt={fruitData[next].i18n.ko_KR.name} />
</section>

<style>
  img {
    width: 4rem;
    aspect-ratio: 1;
    object-fit: cover;
  }
  section {
    user-select: none;
  }
</style>
