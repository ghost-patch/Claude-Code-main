#!/bin/bash
DISPLAY=:1 brave-browser \
  --no-sandbox \
  --disable-dev-shm-usage \
  --disable-gpu \
  --disable-gpu-compositing \
  --disable-software-rasterizer \
  --user-data-dir="$HOME/.config/brave-codespace" \
  --start-maximized \
  "$@" &
