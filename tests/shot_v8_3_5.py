# capturas da v8.3.5 (estoque do salão) em ../capturas/v8.3.5, no PC (1220×600) e no celular deitado (740×360):
# salão cheio com o estoque vazio, mesa arrastada por cima do estoque, mesas guardadas e o balãozinho da mesa do estoque
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v8.3.5'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
LOJA="""()=>{ document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));
  const g=window.__game, L=window.__lcc; g.save=L.normSave({maxDay:4,bank:2000,treino:true}); g.up=g.save.up; g.buildTables();
  g.goShop(4); g.buyMesa(4); g.buyMesa(2); g.salaoSel=-1; L.setShopTab('salao'); }"""
# ponto do salão (lógico) -> ponto da tela, pelo canvas do editor (mostra x 0..800, y 56..540)
def tela(pg, x, y):
    bb=pg.locator('.ed-cv canvas').bounding_box()
    return bb['x']+x*bb['width']/800, bb['y']+(y-56)*bb['height']/484
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp,cel in [('_pc',(1220,600),False),('_celular',(740,360),True)]:
        ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=cel, device_scale_factor=2)
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.evaluate(LOJA); pg.wait_for_timeout(200)
        pg.screenshot(path=OUT+'/01_salao_cheio'+name+'.png')
        m=pg.evaluate("()=>window.__game.save.salao.mesas.map(m=>[m.x,m.y])")
        pg.mouse.move(*tela(pg,*m[1])); pg.mouse.down(); pg.mouse.move(*tela(pg,150,300),steps=6); pg.mouse.move(*tela(pg,100,300),steps=4); pg.wait_for_timeout(100)
        pg.screenshot(path=OUT+'/02_arrasto_estoque'+name+'.png')
        pg.mouse.up(); pg.wait_for_timeout(100)
        pg.evaluate("()=>{ const g=window.__game; g.guardarMesa(0); g.guardarMesa(2); g.estoqueSel=1; window.__lcc.setShopTab('salao'); }"); pg.wait_for_timeout(200)
        pg.screenshot(path=OUT+'/03_estoque_mesa'+name+'.png')
        print(name, pg.evaluate("()=>JSON.stringify(window.__game.save.salao.estoque)"))
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
