#!/usr/bin/env bash
# UI Studio — tiny static server (needed so HTML export can inline the runtime).
set -e
cd "$(dirname "$0")"
PORT="${1:-5173}"
echo "UI Studio → http://localhost:${PORT}"
exec python3 -m http.server "$PORT"
