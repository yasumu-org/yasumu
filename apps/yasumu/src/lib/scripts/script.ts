export function prepareScript(code: string, ctx: string) {
  return `try {
    void (() => {
      Yasumu.setContextData(${ctx});
      ${code}
    })();
  } catch(e) {
    const err = e && e.stack ? e.stack : String(e);
    
    Yasumu.context.__meta.console.push({
      timestamp: Date.now(),
      type: 'error',
      args: [err],
    })
  }
  
  Yasumu.serialize()
  `;
}

export interface ConsoleStream {
  type: 'log' | 'warn' | 'error' | 'info';
  args: string[];
  timestamp: number;
}

export interface YasumuPostEvaluationData {
  store: Record<string, unknown>;
  requestHeaders: Array<[string, string]> | null;
  console: ConsoleStream[];
}

export function canEvaluateResult(data: YasumuPostEvaluationData | unknown): data is YasumuPostEvaluationData {
  return !!(data && typeof data === 'object');
}
