import { readTextFile, writeTextFile, exists } from '@tauri-apps/plugin-fs';
import { sep } from '@tauri-apps/api/path';
import {
  YasumuRawWorkspaceMetadata,
  YasumuWorkspaceMetadata,
} from './YasumuWorkspaceMetadata';
import type { YasumuCore } from '../yasumu';
import { YasumuRest } from './modules/rest/YasumuRest';
import { YasumuSmtp } from './modules/smtp/YasumuSmtp';
import { YasumuWorkspaceFiles } from './constants';

export interface YasumuWorkspaceInit {
  path: string;
}

export interface YasumuWorkspaceHistory {
  name: string;
  path: string;
}

export class YasumuWorkspace {
  public metadata!: YasumuWorkspaceMetadata;
  public readonly rest: YasumuRest;
  public readonly smtp: YasumuSmtp;

  public constructor(
    public readonly yasumu: YasumuCore,
    private readonly options: YasumuWorkspaceInit
  ) {
    this.rest = new YasumuRest(this);
    this.smtp = new YasumuSmtp(this);
  }

  public getPath() {
    return this.options.path;
  }

  public async loadMetadata() {
    const path = YasumuWorkspace.resolvePath(
      this.options.path,
      YasumuWorkspaceFiles.Metadata
    );

    const hasMetadata = await exists(path);

    if (hasMetadata) {
      const content = await readTextFile(path);
      const metadata: YasumuRawWorkspaceMetadata = JSON.parse(content);

      this.metadata = new YasumuWorkspaceMetadata(metadata);
      this.metadata.onChange = () => this.writeMetadata();
    } else {
      const metadata: YasumuRawWorkspaceMetadata = {
        id: crypto.randomUUID(),
        name: this.getPath().split(sep()).pop() ?? 'New Workspace',
      };

      this.metadata = new YasumuWorkspaceMetadata(metadata);
      this.metadata.onChange = () => this.writeMetadata();
      await this.writeMetadata();
    }

    await this.saveHistory();
  }

  public async writeMetadata() {
    const path = YasumuWorkspace.resolvePath(
      this.options.path,
      YasumuWorkspaceFiles.Metadata
    );

    await writeTextFile(path, JSON.stringify(this.metadata));
  }

  public async saveHistory() {
    try {
      const history = await this.yasumu.getWorkspacesHistory();

      const index = history.findIndex(
        (item) => item.path === this.options.path
      );

      if (index !== -1) {
        history[index].name = this.metadata.name;
      } else {
        history.unshift({
          name: this.metadata.name,
          path: this.options.path,
        });
      }

      history.length = Math.min(history.length, 10);

      await this.yasumu.store.set('yasumu:workspaces', history);
    } catch {
      // noop
    }
  }

  public resolvePath(file: YasumuWorkspaceFiles) {
    return YasumuWorkspace.resolvePath(this.options.path, file);
  }

  public static resolvePath(workspacePath: string, file: YasumuWorkspaceFiles) {
    if (workspacePath.endsWith(file)) {
      return workspacePath;
    }

    return `${workspacePath}${sep()}${file}`;
  }
}
