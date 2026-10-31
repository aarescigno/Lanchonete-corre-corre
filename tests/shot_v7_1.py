# capturas da v7.1 (jogo justo: fila que espera mesa, ícone "aguardando mesa") em ../capturas/v7.1
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v7.1'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
BOT=open(S+'/botpage.js').read()
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
# salão cheio (todas as mesas com grupo) e 3 grupos na fila: família sem mesa de 4, estudante no piso de 1 coração e VIP
CENA="""const g=window.__game; g.save.maxDay=7; g.save.bank=900; g.startDay(5); g.begin();
g.nextIdx=g.schedule.length;
g.tables.filter(t=>t.open).forEach(t=>{ const x=g.spawn({type:t.seats>2?'familia':'estudante',color:t.color}); g.seatGroup(x,t); x.path=[]; x.x=t.cx; x.y=t.cy+30; x.setState('eating'); x.timer=99; });
const f=g.spawn({type:'familia',color:1}); const e=g.spawn({type:'estudante',color:2}); e.hearts=1; e.patLeft=e.patPer()*0.6;
const v=g.spawn({type:'executiva',color:3,vip:true}); v.hearts=3;
run(3,false);"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp in [('',{'width':960,'height':600}),('_celular',{'width':740,'height':360})]:
        pg=b.new_page(viewport=vp, has_touch=bool(name))
        pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600); pg.add_script_tag(content=BOT)
        pg.evaluate(CENA); pg.wait_for_timeout(200)
        pg.screenshot(path=OUT+'/01_fila_aguardando_mesa'+name+'.png')
        if name: continue
        pg.evaluate("const g=window.__game; g.timeUpLeave(g.tables[4].group); run(0.5,false);"); pg.wait_for_timeout(200)
        pg.screenshot(path=OUT+'/02_mesa_livre_fila_normal.png')
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
