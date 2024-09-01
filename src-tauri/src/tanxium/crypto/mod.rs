use boa_engine::{
    js_str, js_string, object::ObjectInitializer, property::Attribute, Context, JsString, JsValue,
    NativeFunction,
};
use std::str::FromStr;

pub fn crypto_init(context: &mut Context) {
    let crypto = ObjectInitializer::new(context)
        .function(
            NativeFunction::from_fn_ptr(|_, _, _| {
                let result = uuid::Uuid::new_v4().to_string();

                Ok(JsValue::String(
                    JsString::from_str(result.as_str()).unwrap(),
                ))
            }),
            js_string!("randomUUID"),
            0,
        )
        .build();

    context
        .register_global_property(js_str!("crypto"), crypto, Attribute::all())
        .unwrap();
}
