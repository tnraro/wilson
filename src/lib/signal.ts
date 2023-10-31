export const createSignal = <T>(value: T) => {
  let _value = value;
  type Listener = (value: T) => void
  const listeners = new Set<Listener>()
  return {
    subscribe(listener: Listener) {
      listeners.add(listener)
      listener(_value)
      return () => {
        listeners.delete(listener)
      }
    },
    get value() {
      return _value
    },
    set(value: T) {
      _value = value;
      for (const listener of listeners) {
        listener(value)
      }
    }
  }
}

export const createSetSignal = <T>(value: Set<T>) => {
  const set = createSignal(value)

  return {
    subscribe: set.subscribe,
    get value() {
      return set.value
    },
    set: set.set,
    add(item: T) {
      const v = set.value
      v.add(item)
      set.set(v)
    },
    delete(item: T) {
      const v = set.value
      v.delete(item)
      set.set(v)
    },
    has(item: T) {
      return set.value.has(item)
    },
  }
}