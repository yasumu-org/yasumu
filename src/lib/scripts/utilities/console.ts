import { Util } from './util';

export const Console = `
${Util}

const console = {
    log(...args) {
      Yasumu.context.__meta.console.push({ timestamp: Date.now(), type: 'log', args: args.map((arg) => Util.inspect(arg)) });
    },
    error(...args) {
      Yasumu.context.__meta.console.push({ timestamp: Date.now(), type: 'error', args: args.map((arg) => Util.inspect(arg)) });
    },
    warn(...args) {
      Yasumu.context.__meta.console.push({ timestamp: Date.now(), type: 'warn', args: args.map((arg) => Util.inspect(arg)) });
    },
    info(...args) {
      Yasumu.context.__meta.console.push({ timestamp: Date.now(), type: 'info', args: args.map((arg) => Util.inspect(arg)) });
    },
  };`;
