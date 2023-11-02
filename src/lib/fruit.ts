import { Collider, Vector2, type RigidBody } from "@dimforge/rapier2d";
import aiden from "asset/aiden.svg";
import bear from "asset/bear.svg";
import daniel from "asset/daniel.svg";
import hyunwoo from "asset/hyunwoo.png";
import isaac from "asset/isaac.png";
import jenny from "asset/jenny.svg";
import johann from "asset/johann.svg";
import leon from "asset/leon.svg";
import lida from "asset/lida.png";
import wilson from "asset/wilson.svg";
import yuki from "asset/yuki.png";

export const noToRadius = (no: No) => (no ** 2) * 0.01 + 0.2;
export const noToScore = (no: No) => Math.round(no * (no + 1) / 2);

export const enum FruitConstants {
  MaxTimerTime = 3,
}

class Timer {
  readonly maxTimerTime
  readonly time

  constructor(maxTimerTime: number) {
    this.maxTimerTime = maxTimerTime
    this.time = maxTimerTime
  }
  reset() {
    // @ts-expect-error getter
    this.time = this.maxTimerTime
  }
  count(deltaTime: number) {
    // @ts-expect-error getter
    this.time -= deltaTime
  }
  isDone() {
    return this.time <= 0
  }
}

export class Fruit {
  // This is an abuse of readonly keyword as getter
  readonly no: No
  readonly rigidBody: RigidBody
  readonly collider: Collider
  // This is an abuse of readonly keyword as getter
  readonly timer = new Timer(FruitConstants.MaxTimerTime)
  constructor(no: No, rigidBody: RigidBody) {
    this.no = no
    this.rigidBody = rigidBody
    this.collider = rigidBody.collider(0)
  }
  get pos() {
    return this.rigidBody.translation()
  }
  get rotation() {
    return this.collider.rotation()
  }
  promote() {
    if (this.no < 11) {
      // @ts-expect-error This is an abuse of readonly keyword as getter
      this.no = (this.no + 1) as No;
      this.collider.setRadius(noToRadius(this.no));
      this.timer.reset();
    }
  }
}

export type No = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
export const fruitData: {
  [K in No]: {
    no: No,
    image: string,
    score: number,
    radius: number,
    i18n: {
      [I: string]: {
        name: string
      }
    }
  }
} = {
  [1]: {
    no: 1,
    image: yuki,
    score: noToScore(1),
    radius: noToRadius(1),
    i18n: {
      ko_KR: {
        name: "유키"
      }
    }
  },
  [2]: {
    no: 2,
    image: hyunwoo,
    score: noToScore(2),
    radius: noToRadius(2),
    i18n: {
      ko_KR: {
        name: "현우"
      }
    }
  },
  [3]: {
    no: 3,
    image: isaac,
    score: noToScore(3),
    radius: noToRadius(3),
    i18n: {
      ko_KR: {
        name: "아이작"
      }
    }
  },
  [4]: {
    no: 4,
    image: lida,
    score: noToScore(4),
    radius: noToRadius(4),
    i18n: {
      ko_KR: {
        name: "리 다이린"
      }
    }
  },
  [5]: {
    no: 5,
    image: leon,
    score: noToScore(5),
    radius: noToRadius(5),
    i18n: {
      ko_KR: {
        name: "레온"
      }
    }
  },
  [6]: {
    no: 6,
    image: jenny,
    score: noToScore(6),
    radius: noToRadius(6),
    i18n: {
      ko_KR: {
        name: "제니"
      }
    }
  },
  [7]: {
    no: 7,
    image: aiden,
    score: noToScore(7),
    radius: noToRadius(7),
    i18n: {
      ko_KR: {
        name: "에이든"
      }
    }
  },
  [8]: {
    no: 8,
    image: johann,
    score: noToScore(8),
    radius: noToRadius(8),
    i18n: {
      ko_KR: {
        name: "요한"
      }
    }
  },
  [9]: {
    no: 9,
    image: daniel,
    score: noToScore(9),
    radius: noToRadius(9),
    i18n: {
      ko_KR: {
        name: "대니얼"
      }
    }
  },
  [10]: {
    no: 10,
    image: bear,
    score: noToScore(10),
    radius: noToRadius(10),
    i18n: {
      ko_KR: {
        name: "곰"
      }
    }
  },
  [11]: {
    no: 11,
    image: wilson,
    score: noToScore(11),
    radius: noToRadius(11),
    i18n: {
      ko_KR: {
        name: "윌슨"
      }
    }
  },
};