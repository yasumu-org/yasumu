import type { YasumuWorkspace } from '@/workspace/YasumuWorkspace.js';
import { WorkspaceModuleType, YasumuEntityMap } from './constants.js';
import { IndexNotFoundError } from '@/common/errors/IndexNotFoundError.js';
import { EntityNotFoundError } from '@/common/errors/EntityNotFoundError.js';
import type { YasumuEntityDataMap, YasumuEntityTree, YasumuRootEntityIndexMap } from './types.js';
import type {
  YasumuSchemaParsableScript,
  YasumuSchemaActions,
  _YasumuSchemaParsableScriptExpect,
} from '@yasumu/schema';
import type { BaseEntity } from './BaseEntity.js';
import type { YasumuStandaloneFormat } from '@/workspace/standalone/types.js';
import type { RootIndex } from '@/workspace/YasumuWorkspaceMetadata.js';
import type { RestIndex } from '../rest/types.js';

export abstract class YasumuBaseModule<T extends WorkspaceModuleType = WorkspaceModuleType> {
  /**
   * The type of this module.
   */
  public abstract readonly type: T;
  /**
   * The schema for the entities in this module.
   */
  public abstract readonly schema: YasumuSchemaActions<YasumuSchemaParsableScript<_YasumuSchemaParsableScriptExpect>>;

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

  public async getRawEntities(index?: RootIndex<unknown>): Promise<YasumuEntityDataMap[T][]> {
    const rootIndex = index ?? this.getRootIndex();
    const entities = await Promise.all(
      Object.keys(rootIndex.entities).map((id) => {
        return this.loadEntity(id);
      }),
    );

    return entities;
  }

  public async getEntities(): Promise<YasumuEntityMap[T][]> {
    const entities = await this.getRawEntities();

    // @ts-expect-error this should be resolved
    return entities.map((entity) => {
      // @ts-expect-error this should be resolved
      return new YasumuEntityMap[this.type](this, entity);
    });
  }

  public async toStandalone(): Promise<YasumuStandaloneFormat['entities'][T]> {
    const index = this.getRootIndex();
    const entities = await this.getRawEntities(index);
    const indexes = await Promise.all(
      Object.values(index.entities)
        .filter((e) => e && typeof e === 'object' && 'path' in e && e.path && typeof e.path === 'string')
        .map((e) => this.workspace.indexer.getIndexFile((e as RestIndex).path)),
    );

    // @ts-expect-error this should be resolved
    return {
      indexes: indexes.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
      entities,
    };
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

  /**
   * Generate a file tree object for this module.
   */
  public async generateTree(): Promise<
    YasumuEntityTree & {
      __type: T;
    }
  > {
    const { entities } = this.getRootIndex();

    const tree: YasumuEntityTree & {
      __type: T;
    } = {
      __type: this.type,
      children: [],
      id: '__YASUMU_ROOT__',
      name: '__YASUMU_ROOT__',
    };

    let i = 0;

    for (const entity of Object.values(entities)) {
      if (entity.path === '/') {
        tree.children?.push(entity);
        continue;
      }

      const parts = entity.path.split('/');

      let current: YasumuEntityTree[] = tree.children!;

      for (const part of parts) {
        const child = tree.children?.find((c) => c.name === part);

        if (!child) {
          const newChild: YasumuEntityTree = {
            children: [],
            name: part,
            id: `dir::${i++}`,
          };

          current?.push(newChild);
          current = newChild.children!;
        } else {
          current = child.children!;
        }
      }

      current.push(entity);
    }

    tree.children?.sort((a, b) => {
      if (a.children && !b.children) return -1;
      if (!a.children && b.children) return 1;
      if (!a.name || !b.name) return 0;

      return a.name.localeCompare(b.name);
    });

    return tree;
  }
}
