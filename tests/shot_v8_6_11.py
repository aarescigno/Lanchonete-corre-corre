# capturas da v8.6.11 (vegetarianos e veganos) em ../capturas/v8.6.11: a aba Cursos com o Vegetariano (sem os cursos de que depende, com eles, e o avançado
# Pratos veganos) e o salão com os pratos sem carne; no PC e no celular deitado
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v8.6.11'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
VISTA="try{localStorage.setItem('lcc2_abertura','1')}catch(e){}"
FECHA="document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));"
LOJA0=FECHA+"""const g=window.__game, L=window.__lcc; g.save=L.normSave({dia:4,bank:900,cursos:{pastel:1}}); g.up=g.save.up; g.goShop(4); L.setShopTab('cursos');"""
LOJA1=FECHA+"""const g=window.__game, L=window.__lcc; g.save=L.normSave({dia:5,bank:900,cursos:{pastel:1,veg:1,assados:1,fritos:1}}); g.up=g.save.up; g.goShop(5); L.setShopTab('cursos');"""
LOJA2=FECHA+"""const g=window.__game, L=window.__lcc; g.save=L.normSave({dia:7,bank:900,cursos:{pastel:1,chapa:1,veg:2,assados:1}}); g.up=g.save.up; g.goShop(7); L.setShopTab('cursos');"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp,cel in [('_pc',(1220,600),False),('_celular_deitado',(740,360),True)]:
        ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=cel, device_scale_factor=2)
        ctx.add_init_script(VISTA)
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        for js,f in [(LOJA0,'cursos_veg_dep'),(LOJA1,'cursos_veg'),(LOJA2,'cursos_veganos')]:
            pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
            pg.evaluate('()=>{'+js+'}'); pg.wait_for_timeout(400)
            pg.screenshot(path=OUT+'/'+f+name+'.png')
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
