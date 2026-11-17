# v11.15.1 — Retornos da Letícia: verificar atualização, pernas na espera, bandeirinhas, o cabelo da Bia e o enfeite da mesa (etapa R1)

**Situação:** aprovada
**Origem:** retorno da betatester Letícia, 17/11 (`docs/PROPOSTAS.md`, entrada de 17/11), com as decisões do usuário no mesmo dia; o enfeite da mesa por ponto entrou na mesma data, pedido do usuário

## Objetivo
Quem joga pelo app ou pelo site tem um botão no menu para buscar a versão nova quando ela não chega sozinha. Na área industrial, quem espera sentado na cadeirinha ou no banquinho tem pernas; as bandeirinhas da festa junina ficam presas nas paredes; a Bia tem o cabelo crespo em todos os pontos, preso de um jeito diferente em cada um, nunca alisado; e o enfeite comprado para as mesas aparece em todo ponto (a toalha xadrez na Garagem, uma violeta na área industrial, o galheteiro na Avenida e uma vela no Terraço), sem poluir a mesa.

## Fora do escopo
- Aviso automático de versão nova (bolinha no ícone, conferência ao abrir): o usuário escolheu só o botão.
- O botão no artifact do claude.ai: lá a página já abre na última publicação.
- Pernas em quem espera nos sofás da Avenida e nas poltronas do Terraço (o assento cobre as pernas e fica bem) e em quem senta à mesa.
- Mudar a roupa da Bia ou o penteado da Garagem (o puff com o lenço fica como está), e a Bia criança da abertura.
- O preço do enfeite da mesa (`TOALHA.cost`), o quanto ele vale no Ambiente e no Luxo, e o campo do save (`t`): só muda o que se vê e o nome.
- A toalha de linho do jogo de mesas (que já tira o enfeite das mesas ao ser comprada) e a Garagem com o mármore: ficam como estão.
- O fio de bandeirinhas do feriado e o do jogo do Brasil mudam só porque usam a mesma função da calçada (`drawBandeirinhas`); nada além das pontas.

## Regras (decisões tomadas)
### 1. Verificar atualização (só no app e no site)
- **Onde aparece:** ícone novo `#btn-atu` em `src/02-telas.html`, no `.links` do menu, **antes** do `#btn-app`, com a classe `ver-ico`, `title` e `aria-label` "Verificar atualização". Desenho (setas em círculo, no mesmo traço dos vizinhos): `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11.5A8 8 0 0 0 5.6 6.8"/><path d="M5 3.5v3.8h3.8"/><path d="M4 12.5a8 8 0 0 0 14.4 4.7"/><path d="M19 20.5v-3.8h-3.8"/></svg>`.
- **Quando aparece:** só com `window.LCC_APP` verdadeiro (o `app/build.py` põe `<script>window.LCC_APP=1</script>` no `<head>` do `index.html`, antes do jogo) **ou** com o modo dev ligado. Fora disso, `display:none`. A visibilidade é acertada no `devSync` (`src/40-interface.js`), que já mostra ou esconde o "Sair do modo dev" (`#btn-dev-off`) ao abrir o menu e ao ligar ou desligar o modo dev.
- **A versão publicada:** o `app/build.py` grava `app/site/versao.json` com `{"versao":"<VERSAO>"}`, onde `<VERSAO>` é lido do `lanchonete.html` (a linha `const VERSAO = '...'`; o script falha com `assert` se não achar). O `versao.json` **não** entra no `PRECACHE`, e o `app/sw.template.js` deixa passar direto, sem cache, todo pedido cujo caminho termina em `/versao.json` (um `return` no começo do `fetch`, antes do cache).
- **Painel novo `#ov-atu`** (`src/02-telas.html`, com a classe `app-panel` como o `#ov-app`; entra em `SCREENS` de `src/40-interface.js`): título `<h2>Atualização</h2>`, um parágrafo `#atu-txt` (`class="small"`, `role="status"`) e a linha de botões `#btn-atu-ir` ("Atualizar agora", `btn go`, escondido se não houver versão nova) e `#btn-atu-close` ("Voltar", `btn alt`, volta ao menu como o `#btn-app-close`).
- **Ao tocar no ícone** (`src/43-telas.js`, ao lado do `on('btn-app', ...)`): `Sfx.init(); Sfx.tap();`, abre `#ov-atu` com "Procurando versão nova..." e chama `atuVerifica()`, que pede `window.fetch('versao.json?t=' + Date.now(), { cache:'no-store' })` e compara o `versao` recebido com `VERSAO` por `atuEstado(remota, VERSAO)` (função pura): `remota` vazia ou inválida → `'erro'`; igual a `VERSAO` → `'igual'`; diferente (mais nova ou não) → `'nova'`. Falha do `fetch` ou do JSON → `'erro'`.
- **Textos** (`ATU_TXT` em `src/10-constantes.js`):
  - procurando: "Procurando versão nova..."
  - nova: "Tem versão nova: {v}! Seu jogo salvo continua." (`{v}` = a versão do site) e o botão "Atualizar agora" aparece
  - igual: "Você já está na versão mais nova ({v})." (`{v}` = `VERSAO`)
  - erro: "Sem internet agora. Tente de novo mais tarde."
  - atualizando: "Atualizando..."
