# v12.11.2 — O couvert cinza e a cabecinha nos cursos (etapa 19c)

**Situação:** aprovada (27/11)
**Origem:** retornos do usuário de 27/11 no `docs/PROPOSTAS.md`: "o couvert cinza antes de contratar" e "a cabecinha nos cursos do Cardápio". Decisões fechadas com o usuário em 27/11 (Opus); a etapa 19 foi dividida em 3 versões (19a, 19b e 19c), uma por sessão.

## Objetivo
O "Cobrar couvert" fica cinza até o couvert ser contratado. Cada curso do Cardápio mostra a cabecinha de quem aprende, e os cursos dos ajudantes perdem a conta da experiência e ganham o desenho do que ensinam.

## Fora do escopo
- Os cartões da Equipe (o da Dani e o do Joca), com a experiência deles: ficam como estão.

## Regras (decisões tomadas)
### O couvert
- No cartão do couvert (`buildCouvert`, `src/41-lojinha.js`), o botão "Cobrar couvert: ..." fica **desligado e cinza** (`disabled`, `aria-pressed="false"`, CSS `.item .toggle[disabled]{opacity:.4;cursor:not-allowed}`) enquanto o couvert não é contratado. A escolha de cobrar (`equipe.taxa`) fica guardada e volta a aparecer quando ele for contratado.

### Os cursos do Cardápio com a cabecinha de quem aprende
- Todo cartão de curso da seção Cardápio (`buildCardapio` e `buildCursosAjudantes`) ganha, no canto de baixo à direita do ícone, a **cabecinha** de quem o curso afeta: o retrato redondo das conversas (`drawRetrato`, `src/26-conversa.js`), na escala 0,36, com borda branca. O Tonhão nos cursos dele; a Dani na Confeitaria; o Joca no Barista e nos Cafés especiais; o Anselmo na Coquetelaria; a Lia na Cozinha de autor. Função nova `cursoCabeca(canvas, q)` em `src/41-lojinha.js`, chamada depois de desenhar o ícone.
- Nos cartões dos ajudantes, o bonequinho inteiro de hoje (`upgradeIcon('dani')`, `'joca'`, `'anselmo'`, `'lia'`) dá lugar ao desenho do 1º item que o curso abre, com o que já desenha esse item no jogo: o doce (`drawIcon(c,'doce',...)`, com a variante 1 na caseira, 5 na gourmet e 8 na alta, as do `doceIcone`), o café (`drawIcon(c,'cafeesp',...)`, a variante 0, o espresso, no Barista e a 2, o coado, nos Cafés especiais), o drink (o ícone do 1º drink do curso, como no balão da mesa) e o prato da Lia (`drawDish` do 1º prato do curso). Os cartões do Tonhão mantêm o prato do `cursoIcon`.
- A frase "+2 de experiência para a Dani" e "+2 de experiência para o Joca" **sai** desses cartões (sempre, não só no nível máximo). Os cartões da Equipe (o da Dani e o do Joca) não mudam.

- **Modo dev:** nada novo (os cursos e o couvert já aparecem todos na lojinha do modo dev).
- **Manual:** nada muda.
- **Save:** nada novo.

## Critérios de aceite
- **CA1** O "Cobrar couvert" fica `disabled` sem o couvert, liga ao contratar, e a escolha guardada de cobrar sobrevive a dispensar e recontratar → `smoke127` (1)
- **CA2** Nos cartões de curso do Cardápio, nenhum texto tem "de experiência", e cada cartão de curso chama a `cursoCabeca` com quem aprende (o Tonhão nos dele, a Dani, o Joca, o Anselmo e a Lia nos deles) → `smoke127` (2)
- **CA3** O que se vê → captura `shot_v12_11_2.js` (960x540 e 844x390): o cartão do couvert não contratado (o botão cinza) e contratado; o Cardápio da Avenida e o do Terraço com a cabecinha em cada curso (Tonhão, Dani, Joca, Anselmo e Lia) e os desenhos novos dos cursos dos ajudantes
- **CA4** `python3 menu_fit.py`: a lojinha continua cabendo nos 14 tamanhos

## Partes
- `src/41-lojinha.js`: `buildCouvert`, `buildCardapio`, `buildCursosAjudantes`, `cursoCabeca` (nova).
- `src/01-estilo.css`: `.item .toggle[disabled]`.
- `src/43-telas.js`: expor `cursoCabeca` no `window.__lcc`.

## Tarefas
- [ ] T1 Smoke novo `smoke127` com os critérios de aceite (falhando) e no `tests/run_all.sh`.
- [ ] T2 O couvert cinza.
- [ ] T3 A cabecinha nos cursos do Cardápio, os desenhos dos cursos dos ajudantes e a frase da experiência fora.
- [ ] T4 `shot_v12_11_2.js` (CA3): conferir em recortes ampliados, ajustar e apagar as capturas; `python3 menu_fit.py` (CA4).
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, os destinos no `docs/PROPOSTAS.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- Os cursos dos ajudantes só aparecem no Cardápio com a pessoa contratada e o cartão aberto (`game.cartaoAberto`, `game.daniChegou`); para a captura, o modo dev (`g.setDev(true)`) mostra todos.
- O ícone dos cartões sai do `tipCanvas` (canvas de 64x64); a `cursoCabeca` desenha por cima, no mesmo canvas.

## Testes
- Smoke novo: `smoke127` (CA1 e CA2). Captura: `shot_v12_11_2.js` (CA3). `python3 menu_fit.py` (CA4).
- Sem mudança no equilíbrio (só a lojinha).

## Decisões em aberto
Nenhuma.

## Desvios
(No fechamento.)

**Modelo:** Sonnet, esforço médio (interface com regras dadas; o desenho dos ícones conferido em captura)
