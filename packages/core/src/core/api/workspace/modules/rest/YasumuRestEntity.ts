import type { BodyType, HttpMethods } from '@/core/common/constants.js';
import type { YasumuRest } from './YasumuRest.js';

export interface YasumuPartialRestEntity {
  id: string;
  name: string;
  method: HttpMethods;
  path: string;
}

export interface KeyValue<K, V> {
  key: K;
  value: V;
}

export interface YasumuRestEntityResponseCache {
  status: number;
  size: number;
  time: number;
  headers: Array<KeyValue<string, string>>;
}

export interface YasumuRestEntityData {
  id: string;
  name: string;
  method: HttpMethods;
  url: string;
  headers: Array<KeyValue<string, string>>;
  body: BodyType | null;
  path: string;
  response: YasumuRestEntityResponseCache | null;
  preRequestScript: string;
  postResponseScript: string;
  testScript: string;
}

export class YasumuRestEntity {
  /**
   * Create a new YasumuRestEntity
   * @param rest The parent YasumuRest instance
   * @param data The data for this entity
   */
  public constructor(
    public readonly rest: YasumuRest,
    private data: YasumuRestEntityData,
  ) {}

  /**
   * The id of this entity
   */
  public get id() {
    return this.data.id;
  }

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
    this.data.response = response;
  }

  /**
   * Set the pre-request script
   * @param script The new pre-request script
   */
  public setPreRequestScript(script: string) {
    this.data.preRequestScript = script?.trim();
  }

  /**
   * Set the post-response script
   * @param script The new post-response script
   */
  public setPostResponseScript(script: string) {
    this.data.postResponseScript = script?.trim();
  }

  /**
   * Set the test script
   * @param script The new test script
   */
  public setTestScript(script: string) {
    this.data.testScript = script?.trim();
  }

  /**
   * Returns the pre-request script
   */
  public getPreRequestScript() {
    return this.data.preRequestScript?.trim() ?? '';
  }

  /**
   * Returns the post-response script
   */
  public getPostResponseScript() {
    return this.data.postResponseScript?.trim() ?? '';
  }

  /**
   * Returns the test script
   */
  public getTestScript() {
    return this.data.testScript?.trim() ?? '';
  }

  /**
   * Delete this entity
   */
  public async delete() {
    await this.rest.workspace.yasumu.fs.remove(this.getPath());

    return this.rest.saveMetadataSnapshot();
  }

  /**
   * Copy this entity
   * @param path The new path
   */
  public copy(path: string) {
    const clone = this.clone();
    clone.setPath(path);

    return clone.save();
  }

  /**
   * Move this entity
   * @param path The new path
   */
  public async move(path: string) {
    this.setPath(path);

    await this.save();
    await this.delete();
  }

  /**
   * Save this entity to the workspace
   */
  public async save() {
    const data = JSON.stringify(this.data);

    await this.rest.workspace.yasumu.fs.writeTextFile(this.getPath(), data);

    return this.rest.saveMetadataSnapshot();
  }

  /**
   * Returns the partial data of this entity
   */
  public toPartial(): YasumuPartialRestEntity {
    return {
      id: this.id,
      name: this.data.name,
      method: this.data.method,
      path: this.data.path,
    };
  }

  /**
   * Clone this entity
   */
  public clone() {
    const data = JSON.stringify({
      ...this.data,
      path: this.rest.getPath(),
      id: crypto.randomUUID(),
    });

    return new YasumuRestEntity(this.rest, JSON.parse(data));
  }

  /**
   * JSON representation of the entity
   */
  public toJSON() {
    return this.data;
  }
}
