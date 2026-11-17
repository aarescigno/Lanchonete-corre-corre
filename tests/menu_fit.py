# Confere, em vários tamanhos de tela (do desktop ao celular deitado), que:
#  CA4: o painel do menu principal não rola;
#  CA1: a lojinha (em cada grupo e em cada seção) tem o painel parado, as abas e o botão de começar o dia à vista, e só o #shop-grid rola;
#  v11.15: os botões Voltar e Pular da abertura (#ov-abertura) ficam à vista, com 44 px de altura ou mais, sem se cobrir (python3 menu_fit.py abertura);
#  CA2: os painéis Ranking, Instalar no celular, fim do Turno sem fim, falência, abertura do dia, pausa e fim da Missão zero cabem inteiros;
#  CA3: o painel Versões não rola (a lista rola por dentro) e o Fechar está à vista.
from playwright.sync_api import sync_playwright
import pathlib, os, sys
HERE=pathlib.Path(__file__).resolve().parent
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()+'</body></html>'
W=str(HERE/'wrapped.html'); open(W,'w').write(html)
VPS=[(1920,1080),(1366,768),(1280,720),(960,600),(1024,768),(800,600),(640,400),(932,430),(915,412),(844,390),(812,375),(740,360),(667,375),(568,320)]
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
SOLO=sys.argv[1] if len(sys.argv)>1 else ''   # filtro opcional: menu, loja, paineis, versoes, abertura

UP="{tenis:true,fogaoInd:true,assento:'poltrona',pratos:1,ventilador:true}"
FIM=("g.save=L.normSave({dia:60,bank:90000,cap:14,histV:1,capV:2,maxDay:60,v10:1,convEnt:1,convCard:1,convDiv:1,convPlanta:1,convSocorro:1,up:"+UP+",equipe:{tonhao:3,dani:3,joca:3,cami:4,camiModo:'tudo',anselmo:3,lia:1,musica:1},camiCursos:{agil:1,mesa:1,salao:1},jocaCursos:{espresso:1,cafesEsp:1},anselmoCursos:{classica:1,autor:1},daniCursos:{confCaseira:1,confGourmet:1,confAlta:1},cursos:{restaurante:1},libera:{confeitaria:2,joca:2,cami:2,anselmo:2,lia:2},salao:{ponto:'terraco'}});"
     "g.up=g.save.up;g.tablesKey='';g.buildTables();")
DIA2="g.save=L.normSave({dia:2,bank:300,maxDay:2});g.up=g.save.up;g.tablesKey='';g.buildTables();"
LIMPA="document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game,L=window.__lcc;"

# o que mede cada painel: [seletor do painel, [seletores dos botões que têm de estar à vista]]
MEDE="""(a)=>{const [ps,bs]=a;const p=document.querySelector(ps);if(!p)return {erro:'sem painel '+ps};
 const r=p.getBoundingClientRect(),vw=innerWidth,vh=innerHeight,out=[];
 const dentro=(e)=>{const q=e.getBoundingClientRect();return q.width>0&&q.height>0&&q.left>=-1&&q.top>=-1&&q.right<=vw+1&&q.bottom<=vh+1&&q.bottom<=r.bottom+1&&q.top>=r.top-1};
 bs.forEach(s=>{const e=document.querySelector(s);if(!e||!dentro(e))out.push(s)});
 return {sh:p.scrollHeight,ch:p.clientHeight,sw:p.scrollWidth,cw:p.clientWidth,fora:out,pb:r.bottom,pt:r.top,vh:vh}}"""

fails=0; total=0
def conf(pg,rotulo,ps,bs,extra=None):
    global fails,total
    total+=1
    r=pg.evaluate(MEDE,[ps,bs])
    if 'erro' in r:
        fails+=1; print('FAIL: '+rotulo+' '+r['erro']); return
    bad=r['sh']>r['ch']+1 or r['sw']>r['cw']+1 or r['fora'] or r['pb']>r['vh']+1 or r['pt']<-1
    if extra: bad=bad or not extra(r)
    fails+=bool(bad)
    if bad or os.environ.get('V'): print(('FAIL' if bad else 'ok  ')+f': {rotulo} altura {r["sh"]}/{r["ch"]} largura {r["sw"]}/{r["cw"]} fora={r["fora"]}')
def run(pg,js,limpa=True):
    e=pg.evaluate("()=>{try{"+(LIMPA if limpa else "const g=window.__game,L=window.__lcc;")+js+"}catch(e){return String(e.stack)}}")
    if e: print('ERRO no preparo:',e[:300]); raise SystemExit(2)
    pg.wait_for_timeout(60)

