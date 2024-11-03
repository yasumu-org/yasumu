import { WebsocketEntitySchema } from '@/workspace/schema/WebsocketEntitySchema.js';
import { YasumuBaseModule } from '../common/BaseModule.js';
import { WorkspaceModuleType } from '../common/constants.js';
import { YasumuScriptActions } from '@yasumu/schema';

export class YasumuWebSocket extends YasumuBaseModule {
  public type = WorkspaceModuleType.Websocket;
  public schema = new YasumuScriptActions(WebsocketEntitySchema);
}
