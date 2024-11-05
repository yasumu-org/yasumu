import { YasumuSchemaLexer } from "./lexer.js";
import type { YasumuSchemaParsableScript } from "./parsable.js";
import type { YasumuSchemaParsableScriptToType } from "./parsable-typings.js";
import { YasumuSchemaParser } from "./parser.js";
import { YasumuSchemaScanner } from "./scanner.js";
import { YasumuSchemaSerializer } from "./serializer.js";

export class YasumuScriptActions<T extends YasumuSchemaParsableScript> {
    constructor(public readonly script: T) {}

    parse(content: string) {
        const lexer = new YasumuSchemaLexer(content);
        const scanner = new YasumuSchemaScanner(lexer);
        const parser = new YasumuSchemaParser(scanner);
        return parser.parse(this.script);
    }

    serialize(value: YasumuSchemaParsableScriptToType<T>) {
        const serializer = new YasumuSchemaSerializer();
        return serializer.serialize(this.script, value);
    }
}
