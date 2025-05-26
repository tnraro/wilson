<script lang="ts">
  interface Props {
    score: number;
  }
  let { score }: Props = $props();
</script>

<section>
  <h1>Score</h1>
  <div>{score}</div>
</section>

<style>
  section {
    user-select: none;
  }
</style>
