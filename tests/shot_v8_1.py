# capturas da v8.1 (dinheiro comprometido) em ../capturas/v8.1: a lojinha com R$ 159, Dani e TV (aba Salão), o 1º toque
# na mesa de 2 (o aviso), depois da compra (faltou para a folha) e a aba Melhorias, no PC (1220×600) e no celular deitado (740×360)
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v8.1'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
LOJA="""(aba)=>{ const g=window.__game, L=window.__lcc; g.save=L.normSave({maxDay:3,bank:159,torneira:true,equipe:{dani:1,tv:true,daniTasks:['pratos','lavar']}}); g.up=g.save.up; g.buildTables(); g.goShop(3); L.setShopTab(aba); }"""
MESA="()=>[...document.querySelectorAll('#shop-grid button')].find(b=>/Mesa de 2|Confirmar/.test(b.textContent))"
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp,cel in [('_pc',(1220,600),False),('_celular',(740,360),True)]:
        ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=cel, device_scale_factor=2)
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.evaluate(LOJA,'salao'); pg.wait_for_timeout(200); pg.screenshot(path=OUT+'/01_salao'+name+'.png')
        pg.evaluate("f=>("+MESA+")().click()"); pg.wait_for_timeout(150); pg.screenshot(path=OUT+'/02_aviso'+name+'.png')
        pg.evaluate("f=>("+MESA+")().click()"); pg.wait_for_timeout(150); pg.screenshot(path=OUT+'/03_comprou'+name+'.png')
        pg.evaluate(LOJA,'melhorias'); pg.wait_for_timeout(200); pg.screenshot(path=OUT+'/04_melhorias'+name+'.png')
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