- **"Atualizar agora"** (`atuAplica()`): mostra "Atualizando...", desativa o botão, então (cada passo com `catch` que segue adiante) cancela todos os service workers (`navigator.serviceWorker.getRegistrations()` → `unregister()`), apaga os caches cujo nome começa com `lcc-`, faz `window.fetch(location.href.split('#')[0], { cache:'reload' })` (renova o cache do navegador; o GitHub Pages guarda a página por 10 minutos) e por fim `location.reload()`. O save (`localStorage`) não é tocado.
- **Modo dev:** seção "Atualização (app)" no painel (`buildDev`, junto de "Roupa da Bia"), "Agora: normal" ou "Agora: simulando ...", com os botões "Normal", "Simular nova" e "Simular sem internet", que chamam `game.devAtu(null | 'nova' | 'erro')` (grava em `DEV.forca.atu`, só na memória, como o `devRoupa`). Simulando, `atuVerifica()` não chama o `fetch`: "nova" responde com a versão `'v99'` e "erro" cai no texto de sem internet; e "Atualizar agora" só volta ao menu (não recarrega nada).
- **Manual:** sem ficha (não é do jogo).
- **Save:** nada novo.

### 2. Pernas de quem espera sentado na área industrial
- `drawPerson` (`src/20-desenho-base.js`) ganha a opção `o.pernas` (só vale com `o.sit`): desenha as pernas da pessoa sentada, de frente, **antes** do tronco, no lugar onde hoje nada é desenhado quando `sit`: as duas pernas da calça `rr(ctx,-8,-12,7,11,2)` e `rr(ctx,1,-12,7,11,2)` com `fs(ctx,p.pants,2)`, e os sapatos `ell(ctx,-4.5,-0.5,5,2.6)` e `ell(ctx,4.5,-0.5,5,2.6)` com `fs(ctx,'#2c2a26',1.6)` (as do em pé, um pouco mais curtas e paradas). Como o `sit` já desce a pessoa 12, os pés ficam um pouco abaixo dos pés do banquinho, como pernas que vêm para a frente. Com `p.vestido`, a saia continua por cima (já é desenhada depois). A sombra de quem está sentado continua sem desenhar.
- `drawCluster` (`src/22-salao-hud.js`) repassa `pernas:o.pernas`, e a chamada da espera em `src/23-render.js` (a do `glowSprite` com `sit:parado && g.sentado`) passa `pernas: parado && g.sentado && !avenida(g) && !terraco(g)` (só a cadeirinha e o banquinho; os sofás e as poltronas ficam como estão).
- **Ajuste na captura:** se a perna ficar comprida ou curta demais contra o banquinho e a cadeirinha, mude só a altura (o 11 e o -12, de 2 em 2, entre 7 e 13) e registre o valor final em Desvios.

### 3. Bandeirinhas presas nas paredes
- **Salão** (`drawBandeirinhasSalao`, `src/21-cenario.js`): os dois fios deixam de começar em `A.x0 - 6` e terminar em `A.x1 + 6` e passam a ir da **parede da esquerda do salão** (a divisa com a calçada, `x0 = 0`, ou a face da parede se o cenário a desenhar mais para dentro) até a **parede da cozinha** (`x1` = a face esquerda da parede da cozinha, perto de `x 760`; leia o valor no desenho da cozinha e use uma constante, a mesma nos 4 pontos). As alturas das pontas (`ya`, `yb`) e a barriga (`sag`) ficam como estão; o número de bandeirinhas continua `Math.round((x1 - x0) / 26)`.
- **Calçada** (`drawBandeirinhas`): `x0` passa de `-CALCADA.w + 30` para a face do pilar ou da parede da esquerda da calçada (perto de `-CALCADA.w + 16`; conferir na captura dos 4 pontos); `x1 = -8` fica (já encosta no pilar da porta).
- **Preguinho:** nas duas pontas de cada fio, um prego: `circ(ctx,x,y,2.2); fs(ctx,'#6E6A63',1.2)`.

