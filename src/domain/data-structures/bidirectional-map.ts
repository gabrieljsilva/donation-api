export class BidirectionalMap<Key, Value> {
  private readonly from: Map<Key, Value>;
  private readonly to: Map<Value, Key>;

  constructor(entries?: Array<[Key, Value]>) {
    this.from = new Map();
    this.to = new Map();

    if (entries) {
      for (const [key, value] of entries) {
        this.set(key, value);
      }
    }
  }

  set(key: Key, value: Value) {
    this.from.set(key, value);
    this.to.set(value, key);
  }

  getValueByKey(key: Key) {
    return this.from.get(key);
  }

  getKeyByValue(value: Value) {
    return this.to.get(value);
  }

  get(index: Key | Value): Key | Value | undefined {
    const value = this.getValueByKey(index as Key);

    if (value) {
      return value;
    }

    return this.getKeyByValue(index as Value);
  }

  entries() {
    return this.from.entries();
  }

  keys() {
    return this.from.keys();
  }

  values() {
    return this.to.keys();
  }
}
