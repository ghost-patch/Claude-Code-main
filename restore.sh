#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$SCRIPT_DIR"

log() {
    printf '[restore] %s\n' "$*"
}

die() {
    printf '[restore][ERROR] %s\n' "$*" >&2
    exit 1
}

log "Starting cloud workstation restoration."

if [[ ! -f "$REPO_ROOT/setup.sh" ]]; then
    die "setup.sh was not found in $REPO_ROOT"
fi

if [[ ! -x "$REPO_ROOT/setup.sh" ]]; then
    log "setup.sh is not executable. Fixing permissions."
    chmod +x "$REPO_ROOT/setup.sh"
fi

log "Running foundation setup."
exec "$REPO_ROOT/setup.sh"
