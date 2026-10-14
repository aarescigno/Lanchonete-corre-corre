#!/usr/bin/env bash
# Roda todos os testes e mostra só o resumo de cada um (economiza saída/tokens).
# Uso: ./run_all.sh            (testes rápidos)
#      ./run_all.sh --tudo     (também balance com 40 rodadas e menu_fit no Chromium)
cd "$(dirname "$0")"
./extract.sh >/dev/null || { echo "SINTAXE: erro em game.js"; exit 1; }
st=0
for f in smoke.js smoke2.js smoke3.js smoke4.js smoke5.js smoke6.js smoke7.js; do
  out=$(node "$f" 2>&1); rc=$?
  echo "$f: $(echo "$out" | tail -1)"
  echo "$out" | grep -m5 '^FAIL' ; [ $rc -ne 0 ] && st=1
  echo "$out" | tail -1 | grep -q 'fails *= *0' || st=1
done
if [ "$1" = "--tudo" ]; then
  python3 menu_fit.py | tail -1
  node balance.js 40
fi
exit $st