### 4. O cabelo crespo da Bia
- Vale para as roupas 2, 3 e 4 do `drawBia` (`src/20-desenho-base.js`, o trecho "cabeça e cabelo"); a 1 (o puff com o lenço) não muda. Aparece no boneco do salão, no retrato das conversas e no da lojinha, porque todos usam o `drawBia`.
- **Função nova `puffCrespo(ctx,cx,cy,r,n)`** (logo antes do `drawBia`): um tufo crespo feito de um círculo central de raio `r*0.62` e `n` círculos de raio `r*0.42` em volta, a `r*0.6` do centro, com ângulos espaçados por igual. Desenha em duas passadas, para o contorno ficar só por fora: primeiro todos os círculos com `ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 4; stroke()`, depois todos com `fill` de `BIA_ROUPA_COR.cabelo`.
- **O alto da cabeça (2, 3 e 4):** além da franja de hoje (o arco com a curva), 5 bolinhas crespas na linha do cabelo, `circ` de raio 3.6 nos ângulos 200°, 235°, 270°, 305° e 340°, a 10.5 de `(0, hy-1)`, preenchidas com a cor do cabelo e com contorno 1.6 (desenhadas antes do arco da franja, para a franja cobrir a parte de baixo). O contorno de cima da cabeça passa de liso para ondulado.
- **2, área industrial (puff baixo na nuca):** o rabo de bezier sai; no lugar, `puffCrespo(ctx,16 + ph2,hy + 3,10,6)`, atrás da cabeça (onde está o rabo hoje). O elástico laranja (`circ(ctx,9.2,hy-4.2,2.4)`) fica.
- **3, Avenida (puff alto):** o rabo alto sai; no lugar, `puffCrespo(ctx,5 + ph2 * 0.5,hy - 19,12,7)`, atrás da cabeça. O elástico laranja desce para onde o puff encontra a cabeça (`circ(ctx,3,hy-11.5,2.3)`).
- **4, Terraço (coque crespo):** o coque liso (`circ(ctx,0,hy-19,7)`) sai; no lugar, `puffCrespo(ctx,0,hy - 20,9.5,7)`. O elástico creme passa a ser uma faixa na base do coque: `rr(ctx,-6,hy-13.5,12,2.6,1.3); fs(ctx,PAL.creme,1.2)`.
- **Ajuste na captura:** os centros e raios acima são o ponto de partida; se o puff cobrir o rosto, a orelha ou passar da cabeça a ponto de parecer outro penteado, mexa no centro de 1 em 1 e no raio de 0,5 em 0,5 e registre em Desvios. O que não pode mudar: o cabelo é crespo e volumoso em todos os pontos, e cada ponto continua com seu jeito de prender (nuca, alto, coque).

### 5. O enfeite da mesa em cada ponto (pedido do usuário, 17/11)
- **O que é:** o upgrade de mesa de hoje (a "toalha xadrez", `m.t` / `t.toalha`, `TOALHA.cost` por mesa) passa a ser **o enfeite da mesa**, que muda com o ponto. A mesa leva o enfeite consigo ao mudar de ponto (o campo é o mesmo); só o desenho e o nome mudam. Hoje, fora da Garagem, ele é comprado e conta no Ambiente, mas não aparece.
- **`ENFEITE_MESA`** em `src/10-constantes.js`, pelo `id` do ponto, e `enfeiteMesa(g)` devolve o do ponto de agora (sem ponto, o da Garagem):
  - `garagem`: nome "Toalha xadrez", elogio "A toalha xadrez dá um charme!" (os de hoje)
  - `industrial`: nome "Violeta", elogio "A violeta na mesa é um charme!"
  - `avenida`: nome "Galheteiro", elogio "Azeite e vinagre na mesa: que capricho!"
  - `terraco`: nome "Vela", elogio "A vela na mesa deixa tudo mais aconchegante!"
