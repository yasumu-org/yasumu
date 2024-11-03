import { YasumuBaseModule } from '../common/BaseModule.js';
import { WorkspaceModuleType } from '../common/constants.js';

export class YasumuSmtp extends YasumuBaseModule {
  public type = WorkspaceModuleType.SMTP;
}
