import { deepMerge, generateId } from '@/common/utils.js';
import { Executable, type ExecutionOptions, type ExecutionResult } from '../common/Executable.js';
import type { RestIndex, YasumuRawRestEntity } from './types.js';
import type { YasumuRest } from './YasumuRest.js';
import { HttpMethod } from '@/common/index.js';
import type { YasumuSchemaParasableScriptToType } from '@yasumu/schema';
import type { RestEntitySchema } from '@/workspace/schema/RestEntitySchema.js';
import { WorkspaceModuleType } from '../common/constants.js';

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export class YasumuRestEntity extends Executable {
  public data!: YasumuRawRestEntity;
  /**
   * Construct a new rest entity
   * @param rest The rest module that manages this entity
   * @param data The data of this entity
   */
  public constructor(
    public readonly rest: YasumuRest,
    data?: DeepPartial<YasumuRawRestEntity>,
  ) {
    super();
    this.#reformat(data);
  }

  #reformat(data?: DeepPartial<YasumuRawRestEntity>) {
    if (!data || typeof data !== 'object') {
      data = {
        blocks: {},
      } as YasumuRawRestEntity;
    }

    data.annotation = this.rest.type;
    data.blocks!.Metadata ??= {} as RestIndex;
    data.blocks!.Metadata.createdAt ??= Date.now();
    data.blocks!.Metadata.id ??= generateId();
    data.blocks!.Metadata.method ??= HttpMethod.Get;
    data.blocks!.Metadata.name ??= 'Untitled request';
    data.blocks!.Metadata.path ??= '/';
    data.blocks!.Request = {
      headers: data.blocks!.Request?.headers ?? [],
      url: data.blocks!.Request?.url ?? '',
    };
    data.blocks!.Response = {
      headers: data.blocks!.Response?.headers ?? [],
      status: data.blocks!.Response?.status ?? null,
      body: data.blocks!.Response?.body ?? null,
      size: data.blocks!.Response?.size ?? null,
      time: data.blocks!.Response?.time ?? null,
    };
    data.blocks!.AfterResponse ??= '';
    data.blocks!.BeforeRequest ??= '';
    data.blocks!.Test ??= '';

    this.data = data as YasumuRawRestEntity;
  }

  /**
   * The creation date of this entity
   */
  public get createdAt() {
    return new Date(this.data.blocks.Metadata.createdAt);
  }

  /**
   * The creation timestamp of this entity
   */
  public get createdTimestamp() {
    return this.data.blocks.Metadata.createdAt;
  }

  /**
   * The http method of this entity
   */
  public get method() {
    return (this.data.blocks.Metadata.method ??= HttpMethod.Get);
  }

  /**
   * The unique id of this entity
   */
  public get id() {
    return this.data.blocks.Metadata.id;
  }

  /**
   * The name of this entity
   */
  public get name() {
    return this.data.blocks.Metadata.name;
  }

  /**
   * The file name of this entity
   */
  public get filename() {
    return `${this.name}--${this.createdTimestamp}.ysl`;
  }

  /**
   * The path of this entity
   */
  public get path() {
    return this.data.blocks.Metadata.path;
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
    const normalizedOldPath = await this.rest.workspace.yasumu.path.normalize(this.data.blocks.Metadata.path);
    const oldPath = this.fullPath;
    const oldIndexPath = this.basePath;

    if (normalizedPath === normalizedOldPath) return;

    this.data.blocks.Metadata.path = path;

    await this.save();

    return this.#handleRename(oldPath, oldIndexPath);
  }

  /**
   * Rename this entity
   * @param name The new name
   */
  public async rename(name: string) {
    const oldName = this.data.blocks.Metadata.name;
    const oldPath = this.fullPath;

    if (oldName === name) return;

    this.data.blocks.Metadata.name = name;

    await this.save();

    if (oldPath === this.fullPath) return;

    return this.#handleRename(oldPath);
  }

  /**
   * Copies this entity to a new path
   * @param path The new path
   */
  public async copy(path: string) {
    const entity = new YasumuRestEntity(this.rest, {
      ...this.data,
      blocks: {
        ...this.data.blocks,
        Metadata: {
          ...this.data.blocks.Metadata,
          id: generateId(),
          path,
          createdAt: Date.now(),
        },
      },
    });

    await entity.save();

    return entity;
  }

  /**
   * Move this entity to a new path
   * @param path The new path
   */
  public async move(path: string) {
    return this.setPath(path);
  }

  /**
   * Update the http method of this entity
   * @param method The method to set
   */
  public async setMethod(method: HttpMethod) {
    this.data.blocks.Metadata.method = method;
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

    delete data.blocks[WorkspaceModuleType.Rest].entities[this.id];

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
      blocks: {
        [WorkspaceModuleType.Rest]: {
          entities: {
            [this.id]: this.createRootIndexData(),
          },
        },
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
    return this.rest.schema.serialize(
      this.data as unknown as YasumuSchemaParasableScriptToType<typeof RestEntitySchema>,
    );
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
