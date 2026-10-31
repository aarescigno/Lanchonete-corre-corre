# capturas da v8.2.1 (rejogar sem perder o dinheiro) em ../capturas/v8.2.1: a pausa no meio do dia 3 (o aviso do que fica)
# e a introdução depois de Reiniciar, no PC (1220×600) e no celular deitado (740×360)
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v8.2.1'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
DIA="""()=>{ const g=window.__game, L=window.__lcc; g.save=L.normSave({maxDay:3,bank:400,torneira:true,equipe:{dani:1}}); g.up=g.save.up; g.buildTables(); g.startDay(3); g.begin(); g.clock=g.day.time/2; g.money=320; g.custo=95; g.pause(); }"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp,cel in [('_pc',(1220,600),False),('_celular',(740,360),True)]:
        ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=cel, device_scale_factor=2)
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.evaluate(DIA); pg.wait_for_timeout(200); pg.screenshot(path=OUT+'/01_pausa'+name+'.png')
        pg.click('#btn-restart'); pg.wait_for_timeout(200); pg.screenshot(path=OUT+'/02_reiniciou'+name+'.png')
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
