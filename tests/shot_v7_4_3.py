# capturas da v7.4.3 (cor das cadeiras no balãozinho do editor do salão) em ../capturas/v7.4.3, em 960×600 e 740×360 (com toque)
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v7.4.3'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
LOJA="""()=>{ document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));
  const g=window.__game, L=window.__lcc; g.save=L.normSave({maxDay:4,bank:900}); g.up=g.save.up; g.buildTables(); g.goShop(4); L.setShopTab('salao'); }"""
def tela(pg, x, y):
    bb=pg.locator('.ed-cv canvas').bounding_box()
    return bb['x']+x*bb['width']/800, bb['y']+(y-56)*bb['height']/484
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp in [('',{'width':960,'height':600}),('_celular',{'width':740,'height':360})]:
        cel=bool(name)
        ctx=b.new_context(viewport=vp, has_touch=cel)
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.evaluate(LOJA); pg.wait_for_timeout(200)
        m=pg.evaluate("()=>window.__game.save.salao.mesas.map(m=>[m.x,m.y,m.seats,m.c])")
        for i,arq in [(1,'01_cores'),(3,'02_cores_embaixo')]:
            x,y=tela(pg,m[i][0],m[i][1])
            if cel: pg.touchscreen.tap(x,y)
            else: pg.mouse.click(x,y)
            pg.wait_for_timeout(150)
            pg.screenshot(path=OUT+'/'+arq+name+'.png')
            # troca para a cor seguinte
            nova=(m[i][3]+1)%4
            pg.locator('.ed-cor').nth(nova).click(); pg.wait_for_timeout(150)
            print(name or 'pc','mesa',i+1,'cor',m[i][3],'->',pg.evaluate("i=>window.__game.save.salao.mesas[i].c",i),'sel',pg.evaluate("()=>window.__game.salaoSel"))
            pg.screenshot(path=OUT+'/'+arq+'_trocada'+name+'.png')
            pg.locator('.ed-x').click(); pg.wait_for_timeout(100)
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
