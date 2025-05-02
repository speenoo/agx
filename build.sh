COMMIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
COMMIT_SHA=$COMMIT_SHA npm run tauri build
