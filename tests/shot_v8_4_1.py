# capturas da v8.4.1 (caixa animada do Gurugol no fim do dia) em ../capturas/v8.4.1: a caixa no meio da animação e pronta
# nas 4 faixas da nota (pura, prata, ouro e diamante), no PC e no celular deitado
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v8.4.1'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
FIM="""(t)=>{ const g=window.__game, L=window.__lcc, d=[0.2,-0.3,0,0.1,0], c=v=>Math.min(5,Math.max(1,v));
  g.save=L.normSave({dia:6,bank:900,aval:Array.from({length:60},()=>d.map(x=>c(t+x)))}); g.up=g.save.up; g.buildTables();
  g.startDay(6); g.begin();
  for(let k=0;k<9;k++){ const r=d.map((x,i)=>c(t+(i===k%5?-0.4:0.1))); g.avals.push({r,txt:L.avalComentario(r)}); }
  g.money=600; g.stats.served=8; g.stats.lost=1; g.finishDay(); }"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp,cel in [('_pc',(1220,600),False),('_celular_deitado',(740,360),True)]:
        ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=cel, device_scale_factor=2)
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        for t,f in [(3.6,'pura'),(4.3,'prata'),(4.75,'ouro'),(4.95,'diamante')]:
            pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
            pg.evaluate(FIM,t)
            if f=='diamante': pg.wait_for_timeout(700); pg.screenshot(path=OUT+'/animando'+name+'.png')
            pg.wait_for_timeout(2600); pg.screenshot(path=OUT+'/fim_'+f+name+'.png')
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
