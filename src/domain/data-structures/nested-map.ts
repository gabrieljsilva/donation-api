export class NestedMap<Value, key = any, nested = any> {
  private readonly map: Map<key, Map<nested, Value>>;

  constructor() {
    this.map = new Map<key, Map<nested, Value>>();
  }

  set(key: key, nested: nested, value: Value) {
    const nestedMap = this.map.get(key);

    if (!nestedMap) {
      this.map.set(key, new Map([[nested, value]]));
      return;
    }

    nestedMap.set(nested, value);
    this.map.set(key, nestedMap);
  }

  get(key: key, nested: nested) {
    const nestedMap = this.map.get(key);
    return nestedMap?.get(nested);
  }

  has(key: key, nested: nested) {
    const nestedMap = this.map.get(key);
    return nestedMap?.has(nested) || false;
  }
}
