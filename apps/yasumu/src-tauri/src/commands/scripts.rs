use tanxium::deno_runtime::deno_core::ModuleSpecifier;
// use tauri::Manager;

use crate::javascript::runtime::{RuntimeBootstrapOptions, TanxiumRuntimeManager};

use super::workspace::WorkspaceState;

#[tauri::command]
pub async fn evaluate_javascript(
    // app: tauri::AppHandle,
    code: &str,
    prepare: &str,
    // id: &str,
    // test: Option<bool>,
    workspace_state: tauri::State<'_, WorkspaceState>,
    tanxium_manager: tauri::State<'_, TanxiumRuntimeManager>,
    // smtp_server_state: tauri::State<'_, super::smtp::ServerState>,
) -> Result<String, String> {
    let code = code.to_string();
    let prepare = prepare.to_string();
    let current_workspace = workspace_state.get_current_workspace();
    let workspace_dir = current_workspace.unwrap_or("<anonymous>".to_string());

    let local = tokio::task::LocalSet::new();

    let result = local
        .run_until(async {
            tokio::task::spawn_local(async move {
                let rt = TanxiumRuntimeManager::new();
                let options = RuntimeBootstrapOptions {
                    current_workspace: Some(workspace_dir),
                    specifier: ModuleSpecifier::parse("yasumu-internal://yasumu.ts").unwrap(),
                    main_module: code,
                    runtime_data: Some(prepare),
                };

                rt.bootstrap_runtime(options).await
            })
            .await
            .map_err(|e| e.to_string())
        })
        .await?;

    result
}
