import type {
    YasumuSchemaParsableScript,
    YasumuSchemaParsable,
    YasumuSchemaParsableList,
    YasumuSchemaParsableObject,
    YasumuSchemaParsableRecord,
} from "./parsable.js";
import type {
    YasumuSchemaParasableScriptToType,
    YasumuSchemaParsableListToType,
    YasumuSchemaParsableObjectToType,
    YasumuSchemaParsableRecordToType,
} from "./parsable-typings.js";
import { YasumuSchemaScanner } from "./scanner.js";
import {
    type YasumuSchemaToken,
    type YasumuSchemaTokenType,
    YasumuSchemaTokenTypes,
} from "./tokens.js";

export class YasumuSchemaParser {
    currentToken = DUMMY_TOKEN;

    constructor(public readonly scanner: YasumuSchemaScanner) {
        this.advance();
    }

    parse<T extends YasumuSchemaParsableScript>(script: T) {
        const blocks: Record<string, any> = {};
        const keys = new Set(Object.keys(script.schema));
        const annotation = this.parseAnnotation(script);
        while (!this.isEOF()) {
            const [key, value] = this.parseBlock(script);
            blocks[key] = value;
            keys.delete(key);
        }
        for (const x of keys) {
            if (script.schema[x]!.required && !(x in blocks)) {
                throw new YasumuSchemaParserError(
                    `Missing required block '${x}'`,
                );
            }
            blocks[x] ??= null;
        }
        return { annotation, blocks } as YasumuSchemaParasableScriptToType<T>;
    }

    parseAnnotation(script: YasumuSchemaParsableScript) {
        const annotation = this.consume(YasumuSchemaTokenTypes.ANNOTATION);
        if (annotation.value !== script.annotation) {
            const { line, column } = annotation.span.start;
            throw new YasumuSchemaParserError(
                `Expected '${script.annotation}' annotation, received '${annotation.value}' (at line ${line}, column ${column})`,
            );
        }
        return annotation.value;
    }

    parseBlock(script: YasumuSchemaParsableScript) {
        const identifier = this.consume(YasumuSchemaTokenTypes.IDENTIFIER);
        const node = script.schema[identifier.value]!;
        if (!node) {
            const { line, column } = identifier.span.start;
            throw new YasumuSchemaParserError(
                `Unexpected block '${identifier.value}' (at line ${line}, column ${column})`,
            );
        }
        if (node.type === "code") {
            return [identifier.value, this.parseCodeBlock()] as const;
        }
        if (node.type === "object") {
            return [identifier.value, this.parseObject(node)] as const;
        }
        throw new YasumuSchemaUnexpectedParserError();
    }

    parseCodeBlock() {
        this.ensure(YasumuSchemaTokenTypes.LEFT_CURLY_BRACKET);
        let open = 0;
        let content = "";
        while (!this.isEOF()) {
            const char = this.scanner.lexer.peek();
            if (char === LEFT_CURLY_BRACKET) {
                open++;
            }
            if (char === RIGHT_CURLY_BRACKET) {
                if (open === 0) {
                    break;
                }
                open--;
            }
            content += this.scanner.lexer.advance();
        }
        // re-sync parser
        this.advance();
        this.consume(YasumuSchemaTokenTypes.RIGHT_CURLY_BRACKET);
        return content;
    }

    parseNode<T extends YasumuSchemaParsable>(node: T) {
        if (node.type === "object") {
            return this.parseObject(node as YasumuSchemaParsableObject);
        }
        if (node.type === "record") {
            return this.parseRecord(node);
        }
        if (node.type === "list") {
            return this.parseList(node);
        }
        if (node.type === "boolean") {
            return this.parseBoolean();
        }
        if (node.type === "string") {
            return this.parseString();
        }
        if (node.type === "number") {
            return this.parseNumber();
        }
        if (node.type === "null") {
            return this.parseNull();
        }
        throw new YasumuSchemaUnexpectedParserError();
    }

