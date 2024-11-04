import { t, YasumuScriptActions } from "../src";

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

export const YasumuExampleScript = t.script("Example", {
    Metadata: t.objectBlock({
        name: t.optionalObjectValue(t.string()),
        method: t.optionalObjectValue(t.string()),
    }),
    Request: t.objectBlock({
        url: t.objectValue(t.string()),
        params: t.optionalObjectValue(t.record(t.string())),
        headers: t.optionalObjectValue(t.record(t.string())),
        body: t.optionalObjectValue(
            t.object({
                type: t.optionalObjectValue(t.string()),
                data: t.optionalObjectValue(t.string()),
            }),
        ),
    }),
    BeforeRequest: t.optionalCodeBlock(),
    AfterRequest: t.optionalCodeBlock(),
    Test: t.optionalCodeBlock(),
});

const start = () => {
    const actions = new YasumuScriptActions(YasumuExampleScript);
    const parsed = actions.parse(script);
    console.log(JSON.stringify(parsed, null, 4));
    console.log("");
    console.log(actions.serialize(parsed));
};

start();
