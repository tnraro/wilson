// @ts-expect-error using bun
import { test, expect } from "bun:test";
import { createBag } from "./bag"

test("pop 2", () => {
  const pop = createBag(2)
  expect(pop()).not.toBe(pop())
});
test("pop 53", () => {
  const pop = createBag(53)
  const items = Array.from({ length: 53 }).map(pop)
  for (let i = 0; i < 52; i++) {
    for (let j = i + 1; j < 53; j++) {
      expect(items[i]).not.toBe(items[j])
    }
  }
});
test("pop 3x10", () => {
  const pop = createBag(3)
  for (let k = 0; k < 10; k++) {
    const items = Array.from({ length: 3 }).map(pop)
    for (let i = 0; i < 2; i++) {
      for (let j = i + 1; j < 3; j++) {
        expect(items[i]).not.toBe(items[j])
      }
    }
  }
});