# capturas da v7.2 (livro-caixa: aba Caixa na lojinha) em ../capturas/v7.2
# a carreira dos dias 1 a 5 é jogada pelo bot (node) e o save vai para a página
from playwright.sync_api import sync_playwright
import pathlib, os, subprocess, json
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v7.2'); os.makedirs(OUT,exist_ok=True)
JOGA=r"""const H=require('./harness.js')(); const {g,L}=H; const bot=require('./bot.js')(g,L);
g.save=L.normSave({}); g.up=g.save.up; g.boughtFor=0; g.buildTables();
const order=['tenis','maquina','pratos','cafeteira'];
for(let n=1;n<=5;n++){
  if(n>=2){ g.goShop(n); const u=order.find(id=>!g.up[id]); if(u) g.buy(u);
    if(n===3){ g.save.equipe=L.normSave({equipe:{tonhao:1,dani:1}}).equipe; g.save.divulga='panfleto'; }
    if(n===5) g.buyChairs(); }
  g.startDay(n); g.begin(); let st=0; while(g.state==='playing'&&st<30000){ bot(); g.update(0.05); st++; }
}
g.goShop(6); g.buyChairs();
console.log(JSON.stringify(g.save));"""
save=subprocess.run(['node','-e',JOGA],cwd=S,capture_output=True,text=True,check=True).stdout.strip().splitlines()[-1]
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
CENA="""(s)=>{ const g=window.__game, L=window.__lcc; g.save=L.normSave(s); g.up=g.save.up; g.boughtFor=6; g.buildTables(); g.goShop(6); L.setShopTab('caixa'); }"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp in [('',{'width':960,'height':600}),('_celular',{'width':740,'height':360})]:
        ctx=b.new_context(viewport=vp, has_touch=bool(name))
        if not name: ctx.grant_permissions(['clipboard-read','clipboard-write'])
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.evaluate(CENA, json.loads(save)); pg.wait_for_timeout(200)
        pg.screenshot(path=OUT+'/01_caixa'+name+'.png')
        pg.click('text=Copiar resumo'); pg.wait_for_timeout(300)
        pg.screenshot(path=OUT+'/02_caixa_copiado'+name+'.png')
        if not name: print('CLIPBOARD:'); print(pg.evaluate('navigator.clipboard.readText()'))
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
