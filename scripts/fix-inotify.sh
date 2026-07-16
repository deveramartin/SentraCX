#!/usr/bin/env bash
set -euo pipefail

# SentraCX — Fix inotify Limits (Linux Only)
# Usage: sudo ./scripts/fix-inotify.sh
#
# Run ONCE with sudo. Increases inotify limits permanently so that
# dotnet watch, VS Code, and other file watchers don't crash.
# Persists across reboots via /etc/sysctl.d/.

if [ "$(uname -s)" != "Linux" ]; then
  echo "ℹ This script is only needed on Linux. macOS/Windows use different file-watching APIs."
  exit 0
fi

CURRENT=$(cat /proc/sys/fs/inotify/max_user_instances)
TARGET=1024

if [ "$CURRENT" -ge "$TARGET" ]; then
  echo "✓ inotify max_user_instances is already $CURRENT (≥ $TARGET). Nothing to do."
  exit 0
fi

echo "▶ Current fs.inotify.max_user_instances: $CURRENT"
echo "▶ Setting to $TARGET (persists across reboots)..."

# Install sysctl config
CONF_FILE="/etc/sysctl.d/99-sentracx-inotify.conf"
cat > "$CONF_FILE" << 'EOF'
# SentraCX — Increase inotify limits for file watchers
# (dotnet watch, VS Code, Next.js dev server, etc.)
fs.inotify.max_user_instances = 1024
fs.inotify.max_user_watches = 524288
EOF

# Apply immediately
sysctl --system > /dev/null 2>&1

NEW_VALUE=$(cat /proc/sys/fs/inotify/max_user_instances)
echo ""
echo "✓ Done. fs.inotify.max_user_instances: $CURRENT → $NEW_VALUE"
echo "  Config persisted at: $CONF_FILE"
echo "  This survives reboots — no need to run again."
