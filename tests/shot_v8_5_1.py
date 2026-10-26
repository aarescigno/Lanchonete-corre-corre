# capturas da v8.5.1 (abertura com a cortina do hospital e a cena da saudade; o resto como na v8.5) em ../capturas/v8.5: o menu com o botão História,
# cada cena no meio e no fim (PC), a cena 1 no celular deitado e em pé, a 1ª cena com movimento reduzido e o cartão "Em breve"
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v8.5.1'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
VISTA="try{localStorage.setItem('lcc2_abertura','1')}catch(e){}"
# põe a abertura na cena i, no andamento p (0 a 1), e espera um quadro
CENA="""([i,p])=>{ const ab=window.__lcc.aberturaAtual(); ab.i=i; ab.t=ab.cena.t*p; ab.update(0); }"""
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path=exe); errs=[]
    ctx=b.new_context(viewport={'width':1220,'height':600}, device_scale_factor=1)
    pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(800)
    pg.screenshot(path=OUT+'/autoplay_1a_vez.png')
    n=pg.evaluate("()=>window.__lcc.ABERTURA.cenas.length")
    ids=pg.evaluate("()=>window.__lcc.ABERTURA.cenas.map(c=>c.id)")
    for i in range(n):
        for nome,p in [('meio',0.5),('fim',0.9)]:
            pg.evaluate(CENA,[i,p]); pg.wait_for_timeout(120)
            pg.screenshot(path=OUT+'/cena%d_%s_%s.png'%(i+1,ids[i],nome))
    pg.click('#btn-ab-pular'); pg.wait_for_timeout(300)
    pg.screenshot(path=OUT+'/menu_depois_da_abertura.png')
    pg.click('#btn-historia'); pg.wait_for_timeout(200)
    pg.click('#btn-ab-pular'); pg.wait_for_timeout(300)
    pg.screenshot(path=OUT+'/em_breve.png')
    ctx.close()
    for name,vp in [('celular_deitado',(740,360)),('celular_em_pe',(390,800))]:
        ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=True, device_scale_factor=2)
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e))); pg.add_init_script(VISTA)
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.screenshot(path=OUT+'/menu_'+name+'.png')
        pg.tap('#btn-historia'); pg.evaluate(CENA,[0,0.6]); pg.wait_for_timeout(150)
        pg.screenshot(path=OUT+'/cena1_'+name+'.png')
        ctx.close()
    ctx=b.new_context(viewport={'width':1220,'height':600}, reduced_motion='reduce')
    pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e))); pg.add_init_script(VISTA)
    pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(500)
    pg.click('#btn-historia'); pg.wait_for_timeout(1500)
    pg.screenshot(path=OUT+'/cena1_movimento_reduzido.png')
    pg.mouse.click(600,300); pg.wait_for_timeout(200)
    pg.screenshot(path=OUT+'/cena2_movimento_reduzido.png')
    ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
