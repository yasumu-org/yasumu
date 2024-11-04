import type {
    YasumuSchemaParasableScript,
    YasumuSchemaParsable,
    YasumuSchemaParsableBlock,
    YasumuSchemaParsableCodeBlock,
    YasumuSchemaParsableConstant,
    YasumuSchemaParsableList,
    YasumuSchemaParsableObject,
    YasumuSchemaParsableObjectBlock,
    YasumuSchemaParsableRecord,
} from "./parsable.js";
import type {
    YasumuSchemaParasableScriptToType,
    YasumuSchemaParsableBlockToType,
    YasumuSchemaParsableCodeBlockToType,
    YasumuSchemaParsableConstantToType,
    YasumuSchemaParsableListToType,
    YasumuSchemaParsableObjectBlockToType,
    YasumuSchemaParsableObjectToType,
    YasumuSchemaParsableRecordToType,
    YasumuSchemaParsableToType,
} from "./parsable-typings.js";
import { YasumuSchemaUtils } from "./utils.js";

/**
 * This is highly experimental. Use with caution.
 */
export class YasumuSchemaSerializer {
    depth = 0;
    keyPath: string[] = [];

    serialize<T extends YasumuSchemaParasableScript>(
        script: T,
        value: YasumuSchemaParasableScriptToType<T>,
    ) {
        try {
            return this._serialize(script, value);
        } catch (err) {
            throw new Error(
                `Error occured when serializing "${this.keyPath.join(".")}"`,
                // @ts-ignore
                { cause: err },
            );
        }
    }

    _serialize<T extends YasumuSchemaParasableScript>(
        script: T,
        value: YasumuSchemaParasableScriptToType<T>,
    ) {
        let output = `@${script.annotation}\n\n`;
        for (const x of Object.keys(script.blocks)) {
            const xNode = script.blocks[x]!;
            const xValue = value.blocks[x]!;
            if (!xNode.required && (xValue === undefined || xValue === null)) {
                continue;
            }
            this.keyPath.push(x);
            output += this.serializeBlock(x, xNode, xValue);
            this.keyPath.pop();
            output += "\n\n";
        }
        return output;
    }

    serializeBlock<T extends YasumuSchemaParsableBlock>(
        identifier: string,
        node: T,
        value: YasumuSchemaParsableBlockToType<T>,
    ) {
        let output = identifier + " ";
        if (node.type === "code") {
            output += this.serializeCodeBlock(
                node,
                value as NonNullable<
                    YasumuSchemaParsableCodeBlockToType<YasumuSchemaParsableCodeBlock>
                >,
            );
            return output;
        }
        if (node.type === "object") {
            output += this.serializeObject(
                node,
                value as NonNullable<
                    YasumuSchemaParsableObjectBlockToType<YasumuSchemaParsableObjectBlock>
                >,
            );
            return output;
        }
        throw new YasumuSchemaUnexpectedSerializerError();
    }

    serializeCodeBlock<T extends YasumuSchemaParsableCodeBlock>(
        _: T,
        value: NonNullable<YasumuSchemaParsableCodeBlockToType<T>>,
    ) {
        let output = this.indent() + "{\n";
        this.incrementIndent();
        for (const x of value.trim().split("\n")) {
            output += this.indent() + x + "\n";
        }
        this.decrementIndent();
        output += this.indent() + "}";
        return output;
    }

    serializeNode<T extends YasumuSchemaParsable>(
        node: T,
        value: YasumuSchemaParsableToType<T>,
    ) {
        if (node.type === "object") {
            return this.serializeObject(
                node,
                value as YasumuSchemaParsableObjectToType<YasumuSchemaParsableObject>,
            );
        }
        if (node.type === "record") {
            return this.serializeRecord(
                node,
                value as YasumuSchemaParsableRecordToType<YasumuSchemaParsableRecord>,
            );
        }
        if (node.type === "list") {
            return this.serializeList(
                node,
                value as YasumuSchemaParsableListToType<YasumuSchemaParsableList>,
            );
        }
        if (YasumuSchemaSerializer._isConstantNode(node)) {
            return this.serializeConstant(
                node,
                value as YasumuSchemaParsableConstantToType<typeof node>,
            );
        }
        throw new YasumuSchemaUnexpectedSerializerError();
    }

    serializeObject<T extends YasumuSchemaParsableObject>(
        node: T,
        value: YasumuSchemaParsableObjectToType<T>,
    ) {
        let output = "{\n";
        this.incrementIndent();
        for (const x of Object.keys(node.schema)) {
            const xNode = node.schema[x]!;
            const xValue = value[x];
            if (!xNode.required && (xValue === undefined || xValue === null)) {
                continue;
            }
            this.keyPath.push(x);
            output += this.indent();
            output += this.serializeIdentifier(x) + ": ";
            output += this.serializeNode(
                xNode.schema as T["schema"][typeof x]["schema"],
                xValue as YasumuSchemaParsableToType<
                    T["schema"][typeof x]["schema"]
                >,
            );
            output += "\n";
            this.keyPath.pop();
        }
        this.decrementIndent();
        output += this.indent() + "}";
        return output;
    }

    serializeRecord<T extends YasumuSchemaParsableRecord>(
        node: T,
        value: YasumuSchemaParsableRecordToType<T>,
    ) {
        let output = "{\n";
        this.incrementIndent();
        for (const x of Object.keys(value)) {
            this.keyPath.push(x);
            output += this.indent();
            output += this.serializeIdentifier(x) + ": ";
            output += this.serializeNode(node.schema as T["schema"], value[x]!);
            output += "\n";
            this.keyPath.pop();
        }
        this.decrementIndent();
        output += this.indent() + "}";
        return output;
    }

    serializeList<T extends YasumuSchemaParsableList>(
        node: T,
        value: YasumuSchemaParsableListToType<T>,
    ) {
        let output = "[\n";
        this.incrementIndent();
        let i = 0;
        for (const x of value) {
            this.keyPath.push(`${i}`);
            output += this.indent();
            output += this.serializeNode(node.schema as T["schema"], x);
            output += ",\n";
            this.keyPath.pop();
        }
        this.decrementIndent();
        output += this.indent() + "]";
        return output;
    }

    serializeConstant<T extends YasumuSchemaParsableConstant>(
        _: T,
        value: YasumuSchemaParsableConstantToType<T>,
    ) {
        if (value === undefined) {
            // @ts-expect-error
            value = null;
        }
        return JSON.stringify(value);
    }

    serializeIdentifier(value: string) {
        if (YasumuSchemaUtils.isIdentifierString(value)) {
            return value;
        }
        return `\`${value}\``;
    }

    indent() {
        let output = "";
        for (let i = 0; i < this.depth; i++) {
            output += INDENTATION_SPACE;
        }
        return output;
    }

    incrementIndent() {
        this.depth++;
    }

    decrementIndent() {
        this.depth--;
    }

    static _constantTypes: YasumuSchemaParsableConstant["type"][] = [
        "boolean",
        "string",
        "number",
        "null",
    ];

    static _isConstantNode(node: any): node is YasumuSchemaParsableConstant {
        return (
            typeof node === "object" && this._constantTypes.includes(node.type)
        );
    }
}

const INDENTATION_SPACE = " ".repeat(2);

export class YasumuSchemaUnexpectedSerializerError extends Error {
    constructor() {
        super("This should never be executed");
    }
}
