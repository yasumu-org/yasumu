/// <reference path="./_common.ts" />

(() => {
  class YasumuRequestModel implements YasumuRequest {
    private get data() {
      return Yasumu.context.data;
    }

    public get url(): string {
      return this.data.request.url;
    }

    public get method(): string {
      return this.data.request.method;
    }

    public get headers(): Headers {
      Yasumu.context.__meta.requestHeaders = new Headers(this.data.request.headers);
      return Yasumu.context.__meta.requestHeaders;
    }
  }

  class YasumuResponseModel implements YasumuResponse {
    private get data() {
      return Yasumu.context.data;
    }

    public get url(): string {
      return this.data.response.url;
    }

    public get method(): string {
      return this.data.response.method;
    }

    public get headers(): Headers {
      return new Headers(this.data.response.headers);
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
      return Yasumu.context.__meta.store;
    }

    public get(key: string): any {
      return this.store[key];
    }

    public set(key: string, value: any): void {
      this.store[key] = value;
    }

    public remove(key: string): void {
      delete this.store[key];
    }

    public has(key: string): boolean {
      return key in this.store;
    }

    public count(): number {
      return Object.keys(this.store).length;
    }

    public clear(): void {
      for (const key in this.store) {
        delete this.store[key];
      }
    }

    public entries(): [string, any][] {
      return Object.entries(this.store);
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
