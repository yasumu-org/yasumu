import { HttpMethods, isHttpMethod } from '@/core/common/constants.js';
import { YasumuWorkspace } from '../../YasumuWorkspace.js';
import { YasumuWorkspaceFiles } from '../../constants.js';
import { YasumuRestEntity } from './YasumuRestEntity.js';
import { YasumuRestImports } from './YasumuRestImports.js';

export interface YasumuRestRequest {
  path: string;
  method: HttpMethods | null;
  name: string;
  children: YasumuRestRequest[] | null;
}

export interface TreeViewElement {
  id: string;
  name: string;
  children?: TreeViewElement[];
}

export class YasumuRest {
  public readonly imports = new YasumuRestImports(this);

  /**
   * Create a new YasumuRest instance
   * @param workspace The parent YasumuWorkspace instance
   */
  public constructor(public readonly workspace: YasumuWorkspace) {}

  /**
   * The path to the HTTP requests directory
   */
  public getPath() {
    return this.workspace.resolvePath(YasumuWorkspaceFiles.Http);
  }

  /**
   * Ensure the workspace has the necessary directories for requests
   */
  public async ensureSelf() {
    const path = this.getPath();
    const hasPath = await this.workspace.yasumu.fs.exists(path);

    if (!hasPath) {
      await this.workspace.yasumu.fs.mkdir(path);
    }
  }

  /**
   * Open a request from the workspace
   * @param path The path to the request
   */
  public async open(path: string): Promise<YasumuRestEntity>;
  public async open(path: string, create: true): Promise<YasumuRestEntity>;
  public async open(
    path: string,
    create: false
  ): Promise<YasumuRestEntity | null>;
  public async open(
    path: string,
    create: boolean
  ): Promise<YasumuRestEntity | null>;
  public async open(
    path: string,
    create = true
  ): Promise<YasumuRestEntity | null> {
    await this.ensureSelf();

    const hasRequest = await this.workspace.yasumu.fs.exists(path);

    if (!hasRequest) return null;

    const data = await this.workspace.yasumu.fs.readTextFile(path);

    try {
      return new YasumuRestEntity(this, JSON.parse(data));
    } catch {
      if (!create) return null;
      const id = await this.workspace.yasumu.path.basename(path);
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

  /**
   * Copy a request to a new location in the workspace
   * @param current The current path of the request
   * @param target The target path of the request
   */
  public async copy(current: string, target: string) {
    await this.ensureSelf();

    const hasRequest = await this.workspace.yasumu.fs.exists(current);

    if (!hasRequest) return;

    const currentName = await this.workspace.yasumu.path.basename(current);

    const doesTargetHaveCurrentName = await this.workspace.yasumu.fs.exists(
      await this.workspace.yasumu.path.join(target, currentName)
    );

    if (doesTargetHaveCurrentName) {
      const targetName = await this.workspace.yasumu.path.basename(target);
      target = await this.workspace.yasumu.path.join(
        target,
        `${targetName} - Copy`
      );
    } else {
      target = await this.workspace.yasumu.path.join(target, currentName);
    }

    const entity = await this.open(current, false);

    if (entity) {
      entity.setPath(target);
      await entity.save();
    }

    await this.workspace.yasumu.fs.copyFile(current, target);
  }

  /**
   * Move a request to a new location in the workspace
   * @param current The current path of the request
   * @param target The target path of the request
   */
  public async move(current: string, target: string) {
    await this.ensureSelf();

    const hasRequest = await this.workspace.yasumu.fs.exists(current);

    if (!hasRequest) return;

    const currentName = await this.workspace.yasumu.path.basename(current);

    const doesTargetHaveCurrentName = await this.workspace.yasumu.fs.exists(
      await this.workspace.yasumu.path.join(target, currentName)
    );

    if (doesTargetHaveCurrentName) {
      const targetName = await this.workspace.yasumu.path.basename(target);
      target = await this.workspace.yasumu.path.join(
        target,
        `${targetName} - Copy`
      );
    } else {
      target = await this.workspace.yasumu.path.join(target, currentName);
    }

    const entity = await this.open(current, false);

    if (entity) {
      entity.setPath(target);
      await entity.save();
    }

    await this.workspace.yasumu.fs.rename(current, target);
  }

  /**
   * Delete a request from the workspace
   * @param path The path to the request
   */
  public async delete(path: string) {
    await this.ensureSelf();

    const hasRequest = await this.workspace.yasumu.fs.exists(path);

    if (!hasRequest) return;

    await this.workspace.yasumu.fs.remove(path, {
      recursive: true,
    });
  }

  /**
   * Rename a request in the workspace
   * @param path The path to the request
   * @param newName The new name of the request
   * @param dir True if the path is a directory
   */
  public async rename(path: string, newName: string, dir: boolean) {
    await this.ensureSelf();

    if (!newName) return;

    const hasRequest = await this.workspace.yasumu.fs.exists(path);

    if (!hasRequest) return;

    const ext = dir
      ? ''
      : await this.workspace.yasumu.path.extname(path).catch(() => '');
    const dirName = dir
      ? (await this.workspace.yasumu.path.dirname(path)).replace(
          await this.workspace.yasumu.path.basename(path),
          ''
        )
      : await this.workspace.yasumu.path.dirname(path);

    const extension = ext ? `.${ext}` : '';
    const newPath = await this.workspace.yasumu.path.join(
      dirName,
      `${newName}${extension}`
    );

    const entity = await this.open(path, false);

    if (entity) {
      entity.setPath(newPath);
      await entity.save();
    }

    await this.workspace.yasumu.fs.rename(path, newPath);
  }

  /**
   * Create a new request in the workspace
   * @param name The name of the request
   * @param method The HTTP method of the request
   * @param basePath The base path to create the request in
   */
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
      const path = await this.workspace.yasumu.path.join(basePath, name);
      await this.workspace.yasumu.fs.mkdir(path, { recursive: true });
      return;
    }

    const path = await this.workspace.yasumu.path.join(
      basePath,
      `${name}.${method}`
    );

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

  /**
   * Get all requests in the workspace as a tree view
   * @returns tree view data
   */
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

  /**
   * Get all requests in the workspace
   * @returns array of requests
   */
  public async getRequests(): Promise<YasumuRestRequest[]> {
    const path = this.getPath();
    const hasRequests = await this.workspace.yasumu.fs.exists(path);

    if (!hasRequests) {
      await this.workspace.yasumu.fs.mkdir(path);
      return [];
    }

    return this.#scan(path);
  }

  async #scan(path: string): Promise<YasumuRestRequest[]> {
    const entries = await this.workspace.yasumu.fs.readDir(path);

    const data: YasumuRestRequest[] = [];

    for (const entry of entries) {
      if (entry.isDirectory) {
        const next = await this.workspace.yasumu.path.join(path, entry.name);
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
        path: await this.workspace.yasumu.path.join(path, entry.name),
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
