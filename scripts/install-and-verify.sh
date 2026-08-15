#!/usr/bin/env bash
#
# install-and-verify.sh — one-shot install + verification for the
# dsh-left-sidebar-collapse plugin, on a machine that can reach npm and GitHub
# (running ON that machine: a fuller DSH environment than the build box).
#
# Follows the dsh-plugin-development skill §7.1 (install) and §8.4
# (from-zero install verification).
#
# What it does:
#   1. clone the public repo
#   2. confirm the manifest surfaces (package.json / cordis.patch.yml)
#   3. pnpm install + build + test
#   4. dsh plugin add (official channel) + verify it landed in the profile
#   5. print the restart command and how to confirm it shows in the plugin list
#
# Env vars you may set:
#   DSH_PLUGIN_REPO   default git+https://github.com/condaThinker/dsh-left-sidebar-collapse.git
#   DSH_PROFILE       default web
#   DSH_WORK_DIR      default ./_dsh-left-sidebar-collapse-verify
#
set -euo pipefail

REPO="${DSH_PLUGIN_REPO:-git+https://github.com/condaThinker/dsh-left-sidebar-collapse.git}"
PROFILE="${DSH_PROFILE:-web}"
WORK="${DSH_WORK_DIR:-./_dsh-left-sidebar-collapse-verify}"

log() { printf '\n\033[1;34m==> %s\033[0m\n' "$*"; }

log "Installing dsh-left-sidebar-collapse into profile '%s'" "$PROFILE"

# 1) Clone (source of truth = what a user will get via git)
if [ ! -d "$WORK" ]; then
  log "Clone: $REPO"
  git clone "$REPO" "$WORK"
else
  log "Reuse existing clone at $WORK"
fi
cd "$WORK"

# 2) Manifest surfaces exist
log "Manifest surfaces"
for f in package.json cordis.patch.yml README.md; do
  [ -f "$f" ] || { echo "!! missing $f"; exit 1; }
done
python3 - <<'PY' || { echo "!! package.json manifest inconsistent"; exit 1; }
import json,sys
p=json.load(open("package.json"))
ok = p.get("name")=="dsh-left-sidebar-collapse" \
  and "dsh" in p and "bundle" in p["dsh"] and p["dsh"]["bundle"].get("patch")=="./cordis.patch.yml" \
  and "./client" in p.get("exports",{})
print("package:", p["name"], "| dsh.bundle.patch:", p["dsh"]["bundle"]["patch"], "| has ./client:", "./client" in p.get("exports",{}))
sys.exit(0 if ok else 1)
PY

# 3) Build + tests
log "pnpm install"
pnpm install
log "pnpm build (generates lib/)"
pnpm build
log "pnpm test"
pnpm test

# 4) Install into the profile via the official channel.
#    The plugin ships a `prepare` build script; pnpm >=10 blocks git build
#    scripts unless the profile allows them. Add dsh-left-sidebar-collapse to
#    the profile's pnpm-workspace.yaml allowBuilds first.
PW="$(dsh --profile "$PROFILE" --help >/dev/null 2>&1; echo "$HOME/.dsh/profiles/$PROFILE")"
AS="$HOME/.dsh/profiles/$PROFILE/pnpm-workspace.yaml"
if [ -f "$AS" ] && ! grep -q "dsh-left-sidebar-collapse" "$AS"; then
  log "Adding dsh-left-sidebar-collapse to allowBuilds ($AS)"
  # insert under an existing allowBuilds: block; if none, create one
  if grep -q "^allowBuilds:" "$AS"; then
    sed -i.bak "s/^allowBuilds:/allowBuilds:\n  dsh-left-sidebar-collapse: true/" "$AS"
  else
    printf '\nallowBuilds:\n  dsh-left-sidebar-collapse: true\n' >> "$AS"
  fi
fi

log "dsh plugin add (profile=%s)" "$PROFILE"
npx -p @deepseek-ai/dsh dsh plugin --profile "$PROFILE" add "$REPO"

# 5) Verify it landed in the profile bundle list
log "Verify profile bundle list"
dsh --profile "$PROFILE" --dump-config 2>/dev/null | grep -A1 "dsh-left-sidebar-collapse" || echo "(check: the row 'dsh-left-sidebar-collapse' should appear in --dump-config)"

log "Done. Restart the profile, then confirm the toggle under Settings -> General:"
echo "    dsh --profile $PROFILE"
echo "    (plugin list shows dsh-left-sidebar-collapse; Settings > General has 'Auto-collapse sidebar' + 'Fully collapse')"