with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe)
    for w,h in VPS:
        pg=b.new_page(viewport={'width':w,'height':h}); pg.add_init_script("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}"); pg.goto('file://'+W); pg.wait_for_timeout(300)
        tag=f'{w}x{h}'
        # ---- CA4: o menu principal ----
        if SOLO in ('','menu'):
            r=pg.evaluate("()=>{const p=document.querySelector('.menu-panel');return [p.scrollHeight,p.clientHeight,p.scrollWidth,p.clientWidth]}")
            bad=r[0]>r[1]+1 or r[2]>r[3]+1; fails+=bad; total+=1
            print(('FAIL' if bad else 'ok  ')+f': {tag} menu altura {r[0]}/{r[1]} largura {r[2]}/{r[3]}')
        # ---- CA1: a lojinha ----
        if SOLO in ('','loja'):
            for nome,save in (('fim',FIM),('dia2',DIA2)):
                run(pg,save+"g.goShop("+("60" if nome=='fim' else "3")+");")
                grupos=pg.evaluate("()=>window.__lcc.shopSecoes()")
                ids=['lanchonete','equipe','dinheiro','gurugol']
                for gi,gid in enumerate(ids):
                    run(pg,"L.setShopGrupo('"+gid+"');",False)
                    conf(pg,f'{tag} loja[{nome}] {gid} (cartões)','#ov-shop .panel',['#btn-shop-go','#btn-shop-menu','#shop-tabs','#btn-shop-manual'])
                    if gid=='gurugol': continue
                    for sec in grupos[gi]:
                        run(pg,"L.setShopTab('"+sec+"');",False)
                        conf(pg,f'{tag} loja[{nome}] {gid}/{sec}','#ov-shop .panel',['#btn-shop-go','#btn-shop-menu','#shop-tabs','#btn-shop-voltar'])
        # ---- CA2: os sete painéis ----
        if SOLO in ('','paineis'):
            rank=("L.Rank.saveLocal('carreira',{nome:'NomeComDezesseis',pontos:9000,dia:30});"
                  "for(let i=0;i<50;i++) L.Rank.saveLocal('carreira',{nome:'Jogador '+i,pontos:100+i*37,dia:3+i%20});"
                  "L.lsSet(L.LS.name,'NomeComDezesseis');L.rk.tab='carreira';L.openRank('ov-menu');")
            run(pg,FIM+rank)
            conf(pg,f'{tag} Ranking','#ov-rank .panel',['#rank-nome button','#rank-tabs','#ov-rank .row .btn'])
            run(pg,"document.getElementById('ov-app').classList.add('show');")
            conf(pg,f'{tag} Instalar no celular','#ov-app .panel',['#ov-app .row .btn'])
            run(pg,FIM+"g.startEndless();g.begin();g.pontos=300;g.money=50;g.finishEndless();")
            conf(pg,f'{tag} fim do Turno sem fim','#ov-endless .panel',['#btn-endless-again','#btn-endless-rank','#btn-endless-menu'])
            run(pg,FIM+"g.startDay(5);g.begin();g.schedule=[];g.money=0;g.custo=100;g.save.bank=0;g.save.socorro=1;g.save.emp=Object.assign(g.save.emp,{resto:550,n:5,atr:true});g.finishDay();")
            conf(pg,f'{tag} falência','#ov-falencia .panel',['#btn-falencia-zero','#btn-falencia-rank','#btn-falencia-menu'])
            run(pg,DIA2+"g.startDay(1);")
            conf(pg,f'{tag} abertura do dia 1','#ov-intro .panel',['#ov-intro .row .btn'])
            run(pg,FIM+"g.startDay(60);")
            conf(pg,f'{tag} abertura do dia 60','#ov-intro .panel',['#ov-intro .row .btn'])
            run(pg,FIM+"g.startDay(60);g.begin();g.setState('paused');")
            conf(pg,f'{tag} pausa','#ov-pause .panel',['#ov-pause .row .btn'])
            run(pg,DIA2+"g.setState('treinoend');")
            conf(pg,f'{tag} fim da Missão zero','#ov-treino .panel',['#btn-treino-dia1'])
        # ---- CA3: as Versões ----
        if SOLO in ('','versoes'):
            run(pg,"document.getElementById('ov-ver').classList.add('show');")
            conf(pg,f'{tag} Versões','#ov-ver .panel',['#btn-ver-close'])
            r=pg.evaluate("()=>{const l=document.querySelector('.verlist');return [l.scrollHeight,l.clientHeight,l.querySelectorAll('li').length]}")
            total+=1
            if r[2]!=25: fails+=1; print(f'FAIL: {tag} a lista das Versões tem {r[2]} linhas (esperado 25: da v11.16 à v11.1, a v11 e da v10 à v1)')
        # ---- v11.15: a abertura (os botões Voltar e Pular, por cima do quadro cheio, à vista e sem se cobrir) ----
        if SOLO in ('','abertura'):
            run(pg,"g.setState('menu');document.getElementById('btn-historia').click();")
            r=pg.evaluate("""()=>{const q=s=>document.querySelector(s).getBoundingClientRect(),a=q('#btn-ab-voltar'),b=q('#btn-ab-pular'),vw=innerWidth,vh=innerHeight;
              const dentro=e=>e.width>0&&e.height>=43&&e.left>=-1&&e.top>=-1&&e.right<=vw+1&&e.bottom<=vh+1;
              return {ok:document.getElementById('ov-abertura').classList.contains('show')&&dentro(a)&&dentro(b)&&(a.right<=b.left+1||b.right<=a.left+1),a:[a.left,a.top,a.right,a.bottom].map(Math.round),b:[b.left,b.top,b.right,b.bottom].map(Math.round),cenas:window.__lcc.aberturaAtual()?window.__lcc.aberturaAtual().n:0}}""")
            total+=1
            if not r['ok'] or r['cenas']!=11: fails+=1; print(f"FAIL: {tag} abertura: Voltar {r['a']} e Pular {r['b']} fora da tela, pequenos ou um sobre o outro (cenas: {r['cenas']})")
            elif os.environ.get('V'): print(f"ok  : {tag} abertura: Voltar {r['a']} e Pular {r['b']}")
            run(pg,"document.getElementById('btn-ab-pular').click();")
        pg.close()
    b.close()
os.remove(W)
print(f'conferências={total} fails={fails}'); sys.exit(1 if fails else 0)
