# capturas da v9 (etapa 3a: mudança de ponto e a Lanchonete na área industrial) em ../capturas/v9: cartão Mudança apagado, aceso e na confirmação, salão da área industrial com tudo comprado,
# o apito com as turmas, o motorista com o balão do café, a encomenda no balcão de retirada, a calçada com cadeirinhas, jarra e plantas, as TVs, o fim do dia com o aluguel,
# a conversa do cap. 5 e o cartão de fim dos capítulos; tela larga e celular deitado
from playwright.sync_api import sync_playwright
import pathlib, os
HERE=pathlib.Path(__file__).resolve().parent
S=str(HERE); OUT=str(HERE.parent/'capturas'/'v9'); os.makedirs(OUT,exist_ok=True)
html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+open(str(HERE.parent/'lanchonete.html'),encoding='utf8').read()
open(S+'/wrapped.html','w').write(html)
exe='/opt/pw-browsers/chromium' if os.path.exists('/opt/pw-browsers/chromium') else None
VISTA="try{localStorage.setItem('lcc2_abertura','1')}catch(e){}"
BASE="document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;"
TUDO="{tenis:true,maquina:true,tvs:true,fogaoInd:true,assento:'banco',pratos:1,ventilador:true}"
def SALVA(ind,extra=""): return "g.save=L.normSave(Object.assign({dia:9,bank:2500,cap:4,histV:1,maxDay:9,up:"+(TUDO if ind else "{tenis:true}")+",equipe:{tonhao:1,dani:1"+(",tvs:1" if ind else "")+"},decor:{violeta:1,anturio:1,pendente:1,espada:1},salao:{ponto:'"+('industrial' if ind else 'garagem')+"'}},"+(extra or "{}")+")); g.up=g.save.up; g.tablesKey=''; g.buildTables(); "
LOJA=lambda bank,nota: BASE+SALVA(False,"{bank:"+str(bank)+"}")+"g.save.aval=Array(10).fill(Array(5).fill("+str(nota)+")); g.goShop(9); L.setShopGrupo('dinheiro'); L.setShopTab('mudanca');"
JOGO=BASE+SALVA(True)+"g.startDay(9); g.begin(); g.schedule.forEach(s=>s.t=9999); g.elapsed=30; "
def gente(tipos): return "".join("g.arrive({t:0,type:'%s',color:%d,vip:false,lote:5});"%(t,i%4) for i,t in enumerate(tipos))
CENAS=[
 ('mudanca_apagado',LOJA(300,3)),
 ('mudanca_aceso',LOJA(2500,3)),
 ('mudanca_confirma',LOJA(2500,3)+"document.querySelector('#shop-grid .btn').click();"),
 ('melhorias_industrial',BASE+SALVA(True)+"g.goShop(9); L.setShopGrupo('lanchonete'); L.setShopTab('melhorias');"),
 ('manutencao_fogao',BASE+SALVA(True)+"g.goShop(9); L.setShopGrupo('lanchonete'); L.setShopTab('manut');"),
 ('salao_industrial',JOGO+gente(['turma','motorista','encomenda','estudante','executiva'])),
 ('apito',JOGO+"g.resetDay(9); while(!g.apito) g.resetDay(9); g.begin(); g.schedule.forEach(s=>{ if(!s.apito) s.t=9999; }); g.elapsed=g.apito.t-6; g.update(0.05); g.elapsed=g.apito.t-0.02; g.update(0.05); "),
 ('motorista_cafe',JOGO+"const m=new L.Group(g,'motorista',++g.gid,1,false); m.cafePede=true; m.juiceWant=0; const t=g.tables[0]; g.groups.push(m); g.seatGroup(m,t); m.setState('eating'); m.timer=0.01; m.update(0.05); g.update(0.05);"),
 ('encomenda_balcao',JOGO+"const o=g.arrive({t:0,type:'encomenda',color:0,vip:false,lote:5}); o.path=[]; g.kitchen.queue.concat(g.kitchen.cooking).filter(x=>x.marmita&&x.dono===o).slice(0,3).forEach(t=>{ g.kitchen.queue=g.kitchen.queue.filter(x=>x!==t); g.kitchen.cooking=g.kitchen.cooking.filter(x=>x!==t); g.prateleira.push({kind:'marmita',mid:++g.marmitaId,dish:t.dish,dono:o,age:0,q:4}); }); g.update(0.05);"),
 ('fim_do_dia_aluguel',BASE+SALVA(True)+"g.startDay(9); g.begin(); g.schedule=[]; g.nextIdx=0; g.money=900; g.custo=300; g.finishDay();"),
 ('conversa_cap5',BASE+SALVA(True,"{cap:5,conversa:'antes'}")+"g.setState('menu'); L.playCareer();"),
 ('fim_capitulos_garagem',BASE+SALVA(False)+"g.save.cap=3; g.save.conversa='depois'; g.setState('menu'); L.playCareer();"),
]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe); errs=[]
    for name,vp,cel in [('_pc',(1220,600),False),('_celular_deitado',(740,360),True)]:
        ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]}, has_touch=cel, device_scale_factor=2)
        ctx.add_init_script(VISTA)
        pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        for f,js in CENAS:
            if cel and f not in ('salao_industrial','mudanca_aceso','apito'): continue
            pg.goto('file://'+S+'/wrapped.html'); pg.wait_for_timeout(600)
            pg.evaluate('()=>{'+js+'}'); pg.wait_for_timeout(500)
            pg.screenshot(path=OUT+'/'+f+name+'.png')
        ctx.close()
    print('ERRORS:',errs); b.close()
os.remove(S+'/wrapped.html')
