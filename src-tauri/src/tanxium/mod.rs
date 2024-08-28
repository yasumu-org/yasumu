use boa_engine::{
    js_str, object::ObjectInitializer, property::Attribute, Context, JsString, Source,
};
use tauri;

#[tauri::command]
pub async fn evaluate_javascript(app: tauri::AppHandle, code: &str) -> Result<String, String> {
    let code = code.to_string();

    let handle = tokio::spawn(async move {
        let src = Source::from_bytes(code.as_bytes());
        let mut ctx = Context::default();
        let package = app.package_info();
        let app_version = format!(
            "{} {} {}",
            package.version.major, package.version.minor, package.version.patch
        );

        let tanxium_version = ObjectInitializer::new(&mut ctx)
            .property(
                js_str!("yasumu"),
                JsString::from(app_version),
                Attribute::all(),
            )
            .property(
                js_str!("tauri"),
                JsString::from(tauri::VERSION),
                Attribute::all(),
            )
            .build();

        let tanxium = ObjectInitializer::new(&mut ctx)
            .property(js_str!("versions"), tanxium_version, Attribute::all())
            .build();

        ctx.register_global_property(js_str!("Tanxium"), tanxium, Attribute::all())
            .expect("Failed to register Tanxium global object");

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
