import type { ProcessCommon } from '@yasumu/common';

export class Process implements ProcessCommon {
  public async exit(code?: number): Promise<void> {
    process.exit(code);
  }

  public async relaunch(): Promise<void> {
    process.exit(0);
  }
}

export function createProcess(): ProcessCommon {
  return new Process();
}
