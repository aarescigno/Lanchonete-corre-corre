# capturas da v5 (equipe, louça, lixeira, couvert, água) em ../capturas/v5
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v5'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
BOT=open(S+'/botpage.js').read()
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    pg=b.new_page(viewport={'width':960,'height':600})
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600); pg.add_script_tag(content=BOT)
    pg.evaluate("const g=window.__game; g.save.maxDay=7; g.save.bank=900; g.goShop(6);"); pg.wait_for_timeout(150)
    pg.click('#shop-tabs button[data-v=equipe]'); pg.wait_for_timeout(150)
    pg.click('#shop-grid .item:nth-child(2) button:text-is("Contratar")'); pg.click('#shop-grid .item:nth-child(1) button:text-is("Aumento")'); pg.click('#shop-grid .item:nth-child(1) button:text-is("Aumento")'); pg.click('text=Contratar: R$ 80/dia'); pg.wait_for_timeout(150)
    pg.screenshot(path=OUT+'/01_lojinha_equipe.png')
    pg.click('#shop-tabs button[data-v=melhorias]'); pg.wait_for_timeout(100); pg.screenshot(path=OUT+'/02_lojinha_melhorias.png')
    pg.evaluate("const g=window.__game; g.up.agua=true; g.save.equipe.couvert=true; g.save.equipe.taxa=true;")
    pg.click('#btn-shop-go'); pg.wait_for_timeout(150); pg.screenshot(path=OUT+'/03_intro_folha.png')
    pg.click('#btn-start'); pg.evaluate("run(70,true)"); pg.wait_for_timeout(150); pg.screenshot(path=OUT+'/04_salao_equipe.png')
    pg.evaluate("const g=window.__game; g.trash=8; g.kitchen.clean=0; g.kitchen.queue.push({group:g.groups[0]||null,table:1,time:0.05,p:0,dish:'pf'}); for(let i=0;i<20;i++) g.update(0.05);")
    pg.wait_for_timeout(100); pg.screenshot(path=OUT+'/05_lixo_cheio_sem_prato.png')
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
