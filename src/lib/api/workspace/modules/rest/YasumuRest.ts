import { HttpMethods, isHttpMethod } from '@/lib/constants';
import { type YasumuWorkspace } from '../../YasumuWorkspace';
import { YasumuWorkspaceFiles } from '../../constants';
import { exists, mkdir, readDir, readTextFile } from '@tauri-apps/plugin-fs';
import { join } from '@tauri-apps/api/path';
import { YasumuRestEntity } from './YasumuRestEntity';
import { TreeViewElement } from '@/components/magicui/file-tree';

export interface YasumuRestRequest {
  path: string;
  method: HttpMethods | null;
  name: string;
  children: YasumuRestRequest[] | null;
}

export class YasumuRest {
  public constructor(public readonly workspace: YasumuWorkspace) {}

  public getPath() {
    return this.workspace.resolvePath(YasumuWorkspaceFiles.Http);
  }

  public async ensureSelf() {
    const path = this.getPath();
    const hasPath = await exists(path);

    if (!hasPath) {
      await mkdir(path);
    }
  }

  public async open(path: string) {
    await this.ensureSelf();

    const hasRequest = await exists(path);

    if (!hasRequest) return null;

    const data = await readTextFile(path);

    return new YasumuRestEntity(this, JSON.parse(data));
  }

  public async create(
    name: string,
    method: null,
    basePath?: string
  ): Promise<void>;
  public async create(
    name: string,
    method: HttpMethods,
    basePath?: string
  ): Promise<YasumuRestEntity>;
  public async create(
    name: string,
    method: HttpMethods | null,
    basePath = this.getPath()
  ): Promise<YasumuRestEntity | void> {
    await this.ensureSelf();

    if (!method) {
      const path = await join(basePath, name);
      await mkdir(path, { recursive: true });
      return;
    }

    const path = await join(basePath, `${name}.${method}`);

    const entity = new YasumuRestEntity(this, {
      name,
      method,
      url: '',
      headers: [],
      body: null,
      path,
      response: null,
    });

    await entity.save();

    return entity;
  }

  public async getAsTree(): Promise<TreeViewElement[]> {
    const requests = await this.getRequests();

    const map = (req: YasumuRestRequest): TreeViewElement => {
      if (req.children) {
        return {
          id: req.path,
          name: req.name,
          children: req.children.map(map),
        };
      }

      return {
        name: req.name,
        id: req.path,
      };
    };

    const data: TreeViewElement[] = requests.map(map);

    return data;
  }

  public async getRequests(): Promise<YasumuRestRequest[]> {
    const path = this.getPath();
    const hasRequests = await exists(path);

    if (!hasRequests) {
      await mkdir(path);
      return [];
    }

    return this.#scan(path);
  }

  async #scan(path: string): Promise<YasumuRestRequest[]> {
    const entries = await readDir(path);

    const data: YasumuRestRequest[] = [];

    for (const entry of entries) {
      if (entry.isDirectory) {
        const next = await join(path, entry.name);
        const child = await this.#scan(next);

        const info = {
          name: entry.name,
          method: null,
          children: child,
          path: next,
        } satisfies YasumuRestRequest;

        data.push(info);
      }

      const [name, method] = entry.name.split('.');

      if (!name || !isHttpMethod(method)) continue;

      data.push({
        path: await join(path, entry.name),
        name: entry.name,
        method,
        children: null,
      } satisfies YasumuRestRequest);
    }

    return data;
  }
}
