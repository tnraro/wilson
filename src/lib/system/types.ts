import type { Game } from "lib/game";

export interface ISystem {
  update(game: Game, delta: number): void
}