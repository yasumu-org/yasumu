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

  class YasumuStoreModel implements YasumuStore {
    private get store() {
      return Yasumu.context.data.store;
    }

    private get changes() {
      return Yasumu.context.__meta.store;
    }

    public get(key: string): any {
      return this.store[key] ?? this.changes.find((change) => change.key === key)?.value;
    }

    public set(key: string, value: any): void {
      this.store[key] = value;
      this.changes.push({ op: 'set', key, value });
    }

    public remove(key: string): void {
      delete this.store[key];
      this.changes.push({ op: 'delete', key });
    }

    public has(key: string): boolean {
      return key in this.store || this.changes.some((change) => change.key === key);
    }

    public count(): number {
      const keys = Object.keys(this.store);
      return keys.length + this.changes.filter((change) => change.op === 'set' && !keys.includes(change.key)).length;
    }

    public clear(): void {
      for (const key in this.store) {
        this.changes.push({ op: 'delete', key });
        delete this.store[key];
      }
    }

    public entries(): [string, any][] {
      const main = Object.entries(this.store);

      const res = [
        this.changes
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
        store: {},
        requestHeaders: {},
        console: [],
      },
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

  Yasumu.serialize = function () {
    return JSON.stringify(this.context.__meta);
  };

  Object.assign(Yasumu, context);
})();
