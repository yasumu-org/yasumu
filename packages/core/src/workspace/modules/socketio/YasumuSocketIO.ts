import { YasumuBaseModule } from '../common/BaseModule.js';
import { WorkspaceModuleType } from '../common/constants.js';

export class YasumuSocketIO extends YasumuBaseModule {
  public type = WorkspaceModuleType.SocketIO;
}
