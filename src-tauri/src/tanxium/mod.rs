use boa_engine::{property::Attribute, Context, Source};
use console::LogResult;

mod console;

pub struct Tanxium {
    context: Context,
    window: Option<tauri::Window>,
}

impl Tanxium {
    pub fn new() -> Self {
        let context = Context::default();
        Self {
            context,
            window: None,
        }
    }

    pub fn set_window(&mut self, window: &tauri::Window) {
        self.window = Some(window);
    }

    fn on_log(&self, message: LogResult) {
        if let Some(window) = &self.window {
            window
                .emit("log", Some(message))
                .expect("failed to emit log event");
        }
    }

    pub fn initialize_runtime(&mut self) {
        let output = console::Console::init(context, self.on_log);

        self.context
            .register_global_property(console::Console::NAME, output, Attribute::all())
            .expect("failed to register console");
    }

    #[tauri::command]
    pub async fn eval(&self, script: String) -> Result<(), String> {
        let src = Source::from_bytes(script.as_bytes());
        let result = self.context.eval(src);

        match result {
            Ok(value) => Ok(()),
            Err(error) => Err(error.to_string()),
        }
    }
}
