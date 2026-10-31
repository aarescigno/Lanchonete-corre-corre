# capturas da v8.6.2 (inconsistências da abertura) em ../capturas/v8.6.2: o hospital (antes, durante e depois da fala, cortina
# fechada) e o banco (a Bia correndo com o pote e o pote no chão)
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v8.6.2'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
CENA="""([i,p])=>{ const ab=window.__lcc.aberturaAtual(); ab.i=i; ab.t=ab.cena.t*p; ab.tm=ab.t; ab.update(0); }"""
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path=exe); errs=[]
    pg=b.new_page(viewport={'width':1220,'height':600})
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(800)
    for nome,i,p in [('hospital_antes',4,0.12),('hospital_fala',4,0.45),('hospital_depois',4,0.66),('hospital_cortina',4,0.92),('banco_correndo',8,0.45),('banco_pote_no_chao',8,0.85)]:
        pg.evaluate(CENA,[i,p]); pg.wait_for_timeout(80)
        pg.screenshot(path=OUT+'/'+nome+'.png')
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
