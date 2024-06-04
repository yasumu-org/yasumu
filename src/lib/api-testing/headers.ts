export class ReadonlyHeaders {
  #headers: Headers;

  public constructor(headers: Headers) {
    this.#headers = headers;
  }

  public get(name: string) {
    return this.#headers.get(name);
  }

  public has(name: string) {
    return this.#headers.has(name);
  }

  public entries() {
    return this.#headers.entries();
  }

  public keys() {
    return this.#headers.keys();
  }

  public values() {
    return this.#headers.values();
  }

  public [Symbol.iterator]() {
    return this.#headers[Symbol.iterator]();
  }

  public forEach(
    callback: (value: string, key: string, parent: Headers) => void
  ) {
    return this.#headers.forEach(callback);
  }
}
