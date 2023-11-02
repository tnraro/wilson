import { ColliderDesc, RigidBodyDesc, World } from "@dimforge/rapier2d";
import { noToRadius, type No } from "./fruit";

export const createWorld = () => {
  const world = new World({
    x: 0,
    y: -9.8,
  })
  return world
}

export const createCask = (world: World, cask: { width: number, height: number }) => {
  world.createCollider(ColliderDesc.cuboid(cask.width, 0.1).setTranslation(0, -0.1));
  world.createCollider(ColliderDesc.cuboid(cask.height + 100, 0.1).setTranslation(-0.1, 0).setRotation(-Math.PI / 2).setFriction(0));
  world.createCollider(ColliderDesc.cuboid(cask.height + 100, 0.1).setTranslation(cask.width + 0.1, 0).setRotation(Math.PI / 2).setFriction(0));
}

export const createFruit = (world: World, fruit: { no: No, x: number, y: number }) => {
  const rigidBodyDesc = RigidBodyDesc.dynamic().setTranslation(fruit.x, fruit.y)
  const rigidBody = world.createRigidBody(rigidBodyDesc)

  const radius = noToRadius(fruit.no)

  world.createCollider(ColliderDesc.ball(radius).setMass(1), rigidBody)

  return rigidBody
}