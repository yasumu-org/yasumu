export const Console = `var console = {
    inspect(obj) {
      if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
        return obj;
      }

      if (obj == null || typeof obj === 'bigint') {
        return String(obj);
      }

      if (typeof obj === 'symbol') {
        return \`Symbol(\${obj.description})\`;
      }

      if (typeof obj === 'function') {
        return \`function \${obj.name}() { [native code] }\`;
      }

      return JSON.stringify(obj, null, 2);
    },
    log(...args) {
      Yasumu.context.__meta.console.push({ timestamp: Date.now(), type: 'log', args: args.map((arg) => console.inspect(arg)) });
    },
    error(...args) {
      Yasumu.context.__meta.console.push({ timestamp: Date.now(), type: 'error', args: args.map((arg) => console.inspect(arg)) });
    },
    warn(...args) {
      Yasumu.context.__meta.console.push({ timestamp: Date.now(), type: 'warn', args: args.map((arg) => console.inspect(arg)) });
    },
    info(...args) {
      Yasumu.context.__meta.console.push({ timestamp: Date.now(), type: 'info', args: args.map((arg) => console.inspect(arg)) });
    },
  };`;
