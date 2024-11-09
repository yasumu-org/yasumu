import { SmtpEntitySchema } from '@/workspace/schema/SmtpEntitySchema.js';
import { YasumuBaseModule } from '../common/BaseModule.js';
import { WorkspaceModuleType } from '../common/constants.js';
import { YasumuSchemaActions } from '@yasumu/schema';

export class YasumuSmtp extends YasumuBaseModule {
  public type = WorkspaceModuleType.SMTP;
  public schema = new YasumuSchemaActions(SmtpEntitySchema);
}
