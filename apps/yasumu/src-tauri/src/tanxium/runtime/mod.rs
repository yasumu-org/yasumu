use std::{
    cell::{Cell, RefCell},
    collections::VecDeque,
    rc::Rc,
};

use boa_engine::{
    job::{FutureJob, JobQueue, NativeJob},
    js_string, Context, JsArgs, JsError, JsNativeError, JsString, JsValue, Module, NativeFunction,
};
use boa_parser::{source::UTF8Input, Source};
use futures_util::stream::FuturesUnordered;
use smol::{future, stream::StreamExt, LocalExecutor};

use super::typescript::transpile_typescript;

mod module_loader;

struct Queue<'a> {
    executor: LocalExecutor<'a>,
    futures: RefCell<FuturesUnordered<FutureJob>>,
    jobs: RefCell<VecDeque<NativeJob>>,
}

impl<'a> Queue<'a> {
    fn new(executor: LocalExecutor<'a>) -> Self {
        Self {
            executor,
            futures: RefCell::default(),
            jobs: RefCell::default(),
        }
    }
}

impl JobQueue for Queue<'_> {
    fn enqueue_promise_job(&self, job: NativeJob, _context: &mut Context) {
        self.jobs.borrow_mut().push_back(job);
    }

    fn enqueue_future_job(&self, future: FutureJob, _context: &mut Context) {
        self.futures.borrow().push(future);
    }

    fn run_jobs(&self, context: &mut Context) {
        if self.jobs.borrow().is_empty() && self.futures.borrow().is_empty() {
            return;
        }

        let context = RefCell::new(context);

        future::block_on(self.executor.run(async move {
            let finished = Cell::new(0b00u8);

            let fut_queue = async {
                loop {
                    if self.futures.borrow().is_empty() {
                        finished.set(finished.get() | 0b01);
                        if finished.get() >= 0b11 {
                            return;
                        }

                        future::yield_now().await;
                        continue;
                    }
                    finished.set(finished.get() & 0b10);

                    let futures = &mut std::mem::take(&mut *self.futures.borrow_mut());
                    while let Some(job) = futures.next().await {
                        self.enqueue_promise_job(job, &mut context.borrow_mut());
                    }
                }
            };

            let job_queue = async {
                loop {
                    if self.jobs.borrow().is_empty() {
                        finished.set(finished.get() | 0b10);
                        if finished.get() >= 0b11 {
                            return;
                        }

                        future::yield_now().await;
                        continue;
                    };
                    finished.set(finished.get() & 0b01);

                    let jobs = std::mem::take(&mut *self.jobs.borrow_mut());
                    for job in jobs {
                        if let Err(e) = job.call(&mut context.borrow_mut()) {
                            eprintln!("Uncaught {e}");
                        }
                        future::yield_now().await;
                    }
                }
            };

            future::zip(fut_queue, job_queue).await;
        }));
    }
}

pub fn init_runtime_and_event_loop(
    cwd: String,
    src: Source<'static, UTF8Input<&[u8]>>,
    ts_enabled: bool,
) -> (Context, Module) {
    let queue = Rc::new(Queue::new(LocalExecutor::new()));
    let module_loader = Rc::new(module_loader::YasumuModuleLoader {});

    let mut context = Context::builder()
        .job_queue(queue)
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
        // Path::new("./yasumu_modules").join("main.ts")
    }

    // module_loader.insert(mod_path, module.clone());

    // enable strict mode
    context.strict(true);

    // make sure the scripts do not run forever
    let limits = context.runtime_limits_mut();
    limits.set_loop_iteration_limit(100_000);
    limits.set_recursion_limit(1000);
    limits.set_stack_size_limit(1000);

    (context, module)
}
