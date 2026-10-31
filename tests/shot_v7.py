# capturas da v7 (contas: lucro, ingredientes, contas do dia e divulgação) em ../capturas/v7
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v7'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
BOT=open(S+'/botpage.js').read()
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp in [('',{'width':960,'height':600}),('_celular',{'width':740,'height':360}),('_celular_em_pe',{'width':390,'height':780})]:
        pg=b.new_page(viewport=vp, has_touch=bool(name))
        pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600); pg.add_script_tag(content=BOT)
        pg.evaluate("const g=window.__game; g.save.maxDay=7; g.save.bank=700; g.save.equipe.tonhao=2; g.save.equipe.dani=2; g.goShop(5);"); pg.wait_for_timeout(150)
        pg.click('#shop-tabs button[data-v=divulga]'); pg.wait_for_timeout(150)
        pg.screenshot(path=OUT+'/01_lojinha_divulgacao'+name+'.png')
        if name: continue
        pg.click('#btn-shop-go'); pg.wait_for_timeout(150); pg.screenshot(path=OUT+'/02_introducao.png')
        pg.click('#btn-start'); pg.wait_for_timeout(150); pg.screenshot(path=OUT+'/03_comeco_no_vermelho.png')
        pg.evaluate("run(60,true)"); pg.wait_for_timeout(150); pg.screenshot(path=OUT+'/04_meio_do_dia.png')
        pg.evaluate("run(400,true)"); pg.wait_for_timeout(300); pg.screenshot(path=OUT+'/05_fim_do_dia.png')
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
