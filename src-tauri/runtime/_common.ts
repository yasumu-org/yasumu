declare global {
  type LogType = readonly ['log', 'error', 'warn', 'info'];

  type LogStream = {
    type: LogType[number];
    args: any[];
    timestamp: number;
  };

  type YasumuConsole = {
    [K in LogType[number]]: (...args: any[]) => void;
  };

  interface YasumuRequest {
    url: string;
    method: string;
    headers: Headers;
  }

  interface YasumuResponse {
    url: string;
    method: string;
    headers: Headers;
    status: number;
    statusText: string;
    bodyText: string;
    responseTime: number;
  }

  interface YasumuStore {
    get(key: string): any;
    set(key: string, value: any): void;
    remove(key: string): void;
    has(key: string): boolean;
    count(): number;
    clear(): void;
    entries(): [string, any][];
  }

  interface YasumuContextData {
    request: {
      url: string;
      method: string;
      headers: Record<string, string>;
    };
    response: {
      url: string;
      method: string;
      headers: Record<string, string>;
      status: number;
      statusText: string;
      bodyText: string;
      responseTime: number;
    };
  }

  interface YasumuContextMeta {
    store: Record<string, any>;
    console: LogStream[];
    requestHeaders: Headers;
  }

  interface YasumuCore {
    context: {
      __meta: YasumuContextMeta;
      data: YasumuContextData;
    };
    request: YasumuRequest;
    response: YasumuResponse;
    store: YasumuStore;
    serialize(): string;
    sleep(ms: number): Promise<void>;
  }

  var Yasumu: YasumuCore;
}

export {};
