use deno_ast::{
    parse_module, EmitOptions, ImportsNotUsedAsValues, MediaType, ModuleSpecifier, ParseParams,
    SourceMapOption, TranspileOptions,
};

pub const YASUMU_WORKSPACE_SCRIPT_NAME: &str = "script.ts";
pub const YASUMU_WORKSPACE_SCRIPT_URL: &str = "file:///yasumu.workspace/script.ts";

pub fn transpile_typescript(code: &str) -> Result<String, String> {
    let parsed = parse_module(ParseParams {
        specifier: ModuleSpecifier::parse(YASUMU_WORKSPACE_SCRIPT_URL).unwrap(),
        text: code.into(),
        media_type: MediaType::TypeScript,
        capture_tokens: false,
        scope_analysis: false,
        maybe_syntax: None,
    })
    .unwrap();

    let transpiled_source = parsed
        .transpile(
            &TranspileOptions {
                imports_not_used_as_values: ImportsNotUsedAsValues::Remove,
                ..Default::default()
            },
            &EmitOptions {
                source_map: SourceMapOption::None,
                ..Default::default()
            },
        )
        .unwrap()
        .into_source();

    let source_text = String::from_utf8(transpiled_source.source).unwrap();

    Ok(source_text.into())
}
