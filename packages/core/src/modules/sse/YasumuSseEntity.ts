import { BaseEntity } from '../common/BaseEntity.js';
import { type ExecutionOptions, type ExecutionResult } from '../common/types.js';
import type { YasumuSSE } from './YasumuSSE.js';

export class YasumuSseEntity extends BaseEntity {
  public constructor(
    public readonly module: YasumuSSE,
    public data: any,
  ) {
    super();
  }

  public createRootIndexData(): Record<string, any> {
    return {};
  }

  public async execute(options?: ExecutionOptions): Promise<ExecutionResult> {
    return {} as ExecutionResult;
  }
}
