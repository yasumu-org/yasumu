import type { WorkspaceModuleType } from '@/modules/common/constants.js';

export class EntityNotFoundError extends Error {
  public readonly name = 'EntityNotFoundError';

  public constructor(entity: string, type: WorkspaceModuleType) {
    super(`The entity "${entity}" of type ${type} was not found`);

    Error.captureStackTrace(this, EntityNotFoundError);
  }
}
