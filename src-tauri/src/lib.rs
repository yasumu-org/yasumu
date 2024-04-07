mod commands;
mod requests;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            // window.open_devtools();
            window.set_title("Yasumu")?;
            window.maximize()?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![commands::ready, commands::execute])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
