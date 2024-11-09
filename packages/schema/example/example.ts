import { t, YasumuSchemaActions } from "../src";

const script = `
@Example

Metadata {
    name: "Test"
    method: "GET"
}

Request {
    url: "https://example.com"
    body: null
    params: {
        key1: "hello"
        key2: 123
        key3: true
        key4: null
    }
}

Test {
    console.log("tested");
}
`;

export const YasumuExampleScript = t.script({
    annotation: "Example",
    blocks: {
        Metadata: t.object({
            name: t.nullable(t.string()),
            method: t.nullable(t.string()),
        }),
        Request: t.object({
            url: t.string(),
            params: t.nullable(
                t.record(
                    t.union(t.string(), t.number(), t.boolean(), t.null()),
                ),
            ),
            headers: t.nullable(t.record(t.string())),
            body: t.nullable(
                t.object({
                    type: t.string(),
                    data: t.string(),
                }),
            ),
        }),
        BeforeRequest: t.nullable(t.code()),
        AfterRequest: t.nullable(t.code()),
        Test: t.nullable(t.code()),
    },
});

const start = () => {
    const actions = new YasumuSchemaActions(YasumuExampleScript);
    const parsed = actions.parse(script);
    console.log(JSON.stringify(parsed, null, 4));
    console.log("");
    console.log(actions.serialize(parsed));
};

start();
