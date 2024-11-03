import { generateId } from '@/common/utils.js';
import { Executable, type ExecutionOptions, type ExecutionResult } from '../common/Executable.js';
import type { RestIndex, YasumuRawRestEntity } from './types.js';
import type { YasumuRest } from './YasumuRest.js';
import { HttpMethod } from '@/common/constants.js';

export class YasumuRestEntity extends Executable {
  public data!: YasumuRawRestEntity;
  /**
   * Construct a new rest entity
   * @param rest The rest module that manages this entity
   * @param data The data of this entity
   */
  public constructor(
    public readonly rest: YasumuRest,
    data?: Partial<YasumuRawRestEntity>,
  ) {
    super();
    this.#reformat(data);
  }

  #reformat(data?: Partial<YasumuRawRestEntity>) {
    if (!data || typeof data !== 'object') {
      data = {} as YasumuRawRestEntity;
    }

    data.$$typeof = this.rest.type;
    data.createdAt ??= Date.now();
    data.id ??= generateId();
    data.method ??= HttpMethod.Get;
    data.name ??= 'Untitled request';
    data.path ??= '/';
    data.request = {
      headers: data.request?.headers ?? [],
      url: data.request?.url ?? '',
    };
    data.response = {
      headers: data.response?.headers ?? [],
      status: data.response?.status ?? null,
      body: data.response?.body ?? null,
      size: data.response?.size ?? null,
      time: data.response?.time ?? null,
    };

    this.data = data as YasumuRawRestEntity;
  }

  /**
   * The creation date of this entity
   */
  public get createdAt() {
    return new Date(this.data.createdAt);
  }

  /**
   * The creation timestamp of this entity
   */
  public get createdTimestamp() {
    return this.data.createdAt;
  }

  /**
   * The http method of this entity
   */
  public get method() {
    return (this.data.method ??= HttpMethod.Get);
  }

  /**
   * The unique id of this entity
   */
  public get id() {
    return this.data.id;
  }

  /**
   * The name of this entity
   */
  public get name() {
    return this.data.name;
  }

  /**
   * The file name of this entity
   */
  public get filename() {
    return `${this.name}--${this.createdTimestamp}.json`;
  }

  /**
   * The path of this entity
   */
  public get path() {
    return this.data.path;
  }

  /**
   * The full path to this entity
   */
  public get fullPath() {
    return this.rest.workspace.yasumu.utils.joinPathSync(this.rest.getLocation(), this.path, this.filename);
  }

  /**
   * The base path of this entity
   */
  public get basePath() {
    return this.rest.workspace.yasumu.utils.joinPathSync(this.rest.getLocation(), this.path);
  }

  /**
   * Update the path of this entity
   * @param path The new path
   */
  public async setPath(path: string) {
    const normalizedPath = await this.rest.workspace.yasumu.path.normalize(path);
    const normalizedOldPath = await this.rest.workspace.yasumu.path.normalize(this.data.path);
    const oldPath = this.fullPath;
    const oldIndexPath = this.basePath;

    if (normalizedPath === normalizedOldPath) return;

    this.data.path = path;

    await this.save();

    return this.#handleRename(oldPath, oldIndexPath);
  }

  /**
   * Rename this entity
   * @param name The new name
   */
  public async rename(name: string) {
    const oldName = this.data.name;
    const oldPath = this.fullPath;

    if (oldName === name) return;

    this.data.name = name;

    await this.save();

    if (oldPath === this.fullPath) return;

    return this.#handleRename(oldPath);
  }

  /**
   * Update the http method of this entity
   * @param method The method to set
   */
  public async setMethod(method: HttpMethod) {
    this.data.method = method;
    return this.save();
  }

  async #handleRename(oldPath: string, indexPath?: string) {
    await this.rest.workspace.yasumu.fs.remove(oldPath).catch(Object);
    if (indexPath) {
      await this.rest.workspace.indexer.deleteIndex({
        id: this.id,
        location: indexPath,
      });
    }
    // if we somehow accidentally removed the current file
    await this.save();
  }

  /**
   * Save this entity data
   */
  public async save() {
    const serialized = await this.serialize();
    await this.#ensurePath();
    await this.rest.workspace.yasumu.fs.writeTextFile(this.fullPath, serialized);
    return this.updateDependencies();
  }

  /**
   * Delete this entity
   */
  public async delete() {
    await this.rest.workspace.yasumu.fs.remove(this.fullPath);
    return this.deleteDependencies();
  }

  async #ensurePath() {
    const exists = await this.rest.workspace.yasumu.fs.exists(this.basePath);
    if (!exists) await this.rest.workspace.yasumu.fs.mkdir(this.basePath, { recursive: true });
  }

  /**
   * Delete the dependencies of this entity
   */
  public async deleteDependencies() {
    await this.rest.workspace.indexer.deleteIndex({
      id: this.id,
      location: this.basePath,
    });

    const metadata = this.rest.workspace.getMetadata();
    const data = metadata.getRawData();

    delete data.rest[this.id];

    await metadata.save();

    this.rest.notifyDeleted(this);
  }

  /**
   * Update the dependencies of this entity
   */
  public async updateDependencies() {
    await this.rest.workspace.indexer.createIndex({
      id: this.id,
      location: this.basePath,
      name: this.filename,
    });

    const metadata = this.rest.workspace.getMetadata();

    metadata.update({
      rest: {
        [this.id]: this.createRootIndexData(),
      },
    });

    await metadata.save();

    this.rest.notifyChange(this);
  }

  /**
   * The root index data of this entity
   */
  public createRootIndexData(): RestIndex {
    return {
      id: this.id,
      method: this.method,
      name: this.name,
      path: this.path,
    };
  }

  /**
   * Execute this entity
   * @param options The execution options
   * @returns The execution result
   */
  public async execute(options?: ExecutionOptions): Promise<ExecutionResult> {
    return {} as ExecutionResult;
  }

  /**
   * Serialize this entity into a string
   * @returns serialized data
   */
  public async serialize() {
    return JSON.stringify(this);
  }

  /**
   * String representation of this entity
   */
  public toString() {
    return this.name;
  }

  /**
   * JSON representation of this entity
   */
  public toJSON() {
    return this.data;
  }
}
