import { Store } from '@tauri-apps/plugin-store';
import { invoke } from '@tauri-apps/api/core';
import {
  YasumuWorkspace,
  YasumuWorkspaceHistory,
} from './workspace/YasumuWorkspace';
import { YasumuWorkspaceFiles } from './workspace/constants';
import { Commands } from '../common/commands';

export class YasumuCore {
  public readonly store = new Store(YasumuWorkspaceFiles.StorePath);
  public workspace: YasumuWorkspace | null = null;

  public async restoreWorkspace() {
    const session = await invoke<string | null>(Commands.GetCurrentWorkspace);

    if (session) {
      return this.openWorkspace(session);
    }
  }

  public async openWorkspace(path: string) {
    const workspace = new YasumuWorkspace(this, {
      path,
    });

    await workspace.loadMetadata();
    await workspace.createSession();

    this.workspace = workspace;

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
