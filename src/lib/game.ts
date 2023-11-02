import { Collider } from '@dimforge/rapier2d';
import { Fruit, type No } from './fruit'
import { createCask, createFruit, createWorld } from './physics';
import { createSetSignal, createSignal } from './signal'

export type GameOptions = {
  cask: {
    width: number,
    height: number,
    scale: number,
  },
  systems: { update(game: Game, delta: number): void }[]
}
export type Game = ReturnType<typeof createGame>;
export const createGame = (options?: Partial<GameOptions>) => {
  const _options: GameOptions = Object.assign<GameOptions, Partial<GameOptions> | undefined>({
    cask: {
      width: 3,
      height: 5,
      scale: 100,
    },
    systems: [],
  }, options)

  const world = createWorld()
  createCask(world, _options.cask)

  const _next = createSignal<[No, No]>([1, 1])
  const _score = createSignal(0)
  const _fruits = createSetSignal(new Set<Fruit>())
  const colliderToFruit = new WeakMap<Collider, Fruit>()
  const isDangerousSignal = createSignal(false)

  const fruits = {
    add: (x: number, y: number) => {
      const next = _next.value[0]
      const rigidBody = createFruit(world, {
        no: next,
        x, y,
      })
      const fruit = new Fruit(next, rigidBody)
      _fruits.add(fruit)
      colliderToFruit.set(rigidBody.collider(0), fruit)
    },
    delete: (fruit: Fruit) => {
      colliderToFruit.delete(fruit.collider);
      world.removeRigidBody(fruit.rigidBody);
      _fruits.delete(fruit);
    },
    get signal() {
      return _fruits
    },
    colliderToFruit,
  }
  const next = {
    next() {
      _next.set([
        _next.value[1],
        (Math.random() * 5 + 1 | 0) as No
      ])
    },
    get signal() {
      return _next
    }
  }
  const score = {
    append(value: number) {
      _score.set(_score.value + value)
    },
    get signal() {
      return _score
    }
  }

  return {
    options: _options,
    fruits,
    next,
    world,
    score,
    context: {
      mouseX: _options.cask.width / 2,
      mouseY: _options.cask.height,
      isSpawnDelaying: false,
    },
    isDangerousSignal
  }
}

export const run = (game: Game) => {
  let isRunning = true;
  let lastTime = Date.now();
  const _run = () => {
    if (!isRunning) return
    game.world.step()

    const now = Date.now()
    const delta = now - lastTime;
    lastTime = now
    for (const system of game.options.systems) {
      system.update(game, Math.min(1000 / 60, delta / 1000));
    }

    requestAnimationFrame(_run)
  }
  _run()
  return () => isRunning = false
}
