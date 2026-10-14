#!/usr/bin/env python3
"""Monta o app instalável (PWA) em app/site a partir de ../lanchonete.html.

O jogo não muda: o script só envolve o HTML com <head> próprio (manifest,
ícones, registro do service worker) e copia as versões antigas.
Uso: python3 app/build.py
"""
import hashlib, json, os, re, shutil
from PIL import Image, ImageDraw

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)
SITE = os.path.join(AQUI, 'site')

NOME = 'Lanchonete Corre-Corre'
CURTO = 'Corre-Corre'
FUNDO = '#1F4FA3'   # --faixa
TEMA = '#D8432F'    # --formica

jogo = open(os.path.join(RAIZ, 'lanchonete.html'), encoding='utf8').read()
assert jogo.startswith('<title>'), 'lanchonete.html deve começar com <title>'
titulo_fim = jogo.index('</title>') + len('</title>')
titulo, corpo = jogo[:titulo_fim], jogo[titulo_fim:]
# head = <title> + <link>/<style> do topo; o resto (markup e scripts) vai para o body
m = re.search(r'</style>', corpo)
head_extra, body = corpo[:m.end()], corpo[m.end():]
versao = hashlib.sha1(jogo.encode('utf8')).hexdigest()[:10]

shutil.rmtree(SITE, ignore_errors=True)
os.makedirs(os.path.join(SITE, 'icones'))

# ---------- ícones (desenho próprio: hambúrguer sobre azulejo azul) ----------
def icone(tam, margem):
    S = 4 * tam
    im = Image.new('RGBA', (S, S), FUNDO)
    d = ImageDraw.Draw(im)
    a = int(S * margem)           # área segura (maskable usa margem maior)
    w = S - 2 * a
    def r(y0, y1, cor, rad, x0=0.0, x1=1.0):
        d.rounded_rectangle([a + w * x0, a + w * y0, a + w * x1, a + w * y1],
                            radius=int(w * rad), fill=cor, outline='#22201C', width=max(4, int(w * .03)))
    d.pieslice([a + w * .05, a + w * .12, a + w * .95, a + w * .82], 180, 360,
               fill='#F2B33D', outline='#22201C', width=max(4, int(w * .03)))   # pão de cima
    for x, y in [(.3, .32), (.5, .26), (.68, .34), (.42, .4), (.6, .42)]:
        d.ellipse([a + w * (x - .025), a + w * (y - .015), a + w * (x + .025), a + w * (y + .015)], fill='#FBFAF5')
    r(.49, .57, '#3E9B5A', .04, .02, .98)   # alface
    r(.56, .67, '#6B3A1E', .05, .06, .94)   # carne
    r(.66, .72, '#F2B33D', .03, .04, .96)   # queijo
    r(.72, .84, '#E9A23B', .06, .07, .93)   # pão de baixo
    return im.resize((tam, tam), Image.LANCZOS)

icones = []
for tam in (192, 512):
    icone(tam, .14).save(os.path.join(SITE, 'icones', f'icone-{tam}.png'))
    icones.append({'src': f'icones/icone-{tam}.png', 'sizes': f'{tam}x{tam}', 'type': 'image/png', 'purpose': 'any'})
    icone(tam, .22).save(os.path.join(SITE, 'icones', f'maskable-{tam}.png'))
    icones.append({'src': f'icones/maskable-{tam}.png', 'sizes': f'{tam}x{tam}', 'type': 'image/png', 'purpose': 'maskable'})
icone(180, .12).convert('RGB').save(os.path.join(SITE, 'icones', 'apple-touch-icon.png'))

# ---------- manifest ----------
manifest = {
    'id': './', 'name': NOME, 'short_name': CURTO, 'lang': 'pt-BR',
    'description': 'Jogo de lanchonete: atenda os clientes com a Bia e o Chef Tonhão.',
    'start_url': './', 'scope': './', 'display': 'fullscreen',
    'display_override': ['fullscreen', 'standalone'], 'orientation': 'landscape',
    'background_color': FUNDO, 'theme_color': TEMA,
    'categories': ['games'], 'icons': icones,
}
json.dump(manifest, open(os.path.join(SITE, 'manifest.webmanifest'), 'w', encoding='utf8'),
          ensure_ascii=False, indent=2)

# ---------- versões antigas (links do painel Versões) ----------
os.makedirs(os.path.join(SITE, 'versoes'))
for f in sorted(os.listdir(os.path.join(RAIZ, 'versoes'))):
    if re.fullmatch(r'v\d+\.html', f):
        shutil.copy(os.path.join(RAIZ, 'versoes', f), os.path.join(SITE, 'versoes', f))

# ---------- service worker ----------
PRECACHE = ['./', 'index.html', 'manifest.webmanifest'] + [i['src'] for i in icones] + ['icones/apple-touch-icon.png']
sw = open(os.path.join(AQUI, 'sw.template.js'), encoding='utf8').read()
sw = sw.replace('__VERSAO__', versao).replace('__PRECACHE__', json.dumps(PRECACHE))
open(os.path.join(SITE, 'sw.js'), 'w', encoding='utf8').write(sw)

# ---------- index.html ----------
head = f'''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="{TEMA}">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="{CURTO}">
<meta name="description" content="{manifest['description']}">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" sizes="192x192" href="icones/icone-192.png">
<link rel="apple-touch-icon" href="icones/apple-touch-icon.png">
{titulo}{head_extra}
<style>html,body{{height:100%;margin:0}}</style>
</head>
<body>'''
reg = '''
<script>
/* app instalável: service worker (offline) e tela cheia na horizontal ao tocar */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
(function(){
  const app = window.matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches;
  if (!app) return;
  const travar = () => { try { screen.orientation.lock('landscape').catch(() => {}); } catch(e) {} };
  travar(); window.addEventListener('pointerdown', travar, { once: true });
})();
</script>
</body>
</html>
'''
open(os.path.join(SITE, 'index.html'), 'w', encoding='utf8').write(head + body + reg)
print('app montado em', os.path.relpath(SITE, RAIZ), '- versão', versao)
