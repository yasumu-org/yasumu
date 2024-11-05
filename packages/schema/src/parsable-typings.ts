import type {
    YasumuSchemaParsableScript,
    YasumuSchemaParsable,
    YasumuSchemaParsableBlock,
    YasumuSchemaParsableCodeBlock,
    YasumuSchemaParsableConstant,
    YasumuSchemaParsableList,
    YasumuSchemaParsableObject,
    YasumuSchemaParsableObjectBlock,
    YasumuSchemaParsableRecord,
} from "./parsable.js";

export type YasumuSchemaParasableScriptToType<
    T extends YasumuSchemaParsableScript,
> = {
    annotation: string;
    blocks: {
        [K in keyof T["schema"]]: YasumuSchemaParsableBlockToType<
            T["schema"][K]
        >;
    };
};

export type YasumuSchemaParsableBlockToType<
    T extends YasumuSchemaParsableBlock,
> = T extends YasumuSchemaParsableCodeBlock
    ? YasumuSchemaParsableCodeBlockToType<T>
    : T extends YasumuSchemaParsableObjectBlock
      ? YasumuSchemaParsableObjectBlockToType<T>
      : never;

export type YasumuSchemaParsableCodeBlockToType<
    T extends YasumuSchemaParsableCodeBlock,
> = T extends { required: true } ? string : string | null;

export type YasumuSchemaParsableObjectBlockToType<
    T extends YasumuSchemaParsableObjectBlock,
> = T extends { required: true }
    ? YasumuSchemaParsableObjectToType<T>
    : YasumuSchemaParsableObjectToType<T> | null;

export type YasumuSchemaParsableToType<T extends YasumuSchemaParsable> =
    T extends YasumuSchemaParsableObject
        ? YasumuSchemaParsableObjectToType<T>
        : T extends YasumuSchemaParsableRecord
          ? YasumuSchemaParsableRecordToType<T>
          : T extends YasumuSchemaParsableList
            ? YasumuSchemaParsableListToType<T>
            : T extends YasumuSchemaParsableConstant
              ? YasumuSchemaParsableConstantToType<T>
              : never;

export type YasumuSchemaParsableObjectToType<
    T extends YasumuSchemaParsableObject,
> = {
    [K in keyof T["schema"]]: T["schema"][K] extends { required: true }
        ? YasumuSchemaParsableToType<T["schema"][K]["schema"]>
        : YasumuSchemaParsableToType<T["schema"][K]["schema"]> | null;
};

export type YasumuSchemaParsableRecordToType<
    T extends YasumuSchemaParsableRecord,
> = {
    [K: string]: YasumuSchemaParsableToType<T["schema"]>;
};

export type YasumuSchemaParsableListToType<T extends YasumuSchemaParsableList> =
    YasumuSchemaParsableToType<T["schema"]>[];

export type YasumuSchemaParsableConstantToType<
    T extends YasumuSchemaParsableConstant,
> = T["type"] extends "boolean"
    ? boolean
    : T["type"] extends "number"
      ? number
      : T["type"] extends "string"
        ? string
        : T["type"] extends "null"
          ? null
          : never;
