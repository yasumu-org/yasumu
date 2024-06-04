import { ReadonlyHeaders } from './headers';
import { CookieStore } from './cookies';

export interface IYasumuResponse {
  /**
   * The headers of the response.
   */
  headers: Headers;
  /**
   * The status code of the response.
   */
  status: number;
  /**
   * The status text of the response.
   */
  statusText: string;
  /**
   * The body of the response.
   */
  body: ArrayBuffer | null;
  /**
   * The time it took for the response to be received.
   */
  responseTime: number;
  /**
   * The size of the response body in bytes.
   */
  size: number;
}

export class YasumuResponse {
  #internals = {} as IYasumuResponse;

  public populate(response: IYasumuResponse) {
    this.#internals = response;
    return this;
  }

  public get headers() {
    return new ReadonlyHeaders(this.#internals.headers);
  }

  public get cookies() {
    const cookies = this.#internals.headers.getSetCookie();
    return new CookieStore(cookies, true);
  }

  public get status() {
    return this.#internals.status;
  }

  public get statusText() {
    return this.#internals.statusText;
  }

  public get body() {
    return this.#internals.body;
  }

  public get responseTime() {
    return this.#internals.responseTime;
  }

  public get size() {
    return this.#internals.size;
  }

  public text() {
    const body = this.#internals.body;
    if (!body) return '';

    return new TextDecoder().decode(body);
  }

  public json<T = unknown>() {
    return JSON.parse(this.text()) as T;
  }
}
