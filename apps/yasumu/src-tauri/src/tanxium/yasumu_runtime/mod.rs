use boa_engine::{
    js_str, js_string, object::ObjectInitializer, property::Attribute, Context, JsString, JsValue,
    NativeFunction,
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
        .property(js_str!("test"), JsValue::Boolean(is_test), Attribute::all())
        .build();

    let yasumu = ObjectInitializer::new(context)
        .property(
            js_str!("version"),
            JsString::from(app_version),
            Attribute::all(),
        )
        .property(js_str!("features"), app_script_features, Attribute::all())
        .property(js_str!("versions"), yasumu_version, Attribute::all())
        .property(js_str!("workspace"), yasumu_workspace, Attribute::all())
        .function(
            NativeFunction::from_fn_ptr(|_, args, _| {
                let result = std::time::SystemTime::now()
                    .duration_since(std::time::UNIX_EPOCH)
                    .unwrap()
                    .as_secs_f64();

                Ok(JsValue::Rational(result))
            }),
            js_string!("nanoseconds"),
            0,
        )
        .build();

    context
        .register_global_property(js_str!("Yasumu"), yasumu, Attribute::all())
        .unwrap();
}
