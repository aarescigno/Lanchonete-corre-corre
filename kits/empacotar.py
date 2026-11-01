#!/usr/bin/env python3
"""Gera kits/kit-<nome>.zip para cada kit em kits/ (as pastas que têm instalar.py), mantendo os scripts executáveis.
Uso: python3 kits/empacotar.py"""
import os, stat, zipfile

AQUI = os.path.dirname(os.path.abspath(__file__))
for nome in sorted(os.listdir(AQUI)):
    pasta = os.path.join(AQUI, nome)
    if not os.path.isfile(os.path.join(pasta, 'instalar.py')):
        continue
    destino = os.path.join(AQUI, f'kit-{nome}.zip')
    with zipfile.ZipFile(destino, 'w', zipfile.ZIP_DEFLATED) as z:
        for raiz, dirs, arquivos in os.walk(pasta):
            dirs[:] = sorted(d for d in dirs if d != '__pycache__')
            for f in sorted(arquivos):
                caminho = os.path.join(raiz, f)
                info = zipfile.ZipInfo(os.path.join(f'kit-{nome}', os.path.relpath(caminho, pasta)), (2026, 1, 1, 0, 0, 0))
                modo = 0o755 if f.endswith(('.sh', '.py')) else 0o644
                info.external_attr = (stat.S_IFREG | modo) << 16
                info.compress_type = zipfile.ZIP_DEFLATED
                z.writestr(info, open(caminho, 'rb').read())
    print(f'{os.path.relpath(destino)}: {os.path.getsize(destino) // 1024} KB')
