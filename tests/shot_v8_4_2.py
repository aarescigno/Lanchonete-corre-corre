# capturas da v8.4.2 (aba Gurugol da lojinha com os últimos comentários; critérios "Qualidade da comida" e "Diversidade do
# cardápio") em ../capturas/v8.4.2: a aba no PC, no celular deitado e em pé, e o fim do dia com os nomes novos
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v8.4.2'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
DIA="""()=>{ const g=window.__game, L=window.__lcc, d=[0.2,-0.3,0,0.1,0], c=v=>Math.min(5,Math.max(1,v));
  g.save=L.normSave({dia:6,bank:900,aval:Array.from({length:60},(_,i)=>d.map(x=>c(4.3+x+(i%3)*0.1)))}); g.up=g.save.up; g.buildTables();
  g.startDay(6); g.begin();
  const tipos=['familia','estudante','vovos','executiva','entregador'];
  for(let k=0;k<12;k++){ const r=[[5,5,4.4,4.5,4],[3.5,4,3.8,4.5,4],[1.3,1,1,4.5,3.5],[5,4.8,5,4.5,4.5],[4.2,3,2.6,4.5,4]][k%5]; g.avals.push({r,txt:L.avalComentario(r,k%5===2?'fila':''),k:tipos[k%5],v:k===3}); }
  g.money=600; g.stats.served=8; g.stats.lost=1; g.finishDay(); }"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp,cel in [('_pc',(1220,600),False),('_celular_deitado',(740,360),True),('_celular_em_pe',(390,800),True)]:
        ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=cel, device_scale_factor=2)
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.evaluate(DIA); pg.wait_for_timeout(2600)
        if name!='_celular_em_pe': pg.screenshot(path=OUT+'/fim_do_dia'+name+'.png')
        pg.evaluate("()=>{ const g=window.__game, L=window.__lcc; document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show')); g.goShop(7); L.setShopTab('gurugol'); }"); pg.wait_for_timeout(2600)
        pg.screenshot(path=OUT+'/aba_gurugol'+name+'.png')
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
