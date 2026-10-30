# capturas da v8.9 (a Dani sobe de nível com trabalho e cursos) em ../capturas/v8.9: cartão da Dani aprendiz, pronta para subir, com curso feito e o fim do dia; tela larga e celular deitado (em pé o jogo pede para girar)
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v8.9'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
VISTA="try{localStorage.setItem('lcc2_abertura','1')}catch(e){}"
BASE="document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc; const T=L.DANI_XP.tarefas;"
def LOJA(sv): return BASE+"g.save=L.normSave(Object.assign({dia:4,bank:900,cap:2,maxDay:4,up:{tenis:true},equipe:{tonhao:1,dani:1}},"+sv+")); g.up=g.save.up; g.goShop(4); L.setShopGrupo('equipe'); L.setShopTab('dani');"
FIM=BASE+"g.save=L.normSave({dia:4,bank:900,cap:2,maxDay:4,up:{tenis:true},daniTar:4*T,equipe:{tonhao:1,dani:1}}); g.up=g.save.up; g.buildTables(); g.goShop(4); g.startDay(4); g.begin(); g.dani.feitas=6; g.schedule=[]; g.nextIdx=0; g.money=300; g.custo=60; g.finishDay();"
CENAS=[('dani_aprendiz',LOJA("{daniTar:2*T}")),('dani_pronta',LOJA("{daniTar:4*T}")),('dani_curso_feito',LOJA("{daniTar:2*T+3,daniCursos:{atend:1},daniCursoDia:4}")),('dani_nivel2',LOJA("{daniTar:5*T,daniCursos:{atend:1},equipe:{tonhao:1,dani:2}}")),('fim_do_dia',FIM)]
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
