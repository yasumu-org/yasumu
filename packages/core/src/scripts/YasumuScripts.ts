import type { YasumuCore } from '@/core/index.js';
import type { ScriptsCommon } from './types.js';

export class YasumuScripts {
  /**
   * Creates an instance of YasumuScripts.
   * @param yasumu The YasumuCore instance.
   * @param adapter The adapter to use for running scripts.
   */
  public constructor(
    public readonly yasumu: YasumuCore,
    private readonly adapter: ScriptsCommon
  ) {}

  /**
   * Create a context data string from the given data.
   * @param data The data to create a context from.
   * @returns The context data string.
   */
  public createContextData<T = unknown>(data: T): string {
    return JSON.stringify(data);
  }

  /**
   * Execute the given script with the given context.
   * @param script The script to execute.
   * @param context The context to execute the script with.
   * @returns The result of the script.
   */
  public async run<T = unknown, C = unknown>(
    script: string,
    context: C
  ): Promise<T> {
    const ctx = this.createContextData(context);
    const result = await this.adapter.evaluate<T>(script, ctx);

    return result;
  }
}
