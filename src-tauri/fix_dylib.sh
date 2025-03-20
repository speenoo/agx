#!/bin/bash

install_name_tool -change libchdb.so @executable_path/libchdb.so src-tauri/target/release/agx
codesign --force --timestamp --options runtime \
  --sign "Developer ID Application: Didier Franc (87KT93D5KK)" \
  src-tauri/target/release/libchdb.so
