export class MultiMap<Key, Value> {
  protected readonly from: Map<Key, Set<Value>>;
  protected readonly to: Map<Value, Key>;

  constructor() {
    this.from = new Map();
    this.to = new Map();
  }

  add(key: Key, value: Value) {
    this.deleteByValue(value);
    const set = this.from.get(key) || new Set<Value>();
    if (set.size === 0) {
      this.from.set(key, set);
    }
    set.add(value);
    this.to.set(value, key);
  }

  deleteByValue(value: Value) {
    const key = this.to.get(value);
    if (key) {
      const set = this.from.get(key);
      set?.delete(value);
      const isSetEmpty = set?.size === 0;
      if (isSetEmpty) {
        this.from.delete(key);
      }
    }
    this.to.delete(value);
  }

  getValuesByKey(key: Key) {
    return this.from.get(key);
  }

  keys() {
    return this.from.keys();
  }

  values() {
    return this.to.keys();
  }

  entries() {
    return this.from.entries();
  }
}
