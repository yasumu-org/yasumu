use tanxium::deno_runtime::deno_core::ModuleSpecifier;
// use tauri::Manager;

use crate::javascript::runtime::{RuntimeBootstrapOptions, TanxiumRuntimeManager};

use super::workspace::WorkspaceState;

async fn run_javascript(
    workspace_dir: String,
    code: String,
    prepare: String,
) -> Result<String, String> {
    let rt = TanxiumRuntimeManager::new();
    let options = RuntimeBootstrapOptions {
        current_workspace: Some(workspace_dir),
        specifier: ModuleSpecifier::parse("yasumu-internal://yasumu.ts").unwrap(),
        main_module: code,
        runtime_data: Some(prepare),
    };

    rt.bootstrap_runtime(options).await
}

#[tauri::command]
pub async fn evaluate_javascript(
    // app: tauri::AppHandle,
    code: &str,
    prepare: &str,
    // id: &str,
    // test: Option<bool>,
    workspace_state: tauri::State<'_, WorkspaceState>,
    // smtp_server_state: tauri::State<'_, super::smtp::ServerState>,
) -> Result<String, String> {
    let code = code.to_string();
    let prepare = prepare.to_string();
    let current_workspace = workspace_state.get_current_workspace();
    let workspace_dir = current_workspace.unwrap_or("<anonymous>".to_string());

    let result = std::thread::spawn(move || {
        let rt = tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .thread_name("tanxium-runtime-worker")
            .build()
            .map_err(|e| e.to_string())
            .unwrap();
        rt.block_on(run_javascript(workspace_dir, code, prepare))
    })
    .join()
    .map_err(|e| {
        if let Some(e) = e.downcast_ref::<String>() {
            e.clone()
        } else {
            "Failed to evaluate JavaScript".to_string()
        }
    })?;

    result
}
