import type { YasumuWorkspace } from '@/workspace/YasumuWorkspace.js';
import { WorkspaceModuleType, type YasumuEntityMap } from './constants.js';
import { IndexNotFoundError } from '@/common/errors/IndexNotFoundError.js';
import { EntityNotFoundError } from '@/common/errors/EntityNotFoundError.js';
import type { YasumuEntityDataMap } from './types.js';
import type { YasumuSchemaParasableScript, YasumuScriptActions } from '@yasumu/schema';
import type { BaseEntity } from './BaseEntity.js';

export abstract class YasumuBaseModule<T extends WorkspaceModuleType = WorkspaceModuleType> {
  /**
   * The type of this module.
   */
  public abstract readonly type: T;
  /**
   * The schema for the entities in this module.
   */
  public abstract readonly schema: YasumuScriptActions<YasumuSchemaParasableScript>;

  /**
   * The base module for Yasumu.
   * @param workspace The current workspace.
   */
  public constructor(public readonly workspace: YasumuWorkspace) {}

  /**
   * Whether this module is a REST module.
   */
  public isRest(): this is YasumuEntityMap[(typeof WorkspaceModuleType)['Rest']] {
    return this.type === WorkspaceModuleType.Rest;
  }

  /**
   * Whether this module is a GraphQL module.
   */
  public isGraphQL(): this is YasumuEntityMap[(typeof WorkspaceModuleType)['GraphQL']] {
    return this.type === WorkspaceModuleType.GraphQL;
  }

  /**
   * Whether this module is an smtp module.
   */
  public isSMTP(): this is YasumuEntityMap[(typeof WorkspaceModuleType)['SMTP']] {
    return this.type === WorkspaceModuleType.SMTP;
  }

  /**
   * Whether this module is a socket.io module.
   */
  public isSocketIO(): this is YasumuEntityMap[(typeof WorkspaceModuleType)['SocketIO']] {
    return this.type === WorkspaceModuleType.SocketIO;
  }

  /**
   * Whether this module is a websocket module.
   */
  public isWebsocket(): this is YasumuEntityMap[(typeof WorkspaceModuleType)['Websocket']] {
    return this.type === WorkspaceModuleType.Websocket;
  }

  /**
   * Whether this module is an SSE module.
   */
  public isSSE(): this is YasumuEntityMap[(typeof WorkspaceModuleType)['SSE']] {
    return this.type === WorkspaceModuleType.SSE;
  }

  /**
   * Get the location of this module.
   */
  public getLocation(): string {
    return this.workspace.resolvePath(this.type);
  }

  public async loadEntity(id: string): Promise<YasumuEntityDataMap[T]> {
    const location = await this.findEntityPath(id);
    if (!location) {
      const metadata = this.workspace.getMetadata();
      delete this.getRootIndex().entities[id];
      await metadata.save();
      throw new EntityNotFoundError(id, this.type);
    }

    const entity = await this.workspace.yasumu.fs.readTextFile(location);

    return this.schema.parse(entity) as any;
  }

  public async findEntityPath(id: string) {
    const rootIndex = this.findEntity(id);
    if (!rootIndex) return null;

    const location = this.getLocation();
    // @ts-expect-error this should be resolved
    const targetPath = this.workspace.yasumu.utils.joinPathSync(location, rootIndex.path);
    const target = await this.workspace.indexer.findIndex(targetPath, id);

    return target;
  }

  public getRootIndex() {
    const metadata = this.workspace.getMetadata().getRawData();
    const data = metadata.blocks[this.type];

    if (!data) throw new IndexNotFoundError(this.type);

    return data;
  }

  public findEntity(id: string) {
    return this.getRootIndex().entities[id] ?? null;
  }

  /**
   * Called by the entity when it changes.
   * @param entity The entity that changed.
   */
  public notifyChange(entity: YasumuEntityMap[T] | BaseEntity) {
    // TODO: notify subscribers about the change
  }

  /**
   * Called by the entity when it is deleted.
   * @param entity The entity that was deleted.
   */
  public notifyDeleted(entity: YasumuEntityMap[T] | BaseEntity) {
    // TODO: notify subscribers about the deletion
  }
}
