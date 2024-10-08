/// <reference path="./_common.ts" />
(() => {
  const COMMON_OBJECTS = new Set(['Map', 'Set', 'WeakMap', 'WeakSet']);
  const MAX_DEPTH = 2;

  function inspect(value: any, visited = new WeakSet(), indentLevel = 0, root = true, depth = 0): string {
    try {
      if (typeof value === 'string') {
        if (!root) return `"${value}"`;
        return value;
      }

      if (typeof value === 'bigint') {
        return `${value}n`;
      }

      if (
        typeof value === 'number' ||
        typeof value === 'symbol' ||
        typeof value === 'boolean' ||
        typeof value === 'undefined' ||
        value === null
      ) {
        return String(value);
      }

      if (typeof value === 'function') {
        const str = value.toString();
        return str || `function ${value.name || '<anonymous>'}() { [native code] }`;
      }

      if (typeof value === 'object') {
        if (depth > MAX_DEPTH) {
          return '{ ... }';
        }
        if (visited.has(value)) {
          return '[Circular]';
        }

        visited.add(value);

        if (value instanceof Error) {
          let msg = value.stack || String(value);

          if (!value.stack) {
            msg += `\n${Yasumu.utils.getStackTrace()}`;
          }

          return msg;
        }

        if (Array.isArray(value)) {
          return `[${value.map((item) => inspect(item, visited, indentLevel + 2, false, depth + 1)).join(', ')}]`;
        }

        if (value && 'constructor' in value && value.constructor && COMMON_OBJECTS.has(value.constructor.name)) {
          return `${value.constructor.name} {}`;
        }

        const indent = ' '.repeat(indentLevel);
        const nestedIndent = ' '.repeat(indentLevel + 2);
        let result = '{\n';

        let enumerableFound = 0;

        for (const key in value) {
          if (Object.prototype.propertyIsEnumerable.call(value, key)) {
            enumerableFound++;
            result += `${nestedIndent}${key}: ${inspect(value[key], visited, indentLevel + 2, false, depth + 1)},\n`;
          }
        }

        if (enumerableFound < 1) return '{}';

        if (result.endsWith(',\n')) {
          result = result.slice(0, -2) + '\n';
        }

        result += `${indent}}`;

        return result;
      }

      return value;
    } catch (e) {
      return String(value);
    }
  }

  const CONSOLE_METHODS: LogType = ['log', 'warn', 'error', 'info', 'clear'];

  const console = new Proxy<YasumuConsole>({} as YasumuConsole, {
    get(target, prop, receiver) {
      if (prop === 'clear') {
        return () => {
          Yasumu.context.__meta.console.length = 0;
        };
      }

      if (CONSOLE_METHODS.includes(prop as any)) {
        return (...args: any[]) => {
          Yasumu.context.__meta.console.push({
            timestamp: Date.now(),
            type: prop as unknown as LogType[number],
            args: args.map((arg) => inspect(arg)),
          });
        };
      }

      return Reflect.get(target, prop, receiver);
    },
  });

  Object.defineProperty(globalThis, 'console', {
    value: console,
    writable: false,
    configurable: false,
    enumerable: false,
  });
})();