- **Textos da lojinha** (o editor do salão, `src/41-lojinha.js`): onde hoje está escrito "Toalha xadrez", entra `enfeiteMesa(game).nome`: no balãozinho da mesa ("Violeta: R$ 12"), no botão de todas ("Violeta em todas (3): R$ 36", "Violeta em 1 mesa: R$ 12", "Violeta: todas têm") e na linha de contas ("Violeta: R$ 12 por mesa; melhora o ambiente no Gúgou para quem senta nela. 2 de 5 mesas têm."). O ícone `d-toalha` (onde aparecer) desenha o enfeite do ponto de agora.
- **Elogio no Gúgou:** quando o comentário sorteado for o da toalha (`'toalha'` na lista `decor` do `finishDay`/`avalComentario`), o texto é o `elogio` do enfeite do ponto, não mais o fixo de `AVAL_DECOR.toalha`.
- **Desenho** (função nova `drawEnfeiteMesa(ctx,g,t,tm)` em `src/22-salao-hud.js`, ao lado do `drawToalhaEnfeites`, chamada no `drawTableBody` antes da plaquinha do número): fora da Garagem, numa mesa com `t.toalha`, um enfeite pequeno no meio de trás do tampo, no mesmo lugar da florzinha da toalha (`x = t.cx + (hw > 60 ? -hw * 0.15 : 4)`, `y = t.cy - 13`, a base do enfeite), nos três tampos de fora da Garagem (a formica da área industrial e da Avenida, a madeira escura do Terraço e a madeira clara do jogo de mesas). No **mármore** (jogo de mesas 4), que já tem a florzinha e o porta-guardanapo em toda mesa, a mesa com o enfeite troca a florzinha pelo enfeite do ponto (o porta-guardanapo fica). No **linho** (3) nada muda. Pontos de partida:
  - **Violeta:** um vasinho só, o do meio do `drawVioleta` (`src/21-cenario.js`), em escala 0,75: o vaso de barro, as duas folhas e as três flores roxas com o miolinho amarelo. Pode virar uma função `drawVioletaVaso(ctx,x,y,s)` usada pelas duas.
  - **Galheteiro:** a base de metal `rr(ctx,x-8,y-2,16,3,1.5)` em `PAL.cromo`; a alça no meio, uma linha de `(x,y-2)` a `(x,y-18)` com uma argolinha (`circ` de raio 2 em `y-19`, só o contorno); as duas garrafinhas, o azeite `rr(ctx,x-7,y-13,6,12,2.5)` em `'rgba(196,170,60,.85)'` e o vinagre `rr(ctx,x+1,y-13,6,12,2.5)` em `'rgba(150,40,50,.75)'`, com contorno 1.4, e os gargalos `rr(ctx,x-5.5,y-17,3,4,1)` e `rr(ctx,x+2.5,y-17,3,4,1)` em `'#9CA2A8'`.
  - **Vela:** baixa, num copo de vidro (diferente da vela alta da noite da estrela): o copo `rr(ctx,x-5,y-9,10,10,2.5)` em `'rgba(220,235,245,.55)'` com contorno 1.4, a vela dentro `rr(ctx,x-3.4,y-6,6.8,6,1.2)` em `'#FFF6DA'`, uma chama pequena (a do `drawVela` em escala 0,6, balançando com `tm` e parada com `RM`) e o halo `circ(ctx,x,y-9,7)` em `'rgba(255,214,120,.18)'`. **Na noite da estrela** (`g.noite`), a mesa já ganha a vela da noite: nela, o enfeite da vela não é desenhado (uma vela por mesa).
- **Ajuste na captura:** se o enfeite encostar no prato servido, no avental da Cami (mesa da Cami) ou no número da mesa, mova-o só no `x` (de 2 em 2) e registre em Desvios. O enfeite não pode passar de uns 20 de altura nem de 16 de largura: a mesa não pode ficar poluída.
- **Modo dev:** nada novo: a seção "Luxo" e o "todo o luxo do ponto de graça" (`devLuxo` / a v10.7) já põem o enfeite em todas as mesas, e a troca de ponto do modo dev mostra cada um.
- **Manual:** sem mudança (não há ficha da toalha).
- **Save:** nada novo (o campo `t` continua).

