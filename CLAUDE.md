# Lanchonete Corre-Corre

Jogo de navegador de gerenciamento de tempo em restaurante (gênero "garçonete apressada"), em um único arquivo HTML com canvas 2D. Interface em português do Brasil.

## Regras do projeto
- **Propriedade intelectual:** o jogo é original. Personagens: Bia (garçonete) e Chef Tonhão. Não usar nomes, personagens, logos nem arte de jogos existentes; não citar "Diner Dash" nem "Flo" na interface. O clone Java de referência (zip `Diner-Dash-Clone-master`, projeto acadêmico KFUPM ICS-201) serviu só como referência de mecânica.
- **Arquivo único:** `lanchonete.html` contém HTML, CSS e JS inline. O único recurso externo é o Google Fonts (Bagel Fat One e Rubik), com fallback.
- **Formato de publicação (Artifact do claude.ai):** o arquivo NÃO tem `<!doctype>`, `<html>`, `<head>` nem `<body>`, porque o publicador envolve o conteúdo. Ele começa com `<title>Lanchonete Corre-Corre</title>`. Para abrir localmente, use `versoes/v1.html` como modelo de invólucro ou rode `tests/shot_v2.py`, que gera um invólucro.
- **Nome de arquivo:** manter sempre o mesmo nome, sem número de versão. As versões antigas ficam em `versoes/`.
- **Diversidade:** clientes com tons de pele, cabelos e roupas variados e sem estereótipos.
- **Movimento:** respeitar `prefers-reduced-motion`.
- **Código:** a lógica (`Game.update`) é separada do desenho (`render`), e `window.__game` fica exposto para testes.

## Estrutura
```
lanchonete.html          versão atual (v4), fonte do artifact
versoes/v1-fonte.html    v1 exatamente como foi publicada (sem invólucro)
versoes/v1.html          v1 com doctype, publicada junto em versoes/v1.html no artifact
versoes/v2-fonte.html    v2 exatamente como foi publicada (sem invólucro)
versoes/v2.html          v2 com doctype, publicada junto em versoes/v2.html
versoes/v3-fonte.html    v3 exatamente como foi publicada (sem invólucro)
versoes/v3.html          v3 com doctype, publicada junto em versoes/v3.html
docs/spec-v1.md          especificação original
docs/spec-v2.md          especificação da revisão baseada no clone
docs/spec-v3.md          clientes VIP
docs/spec-v4.md          balcão de sucos e bandeja
docs/HISTORICO.md        histórico da conversa e das decisões
tests/                   harness Node + bot + testes + capturas Playwright
capturas/v1 … v4          telas de referência
```

## Testes
```
cd tests
./extract.sh             # extrai o <script> para tests/game.js e roda node --check
node smoke.js            # bot joga os 7 dias da carreira, com render (stub de canvas)
node smoke2.js           # mecânicas: fluxo de mesa, mãos, fila de ações, pausa etc.
node smoke3.js           # v2: pool de cores, fila lotada, Turno sem fim, ranking local/db (stub)
node smoke4.js           # v3: clientes VIP (agenda, fila, conta, multa, Turno sem fim, render)
node smoke5.js           # v4: sucos e bandeja (capacidade das mãos, pedido, entrega, conta sem suco, bot dias 3–7)
node balance.js [N]      # N rodadas por dia (padrão 20); na v4, ~96% das metas batidas pelo bot
python3 shot_v2.py       # capturas com Playwright/Chromium em ../capturas/v2
python3 shot_v3.py       # capturas da v3 em ../capturas/v3 (usa /opt/pw-browsers/chromium se existir)
python3 shot_v4.py       # capturas da v4 em ../capturas/v4
python3 menu_fit.py      # o painel do menu não pode rolar em 14 tamanhos de tela (desktop e celular deitado)
```
`tests/botpage.js` é gerado a partir de `tests/bot.js` (mesmo bot, embrulhado para rodar na página). Ao mudar o bot, gere de novo.
O smoke2 tinha uma falha intermitente ("conta paga, mesa suja, servidos=1", ~10% das execuções, já na v2): um grupo esquecido na fila ia embora bravo durante a cobrança e a multa de R$ 30 anulava a conta. Corrigido no teste, que agora enche a paciência da fila antes de cobrar (100/100 execuções verdes).

