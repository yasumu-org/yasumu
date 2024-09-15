/// <reference path="./_common.ts" />

(() => {
  class YasumuRequestModel implements YasumuRequest {
    private get data() {
      return Yasumu.context.data;
    }

    public get id(): string {
      return this.data.request.id;
    }

    public get url(): string {
      return this.data.request.url;
    }

    public get method(): string {
      return this.data.request.method;
    }

    public get headers(): Headers {
      const headers = new Headers(this.data.request.headers as HeadersInit);

      // @ts-ignore
      Yasumu.context.__meta.request.headers = headers;

      return headers;
    }

    public cancel(): void {
      Yasumu.context.__meta.request.canceled = true;
    }
  }

  class YasumuResponseModel implements YasumuResponse {
    private get data() {
      return Yasumu.context.data;
    }

    public get contentLength(): number {
      return this.data.response.contentLength;
    }

    public get redirected(): boolean {
      return this.data.response.redirected;
    }

    public get type(): string {
      return this.data.response.type;
    }

    public get ok(): boolean {
      return this.data.response.ok;
    }

    public get cookies(): Cookie[] {
      return this.data.response.cookies;
    }

    public get url(): string {
      return this.data.response.url;
    }

    public get method(): string {
      return this.data.response.method;
    }

    public get headers(): Headers {
      return new Headers(this.data.response.headers as HeadersInit);
    }

    public get status(): number {
      return this.data.response.status;
    }

    public get statusText(): string {
      return this.data.response.statusText;
    }

    public get bodyText(): string {
      return this.data.response.bodyText;
    }

    public get responseTime(): number {
      return this.data.response.responseTime;
    }
  }

  const getStore = () => {
    const val = Yasumu.context.data.store;

    if (!val) {
      return (Yasumu.context.data.store = {});
    }

    return val;
  };
  const getChanges = () => {
    const val = Yasumu.context.__meta.store;

    if (!Array.isArray(val)) {
      return (Yasumu.context.__meta.store = []);
    }

    return val;
  };

  class YasumuStoreModel implements YasumuStore {
    public get(key: string): any {
      return getStore()[key] ?? getChanges().find((change) => change.key === key)?.value;
    }

    public set(key: string, value: any): void {
      if (value === undefined) {
        throw new Error('Value cannot be undefined');
      }

      getStore()[key] = value;
      getChanges().push({ op: 'set', key, value });
    }

    public remove(key: string): void {
      delete getStore()[key];
      getChanges().push({ op: 'delete', key });
    }

    public has(key: string): boolean {
      return key in getStore() || getChanges().some((change) => change.key === key);
    }

    public count(): number {
      const keys = Object.keys(getStore());
      return keys.length + getChanges().filter((change) => change.op === 'set' && !keys.includes(change.key)).length;
    }

    public clear(): void {
      const store = getStore();
      const changes = getChanges();
      for (const key in store) {
        changes.push({ op: 'delete', key });
        delete store[key];
      }
    }

    public entries(): [string, any][] {
      const main = Object.entries(getStore());
      const changes = getChanges();

      const res = [
        changes
          .filter((change) => change.op === 'set' && !main.some((v) => v[0] === change.key))
          .map((v) => [v.key, v.value]),
      ];

      return res.flat() as [string, any][];
    }
  }

  const context = {
    context: {
      data: {},
      __meta: {
        store: [],
        request: {} as any,
        response: {} as any,
        console: [],
        test: [],
      } satisfies YasumuContextMeta,
    },
    setContextData(data: string | Record<string, any>) {
      if (typeof data === 'string') {
        this.context.data = JSON.parse(data);
      } else {
        this.context.data = data;
      }
    },
    request: new YasumuRequestModel(),
    response: new YasumuResponseModel(),
    store: new YasumuStoreModel(),
  };

  function deeplyClean(obj: any) {
    if (!obj) return;

    for (const key in obj) {
      if (obj[key] === undefined) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        deeplyClean(obj[key]);
      }
    }
  }

  Yasumu.serialize = function () {
    const obj = this.context.__meta;

    deeplyClean(obj);

    return JSON.stringify(obj);
  };

  Object.assign(Yasumu, context);
})();
