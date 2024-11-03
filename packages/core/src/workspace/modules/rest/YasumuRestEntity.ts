import { Executable, type ExecutionOptions, type ExecutionResult } from '../common/Executable.js';
import type { YasumuRawRestEntity } from './types.js';
import type { YasumuRest } from './YasumuRest.js';

export class YasumuRestEntity extends Executable {
  public constructor(
    public readonly rest: YasumuRest,
    private readonly data: YasumuRawRestEntity,
  ) {
    super();
  }

  #reformat() {
    this.data ??= {};
  }

  public get id() {
    return this.data.id;
  }

  public get name() {
    return this.data.name;
  }

  public async execute(options?: ExecutionOptions): Promise<ExecutionResult> {
    return {} as ExecutionResult;
  }
}
