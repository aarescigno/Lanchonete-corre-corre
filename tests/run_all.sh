#!/usr/bin/env bash
# Junta src/ em lanchonete.html, roda todos os testes e mostra só o resumo de cada um (economiza saída/tokens).
# Uso: ./run_all.sh            (testes rápidos)
#      ./run_all.sh --tudo     (também balance com 40 rodadas e menu_fit no Chromium)
cd "$(dirname "$0")"
python3 ../montar.py >/dev/null || { echo "MONTAR: falhou ao juntar src/ em lanchonete.html"; exit 1; }
./extract.sh >/dev/null || { echo "SINTAXE: erro em game.js"; exit 1; }
./gera_botpage.sh || { echo "SINTAXE: erro em botpage.js"; exit 1; }
st=0
for f in smoke.js smoke2.js smoke3.js smoke4.js smoke5.js smoke6.js smoke7.js smoke8.js smoke9.js smoke10.js smoke11.js smoke12.js smoke13.js smoke14.js smoke15.js smoke16.js smoke17.js smoke18.js; do
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
