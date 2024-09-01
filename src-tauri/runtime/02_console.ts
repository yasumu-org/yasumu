/// <reference path="./_common.ts" />
(() => {
  function inspect(value: any, visited = new WeakSet(), indentLevel = 0): string {
    try {
      if (typeof value === 'string') {
        return `"${value}"`;
      }
      if (
        typeof value === 'number' ||
        typeof value === 'bigint' ||
        typeof value === 'symbol' ||
        typeof value === 'boolean' ||
        typeof value === 'undefined' ||
        value === null
      ) {
        return String(value);
      }

      if (typeof value === 'function') {
        return `function ${value.name || '<anonymous>'}() { [native code] }`;
      }

      if (typeof value === 'object') {
        if (visited.has(value)) {
          return '[Circular]';
        }

        visited.add(value);

        if (Array.isArray(value)) {
          return `[${value.map((item) => inspect(item, visited, indentLevel + 2)).join(', ')}]`;
        }

        if (value && 'constructor' in value && value.constructor && value.constructor.name) {
          return `${value.constructor.name} {}`;
        }

        const indent = ' '.repeat(indentLevel);
        const nestedIndent = ' '.repeat(indentLevel + 2);
        let result = '{\n';

        let enumerableFound = 0;

        for (const key in value) {
          if (Object.prototype.propertyIsEnumerable.call(value, key)) {
            enumerableFound++;
            result += `${nestedIndent}${key}: ${inspect(value[key], visited, indentLevel + 2)},\n`;
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

  const CONSOLE_METHODS: LogType = ['log', 'error', 'warn', 'info'];

  const console = new Proxy<YasumuConsole>({} as YasumuConsole, {
    get(target, prop, receiver) {
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
