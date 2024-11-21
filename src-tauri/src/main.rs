#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod chdb;
mod clickhouse;
mod commands;

use std::{path::PathBuf, sync::Mutex};
use tauri::Manager;

#[derive(Default)]
struct AppState {
    clickhouse_dir: PathBuf,
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let working_dir = app.path_resolver().app_local_data_dir().unwrap();
            let clickhouse_dir = working_dir.join("ch");

            clickhouse::setup_clickhouse(&clickhouse_dir);

            app.manage(Mutex::new(AppState::default()));

            let state = app.state::<Mutex<AppState>>();
            let mut state = state.lock().unwrap();
            state.clickhouse_dir = clickhouse_dir.clone();

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![commands::query])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
