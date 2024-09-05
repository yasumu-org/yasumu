const { YasumuSchemaScriptActions } = require("../dist");

const script = `
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

const start = () => {
    const parsed = YasumuSchemaScriptActions.parse(script);
    console.log(JSON.stringify(parsed, null, 4));
    console.log("");
    console.log(YasumuSchemaScriptActions.serialize(parsed));
};

start();
