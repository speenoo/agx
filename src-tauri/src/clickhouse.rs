use std::fs;
use std::path::PathBuf;

pub fn setup_clickhouse(path: &PathBuf) {
    print!("{:#?}", path);

    if fs::metadata(&path).is_ok() {
        print!("{:?}", path);
    } else {
        fs::create_dir_all(&path).expect("Failed to create directory");
    }
}
