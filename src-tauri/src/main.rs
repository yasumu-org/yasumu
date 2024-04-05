// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod requests;

use std::collections::HashMap;

use requests::make_request;
use tauri::{Manager, Window};

#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
    description: String,
}

#[derive(Clone, serde::Serialize)]
struct ExecutionFailedResult {
    body: String,
}

#[derive(Clone, serde::Serialize)]
struct ExecutionResult {
    status: usize,
    #[serde(rename = "statusText")]
    status_text: String,
    time: usize,
    body: String,
    headers: HashMap<String, String>,
}

#[tauri::command]
async fn execute(
    window: Window,
    url: &str,
    method: &str,
    headers: HashMap<&str, &str>,
) -> Result<(), ()> {
    let (status, response_time, headers, body, status_text) =
        make_request(url, method, headers).await.map_err(|e| {
            window
                .emit(
                    "execution-failed",
                    ExecutionFailedResult {
                        body: format!("Error: {}", e),
                    },
                )
                .unwrap();
        })?;

    window
        .emit(
            "execution-result",
            ExecutionResult {
                status: status as usize,
                status_text,
                time: response_time as usize,
                body,
                headers: headers
                    .iter()
                    .fold(HashMap::new(), |mut acc, (key, value)| {
                        acc.insert(key.to_string(), value.to_str().unwrap().to_string());
                        acc
                    }),
            },
        )
        .unwrap();

    Ok(())
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
