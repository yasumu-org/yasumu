import { RuntimeNotInitializedError } from '@/common/errors/RuntimeNotInitializedError.js';
import { BaseJavaScriptRuntime, type YasumuRuntimeData } from './BaseJavaScriptRuntime.js';

// This runtime is designed for debugging purposes only. The production runtime should not use web worker version.

const WEB_WORKER_BOOTSTRAP = `async function executeModule(data) {
  const { module, code } = data;
  
  await eval(code);
}
;(async () => {
const Yasumu = {
  console: [],
  request: {},
  response: {},
  serialize() {
    return JSON.stringify({
      console: this.console,
      request: this.request,
      response: this.response,
    });
  },
};

globalThis.Yasumu = Yasumu;

globalThis.addEventListener('message', async (event) => {
  try {
    const data = JSON.parse(event.data);

    switch (data.type) {
      case 'executeModule': {
        const { data } = data;
        await executeModule(data).catch(e => {
          Yasumu.console.push({
            type: 'error',
            args: [String(e)],
            timestamp: Date.now(),
          });
        });

        postMessage(Yasumu.serialize());
        break;
      }
    }
  } catch (error) {
    console.error(error); 
  }
});
})();`;

export class WebWorkerRuntime extends BaseJavaScriptRuntime {
  private worker: Worker | null = null;

  #send<T>(data: any): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new RuntimeNotInitializedError());
        return;
      }

      this.worker.onmessage = (event) => {
        resolve(event.data);
      };

      this.worker.onerror = (event) => {
        reject(event.error);
      };

      this.worker.postMessage(data);
    });
  }

  public initialize(data: YasumuRuntimeData): Promise<void> {
    this.worker = new Worker(WEB_WORKER_BOOTSTRAP, { type: 'module', name: 'YasumuJavaScriptRuntime' });
    return Promise.resolve();
  }

  public async executeModule(module: string, code: string): Promise<YasumuRuntimeData> {
    if (!this.worker) {
      throw new RuntimeNotInitializedError();
    }

    const result = await this.#send<YasumuRuntimeData>({
      type: 'executeModule',
      data: {
        module,
        code,
      },
    });

    return result;
  }
}
