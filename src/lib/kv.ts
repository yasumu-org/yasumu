type MaybeArray<T> = T | T[];
type primitive = string | number;
type KVFrom<K extends primitive, V> =
  | Record<K, MaybeArray<V>>
  | Map<K, MaybeArray<V>>
  | KV<K, V>;

export class KV<K extends primitive, V> {
  public store = new Map<K, V[]>();

  public static from<K extends primitive, V>(target: KVFrom<K, V>) {
    const kv = new KV<K, V>();

    if (target instanceof KV) {
      for (const [key, value] of target.store) {
        kv.store.set(key, value);
      }
    } else {
      const entries =
        target instanceof Map ? target.entries() : Object.entries(target);

      for (const [key, value] of entries) {
        console.log(key);
        kv.store.set(key as K, Array.isArray(value) ? value : [value]);
      }
    }

    return kv;
  }

  public get size() {
    return this.store.size;
  }

  public has(key: K): boolean;
  public has(key: K, value: V): boolean;
  public has(key: K, value?: V) {
    if (value === undefined) return this.store.has(key);

    const data = this.store.get(key);
    if (data === undefined) return false;

    return data.includes(value);
  }

  public get(key: K) {
    return this.store.get(key);
  }

  public set(key: K, value: V) {
    const existing = this.store.get(key);
    const next = Array.isArray(existing) ? [...existing, value] : [value];
    this.store.set(key, next);

    return this;
  }

  public delete(key: K): boolean;
  public delete(key: K, value: V): boolean;
  public delete(key: K, value?: V): boolean {
    if (value === undefined) return this.store.delete(key);

    const items = this.store.get(key);
    if (items === undefined) return false;

    const index = items.indexOf(value);
    if (index === -1) return false;

    items.splice(index, 1);

    this.purge();

    return true;
  }

  public map<T>(fn: (key: K, value: V, index: number) => T): T[] {
    const result = new Array();

    let index = 0;
    for (const [key, value] of this.store) {
      value.forEach((v) => result.push(fn(key, v, index++)));
    }

    return result;
  }

  public clone() {
    return KV.from<K, V>(this);
  }

  public purge() {
    for (const [key, value] of this.store) {
      if (!value.length) {
        this.store.delete(key);
      }
    }

    return this;
  }

  public entries() {
    return this.store.entries();
  }

  public keys() {
    return this.store.keys();
  }

  public toJSON() {
    const obj: Record<string, string | string[]> = {};

    for (const [key, value] of this.store) {
      obj[key as string] = value as string[];
    }

    return obj;
  }

  public toString() {
    const params = this.purge().map((key, value) => `${key}=${value}`);

    return params.join('&');
  }
}
