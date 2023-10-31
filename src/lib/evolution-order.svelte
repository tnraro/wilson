<script lang="ts">
  import { fruitData } from "./fruit";
  const fruits = Object.values(fruitData);
</script>

<aside>
  {#each fruits as fruit (fruit.no)}
    <img src={fruit.image.src} alt={fruit.i18n.ko_KR.name} title="{fruit.i18n.ko_KR.name} ({fruit.score}점)" />
  {/each}
</aside>

<style lang="scss">
  @use "sass:math";
  @use "../style/color";
  $deg1: math.div(360deg, 12) * 1;
  $deg11: math.div(360deg, 12) * 11;
  aside {
    ---radius: 5.5rem;
    ---border: 3rem;
    user-select: none;
    width: calc(var(---radius) * 2 + var(---border));
    aspect-ratio: 1;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: radial-gradient(
          rgba(white, 0.75) calc(var(---radius) - var(---border) * 0.5),
          transparent,
          transparent,
          rgba(white, 0.75) calc(var(---radius) + var(---border) * 0.5)
        ),
        conic-gradient(
          rgba(color.$amber-9, 0.2) $deg1,
          rgba(color.$amber-9, 0.5),
          color.$lime-9,
          color.$sky-9 $deg11 - 0.5,
          transparent $deg11 + 0.5
        );
      border-radius: 999rem;
      -webkit-mask: conic-gradient(
          transparent,
          white $deg1,
          white $deg11 - 1,
          transparent $deg11
        ),
        radial-gradient(
          transparent calc(var(---radius) - var(---border) * 0.5 - 0.5px),
          white calc(var(---radius) - var(---border) * 0.5 + 0.5px)
        );
      -webkit-mask-composite: source-in;
      mask: conic-gradient(
          transparent,
          white $deg1,
          white $deg11 - 1,
          transparent $deg11
        ),
        radial-gradient(
          transparent calc(var(---radius) - var(---border) * 0.5 - 0.5px),
          white calc(var(---radius) - var(---border) * 0.5 + 0.5px)
        );
      mask-composite: intersect;
    }
    &::after {
      content: "";
      background: linear-gradient(0deg, transparent 90%, rgba(white, 0.75)),
        linear-gradient(90deg, transparent 90%, rgba(white, 0.75)),
        radial-gradient(transparent 25%, rgba(white, 0.8) 80%),
        radial-gradient(
          closest-corner at top 25% right 20%,
          rgba(color.$sky-9, 0.5) 25%,
          color.$sky-9 80%
        );
      position: absolute;
      top: calc(sin($deg11 - 90deg) * var(---radius) + 50%);
      left: calc(cos($deg11 - 90deg) * var(---radius) + 50%);
      width: calc(var(---border) * 1.3);
      border-radius: calc(var(---border) * 0.25);
      aspect-ratio: 1;
      transform: translate(-50%, -50%) rotate($deg11 + 45deg);
      -webkit-mask: linear-gradient(
        45deg,
        transparent calc(50% - var(---border) * 0.25 - 0.5px),
        white calc(50% - var(---border) * 0.25 + 0.5px)
      );
      mask: linear-gradient(
        45deg,
        transparent calc(50% - var(---border) * 0.25 - 0.5px),
        white calc(50% - var(---border) * 0.25 + 0.5px)
      );
    }
  }
  img {
    width: 2rem;
    height: 2rem;
    aspect-ratio: 1;
    position: absolute;
    ---deg: 360deg / 12 * var(---nth-child) - 90deg;
    top: calc(sin(var(---deg)) * var(---radius) + 50%);
    left: calc(cos(var(---deg)) * var(---radius) + 50%);
    transform: translate(-50%, -50%);
    z-index: 1;
    @for $i from 1 through 11 {
      &:nth-child(#{$i}) {
        ---nth-child: #{$i};
      }
    }
  }
</style>
