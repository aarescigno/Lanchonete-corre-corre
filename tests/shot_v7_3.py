# capturas da v7.3 (selos da fila no salão e Tênis de corrida na lojinha) em ../capturas/v7.3
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v7.3'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
# dia 3: senta os grupos da fila, deixa o tempo correr e enche a fila da Bia (mesa repetida, estações e um prato)
FILA="""()=>{ const g=window.__game; g.startDay(3); g.begin();
  for(let k=0;k<1400;k++){ g.update(0.02); for(const q of g.queue.slice()){ const t=g.tables.find(t=>t.free&&t.seats>=q.size); if(t) g.seatGroup(q,t); } }
  const last=g.tables.filter(t=>t.group&&t.group.seated).pop(); if(last){ last.group.setState('ordered'); g.kitchen.submit({group:last.group,table:last.id}); for(let k=0;k<500;k++) g.kitchen.update(0.02); }
  g.bia.clearActs();
  const ts=g.tables.filter(t=>t.group&&t.group.seated);
  if(ts[0]) g.tapTable(ts[0]); g.tapStation('coffee'); if(ts[1]) g.tapTable(ts[1]); if(ts[0]) g.tapTable(ts[0]); g.tapStation('sink');
  const p=g.kitchen.plates.findIndex(x=>x); if(p>=0) g.tapStation('plates',[806,848,890,932][p],270);
  window.__marks=g.bia.marks(); return JSON.stringify(window.__marks); }"""
LOJA="""()=>{ const g=window.__game, L=window.__lcc; g.save=L.normSave({maxDay:4,bank:900,up:{tenis:true}}); g.up=g.save.up; g.boughtFor=3; g.buildTables(); g.goShop(4); L.setShopTab('melhorias'); }"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp in [('',{'width':960,'height':600}),('_celular',{'width':740,'height':360})]:
        ctx=b.new_context(viewport=vp, has_touch=bool(name))
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.evaluate("()=>{ document.querySelectorAll('.ov').forEach(o=>o.classList.add('hidden')); }")
        print('marcas:',pg.evaluate(FILA)); pg.wait_for_timeout(60)
        pg.screenshot(path=OUT+'/01_fila_pop'+name+'.png')
        pg.wait_for_timeout(400)
        pg.screenshot(path=OUT+'/02_fila'+name+'.png')
        pg.evaluate(LOJA); pg.wait_for_timeout(200)
        pg.screenshot(path=OUT+'/03_lojinha_corrida'+name+'.png')
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
