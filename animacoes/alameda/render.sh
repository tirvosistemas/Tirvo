#!/bin/sh
# Renderiza as duas versões (horizontal e vertical) em out/.
# Ajuste BROWSER se o Chromium estiver em outro caminho.
BROWSER=${BROWSER:-/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell}
cd "$(dirname "$0")"
npx remotion render src/index.ts Alameda out/alameda-h.mp4 --browser-executable=$BROWSER --gl=swangle --concurrency=4 --crf=17
npx remotion render src/index.ts AlamedaVertical out/alameda-v.mp4 --browser-executable=$BROWSER --gl=swangle --concurrency=4 --crf=17
