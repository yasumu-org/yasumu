use boa_engine::js_string;
use tanxium::tanxium;
use tauri::{path::BaseDirectory, Manager};

use super::workspace::WorkspaceState;

const GLOBAL_OBJECT_NAME: &str = "Yasumu";

mod yasumu_api;

#[tauri::command]
pub async fn evaluate_javascript(
    app: tauri::AppHandle,
    code: &str,
    prepare: &str,
    id: &str,
    typescript: Option<bool>,
    test: Option<bool>,
    workspace_state: tauri::State<'_, WorkspaceState>,
    smtp_server_state: tauri::State<'_, super::smtp::ServerState>,
) -> Result<String, String> {
    let code = code.to_string();
    let prepare = prepare.to_string();
    let id = id.to_string();
    let current_workspace = workspace_state.get_current_workspace();
    let smtp_handler = smtp_server_state.get_handler();
    let smtp_messages = match smtp_handler.messages.read() {
        Ok(messages) => Some(messages.clone()),
        Err(_) => None,
    };

    let handle = smol::spawn(async move {
        let ts_supported = typescript.unwrap_or(false);
        let builtins = tanxium::TanxiumBuiltinsExposure {
            crypto: true,
            performance: true,
            runtime: true,
            base64: true,
            timers: true,
            console: false,
        };

        // TODO: allow None
        let current_workspace_dir = current_workspace
            .clone()
            .unwrap_or("/dev/null/anonymous-workspace".to_string());

        let options = tanxium::TanxiumOptions {
            cwd: current_workspace_dir.clone(),
            typescript: ts_supported,
            builtins,
            global_object_name: GLOBAL_OBJECT_NAME.to_string(),
        };

        let path = app.path();
        let extensions = vec![
            tanxium::ScriptExtension {
                path: path
                    .resolve("runtime/01_headers.js", BaseDirectory::Resource)
                    .unwrap()
                    .to_str()
                    .unwrap()
                    .to_string(),
                transpile: false,
            },
            tanxium::ScriptExtension {
                path: path
                    .resolve("runtime/02_runtime.ts", BaseDirectory::Resource)
                    .unwrap()
                    .to_str()
                    .unwrap()
                    .to_string(),
                transpile: true,
            },
            tanxium::ScriptExtension {
                path: path
                    .resolve("runtime/03_console.ts", BaseDirectory::Resource)
                    .unwrap()
                    .to_str()
                    .unwrap()
                    .to_string(),
                transpile: true,
            },
            tanxium::ScriptExtension {
                path: path
                    .resolve("runtime/04_test.ts", BaseDirectory::Resource)
                    .unwrap()
                    .to_str()
                    .unwrap()
                    .to_string(),
                transpile: true,
            },
            tanxium::ScriptExtension {
                path: path
                    .resolve("runtime/05_schema.js", BaseDirectory::Resource)
                    .unwrap()
                    .to_str()
                    .unwrap()
                    .to_string(),
                transpile: false,
            },
            tanxium::ScriptExtension {
                path: path
                    .resolve("runtime/06_smtp.ts", BaseDirectory::Resource)
                    .unwrap()
                    .to_str()
                    .unwrap()
                    .to_string(),
                transpile: true,
            },
        ];

        let mut tanxium =
            tanxium::Tanxium::new(options).map_err(|e| format!("FatalError: {}", e))?;

        tanxium
            .initialize_runtime()
            .map_err(|e| format!("FatalError: {}", e))?;

        yasumu_api::init_yasumu_api(
            &mut tanxium,
            app,
            test.unwrap_or(false),
            current_workspace_dir,
            id,
            smtp_messages,
        );

        tanxium
            .load_extensions(extensions)
            .map_err(|e| format!("FatalError: {}", e))?;

        let ctx = &mut tanxium.context;
        let limits = ctx.runtime_limits_mut();

        limits.set_loop_iteration_limit(100_000_000);
        limits.set_recursion_limit(1200);
        limits.set_stack_size_limit(10_000);

        let prepare_script = if ts_supported {
            let res = tanxium.transpile(&prepare);

            res.unwrap()
        } else {
            prepare
        };

        tanxium
            .eval(&prepare_script)
            .map_err(|e| format!("FatalError: {}", e))?;

        let final_code = if ts_supported {
            let res = tanxium.transpile(&code);

            res.map_err(|e| format!("FatalError: {}", e))?
        } else {
            code
        };

        let result = tanxium.execute(&final_code);

        let output = match result {
            Ok(_) => {
                let mut ctx = tanxium.context;

                let global_obj = ctx.global_object();
                let yasumu = global_obj
                    .get(js_string!(GLOBAL_OBJECT_NAME), &mut ctx)
                    .unwrap();
                let yasumu_obj = yasumu
                    .as_object()
                    .ok_or("Failed to convert Yasumu to object")?;
                let context = yasumu_obj.get(js_string!("context"), &mut ctx).unwrap();
                let context_obj = context
                    .as_object()
                    .ok_or("Failed to convert context to object")?;
                let meta = context_obj.get(js_string!("__meta"), &mut ctx).unwrap();
                let meta_obj = meta.to_json(&mut ctx).unwrap();
                Ok(format!("{}", meta_obj.to_string()))
            }
            Err(e) => {
                let err = e.as_native();

                match err {
                    Some(err) => Err(format!("{}", err.to_string())),
                    None => Err("Module failed to execute".to_string()),
                }
            }
        };

        output
    });

    match handle.await {
        Ok(res) => Ok(res),
        Err(e) => Err(format!("FatalError: {}", e)),
    }
}
