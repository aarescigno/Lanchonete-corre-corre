# capturas da v8.3.8 (preços de verdade) em ../capturas/v8.3.8: o dia com os pontos de atendimento no HUD e os textos
# "+N pts" (ações) e "+R$ N" (o que o cliente paga), o fim do dia com os pontos e o Como jogar com o cardápio,
# no PC (1220×600) e no celular (740×360)
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v8.3.8'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
DIA="""()=>{ const g=window.__game, L=window.__lcc; g.save=L.normSave({maxDay:7,dia:5,bank:600,torneira:true,equipe:{tonhao:1,dani:1}}); g.up=g.save.up; g.buildTables(); g.startDay(5); g.begin();
  g.schedule=[{t:1e9,type:'estudante',color:0}]; g.nextIdx=0; g.clock=g.day.time*0.55;
  const ts=g.tables.filter(t=>t.free);
  const a=g.spawn({type:'familia',color:ts[3].color}); g.seatGroup(a,ts[3]); a.x=ts[3].cx; a.y=ts[3].cy+30; a.path=[]; a.setState('wantBill'); a.hearts=5; a.juiceWant=0;
  const b=g.spawn({type:'vovos',color:1}); g.seatGroup(b,ts[0]); b.x=ts[0].cx; b.y=ts[0].cy+30; b.path=[]; b.setState('eating'); b.timer=6; b.eatTotal=8;
  const c=g.spawn({type:'executiva',color:2}); g.seatGroup(c,ts[1]); c.x=ts[1].cx; c.y=ts[1].cy+30; c.path=[]; c.setState('wantOrder');
  g.fx=[]; g.lastKind=null; g.money=180; g.custo=70; g.pontos=640;
  g.collectBill(a,ts[3]); g.lastKind=null; g.bia.hands=[{kind:'coffee'}]; g.bia.doTable(ts[0]); g.lastKind=null; g.bia.doTable(ts[1]);
  g.paused=true; }"""
FIM="""()=>{ const g=window.__game; g.paused=false; g.money=640; g.custo=230; g.finishDay(); g.hooks.state('dayend'); }"""
COMO="""()=>{ document.getElementById('btn-how').click(); }"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp,cel in [('_pc',(1220,600),False),('_celular',(740,360),True)]:
        ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=cel, device_scale_factor=2)
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.evaluate(DIA); pg.wait_for_timeout(300); pg.screenshot(path=OUT+'/01_dia_pontos'+name+'.png')
        pg.evaluate(FIM); pg.wait_for_timeout(300); pg.screenshot(path=OUT+'/02_fim_do_dia'+name+'.png')
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.evaluate(COMO); pg.wait_for_timeout(300); pg.screenshot(path=OUT+'/03_como_jogar'+name+'.png', full_page=True)
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
