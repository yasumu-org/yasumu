use boa_engine::{
    job::NativeJob, module::ModuleLoader, JsData, JsNativeError, JsResult, JsValue, Module,
};
use boa_gc::{Finalize, Trace};
use boa_parser::Source;
use reqwest::blocking::Client;
use std::{path::Path, time::Duration};

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
        let specifier = if specifier.starts_with("file://") {
            specifier.replace("file://", "")
        } else {
            specifier
        };

        let is_file = Path::new(specifier.as_str()).exists();
        let is_remote_script =
            specifier.starts_with("http://") || specifier.starts_with("https://");

        if is_file {
            let job = Box::pin(async move {
                let source: Result<String, std::io::Error> = async {
                    let path = std::path::Path::new(specifier.as_str()).canonicalize()?;
                    let content = smol::fs::read_to_string(path).await;
                    Ok(content?)
                }
                .await;

                create_fs_native_job(source, finish_load)
            });

            context.job_queue().enqueue_future_job(job, context);
        } else if is_remote_script {
            let job = Box::pin(async move {
                let script: Result<String, std::io::Error> = async {
                    println!("Fetching remote script: {}", specifier.clone());
                    let client = Client::new();
                    let res = client
                        .get(specifier.as_str())
                        .timeout(Duration::from_secs(30))
                        .send()
                        .map_err(|e| {
                            std::io::Error::new(std::io::ErrorKind::InvalidData, e.to_string())
                        })?;
                    let is_typescript = match res.headers().get("content-type") {
                        Some(content_type) => content_type == "application/typescript",
                        None => false,
                    };
                    println!(
                        "Remote script content type is typescript: {:?}",
                        is_typescript.clone()
                    );
                    let text = res.text().map_err(|e| {
                        std::io::Error::new(std::io::ErrorKind::InvalidData, e.to_string())
                    })?;

                    println!("Remote script fetched");

                    if is_typescript {
                        match transpile_typescript(text.as_str()) {
                            Ok(js) => Ok(js),
                            Err(e) => Err(std::io::Error::new(
                                std::io::ErrorKind::InvalidData,
                                e.to_string(),
                            )),
                        }
                    } else {
                        Ok(text)
                    }
                }
                .await;

                create_fs_native_job(script, finish_load)
            });

            context.job_queue().enqueue_future_job(job, context);
        } else {
            let cwd = get_cwd(context);
            let job = Box::pin(async move {
                let content: Result<String, std::io::Error> = async {
                    let path = Path::new(cwd.as_str()).join(&specifier);
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

                    let ts_exts = vec!["ts", "cts", "mts", "tsx"];

                    let mut found = false;
                    let mut is_ts = false;

                    for module_file in possible_paths {
                        let js_path = path.join(module_file);
                        if js_path.exists() {
                            found = true;
                            is_ts = js_path
                                .extension()
                                .map_or(false, |ext| ts_exts.iter().any(|ts_ext| ext == *ts_ext));
                            break;
                        }
                    }

                    if !found {
                        return Err(std::io::Error::new(
                            std::io::ErrorKind::NotFound,
                            format!("Cannot find module: {}", specifier),
                        ));
                    }

                    let content = smol::fs::read_to_string(path).await?;
                    if is_ts {
                        let transpiled = transpile_typescript(content.as_str());
                        match transpiled {
                            Ok(js) => Ok(js),
                            Err(e) => Err(std::io::Error::new(
                                std::io::ErrorKind::InvalidData,
                                e.to_string(),
                            )),
                        }
                    } else {
                        Ok(content)
                    }
                }
                .await;

                create_fs_native_job(content, finish_load)
            });

            context.job_queue().enqueue_future_job(job, context);
        };
    }
}

fn create_fs_native_job(
    content: Result<String, std::io::Error>,
    finish_load: Box<dyn FnOnce(JsResult<Module>, &mut boa_engine::Context)>,
) -> NativeJob {
    NativeJob::new(move |context| -> JsResult<JsValue> {
        let content = match content {
            Ok(content) => content,
            Err(err) => {
                finish_load(
                    Err(JsNativeError::typ().with_message(err.to_string()).into()),
                    context,
                );

                return Ok(JsValue::undefined());
            }
        };

        println!("[FINAL] Loaded module content:\n{}", content.clone());

        let source = Source::from_bytes(content.as_str());
        let module = Module::parse(source, None, context);
        finish_load(module, context);
        Ok(JsValue::undefined())
    })
}

fn get_cwd(context: &mut boa_engine::Context) -> String {
    let realm = context.realm().clone();
    let host_defined = realm.host_defined();
    let yasumu_context_data = host_defined.get::<YasumuHostData>().unwrap();

    yasumu_context_data.cwd.clone()
}

pub fn set_cwd(context: &mut boa_engine::Context, cwd: String) {
    let result = context
        .realm()
        .clone()
        .host_defined_mut()
        .insert(YasumuHostData { cwd: cwd.clone() });

    if result.is_none() {
        println!("Failed to set current working directory");
    } else {
        println!("Current working directory set to: {}", cwd);
    }
}
