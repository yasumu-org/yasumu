export interface YasumuSchemaParasableScript {
    [K: string]: YasumuSchemaParsableBlock;
}

export type YasumuSchemaParsableBlock =
    | YasumuSchemaParsableCodeBlock
    | YasumuSchemaParsableObjectBlock;

export interface YasumuSchemaParsableCodeBlock {
    type: "code";
    required: boolean;
}

export interface YasumuSchemaParsableObjectBlock
    extends YasumuSchemaParsableObject {
    required: boolean;
}

export type YasumuSchemaParsable =
    | YasumuSchemaParsableObject
    | YasumuSchemaParsableRecord
    | YasumuSchemaParsableList
    | YasumuSchemaParsableConstant;

export interface YasumuSchemaParsableKeyPairs {
    [K: string]: {
        schema: YasumuSchemaParsable;
        required: boolean;
    };
}

export interface YasumuSchemaParsableObject {
    type: "object";
    schema: YasumuSchemaParsableKeyPairs;
}

export interface YasumuSchemaParsableRecord {
    type: "record";
    schema: YasumuSchemaParsable;
}

export interface YasumuSchemaParsableList {
    type: "list";
    schema: YasumuSchemaParsable;
}

export interface YasumuSchemaParsableConstant {
    type: "boolean" | "number" | "string" | "null";
}
