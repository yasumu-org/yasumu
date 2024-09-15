use boa_engine::{
    js_str, js_string,
    object::ObjectInitializer,
    property::{Attribute, PropertyDescriptorBuilder},
    JsString, JsValue, NativeFunction,
};
use tanxium::tanxium;
use tauri::{path::BaseDirectory, Manager};

use super::workspace::WorkspaceState;

const GLOBAL_OBJECT_NAME: &str = "Yasumu";

fn polyfill_yasumu_api(
    tanxium: &mut tanxium::Tanxium,
    app: tauri::AppHandle,
    test: bool,
    workspace: String,
    workspace_id: String,
) {
    let ctx = &mut tanxium.context;

    // Yasumu object
    let package = app.package_info();
    let app_version = format!(
        "{}.{}.{}",
        package.version.major, package.version.minor, package.version.patch
    );
    let global_obj = ctx.global_object();
    let yasumu = global_obj.get(js_string!(GLOBAL_OBJECT_NAME), ctx).unwrap();
    let yasumu_obj = yasumu
        .as_object()
        .ok_or("Failed to convert Yasumu to object")
        .unwrap();

    let versions = yasumu_obj.get(js_string!("versions"), ctx).unwrap();
    let versions_obj = versions
        .as_object()
        .ok_or("Failed to convert versions to object")
        .unwrap();

    let yasumu_version = PropertyDescriptorBuilder::new()
        .value(js_string!(app_version))
        .enumerable(true)
        .writable(false)
        .configurable(false)
        .build();

    versions_obj.insert_property(js_str!("yasumu"), yasumu_version);

    let features = yasumu_obj.get(js_string!("features"), ctx).unwrap();
    let features_obj = features
        .as_object()
        .ok_or("Failed to convert features to object")
        .unwrap();

    let test_feature = PropertyDescriptorBuilder::new()
        .value(JsValue::Boolean(test))
        .enumerable(true)
        .writable(false)
        .configurable(false)
        .build();

    features_obj.insert_property(js_str!("test"), test_feature);

    let yasumu_workspace = ObjectInitializer::new(ctx)
        .property(js_str!("id"), js_string!(workspace_id), Attribute::all())
        .property(js_str!("current"), js_string!(workspace), Attribute::all())
        .build();

    let workspace = PropertyDescriptorBuilder::new()
        .value(yasumu_workspace)
        .enumerable(true)
        .writable(false)
        .configurable(false);

    yasumu_obj.insert_property(js_str!("workspace"), workspace);

    let yasumu_utils = ObjectInitializer::new(ctx)
        .function(
            NativeFunction::from_fn_ptr(|_, _, context| {
                let stack = context
                    .stack_trace()
                    .map(|frame| format!("  at {}", frame.code_block().name().to_std_string_escaped()))
                    .collect::<Vec<_>>()
                    .join("\n");

                Ok(JsValue::String(JsString::from(stack)))
            }),
            js_string!("getStackTrace"),
            0,
        )
        .build();

    let yasumu_utils_obj = PropertyDescriptorBuilder::new()
        .value(yasumu_utils)
        .enumerable(true)
        .writable(false)
        .configurable(false)
        .build();

    yasumu_obj.insert_property(js_str!("utils"), yasumu_utils_obj);
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

    let handle = smol::spawn(async move {
        let ts_supported = typescript.unwrap_or(false);
        let builtins = tanxium::TanxiumBuiltinsExposure {
            crypto: true,
            performance: true,
            runtime: true,
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
        ];

        let mut tanxium = tanxium::Tanxium::new(options)
            .map_err(|e| format!("FatalError: {}", e))
            .unwrap();

        tanxium.initialize_runtime().unwrap();

        polyfill_yasumu_api(
            &mut tanxium,
            app,
            test.unwrap_or(false),
            current_workspace_dir,
            id,
        );

        tanxium.load_extensions(extensions).unwrap();

        let prepare_script = if ts_supported {
            let res = tanxium.transpile(&prepare);

            res.unwrap()
        } else {
            prepare
        };

        tanxium.eval(&prepare_script).unwrap();

        let final_code = if ts_supported {
            let res = tanxium.transpile(&code);

            res.unwrap()
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
