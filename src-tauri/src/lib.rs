use tauri::Manager;

mod commands;
mod tanxium;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut tanxium = tanxium::Tanxium::new();
    tanxium.initialize_runtime();

    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_websocket::init())
        .plugin(tauri_plugin_http::init())
        .manage(commands::smtp::ServerState::new())
        .setup(|app| {
            let main_window = app.get_webview_window("main").unwrap();

            main_window.hide_menu().unwrap();
            main_window.maximize().unwrap();

            tanxium.set_window(&window);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::network::get_local_address,
            commands::smtp::start_smtp_server,
            commands::smtp::stop_smtp_server,
            commands::smtp::get_emails,
            tanxium::eval
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
