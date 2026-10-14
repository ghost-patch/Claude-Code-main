#!/usr/bin/env bash
set -e

export DISPLAY=:1
export XDG_RUNTIME_DIR="/tmp/runtime-$USER"
mkdir -p "$XDG_RUNTIME_DIR"
chmod 700 "$XDG_RUNTIME_DIR"

# Stop old desktop/browser processes
pkill -f 'google-chrome' 2>/dev/null || true
pkill -f 'xfce4-session' 2>/dev/null || true
pkill -f 'x11vnc' 2>/dev/null || true
pkill -f 'websockify' 2>/dev/null || true
pkill -f 'Xvfb :1' 2>/dev/null || true
sleep 2

# Virtual display optimized for phone viewing
Xvfb :1 -screen 0 1280x720x24 -ac +extension GLX +render -noreset \
  >/tmp/xvfb.log 2>&1 &
sleep 2

# XFCE desktop
dbus-launch --exit-with-session startxfce4 \
  >/tmp/xfce.log 2>&1 &
sleep 4

# Google Chrome
google-chrome \
  --no-sandbox \
  --disable-dev-shm-usage \
  --start-maximized \
  --user-data-dir="$HOME/.config/google-chrome-codespace" \
  --force-device-scale-factor=1 \
  --disable-features=UseOzonePlatform \
  >/tmp/google-chrome.log 2>&1 &

sleep 5

# High-quality VNC server
x11vnc \
  -display :1 \
  -rfbport 5901 \
  -forever \
  -shared \
  -noxdamage \
  -repeat \
  -wait 5 \
  -defer 5 \
  -speeds lan \
  -rfbversion 3.8 \
  >/tmp/x11vnc.log 2>&1 &

sleep 2

# noVNC / WebSocket proxy
websockify \
  --web=/usr/share/novnc/ \
  0.0.0.0:6080 \
  localhost:5901 \
  >/tmp/websockify.log 2>&1 &

echo
echo "=========================================="
echo " Cloud Browser Desktop Started"
echo "=========================================="
echo "Resolution : 1280x720"
echo "Chrome     : Google Chrome"
echo "VNC        : 5901"
echo "noVNC      : 6080"
echo "Profile    : $HOME/.config/google-chrome-codespace"
echo
echo "Open the forwarded 6080 URL and use:"
echo "  /vnc.html?autoconnect=true&resize=scale"
echo "=========================================="
