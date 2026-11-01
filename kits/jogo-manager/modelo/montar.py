#!/usr/bin/env python3
"""Junta as partes de src/ em {{ARQ}}, o arquivo único que é publicado.

O código é editado em src/ (cada parte é um trecho exato do arquivo final, sem
nada acrescentado); {{ARQ}} é gerado e fica no git, porque a publicação e os
testes usam ele.

Uso: python3 montar.py            gera {{ARQ}}
     python3 montar.py --check    só confere que {{ARQ}} está em dia
     python3 montar.py --forcar   gera mesmo se {{ARQ}} parecer editado à mão
"""
import os, sys

RAIZ = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(RAIZ, 'src')
NOME = '{{ARQ}}'
SAIDA = os.path.join(RAIZ, NOME)

partes = sorted(f for f in os.listdir(SRC) if f.endswith(('.html', '.css', '.js')))
html = ''.join(open(os.path.join(SRC, f), encoding='utf8').read() for f in partes)
assert html.startswith('<title>'), 'o arquivo publicado deve começar com <title> (src/00-topo.html)'

atual = open(SAIDA, encoding='utf8').read() if os.path.exists(SAIDA) else None
if '--check' in sys.argv:
    if atual != html:
        sys.exit('%s não bate com src/: rode python3 montar.py (e edite só em src/)' % NOME)
    print('%s em dia com src/ (%d partes)' % (NOME, len(partes)))
    sys.exit(0)

# proteção: se o arquivo montado foi editado à mão depois das partes, não sobrescreve
if atual is not None and atual != html and '--forcar' not in sys.argv:
    novo = max(os.path.getmtime(os.path.join(SRC, f)) for f in partes)
    if os.path.getmtime(SAIDA) > novo:
        sys.exit('%s foi alterado depois de src/: leve a mudança para src/ (ou use --forcar)' % NOME)
if atual != html:
    open(SAIDA, 'w', encoding='utf8').write(html)
print('%s montado de %d partes (%d KB)' % (NOME, len(partes), len(html.encode('utf8')) // 1024))
