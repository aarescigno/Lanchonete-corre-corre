# capturas da v7.4 (Garagem e editor do salão) em ../capturas/v7.4, em 960×600 e 740×360 (com toque)
from playwright.sync_api import sync_playwright
import pathlib, os, json
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v7.4'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
# dia 3 na Garagem com uma mesa de 2 a mais: senta os grupos da fila e deixa o tempo correr
JOGO="""()=>{ const g=window.__game, L=window.__lcc; g.save=L.normSave({maxDay:3,bank:900}); g.up=g.save.up; g.buildTables();
  g.goShop(3); g.buyMesa(2); g.startDay(3); g.begin();
  for(let k=0;k<1500;k++){ g.update(0.02); for(const q of g.queue.slice()){ const t=g.tables.find(t=>t.free&&t.seats>=q.size); if(t) g.seatGroup(q,t); } } }"""
LOJA="""()=>{ const g=window.__game, L=window.__lcc; g.save=L.normSave({maxDay:4,bank:900}); g.up=g.save.up; g.buildTables(); g.goShop(4); L.setShopTab('salao'); }"""
# ponto do salão (lógico) -> ponto da tela, pelo canvas do editor (mostra x 0..800, y 56..540)
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
        pg.screenshot(path=OUT+'/01_menu'+name+'.png')
        pg.evaluate("()=>{ document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show')); }")
        pg.evaluate(JOGO); pg.wait_for_timeout(100)
        pg.screenshot(path=OUT+'/02_garagem'+name+'.png')
        pg.evaluate(LOJA); pg.wait_for_timeout(200)
        pg.screenshot(path=OUT+'/03_editor'+name+'.png')
        m=pg.evaluate("()=>window.__game.save.salao.mesas.map(m=>[m.x,m.y,m.seats])")
        # toca na mesa 2 (de 2 lugares): abre o balãozinho
        x,y=tela(pg,m[1][0],m[1][1])
        if cel: pg.touchscreen.tap(x,y)
        else: pg.mouse.click(x,y)
        pg.wait_for_timeout(150)
        print(name or 'pc','sel:',pg.evaluate("()=>window.__game.salaoSel"))
        pg.screenshot(path=OUT+'/04_editor_mesa'+name+'.png')
        pg.locator('.ed-pop .btn').first.click(); pg.wait_for_timeout(150)
        print('  virou:',pg.evaluate("()=>JSON.stringify(window.__game.save.salao.mesas.map(m=>m.seats))"), pg.evaluate("()=>window.__game.save.bank"))
        pg.locator('.ed-x').click(); pg.wait_for_timeout(100)
        # arrasta a mesa 3 para cima da mesa 1 (fica vermelha) e depois para um lugar livre
        m=pg.evaluate("()=>window.__game.save.salao.mesas.map(m=>[m.x,m.y,m.seats])")
        x,y=tela(pg,m[2][0],m[2][1]); pg.mouse.move(x,y); pg.mouse.down()
        x2,y2=tela(pg,m[0][0]+20,m[0][1]+10); pg.mouse.move(x2,y2,steps=8); pg.wait_for_timeout(80)
        pg.screenshot(path=OUT+'/05_editor_vermelho'+name+'.png')
        x3,y3=tela(pg,430,420); pg.mouse.move(x3,y3,steps=8); pg.wait_for_timeout(80)
        pg.screenshot(path=OUT+'/06_editor_arrasto'+name+'.png')
        pg.mouse.up(); pg.wait_for_timeout(150)
        print('  depois do arrasto:',pg.evaluate("()=>JSON.stringify(window.__game.save.salao.mesas.map(m=>[m.x,m.y,m.seats]))"))
        pg.locator('.ed-side .btn', has_text='Mesa de 2').click(); pg.wait_for_timeout(150)
        pg.screenshot(path=OUT+'/07_editor_compra'+name+'.png')
        print('  scroll do painel:',pg.evaluate("()=>{ const p=document.querySelector('#ov-shop .panel'); return [p.scrollHeight,p.clientHeight]; }"))
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
