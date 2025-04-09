#!/bin/bash

# Constants
REPO="agnosticeng/clickhouse-evm"
API_URL="https://api.github.com/repos/$REPO/releases/latest"
OS_ARCH="$(uname | tr '[:upper:]' '[:lower:]')_$(uname -m | sed 's/x86_64/amd64/;s/aarch64/arm64/')"
USER_PATH="$HOME"
DEST="$USER_PATH/Library/Application Support/com.agx.app/ch"

# Fetch release info
RELEASE_JSON=$(curl -s "$API_URL")
RELEASE_TAG=$(echo "$RELEASE_JSON" | grep -m1 '"tag_name":' | cut -d '"' -f4)
MATCHING_URL=$(echo "$RELEASE_JSON" | grep -oE "https.*$OS_ARCH.*\.tar\.gz")

if [ -z "$RELEASE_TAG" ] || [ -z "$MATCHING_URL" ]; then
    echo "Failed to fetch release tag or download URL."
    exit 1
fi

# Setup directories
TMP_DIR="/tmp/clickhouse-evm-${RELEASE_TAG}"
mkdir -p "$TMP_DIR" "$DEST/user_defined" "$DEST/bin"

# Download and extract
ARCHIVE_PATH="$TMP_DIR/udf.tar.gz"
echo "Downloading: $MATCHING_URL..."
curl -L "$MATCHING_URL" -o "$ARCHIVE_PATH" || { echo "Failed to download archive."; exit 1; }
tar -xzf "$ARCHIVE_PATH" -C "$TMP_DIR" || { echo "Failed to extract archive."; exit 1; }

# Move files to proper destinations
SRC="$TMP_DIR"
cp "$SRC/etc/clickhouse-server/"*.xml "$DEST/user_defined/" || { echo "Failed to copy XML files."; exit 1; }
cp "$SRC/var/lib/clickhouse/user_defined/"*.sql "$DEST/user_defined/" || { echo "Failed to copy SQL files."; exit 1; }
cp "$SRC/var/lib/clickhouse/user_scripts/clickhouse-evm" "$DEST/bin/" || { echo "Failed to copy script."; exit 1; }

# Set permissions and clean up
chmod +x "$DEST/bin/clickhouse-evm"
rm -rf "$TMP_DIR"

echo "Module successfully extracted and set up in: $DEST"
