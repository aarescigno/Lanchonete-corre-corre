# capturas da v8.3 (campanha e banco) em ../capturas/v8.3: o menu (jogador novo e no dia 9), a aba Banco (sem e com
# empréstimo, no negativo), a introdução no negativo com a parcela, o fim do dia sem a meta e o Caixa com a coluna
# Banco, no PC (1220×600) e no celular deitado (740×360)
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v8.3'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
SAVE="""(o)=>{ const g=window.__game, L=window.__lcc; g.save=L.normSave(Object.assign({torneira:true},o)); g.up=g.save.up; g.boughtFor=0; g.buildTables(); }"""
NOVE={'dia':9,'bank':1840,'treino':True,'estrelas':14,'lucroTot':6120,'up':{'tenis':True,'maquina':True},'equipe':{'tonhao':1,'dani':1}}
NEG={'dia':12,'bank':-185,'neg':2,'treino':True,'estrelas':17,'lucroTot':7400,'emp':{'resto':330,'n':3},'equipe':{'tonhao':1}}
CAIXA="""()=>{ const g=window.__game; for(let i=0;i<4;i++){ g.startDay(g.proxDia); g.begin(); g.schedule=[]; g.nextIdx=0; g.money=[1300,200,900,1100][i]; g.custo=g.money*0.3; if(i===1) g.emprestar(500); g.finishDay(); } }"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp,cel in [('_pc',(1220,600),False),('_celular',(740,360),True)]:
        ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=cel, device_scale_factor=2)
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.screenshot(path=OUT+'/01_menu_novo'+name+'.png')
        pg.evaluate(SAVE,NOVE); pg.evaluate("()=>window.__game.setState('menu')"); pg.wait_for_timeout(150); pg.screenshot(path=OUT+'/02_menu_dia9'+name+'.png')
        pg.evaluate("()=>{ const g=window.__game; g.goShop(g.proxDia); window.__lcc.setShopTab('banco'); }"); pg.wait_for_timeout(150); pg.screenshot(path=OUT+'/03_banco'+name+'.png')
        pg.evaluate(SAVE,NEG); pg.evaluate("()=>{ const g=window.__game; g.goShop(g.proxDia); window.__lcc.setShopTab('banco'); }"); pg.wait_for_timeout(150); pg.screenshot(path=OUT+'/04_banco_negativo'+name+'.png')
        pg.evaluate("()=>window.__game.startDay(window.__game.proxDia)"); pg.wait_for_timeout(150); pg.screenshot(path=OUT+'/05_intro_negativo'+name+'.png')
        pg.evaluate(SAVE,NOVE); pg.evaluate("()=>{ const g=window.__game; g.startDay(9); g.begin(); g.schedule=[]; g.nextIdx=0; g.money=300; g.custo=90; g.finishDay(); }"); pg.wait_for_timeout(150); pg.screenshot(path=OUT+'/06_fim_sem_meta'+name+'.png')
        pg.evaluate(SAVE,NOVE); pg.evaluate(CAIXA); pg.evaluate("()=>{ const g=window.__game; g.goShop(g.proxDia); window.__lcc.setShopTab('caixa'); }"); pg.wait_for_timeout(150); pg.screenshot(path=OUT+'/07_caixa'+name+'.png')
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
