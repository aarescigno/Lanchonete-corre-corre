# capturas da v3 (clientes VIP) em ../capturas/v3
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE)
OUT=str(HERE.parent/'capturas'/'v3')
os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
BOT=open(S+'/botpage.js').read()
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM','/opt/pw-browsers/chromium') if os.path.exists('/opt/pw-browsers/chromium') else None)
    errs=[]
    ctx=b.new_context(viewport={'width':960,'height':600})
    pg=ctx.new_page()
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('console',lambda m:errs.append(m.text) if m.type=='error' and 'fonts.g' not in m.text and 'ERR_' not in m.text else None)
    pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(700)
    pg.add_script_tag(content=BOT)
    pg.click('#btn-ver'); pg.wait_for_timeout(150); pg.screenshot(path=OUT+'/01_versoes.png'); pg.click('#btn-ver-close')
    pg.click('#btn-how'); pg.wait_for_timeout(150); pg.screenshot(path=OUT+'/02_como_jogar.png', full_page=True)
    pg.evaluate("window.__game.save.maxDay=7; window.__game.startDay(5);"); pg.wait_for_timeout(150)
    pg.screenshot(path=OUT+'/03_intro_dia5.png')
    # fila com VIPs na frente e um VIP sentado
    pg.evaluate("""const g=window.__game; g.begin(); g.schedule=[]; g.nextIdx=0;
      g.spawn({type:'estudante',color:0}); g.spawn({type:'vovos',color:1});
      const s=g.spawn({type:'familia',color:3,vip:true}); g.seatGroup(s,g.tables.find(t=>t.free&&t.seats>=s.size));
      for(let i=0;i<60;i++) g.update(0.05);
      g.spawn({type:'executiva',color:2,vip:true});
      for(let i=0;i<30;i++){ g.queue.forEach(x=>x.patLeft=1e9); g.update(0.05); }""")
    pg.wait_for_timeout(150); pg.screenshot(path=OUT+'/04_vip_fila_mesa.png')
    pg.evaluate("window.__game.startDay(6); window.__game.begin(); run(80,true)"); pg.wait_for_timeout(150)
    pg.screenshot(path=OUT+'/05_dia6_jogo.png')
    pg.evaluate("run(400,true)"); pg.wait_for_timeout(300)
    pg.screenshot(path=OUT+'/06_fim_dia6.png')
    print('ERRORS:',errs)
    b.close()
