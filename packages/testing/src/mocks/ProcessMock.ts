import type { ProcessCommon } from '@yasumu/common';

export class ProcessMock implements ProcessCommon {
  public async exit(code?: number): Promise<void> {
    process.exit(code);
  }

  public async relaunch(): Promise<void> {}
}
