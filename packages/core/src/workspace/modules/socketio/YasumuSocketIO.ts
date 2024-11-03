import { SocketioEntitySchema } from '@/workspace/schema/SocketioEntitySchema.js';
import { YasumuBaseModule } from '../common/BaseModule.js';
import { WorkspaceModuleType } from '../common/constants.js';
import { YasumuScriptActions } from '@yasumu/schema';

export class YasumuSocketIO extends YasumuBaseModule {
  public type = WorkspaceModuleType.SocketIO;
  public schema = new YasumuScriptActions(SocketioEntitySchema);
}
