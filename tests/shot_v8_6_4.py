# capturas da v8.6.4 (notas do Gurugol com teto por ponto: 3 ★ na Garagem) em ../capturas/v8.6.4: o fim do dia com a
# caixa do Gurugol, a aba Gurugol da lojinha (PC e celular em pé) e o HUD com a nota
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v8.6.4'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
DIA="""()=>{ const g=window.__game, L=window.__lcc, d=[0.1,-0.2,-0.1,0,0.1], c=v=>Math.min(3.8,Math.max(1,v));
  g.save=L.normSave({dia:6,bank:900,avalEsc:2,aval:Array.from({length:60},(_,i)=>d.map(x=>c(2.7+x+(i%3)*0.1)))}); g.up=g.save.up; g.buildTables();
  g.startDay(6); g.begin();
  const tipos=['familia','estudante','vovos','executiva','entregador'];
  for(let k=0;k<4;k++){ const s=[[5,5,4.4,4.5,4],[3.5,4,3.8,4.5,4],[5,4.8,5,4.5,4.5],[4.2,3,2.6,4.5,4]][k], h=[0,-0.2,0.9,0.1][k];
    g.avals.push({s,r:s.map(v=>Math.round((L.avalEscala(v,3)+h)*10)/10),txt:L.avalComentario(s,'',false,1),k:tipos[k],v:k===2}); }
  for(let i=0;i<40;i++) g.update(0.05);
  window.__hud=1; }"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp,cel in [('_pc',(1220,600),False),('_celular_em_pe',(390,800),True)]:
        ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=cel, device_scale_factor=2)
        ctx.add_init_script("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}")
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.evaluate(DIA); pg.wait_for_timeout(400)
        if name=='_pc': pg.screenshot(path=OUT+'/hud'+name+'.png')
        pg.evaluate("()=>{ const g=window.__game; g.money=600; g.stats.served=8; g.finishDay(); }"); pg.wait_for_timeout(2800)
        if name=='_pc': pg.screenshot(path=OUT+'/fim_do_dia'+name+'.png')
        pg.evaluate("()=>{ const g=window.__game, L=window.__lcc; document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show')); g.goShop(7); L.setShopTab('gurugol'); }"); pg.wait_for_timeout(2600)
        pg.screenshot(path=OUT+'/aba_gurugol'+name+'.png')
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
