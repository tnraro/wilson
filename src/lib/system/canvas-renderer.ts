import type { Game } from "lib/game";
import type { ISystem } from "./types";

export class CanvasRenderer implements ISystem {
  readonly canvas
  readonly context
  #width
  #height
  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d")!;
    this.#width = width;
    this.#height = height;
  }
  update(game: Game) {
  }
  sx(x: number) {
    const scale = this.canvas.width / this.#width;
    return x * scale;
  };
  sy(y: number) {
    const scale = this.canvas.height / (this.#height + 2);
    return (this.#height + 2 - y) * scale;
  };
  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}