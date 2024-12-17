use std::sync::Mutex;
use tauri::State;

use crate::AppState;
use String;

#[tauri::command]
pub async fn query(query: String, state: State<'_, Mutex<AppState>>) -> Result<String, String> {
    let state = state.lock().unwrap();

    match state.session.execute(&query, None) {
        Ok(Some(query_result)) => query_result
            .data_utf8()
            .map_err(|_| "Bad encoding".to_string())
            .map(|data| data.to_string()),
        Ok(None) => Ok(String::from("No result")),
        Err(_e) => Err(_e.to_string()),
    }
}
