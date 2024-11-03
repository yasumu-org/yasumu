import { YasumuBaseModule } from '../common/BaseModule.js';
import { WorkspaceModuleType } from '../common/constants.js';

export class YasumuSSE extends YasumuBaseModule {
  public type = WorkspaceModuleType.SSE;
}
