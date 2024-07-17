use tauri::Manager;

mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_websocket::init())
        .plugin(tauri_plugin_http::init())
        .setup(|app| {
            let main_window = app.get_webview_window("main").unwrap();

            main_window.hide_menu().unwrap();

            main_window.maximize().unwrap();

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::network::get_local_address,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
