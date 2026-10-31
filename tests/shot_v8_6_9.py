# capturas da v8.6.9 (o cardápio cresce) em ../capturas/v8.6.9: a aba Cursos (nada comprado, um curso do dia comprado e travando os outros,
# avançado à vista), o aviso do menu para quem tinha campanha; no PC e no celular deitado
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v8.6.9'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
VISTA="try{localStorage.setItem('lcc2_abertura','1')}catch(e){}"
FECHA="document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));"
LOJA0=FECHA+"""const g=window.__game, L=window.__lcc; g.save=L.normSave({dia:4,bank:900}); g.up=g.save.up; g.goShop(4); L.setShopTab('cursos');"""
LOJA1=FECHA+"""const g=window.__game, L=window.__lcc; g.save=L.normSave({dia:4,bank:900,cursos:{pastel:1,fritos:1}}); g.up=g.save.up; g.goShop(4); g.buyCurso('chapa'); L.setShopTab('cursos');"""
LOJA2=FECHA+"""const g=window.__game, L=window.__lcc; g.save=L.normSave({dia:6,bank:900,cursos:{pastel:2,fritos:1,chapa:1,assados:1}}); g.up=g.save.up; g.goShop(6); L.setShopTab('cursos');"""
MENU=FECHA+"""const g=window.__game; g.save.avisoCard=true; g.setState('menu');"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp,cel in [('_pc',(1220,600),False),('_celular_deitado',(740,360),True)]:
        ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=cel, device_scale_factor=2)
        ctx.add_init_script(VISTA)
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        for js,f in [(LOJA0,'cursos_inicio'),(LOJA1,'cursos_um_comprado'),(LOJA2,'cursos_avancado'),(MENU,'menu_aviso')]:
            pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
            pg.evaluate('()=>{'+js+'}'); pg.wait_for_timeout(400)
            pg.screenshot(path=OUT+'/'+f+name+'.png')
            if f=='menu_aviso':
                r=pg.evaluate("()=>{const p=document.querySelector('.menu-panel');return [p.scrollHeight,p.clientHeight]}"); print(name,'menu com aviso: altura',r)
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
