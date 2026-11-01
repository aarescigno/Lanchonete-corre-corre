#!/usr/bin/env python3
"""Copia o kit (kit/modelo) para a pasta de um jogo novo, trocando os marcadores.

Uso:
  python3 kit/instalar.py DESTINO --nome "Nome do Jogo" [--arquivo jogo.html] [--branch main] [--forcar]

- DESTINO: a pasta do repositório novo (pode já ter README, LICENSE, .git).
- --arquivo: o nome do arquivo montado e publicado (padrão: o nome do jogo sem acento, com hífens, .html).
- --branch: o branch padrão do repositório novo (padrão: main).
- Sem --forcar, não sobrescreve arquivo que já existe no DESTINO (lista os que pulou).
Marcadores trocados: {{JOGO}}, {{ARQ}}, {{CHAVE}}, {{BRANCH}}, {{DATA}}.
"""
import argparse, datetime, os, re, shutil, stat, subprocess, sys, unicodedata

MODELO = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'modelo')


def slug(txt):
    t = unicodedata.normalize('NFKD', txt).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', t).strip('-') or 'jogo'


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('destino')
    ap.add_argument('--nome', required=True)
    ap.add_argument('--arquivo')
    ap.add_argument('--branch', default='main')
    ap.add_argument('--forcar', action='store_true')
    a = ap.parse_args()
    arq = a.arquivo or slug(a.nome) + '.html'
    troca = {'{{JOGO}}': a.nome, '{{ARQ}}': arq, '{{CHAVE}}': slug(a.nome).replace('-', '_')[:24],
             '{{BRANCH}}': a.branch, '{{DATA}}': datetime.date.today().strftime('%d/%m/%Y')}
    os.makedirs(a.destino, exist_ok=True)
    copiados, pulados = 0, []
    for raiz, _, arquivos in os.walk(MODELO):
        for f in arquivos:
            orig = os.path.join(raiz, f)
            rel = os.path.relpath(orig, MODELO)
            dest = os.path.join(a.destino, rel)
            if os.path.exists(dest) and not a.forcar:
                pulados.append(rel)
                continue
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            try:
                s = open(orig, encoding='utf8').read()
            except UnicodeDecodeError:
                shutil.copyfile(orig, dest)
            else:
                for k, v in troca.items():
                    s = s.replace(k, v)
                open(dest, 'w', encoding='utf8').write(s)
            if f.endswith(('.sh', '.py')):
                os.chmod(dest, os.stat(dest).st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)
            copiados += 1
    print(f'{copiados} arquivos copiados para {a.destino} (arquivo publicado: {arq})')
    if pulados:
        print('já existiam (use --forcar para trocar):', ', '.join(sorted(pulados)))
    r = subprocess.run([os.path.join(a.destino, 'tests', 'run_all.sh')], capture_output=True, text=True)
    print(r.stdout.strip() or r.stderr.strip())
    print('\nPróximo passo: commit, e na 1ª sessão use o prompt de docs/PROMPTS.md ("vamos planejar o jogo").')
    sys.exit(r.returncode)


if __name__ == '__main__':
    main()
