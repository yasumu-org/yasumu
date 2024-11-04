import { BaseEntity } from '../common/BaseEntity.js';
import { type ExecutionOptions, type ExecutionResult } from '../common/types.js';
import type { YasumuSocketIO } from './YasumuSocketIO.js';

export class YasumuSocketIOEntity extends BaseEntity {
  public constructor(
    public readonly module: YasumuSocketIO,
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
