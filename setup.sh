#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$SCRIPT_DIR"

log() {
    printf '[setup] %s\n' "$*"
}

warn() {
    printf '[setup][WARN] %s\n' "$*" >&2
}

die() {
    printf '[setup][ERROR] %s\n' "$*" >&2
    exit 1
}

on_error() {
    local exit_code=$?
    printf '[setup][ERROR] Command failed with exit code %s at line %s.\n' \
        "$exit_code" "${BASH_LINENO[0]}" >&2
    exit "$exit_code"
}

trap on_error ERR

log "Starting cloud workstation foundation setup."

# --------------------------------------------------
# Detect operating system
# --------------------------------------------------

if [[ -f /etc/os-release ]]; then
    # shellcheck disable=SC1091
    source /etc/os-release
else
    die "Cannot determine operating system."
fi

if [[ "${ID:-}" != "ubuntu" && "${ID_LIKE:-}" != *debian* ]]; then
    die "This foundation currently supports Ubuntu/Debian environments only."
fi

log "Detected OS: ${PRETTY_NAME:-unknown}"

# --------------------------------------------------
# Detect Kaggle
# --------------------------------------------------

if [[ -d /kaggle ]]; then
    KAGGLE_ENVIRONMENT="true"
    log "Kaggle environment detected."
else
    KAGGLE_ENVIRONMENT="false"
    warn "Kaggle environment not detected. Continuing in generic Linux mode."
fi

# --------------------------------------------------
# Detect privileges
# --------------------------------------------------

if [[ "${EUID}" -eq 0 ]]; then
    SUDO=""
    log "Running as root."
elif command -v sudo >/dev/null 2>&1; then
    SUDO="sudo"
    log "Running as a non-root user with sudo."
else
    die "This setup requires root privileges or sudo."
fi

# --------------------------------------------------
# Establish important paths
# --------------------------------------------------

if [[ "$KAGGLE_ENVIRONMENT" == "true" && -d /kaggle/working ]]; then
    WORKSPACE_ROOT="/kaggle/working"
else
    WORKSPACE_ROOT="$REPO_ROOT/.runtime"
fi

RUNTIME_DIR="$WORKSPACE_ROOT/claude-cloud-runtime"
STATE_DIR="$RUNTIME_DIR/state"
LOG_DIR="$RUNTIME_DIR/logs"
DOWNLOAD_DIR="$RUNTIME_DIR/downloads"
BUILD_DIR="$RUNTIME_DIR/builds"
TMP_DIR="$RUNTIME_DIR/tmp"

mkdir -p \
    "$RUNTIME_DIR" \
    "$STATE_DIR" \
    "$LOG_DIR" \
    "$DOWNLOAD_DIR" \
    "$BUILD_DIR" \
    "$TMP_DIR"

log "Runtime directory: $RUNTIME_DIR"

# --------------------------------------------------
# Create a basic environment information file
# --------------------------------------------------

ENV_INFO="$STATE_DIR/environment.txt"

{
    printf 'timestamp=%s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
    printf 'os=%s\n' "${PRETTY_NAME:-unknown}"
    printf 'kernel=%s\n' "$(uname -srmo)"
    printf 'architecture=%s\n' "$(uname -m)"
    printf 'user=%s\n' "$(id -un)"
    printf 'uid=%s\n' "$(id -u)"
    printf 'kaggle=%s\n' "$KAGGLE_ENVIRONMENT"
    printf 'repo_root=%s\n' "$REPO_ROOT"
    printf 'workspace_root=%s\n' "$WORKSPACE_ROOT"
} > "$ENV_INFO"

log "Environment information written to $ENV_INFO."

# --------------------------------------------------
# Foundation checks
# --------------------------------------------------

required_commands=(
    bash
    git
)

for command_name in "${required_commands[@]}"; do
    if command -v "$command_name" >/dev/null 2>&1; then
        log "Found: $command_name"
    else
        die "Required command not found: $command_name"
    fi
done

# --------------------------------------------------
# Future installation stages
# --------------------------------------------------

log "Foundation stage complete."
log "No desktop, remote-access, browser, Claude Code or MCP software has been installed."
log "Future stages will be added incrementally and tested independently."

exit 0
