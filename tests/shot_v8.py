# capturas da v8 (manutenção e imprevistos) em ../capturas/v8: o dia 5 com os 3 equipamentos quebrados e as plaquinhas
# de conserto, o dia de chuva, o feriado e a lojinha na aba Manutenção, no PC (1220×600) e no celular deitado (740×360)
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v8'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
def dia(clima, quebra):
    q=','.join("{id:'%s',t:0,on:true,fixed:false}"%i for i in quebra)
    return """()=>{ document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));
  const g=window.__game, L=window.__lcc; g.save=L.normSave({maxDay:7,bank:3000,up:{maquina:true,bandeja:true},torneira:true,manut:{fogao:0.1,geladeira:0.1,cafeteira:0.1}}); g.up=g.save.up; g.buildTables();
  g.startDay(5); g.begin(); g.schedule=[]; g.nextIdx=0;
  g.tables.forEach((t,i)=>{ const s=g.spawn({type:t.seats>2?'familia':'estudante',color:i%%4}); g.seatGroup(s,t); });
  for(let i=0;i<60;i++) g.update(0.05);
  g.clima='%s'; g.quebras=[%s];
  for(let i=0;i<20;i++) g.update(0.05);
  g.clima='%s'; g.quebras=[%s]; g.update=()=>{}; }"""%(clima,q,clima,q)
ALL=['fogao','geladeira','cafeteira']
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp,cel in [('_pc',(1220,600),False),('_celular',(740,360),True)]:
        ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=cel, device_scale_factor=2)
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        for arq,cl,qb in [('01_quebrado','',ALL),('02_chuva','chuva',[]),('03_feriado','feriado',[]),('04_normal','',[])]:
            pg.reload(); pg.wait_for_timeout(500)
            pg.evaluate(dia(cl,qb)); pg.wait_for_timeout(200)
            pg.screenshot(path=OUT+'/'+arq+name+'.png')
        pg.reload(); pg.wait_for_timeout(500)
        pg.evaluate("()=>{ const g=window.__game, L=window.__lcc; g.save=L.normSave({maxDay:5,bank:900,torneira:true,manut:{fogao:0.35,geladeira:0.7,cafeteira:0.05}}); g.up=g.save.up; g.buildTables(); g.goShop(5); L.setShopTab('manut'); }")
        pg.wait_for_timeout(200); pg.screenshot(path=OUT+'/05_lojinha_manut'+name+'.png')
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
