use deno_ast::MediaType;
use deno_ast::ParseParams;

pub fn transpile_typescript(code: &str) -> Result<String, String> {
    let parsed = deno_ast::parse_module(ParseParams {
        specifier: deno_ast::ModuleSpecifier::parse("file:///yasumu.workspace/script.ts").unwrap(),
        text: code.into(),
        media_type: MediaType::TypeScript,
        capture_tokens: false,
        scope_analysis: false,
        maybe_syntax: None,
    })
    .unwrap();

    let transpiled_source = parsed
        .transpile(
            &deno_ast::TranspileOptions {
                imports_not_used_as_values: deno_ast::ImportsNotUsedAsValues::Remove,
                ..Default::default()
            },
            &deno_ast::EmitOptions {
                source_map: deno_ast::SourceMapOption::None,
                ..Default::default()
            },
        )
        .unwrap()
        .into_source();

    let source_text = String::from_utf8(transpiled_source.source).unwrap();

    Ok(source_text.into())
}
