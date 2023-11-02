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
          setTimeout(() => {
            alert(
              `게임 오버\n${game.score.signal.value}점\n(닫으면 재시작 됩니다)`
            );
            location.reload();
          });
          throw new Error("게임 오버");
        }
        game.isDangerousSignal.set(true);
      }
    }
  },
}