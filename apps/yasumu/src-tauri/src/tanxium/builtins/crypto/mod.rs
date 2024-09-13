use boa_engine::{
    js_str, js_string, object::ObjectInitializer, property::Attribute, Context, JsString, JsValue,
    NativeFunction,
};
use nid::Nanoid;
use std::str::FromStr;
use ulid::Ulid;

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
        .function(
            NativeFunction::from_fn_ptr(|_, _, _| {
                let result = Ulid::new().to_string();

                Ok(JsValue::String(
                    JsString::from_str(result.as_str()).unwrap(),
                ))
            }),
            js_string!("randomULID"),
            0,
        )
        .function(
            NativeFunction::from_fn_ptr(|_, _, _| {
                let result: Nanoid = Nanoid::new();

                Ok(JsValue::String(
                    JsString::from_str(result.as_str()).unwrap(),
                ))
            }),
            js_string!("randomNanoId"),
            0,
        )
        .build();

    context
        .register_global_property(js_str!("crypto"), crypto, Attribute::all())
        .unwrap();
}
