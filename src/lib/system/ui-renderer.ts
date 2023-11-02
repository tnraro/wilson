import type { Game } from "lib/game";
import type { ISystem } from "./types";
import { FruitConstants, fruitData } from "lib/fruit";
import { CanvasRenderer } from "./canvas-renderer";

export class UiRenderer extends CanvasRenderer {
  update(game: Game) {
    const canvas = this.canvas;
    if (canvas == null) return;
    const context = this.context;
    const sx = this.sx.bind(this)
    const sy = this.sy.bind(this)
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (const fruit of game.fruits.signal.value) {
      const { pos, no, timer } = fruit;
      const { radius } = fruitData[no];

      const x = sx(pos.x);
      const y = sy(pos.y);
      const r = sx(radius);

      if (timer.time < FruitConstants.MaxTimerTime) {
        const gradient = context.createRadialGradient(x, y, 0, x, y, r);
        gradient.addColorStop(0, "red");
        gradient.addColorStop(1, "transparent");
        context.fillStyle = gradient;
        context.fillRect(x - r, y - r, r * 2, r * 2);
        context.fillStyle = "pink";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = `bold ${r}px sans-serif`;
        context.fillText(Math.ceil(timer.time) + "", x, y);
      }
    }
    {
      const x = 0;
      const y = sx(1 + 0.5);
      const fontSize = sx(0.3);
      const text = `${game.score.signal.value}점`;
      const chars = (game.score.signal.value === 0 ? 0 : Math.log10(game.score.signal.value)) + 1;
      const gradient = context.createLinearGradient(
        sx(x + 0.3 * (chars - 4)),
        y,
        sx(x + 0.3 * chars),
        y
      );
      gradient.addColorStop(0, "#edeef0" /* slate-12*/);
      gradient.addColorStop(0.33, "#75c7f0" /* sky-11 */);
      gradient.addColorStop(0.5, "#70b8ff" /* blue-11 */);
      gradient.addColorStop(1, "#5472e4" /* indigo-10 */);
      context.textAlign = "start";
      context.fillStyle = gradient;
      context.font = `bold ${fontSize}px sans-serif`;
      context.strokeStyle = "black";
      context.lineWidth = 4;
      context.strokeText(text, x, y);
      context.fillText(text, x, y);
    }

    {
      const x = sx(game.options.cask.width);
      const y = sx(1 + 0.5);
      const fontSize = sx(0.3);
      const text = `다음`;
      context.textAlign = "end";
      context.strokeText(text, x - fontSize * 2, y);
      context.fillText(text, x - fontSize * 2, y);
    }
  }
}