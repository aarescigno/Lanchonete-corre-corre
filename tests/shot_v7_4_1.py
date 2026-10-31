# capturas da v7.4.1 (linha do movimento no editor do salão) em ../capturas/v7.4.1, em 960×600 e 740×360
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v7.4.1'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
# lojinha do dia 4 com o kit virado (1 mesa de 2 vira de 4) e 1 mesa de 4 comprada: 16 lugares, +36% de movimento
LOJA="""()=>{ const g=window.__game, L=window.__lcc; g.save=L.normSave({maxDay:4,bank:900}); g.up=g.save.up; g.buildTables(); g.goShop(4);
  g.virarMesa(0); g.buyMesa(4); g.salaoMsg=''; L.setShopTab('salao'); }"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp in [('',{'width':960,'height':600}),('_celular',{'width':740,'height':360})]:
        ctx=b.new_context(viewport=vp, has_touch=bool(name))
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.evaluate("()=>{ document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show')); }")
        pg.evaluate(LOJA); pg.wait_for_timeout(200)
        pg.screenshot(path=OUT+'/01_editor_movimento'+name+'.png')
        print(name or 'pc', pg.evaluate("()=>[...document.querySelectorAll('.ed-side .ed-contas')].map(e=>e.textContent)"),
              'scroll do painel:', pg.evaluate("()=>{ const p=document.querySelector('#ov-shop .panel'); return [p.scrollHeight,p.clientHeight]; }"))
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
