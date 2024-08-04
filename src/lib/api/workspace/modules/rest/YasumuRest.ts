import { HttpMethods, isHttpMethod } from '@/lib/constants';
import { YasumuWorkspace } from '../../YasumuWorkspace';
import { YasumuWorkspaceFiles } from '../../constants';
import {
  exists,
  mkdir,
  readDir,
  readTextFile,
  remove,
  rename,
  copyFile,
} from '@tauri-apps/plugin-fs';
import { join, dirname, extname, basename } from '@tauri-apps/api/path';
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

    try {
      return new YasumuRestEntity(this, JSON.parse(data));
    } catch {
      const id = await basename(path);
      const name = (await YasumuRestEntity.getName(id)) ?? 'New request';
      const method = YasumuRestEntity.getMethod(id) ?? HttpMethods.GET;

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
  }

  public async copy(current: string, target: string) {
    await this.ensureSelf();

    const hasRequest = await exists(current);

    if (!hasRequest) return;

    const currentName = await basename(current);

    const doesTargetHaveCurrentName = await exists(
      await join(target, currentName)
    );

    if (doesTargetHaveCurrentName) {
      const targetName = await basename(target);
      target = await join(target, `${targetName} - Copy`);
    } else {
      target = await join(target, currentName);
    }

    await copyFile(current, target);
  }

  public async move(current: string, target: string) {
    await this.ensureSelf();

    const hasRequest = await exists(current);

    if (!hasRequest) return;

    const currentName = await basename(current);

    const doesTargetHaveCurrentName = await exists(
      await join(target, currentName)
    );

    if (doesTargetHaveCurrentName) {
      const targetName = await basename(target);
      target = await join(target, `${targetName} - Copy`);
    } else {
      target = await join(target, currentName);
    }

    await rename(current, target);
  }

  public async delete(path: string) {
    await this.ensureSelf();

    const hasRequest = await exists(path);

    if (!hasRequest) return;

    await remove(path, {
      recursive: true,
    });
  }

  public async rename(path: string, newName: string, dir: boolean) {
    await this.ensureSelf();

    if (!newName) return;

    const hasRequest = await exists(path);

    if (!hasRequest) return;

    const ext = dir ? '' : await extname(path).catch(() => '');
    const dirName = dir
      ? (await dirname(path)).replace(await basename(path), '')
      : await dirname(path);

    const extension = ext ? `.${ext}` : '';
    const newPath = await join(dirName, `${newName}${extension}`);

    await rename(path, newPath);
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

    return data.sort((a, b) => {
      if (a.method === null && b.method !== null) return -1;
      if (a.method !== null && b.method === null) return 1;
      return a.name.localeCompare(b.name);
    });
  }
}
