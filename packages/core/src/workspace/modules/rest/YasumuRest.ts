import { HttpMethod } from '@/common/index.js';
import { YasumuBaseModule } from '../common/BaseModule.js';
import { WorkspaceModuleType } from '../common/constants.js';
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
  method: HttpMethod;
}

export class YasumuRest extends YasumuBaseModule<(typeof WorkspaceModuleType)['Rest']> {
  public override type = WorkspaceModuleType.Rest;

  /**
   * Open a REST entity by its id.
   * @param id The entity id.
   * @param save Whether to save the entity after opening it. This is useful when you want to save the missing data.
   * @returns The opened entity.
   */
  public async open(id: string, save = true) {
    const data = await this.loadEntity(id);
    const entity = new YasumuRestEntity(this, data);

    if (save) await entity.save();

    return entity;
  }

  /**
   * Create a new REST entity.
   * @param params The entity creation parameters.
   * @returns The created entity.
   */
  public async create(params: Partial<CreateRestEntityParams> = {}): Promise<YasumuRestEntity> {
    const entity = new YasumuRestEntity(this, {
      name: params.name || 'Untitled request',
      method: params.method || HttpMethod.Get,
      path: params.path || '/',
    });

    await entity.save();

    return entity;
  }
}
