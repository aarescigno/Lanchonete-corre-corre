# capturas da v7.7 (espera da Garagem: de pé e água da torneira) em ../capturas/v7.7, no PC (960×600) e no celular
# deitado (740×360): a calçada com 4 grupos de pé (2 já com o copo d'água), a Bia enchendo os copos na torneira e a
# lojinha com a Água da torneira
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v7.7'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
KEEP="g.groups.forEach(x=>x.patLeft=Math.max(x.patLeft,3));"
DIA="""()=>{ document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));
  const g=window.__game, L=window.__lcc; g.save=L.normSave({maxDay:7,bank:3000,up:{maquina:true,bandeja:true},torneira:true}); g.up=g.save.up; g.buildTables();
  g.startDay(5); g.begin(); g.schedule=[]; g.nextIdx=0;
  g.tables.forEach((t,i)=>{ const s=g.spawn({type:t.seats>2?'familia':'estudante',color:i%4}); g.seatGroup(s,t); });
  for(let i=0;i<80;i++) g.update(0.05);
  ['estudante','vovos','familia','executiva'].forEach((type,i)=>g.spawn({type,color:i%4,vip:i===1}));
  for(let i=0;i<130;i++){ KEEP g.update(0.05); }
  g.tapStation('maquina'); for(let i=0;i<300 && g.bia.acts.length;i++){ KEEP g.update(0.05); }
  g.tapStation('maquina'); for(let i=0;i<300 && !(g.bia.doing && g.bia.doing.type==='maquina');i++){ KEEP g.update(0.05); }
  for(let i=0;i<4;i++){ KEEP g.update(0.05); } g.update=()=>{}; }""".replace('KEEP',KEEP)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp,cel in [('_pc',(960,600),False),('_celular',(740,360),True)]:
        ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=cel, device_scale_factor=2)
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.evaluate(DIA); pg.wait_for_timeout(150)
        print(name[1:],pg.evaluate("()=>{const g=window.__game; return {fila:g.queue.map(q=>q.size+':'+q.sucoN), bia:g.bia.doing&&g.bia.doing.type, maos:g.bia.hands.length}}"))
        pg.screenshot(path=OUT+'/01_calcada'+name+'.png')
        pg.evaluate("()=>{ const g=window.__game, L=window.__lcc; g.save=L.normSave({maxDay:4,bank:900,torneira:true}); g.up=g.save.up; g.buildTables(); g.goShop(4); L.setShopTab('melhorias'); }")
        pg.wait_for_timeout(200); pg.screenshot(path=OUT+'/02_lojinha'+name+'.png')
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
