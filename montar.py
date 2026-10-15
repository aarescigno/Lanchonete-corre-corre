#!/usr/bin/env python3
"""Junta as partes de src/ em lanchonete.html, o arquivo único que é publicado.

O código é editado em src/ (cada parte é um trecho exato do arquivo final, sem
nada acrescentado); lanchonete.html é gerado e fica no git, porque o artifact,
o app (app/build.py) e os testes usam ele.

Uso: python3 montar.py            gera lanchonete.html
     python3 montar.py --check    só confere que lanchonete.html está em dia
     python3 montar.py --forcar   gera mesmo se lanchonete.html parecer editado à mão
"""
import os, sys

RAIZ = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(RAIZ, 'src')
SAIDA = os.path.join(RAIZ, 'lanchonete.html')

partes = sorted(f for f in os.listdir(SRC) if f.endswith(('.html', '.css', '.js')))
html = ''.join(open(os.path.join(SRC, f), encoding='utf8').read() for f in partes)
assert html.startswith('<title>'), 'o arquivo publicado deve começar com <title> (src/00-topo.html)'

atual = open(SAIDA, encoding='utf8').read() if os.path.exists(SAIDA) else None
if '--check' in sys.argv:
    if atual != html:
        sys.exit('lanchonete.html não bate com src/: rode python3 montar.py (e edite só em src/)')
    print('lanchonete.html em dia com src/ (%d partes)' % len(partes))
    sys.exit(0)

# proteção: se lanchonete.html foi editado à mão depois das partes, não sobrescreve
if atual is not None and atual != html and '--forcar' not in sys.argv:
    novo = max(os.path.getmtime(os.path.join(SRC, f)) for f in partes)
    if os.path.getmtime(SAIDA) > novo:
        sys.exit('lanchonete.html foi alterado depois de src/: leve a mudança para src/ (ou use --forcar)')
if atual != html:
    open(SAIDA, 'w', encoding='utf8').write(html)
print('lanchonete.html montado de %d partes (%d KB)' % (len(partes), len(html.encode('utf8')) // 1024))
