use std::env;
use std::fs::File;
use std::io::Write;
use std::path::Path;

pub fn gen_clickhouse_config<P: AsRef<Path>>(udfs_path: P) -> String {
    let udfs_path = udfs_path.as_ref().to_string_lossy();

    let xml_content = format!(
        r#"<clickhouse>
    <user_defined_executable_functions_config>{udfs_path}/user_defined/*.xml</user_defined_executable_functions_config>
    <user_scripts_path>{udfs_path}/bin</user_scripts_path>
    <user_defined_path>{udfs_path}/user_defined</user_defined_path>
</clickhouse>"#,
        udfs_path = udfs_path
    );

    let mut temp_dir = env::temp_dir();

    temp_dir.push("clickhouse_config.xml");

    let config_file_path = match temp_dir.to_str() {
        Some(path_str) => path_str.to_string(),
        None => {
            eprintln!("Failed to convert path to string");
            return String::new(); // Return an empty string on failure
        }
    };

    if let Ok(mut file) = File::create(&temp_dir) {
        if let Err(e) = file.write_all(xml_content.as_bytes()) {
            eprintln!("Error writing to ClickHouse config file: {}", e);
            return String::new();
        }
    } else {
        eprintln!("Error creating ClickHouse config file");
        return String::new();
    }

    config_file_path
}
