import { Fruit, FruitConstants, fruitData } from "lib/fruit";
import type { Game } from "lib/game";
import { CanvasRenderer } from "./canvas-renderer";

export class UiRenderer extends CanvasRenderer {
  update(game: Game) {
    const canvas = this.canvas;
    if (canvas == null) return;
    this.clear();
    for (const fruit of game.fruits.signal.value) {
      if (fruit.timer.time < FruitConstants.MaxTimerTime) {
        this.#drawTimer(fruit);
      }
    }
    this.#drawHighscore(game.score.highscore.value);
    this.#drawScore(game.score.signal.value);
    this.#drawNextText(game.options.cask.width);
  }
  #drawHighscore(highscore: number) {
    if (highscore === 0) return;
    const context = this.context;
    const x = 0;
    const y = this.sx(1 + 0.1);
    const fontSize = this.sx(0.2);
    const text = `최고 기록: ${highscore}점`;

    context.font = `bold ${fontSize}px sans-serif`;
    const gradient = context.createLinearGradient(
      x,
      y,
      x + context.measureText(text).width,
      y
    );
    gradient.addColorStop(0, "#6e6ade" /* iris-10 */);
    gradient.addColorStop(1, "#9eb1ff" /* indigo-11 */);
    context.textAlign = "start";
    context.fillStyle = gradient;
    context.strokeStyle = "black";
    context.lineWidth = 4;
    context.strokeText(text, x, y);
    context.fillText(text, x, y);
  }
  #drawTimer(fruit: Fruit) {
    const context = this.context;
    const { pos, no, timer } = fruit;
    const { radius } = fruitData[no];

    const x = this.sx(pos.x);
    const y = this.sy(pos.y);
    const r = this.sx(radius);
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
  #drawScore(score: number) {
    const context = this.context;
    const x = 0;
    const y = this.sx(1 + 0.5);
    const fontSize = this.sx(0.3);
    const text = `${score}점`;
    const chars = (score === 0 ? 0 : Math.log10(score)) + 1;
    const gradient = context.createLinearGradient(
      this.sx(x + 0.3 * (chars - 4)),
      y,
      this.sx(x + 0.3 * chars),
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
  #drawNextText(caskWidth: number) {
    const context = this.context;
    const x = this.sx(caskWidth);
    const y = this.sx(1 + 0.5);
    const fontSize = this.sx(0.3);
    const text = `다음`;
    context.textAlign = "end";
    context.strokeText(text, x - fontSize * 2, y);
    context.fillText(text, x - fontSize * 2, y);
  }
}