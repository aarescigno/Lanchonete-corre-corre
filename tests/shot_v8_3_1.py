# capturas da v8.3.1 (atrasar o banco) em ../capturas/v8.3.1: o fim do dia com a parcela atrasada, a aba Banco com o
# atraso, a tela "O banco tomou a lanchonete", o menu depois dela e (v8.3.2) a aba Banco com Amortizar e Quitar, no PC (1220×600) e no celular deitado (740×360)
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v8.3.1'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
SAVE="""(o)=>{ const g=window.__game, L=window.__lcc; g.save=L.normSave(Object.assign({torneira:true,treino:true,divulga:'boca'},o)); g.up=g.save.up; g.boughtFor=0; g.buildTables(); }"""
FECHA="""(b)=>{ const g=window.__game; g.startDay(g.proxDia); g.begin(); g.schedule=[]; g.nextIdx=0; g.money=300; g.custo=90; g.save.bank=b; g.finishDay(); }"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp,cel in [('_pc',(1220,600),False),('_celular',(740,360),True)]:
        ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=cel, device_scale_factor=2)
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.evaluate(SAVE,{'dia':9,'bank':100,'estrelas':12,'lucroTot':5200,'emp':{'resto':550,'n':5}}); pg.evaluate(FECHA,-200); pg.wait_for_timeout(150); pg.screenshot(path=OUT+'/01_fim_atrasou'+name+'.png')
        pg.evaluate("()=>{ const g=window.__game; g.goShop(g.proxDia); window.__lcc.setShopTab('banco'); }"); pg.wait_for_timeout(150); pg.screenshot(path=OUT+'/02_banco_atraso'+name+'.png')
        pg.evaluate(FECHA,-300); pg.wait_for_timeout(150); pg.screenshot(path=OUT+'/03_banco_tomou'+name+'.png')
        pg.evaluate(SAVE,{'dia':9,'bank':1400}); pg.evaluate("()=>{ const g=window.__game; g.goShop(9); g.emprestar(1000); window.__lcc.setShopTab('banco'); }"); pg.wait_for_timeout(150); pg.screenshot(path=OUT+'/05_banco_amortizar'+name+'.png')
        pg.evaluate("()=>window.__game.setState('menu')"); pg.wait_for_timeout(150); pg.screenshot(path=OUT+'/04_menu_fechou'+name+'.png')
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