    parseObject<T extends YasumuSchemaParsableObject>(node: T) {
        const object: Record<string, any> = {};
        const keys = new Set(Object.keys(node.schema));
        this.consume(YasumuSchemaTokenTypes.LEFT_CURLY_BRACKET);
        while (
            !this.isEOF() &&
            !this.check(YasumuSchemaTokenTypes.RIGHT_CURLY_BRACKET)
        ) {
            const x = this.consume(YasumuSchemaTokenTypes.IDENTIFIER);
            if (!keys.has(x.value)) {
                const { line, column } = x.span.start;
                throw new YasumuSchemaParserError(
                    `Unexpected object key '${x}' (at line ${line}, column ${column})`,
                );
            }
            this.consume(YasumuSchemaTokenTypes.COLON);
            const schema = node.schema[x.value]!;
            const value =
                !schema.required && this.check(YasumuSchemaTokenTypes.NULL)
                    ? this.parseNull()
                    : this.parseNode(schema.schema);
            object[x.value] = value;
            keys.delete(x.value);
        }
        const end = this.consume(YasumuSchemaTokenTypes.RIGHT_CURLY_BRACKET);
        for (const x of keys) {
            if (node.schema[x]!.required && !(x in object)) {
                const { line, column } = end.span.start;
                throw new YasumuSchemaParserError(
                    `Missing required object key '${x}' (at line ${line}, column ${column})`,
                );
            }
            object[x] ??= null;
        }
        return object as YasumuSchemaParsableObjectToType<T>;
    }

    parseRecord<T extends YasumuSchemaParsableRecord>(node: T) {
        const record: Record<string, any> = {};
        this.consume(YasumuSchemaTokenTypes.LEFT_CURLY_BRACKET);
        while (
            !this.isEOF() &&
            !this.check(YasumuSchemaTokenTypes.RIGHT_CURLY_BRACKET)
        ) {
            const key = this.consume(YasumuSchemaTokenTypes.IDENTIFIER);
            this.consume(YasumuSchemaTokenTypes.COLON);
            const value = this.parseNode(node.schema);
            record[key.value] = value;
        }
        this.consume(YasumuSchemaTokenTypes.RIGHT_CURLY_BRACKET);
        return record as YasumuSchemaParsableRecordToType<T>;
    }

    parseList<T extends YasumuSchemaParsableList>(node: T) {
        const list: any[] = [];
        this.consume(YasumuSchemaTokenTypes.LEFT_SQUARE_BRACKET);
        let proceed = true;
        while (
            proceed &&
            !this.isEOF() &&
            !this.check(YasumuSchemaTokenTypes.RIGHT_SQUARE_BRACKET)
        ) {
            list.push(this.parseNode(node.schema));
            proceed = this.match(YasumuSchemaTokenTypes.COMMA) !== false;
        }
        this.consume(YasumuSchemaTokenTypes.RIGHT_SQUARE_BRACKET);
        return list as YasumuSchemaParsableListToType<T>;
    }

    parseBoolean() {
        if (this.match(YasumuSchemaTokenTypes.TRUE)) {
            return true;
        }
        if (this.match(YasumuSchemaTokenTypes.FALSE)) {
            return false;
        }
        const { type, span } = this.currentToken!;
        const { line, column } = span.start;
        throw new YasumuSchemaParserError(
            `Expected '${YasumuSchemaTokenTypes.TRUE}' or '${YasumuSchemaTokenTypes.FALSE}', received '${type}' (at line ${line}, column ${column})`,
        );
    }

    parseNull() {
        this.consume(YasumuSchemaTokenTypes.NULL);
        return null;
    }

    parseNumber() {
        const token = this.consume(YasumuSchemaTokenTypes.NUMBER);
        return parseInt(token.value);
    }

    parseString() {
        const token = this.consume(YasumuSchemaTokenTypes.STRING);
        return token.value;
    }

    advance() {
        const previousToken = this.currentToken;
        this.currentToken = this.scanner.readToken();
        return previousToken;
    }

    check(type: YasumuSchemaTokenType) {
        return this.currentToken.type === type;
    }

    match(type: YasumuSchemaTokenType) {
        if (this.currentToken.type !== type) {
            return false;
        }
        return this.advance();
    }

    ensure(type: YasumuSchemaTokenType) {
        if (this.currentToken.type !== type) {
            const { line, column } = this.currentToken!.span.start;
            throw new YasumuSchemaParserError(
                `Expected '${type}' token, received '${this.currentToken.type}' (at line ${line}, column ${column})`,
            );
        }
    }

    consume(type: YasumuSchemaTokenType) {
        this.ensure(type);
        return this.advance();
    }

    isEOF() {
        return this.currentToken.type === YasumuSchemaTokenTypes.EOF;
    }
}

const LEFT_CURLY_BRACKET = "{";
const RIGHT_CURLY_BRACKET = "}";

const DUMMY_TOKEN: YasumuSchemaToken = {
    type: YasumuSchemaTokenTypes.EOF,
    value: "",
    span: {
        start: {
            line: -1,
            column: -1,
        },
        end: {
            line: -1,
            column: -1,
        },
    },
};

export class YasumuSchemaParserError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class YasumuSchemaUnexpectedParserError extends Error {
    constructor() {
        super("This should never be executed");
    }
}