## Critérios de aceite
- **CA1** sem `window.LCC_APP` e sem modo dev, `#btn-atu` fica escondido; com `LCC_APP` (opção nova `app:true` do `tests/harness.js`, que põe `window.LCC_APP = 1`) ou com o modo dev, aparece → `smoke95` (1)
- **CA2** `atuEstado`: `('v11.15.1','v11.15.1')` → `'igual'`; `('v11.16','v11.15.1')` → `'nova'`; `('v11.15','v11.15.1')` → `'nova'`; `('', ...)`, `(null, ...)` e `(42, ...)` → `'erro'` → `smoke95` (2)
- **CA3** tocar o ícone abre `#ov-atu`; com um `fetch` falso (opção nova `fetch` do harness, que vira `window.fetch`) respondendo `{"versao":"v11.16"}`, o texto é "Tem versão nova: v11.16! Seu jogo salvo continua." e `#btn-atu-ir` aparece; respondendo a `VERSAO`, o texto é o de "já está na versão mais nova" com a `VERSAO` e o botão some; com o `fetch` rejeitando, o texto é o de sem internet; o pedido usa `cache:'no-store'` e um caminho que começa com `versao.json?t=` → `smoke95` (3)
- **CA4** modo dev: `devAtu('nova')` faz a verificação mostrar `v99` sem chamar o `fetch`; `devAtu('erro')` mostra sem internet; `devAtu(null)` volta ao normal; simulando, "Atualizar agora" volta ao menu sem recarregar; a seção "Atualização (app)" aparece no `buildDev` → `smoke95` (4)
- **CA5** `app/sw.template.js` deixa `versao.json` fora do cache, e `app/build.py` grava `versao.json` com a `VERSAO` e põe `window.LCC_APP=1` no `index.html` → `smoke95` (5) lendo os dois arquivos como texto, e no fechamento `python3 app/build.py` (com `pip install pillow`) e conferir `app/site/versao.json` e o começo do `app/site/index.html`
- **CA6** o painel `#ov-atu` cabe nos 14 tamanhos de tela, e o menu com um ícone a mais continua cabendo → `python3 tests/menu_fit.py` (com a conferência do `#ov-atu` acrescentada, como a do `#ov-app`)
- **CA7** (o que se vê) → captura `shot_v11_15_1.js`, conferida em recorte ampliado: (a) a espera da área industrial com o banquinho e com a cadeirinha, 1 a 4 pessoas por lugar, um vestido e uma criança: todos com pernas e sapatos na frente do assento, nada flutuando; (b) os fios de bandeirinhas da festa junina na Garagem, na área industrial, na Avenida e no Terraço, presos com prego na parede da esquerda e na da cozinha, e o da calçada de pilar a pilar; (c) a Bia com as roupas 2, 3 e 4, parada, andando e no retrato da conversa, ampliada 4x: o cabelo crespo e volumoso, preso na nuca, no alto e em coque, sem cobrir o rosto; a roupa 1 igual à de antes; (d) as mesas com o enfeite em cada ponto (formica, madeira clara do jogo de mesas, mármore e a madeira escura do Terraço), vazias e com gente comendo, e o Terraço na noite da estrela: a toalha xadrez na Garagem, a violeta, o galheteiro e a vela, pequenos, sem encostar no prato, no número nem no avental da Cami; no mármore, o enfeite no lugar da florzinha; na noite da estrela, só a vela da noite
- **CA8** `enfeiteMesa` dá "Toalha xadrez", "Violeta", "Galheteiro" e "Vela" na Garagem, na área industrial, na Avenida e no Terraço; o botão de todas e a linha de contas do editor do salão usam o nome do ponto (e não "Toalha xadrez" fora da Garagem); o elogio da toalha no Gúgou sai com o texto do ponto; preço, Ambiente, Luxo e o campo `t` não mudam (o `smoke30` e o `smoke72` seguem verdes) → `smoke95` (6)

## Partes
`src/02-telas.html` (ícone `#btn-atu` e painel `#ov-atu`, `vtag`, `#ov-ver`), `src/10-constantes.js` (`ATU_TXT`, `atuEstado`, `VERSAO`), `src/12-clientes.js` (só se `DEV.forca` precisar de algo; não deve), `src/16-jogo.js` (`devAtu`, ao lado do `devRoupa`), `src/10-constantes.js` (`ENFEITE_MESA`, `enfeiteMesa`, o comentário do Gúgou), `src/16-jogo.js` (a lista `decor` do `finishDay`, se o elogio for resolvido lá), `src/20-desenho-base.js` (`drawPerson`, `puffCrespo`, `drawBia`), `src/21-cenario.js` (`drawBandeirinhas`, `drawBandeirinhasSalao`, `drawVioleta`), `src/22-salao-hud.js` (`drawCluster`, `drawTableBody`, `drawMesaLuxo`, `drawToalhaEnfeites`, `drawEnfeiteMesa`), `src/41-lojinha.js` (os textos da toalha no editor do salão e o ícone `d-toalha`), `src/23-render.js` (a chamada da espera), `src/40-interface.js` (`SCREENS`, `devSync`, `buildDev`), `src/43-telas.js` (`atuVerifica`, `atuAplica`, os `on(...)` e o `window.__lcc`), `app/build.py`, `app/sw.template.js`, `tests/harness.js` (opções `app` e `fetch`), `tests/menu_fit.py`.

