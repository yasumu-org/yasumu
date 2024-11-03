import { YasumuScriptActions } from '@yasumu/schema';
import { YasumuBaseModule } from '../common/BaseModule.js';
import { WorkspaceModuleType } from '../common/constants.js';
import { GraphqlEntitySchema } from '@/workspace/schema/GraphqlEntitySchema.js';

export class YasumuGraphql extends YasumuBaseModule {
  public type = WorkspaceModuleType.GraphQL;
  public schema = new YasumuScriptActions(GraphqlEntitySchema);
}
