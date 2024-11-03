import { EntityNotFoundError } from '@/common/errors/EntityNotFoundError.js';
import { YasumuBaseModule } from '../common/BaseModule.js';
import { WorkspaceModuleType } from '../common/constants.js';
import type { YasumuRawRestEntity } from './types.js';
import { YasumuRestEntity } from './YasumuRestEntity.js';

export class YasumuRest extends YasumuBaseModule {
  public override type = WorkspaceModuleType.Rest;

  public async open(id: string) {
    const data = await this.loadEntity(id);

    return new YasumuRestEntity(this, data);
  }

  public async loadEntity(id: string): Promise<YasumuRawRestEntity> {
    const location = await this.findEntityPath(id);
    if (!location) throw new EntityNotFoundError(id, this.type);

    const entity = await this.workspace.yasumu.fs.readTextFile(location);

    return JSON.parse(entity);
  }

  public async findEntityPath(id: string) {
    const rootIndex = this.findEntity(id);
    const location = await this.getLocation();
    const targetPath = await this.workspace.yasumu.path.join(location, rootIndex.path);
    const target = await this.workspace.indexer.findIndex(targetPath, id);

    return target;
  }

  public findEntity(id: string) {
    const metadata = this.workspace.getMetadata().getRawData();
    return metadata.rest[id] ?? null;
  }
}
