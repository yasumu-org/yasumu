import type { ApplicationCommon } from '@yasumu/common';
import { name, version } from '../../version.js';

export class Application implements ApplicationCommon {
  public async getName(): Promise<string> {
    return name;
  }

  public async getRuntimeVersion(): Promise<string> {
    return process.versions.node;
  }

  public async getVersion(): Promise<string> {
    return version;
  }
}

export function createApplication() {
  return new Application();
}
