# capturas da v8.3.10 (triturador de lixo e lixeira que muda de cor) em ../capturas/v8.3.10: a lixeira vazia, pela metade,
# quase cheia e cheia (com o saco preto e a fumaça verde), com e sem o triturador, e o cartão do Triturador na lojinha
from playwright.sync_api import sync_playwright
import pathlib, os, sys
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v8.3.10'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
CENA="""([lv,tri])=>{ document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));
  const g=window.__game, L=window.__lcc; g.save=L.normSave({maxDay:7,bank:3000,up:tri?{triturador:true}:{}}); g.up=g.save.up; g.buildTables();
  g.startDay(3); g.begin(); g.schedule=[{t:1e9,type:'estudante',color:0}]; g.nextIdx=0;
  for(let i=0;i<20;i++) g.update(0.05);
  g.trash=lv; g.trituraT=12; g.update=()=>{}; }"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    ctx=b.new_context(viewport={'width':1220,'height':600}, device_scale_factor=2)
    pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
    for lv,tri in [(0,0),(3,0),(5,0),(6,0),(3,1),(6,1)]:
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.evaluate(CENA,[lv,tri]); pg.wait_for_timeout(300)
        pg.screenshot(path=OUT+'/lixeira_%d%s.png'%(lv,'_triturador' if tri else ''))
    ctx.close()
    for name,vp,cel in [('_pc',(1220,600),False),('_celular_deitado',(740,360),True),('_celular_em_pe',(390,800),True)]:
        ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=cel, device_scale_factor=2)
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.evaluate("""()=>{ const g=window.__game, L=window.__lcc; g.save=L.normSave({maxDay:3,bank:3000}); g.up=g.save.up; g.goShop(3); L.setShopTab('melhorias'); }"""); pg.wait_for_timeout(400)
        pg.screenshot(path=OUT+'/lojinha'+name+'.png')
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
