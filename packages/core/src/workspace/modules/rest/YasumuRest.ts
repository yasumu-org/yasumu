import { EntityNotFoundError } from '@/common/errors/EntityNotFoundError.js';
import { YasumuBaseModule } from '../common/BaseModule.js';
import { WorkspaceModuleType } from '../common/constants.js';
import type { YasumuRawRestEntity } from './types.js';
import { YasumuRestEntity } from './YasumuRestEntity.js';

export interface CreateRestEntityParams {
  /**
   * The entity name
   */
  name: string;
  /**
   * The entity path
   */
  path: string;
  /**
   * The http method
   */
  method: string;
}

export class YasumuRest extends YasumuBaseModule {
  public override type = WorkspaceModuleType.Rest;

  public async open(id: string, save = true) {
    const data = await this.loadEntity(id);

    const entity = new YasumuRestEntity(this, data);

    if (save) await entity.save();

    return entity;
  }

  public async create(params: Partial<CreateRestEntityParams> = {}): Promise<YasumuRestEntity> {
    const entity = new YasumuRestEntity(this, {
      name: params.name || 'Untitled request',
      method: params.method || 'GET',
      path: params.path || '/',
    });

    await entity.save();

    return entity;
  }

  public async loadEntity(id: string): Promise<YasumuRawRestEntity> {
    const location = await this.findEntityPath(id);
    if (!location) {
      const metadata = this.workspace.getMetadata();
      const data = metadata.getRawData();
      delete data.rest[id];
      await metadata.save();
      throw new EntityNotFoundError(id, this.type);
    }

    const entity = await this.workspace.yasumu.fs.readTextFile(location);

    return JSON.parse(entity);
  }

  public async findEntityPath(id: string) {
    const rootIndex = this.findEntity(id);
    const location = this.getLocation();
    const targetPath = this.workspace.yasumu.utils.joinPathSync(location, rootIndex.path);
    const target = await this.workspace.indexer.findIndex(targetPath, id);

    return target;
  }

  public findEntity(id: string) {
    const metadata = this.workspace.getMetadata().getRawData();
    return metadata.rest[id] ?? null;
  }

  public notifyChange(entity: YasumuRestEntity) {
    // TODO: notify subscribers about the change
  }

  public notifyDeleted(entity: YasumuRestEntity) {
    // TODO: notify subscribers about the deletion
  }
}
