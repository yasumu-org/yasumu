import { createYasumu } from '@yasumu/core';
import { createApplication } from './adapters/bindings/application.js';
import { createCommands } from './adapters/bindings/commands.js';
import { createStore } from './adapters/bindings/store.js';
import { createDialog } from './adapters/bindings/dialog.js';
import { createEvents } from './adapters/bindings/events.js';
import { createFileSystem } from './adapters/bindings/fs.js';
import { createPath } from './adapters/bindings/path.js';
import { createProcess } from './adapters/bindings/process.js';
import { createShell } from './adapters/bindings/shell.js';
import { createWebSocket } from './adapters/bindings/websocket.js';
import { createFetch } from './adapters/bindings/fetch.js';

export const bootstrap = () =>
  createYasumu({
    adapters: {
      app: createApplication(),
      command: createCommands(),
      createStore: createStore(),
      dialog: createDialog(),
      events: createEvents(),
      fetch: createFetch(),
      fs: createFileSystem(),
      path: createPath(),
      process: createProcess(),
      shell: createShell(),
      websocket: createWebSocket(),
    },
  });
