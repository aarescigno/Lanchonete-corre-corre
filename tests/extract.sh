#!/usr/bin/env bash
# Extrai o <script> principal de ../lanchonete.html para tests/game.js e checa a sintaxe.
set -e
cd "$(dirname "$0")"
python3 - <<'PY'
import re
html=open('../lanchonete.html',encoding='utf8').read()
blocks=re.findall(r'<script>(.*?)</script>',html,re.S)
open('game.js','w',encoding='utf8').write(max(blocks,key=len))
PY
node --check game.js && echo "sintaxe ok"
