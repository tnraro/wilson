import type { Game } from "lib/game";
import { CanvasRenderer } from "./canvas-renderer";

export class BackgroundRenderer extends CanvasRenderer {
  update(game: Game) {
    const canvas = this.canvas;
    if (canvas == null) return;
    this.clear();
    this.#drawGuideline(game.context.mouseX);
  }
  #drawGuideline(mouseX: number) {
    this.context.beginPath();
    this.context.strokeStyle = "#43484e" /* slate-7 */;
    this.context.moveTo(this.sx(mouseX), this.sx(2));
    this.context.lineTo(this.sx(mouseX), this.sy(0));
    this.context.stroke();
  }
}