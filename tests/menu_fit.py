# Confere, em vários tamanhos de tela (do desktop ao celular deitado), que:
#  CA4: o painel do menu principal não rola;
#  CA1: a lojinha (em cada grupo e em cada seção) tem o painel parado, as abas e o botão de começar o dia à vista, e só o #shop-grid rola;
#  v11.15: os botões Voltar e Pular da abertura (#ov-abertura) ficam à vista, com 44 px de altura ou mais, sem se cobrir (python3 menu_fit.py abertura);
#  CA2: os painéis Ranking, Instalar no celular, Atualização (v11.16.1), fim do Turno sem fim, falência, abertura do dia, pausa e fim da Missão zero cabem inteiros;
#  v12: o menu com o botão Desafios (no Fim da história), a tela de Desafios e o cartão do fim do desafio cabem inteiros (python3 menu_fit.py desafios);
#  v12.3.1: o menu com o modo dev ligado (Desafios e Teste) e a tela do Teste (python3 menu_fit.py paineis); v12.4: e a tela da fase do Teste (equipe);
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
FIMSV=("g.save=L.normSave({dia:70,bank:12345,histV:1,capV:6,cap:15,conversa:null,treino:true,convEnt:1,convCard:1,convDiv:1,convPlanta:1,convSocorro:1,salao:{ponto:'terraco'}});g.up=g.save.up;g.tablesKey='';g.buildTables();")   # v12: o Fim da história (o botão Desafios aparece)
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
        # ---- v12: o menu com o botão Desafios, a tela de Desafios e o cartão do fim ----
        if SOLO in ('','menu','desafios'):
            run(pg,FIMSV+"g.setState('menu');")
            r=pg.evaluate("()=>{const p=document.querySelector('.menu-panel'),b=document.getElementById('btn-desafios'),t=new Set([...document.querySelectorAll('.menu-btns .btn')].filter(x=>x.getBoundingClientRect().width>0).map(x=>Math.round(x.getBoundingClientRect().top/6)));return [p.scrollHeight,p.clientHeight,p.scrollWidth,p.clientWidth,b.getBoundingClientRect().width>0,t.size]}")
            bad=r[0]>r[1]+1 or r[2]>r[3]+1 or not r[4] or r[5]>2; fails+=bad; total+=1   # v12: depois do Fim (Missão zero vira link), os botões ficam em no máximo duas fileiras
            print(('FAIL' if bad else 'ok  ')+f': {tag} menu com o botão Desafios altura {r[0]}/{r[1]} largura {r[2]}/{r[3]} visível={r[4]} fileiras={r[5]}')
        if SOLO in ('','paineis','desafios'):
            run(pg,FIMSV+"g.save.desafios=L.normDesafios({soBia:1,semBravo:2,efood:3});g.setState('desafios');")
            conf(pg,f'{tag} Desafios','#ov-desafios .panel',['#btn-desafios-voltar','#desafios-grid .dcard:first-child .dbtn','#desafios-grid .dcard:last-child .dbtn','#desafios-grid .dcard:last-child .qm'])
            run(pg,FIMSV+"g.startDesafio('semBravo');g.begin();g.schedule=[];g.nextIdx=0;g.groups=[];g.custo=0;g.money=g.fixo+g.day.expert;g.stats.lost=0;g.finishDay();")
            conf(pg,f'{tag} fim do Desafio (ouro)','#ov-desafio-fim .panel',['#btn-desafio-de-novo','#btn-desafio-lista'])
            run(pg,FIMSV+"g.startDesafio('efood');g.begin();g.schedule=[];g.nextIdx=0;g.groups=[];g.custo=0;g.money=g.fixo+g.day.meta;g.stats.lost=1;g.stats.lostBy.retirada=1;g.finishDay();")
            conf(pg,f'{tag} fim do Desafio (falhou)','#ov-desafio-fim .panel',['#btn-desafio-de-novo','#btn-desafio-lista'])
            run(pg,FIMSV+"g.startDesafio('soBia');")
            conf(pg,f'{tag} introdução do Desafio','#ov-intro .panel',['#ov-intro .row .btn'])
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
            run(pg,"document.getElementById('btn-atu').style.display='';document.getElementById('atu-txt').textContent='Tem versão nova: v11.99! Seu jogo salvo continua.';document.getElementById('btn-atu-ir').style.display='';document.getElementById('ov-atu').classList.add('show');")   # v11.16.1: o pior caso, com a versão nova e os dois botões
            conf(pg,f'{tag} Atualização','#ov-atu .panel',['#btn-atu-ir','#btn-atu-close'])
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
            # v12.2: o fim do Teste de habilidade com a caixa do relatório aberta (a cópia falha de propósito)
            run(pg,FIM+"Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(1)},configurable:true});document.execCommand=()=>false;g.startTeste('terraco');g.begin();g.schedule=[];g.nextIdx=0;g.groups=[];g.custo=0;g.money=g.fixo+g.day.meta;g.finishDay();document.getElementById('btn-teste-copia').click();")
            pg.wait_for_timeout(200)
            conf(pg,f'{tag} fim do Teste (caixa do relatório aberta)','#ov-teste-fim .panel',['#btn-teste-copia','#btn-teste-de-novo','#btn-teste-volta','#teste-fim-caixa .cx-txt'])
            # v12.3.1: o menu com o modo dev ligado (Desafios e Teste lado a lado) e a tela do Teste
            run(pg,FIMSV+"g.setDev(true);g.setState('menu');")
            r=pg.evaluate("()=>{const p=document.querySelector('.menu-panel'),b=document.getElementById('btn-teste'),d=document.getElementById('btn-desafios'),t=new Set([...document.querySelectorAll('.menu-btns .btn')].filter(x=>x.getBoundingClientRect().width>0).map(x=>Math.round(x.getBoundingClientRect().top/6)));return [p.scrollHeight,p.clientHeight,p.scrollWidth,p.clientWidth,b.getBoundingClientRect().width>0&&d.getBoundingClientRect().width>0,t.size]}")
            bad=r[0]>r[1]+1 or r[2]>r[3]+1 or not r[4] or r[5]>3; fails+=bad; total+=1
            if bad and os.environ.get('V'): print(pg.evaluate("()=>[...document.querySelector('.menu-panel').children].map(e=>[e.id||e.className,Math.round(e.getBoundingClientRect().height)]).concat([...document.querySelectorAll('#menu-links > *')].filter(e=>e.getBoundingClientRect().width>0).map(e=>[e.id,Math.round(e.getBoundingClientRect().left),Math.round(e.getBoundingClientRect().top),Math.round(e.getBoundingClientRect().width),Math.round(e.getBoundingClientRect().height)]))"))
            print(('FAIL' if bad else 'ok  ')+f': {tag} menu do modo dev (Desafios e Teste) altura {r[0]}/{r[1]} largura {r[2]}/{r[3]} visíveis={r[4]} fileiras={r[5]}')
            run(pg,FIMSV+"g.setDev(true);g.setState('teste');")
            conf(pg,f'{tag} tela do Teste','#ov-teste .panel',['#btn-teste-menu-volta','#teste-nome','#teste-lista [data-teste=garagem]','#teste-lista [data-teste=terraco]'])
            # v12.4: a tela da fase do Teste (a equipe): a área industrial (2 ajudantes) e o Terraço (5 pessoas, a Cami nas tarefas); o painel não rola, a lista rola por dentro e os botões ficam à vista
            for fase in ('industrial','terraco'):
                run(pg,FIMSV+"g.setDev(true);g.testeFase='"+fase+"';g.setState('testefase');")
                conf(pg,f'{tag} tela da fase ({fase})','#ov-teste-fase .panel',['#btn-teste-fase-jogar','#btn-teste-fase-padrao','#btn-teste-fase-volta','#teste-fase-lista [data-quem=dani] [data-vem]'])
            run(pg,"g.setDev(false);")
        # ---- CA3: as Versões ----
        if SOLO in ('','versoes'):
            run(pg,"document.getElementById('ov-ver').classList.add('show');")
            conf(pg,f'{tag} Versões','#ov-ver .panel',['#btn-ver-close'])
            r=pg.evaluate("()=>{const l=document.querySelector('.verlist');return [l.scrollHeight,l.clientHeight,l.querySelectorAll('li').length]}")
            total+=1
            if r[2]!=23: fails+=1; print(f'FAIL: {tag} a lista das Versões tem {r[2]} linhas (esperado 23: a v12.6, a v12.5, a v12.4.3, a v12.4.2, a v12.4.1, a v12.4, a v12.3.2, a v12.3.1, a v12.3, a v12.2, a v12.1, a v12, a v11 e da v10 à v1)')
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
