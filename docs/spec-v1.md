# Especificação — "Lanchonete Corre-Corre"

Jogo ORIGINAL de gerenciamento de tempo em restaurante (gênero "time management", estilo clássico de jogos de garçonete). NÃO usar nomes, personagens, logos, músicas ou arte de nenhum jogo existente (nada de "Diner Dash", "Flo", etc.). Tudo desenhado por código em canvas 2D, sem imagens externas.

Idioma da interface: português do Brasil.

## Entrega
- Um único arquivo: `/home/claude/lanchonete.html`.
- SEM `<!doctype>`, `<html>`, `<head>`, `<body>` (o publicador envolve). Começar com `<title>Lanchonete Corre-Corre</title>`, depois `<link>` de fontes, `<style>`, o markup e um `<script>`.
- Fontes (Google Fonts, com fallback): display "Bagel Fat One" (títulos, placares, balões), corpo "Rubik" (400/600/800). Ex.: `font-family: "Bagel Fat One", "Arial Black", system-ui, sans-serif`.
- Nenhuma outra dependência externa. Sem `alert/confirm/prompt`. Sem `localStorage` obrigatório (pode salvar recorde dentro de try/catch).
- Visual de mundo único (paleta fixa, não precisa tema claro/escuro), mas `body` e todas as cores definidas explicitamente. Em `:root` defina `color-scheme: light` e as cores como tokens CSS; no canvas, use uma constante JS `PAL` com as mesmas cores.

## Identidade visual
Lanchonete brasileira de esquina anos 70–80: piso xadrez verde-menta e creme, parede de azulejo branco com faixa azul-cobalto, mesas de fórmica vermelho-tomate com borda cromada, balcão de inox, cartaz de preços pintado à mão (“PF R$ 18 · Pastel R$ 9 · Cafezinho R$ 3”).
Paleta (PAL): 
- piso1 #CFE8D6, piso2 #F4EBD6
- azulejo #FBFAF5, faixa #1F4FA3
- fórmica #D8432F, cromo #B9C2CC
- mostarda #F2B33D (destaques, moedas)
- tinta #22201C (contornos, texto)
- verde-ok #3E9B5A, alerta #E26A2C, perigo #C2362B
Contorno escuro de 2–3px em tudo (estilo cartum chapado). Sombras = elipses semitransparentes no piso.

## Layout da cena (resolução lógica 960×600, escala para caber na tela mantendo proporção; em celular deitado ocupa a tela; em retrato mostra aviso discreto "Gire o celular para jogar melhor" mas continua jogável)
- Topo: parede de azulejo (faixa ~90px) com o cartaz de preços e um relógio de parede que mostra o tempo restante do dia.
- Esquerda: porta de entrada e fila de espera (até 4 grupos empilhados verticalmente).
- Centro: 6 mesas em grade 3×2. Mesas 1–4 com 2 lugares, mesas 5–6 com 4 lugares. Cadeiras de cores: cada mesa tem cor de cadeira (vermelha, azul, amarela, verde) — ver bônus de cor.
- Direita: balcão da cozinha com janela de pedidos (onde se deixa o pedido), janela de pratos prontos (até 4 pratos), Chef Tonhão visível atrás (bigode, touca branca, pele morena), estação de cafezinho (garrafa térmica), e pia/carrinho de louça.
- Rodapé (HUD em HTML ou canvas): Dia N, dinheiro do dia com meta e meta "expert", fila de ações da garçonete (ícones), botão pausa, som on/off.

## Protagonista
Bia — garçonete, mulher negra jovem, cabelo black power preso em puff com lenço amarelo, avental laranja sobre uniforme verde, tênis. Andar com leve balanço (bob vertical), animação simples de pernas. Velocidade ~260 px/s (aumenta 10% com upgrade de tênis).

## Clientes (diversidade obrigatória, sem estereótipos)
Grupos de 1–4 pessoas, tons de pele variados (paleta de 6 tons), cabelos e roupas variados; a cor da camisa de cada grupo é uma das 4 cores de cadeira. Tipos (cada um com paciência e ritmo diferentes):
- Estudante (paciência média, come rápido)
- Executiva com notebook (pouca paciência, gorjeta alta)
- Família com criança (grupo de 3–4, paciência média, demora para pedir)
- Vovô e vovó (muita paciência, comem devagar)
- Entregador de moto (sozinho, pouquíssima paciência, paga rápido)
Desenho: cabeça redonda + corpo trapezoidal, olhos pontinhos, expressão que muda com a paciência (feliz → neutro → bravo).

## Paciência
Cada grupo tem 5 corações exibidos acima dele. Perde 1 coração a cada X segundos dependendo do tipo e do estado (esperando na fila, esperando pedido ser anotado, esperando comida, esperando conta). Ações que atendem o grupo dão +1 coração (máx. 5): sentar, anotar pedido, entregar prato, levar cafezinho. Ao chegar a 0, o grupo vai embora bravo (nuvem de fumaça "Hmpf!"), perde-se pontos e, se estava sentado, a mesa fica com louça? Não: fica livre direto, mas aplica penalidade.

