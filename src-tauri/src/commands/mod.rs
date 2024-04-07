use std::collections::HashMap;

use tauri::{Manager, WebviewWindow};

use crate::requests::make_request;

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
pub async fn execute(
    window: WebviewWindow,
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
pub fn ready(window: WebviewWindow) {
    window
        .emit(
            "show-toast",
            Payload {
                message: "Welcome to Yasumu 🚀!".into(),
                description: "Reimagining the way you test your api.".into(),
            },
        )
        .unwrap();
}
