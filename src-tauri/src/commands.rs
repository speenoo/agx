use crate::AppState;
use std::string::String;
use std::sync::Mutex;
use tauri::Manager;
use tauri_plugin_shell::process::CommandEvent;
use tauri_plugin_shell::ShellExt;

#[tauri::command]
pub async fn query(app: tauri::AppHandle, _query: String, reader: tauri::ipc::Channel<Vec<u8>>) {
    let state = app.state::<Mutex<AppState>>();
    let state = state.lock().unwrap();

    let clickhouse_cmd = app.shell().sidecar("clickhouse").unwrap().args([
        "--path",
        &state.path,
        "-C",
        &format!("{}/config.xml", state.path),
        "-q",
        &_query,
        "--output-format",
        "JSON",
    ]);

    let (mut rx, _child) = clickhouse_cmd.spawn().expect("Failed to spawn clickhouse");

    tauri::async_runtime::spawn(async move {
        loop {
            match rx.recv().await {
                Some(event) => match event {
                    CommandEvent::Stdout(line_bytes) => {
                        if let Err(e) = reader.send(line_bytes) {
                            println!("Failed to send stdout chunk: {:?}", e);
                        }
                    }
                    CommandEvent::Stderr(line_bytes) => {
                        if let Err(e) = reader.send(line_bytes) {
                            println!("Failed to send stderr chunk: {:?}", e);
                        }
                    }
                    CommandEvent::Error(error) => {
                        println!("Error: {}", error);
                        break;
                    }
                    CommandEvent::Terminated(_) => {
                        if let Err(e) = reader.send(Vec::new()) {
                            println!("Failed to send termination signal: {:?}", e);
                        }
                        break;
                    }
                    _ => {}
                },
                None => {
                    println!("Receiver closed unexpectedly");
                    break;
                }
            }
        }
    });
}
