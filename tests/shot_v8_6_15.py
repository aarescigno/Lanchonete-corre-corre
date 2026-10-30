# capturas da v8.6.15 (lojinha em 4 grupos com cartões) em ../capturas/v8.6.15: cartões dos 4 grupos, Bia, Tonhão e Divulgação; tela larga e celular deitado (em pé o jogo pede para girar)
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v8.6.15'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
VISTA="try{localStorage.setItem('lcc2_abertura','1')}catch(e){}"
BASE="document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc; g.save=L.normSave({dia:4,bank:900,up:{tenis:true}}); g.up=g.save.up; g.goShop(4);"
CENAS=[('lanchonete',BASE),('equipe',BASE+"L.setShopGrupo('equipe');"),('dinheiro',BASE+"L.setShopGrupo('dinheiro');"),('gurugol',BASE+"L.setShopGrupo('gurugol');"),
       ('bia',BASE+"L.setShopTab('bia');"),('tonhao',BASE+"L.setShopTab('tonhao');"),('divulga',BASE+"L.setShopTab('divulga');")]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp,cel in [('_pc',(1220,600),False),('_celular_deitado',(740,360),True)]:
        ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=cel, device_scale_factor=2)
        ctx.add_init_script(VISTA)
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        for f,js in CENAS:
            pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
            pg.evaluate('()=>{'+js+'}'); pg.wait_for_timeout(300)
            pg.screenshot(path=OUT+'/'+f+name+'.png')
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