## Tarefas
- [ ] T1 `tests/smoke95.js` com CA1 a CA5 e CA8 (falhando), as opções `app` e `fetch` no `tests/harness.js` e a entrada no `run_all.sh`.
- [ ] T2 O botão e o painel: `#btn-atu`, `#ov-atu`, `SCREENS`, `devSync`, `ATU_TXT`, `atuEstado`, `atuVerifica`, `atuAplica`, `devAtu` e a seção do `buildDev`; `window.__lcc` com `ATU_TXT`, `atuEstado`, `atuVerifica` e `atuAplica`.
- [ ] T3 `app/build.py` (`versao.json`, `window.LCC_APP=1`) e `app/sw.template.js` (passa direto o `versao.json`); `tests/menu_fit.py` confere o `#ov-atu`.
- [ ] T4 As pernas (`drawPerson`, `drawCluster`, a chamada em `23-render.js`).
- [ ] T5 As bandeirinhas presas (`drawBandeirinhasSalao`, `drawBandeirinhas`, os pregos).
- [ ] T6 O cabelo crespo (`puffCrespo`, roupas 2, 3 e 4 do `drawBia`).
- [ ] T6b O enfeite da mesa: `ENFEITE_MESA`, `enfeiteMesa`, os textos do editor do salão, o elogio do Gúgou e o `drawEnfeiteMesa` (violeta, galheteiro e vela; o mármore e a noite da estrela).
- [ ] T7 `tests/shot_v11_15_1.js` e a conferência em recorte do CA7 (ajustar o que o CA7 pedir; capturas apagadas no fim).
- [ ] Fechamento: `VERSAO` v11.15.1, `vtag`, `#ov-ver` (linha da v11.15.1 no topo) e a lista esperada no `smoke86`, `docs/RESUMO.md` (a seção do app ganha uma linha sobre o botão), `docs/TESTES.md`, esta spec como entregue, `tests/run_all.sh --tudo` verde, PR e merge.

## Avisos para a execução
- O `smoke92`, o `smoke93` e o `smoke94` já estão reservados pelas specs v11.16 a v11.18 (aprovadas): por isso esta usa o `smoke95`.
- No `harness.js` não há `fetch` nem `navigator`; o código do jogo deve chamar `window.fetch` e testar `navigator.serviceWorker` e `window.caches` antes de usar (no harness eles não existem, e o `atuAplica` simulado nem chega lá).
- `drawPerson` também desenha a Bia criança da abertura e quem senta à mesa com `sit`: as pernas vêm só com `o.pernas`, então nada muda neles; não mexa no `sit` em si. No cabelo, a passada dupla do `puffCrespo` (contorno de todos, depois o miolo de todos) é o que impede as linhas internas entre as bolinhas; não use `fs` por círculo.
- O enfeite da mesa: o id interno continua `toalha` (`t`, `buyToalha`, `semToalha`, `TOALHA`, `amb.toalha`); não renomeie nada no código, só os textos da interface. A noite da estrela (`g.noite`) já desenha uma vela alta em `t.cx + t.hx * 0.5` (`drawVela`, linha do `drawTable`).
- Para ver a festa junina e a espera sentada na captura: `g.evento = 'junina'`, `up.assento:'banco'` ou `'cadeira'` no save e uns 9 s de jogo com `g.begin()` para a fila encher (foi assim que o planejamento viu os problemas).

## Testes
`smoke95` novo (CA1 a CA5 e CA8); `smoke30` e `smoke72` sem mudança; `smoke86` muda (a lista de versões começa na v11.15.1); `tests/menu_fit.py` ganha o `#ov-atu`; capturas novas em `shot_v11_15_1.js`. Sem mudança em `balance.js` e `carreira.js` (nada de jogo muda). No fechamento: quantas checagens o `smoke95` tem.

## Decisões em aberto
Nenhuma.

## Desvios
(No fechamento.)

**Modelo:** Sonnet, esforço médio (valores e textos decididos; o desenho tem ponto de partida e regra de ajuste pela captura)
