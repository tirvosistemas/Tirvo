#!/bin/bash
# fila.sh: renderiza os IDs listados em fila.txt, no máximo 2 ao mesmo tempo.
cd "$(dirname "$0")"
L=/tmp/claude-0/-home-user-Tirvo/c4119cb9-f149-5c39-8eb4-88ffa71df1f6/scratchpad
while true; do
  n=$(pgrep -fc "node render.mjs P[0-9]+$")
  if [ "$n" -lt 2 ] && [ -s fila.txt ]; then
    id=$(head -n1 fila.txt); sed -i '1d' fila.txt
    nohup node render.mjs $id > $L/r-$id.log 2>&1 &
    sleep 5; continue
  fi
  sleep 15
done
