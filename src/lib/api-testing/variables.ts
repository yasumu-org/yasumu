export class YasumuVariables {
  #cache = new Map<string, string>();

  public get count() {
    return this.#cache.size;
  }

  public get(key: string) {
    return this.#cache.get(key);
  }

  public set(key: string, value: string) {
    this.#cache.set(key, value);
  }

  public delete(key: string) {
    this.#cache.delete(key);
  }

  public has(key: string) {
    return this.#cache.has(key);
  }

  public entries() {
    return this.#cache.entries();
  }

  public toJSON() {
    return Object.fromEntries(this.#cache);
  }

  public clone() {
    const clone = new YasumuVariables();

    for (const [key, value] of this.#cache) {
      clone.set(key, value);
    }

    return clone;
  }
}
