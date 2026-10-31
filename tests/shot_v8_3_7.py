# capturas da v8.3.7 (3ª estrela mais clara) em ../capturas/v8.3.7: a introdução do dia 7, a barra de lucro sem perda e
# com 1 cliente perdido ("3ª estrela perdida") e o fim do dia com o lucro das 3 estrelas e 1 perda, no PC (1220×600) e no celular (740×360)
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v8.3.7'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
INTRO="""()=>{ const g=window.__game, L=window.__lcc; g.save=L.normSave({maxDay:7,bank:1500,torneira:true}); g.up=g.save.up; g.buildTables(); g.startDay(7); }"""
DIA="""()=>{ const g=window.__game; g.begin(); g.money=1300+g.fixo; g.custo=0; g.paused=true; }"""
PERDA="""()=>{ window.__game.stats.lost=1; }"""
FIM="""()=>{ const g=window.__game; g.paused=false; g.finishDay(); g.hooks.state('dayend'); }"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp,cel in [('_pc',(1220,600),False),('_celular',(740,360),True)]:
        ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=cel, device_scale_factor=2)
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.evaluate(INTRO); pg.wait_for_timeout(300); pg.screenshot(path=OUT+'/01_introducao'+name+'.png')
        pg.evaluate(DIA); pg.wait_for_timeout(300); pg.screenshot(path=OUT+'/02_barra_sem_perda'+name+'.png')
        pg.evaluate(PERDA); pg.wait_for_timeout(300); pg.screenshot(path=OUT+'/03_barra_com_perda'+name+'.png')
        pg.evaluate(FIM); pg.wait_for_timeout(300); pg.screenshot(path=OUT+'/04_fim_do_dia'+name+'.png')
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
