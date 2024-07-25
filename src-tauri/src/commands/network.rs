use local_ip_address::local_ip;

#[tauri::command]
pub fn get_local_address() -> String {
    let ip = local_ip();

    if let Ok(ip) = ip {
        ip.to_string()
    } else {
        "N/A".to_owned()
    }
}
