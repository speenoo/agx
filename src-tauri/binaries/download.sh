ARCH=$(rustc -Vv | grep host | cut -f2 -d' ')
SCRIPT_DIR=$(dirname "$0")

URL="https://builds.clickhouse.com/master/macos-aarch64/clickhouse"
FILENAME="${SCRIPT_DIR}/clickhouse-${ARCH}"

curl -o "$FILENAME" "$URL"
chmod +x "$FILENAME"

"$FILENAME" -V
