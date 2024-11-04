import type {
    YasumuSchemaParsableScript,
    YasumuSchemaParsableScriptSchema,
    YasumuSchemaParsableCodeBlock,
    YasumuSchemaParsableObjectBlock,
    YasumuSchemaParsableList,
    YasumuSchemaParsableObject,
    YasumuSchemaParsableObjectSchema,
    YasumuSchemaParsableRecord,
    YasumuSchemaParsableConstant,
    YasumuSchemaParsable,
    YasumuSchemaParsableObjectSchemaValue,
} from "./parsable.js";

export class YasumuSchemaFactories {
    script<T extends YasumuSchemaParsableScriptSchema>(
        annotation: string,
        blocks: T,
    ) {
        return {
            annotation,
            schema: blocks,
        } satisfies YasumuSchemaParsableScript;
    }

    codeBlock() {
        return {
            type: "code",
            required: true,
        } satisfies YasumuSchemaParsableCodeBlock;
    }

    optionalCodeBlock() {
        return {
            type: "code",
            required: false,
        } satisfies YasumuSchemaParsableCodeBlock;
    }

    objectBlock<T extends YasumuSchemaParsableObjectSchema>(schema: T) {
        return {
            type: "object",
            schema,
            required: true,
        } satisfies YasumuSchemaParsableObjectBlock;
    }

    optionalObjectBlock<T extends YasumuSchemaParsableObjectSchema>(schema: T) {
        return {
            type: "object",
            schema,
            required: false,
        } satisfies YasumuSchemaParsableObjectBlock;
    }

    object<T extends YasumuSchemaParsableObjectSchema>(schema: T) {
        return {
            type: "object",
            schema,
        } satisfies YasumuSchemaParsableObject;
    }

    objectValue<T extends YasumuSchemaParsable>(schema: T) {
        return {
            schema,
            required: true,
        } satisfies YasumuSchemaParsableObjectSchemaValue;
    }

    optionalObjectValue<T extends YasumuSchemaParsable>(schema: T) {
        return {
            schema,
            required: false,
        } satisfies YasumuSchemaParsableObjectSchemaValue;
    }

    record<T extends YasumuSchemaParsable>(schema: T) {
        return {
            type: "record",
            schema,
        } satisfies YasumuSchemaParsableRecord;
    }

    list<T extends YasumuSchemaParsable>(schema: T) {
        return {
            type: "list",
            schema,
        } satisfies YasumuSchemaParsableList;
    }

    boolean() {
        return { type: "boolean" } satisfies YasumuSchemaParsableConstant;
    }

    number() {
        return { type: "number" } satisfies YasumuSchemaParsableConstant;
    }

    string() {
        return { type: "string" } satisfies YasumuSchemaParsableConstant;
    }

    null() {
        return { type: "null" } satisfies YasumuSchemaParsableConstant;
    }
}

export const t = new YasumuSchemaFactories();
