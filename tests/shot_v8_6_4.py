# capturas da v8.6.4 (decoração da Garagem) em ../capturas/v8.6.4: o dia sem enfeite nenhum e com tudo (plantas,
# cantinho da Rosa e toalhas), recortes da parede e da mesa com toalha, a aba Decoração e o editor do salão com a
# toalha no balãozinho; no PC e no celular deitado
from playwright.sync_api import sync_playwright
from PIL import Image
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v8.6.4'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
VISTA="try{localStorage.setItem('lcc2_abertura','1')}catch(e){}"
FECHA="document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));"
TUDO="{espada:1,lata:1,samambaia:1,foto:1,giz:1,placa:1}"
def dia(decor, toalha):
    return FECHA+"""const g=window.__game, L=window.__lcc; g.save=L.normSave({dia:5,bank:900,up:{maquina:true},equipe:{tv:1,som:1},decor:"""+decor+"""}); g.up=g.save.up;
  if("""+toalha+""") g.save.salao.mesas.forEach(m=>{ m.t=1; }); g.buildTables();
  g.startDay(5); g.begin(); g.schedule=[]; g.nextIdx=0; g.spawn({type:'familia',color:1}); for(let i=0;i<10;i++) g.update(0.05); g.update=()=>{};"""
LOJA=FECHA+"""const g=window.__game, L=window.__lcc; g.save=L.normSave({dia:5,bank:900,decor:{espada:1,samambaia:1,foto:0}}); g.up=g.save.up; g.save.salao.mesas[0].t=1; g.buildTables(); g.goShop(5); L.setShopTab('decor');"""
ED=FECHA+"""const g=window.__game, L=window.__lcc; g.save=L.normSave({dia:5,bank:900,decor:"""+TUDO+"""}); g.up=g.save.up; g.save.salao.mesas[0].t=1; g.buildTables(); g.goShop(5); g.salaoSel=1; L.setShopTab('salao');"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp,cel in [('_pc',(1220,600),False),('_celular_deitado',(740,360),True)]:
        ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=cel, device_scale_factor=2)
        ctx.add_init_script(VISTA)
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        for js,f in [(dia('{}','false'),'dia_sem_enfeites'),(dia(TUDO,'true'),'dia_com_tudo'),(LOJA,'lojinha_decoracao'),(ED,'editor_toalha')]:
            pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
            pg.evaluate('()=>{'+js+'}'); pg.wait_for_timeout(400)
            pg.screenshot(path=OUT+'/'+f+name+'.png')
        ctx.close()
    print('ERRORS:',errs); b.close()
im=Image.open(OUT+'/dia_com_tudo_pc.png')
im.crop((520,0,1120,330)).save(OUT+'/recorte_parede.png')
im.crop((1030,320,1250,560)).resize((440,480)).save(OUT+'/recorte_toalha.png')
os.remove(S+'/wrapped.html')
