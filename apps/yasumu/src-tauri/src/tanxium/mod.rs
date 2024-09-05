use std::rc::Rc;

use boa_engine::context::ContextBuilder;
use boa_engine::{Context, Source};

use event_loop::Queue;
use smol::LocalExecutor;
use tauri;
use tauri::path::BaseDirectory;
use tauri::Manager;

mod crypto;
mod event_loop;
mod typescript;
mod yasumu_runtime;

use crate::commands::workspace::WorkspaceState;
use typescript::transpile_typescript;

fn setup_runtime(ctx: &mut Context, app: tauri::AppHandle) {
    let path = app.path();
    let runtime_files = vec![
        "runtime/00_headers.js",
        "runtime/01_runtime.ts",
        "runtime/02_console.ts",
        "runtime/03_test.ts",
        "runtime/04_timers.ts",
    ];

    for file in runtime_files {
        let loc = path.resolve(file, BaseDirectory::Resource).unwrap();
        let content = std::fs::read_to_string(&loc).unwrap();

        // transpile if needed
        let js_src = if file.ends_with(".ts") {
            transpile_typescript(content.as_str()).unwrap()
        } else {
            content
        };

        let src = Source::from_bytes(js_src.as_bytes());
        ctx.eval(src).unwrap();
    }
}

#[tauri::command]
pub async fn evaluate_javascript(
    app: tauri::AppHandle,
    code: &str,
    id: &str,
    typescript: Option<bool>,
    workspace_state: tauri::State<'_, WorkspaceState>,
) -> Result<String, String> {
    let code = code.to_string();
    let id = id.to_string();
    let current_workspace = workspace_state.get_current_workspace();

    let handle = tokio::spawn(async move {
        let ts_supported = typescript.is_some() && typescript.unwrap().eq(&true);
        let final_code = if ts_supported {
            let res = transpile_typescript(&code);

            res.unwrap()
        } else {
            code
        };
        let src = Source::from_bytes(final_code.as_bytes());
        let executor = LocalExecutor::new();
        let queue = Queue::new(executor);
        let mut ctx = &mut ContextBuilder::new()
            .job_queue(Rc::new(queue))
            .build()
            .unwrap();

        crypto::crypto_init(&mut ctx);
        yasumu_runtime::runtime_init(&mut ctx, current_workspace, app.clone(), id, ts_supported);

        // enable strict mode
        ctx.strict(true);

        // make sure the scripts do not run forever
        let limits = ctx.runtime_limits_mut();

        limits.set_loop_iteration_limit(100_000);
        limits.set_recursion_limit(1000);
        limits.set_stack_size_limit(1000);

        // init runtime
        setup_runtime(&mut ctx, app);

        let result = ctx.eval(src);

        // not working properly?
        ctx.run_jobs();

        if let Ok(result) = result {
            Ok(format!("{}", result.display()))
        } else {
            Err(format!("{}", result.unwrap_err()))
        }
    });

    handle.await.unwrap()
}
