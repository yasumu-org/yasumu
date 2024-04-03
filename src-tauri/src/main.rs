// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, Window};

#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
    description: String,
}

#[derive(Clone, serde::Serialize)]
struct ExecutionResult {
    response: String,
    status: usize,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn execute(window: Window, url: &str, method: &str) {
    window
        .emit(
            "execution-result",
            ExecutionResult {
                response: format!("You sent a request to {} using {} method", url, method),
                status: 200,
            },
        )
        .unwrap();
}

#[tauri::command]
fn ready(window: Window) {
    window
        .emit_all(
            "show-toast",
            Payload {
                message: "Welcome to Yasumu 🚀!".into(),
                description: "Reimagining the way you test your api.".into(),
            },
        )
        .unwrap();
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            // window.open_devtools();
            window.set_title("Yasumu")?;
            window.maximize()?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![ready, execute])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
