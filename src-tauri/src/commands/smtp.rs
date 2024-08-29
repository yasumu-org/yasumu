use mailin_embedded::{response, Handler, Response, Server};
use mailparse::{parse_mail, MailHeaderMap};
use serde::Serialize;
use std::collections::VecDeque;
use std::io::Error;
use std::sync::{Arc, RwLock};
use tauri::{Emitter, State};
use tokio::task::JoinHandle;
use uuid::Uuid;

#[derive(Clone, Serialize)]
pub struct YasumuMail {
    pub id: String,
    pub from: String,
    pub to: String,
    pub subject: String,
    pub body: String,
    pub date: String,
    pub read: bool,
}

#[derive(Clone)]
pub struct SmtpHandler {
    port: Option<u32>,
    messages: Arc<RwLock<VecDeque<YasumuMail>>>,
    app_handle: Option<tauri::AppHandle>,
    current_data: Arc<RwLock<String>>,
}

impl SmtpHandler {
    fn new(app_handle: Option<tauri::AppHandle>) -> Self {
        SmtpHandler {
            messages: Arc::new(RwLock::new(VecDeque::new())),
            app_handle,
            current_data: Arc::new(RwLock::new(String::new())),
            port: None,
        }
    }

    fn get_messages(&self) -> Vec<YasumuMail> {
        self.messages.read().unwrap().clone().into()
    }

    fn emit_new_email(&self, email: YasumuMail) {
        println!(
            "Emitting new email and app handle exists: {:?}",
            self.app_handle.is_some()
        );
        if let Some(app_handle) = &self.app_handle {
            app_handle
                .emit("new-email", email)
                .expect("Failed to emit event");
        }
    }

    fn emit_refresh_all(&self) {
        println!(
            "Emitting new email and app handle exists: {:?}",
            self.app_handle.is_some()
        );
        if let Some(app_handle) = &self.app_handle {
            app_handle
                .emit("refresh-all", ())
                .expect("Failed to emit event");
        }
    }
}

impl Handler for SmtpHandler {
    fn auth_login(&mut self, _username: &str, _password: &str) -> mailin_embedded::Response {
        response::AUTH_OK
    }

    fn auth_plain(
        &mut self,
        _authorization_id: &str,
        _authentication_id: &str,
        _password: &str,
    ) -> Response {
        response::AUTH_OK
    }

    fn data_start(
        &mut self,
        _domain: &str,
        _from: &str,
        _is8bit: bool,
        _to: &[String],
    ) -> Response {
        let mut current_data = self.current_data.write().unwrap();
        *current_data = String::new();
        response::OK
    }

    fn data(&mut self, buf: &[u8]) -> Result<(), Error> {
        let data_str = String::from_utf8_lossy(buf).to_string();
        let mut current_data = self.current_data.write().unwrap();
        current_data.push_str(&data_str);
        Ok(())
    }

    fn data_end(&mut self) -> Response {
        let accumulated_str = self.current_data.read().unwrap().clone();
        let parsed = parse_mail(accumulated_str.as_ref());

        let result = match parsed {
            Ok(mail) => {
                let email = YasumuMail {
                    body: mail.get_body().unwrap_or("".to_string()),
                    read: false,
                    from: mail
                        .get_headers()
                        .get_first_value("From")
                        .unwrap_or("".to_string()),
                    id: Uuid::new_v4().to_string(),
                    subject: mail
                        .get_headers()
                        .get_first_value("Subject")
                        .unwrap_or("".to_string()),
                    to: mail
                        .get_headers()
                        .get_first_value("To")
                        .unwrap_or("".to_string()),
                    date: mail
                        .get_headers()
                        .get_first_value("Date")
                        .unwrap_or("".to_string()),
                };
                self.emit_new_email(email.clone());
                self.messages.write().unwrap().push_front(email);
                response::OK
            }
            Err(_) => {
                return response::INTERNAL_ERROR;
            }
        };

        result
    }
}

pub struct ServerState {
    handle: RwLock<Option<JoinHandle<()>>>,
    handler: RwLock<SmtpHandler>,
}

impl ServerState {
    pub fn new() -> Self {
        ServerState {
            handle: RwLock::new(None),
            handler: RwLock::new(SmtpHandler::new(None)),
        }
    }

    pub fn get_handler(&self) -> SmtpHandler {
        self.handler.read().unwrap().clone()
    }
}

