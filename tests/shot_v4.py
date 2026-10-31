# capturas da v4 (balcão de sucos e bandeja) em ../capturas/v4
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE)
OUT=str(HERE.parent/'capturas'/'v4')
os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
BOT=open(S+'/botpage.js').read()
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe)
    errs=[]
    pg=b.new_page(viewport={'width':960,'height':600})
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('console',lambda m:errs.append(m.text) if m.type=='error' and 'fonts.g' not in m.text and 'ERR_' not in m.text else None)
    pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(700)
    pg.add_script_tag(content=BOT)
    pg.screenshot(path=OUT+'/01_menu.png')
    pg.click('#btn-ver'); pg.wait_for_timeout(150); pg.screenshot(path=OUT+'/02_versoes.png'); pg.click('#btn-ver-close')
    pg.click('#btn-how'); pg.wait_for_timeout(150); pg.screenshot(path=OUT+'/03_como_jogar.png'); pg.click('#btn-how-close')
    pg.evaluate("window.__game.save.maxDay=7; window.__game.save.bank=900; window.__game.startDay(3);"); pg.wait_for_timeout(150)
    pg.screenshot(path=OUT+'/04_intro_dia3.png')
    # mesa pedindo suco, Bia com sucos na bandeja
    pg.evaluate("""const g=window.__game; g.up.bandeja=true; g.begin(); g.schedule=[]; g.nextIdx=0;
      const a=g.spawn({type:'familia',color:3}); g.seatGroup(a,g.tables[4]);
      const c=g.spawn({type:'estudante',color:1}); g.seatGroup(c,g.tables[1]);
      for(let i=0;i<140;i++){ g.groups.forEach(x=>x.patLeft=1e9); g.update(0.05); }
      a.juiceWant=3; c.juiceWant=1; g.tapTable(g.tables[4]); g.tapTable(g.tables[1]);
      for(let i=0;i<120;i++){ g.groups.forEach(x=>x.patLeft=1e9); g.update(0.05); }
      g.tapStation('order',800,150); for(let i=0;i<4;i++) g.tapStation('juice',910,350);
      for(let i=0;i<150;i++){ g.groups.forEach(x=>x.patLeft=1e9); g.update(0.05); }""")
    pg.wait_for_timeout(150); pg.screenshot(path=OUT+'/05_sucos_bandeja.png')
    pg.evaluate("""const g=window.__game; g.tapTable(g.tables[4]); for(let i=0;i<60;i++){ g.groups.forEach(x=>x.patLeft=1e9); g.update(0.05); }""")
    pg.wait_for_timeout(150); pg.screenshot(path=OUT+'/06_sucos_entregues.png')
    pg.evaluate("window.__game.up={}; window.__game.save.up=window.__game.up; window.__game.startDay(6); window.__game.begin(); run(90,true)"); pg.wait_for_timeout(150)
    pg.screenshot(path=OUT+'/07_dia6_jogo.png')
    pg.evaluate("run(400,true)"); pg.wait_for_timeout(300); pg.screenshot(path=OUT+'/08_fim_dia6.png')
    pg.evaluate("const g=window.__game; g.save.bank=900; g.goShop();"); pg.wait_for_timeout(200); pg.screenshot(path=OUT+'/09_lojinha.png')
    print('ERRORS:',errs)
    b.close()
os.remove(S+'/wrapped.html')
