use tauri::Manager;

mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_websocket::init())
        .plugin(tauri_plugin_http::init())
        .manage(commands::smtp::ServerState::new())
        .setup(|app| {
            let main_window = app.get_webview_window("main").unwrap();

            main_window.hide_menu().unwrap();
            main_window.maximize().unwrap();

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::network::get_local_address,
            commands::smtp::start_smtp_server,
            commands::smtp::stop_smtp_server,
            commands::smtp::get_emails
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
