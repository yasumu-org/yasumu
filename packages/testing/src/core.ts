import { createYasumu } from '@yasumu/core';
import {
  ApplicationMock,
  CommandsMock,
  StoreMock,
  DialogMock,
  EventsMock,
  FileSystemMock,
  PathMock,
  ProcessMock,
  ShellMock,
} from './mocks/index.js';

export const Yasumu = createYasumu({
  adapters: {
    app: new ApplicationMock(),
    command: new CommandsMock(),
    store: new StoreMock('test'),
    dialog: new DialogMock(),
    events: new EventsMock(),
    fs: new FileSystemMock(),
    path: new PathMock(),
    process: new ProcessMock(),
    shell: new ShellMock(),
    fetch,
  },
});
