#!/usr/bin/env bash
# wikispeak statusline segment.
# Prints a badge showing whether wikispeak is active, by reading the same
# flag file the hooks write. On when the flag is absent; off when it holds "off".
# Wire into settings.json "statusLine", or call from your own statusline script.

flag="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/.wikispeak-off"

if [ -f "$flag" ] && [ "$(tr -d '[:space:]' < "$flag")" = "off" ]; then
  printf '[wikispeak:off]'
else
  printf '[wikispeak]'
fi
