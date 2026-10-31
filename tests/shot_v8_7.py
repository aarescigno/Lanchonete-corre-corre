# capturas da v8.7 (Modo História) em ../capturas/v8.7: menu, conversa do cap. 1 e a do cap. 3 (com a rubrica), fim do dia com o objetivo, Banco com a reforma, Dani aprendiz e o cartão "Continua"; tela larga e celular deitado
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v8.7'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
VISTA="try{localStorage.setItem('lcc2_abertura','1')}catch(e){}"
LIMPA="document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;"
CAP2="g.save.cap=2; g.save.conversa=null; g.save.dia=3; g.save.equipe.dani=1; g.save.bank=300;"
CENAS=[
 ('menu',"g.setState('menu');"),
 ('conversa1a',"g.save.conversa='antes'; L.falar('antes',()=>{});"),
 ('conversa1b',"g.save.conversa='antes'; L.falar('antes',()=>{}); g.conversa.seguir();"),
 ('conversa2c',CAP2+"g.save.conversa='antes'; L.falar('antes',()=>{}); g.conversa.seguir(); g.conversa.seguir();"),
 ('conversa3rubrica',"g.save.cap=3; g.save.conversa='depois'; g.save.equipe.dani=1; L.falar('depois',()=>{}); g.conversa.seguir();"),
 ('fimdia',"g.save.conversa=null; g.startDay(1); g.begin(); g.schedule=[]; g.nextIdx=0; g.money=220; g.finishDay();"),
 ('banco',"g.save.conversa=null; g.goShop(2); L.setShopGrupo('dinheiro'); L.setShopTab('banco');"),
 ('dani',CAP2+"g.goShop(3); L.setShopGrupo('equipe'); L.setShopTab('dani');"),
 ('continua',"document.getElementById('ov-continua').classList.add('show');"),
]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp,cel in [('_pc',(1220,600),False),('_celular_deitado',(740,360),True)]:
        ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=cel, device_scale_factor=2)
        ctx.add_init_script(VISTA)
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        for f,js in CENAS:
            pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
            pg.evaluate('()=>{'+LIMPA+js+'}'); pg.wait_for_timeout(500)
            pg.screenshot(path=OUT+'/'+f+name+'.png')
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
