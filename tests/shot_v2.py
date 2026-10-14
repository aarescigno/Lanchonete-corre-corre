import sys
from playwright.sync_api import sync_playwright
import pathlib
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE)
OUT=str(HERE.parent/'capturas'/'v2')
import os; os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
open(S+'/wrapped.html','w').write(html)
BOT=open(S+'/botpage.js').read()
STUB=open(S+'/stubpage.js').read()
with sync_playwright() as p:
    b=p.chromium.launch()
    errs=[]
    def newpage(stub=False, vp=(960,600)):
        ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]})
        if stub: ctx.add_init_script(STUB)
        pg=ctx.new_page()
        pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.on('console',lambda m:errs.append(m.text) if m.type=='error' and 'fonts.g' not in m.text and 'ERR_' not in m.text else None)
        pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(700)
        pg.add_script_tag(content=BOT)
        return pg
    pg=newpage()
    pg.screenshot(path=OUT+'/01_menu.png')
    pg.click('#btn-ver'); pg.wait_for_timeout(150); pg.screenshot(path=OUT+'/02_versoes.png'); pg.click('#btn-ver-close')
    pg.click('#btn-play'); pg.click('#btn-start'); pg.wait_for_timeout(100)
    pg.evaluate('window.__game.startDay(4); window.__game.begin(); run(70,true)'); pg.wait_for_timeout(150)
    pg.screenshot(path=OUT+'/03_jogo_comandas.png')
    pg.evaluate('run(12,true)'); pg.wait_for_timeout(100); pg.screenshot(path=OUT+'/03b_jogo_comandas.png')
    # fila lotada
    pg.evaluate("window.__game.startDay(3); window.__game.begin(); const g=window.__game; for(let i=0;i<1400&&g.queue.length<4;i++){g.queue.forEach(x=>x.patLeft=1e9); g.update(0.05);} g.queue.forEach((x,i)=>{x.patLeft=1e9; x.hearts=[5,3,1,4][i]||5;}); g.schedule[g.nextIdx].t=g.elapsed; g.update(0.05); g.update(0.3);"); pg.wait_for_timeout(100)
    pg.screenshot(path=OUT+'/04_fila_lotada.png')
    # turno sem fim
    pg.evaluate('window.__game.startEndless(); window.__game.begin(); run(75,true)'); pg.wait_for_timeout(150)
    pg.screenshot(path=OUT+'/05_sem_fim.png')
    pg.evaluate("const g=window.__game; g.stars=1; g.queue.forEach(x=>{x.hearts=1;x.patLeft=0.01}); g.update(0.1); run(4,false)"); pg.wait_for_timeout(300)
    pg.screenshot(path=OUT+'/06_fim_semfim.png')
    # salvar no ranking (local)
    pg.fill('#nm-semfim','Dona Maria'); pg.click('#ov-endless button[type=submit]'); pg.wait_for_timeout(300)
    pg.screenshot(path=OUT+'/06b_fim_salvo.png')
    # ranking local com dados
    pg.evaluate("""(async()=>{const R=window.__lcc.Rank; const d=[['Arthur',1840,5],['Letícia',2210,6],['Theo',640,2],['Bia',3050,7],['Zé do Pastel',1200,4]]; for(const x of d) await R.saveScore('carreira',x[0],x[1],{dia:x[2]}); const e=[['Arthur',1202,143],['Letícia',1530,171],['Bia',990,88]]; for(const x of e) await R.saveScore('semfim',x[0],x[1],{tempo:x[2]});})()"""); pg.wait_for_timeout(200)
    pg.click('#btn-endless-menu'); pg.wait_for_timeout(100); pg.click('#btn-rank'); pg.wait_for_timeout(3000)
    pg.screenshot(path=OUT+'/07_ranking_local.png')
    pg.click('#rank-by button[data-v=nome]'); pg.click('#rank-dir button[data-v=asc]'); pg.wait_for_timeout(100); pg.screenshot(path=OUT+'/07b_ranking_nome_asc.png')
    pg.click('#rank-tabs button[data-v=semfim]'); pg.wait_for_timeout(200); pg.screenshot(path=OUT+'/07c_ranking_semfim.png')
    # carreira: tela fim de dia com form
    pg.click('#btn-rank-back'); pg.evaluate("const g=window.__game; g.startDay(1); g.begin(); run(200,true);"); pg.wait_for_timeout(300)
    pg.screenshot(path=OUT+'/08_fim_dia_form.png')
    pg.close()
    # ranking compartilhado (stub)
    pg=newpage(stub=True)
    pg.click('#btn-rank'); pg.wait_for_timeout(800)
    pg.screenshot(path=OUT+'/09_ranking_compartilhado.png')
    pg.close()
    # celular deitado / retrato
    pg=newpage(vp=(740,360)); pg.click('#btn-play'); pg.click('#btn-start'); pg.evaluate('window.__game.startDay(4); window.__game.begin(); run(60,true)'); pg.wait_for_timeout(150); pg.screenshot(path=OUT+'/10_celular_deitado.png')
    pg.click('#btn-rank') if False else None
    pg.close()
    print('ERRORS:',errs)
    b.close()
