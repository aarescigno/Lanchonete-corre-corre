# capturas da v8.2 (Missão zero) em ../capturas/v8.2: o menu com o dia 0 e os pop-ups do passo a passo, do 1º ao
# último, e a tela do fim, no PC (1220×600); no celular deitado (740×360), só o menu, 3 pop-ups e o fim. O treino anda sozinho até cada passo (window.__auto)
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v8.2'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
AUTO="""()=>{ window.__auto=(alvo)=>{ const g=window.__game, L=window.__lcc;
  for (let k=0;k<8000;k++){
    const t=g.treino; if (!t) return; const p=t.passo; if (!p || p.id===alvo) return;
    if (p.ok){ t.seguir(); continue; }
    g.update(0.05); if (t.passo !== p || p.feito(g)) continue;   // só toca se o passo ainda não foi feito
    const grp=t.grupo, m=t.mesa, livre=!g.bia.acts.length;
    if (p.id==='sentar') g.seatGroup(grp,m);
    else if (livre && /^(anotar|servir|cafe2|cobrar|louca)$/.test(p.id)) g.tapTable(m);
    else if (livre && p.id==='cozinha') g.tapStation('order');
    else if (livre && p.id==='prato'){ const i=g.kitchen.plates.findIndex(q=>q&&q.group===grp); if (i>=0) g.tapStation('plates',L.LAYOUT.PLATE_SLOTS[i].x); }
    else if (livre && p.id==='cafe') g.tapStation('coffee');
    else if (livre && (p.id==='pia' || p.id==='lavar')) g.tapStation('sink');
    else if (livre && p.id==='lixo') g.tapStation('trash');
  } }; }"""
PASSOS=['oi','coracoes','cor','sentar','cardapio','anotar','fila','cozinha','prato','cafe','bonus','conta','pia','lixo','fim']
CEL=['cor','cardapio','bonus']
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp,cel in [('_pc',(1220,600),False),('_celular',(740,360),True)]:
        ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=cel, device_scale_factor=2)
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.screenshot(path=OUT+'/00_menu'+name+'.png')
        pg.evaluate(AUTO); pg.click('#btn-play'); pg.wait_for_timeout(200)
        for i,ps in enumerate(PASSOS):
            pg.evaluate("a=>window.__auto(a)",ps); pg.wait_for_timeout(250)
            if not cel or ps in CEL: pg.screenshot(path=OUT+'/%02d_%s%s.png'%(i+1,ps,name))
        pg.evaluate("()=>window.__game.treino.seguir()"); pg.wait_for_timeout(250)
        pg.screenshot(path=OUT+'/99_completa'+name+'.png')
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
