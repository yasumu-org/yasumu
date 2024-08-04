use std::sync::RwLock;

use tauri::State;

pub struct WorkspaceState {
    current_workspace: RwLock<Option<String>>,
}

impl WorkspaceState {
    pub fn new() -> Self {
        WorkspaceState {
            current_workspace: RwLock::new(None),
        }
    }

    pub fn get_current_workspace(&self) -> Option<String> {
        self.current_workspace.read().unwrap().clone()
    }
}

#[tauri::command]
pub fn set_current_workspace(
    window: tauri::Window,
    state: State<'_, WorkspaceState>,
    path: String,
) -> Result<(), ()> {
    let mut state = state.current_workspace.write().unwrap();
    *state = Some(path.clone());
    window.set_title(&format!("{} - Yasumu", path)).unwrap();
    Ok(())
}

#[tauri::command]
pub fn get_current_workspace(state: State<'_, WorkspaceState>) -> Option<String> {
    state.get_current_workspace()
}
