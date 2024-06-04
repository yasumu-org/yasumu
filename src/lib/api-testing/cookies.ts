import { parseString } from 'set-cookie-parser';

export const CookieSameSite = {
  Strict: 'strict',
  Lax: 'lax',
  None: 'none',
} as const;
export type CookieSameSite =
  (typeof CookieSameSite)[keyof typeof CookieSameSite];

export interface CookieMetadata {
  /**
   * The name of the cookie.
   */
  name: string;
  /**
   * The value of the cookie.
   */
  value: string;
  /**
   * The domain of the cookie.
   */
  domain?: string;
  /**
   * The path of the cookie.
   */
  path?: string;
  /**
   * The expiration date of the cookie.
   */
  expires?: Date;
  /**
   * The maximum age of the cookie.
   */
  maxAge?: number;
  /**
   * Whether the cookie is secure.
   */
  secure?: boolean;
  /**
   * Whether the cookie is HTTP only.
   */
  httpOnly?: boolean;
  /**
   * The same-site policy of the cookie.
   */
  sameSite?: CookieSameSite;
}

export type Predicate<T, R> = (value: T, index: number) => R;

export class CookieStore {
  #store = new Array<CookieMetadata>();

  public constructor(
    cookies: string[],
    public readonly readonly = false
  ) {
    for (const cookie of cookies) {
      this.#parseInternal(cookie);
    }
  }

  #parseInternal(cookie: string) {
    try {
      const [name, value] = cookie.split('=');

      const metadata = parseString(cookie, {
        decodeValues: true,
        silent: true,
        map: true,
      });

      if (!metadata?.name || !metadata?.value) return false;

      this.#store.push({
        name,
        value,
        domain: metadata.domain,
        path: metadata.path,
        expires: metadata.expires,
        maxAge: metadata.maxAge,
        secure: metadata.secure,
        httpOnly: metadata.httpOnly,
        sameSite: metadata.sameSite?.toLowerCase() as CookieSameSite,
      });

      return true;
    } catch {
      return false;
    }
  }

  public get size() {
    return this.#store.length;
  }

  public get(name: string) {
    return this.#store.find((cookie) => this.#compareName(cookie.name, name));
  }

  public getExact(name: string) {
    return this.#store.find((cookie) => cookie.name === name);
  }

  public has(name: string) {
    return this.#store.some((cookie) => this.#compareName(cookie.name, name));
  }

  public entries() {
    return this.#store.entries();
  }

  public keys() {
    return this.#store.map((cookie) => cookie.name);
  }

  public values() {
    return this.#store.map((cookie) => cookie.value);
  }

  public set(name: string): boolean;
  public set(cookie: string, value: string): boolean;
  public set(cookie: CookieMetadata): boolean;
  public set(cookie: CookieMetadata | string, value?: string): boolean {
    if (this.readonly)
      throw new Error('Cannot set cookies on a readonly store.');

    if (typeof cookie === 'string') {
      if (typeof value === 'string') {
        const str = `${cookie}=${value}`;
        return this.#parseInternal(str);
      }
      return this.#parseInternal(cookie);
    } else {
      this.#store.push(cookie);
      return true;
    }
  }

  public delete(name: string) {
    if (this.readonly)
      throw new Error('Cannot delete cookies on a readonly store.');

    const index = this.#store.findIndex((cookie) =>
      this.#compareName(cookie.name, name)
    );

    if (index === -1) return false;

    this.#store.splice(index, 1);
    return true;
  }

  public clear() {
    if (this.readonly)
      throw new Error('Cannot clear cookies on a readonly store.');

    this.#store = [];
  }

  public filter(callback: Predicate<CookieMetadata, boolean>) {
    return this.#store.filter(this.#createPredicateFn(callback));
  }

  public forEach(callback: Predicate<CookieMetadata, void>) {
    this.#store.forEach(this.#createPredicateFn(callback));
  }

  public map<T>(callback: Predicate<CookieMetadata, T>) {
    return this.#store.map(this.#createPredicateFn(callback));
  }

  public toString() {
    return this.#store
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join('; ');
  }

  public [Symbol.iterator]() {
    return this.#store[Symbol.iterator]();
  }

  /**
   * Creates a predicate function from a callback. This is used to ensure that the callback does not mutate the original array.
   */
  #createPredicateFn<T, R>(callback: Predicate<T, R>): Predicate<T, R> {
    return (value: T, index: number) => callback(value, index);
  }

  /**
   * Compares two cookie names. This is used to ensure that cookie names are compared case-insensitively.
   */
  #compareName(a: string, b: string) {
    return a.toLowerCase() === b.toLowerCase();
  }
}
