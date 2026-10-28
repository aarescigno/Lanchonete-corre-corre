# capturas da v8.6.1 (revisão estética da abertura) em ../capturas/v8.6.1: cada cena em 3 andamentos (PC), a cena 1 no celular
# deitado e em pé, e as 10 cenas com movimento reduzido (o quadro parado de cada uma)
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v8.6.1'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
VISTA="try{localStorage.setItem('lcc2_abertura','1')}catch(e){}"
# põe a abertura na cena i, no andamento p (0 a 1), com o relógio no mesmo ponto, e espera um quadro
CENA="""([i,p])=>{ const ab=window.__lcc.aberturaAtual(); ab.i=i; ab.t=ab.cena.t*p; ab.tm=ab.t; ab.update(0); }"""
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path=exe); errs=[]
    ctx=b.new_context(viewport={'width':1220,'height':600}, device_scale_factor=1)
    pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(800)
    ids=pg.evaluate("()=>window.__lcc.ABERTURA.cenas.map(c=>c.id)")
    for i in range(len(ids)):
        for p in [0.25,0.5,0.9]:
            pg.evaluate(CENA,[i,p]); pg.wait_for_timeout(80)
            pg.screenshot(path=OUT+'/cena%02d_%s_%02d.png'%(i+1,ids[i],int(p*100)))
    ctx.close()
    for name,vp in [('celular_deitado',(740,360)),('celular_em_pe',(390,800))]:
        ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=True, device_scale_factor=2)
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e))); pg.add_init_script(VISTA)
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.tap('#btn-historia'); pg.evaluate(CENA,[0,0.6]); pg.wait_for_timeout(150)
        pg.screenshot(path=OUT+'/cena01_'+name+'.png')
        ctx.close()
    ctx=b.new_context(viewport={'width':1220,'height':600}, reduced_motion='reduce')
    pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e))); pg.add_init_script(VISTA)
    pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(500)
    pg.click('#btn-historia'); pg.wait_for_timeout(300)
    for i in range(len(ids)):
        pg.screenshot(path=OUT+'/movimento_reduzido_cena%02d_%s.png'%(i+1,ids[i]))
        pg.mouse.click(600,300); pg.wait_for_timeout(150)
    ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
