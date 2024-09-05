import type { BodyType, HttpMethods } from '@/core/common/constants.js';
import type { YasumuRest } from './YasumuRest.js';

export interface KeyValue<K, V> {
  key: K;
  value: V;
}

export interface YasumuRestEntityResponseCache {
  status: number;
  size: number;
  time: number;
  headers: Array<KeyValue<string, string>>;
  body: string;
}

export interface YasumuRestEntityData {
  name: string;
  method: HttpMethods;
  url: string;
  headers: Array<KeyValue<string, string>>;
  body: BodyType | null;
  path: string;
  response: YasumuRestEntityResponseCache | null;
}

export class YasumuRestEntity {
  #changed = false;
  #methodChanged = false;

  /**
   * Create a new YasumuRestEntity
   * @param rest The parent YasumuRest instance
   * @param data The data for this entity
   */
  public constructor(
    public readonly rest: YasumuRest,
    private data: YasumuRestEntityData
  ) {}

  /**
   * Set the path of this entity
   * @param path The new path
   */
  public setPath(path: string) {
    this.data.path = path;
  }

  /**
   * Get the name of this entity
   * @returns The name of this entity
   */
  public getName() {
    return this.data.name;
  }

  /**
   * Set the name of this entity
   * @param name The new name
   */
  public setName(name: string) {
    if (this.data.name !== name) {
      this.#changed = true;
    }

    this.data.name = name;
  }

  /**
   * Get the HTTP method of this entity
   */
  public getMethod() {
    return this.data.method;
  }

  /**
   * Set the HTTP method of this entity
   * @param method The new HTTP method
   */
  public setMethod(method: HttpMethods) {
    if (this.data.method !== method) {
      this.#changed = true;
      this.#methodChanged = true;
    } else {
      this.#methodChanged = false;
    }

    this.data.method = method;
  }

  /**
   * Get the URL of this entity
   * @returns The URL of this entity
   */
  public getUrl() {
    return this.data.url;
  }

  /**
   * Set the URL of this entity
   * @param url The new URL
   */
  public setUrl(url: string) {
    if (this.data.url !== url) {
      this.#changed = true;
    }

    this.data.url = url;
  }

  /**
   * Get the headers of this entity
   */
  public getHeaders() {
    return this.data.headers;
  }

  /**
   * Set the headers of this entity
   * @param headers The new headers
   */
  public setHeaders(headers: Array<KeyValue<string, string>>) {
    if (this.data.headers !== headers) {
      this.#changed = true;
    }

    this.data.headers = headers;
  }

  /**
   * Get the body of this entity
   */
  public getBody() {
    return this.data.body;
  }

  /**
   * Set the body of this entity
   * @param body The new body
   */
  public setBody(body: BodyType | null) {
    if (this.data.body !== body) {
      this.#changed = true;
    }

    this.data.body = body;
  }

  /**
   * Get the path of this entity
   */
  public getPath() {
    return this.data.path;
  }

  /**
   * Get the response of this entity
   */
  public getResponse() {
    return this.data.response;
  }

  /**
   * Set the response of this entity
   * @param response The new response
   */
  public setResponse(response: YasumuRestEntityResponseCache | null) {
    if (this.data.response !== response) {
      this.#changed = true;
    }

    this.data.response = response;
  }

  /**
   * Save this entity to the workspace
   */
  public async save() {
    if (this.#methodChanged) {
      const name = YasumuRestEntity.getName(this.data.name);

      const newName = await this.rest.workspace.yasumu.path.join(
        await this.rest.workspace.yasumu.path.dirname(this.getPath()),
        `${name}.${this.data.method}`
      );

      await this.rest.workspace.yasumu.fs.remove(this.data.path);

      this.data.path = newName;

      const data = JSON.stringify(this.data);

      await this.rest.workspace.yasumu.fs.writeTextFile(newName, data);
    } else {
      const data = JSON.stringify(this.data);

      await this.rest.workspace.yasumu.fs.writeTextFile(this.data.path, data);
    }
  }

  /**
   * Get the name of the entity
   * @param name The name of the entity
   */
  public static getName(name: string) {
    return name.split('.').shift() ?? null;
  }

  /**
   * Get the HTTP method of the entity
   * @param name The name of the entity
   */
  public static getMethod(name: string) {
    return name.split('.').pop() as HttpMethods;
  }
}