## Artifact publicado
- URL: https://claude.ai/artifact/MJxrgDg8S4akvg47SoQAvj (privado: dono e quem receber acesso)
- Versão 1 (13/10/2026) é a v1. Versão 2 (14/10/2026), rótulo "v2 — revisão com base no clone". Versão 3 (14/10/2026), rótulo "v3 — clientes VIP"; Versões 4 e 5 foram ajustes de menu da v3. Versão 6 (14/10/2026), rótulo "v4 — sucos e bandeja"; Versão 7, "v4 — regras da bandeja e comandas".
- Arquivos extras publicados: `versoes/v1.html`, `versoes/v2.html` e `versoes/v3.html`, abertos pelo painel Versões. Esse painel é acessado por um ícone discreto (relógio com seta, "Versões anteriores") no canto inferior direito do painel do menu, na linha do "Zerar progresso".
- Ao republicar, os arquivos extras omitidos em `files` continuam publicados. Ao criar uma v5, guardar a v4 em `versoes/` e enviar `versoes/v4.html`.
- Capacidades declaradas na v2. Ao republicar, omitir `capabilities` mantém essas regras:
```json
{"db": {"rules": [
  {"path": "ranking-carreira", "read": "view", "write": "owner"},
  {"path": "ranking-carreira/{self}", "write": "interact"},
  {"path": "ranking-semfim", "read": "view", "write": "owner"},
  {"path": "ranking-semfim/{self}", "write": "interact"}
]}, "user": {}}
```
- Ranking compartilhado:
  - Documentos `ranking-carreira/<userId>` e `ranking-semfim/<userId>`, com os campos `nome`, `pontos`, `dia` ou `tempo` e `quando`.
  - Só sobrescreve quando a pontuação é maior.
  - Fallback local em `localStorage` (`lcc2_ranking`) quando o db não está disponível, para Viewers sem permissão de escrita ou quando a página é aberta fora do claude.ai.
- localStorage: a v2 usa o prefixo `lcc2_`, a v1 usa `lcc_save_v1`. A v2 importa o progresso da v1.

## Histórico de versões
- **v1 (13/10/2026):**
  - carreira de 7 dias, fila de até 6 ações e mãos com 2 itens;
  - corrente e bônus de cor (camisa × cadeira), paciência em corações e cafezinho;
  - lojinha com 5 upgrades, som WebAudio e controles de mouse e toque.
- **v2 (14/10/2026), revisão com base no clone:**
  - comandas coloridas (pool de 6 cores);
  - aro de humor verde, amarelo e vermelho;
  - fila lotada: quem chega vai embora com "Lotado!";
  - modo Turno sem fim com 5 estrelas de reputação;
  - ranking compartilhado com ordenação por nome ou pontos, crescente ou decrescente, como no clone;
  - painel Versões e correções visuais (placa ABERTO, rótulo PIA E LOUÇA).
- **v3 (14/10/2026), clientes VIP** (ver `docs/spec-v3.md`):
  - grupos VIP a partir do dia 5 e no Turno sem fim (depois de 1 min);
  - furam a fila, têm paciência ×0,75 e pagam gorjeta +50%, com bônus de R$ 40 se saírem com 5♥;
  - bravos, pagam multa dobrada;
  - visual com óculos escuros e plaquinha "★VIP"; meta do dia 7 ajustada para R$ 1300;
  - acesso às versões anteriores passou do link "Versões" para um ícone no canto inferior direito do menu.
  - menu sem barra de rolagem no celular deitado (`@media (max-height:460px)`: painel mais largo, título em 1 linha, 4 botões numa fileira).
- **v4 (14/10/2026), balcão de sucos e bandeja** (ver `docs/spec-v4.md`):
  - balcão de sucos ao lado do cafezinho; do dia 3 em diante, ~30% dos grupos pedem de 1 copo até o número de pessoas;
  - cada copo vale R$ 12 e cada entrega devolve 1 coração; conta paga sem o suco custa 1 coração;
  - comandas só na mão sem bandeja, todas juntas, até `kitchen.slots` (3);
  - upgrade Bandeja (R$ 220): 1 prato + 1 bebida, 2 pratos, 3 bebidas ou 2 pilhas de louça (sujo nunca com limpo); a outra mão leva 1 item ou as comandas;
  - metas da v3 mantidas; "Como jogar" em duas colunas.

## Ideias pendentes (não implementadas)
- Testar som e toque em celular real (nunca testados).
- A conta é paga na hora e não ocupa as mãos; cada grupo toma no máximo 1 cafezinho.
- Possíveis extras discutidos: ajuste de dificuldade.
- O painel "Como jogar" ainda rola no celular deitado (o menu principal não rola).
