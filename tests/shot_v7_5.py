# capturas da v7.5 (calçada: espera lá fora, máquina de suco, tela que rola e abinhas) em ../capturas/v7.5, em
# 960×600 e 740×360 (com toque). A rolagem é feita com o mouse ou o dedo de verdade, arrastando o fundo
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v7.5'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
# dia 5 com a máquina e a bandeja: 4 grupos esperando lá fora (todas as mesas ocupadas), pedidos no tablet
DIA="""()=>{ document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));
  const g=window.__game, L=window.__lcc; g.save=L.normSave({maxDay:7,bank:3000,up:{maquina:true,bandeja:true}}); g.up=g.save.up; g.buildTables();
  g.startDay(5); g.begin(); g.schedule=[]; g.nextIdx=0;
  g.tables.forEach((t,i)=>{ const s=g.spawn({type:t.seats>2?'familia':'estudante',color:i%4}); g.seatGroup(s,t); });
  for(let i=0;i<80;i++) g.update(0.05);
  ['vovos','estudante','familia','executiva'].forEach((type,i)=>g.spawn({type,color:i%4,vip:i===1}));
  for(let i=0;i<130;i++){ g.groups.forEach(x=>x.patLeft=Math.max(x.patLeft,3)); g.update(0.05); }
  g.queue[3].hearts=1; g.tapStation('maquina'); }"""
def canvas(pg):
    return pg.locator('#c').bounding_box()
def tela(pg,x,y):
    b=canvas(pg); return b['x']+x*b['width']/960, b['y']+y*b['height']/600
def arrasta(pg,cel,x0,y,x1):
    # arrasta o fundo de x0 a x1 (na tela lógica), em passos
    if cel:
        pg.evaluate("""([a,b,y])=>{ const c=document.getElementById('c'), r=c.getBoundingClientRect(), k=r.width/960;
          const ev=(t,x)=>c.dispatchEvent(new PointerEvent(t,{pointerId:7,pointerType:'touch',clientX:r.left+x*k,clientY:r.top+y*k,bubbles:true}));
          ev('pointerdown',a); for(let i=1;i<=8;i++) ev('pointermove',a+(b-a)*i/8); ev('pointerup',b); }""",[x0,x1,y])
    else:
        X0,Y=tela(pg,x0,y); X1,_=tela(pg,x1,y)
        pg.mouse.move(X0,Y); pg.mouse.down(); pg.mouse.move(X1,Y,steps=8); pg.mouse.up()
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp in [('',{'width':960,'height':600}),('_celular',{'width':740,'height':360})]:
        cel=bool(name)
        ctx=b.new_context(viewport=vp, has_touch=cel)
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
        pg.evaluate(DIA); pg.wait_for_timeout(150)
        st=lambda: pg.evaluate("()=>{const g=window.__game; return {cam:Math.round(g.cam), fila:g.queue.length, maq:g.maq.length, acts:g.bia.acts.map(a=>a.type+(a.leg||'')), alerta:g.abaAlerta()}}")
        pg.screenshot(path=OUT+'/01_calcada'+name+'.png'); print(name or 'pc','calçada',st())
        toca=lambda x,y: (pg.touchscreen.tap(*tela(pg,x,y)) if cel else pg.mouse.click(*tela(pg,x,y)))
        # abinha do salão: a tela vai até a cozinha; a da calçada pisca (alguém lá fora com 1 coração)
        toca(900,42); pg.wait_for_timeout(500)
        pg.screenshot(path=OUT+'/02_salao_abinha'+name+'.png'); print(name or 'pc','abinha do salão',st())
        # arrasta o fundo (o chão abaixo das mesas) até o meio do caminho
        arrasta(pg,cel,300,525,430); pg.wait_for_timeout(150)
        pg.screenshot(path=OUT+'/03_meio'+name+'.png'); print(name or 'pc','arrastou o fundo',st())
        # abinha da calçada de volta e a Bia levando o suco a quem espera
        toca(60,42); pg.wait_for_timeout(500); print(name or 'pc','abinha da calçada',st())
        pg.evaluate("()=>{ const g=window.__game; let i=0; while(i++<400 && !(g.bia.acts[0] && g.bia.acts[0].leg===2 && g.bia.x<-20)){ g.groups.forEach(x=>x.patLeft=Math.max(x.patLeft,3)); g.update(0.05); } }")
        pg.wait_for_timeout(100); pg.screenshot(path=OUT+'/04_entrega'+name+'.png'); print(name or 'pc','entrega',st())
        # lojinha: a máquina no lugar da água
        pg.evaluate("()=>{ const g=window.__game, L=window.__lcc; g.save=L.normSave({maxDay:4,bank:900,up:{agua:true}}); g.up=g.save.up; g.buildTables(); g.goShop(4); L.setShopTab('melhorias'); }")
        pg.wait_for_timeout(200); pg.screenshot(path=OUT+'/05_lojinha'+name+'.png')
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
