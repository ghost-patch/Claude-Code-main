#!/usr/bin/env bash

set -Eeuo pipefail

log() {
  printf '[kaggle-bootstrap] %s\n' "$*"
}

warn() {
  printf '[kaggle-bootstrap][WARN] %s\n' "$*" >&2
}

die() {
  printf '[kaggle-bootstrap][ERROR] %s\n' "$*" >&2
  exit 1
}

log "Starting Kaggle bootstrap verification..."

# --------------------------------------------------
# Verify Kaggle
# --------------------------------------------------

if [[ ! -d /kaggle ]]; then
  die "This script must be run inside a Kaggle environment."
fi

if [[ ! -d /kaggle/working ]]; then
  die "/kaggle/working was not found."
fi

log "Kaggle environment detected."

# --------------------------------------------------
# Establish directories
# --------------------------------------------------

KAGGLE_ROOT="/kaggle/working"
RUNTIME_DIR="$KAGGLE_ROOT/claude-cloud-runtime"

STATE_DIR="$RUNTIME_DIR/state"
LOG_DIR="$RUNTIME_DIR/logs"
DOWNLOAD_DIR="$RUNTIME_DIR/downloads"
BUILD_DIR="$RUNTIME_DIR/builds"
TMP_DIR="$RUNTIME_DIR/tmp"

mkdir -p \
  "$STATE_DIR" \
  "$LOG_DIR" \
  "$DOWNLOAD_DIR" \
  "$BUILD_DIR" \
  "$TMP_DIR"

log "Runtime directory: $RUNTIME_DIR"

# --------------------------------------------------
# Environment information
# --------------------------------------------------

ENV_INFO="$STATE_DIR/kaggle-environment.txt"

{
  echo "timestamp=$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
  echo "user=$(id -un)"
  echo "uid=$(id -u)"
  echo "kernel=$(uname -srmo)"
  echo "architecture=$(uname -m)"
  echo "hostname=$(hostname)"
  echo "working_directory=$(pwd)"
  echo "kaggle_root=$KAGGLE_ROOT"
  echo "runtime_dir=$RUNTIME_DIR"

  if [[ -f /etc/os-release ]]; then
    source /etc/os-release
    echo "os=${PRETTY_NAME:-unknown}"
  fi
} > "$ENV_INFO"

log "Environment information saved."

# --------------------------------------------------
# Required commands
# --------------------------------------------------

required_commands=(
  bash
  git
  python3
  pip
  curl
  wget
)

for command_name in "${required_commands[@]}"; do
  if command -v "$command_name" >/dev/null 2>&1; then
    log "OK: $command_name"
  else
    warn "Missing: $command_name"
  fi
done

# --------------------------------------------------
# Sudo
# --------------------------------------------------

if [[ "${EUID}" -eq 0 ]]; then
  log "Running as root."
elif command -v sudo >/dev/null 2>&1 && sudo -n true 2>/dev/null; then
  log "Passwordless sudo is available."
else
  warn "Passwordless sudo is not available."
fi

# --------------------------------------------------
# Network
# --------------------------------------------------

log "Testing network connectivity..."

if curl -fsSI --max-time 10 https://github.com >/dev/null; then
  log "GitHub connectivity: OK"
else
  warn "GitHub connectivity test failed."
fi

if curl -fsSI --max-time 10 https://pypi.org >/dev/null; then
  log "PyPI connectivity: OK"
else
  warn "PyPI connectivity test failed."
fi

# --------------------------------------------------
# Resources
# --------------------------------------------------

log "CPU:"
nproc

log "Memory:"
free -h

log "Disk:"
df -h "$KAGGLE_ROOT"

# --------------------------------------------------
# Final result
# --------------------------------------------------

echo
echo "=========================================="
echo "Kaggle bootstrap verification complete."
echo "=========================================="
echo
echo "Runtime: $RUNTIME_DIR"
echo "Environment file: $ENV_INFO"
echo
echo "No desktop or workstation software was installed."
