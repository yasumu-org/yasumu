import type { ApplicationCommon } from '@yasumu/common';

export class ApplicationMock implements ApplicationCommon {
  public async getName(): Promise<string> {
    return 'Yasumu';
  }

  public async getRuntimeVersion(): Promise<string> {
    return '1.0.0';
  }

  public async getVersion(): Promise<string> {
    return '1.0.0';
  }
}
