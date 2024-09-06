use boa_engine::{
    js_str, object::ObjectInitializer, property::Attribute, Context, JsString, JsValue,
};

pub fn runtime_init(
    context: &mut Context,
    current_workspace: Option<String>,
    app: tauri::AppHandle,
    id: String,
    ts_supported: bool,
    is_test: bool,
) {
    let package = app.package_info();
    let app_version = format!(
        "{}.{}.{}",
        package.version.major, package.version.minor, package.version.patch
    );

    let yasumu_version = ObjectInitializer::new(context)
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

    let yasumu_workspace = ObjectInitializer::new(context)
        .property(js_str!("id"), JsString::from(id), Attribute::all())
        .property(js_str!("current"), wrk, Attribute::all())
        .build();

    let app_script_features = ObjectInitializer::new(context)
        .property(
            js_str!("typescript"),
            JsValue::Boolean(ts_supported),
            Attribute::all(),
        )
        .build();

    let yasumu = ObjectInitializer::new(context)
        .property(
            js_str!("version"),
            JsString::from(app_version),
            Attribute::all(),
        )
        .property(
            js_str!("isTestEnvironment"),
            JsValue::Boolean(is_test),
            Attribute::all(),
        )
        .property(js_str!("features"), app_script_features, Attribute::all())
        .property(js_str!("versions"), yasumu_version, Attribute::all())
        .property(js_str!("workspace"), yasumu_workspace, Attribute::all())
        .build();

    context
        .register_global_property(js_str!("Yasumu"), yasumu, Attribute::all())
        .unwrap();
}
