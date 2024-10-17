/// <reference path="./_common.d.ts" />
import { core } from 'ext:core/mod.js';
import * as console from 'ext:deno_console/01_console.js';

const print = core.print;

function getLogType(level) {
  switch (level) {
    case 0:
      return 'debug';
    case 1:
      return 'log';
    case 2:
      return 'warn';
    case 3:
      return 'error';
    default:
      return 'log';
  }
}

globalThis.console = new console.Console((msg, level) => {
  try {
    const data = Tanxium.getRuntimeData();
    const target = data.console;

    if (target != null && Array.isArray(target)) {
      target.push({
        timestamp: Date.now(),
        type: getLogType(level),
        args: [msg],
      });
    }
  } catch {
    //
  }

  print(msg, level > 1);
});
