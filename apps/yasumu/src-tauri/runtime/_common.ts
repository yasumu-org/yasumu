import {
  LogType as YasumuLogType,
  LogStream as YasumuLogStream,
  YasumuResponseContextData,
  YasumuRequestContextData,
  YasumuContextData as YasumuContextDataCore,
  YasumuContextMeta as YasumuContextMetaCore,
  YasumuCookie,
} from '@yasumu/core';

declare global {
  interface YasumuRequire {
    (id: string): any;
    resolve(id: string): string;
    cache: Record<string, any>;
  }

  type Cookie = YasumuCookie;

  var __require: YasumuRequire;

  // @ts-ignore
  var require: YasumuRequire;

  interface YasumuCrypto {
    randomUUID(): string;
    randomULID(): string;
    randomNanoId(): string;
  }

  // @ts-ignore
  var crypto: YasumuCrypto;

  type LogType = YasumuLogType;
  type LogStream = YasumuLogStream;

  interface NamedConsoleMethods {
    clear(): void;
  }

  type YasumuConsole = Omit<
    {
      [K in LogType[number]]: (...args: any[]) => void;
    },
    keyof NamedConsoleMethods
  > &
    NamedConsoleMethods;

  interface YasumuStore {
    get(key: string): any;
    set(key: string, value: any): void;
    remove(key: string): void;
    has(key: string): boolean;
    count(): number;
    clear(): void;
    entries(): [string, any][];
  }

  type YasumuContextData = YasumuContextDataCore;
  type YasumuContextMeta = YasumuContextMetaCore;

  interface YasumuRequest extends Omit<YasumuRequestContextData, 'headers' | 'canceled'> {
    headers: Headers;
    cancel(): void;
  }

  interface YasumuResponse extends Omit<YasumuResponseContextData, 'headers'> {
    headers: Headers;
  }

  interface YasumuFeatures {
    typescript: boolean;
    test: boolean;
  }

  interface YasumuCore {
    context: {
      __meta: YasumuContextMeta;
      data: YasumuContextData;
    };
    request: YasumuRequest;
    response: YasumuResponse;
    store: YasumuStore;
    features: YasumuFeatures;
    utils: {
      getStackTrace(): string;
    };
    serialize(): string;
    nanoseconds(): bigint;
    sleep(ms: number): Promise<number>;
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
