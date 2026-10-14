#!/usr/bin/env bash

set -Eeuo pipefail

log() {
  printf '[kaggle-desktop] %s\n' "$*"
}

warn() {
  printf '[kaggle-desktop][WARN] %s\n' "$*" >&2
}

die() {
  printf '[kaggle-desktop][ERROR] %s\n' "$*" >&2
  exit 1
}

log "Starting KDE Plasma X11 installation..."

if [[ ! -d /kaggle ]]; then
  die "This script must be run inside a Kaggle environment."
fi

if [[ "${EUID}" -ne 0 ]]; then
  die "This script must run as root."
fi

export DEBIAN_FRONTEND=noninteractive

log "Updating package lists..."
apt-get update

log "Installing X11 and KDE Plasma..."

apt-get install -y \
  kde-plasma-desktop \
  plasma-workspace \
  plasma-desktop \
  plasma-nm \
  plasma-pa \
  konsole \
  dolphin \
  dbus-x11 \
  x11-xserver-utils \
  xauth \
  xinit \
  xserver-xorg \
  xserver-xorg-core \
  xserver-xorg-video-dummy \
  openbox \
  fonts-dejavu \
  fonts-liberation

log "Creating runtime directories..."

RUNTIME_DIR="/kaggle/working/claude-cloud-runtime"

mkdir -p \
  "$RUNTIME_DIR/state" \
  "$RUNTIME_DIR/logs" \
  "$RUNTIME_DIR/tmp" \
  "$RUNTIME_DIR/browser" \
  "$RUNTIME_DIR/desktop"

log "Writing desktop environment configuration..."

cat > "$RUNTIME_DIR/desktop/start-kde.sh" <<'EOF'
#!/usr/bin/env bash

set -Eeuo pipefail

export DISPLAY="${DISPLAY:-:1}"
export XDG_CURRENT_DESKTOP=KDE
export XDG_SESSION_DESKTOP=KDE
export KDE_FULL_SESSION=true
export QT_X11_NO_MITSHM=1

export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/tmp/runtime-$(id -u)}"

mkdir -p "$XDG_RUNTIME_DIR"
chmod 700 "$XDG_RUNTIME_DIR"

if command -v dbus-launch >/dev/null 2>&1; then
    exec dbus-launch --exit-with-session startplasma-x11
else
    exec startplasma-x11
fi
EOF

chmod +x "$RUNTIME_DIR/desktop/start-kde.sh"

log "Writing X11 session file..."

mkdir -p /root/.config

cat > /root/.xinitrc <<EOF
#!/usr/bin/env bash
exec "$RUNTIME_DIR/desktop/start-kde.sh"
EOF

chmod +x /root/.xinitrc

log "Writing desktop installation state..."

{
  echo "installed_at=$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
  echo "desktop=KDE Plasma"
  echo "session=Plasma X11"
  echo "display_target=:1"
} > "$RUNTIME_DIR/state/desktop-installation.txt"

log "Checking KDE installation..."

if command -v startplasma-x11 >/dev/null 2>&1; then
  log "KDE Plasma X11 command: OK"
else
  die "startplasma-x11 was not found after installation."
fi

if command -v dbus-launch >/dev/null 2>&1; then
  log "D-Bus launcher: OK"
else
  warn "dbus-launch was not found."
fi

echo
echo "=========================================="
echo "KDE Plasma X11 installation complete."
echo "=========================================="
echo
echo "Desktop: KDE Plasma"
echo "Session: X11"
echo "Runtime: $RUNTIME_DIR"
echo
echo "The desktop has NOT been started yet."
echo "Remote access has NOT been configured yet."
echo "Chromium has NOT been installed yet."
echo "Claude Code has NOT been installed yet."
echo

