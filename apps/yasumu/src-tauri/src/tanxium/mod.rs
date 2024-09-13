use boa_engine::builtins::promise::PromiseState;
use boa_engine::object::ObjectInitializer;
use boa_engine::property::Attribute;
use boa_engine::{js_str, js_string, Context, JsValue, Source};

use tauri;
use tauri::path::BaseDirectory;
use tauri::Manager;

mod builtins;
mod runtime;
mod typescript;

use crate::commands::workspace::WorkspaceState;
use typescript::{transpile_typescript, YASUMU_WORKSPACE_SCRIPT_NAME, YASUMU_WORKSPACE_SCRIPT_URL};

fn setup_runtime(ctx: &mut Context, app: tauri::AppHandle) {
    let path = app.path();
    let runtime_files = vec![
        "runtime/00_timers.ts",
        "runtime/01_headers.js",
        "runtime/02_runtime.ts",
        "runtime/03_console.ts",
        "runtime/04_test.ts",
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
    prepare: &str,
    id: &str,
    typescript: Option<bool>,
    test: Option<bool>,
    workspace_state: tauri::State<'_, WorkspaceState>,
) -> Result<String, String> {
    let code = code.to_string();
    let prepare = prepare.to_string();
    let id = id.to_string();
    let current_workspace = workspace_state.get_current_workspace();

    let handle = tokio::spawn(async move {
        let ts_supported = typescript.is_some() && typescript.unwrap().eq(&true);
        let prepare_script = if ts_supported {
            let res = transpile_typescript(&prepare);

            res.unwrap()
        } else {
            prepare
        };

        let final_code = if ts_supported {
            let res = transpile_typescript(&code);

            res.unwrap()
        } else {
            code
        };
        let src = Source::from_bytes(final_code.as_bytes());
        let cwd = match current_workspace.clone() {
            Some(ws) => ws,
            None => std::env::current_dir()
                .unwrap()
                .as_mut_os_string()
                .clone()
                .into_string()
                .unwrap(),
        };

        let (mut ctx, module) =
            runtime::init_runtime_and_event_loop(cwd.clone(), src, ts_supported.clone());

        builtins::performance::performance_init(&mut ctx);
        builtins::crypto::crypto_init(&mut ctx);
        builtins::yasumu_runtime::runtime_init(
            &mut ctx,
            current_workspace.clone(),
            app.clone(),
            id.clone(),
            ts_supported,
            test.unwrap_or(false),
        );

        // init runtime apis
        setup_runtime(&mut ctx, app);

        ctx.eval(Source::from_bytes(prepare_script.as_bytes()))
            .unwrap();

        let import_meta_env = ObjectInitializer::new(&mut ctx)
            .property(js_str!("WORKSPACE_ID"), js_string!(id), Attribute::all())
            .property(
                js_str!("TEST"),
                JsValue::Boolean(test.unwrap_or(false)),
                Attribute::all(),
            )
            .build();

        let import_meta = ObjectInitializer::new(&mut ctx)
            .property(
                js_str!("url"),
                js_string!(YASUMU_WORKSPACE_SCRIPT_URL),
                Attribute::all(),
            )
            .property(
                js_str!("filename"),
                js_string!(YASUMU_WORKSPACE_SCRIPT_NAME),
                Attribute::all(),
            )
            .property(js_str!("dirname"), js_string!(cwd), Attribute::all())
            .property(js_str!("env"), import_meta_env, Attribute::all())
            .build();

        ctx.module_loader()
            .init_import_meta(&import_meta, &module, &mut ctx);

        let promise = module.load_link_evaluate(&mut ctx);

        ctx.run_jobs();

        let output = match promise.state() {
            PromiseState::Pending => Err("Module failed to execute".to_string()),
            PromiseState::Fulfilled(_) => {
                let global_obj = ctx.global_object();
                let yasumu = global_obj.get(js_string!("Yasumu"), &mut ctx).unwrap();
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
            PromiseState::Rejected(err) => Err(format!("{}", err.display())),
        };

        println!("Output: {:?}", output);

        output
    });

    match handle.await {
        Ok(res) => res,
        Err(e) => Err(format!("FatalError: {}", e)),
    }
}
