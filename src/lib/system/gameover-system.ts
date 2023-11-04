import type { ISystem } from "./types";

export const gameoverSystem: ISystem = {
  // gameover
  update(game, delta) {
    const fruits = game.fruits.signal.value;
    game.isDangerousSignal.set(false);
    for (const fruit of fruits) {
      const { pos } = fruit;
      if (
        pos.x < 0 ||
        pos.x > game.options.cask.width ||
        pos.y > game.options.cask.height ||
        pos.y < 0
      ) {
        fruit.timer.count(delta);
        if (fruit.timer.isDone()) {
          game.isRunningSignal.set(false);
        }
        game.isDangerousSignal.set(true);
      }
    }
  },
}