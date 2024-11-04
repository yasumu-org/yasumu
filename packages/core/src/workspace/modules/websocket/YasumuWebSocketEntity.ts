import { BaseEntity } from '../common/BaseEntity.js';
import { type ExecutionOptions, type ExecutionResult } from '../common/types.js';
import type { YasumuWebSocket } from './YasumuWebSocket.js';

export class YasumuWebSocketEntity extends BaseEntity {
  public constructor(
    public readonly module: YasumuWebSocket,
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