#[tauri::command]
pub async fn is_smtp_server_running(state: State<'_, ServerState>) -> Result<bool, String> {
    Ok(state.handle.read().unwrap().is_some())
}

#[tauri::command]
pub async fn start_smtp_server(
    app_handle: tauri::AppHandle,
    state: State<'_, ServerState>,
    port: u32,
) -> Result<(), String> {
    let mut handle_guard = state.handle.write().unwrap();

    if handle_guard.is_some() {
        return Err("Server is already running".into());
    }

    let mut handler = state.get_handler();
    let addr = format!("127.0.0.1:{}", port);

    handler.app_handle = Some(app_handle.clone());
    handler.port = Some(port);

    let handle = tokio::spawn(async move {
        let mut server = Server::new(handler);
        server.with_addr(addr).expect("Failed to set address");
        server.serve().expect("Failed to start server");
    });

    *handle_guard = Some(handle);
    Ok(())
}

#[tauri::command]
pub async fn stop_smtp_server(state: State<'_, ServerState>) -> Result<(), String> {
    let mut handle_guard = state.handle.write().unwrap();

    if let Some(handle) = handle_guard.take() {
        handle.abort();
        return Ok(());
    }

    Err("Server is not running".into())
}

#[tauri::command]
pub fn get_email(state: State<'_, ServerState>, id: String) -> Option<YasumuMail> {
    let handler = state.get_handler();
    let mut messages = handler.messages.write().unwrap();

    for email in messages.iter_mut() {
        if email.id == id {
            email.read = true;
            return Some(email.clone());
        }
    }

    None
}

#[tauri::command]
pub fn mark_as_unread(state: State<'_, ServerState>, id: String) -> () {
    let handler = state.get_handler();
    let mut messages = handler.messages.write().unwrap();

    for email in messages.iter_mut() {
        if email.id == id {
            email.read = false;

            return;
        }
    }
}

#[tauri::command]
pub fn mark_all_as_read(state: State<'_, ServerState>) -> () {
    let handler = state.get_handler();
    let mut messages = handler.messages.write().unwrap();

    for email in messages.iter_mut() {
        email.read = true;
    }

    state.get_handler().emit_refresh_all();
}

#[tauri::command]
pub fn mark_all_as_unread(state: State<'_, ServerState>) -> () {
    let handler = state.get_handler();
    let mut messages = handler.messages.write().unwrap();

    for email in messages.iter_mut() {
        email.read = false;
    }

    state.get_handler().emit_refresh_all();
}

#[tauri::command]
pub fn get_unread_emails_count(state: State<'_, ServerState>) -> usize {
    let handler = state.get_handler();
    let messages = handler.messages.read().unwrap();

    messages.iter().filter(|email| !email.read).count()
}

#[tauri::command]
pub fn get_read_emails_count(state: State<'_, ServerState>) -> usize {
    let handler = state.get_handler();
    let messages = handler.messages.read().unwrap();

    messages.iter().filter(|email| email.read).count()
}

#[tauri::command]
pub fn get_all_emails_count(state: State<'_, ServerState>) -> usize {
    let handler = state.get_handler();
    let messages = handler.messages.read().unwrap();

    messages.len()
}

#[tauri::command]
pub fn delete_email(state: State<'_, ServerState>, id: String) -> Result<(), String> {
    let handler = state.get_handler();
    let mut messages = handler.messages.write().unwrap();

    let index = messages.iter().position(|email| email.id == id);

    match index {
        Some(index) => {
            messages.remove(index);
            Ok(())
        }
        None => Err("Email not found".into()),
    }
}

#[tauri::command]
pub fn get_emails(state: State<'_, ServerState>, read: Option<bool>) -> Vec<YasumuMail> {
    match read {
        None => state.get_handler().get_messages(),
        Some(read) => {
            let filterer = |email: &YasumuMail| email.read == read;
            state
                .get_handler()
                .get_messages()
                .into_iter()
                .filter(filterer)
                .map(|email| YasumuMail {
                    body: "".to_string(),
                    ..email
                })
                .collect()
        }
    }
}

#[tauri::command]
pub fn clear_emails(state: State<'_, ServerState>) -> Result<(), String> {
    state.get_handler().messages.write().unwrap().clear();
    state.get_handler().emit_refresh_all();

    Ok(())
}

#[tauri::command]
pub fn get_smtp_port(state: State<'_, ServerState>) -> Option<u32> {
    state.get_handler().port
}
