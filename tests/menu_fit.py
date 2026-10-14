# Confere que o painel do menu principal não rola em vários tamanhos de tela (desktop e celular deitado).
from playwright.sync_api import sync_playwright
import pathlib, os, sys
HERE=pathlib.Path(__file__).resolve().parent
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
W=str(HERE/'wrapped.html'); open(W,'w').write(html)
VPS=[(1920,1080),(1366,768),(1280,720),(960,600),(1024,768),(800,600),(640,400),(932,430),(915,412),(844,390),(812,375),(740,360),(667,375),(568,320)]
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
fails=0
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe)
    for w,h in VPS:
        pg=b.new_page(viewport={'width':w,'height':h}); pg.goto('file://'+W); pg.wait_for_timeout(300)
        r=pg.evaluate("()=>{const p=document.querySelector('.menu-panel');return [p.scrollHeight,p.clientHeight,p.scrollWidth,p.clientWidth]}")
        bad=r[0]>r[1]+1 or r[2]>r[3]+1
        fails+=bad
        print(('FAIL' if bad else 'ok  ')+f': {w}x{h} altura {r[0]}/{r[1]} largura {r[2]}/{r[3]}')
        pg.close()
    b.close()
os.remove(W)
print('fails=',fails); sys.exit(1 if fails else 0)
