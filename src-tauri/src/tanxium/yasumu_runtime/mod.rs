use std::{
    future::Future,
    time::{Duration, Instant},
};

use boa_engine::{
    js_str, js_string, object::ObjectInitializer, property::Attribute, Context, JsArgs, JsResult,
    JsString, JsValue, NativeFunction,
};

fn sleep(
    _this: &JsValue,
    args: &[JsValue],
    context: &mut Context,
) -> impl Future<Output = JsResult<JsValue>> {
    let millis = args.get_or_undefined(0).to_u32(context);

    async move {
        let millis = millis?;
        let now = Instant::now();
        smol::Timer::after(Duration::from_millis(u64::from(millis))).await;
        let elapsed = now.elapsed().as_secs_f64();
        Ok(elapsed.into())
    }
}

pub fn runtime_init(
    context: &mut Context,
    current_workspace: Option<String>,
    app: tauri::AppHandle,
    id: String,
    ts_supported: bool,
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
        .property(js_str!("features"), app_script_features, Attribute::all())
        .property(js_str!("versions"), yasumu_version, Attribute::all())
        .property(js_str!("workspace"), yasumu_workspace, Attribute::all())
        .function(NativeFunction::from_async_fn(sleep), js_string!("sleep"), 1)
        .build();

    context
        .register_global_property(js_str!("Yasumu"), yasumu, Attribute::all())
        .unwrap();
}
