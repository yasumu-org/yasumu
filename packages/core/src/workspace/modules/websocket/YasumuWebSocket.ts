import { YasumuBaseModule } from '../common/BaseModule.js';
import { WorkspaceModuleType } from '../common/constants.js';

export class YasumuWebSocket extends YasumuBaseModule {
  public type = WorkspaceModuleType.Websocket;
}
