# capturas da v8.4 (avaliações do Gurugol) em ../capturas/v8.4: o HUD sem nota e com nota, o balãozinho da avaliação de um
# grupo que sai, o fim do dia (nota do dia, critérios e comentários) e a aba Caixa, no PC e no celular
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v8.4'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
AV="Array.from({length:n},(_,i)=>[4.5+(i%2)*0.5,4,4+(i%3)*0.3,4.5,4.5])"
DIA="""([n,sai])=>{ document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));
  const g=window.__game, L=window.__lcc; g.save=L.normSave({dia:5,bank:3000,aval:"""+AV+"""}); g.up=g.save.up; g.buildTables();
  g.startDay(5); g.begin(); g.schedule=[{t:1e9,type:'estudante',color:0}]; g.nextIdx=0;
  const gr=g.spawn({type:'familia',color:1,vip:false}); const t=g.tables.find(x=>x.seats===4); g.seatGroup(gr,t);
  for(let i=0;i<30;i++) g.update(0.05);
  if(sai){ gr.state='wantBill'; gr.pratoQ=4.6; gr.perdMesa=1; g.collectBill(gr,t); for(let i=0;i<14;i++) g.update(0.05); }
  g.update=()=>{}; }"""
FIM="""()=>{ const g=window.__game, L=window.__lcc; g.save=L.normSave({dia:6,bank:900,aval:"""+AV.replace('length:n','length:60')+"""}); g.up=g.save.up; g.buildTables();
  g.startDay(6); g.begin();
  for(let k=0;k<9;k++){ const r=[[5,5,4.4,4.5,4],[3.5,4,3.8,4.5,4],[1.3,1,1,4.5,3.5],[5,4.8,5,4.5,4.5]][k%4]; g.avals.push({r,txt:L.avalComentario(r,k%4===2?'fila':'')}); }
  g.money=600; g.stats.served=8; g.stats.lost=1; g.finishDay(); }"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp,cel in [('_pc',(1220,600),False),('_celular_deitado',(740,360),True)]:
        ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=cel, device_scale_factor=2)
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        for n,sai,f in [(8,0,'hud_sem_nota'),(60,0,'hud_com_nota'),(60,1,'balao_avaliacao')]:
            pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
            pg.evaluate(DIA.replace('length:n','length:%d'%n),[n,sai]); pg.wait_for_timeout(300)
            pg.screenshot(path=OUT+'/'+f+name+'.png')
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.evaluate(FIM); pg.wait_for_timeout(500); pg.screenshot(path=OUT+'/fim_do_dia'+name+'.png')
        pg.evaluate("()=>{ const g=window.__game, L=window.__lcc; document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show')); g.goShop(7); L.setShopTab('caixa'); }"); pg.wait_for_timeout(400)
        pg.screenshot(path=OUT+'/caixa'+name+'.png', full_page=True)
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
