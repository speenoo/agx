use std::fs;
use std::path::PathBuf;

pub fn setup_clickhouse(path: &PathBuf) {
    print!("{:#?}", path);

    if fs::metadata(&path).is_ok() {
        print!("{:?}", path);
    } else {
        fs::create_dir_all(&path).expect("Failed to create directory");
    }

    let path_str = path.to_str().unwrap();

    let xml_content = format!(
        r#"<clickhouse>
        <user_defined_executable_functions_config>{path_str}/user_defined/*.xml</user_defined_executable_functions_config>
        <user_scripts_path>{path_str}/bin</user_scripts_path>
        <user_defined_path>{path_str}/user_defined</user_defined_path>
</clickhouse>"#
    );

    let config_path = path.join("config.xml");
    if !config_path.exists() {
        fs::write(config_path, xml_content).expect("Failed to write config file");
    }
}
