#!/usr/bin/env python3
"""Specs do desenvolvimento guiado por spec (docs/SDD.md): cria, lista e confere, sem ler os arquivos no chat.

  python3 ferramentas/spec.py                       confere; sai com 1 se houver problema (o run_all.sh chama)
  python3 ferramentas/spec.py lista                 situação de cada spec no formato novo
  python3 ferramentas/spec.py nova v10.4 "Título" [etapa]   cria docs/spec-v10.4.md a partir de docs/modelo-spec.md

Só entram as specs com a linha "**Situação:**" (as anteriores a 11/11 são registro e ficam como estão).
Situações: rascunho (ainda há decisão em aberto), aprovada (pronta para executar), entregue (versão fechada).

O que a conferência cobra:
- sempre: as seções obrigatórias e uma situação válida;
- aprovada e entregue: "Decisões em aberto" vazia ("Nenhuma."), ao menos um critério de aceite, cada critério
  ("- **CA1** ...") apontando a prova (smokeN, balance, carreira, emprestimo, menu_fit, shot_ ou captura) e a
  linha "**Modelo:**" já com o modelo da execução;
- entregue: nenhuma tarefa "- [ ]", todo smoke citado nos critérios existe em tests/ e está no run_all.sh, e a
  seção "Desvios" preenchida ("Nenhum." serve);
- a spec da versão atual (VERSAO em src/10-constantes.js), se for do formato novo, tem de estar entregue, e
  nenhuma spec de versão mais nova pode estar entregue.
"""
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DOCS = RAIZ / 'docs'
MODELO = DOCS / 'modelo-spec.md'
OBRIGATORIAS = ['Objetivo', 'Regras', 'Critérios de aceite', 'Testes', 'Decisões em aberto', 'Desvios']
SITUACOES = ('rascunho', 'aprovada', 'entregue')
PROVA = re.compile(r'smoke\d+b?|balance|carreira|emprestimo|menu_fit|shot_|captura', re.I)
VAZIO = re.compile(r'^(nenhuma?|nada)\b', re.I)


def versao_de(nome):
    return tuple(int(n) for n in re.findall(r'\d+', nome))


def versao_atual():
    m = re.search(r"const VERSAO = 'v([\d.]+)'", (RAIZ / 'src' / '10-constantes.js').read_text(encoding='utf-8'))
    return versao_de(m.group(1)) if m else ()


def secoes(texto):
    """{título sem o que vem entre parênteses: corpo} das seções '## '."""
    out, atual = {}, None
    for l in texto.split('\n'):
        if l.startswith('## '):
            atual = re.sub(r'\s*\(.*\)\s*$', '', l[3:]).strip()
            out[atual] = []
        elif atual is not None and not l.startswith('**Modelo:**'):
            out[atual].append(l)
    return {k: '\n'.join(v).strip() for k, v in out.items()}


def situacao(texto):
    m = re.search(r'^\*\*Situação:\*\*\s*(\w+)', texto, re.M)
    return m.group(1).lower() if m else None


def specs():
    for f in sorted(DOCS.glob('spec-v*.md'), key=lambda f: versao_de(f.stem)):
        t = f.read_text(encoding='utf-8')
        s = situacao(t)
        if s is not None:
            yield f, t, s


def confere_uma(f, t, s, runall, atual):
    erros = []
    sec = secoes(t)
    if s not in SITUACOES:
        return ['situação "%s" (use %s)' % (s, ', '.join(SITUACOES))]
    for o in OBRIGATORIAS:
        if o not in sec:
            erros.append('falta a seção "## %s"' % o)
    if erros or s == 'rascunho':
        return erros
    aberto = [l for l in sec['Decisões em aberto'].split('\n') if l.strip()]
    if not (len(aberto) == 1 and VAZIO.match(aberto[0].strip(' -*.'))):
        erros.append('%s com decisões em aberto (feche com o usuário e deixe "Nenhuma.")' % s)
    cas = [l for l in sec['Critérios de aceite'].split('\n') if re.match(r'- \*\*CA\d+\*\*', l)]
    if not cas:
        erros.append('sem critérios de aceite ("- **CA1** ...")')
    for l in cas:
        if not PROVA.search(l):
            erros.append('%s sem prova (smokeN, balance, captura...)' % re.match(r'- \*\*(CA\d+)', l).group(1))
    m = re.search(r'^\*\*Modelo:\*\*\s*(.*)', t, re.M)
    if not m or not m.group(1).strip() or m.group(1).lower().startswith('planejar'):
        erros.append('falta a linha "**Modelo:**" com o modelo da execução')
    v = versao_de(f.stem)
    if s == 'entregue':
        if re.search(r'^\s*- \[ \]', t, re.M):
            erros.append('entregue com tarefa "- [ ]" por fazer')
        for sm in sorted(set(re.findall(r'smoke\d+b?', sec['Critérios de aceite']))):
            if not (RAIZ / 'tests' / (sm + '.js')).exists():
                erros.append('%s.js não existe em tests/' % sm)
            elif not re.search(r'\b%s\.js\b' % sm, runall):
                erros.append('%s.js fora do tests/run_all.sh' % sm)
        if not sec['Desvios']:
            erros.append('entregue com "Desvios" vazio (escreva "Nenhum." se não houve)')
        if atual and v > atual:
            erros.append('entregue, mas a VERSAO do jogo é anterior')
    elif atual and v == atual:
        erros.append('é a versão atual do jogo e ainda está "%s" (feche a spec)' % s)
    return erros


def confere():
    runall = (RAIZ / 'tests' / 'run_all.sh').read_text(encoding='utf-8')
    atual = versao_atual()
    n, ruim = 0, 0
    for f, t, s in specs():
        n += 1
        for e in confere_uma(f, t, s, runall, atual):
            ruim += 1
            print('SPEC %s: %s' % (f.name, e))
    print('specs: %d no formato novo, %d problema(s)' % (n, ruim))
    return 1 if ruim else 0


def lista():
    for f, t, s in specs():
        feitas, todas = len(re.findall(r'^\s*- \[x\]', t, re.M | re.I)), len(re.findall(r'^\s*- \[[ xX]\]', t, re.M))
        print('%-22s %-9s tarefas %d/%d  %s' % (f.name, s, feitas, todas, t.split('\n', 1)[0].lstrip('# ')))
    return 0


def nova(versao, titulo, etapa=''):
    versao = versao if versao.startswith('v') else 'v' + versao
    destino = DOCS / ('spec-%s.md' % versao)
    if destino.exists():
        print('já existe: %s' % destino.relative_to(RAIZ))
        return 1
    t = MODELO.read_text(encoding='utf-8')
    t = t.split('<!-- modelo: daqui para baixo -->\n', 1)[-1]
    t = t.replace('vN.N', versao).replace('TÍTULO', titulo).replace('ETAPA', etapa or '?')
    destino.write_text(t, encoding='utf-8')
    print('criada: %s (rascunho)' % destino.relative_to(RAIZ))
    return 0


if __name__ == '__main__':
    a = sys.argv[1:]
    if not a:
        sys.exit(confere())
    if a[0] == 'lista':
        sys.exit(lista())
    if a[0] == 'nova' and len(a) >= 3:
        sys.exit(nova(*a[1:4]))
    print(__doc__)
    sys.exit(2)
