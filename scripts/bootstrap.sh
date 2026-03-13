#!/usr/bin/env bash
# bootstrap.sh — set up html2md from scratch on a bare machine
# Usage: ./scripts/bootstrap.sh
# Safe to re-run at any time (idempotent).

set -euo pipefail

RED='\033[0;31m'
GRN='\033[0;32m'
YLW='\033[1;33m'
BLU='\033[0;34m'
NC='\033[0m'

step()  { echo -e "${BLU}==>${NC} $1"; }
ok()    { echo -e "${GRN} ✓${NC} $1"; }
warn()  { echo -e "${YLW} ⚠${NC}  $1"; }
fatal() { echo -e "${RED} ✗${NC}  $1" >&2; exit 1; }

echo ""
echo "  html2md bootstrap"
echo "  ================="
echo ""

# ── 1. Deno ───────────────────────────────────────────────────────────────────
step "Checking Deno..."
if command -v deno &>/dev/null; then
  DENO_VER=$(deno --version | head -1)
  ok "Found $DENO_VER"
else
  warn "Deno not found. Installing via official installer..."
  curl -fsSL https://deno.land/install.sh | sh
  # Add to PATH for this session
  export DENO_INSTALL="$HOME/.deno"
  export PATH="$DENO_INSTALL/bin:$PATH"
  if command -v deno &>/dev/null; then
    ok "Deno installed: $(deno --version | head -1)"
    warn "Add ~/.deno/bin to your PATH permanently (see ~/.bashrc or ~/.zshrc)"
  else
    fatal "Deno install failed. Visit https://deno.land to install manually."
  fi
fi

# ── 2. Git ────────────────────────────────────────────────────────────────────
step "Checking Git..."
if command -v git &>/dev/null; then
  ok "Found $(git --version)"
else
  fatal "Git is required but not found. Install from https://git-scm.com"
fi

# ── 3. mise (tool version manager) ────────────────────────────────────────────
step "Checking mise..."
if command -v mise &>/dev/null; then
  ok "Found mise $(mise --version | head -1)"
  mise install
  ok "Deno version pinned via .mise.toml"
else
  warn "mise not found. Install from https://mise.jdx.dev (optional — for pinned Deno version)"
fi

# ── 4. Entire (optional — for AI session checkpoints) ─────────────────────────
step "Checking Entire..."
if command -v entire &>/dev/null; then
  ok "Found entire $(entire version 2>/dev/null | head -1 || echo '')"
else
  warn "Entire not found. Installing (session checkpoint tool for AI agents)..."
  if curl -fsSL https://entire.io/install.sh | bash 2>/dev/null; then
    ok "Entire installed"
  else
    warn "Entire install failed — skipping. Run 'curl -fsSL https://entire.io/install.sh | bash' manually."
  fi
fi

# ── 5. Git hooks via lefthook ─────────────────────────────────────────────────
step "Installing git hooks via lefthook..."
if command -v lefthook &>/dev/null; then
  lefthook install
  ok "Git hooks installed (pre-commit, commit-msg)"
else
  warn "lefthook not found. Install from https://github.com/evilmartians/lefthook"
  warn "Falling back to manual hook copying..."
  HOOKS_SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/hooks" && pwd)"
  GIT_HOOKS_DIR="$(git rev-parse --git-dir)/hooks"
  for hook in pre-commit commit-msg; do
    SRC="$HOOKS_SRC/$hook"
    DST="$GIT_HOOKS_DIR/$hook"
    if [ -f "$SRC" ]; then
      if [ -f "$DST" ] && ! grep -q "html2md" "$DST" 2>/dev/null; then
        warn "$hook hook already exists and wasn't written by us — skipping to avoid overwriting."
      else
        cp "$SRC" "$DST"
        chmod +x "$DST"
        ok "Installed $hook hook"
      fi
    fi
  done
fi

# ── 6. Install global html2md command ─────────────────────────────────────────
step "Installing global 'html2md' command..."
deno task install
ok "html2md installed globally"

# ── 7. Install/cache dependencies ─────────────────────────────────────────────
step "Installing Deno dependencies..."
deno install
ok "Dependencies installed"

# ── 8. Done ───────────────────────────────────────────────────────────────────
echo ""
echo -e "${GRN}  All done! Your environment is ready.${NC}"
echo ""
echo "  Quick start:"
echo "    deno task test        # run tests"
echo "    deno task ci          # full CI pipeline"
echo "    echo '<h1>Hi</h1>' | html2md"
echo ""
