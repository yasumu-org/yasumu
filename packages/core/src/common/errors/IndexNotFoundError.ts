import type { WorkspaceModuleType } from '@/workspace/modules/common/constants.js';

export class IndexNotFoundError extends Error {
  public readonly name = 'IndexNotFoundError';

  public constructor(type: WorkspaceModuleType) {
    super(`The ${type} index was not found`);

    Error.captureStackTrace(this, IndexNotFoundError);
  }
}
