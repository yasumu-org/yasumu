export const Util = `
var Util = {
    inspect(value, visited = new WeakSet(), indentLevel = 0) {
        try {
            if (typeof value === 'string') {
                return \`"\${value}"\`;
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

            if (typeof value === 'object') {
                if (visited.has(value)) {
                    return '[Circular]';
                }
                visited.add(value);

                if (value instanceof ArrayBuffer || value instanceof SharedArrayBuffer || value instanceof DataView || value instanceof Object.getPrototypeOf(Uint8Array)) {
                    return \`\${value.constructor.name} [byteLength: \${value.byteLength}]\`;
                }

                if (Array.isArray(value)) {
                    return \`[\${value.map(item => Util.inspect(item, visited, indentLevel + 2)).join(', ')}]\`;
                }

                const indent = ' '.repeat(indentLevel);
                const nestedIndent = ' '.repeat(indentLevel + 2);
                let result = '{\\n';

                let enumerableFound = 0;

                for (const key in value) {
                    if (Object.prototype.propertyIsEnumerable.call(value, key)) {
                        enumerableFound++;
                        result += \`\${nestedIndent}\${key}: \${Util.inspect(value[key], visited, indentLevel + 2)},\\n\`;
                    }
                }

                if (enumerableFound < 1) return '{}';

                if (result.endsWith(',\\n')) {
                    result = result.slice(0, -2) + '\\n';
                }

                result += \`\${indent}}\`;

                return result;
            }

            return value;
        } catch (e) {
            return String(value);
        }
    }
};
`;
