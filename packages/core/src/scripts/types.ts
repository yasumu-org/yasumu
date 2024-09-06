export interface ScriptsCommon {
  evaluate<T = unknown>(
    script: string,
    contextData: string,
    config: Record<string, unknown>
  ): Promise<T>;
}
