#!/usr/bin/env python3
"""Lê os relatórios do Teste de habilidade e dos Desafios (blocos 'LCC-TESTE 1 · ...'; os dos Desafios têm "Desafio: <nome>" no lugar da fase) do docs/RELATORIOS.md e mostra, por fase (ou desafio) e por jogador,
a melhor tentativa (pelo lucro), a mediana do lucro e o número de tentativas.
Uso: python3 ferramentas/relatorios.py [arquivo]            (padrão: docs/RELATORIOS.md)
     python3 ferramentas/relatorios.py --bot [arquivo]      (roda junto, em tests/, `TESTE=<id>` ou, nos desafios, `DESAFIO=<id>` `node balance.js 20` com o bot comum e o afiado no que tem relatório)"""
import os, re, statistics, subprocess, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FASES = {'Garagem': 'garagem', 'Área industrial': 'industrial', 'Avenida Brasil': 'avenida', 'Terraço Suíça': 'terraco'}
# v12.3: os Desafios (a 1ª linha do bloco traz 'Desafio: <nome>'); o bot deles roda com DESAFIO=<id>
DESAFIOS = {'Desafio: Só a Bia': 'soBia', 'Desafio: Ninguém bravo': 'semBravo', 'Desafio: Hora do eFood': 'efood', 'Desafio: Festa junina': 'junina', 'Desafio: Jogo do Brasil': 'jogo', 'Desafio: Noite do crítico': 'critico', 'Desafio: VIPs exigentes': 'vips'}
FASES.update(DESAFIOS)
NUM = r'(-?\d+(?:,\d+)?)'
REAC = ('sentar', 'pedido', 'prato', 'conta', 'mesa suja')


def n(v):
    return float(v.replace(',', '.'))


def blocos(txt):
    """Cada bloco abre numa linha 'LCC-TESTE <formato> · ...' e vai até a linha em branco ou o próximo bloco."""
    out, atual = [], None
    for ln in txt.splitlines():
        if ln.startswith('LCC-TESTE '):
            if atual:
                out.append(atual)
            atual = [ln]
        elif atual is not None:
            if not ln.strip():
                out.append(atual)
                atual = None
            else:
                atual.append(ln)
    if atual:
        out.append(atual)
    return out


def leia(b):
    """Um bloco do formato 1 vira um dict; None se vier incompleto."""
    t = '\n'.join(b)
    m = re.match(r'LCC-TESTE 1 · (\S+) · (.+?) · dia (\d+) · semente (\d+)', b[0])
    j = re.search(r'Jogador: (.+?) · tentativa (\d+) · (\S+) (\S+) · (\S+ \S+)', t)
    r = re.search(r'Resultado: lucro (-?)R\$ (\d+) · meta R\$ (\d+) \((-?\d+)%\) · (0★|★+) · servidos (\d+) de (\d+) · Gúgou (\S+)', t)
    p = re.search(r'Perdidos: (\d+) ·', t)
    k = re.search(r'Ritmo: ' + NUM + r' ações/min · (\d+) toques perdidos · fila média ' + NUM, t)
    bp = re.search(r'Bia parada: (\d+)%', t)
    lr = next((ln for ln in b if ln.startswith('Reação em s')), '')
    if not (m and j and r and p and k and bp and lr):
        return None
    reac = {}
    for nome in REAC:
        x = re.search(nome + r' (?:—|' + NUM + ' / ' + NUM + r' / (\d+))', lr)
        reac[nome] = (n(x.group(1)), n(x.group(2)), int(x.group(3))) if x and x.group(1) else None
    return dict(versao=m.group(1), fase=m.group(2), dia=int(m.group(3)), semente=int(m.group(4)),
                jogador=j.group(1), tent=int(j.group(2)), aparelho=j.group(3) + ' ' + j.group(4), quando=j.group(5),
                lucro=(-1 if r.group(1) else 1) * int(r.group(2)), meta=int(r.group(3)), pct=int(r.group(4)),
                estrelas=0 if r.group(5) == '0★' else len(r.group(5)), servidos=int(r.group(6)), de=int(r.group(7)),
                gugou=None if r.group(8) == '—' else n(r.group(8)), perdidos=int(p.group(1)), reac=reac,
                acoes=n(k.group(1)), toques=int(k.group(2)), fila=n(k.group(3)), parada=int(bp.group(1)),
                dev='(encerrado no modo dev)' in t)


def fmt(v, c=1):
    return '—' if v is None else ('%.*f' % (c, v)).replace('.', ',')


def linha(x):
    rs = ' · '.join(nome + ' ' + (fmt(x['reac'][nome][0]) if x['reac'][nome] else '—') for nome in REAC)
    return ('tentativa %d · lucro R$ %d (%d%%) · %s · perdidos %d · reação média em s: %s · %s ações/min · %d toques perdidos · fila %s · Bia parada %d%%'
            % (x['tent'], x['lucro'], x['pct'], '★' * x['estrelas'] if x['estrelas'] else '0★', x['perdidos'], rs,
               fmt(x['acoes']), x['toques'], fmt(x['fila']), x['parada']))


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    arq = args[0] if args else os.path.join(RAIZ, 'docs', 'RELATORIOS.md')
    txt = open(arq, encoding='utf-8').read()
    lidos, ruins = [], 0
    for b in blocos(txt):
        if not re.match(r'LCC-TESTE 1 ', b[0]):
            ruins += 1
            print('(formato diferente do 1, ignorado):', b[0][:60])
            continue
        x = leia(b)
        if x:
            lidos.append(x)
        else:
            ruins += 1
            print('(bloco incompleto, ignorado):', b[0][:70])
    print('%d relatórios lidos%s' % (len(lidos), ' (%d ignorados)' % ruins if ruins else ''))
    for nome in FASES:
        da_fase = [x for x in lidos if x['fase'] == nome]
        if not da_fase:
            continue
        print('\n== %s (%d relatórios) ==' % (nome, len(da_fase)))
        for jog in sorted({x['jogador'] for x in da_fase}):
            rs = [x for x in da_fase if x['jogador'] == jog]
            melhor = max(rs, key=lambda x: x['lucro'])
            print('%s: %d tentativas · lucro: mediana R$ %d, melhor R$ %d' % (jog, len(rs), statistics.median(x['lucro'] for x in rs), melhor['lucro']))
            print('   melhor: ' + linha(melhor) + ' · ' + melhor['aparelho'] + (' (encerrado no modo dev)' if melhor['dev'] else ''))
    if '--bot' in sys.argv:
        for nome, id in FASES.items():
            if not any(x['fase'] == nome for x in lidos):
                continue
            for bot in ('comum', 'afiado'):
                env = dict(os.environ, **({'DESAFIO': id} if nome in DESAFIOS else {'TESTE': id}))
                if bot == 'afiado':
                    env['BOT'] = 'afiado'
                p = subprocess.run(['node', 'balance.js', '20'], cwd=os.path.join(RAIZ, 'tests'), env=env, capture_output=True, text=True)
                print('\n-- bot %s, %s --' % (bot, nome))
                print((p.stdout or p.stderr).strip())


if __name__ == '__main__':
    main()
