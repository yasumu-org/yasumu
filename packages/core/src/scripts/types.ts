export interface ScriptsCommon {
  evaluate<T = unknown>(script: string, contextData: string): Promise<T>;
}
