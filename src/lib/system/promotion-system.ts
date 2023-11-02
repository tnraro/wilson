import { fruitData, type Fruit } from "lib/fruit";
import type { Game } from "lib/game";
import type { ISystem } from "./types";
import { lerp } from "lib/math";

export class PromotionSystem implements ISystem {
  #markedFruits = new WeakSet<Fruit>();
  constructor() {

  }
  update(game: Game): void {
    const fruits = game.fruits.signal.value;
    for (const fruit of fruits) {
      game.world.contactsWith(fruit.collider, (other) => {
        if (this.#markedFruits.has(fruit)) return;
        const fruit2 = game.fruits.colliderToFruit.get(other);
        if (fruit2 == null) return;
        if (fruit.no !== fruit2.no) return;
        if (this.#markedFruits.has(fruit2)) return;

        const { pos } = fruit;
        const { pos: pos2 } = fruit2;
        const t = pos2.y < pos.y ? 0.9 : 0.1;
        const center = lerp(pos, pos2, t);
        fruit.rigidBody.setTranslation(center, false);

        const score = fruitData[fruit.no].score;
        game.score.append(score);

        if (fruit.no < 11) {
          fruit.promote();
          setTimeout(() => {
            this.#markedFruits.delete(fruit);
          }, 100);
          game.fruits.delete(fruit2);
        } else {
          game.fruits.delete(fruit);
          game.fruits.delete(fruit2);
        }
        this.#markedFruits.add(fruit);
        this.#markedFruits.add(fruit2);
      });
    }
  }
}