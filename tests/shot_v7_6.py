# capturas da v7.6 (tela larga: a calçada, o salão e a cozinha na mesma tela, sem rolar) em ../capturas/v7.6, no
# PC (960×600 e 1366×768), no tablet (1024×768) e no celular deitado (740×360, com toque). Leva um grupo da
# calçada até a mesa arrastando com o mouse ou o dedo de verdade
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v7.6'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
# dia 5 com a máquina e a bandeja: 3 mesas ocupadas, a mesa 1 livre, 4 grupos lá fora com pedidos no tablet
DIA="""()=>{ document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));
  const g=window.__game, L=window.__lcc; g.save=L.normSave({maxDay:7,bank:3000,up:{maquina:true,bandeja:true}}); g.up=g.save.up; g.buildTables();
  g.startDay(5); g.begin(); g.schedule=[]; g.nextIdx=0;
  g.tables.slice(1).forEach((t,i)=>{ const s=g.spawn({type:t.seats>2?'familia':'estudante',color:i%4}); g.seatGroup(s,t); });
  for(let i=0;i<80;i++) g.update(0.05);
  ['estudante','vovos','familia','executiva'].forEach((type,i)=>g.spawn({type,color:i%4,vip:i===1}));
  for(let i=0;i<130;i++){ g.groups.forEach(x=>x.patLeft=Math.max(x.patLeft,3)); g.update(0.05); }
  g.tapStation('maquina'); for(let i=0;i<20;i++){ g.groups.forEach(x=>x.patLeft=Math.max(x.patLeft,3)); g.update(0.05); } }"""
def tela(pg,x,y):
    b=pg.locator('#c').bounding_box(); return b['x']+x*b['width']/1220, b['y']+y*b['height']/600
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp,cel in [('_pc',(960,600),False),('_notebook',(1366,768),False),('_tablet',(1024,768),True),('_celular',(740,360),True)]:
        ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=cel)
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.screenshot(path=OUT+'/01_menu'+name+'.png')
        pg.evaluate(DIA); pg.wait_for_timeout(150)
        pg.screenshot(path=OUT+'/02_dia'+name+'.png')
        # arrasta o grupo do 1º banco até a mesa 1 (livre)
        g0,t=pg.evaluate("()=>{ const g=window.__game, q=g.queue.find(x=>x.size<=2), t=g.tables[0]; return [[q.x+g.cam,q.y-20,q.id],[t.cx+g.cam,t.cy]]; }")
        x0,y0=tela(pg,g0[0],g0[1]); x1,y1=tela(pg,t[0],t[1])
        if cel:
            pg.evaluate("""([a,b,c,d])=>{ const cv=document.getElementById('c');
              const ev=(tp,x,y)=>cv.dispatchEvent(new PointerEvent(tp,{pointerId:7,pointerType:'touch',clientX:x,clientY:y,bubbles:true}));
              ev('pointerdown',a,b); for(let i=1;i<=10;i++) ev('pointermove',a+(c-a)*i/10,b+(d-b)*i/10); ev('pointerup',c,d); }""",[x0,y0,x1,y1])
        else:
            pg.mouse.move(x0,y0); pg.mouse.down(); pg.mouse.move(x1,y1,steps=10); pg.mouse.up()
        pg.wait_for_timeout(250)
        print(name[1:],'canvas',[round(v) for v in pg.locator('#c').bounding_box().values()],'grupo',pg.evaluate("id=>{const q=window.__game.groups.find(x=>x.id===id); return q&&q.state}",g0[2]))
        pg.screenshot(path=OUT+'/03_arrastou'+name+'.png')
        pg.evaluate("()=>{ const g=window.__game, L=window.__lcc; g.save=L.normSave({maxDay:4,bank:900}); g.up=g.save.up; g.buildTables(); g.goShop(4); L.setShopTab('melhorias'); }")
        pg.wait_for_timeout(200); pg.screenshot(path=OUT+'/04_lojinha'+name+'.png')
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
