# capturas da v8.3.6 (Jogo de pratos sem limite) em ../capturas/v8.3.6: a aba Melhorias depois da melhoria do dia e de
# 2 Jogos de pratos (o cartão segue à venda, com "você tem 2"), no PC (1220×600) e no celular deitado (740×360)
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v8.3.6'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
LOJA="""()=>{ const g=window.__game, L=window.__lcc; g.save=L.normSave({maxDay:3,bank:1500,torneira:true}); g.up=g.save.up; g.boughtFor=0; g.buildTables(); g.goShop(3); g.buy('tenis'); g.buy('pratos'); g.buy('pratos'); L.setShopTab('melhorias'); }"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp,cel in [('_pc',(1220,600),False),('_celular',(740,360),True)]:
        ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=cel, device_scale_factor=2)
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.evaluate(LOJA); pg.wait_for_timeout(200); pg.screenshot(path=OUT+'/01_melhorias'+name+'.png')
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
