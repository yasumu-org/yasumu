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
    isTestEnvironment: boolean;
    serialize(): string;
  }

  var Yasumu: YasumuCore;

  interface TestContext {
    skip: (reason?: string) => void;
    pass: (message?: string) => void;
    fail: (message?: string) => void;
  }

  type YasumuTest = (test: TestContext) => void;

  interface Assertion<T> {
    toBe(expected: T): void;
    toEqual(expected: T): void;
    toBeTruthy(): void;
    toBeFalsy(): void;
    toBeNull(): void;
    toBeUndefined(): void;
    toBeInstanceOf(expected: any): void;
    toMatch(expected: RegExp): void;
    toHaveLength(expected: number): void;
    toHaveProperty(expected: string): void;
    toHaveOwnProperty(expected: string): void;
    toHaveOwnPropertyValue(key: string, value: any): void;
    not: Assertion<T>;
  }

  function test(name: string, test: YasumuTest): void;
  function expect<T>(actual: T): Assertion<T>;
}

export {};
