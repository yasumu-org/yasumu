export interface YasumuSchemaParsableScript {
    annotation: string;
    schema: YasumuSchemaParsableScriptSchema;
}

export interface YasumuSchemaParsableScriptSchema {
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

export interface YasumuSchemaParsableObject {
    type: "object";
    schema: YasumuSchemaParsableObjectSchema;
}

export interface YasumuSchemaParsableObjectSchema {
    [K: string]: YasumuSchemaParsableObjectSchemaValue;
}

export interface YasumuSchemaParsableObjectSchemaValue {
    schema: YasumuSchemaParsable;
    required: boolean;
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
