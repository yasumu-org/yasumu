import { YasumuSchemaParasableScript, YasumuScriptActions } from "../src";

const script = `
@Example

Metadata {
    name: "Test"
    method: "GET"
}

Request {
    url: "https://example.com"
    body: null
    params: {}
}

Test {
    console.log("tested");
}
`;

export const YasumuExampleScript = {
    annotation: "Example",
    blocks: {
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
    },
} as const satisfies YasumuSchemaParasableScript;

const start = () => {
    const actions = new YasumuScriptActions(YasumuExampleScript);
    const parsed = actions.parse(script);
    console.log(JSON.stringify(parsed, null, 4));
    console.log("");
    console.log(actions.serialize(parsed));
};

start();
