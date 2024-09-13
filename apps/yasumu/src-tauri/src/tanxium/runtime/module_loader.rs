use std::path::Path;

use boa_engine::{module::ModuleLoader, JsData, Module};
use boa_gc::{Finalize, Trace};
use boa_parser::Source;

use crate::tanxium::typescript::transpile_typescript;

#[derive(Default, Trace, Finalize, JsData)]
struct YasumuHostData {
    #[unsafe_ignore_trace]
    cwd: String,
}

#[derive(Debug, Default)]
pub struct YasumuModuleLoader {}

impl ModuleLoader for YasumuModuleLoader {
    fn load_imported_module(
        &self,
        _referrer: boa_engine::module::Referrer,
        specifier: boa_engine::JsString,
        finish_load: Box<
            dyn FnOnce(boa_engine::JsResult<boa_engine::Module>, &mut boa_engine::Context),
        >,
        context: &mut boa_engine::Context,
    ) {
        let specifier = specifier.to_std_string_escaped();
        let is_file = specifier.starts_with(".")
            || specifier.starts_with("..")
            || specifier.starts_with("/")
            || specifier.starts_with("file://");

        if is_file {
            let path = std::path::Path::new(specifier.as_str()).canonicalize();

            if path.is_err() {
                finish_load(
                    Err(boa_engine::JsNativeError::typ()
                        .with_message(format!("Cannot resolve module at: {}", specifier))
                        .into()),
                    context,
                );
                return;
            }

            let path = path.unwrap();
            let source = std::fs::read_to_string(path);

            if source.is_err() {
                finish_load(
                    Err(boa_engine::JsNativeError::typ()
                        .with_message(format!("Cannot read module at: {}", specifier))
                        .into()),
                    context,
                );
                return;
            }

            let source = source.unwrap();
            let source = Source::from_bytes(source.as_str());
            let module = Module::parse(source, None, context);

            finish_load(module, context);
        } else if specifier.starts_with("http://") || specifier.starts_with("https://") {
            finish_load(
                Err(boa_engine::JsNativeError::typ()
                    .with_message(format!(
                        "Fetching remote module is currently unsupported (Module: {})",
                        specifier
                    ))
                    .into()),
                context,
            );
        } else {
            let cwd = context.get_data::<YasumuHostData>();

            if let Some(cwd_data) = cwd {
                let path = Path::new(cwd_data.cwd.as_str()).join(&specifier);
                let possible_paths = vec![
                    "index.js",
                    "index.cjs",
                    "index.mjs",
                    "index.jsx",
                    "index.ts",
                    "index.cts",
                    "index.mts",
                    "index.tsx",
                ];

                for module_file in possible_paths {
                    let js_path = path.join(module_file);
                    if js_path.exists() {
                        match std::fs::read_to_string(&js_path) {
                            Ok(source) => {
                                let is_ts = js_path.extension().map_or(false, |ext| {
                                    ext == "ts" || ext == "cts" || ext == "mts" || ext == "tsx"
                                });
                                let source = if is_ts {
                                    let js = transpile_typescript(source.as_str());

                                    if js.is_err() {
                                        finish_load(
                                            Err(boa_engine::JsNativeError::typ()
                                                .with_message(format!(
                                                    "Cannot transpile TypeScript module at: {}",
                                                    js_path.display()
                                                ))
                                                .into()),
                                            context,
                                        );
                                        return;
                                    }

                                    js.unwrap()
                                } else {
                                    source
                                };
                                let source = Source::from_bytes(source.as_str());
                                let module = Module::parse(source, None, context);

                                finish_load(module, context);
                                return;
                            }
                            Err(e) => {
                                finish_load(
                                    Err(boa_engine::JsNativeError::typ()
                                        .with_message(format!(
                                            "Cannot read module at: {} ({})",
                                            js_path.display(),
                                            e
                                        ))
                                        .into()),
                                    context,
                                );
                                return;
                            }
                        }
                    }
                }
            } else {
                finish_load(
                    Err(boa_engine::JsNativeError::typ()
                        .with_message("Cannot resolve module without a current working directory")
                        .into()),
                    context,
                );
                return;
            }
        }
    }
}

pub fn set_cwd(context: &mut boa_engine::Context, cwd: String) {
    context.insert_data(YasumuHostData { cwd }).unwrap();
}
