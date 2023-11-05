export const createBag = (capacity: number) => {
  if (capacity < 0) throw RangeError("Bag must be equal to or greater than 0 capacity.");
  let items = Array.from({ length: capacity }, (_, i) => i);
  let i = 0;
  let j = 0;
  const pop = () => {
    if (i >= capacity) {
      i = 0;
    }
    j = Math.random() * (capacity - i) + i | 0;
    if (i === j) return items[i++];
    items[i] = items[i] ^ items[j]
    items[j] = items[i] ^ items[j]
    items[i] = items[i] ^ items[j]
    return items[i++]
  }
  return pop
}