export type YasumuInterceptor<T> = (src: T) => T;

export class YasumuInterceptorManager<T> {
  #interceptors = new Array<YasumuInterceptor<T>>();

  public get count() {
    return this.#interceptors.length;
  }

  public add(interceptor: YasumuInterceptor<T>) {
    this.#interceptors.push(interceptor);
  }

  public remove(interceptor: YasumuInterceptor<T>) {
    const index = this.#interceptors.indexOf(interceptor);
    if (index === -1) return;

    this.#interceptors.splice(index, 1);
  }

  public apply(src: T): T {
    if (this.#interceptors.length === 0) return src;
    return this.#interceptors.reduce(
      (acc, interceptor) => interceptor(acc),
      src
    );
  }

  public clear() {
    this.#interceptors = [];
  }
}
