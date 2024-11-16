import { WorkspaceModuleType } from '../modules/common/constants.js';
import { createStandalone, type YasumuStandaloneFormat } from '../standalone/types.js';
import type { YasumuWorkspace } from '../YasumuWorkspace.js';
import { Insomnia } from './insomnia/Insomnia.js';
import { PostmanExporter as Postman } from './postman/Postman.js';
import { Yaak } from './yaak/Yaak.js';

export interface FromStandaloneOptions {
  /**
   * The workspace to import the data into. If not provided, the data will be imported into the current workspace.
   */
  workspace?: YasumuWorkspace | null;
}

export class ExternalCollectionsUtility {
  public readonly postman = new Postman(this.workspace);
  public readonly insomnia = new Insomnia(this.workspace);
  public readonly yaak = new Yaak(this.workspace);

  public constructor(public readonly workspace: YasumuWorkspace) {}

  public async toStandalone(): Promise<YasumuStandaloneFormat> {
    return createStandalone({
      workspace: this.workspace.getMetadata().getRawData(),
      entities: {
        [WorkspaceModuleType.GraphQL]: await this.workspace.graphql.toStandalone(),
        [WorkspaceModuleType.Rest]: await this.workspace.rest.toStandalone(),
      },
    });
  }

  public async fromStandalone(data: YasumuStandaloneFormat, options: FromStandaloneOptions): Promise<void> {}
}
