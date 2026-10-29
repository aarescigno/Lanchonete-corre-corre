# capturas da v8.6.10 (os desenhos dos pratos) em ../capturas/v8.6.10: a grade com todos os pratos (comum e avançado) nas escalas do prato da mesa (0,52),
# do balão (0,85) e do balcão (1,1), na marmita, as 4 proteínas do PF, e a aba Cursos
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v8.6.10'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
VISTA="try{localStorage.setItem('lcc2_abertura','1')}catch(e){}"
FECHA="document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));"
GRADE=FECHA+"""
const L=window.__lcc, ks=Object.keys(L.CARDAPIO);
const cv=document.createElement('canvas'); cv.width=980; cv.height=640; cv.style.cssText='position:fixed;left:0;top:0;z-index:99999;background:#FFF6DA';
document.body.appendChild(cv); const c=cv.getContext('2d'); c.fillStyle='#FFF6DA'; c.fillRect(0,0,980,640);
c.font='11px sans-serif'; c.fillStyle='#222';
ks.forEach((k,i)=>{
  const x=38+(i%7)*136, y=44+Math.floor(i/7)*118;
  c.fillStyle='#222'; c.fillText(L.CARDAPIO[k].nome,x-30,y-30);
  [false,true].forEach((av,j)=>{ L.drawDish(c,k,x+j*58-8,y+4,1.55,false,'bife',av); });
  [0.52,0.85].forEach((s,j)=>{ L.drawDish(c,k,x-10+j*40,y+46,s,false,'bife',false); });
  L.drawDish(c,k,x+70,y+46,0.85,false,'bife',true);
});
const y=44+2*118+10; c.fillStyle='#222'; c.fillText('PF: bife, frango, peixe, a cavalo (avançado); marmita comum e avançada',8,y+8);
L.CARNES.forEach((cn,i)=>L.drawDish(c,'pf',60+i*70,y+50,1.7,false,cn,true));
L.drawMarmita(c,'pf',400,y+50,2.0); L.drawMarmita(c,'coxinha',470,y+50,2.0);
"""
CURSOS=FECHA+"""const g=window.__game, L=window.__lcc; g.save=L.normSave({dia:6,bank:900,cursos:{pastel:2,fritos:1,chapa:1,assados:1}}); g.up=g.save.up; g.goShop(6); L.setShopTab('cursos');"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    ctx=b.new_context(viewport={'width':1220,'height':700}, device_scale_factor=2)
    ctx.add_init_script(VISTA)
    pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
    pg.evaluate('()=>{'+GRADE+'}'); pg.wait_for_timeout(300)
    pg.screenshot(path=OUT+'/grade.png',clip={'x':0,'y':0,'width':980,'height':640})
    pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
    pg.evaluate('()=>{'+CURSOS+'}'); pg.wait_for_timeout(400)
    pg.screenshot(path=OUT+'/cursos.png')
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
