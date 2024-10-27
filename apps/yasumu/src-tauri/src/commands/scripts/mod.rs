use std::time::Duration;

use tanxium::deno_runtime::{self, deno_core};
use tanxium::tanxium::{Tanxium, TanxiumExtensionEntry, TanxiumOptions};
// use tauri::Manager;

use super::workspace::WorkspaceState;

#[tauri::command]
pub async fn evaluate_javascript(
    // app: tauri::AppHandle,
    code: &str,
    prepare: &str,
    // id: &str,
    workspace_state: tauri::State<'_, WorkspaceState>,
    // smtp_server_state: tauri::State<'_, super::smtp::ServerState>,
) -> Result<String, String> {
    let code = code.to_string();
    let prepare = prepare.to_string();
    // let id = id.to_string();
    let current_workspace = workspace_state.get_current_workspace();
    // let smtp_handler = smtp_server_state.get_handler();
    // let smtp_messages = match smtp_handler.messages.read() {
    //     Ok(messages) => Some(messages.clone()),
    //     Err(_) => None,
    // };

    let fut = async move {
        // TODO: allow None
        let current_workspace_dir = current_workspace
            .clone()
            .unwrap_or("<anonymous-workspace>".to_string());

        let module_specifier = deno_core::ModuleSpecifier::parse(
            format!("{}/{}", current_workspace_dir, "script.ts").as_str(),
        )
        .map_err(|e| {
            format!(
                "FatalError: Failed to parse module specifier: {}",
                e.to_string()
            )
        })?;

        let options = TanxiumOptions {
            main_module: module_specifier.clone(),
            cwd: current_workspace_dir.clone(),
            extensions: vec![],
            mode: deno_runtime::WorkerExecutionMode::Run,
        };

        let mut tanxium = Tanxium::new(options).map_err(|e| e.to_string())?;

        let js_apis = vec![TanxiumExtensionEntry {
            code: include_str!("./runtime/01_console.js"),
            specifier: deno_core::ModuleSpecifier::parse("ext:yasumu/01_console.js")
                .map_err(|e| e.to_string())?,
        }];

        tanxium
            .load_runtime_api(Some(js_apis))
            .await
            .map_err(|e| e.to_string())?;

        tanxium
            .set_runtime_data(prepare)
            .map_err(|e| e.to_string())?;

        let result = tanxium.execute_main_module_code(&module_specifier, code);

        let output = match result.await {
            Ok(_) => {
                let data = tanxium.get_runtime_data().map_err(|e| e.to_string())?;

                Ok(data)
            }
            Err(err) => Err(err.to_string()),
        };

        tanxium
            .run_up_to_duration(Duration::from_secs(120))
            .await
            .map_err(|e| e.to_string())?;

        output
    };

    tauri::async_runtime::block_on(fut)
}
