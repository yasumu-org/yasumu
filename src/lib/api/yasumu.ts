import { Store } from '@tauri-apps/plugin-store';
import {
  YasumuWorkspace,
  YasumuWorkspaceHistory,
} from './workspace/YasumuWorkspace';
import { YasumuWorkspaceFiles } from './workspace/constants';

export class YasumuCore {
  public readonly store = new Store(YasumuWorkspaceFiles.StorePath);
  public workspace: YasumuWorkspace | null = null;

  public async openWorkspace(path: string) {
    console.log({
      opening: path,
    });
    const workspace = new YasumuWorkspace(this, {
      path,
    });

    console.log({ created: workspace });

    await workspace.loadMetadata();

    this.workspace = workspace;

    console.log({ workspaceData: this.workspace });

    return workspace;
  }

  public async closeWorkspace() {
    if (this.workspace) {
      this.workspace = null;
    }
  }

  public async getWorkspacesHistory() {
    const history =
      (await this.store.get<YasumuWorkspaceHistory[]>('yasumu:workspaces')) ??
      [];

    return history;
  }

  public async clearWorkspacesHistory() {
    await this.store.set('yasumu:workspaces', []).catch(Object);
  }
}

export const Yasumu = new YasumuCore();
