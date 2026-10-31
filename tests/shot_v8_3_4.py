# capturas da v8.3.4 (balão de comida pronta) em ../capturas/v8.3.4: mesa 1 com o prato no balcão (balão verde),
# mesa 2 com o prato na mão da Bia (balão branco) e mesa 3 ainda esperando (sem balão), no PC (1220×600) e no celular deitado (740×360)
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v8.3.4'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
CENA="""()=>{ document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));
  const g=window.__game, L=window.__lcc; g.save=L.normSave({maxDay:7,bank:3000}); g.up=g.save.up; g.buildTables();
  g.startDay(3); g.begin(); g.schedule=[]; g.nextIdx=0;
  const gs=g.tables.slice(0,3).map((t,i)=>{ const s=g.spawn({type:'estudante',color:i%4}); g.seatGroup(s,t); return s; });
  for(let i=0;i<60;i++) g.update(0.05);
  gs.forEach(s=>s.setState('ordered'));
  const k=g.kitchen; k.queue=[]; k.cooking=[]; k.plates=[null,null,null,null];
  k.plates[0]={id:++k.pid,table:gs[0].table.id,group:gs[0],dish:gs[0].dish,slot:0,age:1,crit:false,vip:false};
  g.bia.hands=[{kind:'dish',group:gs[1],dish:gs[1].dish,table:gs[1].table.id}];
  g.update=()=>{}; }"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp,cel in [('_pc',(1220,600),False),('_celular',(740,360),True)]:
        ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=cel, device_scale_factor=2)
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.evaluate(CENA); pg.wait_for_timeout(300)
        pg.screenshot(path=OUT+'/01_comida_pronta'+name+'.png')
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
