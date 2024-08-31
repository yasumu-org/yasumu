use swc_common::{errors::HANDLER, FilePathMapping, SourceMap};
use swc_fast_ts_strip::{operate, Mode, Options};

pub fn transpile_typescript(code: &str) -> Result<String, String> {
    HANDLER.with(|handler| {
        let cm = swc_common::sync::Lrc::new(SourceMap::new(FilePathMapping::empty()));
        let options = Options {
            filename: None,
            mode: Mode::Transform,
            source_map: false,
            module: Some(true),
            parser: Default::default(),
            transform: Default::default(),
        };
        let src = operate(&cm, &handler, code.to_string(), options);

        if src.is_err() {
            return Err(format!("{}", src.err().unwrap()));
        } else {
            return Ok(src.unwrap().code);
        }
    })
}
