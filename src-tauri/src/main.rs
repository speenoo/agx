#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde_json;

#[tauri::command]
fn query(query: &str) -> String {
    let result = agx::execute(query, None).unwrap_or(None);
    match result {
        Some(query_result) => serde_json::to_string(&query_result).unwrap_or_default(),
        None => "".to_string(),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![query])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
