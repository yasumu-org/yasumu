import { YasumuSchemaLexer } from "./lexer";
import { YasumuSchemaParasableScript } from "./parsable";
import { YasumuSchemaParasableScriptToType } from "./parsable-typings";
import { YasumuSchemaParser } from "./parser";
import { YasumuSchemaScanner } from "./scanner";
import { YasumuSchemaSerializer } from "./serializer";

export const YasumuSchemaScript = {
    Metadata: {
        type: "object",
        schema: {
            name: {
                schema: {
                    type: "string",
                },
                required: false,
            },
            method: {
                schema: {
                    type: "string",
                },
                required: true,
            },
        },
        required: true,
    },
    Request: {
        type: "object",
        schema: {
            url: {
                schema: {
                    type: "string",
                },
                required: true,
            },
            params: {
                schema: {
                    type: "record",
                    schema: {
                        type: "string",
                    },
                },
                required: false,
            },
            headers: {
                schema: {
                    type: "record",
                    schema: {
                        type: "string",
                    },
                },
                required: false,
            },
            body: {
                schema: {
                    type: "object",
                    schema: {
                        type: {
                            schema: {
                                type: "string",
                            },
                            required: true,
                        },
                        data: {
                            schema: {
                                type: "string",
                            },
                            required: true,
                        },
                    },
                },
                required: false,
            },
        },
        required: true,
    },
    BeforeRequest: {
        type: "code",
        required: false,
    },
    AfterRequest: {
        type: "code",
        required: false,
    },
    Test: {
        type: "code",
        required: false,
    },
} as const satisfies YasumuSchemaParasableScript;

export type YasumuSchemaScript = YasumuSchemaParasableScriptToType<
    typeof YasumuSchemaScript
>;

export const YasumuSchemaScriptActions = {
    parse: (content: string) => {
        const lexer = new YasumuSchemaLexer(content);
        const scanner = new YasumuSchemaScanner(lexer);
        const parser = new YasumuSchemaParser(scanner);
        return parser.parse(YasumuSchemaScript) as YasumuSchemaScript;
    },
    serialize: (value: YasumuSchemaScript) => {
        const serializer = new YasumuSchemaSerializer();
        return serializer.serialize(YasumuSchemaScript, value);
    },
};
