use std::time::Duration;

use tanxium::{
    deno_runtime::deno_core::{error::AnyError, ModuleSpecifier},
    tanxium::{Tanxium, TanxiumExtensionEntry, TanxiumOptions},
};

pub struct RuntimeBootstrapOptions {
    pub current_workspace: Option<String>,
    pub specifier: ModuleSpecifier,
    pub main_module: String,
    pub runtime_data: Option<String>,
}

pub struct TanxiumRuntimeManager {}

impl TanxiumRuntimeManager {
    pub fn new() -> Self {
        Self {}
    }

    pub async fn bootstrap_runtime(
        &self,
        options: RuntimeBootstrapOptions,
    ) -> Result<String, String> {
        let stringify = |e: AnyError| e.to_string();
        let tanxium_options = TanxiumOptions {
            cwd: options
                .current_workspace
                .unwrap_or("<anonymous>".to_string()),
            extensions: vec![],
            main_module: options.specifier.clone(),
            mode: tanxium::deno_runtime::WorkerExecutionMode::Run,
        };

        let mut tanxium = Tanxium::new(tanxium_options).map_err(stringify)?;

        let extensions = vec![
            TanxiumExtensionEntry {
                code: include_str!("./source/01_console.js"),
                specifier: ModuleSpecifier::parse("yasumu-internal://01_console.js")
                    .map_err(|e| e.to_string())?,
            },
            TanxiumExtensionEntry {
                code: include_str!("./source/99_yasumu.ts"),
                specifier: ModuleSpecifier::parse("yasumu-internal://99_yasumu.ts")
                    .map_err(|e| e.to_string())?,
            },
        ];

        tanxium
            .load_runtime_api(Some(extensions))
            .await
            .map_err(stringify)?;

        if let Some(runtime_data) = options.runtime_data {
            tanxium.set_runtime_data(runtime_data).map_err(stringify)?;
        }

        tanxium
            .execute_main_module_code(&options.specifier, options.main_module)
            .await
            .map_err(stringify)?;

        tanxium
            .run_up_to_duration(Duration::from_secs(30))
            .await
            .map_err(stringify)?;

        let data = tanxium.get_runtime_data().map_err(stringify)?;

        Ok(data)
    }
}
