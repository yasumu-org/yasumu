use std::collections::VecDeque;

use boa_engine::{
    js_str, js_string,
    object::{
        builtins::{JsArray, JsDate},
        ObjectInitializer,
    },
    property::{Attribute, PropertyDescriptorBuilder},
    JsString, JsValue, NativeFunction,
};
use tanxium::tanxium;

use crate::commands::smtp::YasumuMail;

use super::GLOBAL_OBJECT_NAME;

pub fn init_yasumu_api(
    tanxium: &mut tanxium::Tanxium,
    app: tauri::AppHandle,
    test: bool,
    workspace: String,
    workspace_id: String,
    emails: Option<VecDeque<YasumuMail>>,
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
                    .map(|frame| {
                        format!("  at {}", frame.code_block().name().to_std_string_escaped())
                    })
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

    let context = &mut tanxium.context;

    let emails_array = JsArray::new(context);

    // TODO: optimize this
    if let Some(emails) = emails {
        emails.iter().for_each(|email| {
            let date = JsValue::String(JsString::from(email.date.clone()));
            let date = match JsDate::new_from_parse(&date, context) {
                Ok(date) => JsValue::from(date),
                Err(_) => JsValue::Null,
            };

            let email = ObjectInitializer::new(context)
                .property(
                    js_str!("id"),
                    js_string!(email.id.clone()),
                    Attribute::all(),
                )
                .property(
                    js_str!("from"),
                    js_string!(email.from.clone()),
                    Attribute::all(),
                )
                .property(
                    js_str!("to"),
                    js_string!(email.to.clone()),
                    Attribute::all(),
                )
                .property(
                    js_str!("subject"),
                    js_string!(email.subject.clone()),
                    Attribute::all(),
                )
                .property(js_str!("date"), date, Attribute::all())
                .property(
                    js_str!("read"),
                    JsValue::Boolean(email.read),
                    Attribute::all(),
                )
                .build();

            match emails_array.push(email, context) {
                _ => (),
            };
        });
    }

    let yasumu_emails = PropertyDescriptorBuilder::new()
        .get(emails_array)
        .enumerable(false)
        .writable(false)
        .configurable(false)
        .build();

    yasumu_obj.insert_property(js_str!("emails"), yasumu_emails);
}
