use boa_engine::{
    js_str, object::ObjectInitializer, property::Attribute, Context, JsString, JsValue,
    NativeFunction, Source,
};

use tauri;

mod typescript;

use typescript::transpile_typescript;

use crate::commands::workspace::WorkspaceState;

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
        let mut ctx = Context::default();
        let package = app.package_info();
        let app_version = format!(
            "{}.{}.{}",
            package.version.major, package.version.minor, package.version.patch
        );

        let yasumu_version = ObjectInitializer::new(&mut ctx)
            .property(
                js_str!("yasumu"),
                JsString::from(app_version.clone()),
                Attribute::all(),
            )
            // same as yasumu because both are the same project as of now
            .property(
                js_str!("tanxium"),
                JsString::from(app_version.clone()),
                Attribute::all(),
            )
            .property(
                js_str!("tauri"),
                JsString::from(tauri::VERSION),
                Attribute::all(),
            )
            .build();

        let wrk = match current_workspace {
            Some(wrk) => JsValue::String(JsString::from(wrk)),
            None => JsValue::null(),
        };

        let yasumu_workspace = ObjectInitializer::new(&mut ctx)
            .property(js_str!("id"), JsString::from(id), Attribute::all())
            .property(js_str!("current"), wrk, Attribute::all())
            .build();

        let app_script_features = ObjectInitializer::new(&mut ctx)
            .property(
                js_str!("typescript"),
                JsValue::Boolean(ts_supported),
                Attribute::all(),
            )
            .build();

        let yasumu = ObjectInitializer::new(&mut ctx)
            .property(
                js_str!("version"),
                JsString::from(app_version),
                Attribute::all(),
            )
            .property(js_str!("features"), app_script_features, Attribute::all())
            .property(js_str!("versions"), yasumu_version, Attribute::all())
            .property(js_str!("workspace"), yasumu_workspace, Attribute::all())
            .build();

        ctx.register_global_property(js_str!("Yasumu"), yasumu, Attribute::all())
            .unwrap();

        if ts_supported {
            ctx.register_global_builtin_callable(
                JsString::from("transpileTypeScript"),
                1,
                NativeFunction::from_copy_closure(|_this, args, context| {
                    let code = args.get(0).unwrap().to_string(context).unwrap();
                    let src = code.to_std_string().unwrap_or("".to_string());
                    let result = transpile_typescript(src.as_str());

                    Ok(JsValue::String(JsString::from(result.unwrap())))
                }),
            )
            .unwrap();
        }

        // enable strict mode
        ctx.strict(true);

        // make sure the scripts do not run forever
        let limits = ctx.runtime_limits_mut();

        limits.set_loop_iteration_limit(100_000);
        limits.set_recursion_limit(1000);
        limits.set_stack_size_limit(1000);

        let result = ctx.eval(src);

        if let Ok(result) = result {
            Ok(format!("{}", result.display()))
        } else {
            Err(format!("{}", result.unwrap_err()))
        }
    });

    handle.await.unwrap()
}
