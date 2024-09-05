// @ts-nocheck
import { AdapterType, createAdapter, YasumuCore } from '../src/index.js';

const core = new YasumuCore({
  app: createAdapter(AdapterType.Application, {
    async getName() {
      return 'Yasumu';
    },
    async getRuntimeVersion() {
      return '1.1.1';
    },
    async getVersion() {
      return '0.0.0';
    },
  }),
  createStore: () => {
    const store = new Map();

    return createAdapter(AdapterType.Store, {
      async delete(key) {
        return store.delete(key);
      },
      async get(key) {
        return store.get(key);
      },
      async set(key, value) {
        store.set(key, value);
      },
      async entries<T>(): Promise<[string, T][]> {
        return store.entries() as any;
      },
      async has(key) {
        return store.has(key);
      },
      async keys(): Promise<string[]> {
        return store.keys() as any;
      },
      async length() {
        return store.size;
      },
      async load() {},
      async onChange() {
        return () => {};
      },
      async onKeyChange() {
        return () => {};
      },
      async reset() {
        store.clear();
      },
      async save() {},
      async values() {
        return store.values() as any;
      },
    });
  },
  commands: createAdapter(AdapterType.Command, {
    async addPluginListener(plugin, event, cb) {
      return {} as any;
    },
    async invoke(command, args, options) {
      return {} as any;
    },
  }),
  dialog: createAdapter(AdapterType.Dialog, {
    async open(options) {
      return {} as any;
    },
    async save(options) {
      return {} as any;
    },
  }),
  events: createAdapter(AdapterType.Events, {}),
  fetch: globalThis.fetch,
  fs: createAdapter(AdapterType.FileSystem, {}),
  path: createAdapter(AdapterType.Path, {}),
  process: createAdapter(AdapterType.Process, {}),
  scripts: {
    async evaluate(script, contextData) {},
  },
});
