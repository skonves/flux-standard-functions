export class WideWeakMap<K extends object, V> {
  delete(...keys: K[]): boolean {
    if (keys.length === 1) {
      return this.values.delete(keys[0]);
    } else if (this.children.has(keys[0])) {
      return this.children.get(keys[0]).delete(...keys.slice(1));
    } else {
      return false;
    }
  }

  get(...keys: K[]): V | undefined {
    if (keys.length === 1) {
      return this.values.get(keys[0]);
    } else if (this.children.has(keys[0])) {
      return this.children.get(keys[0]).get(...keys.slice(1));
    } else {
      return undefined;
    }
  }

  has(...keys: K[]): boolean {
    if (keys.length === 1) {
      return this.values.has(keys[0]);
    } else if (this.children.has(keys[0])) {
      return this.children.get(keys[0]).has(...keys.slice(1));
    } else {
      return false;
    }
  }

  set(keys: K[], value: V): this {
    if (keys.length === 1) {
      this.values.set(keys[0], value);
      return this;
    }

    if (!this.children.has(keys[0])) {
      this.children.set(keys[0], new WideWeakMap<K, V>());
    }
    this.children.get(keys[0]).set(keys.slice(1), value);

    return this;
  }

  private readonly children = new WeakMap<K, WideWeakMap<K, V>>();
  private readonly values = new WeakMap<K, V>();
}
