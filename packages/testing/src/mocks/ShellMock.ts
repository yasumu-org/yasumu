import type { ShellCommon, ShellOpenWith } from '@yasumu/common';

export class ShellMock implements ShellCommon {
  public async open(path: string, openWith?: ShellOpenWith): Promise<void> {}
}
