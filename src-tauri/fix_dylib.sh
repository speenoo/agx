#!/bin/bash

install_name_tool -change libchdb.so @executable_path/../Resources/libchdb.so src-tauri/target/release/agx
codesign --force --sign - src-tauri/target/release/agx
