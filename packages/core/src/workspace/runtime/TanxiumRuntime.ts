import { BaseJavaScriptRuntime, type YasumuRuntimeData } from './BaseJavaScriptRuntime.js';

export class TanxiumRuntime extends BaseJavaScriptRuntime {
  public async executeModule(module: string, code: string): Promise<YasumuRuntimeData> {
    return {};
  }

  public initialize(data: YasumuRuntimeData): Promise<void> {
    return Promise.resolve();
  }
}
