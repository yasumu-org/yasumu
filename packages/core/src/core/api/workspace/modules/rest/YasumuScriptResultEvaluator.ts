import type { YasumuWorkspace } from '../../YasumuWorkspace.js';

export type LogType = readonly ['log', 'warn', 'error', 'info', 'clear'];
export interface LogStream {
  type: LogType[number];
  args: any[];
  timestamp: number;
}

export interface YasumuRequestContextData {
  id: string;
  url: string;
  method: string;
  headers: Record<string, string | string[]>;
  canceled?: boolean;
}

export interface YasumuResponseContextData {
  url: string;
  method: string;
  headers: Record<string, string | string[]>;
  status: number;
  statusText: string;
  bodyText: string;
  responseTime: number;
  contentLength: number;
  redirected: boolean;
  type: string;
  ok: boolean;
  cookies: YasumuCookie[];
}

export interface YasumuCookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: string;
}

export interface YasumuContextData {
  store: Record<string, any>;
  request: YasumuRequestContextData;
  response: YasumuResponseContextData;
}

export type TestStatus = 'pass' | 'fail' | 'skip';

export interface TestResult {
  name: string;
  status: TestStatus;
  time: number;
  message?: string;
}

export interface YasumuContextMeta {
  store: KV<string, any>[];
  console: LogStream[];
  test: TestResult[];
  request: YasumuRequestContextData;
  response: YasumuResponseContextData;
}

export type KvOp = 'set' | 'delete';

export interface KV<K, V> {
  op: KvOp;
  key: K;
  value?: V;
}

export class YasumuScriptResultEvaluator {
  /**
   * Create a new instance of the evaluator
   * @param workspace The workspace to use
   */
  public constructor(public readonly workspace: YasumuWorkspace) {}

  /**
   * Apply the changes to the context
   * @param changes The changes to apply
   * @param ctx The context to apply the changes to
   */
  public async applyContext(
    changes: YasumuContextMeta,
    ctx: YasumuContextData
  ) {
    if ('request' in changes && 'request' in ctx) {
      Object.assign(ctx.request, changes.request);
    }

    if ('response' in changes && 'response' in ctx) {
      Object.assign(ctx.response, changes.response);
    }

    if ('store' in changes && changes.store.length > 0) {
      await this.updateStore(changes.store);
    }
  }

  /**
   * Update the store with the given changes
   * @param store The changes to apply to the store
   */
  public async updateStore(store: KV<string, any>[]) {
    if (store.length < 1) return;

    const kv = this.workspace.openKV();

    for (const action of store) {
      switch (action.op) {
        case 'set':
          await kv.set(action.key, action.value);
          break;
        case 'delete':
          await kv.delete(action.key);
          break;
        default:
          break;
      }
    }
  }
}