## Ciclo de cada mesa (máquina de estados)
1. Fila → jogador arrasta (ou toca no grupo e depois na mesa) para uma mesa livre com lugares suficientes. Mesa errada/ocupada: grupo volta para a fila com efeito de "boing".
2. LENDO_CARDAPIO (3–6 s, por tipo) → ícone de cardápio aberto.
3. QUER_PEDIR → mão levantada + balão com "!" pulsando. Bia vai até a mesa e anota (0,6 s).
4. Bia leva o pedido à janela da cozinha (anexa automaticamente se ela for até o balcão; o pedido é um ticket na mão dela). Chef cozinha (4–7 s), barra de progresso sobre o ticket.
5. Prato pronto aparece na janela de pratos prontos com o número da mesa. Bia pega (pode carregar até 2 itens nas mãos ao mesmo tempo — prato/ticket/conta/louça) e entrega.
6. COMENDO (5–9 s) com barra.
7. QUER_CONTA → balão com cifrão. Bia vai e recebe (moedas voam para o placar).
8. SUJA → louça na mesa. Bia recolhe e leva até a pia/carrinho. Mesa fica LIVRE.
Pratos: PF, pastel, coxinha, misto-quente — desenho distinto e simples; o pedido do grupo é aleatório (visual apenas).

## Fila de ações (essencial do gênero)
- Clicar/tocar em qualquer alvo (mesa com necessidade, janela da cozinha, prato pronto, pia, cafeteira) ADICIONA uma ação à fila da Bia (máx. 6). A fila aparece no HUD como ícones; tocar num ícone o remove.
- Bia executa as ações em ordem, andando até cada ponto (rota simples em linha reta com desvio leve; não precisa pathfinding real, mas não atravessar a mesa visualmente: aproximar-se do lado da mesa mais próximo).
- Uma ação inválida no momento de executar (ex.: prato ainda não pronto) é descartada com um "?" sobre a Bia.
- Mãos: ela carrega até 2 itens. Se as mãos estiverem cheias e a ação exige pegar algo, a ação espera/é pulada com aviso.

## Pontuação
- Sentar: +10; anotar: +15; entregar: +20; conta: valor da conta (R$ 20–60 conforme grupo) × multiplicador de corações (5♥ = 1,5×, 4 = 1,25×, 3 = 1×, 2 = 0,8×, 1 = 0,6×); recolher louça: +10; cafezinho: +5.
- CORRENTE: repetir o mesmo tipo de ação consecutivamente dá bônus crescente: 2ª +10, 3ª +20, 4ª +40 … mostrado como texto flutuante "Corrente ×3!".
- BÔNUS DE COR: sentar o grupo numa mesa cuja cor de cadeira combina com a camisa do grupo dá +15 e um brilho.
- Grupo que vai embora bravo: −30.
- Texto flutuante (+20 etc.) em todas as pontuações.

## Dias (níveis) — 7 dias
Dia 1: 3 mesas abertas (as outras com placa "Fechado"), 6 grupos, só estudante/vovós, meta R$ 250, expert R$ 400, duração 2:30.
Dia 2: 4 mesas, 9 grupos, + família.
Dia 3: 5 mesas, 12 grupos, + executiva.
Dia 4: 6 mesas, 14 grupos, + entregador.
Dia 5–7: 6 mesas, 16/18/22 grupos, chegada mais rápida, chef um pouco mais lento no dia 7 (“Tonhão está gripado”).
O dia acaba quando todos os grupos foram atendidos/foram embora OU o tempo zera (aí os restantes saem sem penalidade). Tela de fim de dia: dinheiro, meta (atingiu? estrelas: 1 = meta, 2 = expert, 3 = expert sem nenhum cliente perdido), estatísticas (atendidos, perdidos, maior corrente), botões "Próximo dia" / "Repetir dia".
Entre dias: LOJINHA simples com 1 upgrade por dia (pode comprar com o dinheiro acumulado, custo de 150–300): Tênis novos (+10% velocidade), Jukebox (paciência na fila cai 20% mais devagar), Cafeteira de 2 bocas (cafezinho dá +2♥), Ventilador de teto (comer 15% mais rápido), Chapa nova (cozinha 15% mais rápido). Mostrar os já comprados.

## Telas
- Tela inicial: título grande "Lanchonete Corre-Corre" em Bagel Fat One com sombra chapada mostarda, Bia acenando, botões "Jogar" e "Como jogar" (painel com 5 dicas curtas e ilustrações simples). Seletor de dia para os já desbloqueados (até o dia máximo alcançado nesta sessão; salvar em localStorage com try/catch).
- Pausa: overlay com Continuar / Reiniciar dia / Menu.
- Fim de jogo após dia 7: tela de parabéns com total.

## Áudio
WebAudio sintetizado (sem arquivos): blip para tocar, "plim" de moeda, campainha do balcão quando prato fica pronto, "bufo" quando cliente sai bravo. Áudio só inicia após primeiro toque. Botão mudo.

## Entrada
Pointer Events (mouse e toque). Arrastar grupo da fila até a mesa; também funciona tocar no grupo (fica selecionado com contorno pulsante) e depois tocar na mesa. Áreas de toque generosas (mín. 44px lógicos). `touch-action: none` no canvas. Teclas: Espaço/P pausa.

## Qualidade técnica
- requestAnimationFrame com dt limitado (máx 50 ms). Pausar automaticamente quando a aba perde visibilidade.
- Canvas com devicePixelRatio para nitidez.
- Código organizado: constantes no topo (PAL, LAYOUT, CUSTOMER_TYPES, DAYS, UPGRADES), classes/objetos Game, Waitress, Group, Table, Kitchen.
- Respeitar `prefers-reduced-motion`: reduzir balanço/partículas.
- Foco visível nos botões HTML. Sem rolagem horizontal da página. O container ocupa `height:100%` (html/body height 100%), centraliza o canvas.
- Testável: expor `window.__game` (instância) para depuração.
- Ao terminar, rode `node --check` sobre o JS extraído para garantir que não há erro de sintaxe.
