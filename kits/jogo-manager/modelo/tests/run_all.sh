#!/usr/bin/env bash
# Junta src/ em {{ARQ}}, extrai o JS para tests/jogo.js, confere a sintaxe e as sobras do PLANO.md
# e roda todos os smoke*.js mostrando só o resumo de cada um (economiza saída e tokens).
# Uso: ./run_all.sh            (testes rápidos)
#      ./run_all.sh --tudo     (também o lote.js com 50 sementes)
cd "$(dirname "$0")"
python3 ../montar.py >/dev/null || { echo "MONTAR: falhou ao juntar src/ em {{ARQ}}"; exit 1; }
python3 - <<'PY' || { echo "EXTRAIR: sem <script> em {{ARQ}}"; exit 1; }
import re
html = open('../{{ARQ}}', encoding='utf8').read()
blocos = re.findall(r'<script>(.*?)</script>', html, re.S)
open('jogo.js', 'w', encoding='utf8').write(max(blocos, key=len))
PY
node --check jogo.js || { echo "SINTAXE: erro em jogo.js"; exit 1; }
st=0
python3 ../ferramentas/sobras.py | head -12; [ ${PIPESTATUS[0]} -ne 0 ] && st=1
for f in $(ls smoke*.js | sort -V); do
  out=$(node "$f" 2>&1); rc=$?
  echo "$f: $(echo "$out" | tail -1)"
  echo "$out" | grep -m5 '^FAIL'; [ $rc -ne 0 ] && st=1
  echo "$out" | tail -1 | grep -q 'fails *= *0' || st=1
done
if [ "$1" = "--tudo" ]; then
  node lote.js 50 | tail -5
fi
exit $st
