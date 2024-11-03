import { YasumuBaseModule } from '../common/BaseModule.js';
import { WorkspaceModuleType } from '../common/constants.js';

export class YasumuGraphql extends YasumuBaseModule {
  public type = WorkspaceModuleType.GraphQL;
}
