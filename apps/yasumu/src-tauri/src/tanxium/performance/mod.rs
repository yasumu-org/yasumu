use boa_engine::{
    js_str, js_string, object::ObjectInitializer, property::Attribute, Context, JsValue,
    NativeFunction,
};

pub fn performance_init(context: &mut Context) {
    let time_origin = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs_f64();
    let performance = ObjectInitializer::new(context)
        .function(
            NativeFunction::from_fn_ptr(|_, _, _| {
                let result = std::time::SystemTime::now()
                    .duration_since(std::time::UNIX_EPOCH)
                    .unwrap()
                    .as_secs_f64();

                Ok(JsValue::Rational(result))
            }),
            js_string!("now"),
            0,
        )
        .property(
            js_str!("timeOrigin"),
            JsValue::Rational(time_origin),
            Attribute::all(),
        )
        .build();

    context
        .register_global_property(js_str!("performance"), performance, Attribute::all())
        .unwrap();
}
