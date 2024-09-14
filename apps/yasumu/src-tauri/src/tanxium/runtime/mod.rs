use std::rc::Rc;

use boa_engine::{
    js_string, Context, JsArgs, JsError, JsNativeError, JsString, JsValue, Module, NativeFunction,
};
use boa_parser::{source::UTF8Input, Source};

use super::typescript::transpile_typescript;

mod event_loop;
mod module_loader;

pub fn init_runtime_and_event_loop(
    cwd: String,
    src: Source<'static, UTF8Input<&[u8]>>,
    ts_enabled: bool,
) -> (Context, Module) {
    let queue = Rc::new(event_loop::EventLoop::new());
    let module_loader = Rc::new(module_loader::YasumuModuleLoader {});

    let mut context = Context::builder()
        .job_queue(queue)
        .can_block(false)
        .module_loader(module_loader.clone())
        .build()
        .unwrap();

    module_loader::set_cwd(&mut context, cwd.clone());

    let module = Module::parse(src, None, &mut context).unwrap();

    if ts_enabled {
        context
            .register_global_builtin_callable(
                js_string!("transpileTypeScript"),
                1,
                NativeFunction::from_fn_ptr(|_, args, context| {
                    let src = args.get_or_undefined(0).to_string(context).unwrap();
                    let code = src.to_std_string().unwrap();
                    let transpiled = transpile_typescript(code.as_str());

                    match transpiled {
                        Ok(js) => Ok(JsValue::from(JsString::from(js))),
                        Err(e) => Err(JsError::from_native(JsNativeError::error().with_message(e))),
                    }
                }),
            )
            .unwrap();
    }

    // enable strict mode
    context.strict(true);

    // make sure the scripts do not run forever
    let limits = context.runtime_limits_mut();
    limits.set_loop_iteration_limit(100_000);
    limits.set_recursion_limit(1000);
    limits.set_stack_size_limit(1000);

    (context, module)
}
