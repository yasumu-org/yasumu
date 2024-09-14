export type ConsoleLogLevel = 'log' | 'warn' | 'error' | 'info';

export interface ConsoleStream {
  type: ConsoleLogLevel;
  args: string[];
  timestamp: number;
  test?: boolean;
}

export interface YasumuPostEvaluationData {
  store: Record<string, unknown>;
  requestHeaders: Array<[string, string]> | null;
  console: ConsoleStream[];
}

export function canEvaluateResult(data: YasumuPostEvaluationData | unknown): data is YasumuPostEvaluationData {
  return !!(data && typeof data === 'object');
}
