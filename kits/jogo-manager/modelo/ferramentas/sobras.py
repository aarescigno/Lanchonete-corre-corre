#!/usr/bin/env python3
"""Sobras no docs/PLANO.md: confere e move, sem ler os arquivos no chat.

  python3 ferramentas/sobras.py                         confere; sai com 1 se houver sobra (o run_all.sh chama)
  python3 ferramentas/sobras.py --mover "texto" [...]   move itens soltos ("- ..." na coluna 0) para o fim do
                                                         docs/PLANO-FEITO.md, na seção "## Ideias já entregues"

Sobra é o que já foi entregue ou já virou etapa e continua no PLANO.md: "Feito na vX", "feita na vX", "Virou a etapa",
"Vai na etapa/sessão", "— FEITA", ou a tabela Situação com mais de 3 etapas feitas. Ao planejar uma etapa a partir de
uma ideia guardada, ou ao fechar uma etapa, mova os itens com --mover em vez de marcá-los.

O item vai da linha "- ..." (que contém o texto, uma só no arquivo) até antes da próxima linha que começa na coluna 0
e não é linha de tabela ("|"): pega as sublistas, os parágrafos recuados e as tabelas do item.
"""
import re, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
PLANO = RAIZ / 'docs' / 'PLANO.md'
FEITO = RAIZ / 'docs' / 'PLANO-FEITO.md'
SECAO = '## Ideias já entregues (itens tirados do PLANO.md)'
PADROES = [r'\bFeito na v\d', r'\bfeit[ao] na v\d', r'\bVirou (a etapa|o |a )', r'\bVai n[ao]s? (etapa|sessão|sessões|etapas)', r'— FEITA', r'\bFEITA em']
MAX_FEITAS = 3


def confere():
    linhas = PLANO.read_text(encoding='utf-8').split('\n')
    achou = []
    for i, l in enumerate(linhas, 1):
        for p in PADROES:
            if re.search(p, l):
                achou.append(f'  {i}: {l[:110]}')
                break
    # tabela Situação: só as 3 últimas feitas
    try:
        ini = linhas.index('## Situação')
    except ValueError:
        ini = -1
    if ini >= 0:
        feitas = 0
        for l in linhas[ini + 1:]:
            if l.startswith('## '):
                break
            if l.startswith('|') and re.search(r'\bfeita\b', l):
                feitas += 1
        if feitas > MAX_FEITAS:
            achou.append(f'  tabela Situação: {feitas} etapas feitas (deixe só as {MAX_FEITAS} últimas; as outras vão para a "Situação das etapas feitas" do PLANO-FEITO.md)')
    if achou:
        print('SOBRAS no docs/PLANO.md (mova com: python3 ferramentas/sobras.py --mover "começo do item"):')
        print('\n'.join(achou))
        return 1
    print('SOBRAS: nenhuma no docs/PLANO.md')
    return 0


def item(linhas, texto):
    idx = [i for i, l in enumerate(linhas) if l.startswith('- ') and texto in l]
    assert len(idx) == 1, f'"{texto}" casa com {len(idx)} itens (precisa ser 1)'
    i = idx[0]
    j = i + 1
    while j < len(linhas) and (linhas[j] == '' or linhas[j][0] in ' \t|'):
        j += 1
    k = j
    while k > i + 1 and linhas[k - 1].strip() == '':   # as linhas em branco do fim ficam na origem
        k -= 1
    return i, k


def mover(textos):
    antes = PLANO.stat().st_size, FEITO.stat().st_size
    linhas = PLANO.read_text(encoding='utf-8').split('\n')
    blocos = []
    for t in textos:   # confere todos antes de mexer
        item(linhas, t)
    for t in textos:
        i, k = item(linhas, t)
        blocos.append('\n'.join(linhas[i:k]))
        del linhas[i:k]
    s = re.sub(r'\n{3,}', '\n\n', '\n'.join(linhas))
    f = FEITO.read_text(encoding='utf-8').rstrip('\n')
    if SECAO not in f:
        f += '\n\n' + SECAO + '\n'
    ini = f.index(SECAO)
    m = re.search(r'\n#{1,2} ', f[ini + len(SECAO):])   # o fim da seção (as do arquiva.py podem vir depois dela)
    fim = ini + len(SECAO) + m.start() if m else len(f)
    f = f[:fim].rstrip('\n') + '\n' + '\n'.join(blocos) + '\n' + ('\n' + f[fim:].lstrip('\n') if m else '')
    PLANO.write_text(s, encoding='utf-8')
    FEITO.write_text(f, encoding='utf-8')
    depois = PLANO.stat().st_size, FEITO.stat().st_size
    print(f'movidos {len(blocos)} itens. PLANO.md {antes[0]/1024:.1f} → {depois[0]/1024:.1f} KB; PLANO-FEITO.md {antes[1]/1024:.1f} → {depois[1]/1024:.1f} KB')


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == '--mover':
        assert len(a) > 1, 'diga o começo de cada item'
        mover(a[1:])
    else:
        sys.exit(confere())
