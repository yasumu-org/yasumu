import { SseEntitySchema } from '@/workspace/schema/SseEntitySchema.js';
import { YasumuBaseModule } from '../common/BaseModule.js';
import { WorkspaceModuleType } from '../common/constants.js';
import { YasumuSchemaActions } from '@yasumu/schema';

export class YasumuSSE extends YasumuBaseModule {
  public type = WorkspaceModuleType.SSE;
  public schema = new YasumuSchemaActions(SseEntitySchema);
}
