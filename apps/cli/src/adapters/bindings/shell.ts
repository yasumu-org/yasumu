import type { ShellCommon, ShellOpenWith } from '@yasumu/common';
import open from 'open';

export class Shell implements ShellCommon {
  public async open(path: string, openWith?: ShellOpenWith): Promise<void> {
    if (openWith) {
      await open(path, { app: { name: openWith } });
    } else {
      await open(path);
    }
  }
}

export function createShell(): ShellCommon {
  return new Shell();
}
