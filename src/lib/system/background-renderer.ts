import { fruitData } from "lib/fruit";
import type { Game } from "lib/game";
import { CanvasRenderer } from "./canvas-renderer";

export class BackgroundRenderer extends CanvasRenderer {
  update(game: Game) {
    const canvas = this.canvas;
    if (canvas == null) return;
    const context = canvas.getContext("2d")!;
    context.clearRect(0, 0, canvas.width, canvas.height);

    const { radius } = fruitData[game.next.signal.value[0]];

    // guideline
    context.beginPath();
    context.strokeStyle = "#43484e" /* slate-7 */;
    context.moveTo(this.sx(game.context.mouseX), this.sx(2));
    context.lineTo(this.sx(game.context.mouseX), this.sy(0));
    context.stroke();
  }
}