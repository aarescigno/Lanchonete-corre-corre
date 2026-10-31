# capturas da v8.6 (marmitas e fila de retirada) em ../capturas/v8.6: o dia 4 com os entregadores no balcão de retirada
# (marmita no fogão, pronta na janela, na mão da Bia e adiantadas na prateleira), a Bia entregando, a introdução do dia 4,
# o fim do dia com a linha das marmitas, a dica do Como jogar e a equipe da lojinha com a tarefa da Dani; no PC e no celular deitado
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v8.6'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
VISTA="try{localStorage.setItem('lcc2_abertura','1')}catch(e){}"
FECHA="document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));"
# dia 4: 2 adiantadas na prateleira, 3 entregadores (PF pronto, misto e coxinha no fogão), a Bia com uma marmita
DIA=FECHA+"""const g=window.__game, L=window.__lcc; g.save=L.normSave({dia:4,bank:900,up:{maquina:true},equipe:{dani:1,daniTasks:['marmita','lavar']}}); g.up=g.save.up; g.buildTables();
  g.startDay(4); g.begin(); g.schedule=[{t:1e9,type:'entregador',color:0}]; g.nextIdx=0;
  g.spawn({type:'familia',color:1}); g.spawn({type:'estudante',color:2});
  const pf=d=>({kind:'marmita',dish:d,dono:null,age:20,q:4}); g.prateleira=[pf('pf'),pf('pf')];
  const mk=(d,c)=>{ const e=g.spawn({type:'entregador',color:c}); g.soltaMarmitas(e); e.dish=d; e.dishes=[d]; g.marmitaPara(e); e.patLeft=1e9; return e; };
  const a=mk('misto',0), b=mk('coxinha',3), c=mk('pastel',2);
  for(let i=0;i<40;i++) g.update(0.05);
  g.kitchen.cooking.forEach(t=>{ if(t.dono===a) t.p=t.time; }); g.update(0.05);
  g.bia.x=16; g.bia.y=156; g.bia.hands=[{kind:'marmita',dish:'pastel',dono:c,age:0,q:4}];
  g.retirada.forEach(e=>{ e.x=e.path.length?e.path[0].x:e.x; e.y=e.path.length?e.path[0].y:e.y; e.path=[]; });
  g.update=()=>{};"""
ENTREGA=FECHA+"""const g=window.__game, L=window.__lcc; g.save=L.normSave({dia:4,bank:900}); g.up=g.save.up; g.buildTables();
  g.startDay(4); g.begin(); g.schedule=[{t:1e9,type:'entregador',color:0}]; g.nextIdx=0;
  const e=g.spawn({type:'entregador',color:1}); for(let i=0;i<30;i++) g.update(0.05);
  g.bia.x=16; g.bia.y=156; g.bia.hands=[{kind:'marmita',dish:e.dish,dono:e,age:0,q:4.6}];
  g.levaMarmitas(g.bia); for(let i=0;i<12;i++) g.update(0.05); g.update=()=>{};"""
FIM=FECHA+"""const g=window.__game, L=window.__lcc; g.save=L.normSave({dia:4,bank:900}); g.up=g.save.up; g.buildTables();
  g.startDay(4); g.begin(); g.money=520; g.stats.served=11; g.stats.lost=1; g.stats.marmitas=4; g.efood=13; g.stats.esfriou=1;
  g.prateleira=[{kind:'marmita',dish:'pf',dono:null,age:0,q:4}]; g.finishDay();"""
INTRO=FECHA+"""const g=window.__game, L=window.__lcc; g.save=L.normSave({dia:4,bank:900}); g.up=g.save.up; g.buildTables(); g.startDay(4);"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp,cel in [('_pc',(1220,600),False),('_celular_deitado',(740,360),True)]:
        ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=cel, device_scale_factor=2)
        ctx.add_init_script(VISTA)
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        for js,f in [(DIA,'dia4_balcao_de_retirada'),(ENTREGA,'entregador_leva_a_marmita')]:
            pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
            pg.evaluate('()=>{'+js+'}'); pg.wait_for_timeout(300)
            pg.screenshot(path=OUT+'/'+f+name+'.png')
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.evaluate('()=>{'+INTRO+'}'); pg.wait_for_timeout(300); pg.screenshot(path=OUT+'/introducao_dia4'+name+'.png')
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.evaluate('()=>{'+FIM+'}'); pg.wait_for_timeout(2500); pg.screenshot(path=OUT+'/fim_do_dia'+name+'.png')
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.click('#btn-how'); pg.wait_for_timeout(300)
        pg.evaluate("()=>{ const l=[...document.querySelectorAll('#tips li')].find(li=>li.textContent.includes('marmita')); if(l) l.scrollIntoView(); }"); pg.wait_for_timeout(200)
        pg.screenshot(path=OUT+'/como_jogar'+name+'.png')
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.evaluate("()=>{"+FECHA+" const g=window.__game, L=window.__lcc; g.save=L.normSave({dia:5,bank:900,equipe:{dani:1,daniTasks:['marmita','lavar']}}); g.up=g.save.up; g.buildTables(); g.goShop(5); L.setShopTab('equipe'); }"); pg.wait_for_timeout(400)
        pg.screenshot(path=OUT+'/lojinha_equipe'+name+'.png', full_page=True)
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
