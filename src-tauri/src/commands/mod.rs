use crate::chdb::{arg::Arg, format, lib};

use std::borrow::Cow;
use std::sync::Mutex;
use tauri::State;

use crate::{chdb, AppState};
use String;

#[tauri::command]
pub async fn query(query: String, state: State<'_, Mutex<AppState>>) -> Result<String, String> {
    let state = state.lock().unwrap();
    let config_path = state.clickhouse_dir.join("config.xml".to_string());

    let args = vec![
        // Arg::LogLevel(chdb::log_level::LogLevel::Trace),
        Arg::OutputFormat(format::OutputFormat::JSON),
        Arg::Custom(
            "path".into(),
            Some(state.clickhouse_dir.display().to_string().into()),
        ),
        Arg::ConfigFilePath(Cow::Borrowed(config_path.to_str().unwrap())),
    ];

    return match lib::execute(&query, Some(&args)) {
        Ok(Some(query_result)) => query_result
            .data_utf8()
            .map_err(|_| "Bad encoding".to_string())
            .map(|data| data.to_string()),
        Ok(None) => Ok(String::from("No result")),
        Err(_e) => Err(_e.to_string()),
    };
}
