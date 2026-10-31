# capturas da v6 (salão: cadeiras, mesas e lugares por mesa) em ../capturas/v6
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v6'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
BOT=open(S+'/botpage.js').read()
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp in [('',{'width':960,'height':600}),('_celular',{'width':740,'height':360}),('_celular_pequeno',{'width':568,'height':320})]:
        pg=b.new_page(viewport=vp, has_touch=bool(name))
        pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600); pg.add_script_tag(content=BOT)
        pg.evaluate("const g=window.__game; g.save.maxDay=7; g.save.bank=900; g.goShop(5);"); pg.wait_for_timeout(150)
        pg.click('#shop-tabs button[data-v=salao]'); pg.wait_for_timeout(150)
        pg.click('text=Comprar 2 cadeiras'); pg.click('text=Comprar mesa'); pg.wait_for_timeout(100)
        pg.click('#shop-grid .prow:nth-of-type(2) .pcell:nth-child(1) button:text-is("4")'); pg.wait_for_timeout(100)
        pg.click('#shop-grid .prow:nth-of-type(2) .pcell:nth-child(2) button:text-is("4")'); pg.wait_for_timeout(100)
        pg.screenshot(path=OUT+'/01_lojinha_salao'+name+'.png')
        if name: continue
        pg.evaluate("const g=window.__game; g.save.salao.seats[6]=2; g.save.salao.seats[5]=2; g.save.salao.seats[4]=4; g.save.salao.seats[1]=2; g.save.salao.seats[3]=4; g.save.bank+=300; g.buyTable(); g.resetDay(5)")
        pg.click('#btn-shop-go'); pg.wait_for_timeout(150)
        pg.click('#btn-start'); pg.evaluate("run(80,true)"); pg.wait_for_timeout(150); pg.screenshot(path=OUT+'/02_salao_8_mesas.png')
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
