#!/bin/bash
set -euo pipefail
PLUGIN_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
if [[ ! -f "$PLUGIN_ROOT/dist/src/server.js" ]]; then
  printf 'Build first: cd "%s" && npm ci && npm run build\n' "$PLUGIN_ROOT" >&2
  exit 1
fi
CLAUDE_EXECUTABLE="${CLAUDE_BIN:-claude}"
# Plugin-scoped MCP plus Skill; no generic shell/file/web tools in this support session.
# No API key is stored here. Use your normal Claude authentication or provider environment.
cd "$PLUGIN_ROOT"
exec "$CLAUDE_EXECUTABLE" --plugin-dir "$PLUGIN_ROOT" --tools Skill \
  --allowedTools 'Skill,mcp__plugin_support-99tech_support-local__*' --setting-sources '' "$@"
