# Lanchonete Corre-Corre

Jogo de navegador de gerenciamento de restaurante, em um único arquivo HTML com canvas 2D, em português do Brasil. Versão atual: **v7.3**. O estado do projeto, o histórico e os detalhes do artifact e do ranking estão em `docs/RESUMO.md` (leia só quando precisar). O roteiro das próximas versões, uma etapa por sessão, está em `docs/PLANO.md`: quando o pedido for "a próxima etapa", leia lá só a etapa da vez. Ideias e retornos de jogadores (texto original e destino de cada um) ficam no log `docs/PROPOSTAS.md`: registre lá cada retorno novo.

## Regras do projeto
- **Jogo original:** os personagens são a Bia (garçonete) e o Chef Tonhão. Não usar nomes, arte nem logos de jogos existentes, nem citar "Diner Dash" ou "Flo" na interface.
- **Código em partes, publicado em arquivo único:** edite só em `src/` (veja abaixo); `python3 montar.py` junta as partes em `lanchonete.html`, que tem HTML, CSS e JS inline e é o que se publica (o único recurso externo é o Google Fonts). Nunca edite `lanchonete.html` à mão: ele é gerado, mas fica no git (artifact, app e testes usam ele). Antes de publicar ou fazer commit, monte (`tests/run_all.sh` já monta).
- **Sem invólucro:** o arquivo montado não tem `<!doctype>`, `<html>`, `<head>` nem `<body>` (o publicador envolve) e começa com `<title>`.
- **Nome fixo:** o nome do arquivo não muda. Versões antigas vão para `versoes/vN-fonte.html` (exato) e `versoes/vN.html` (com a 1ª linha de `versoes/v1.html` como invólucro).
- **Diversidade e movimento:** clientes diversos, sem estereótipos; respeitar `prefers-reduced-motion`.
- **Código:** a lógica (`Game.update`) fica separada do desenho (`render`); `window.__game` e `window.__lcc` ficam expostos para os testes.

## Partes do código (`src/`, juntadas em ordem pelo nome)
Cada parte é um trecho exato do arquivo final (o JS fica todo dentro de um `(function(){ ... })()` que começa em `02-telas.html` e fecha em `43-telas.js`, então as partes `.js` não rodam sozinhas).
- `00-topo.html` título e fontes · `01-estilo.css` CSS · `02-telas.html` telas (menu, lojinha, painéis `#ov-*`)
- `10-constantes.js` constantes, salão, equipe, contas e divulgação, dias, melhorias · `11-base.js` utilidades, áudio, caminhos
- `12-clientes.js` pessoas, mesa, grupo · `13-cozinha.js` Tonhão · `14-bia.js` mãos e Bia · `15-dani.js` Dani · `16-jogo.js` classe `Game`
- `20-desenho-base.js` helpers de desenho, ícones, pessoas · `21-cenario.js` cenário, cozinha, Dani, músico, água, lixeira · `22-salao-hud.js` mesas, balões, HUD · `23-render.js` brilho e `render`
- `30-ranking.js` ranking · `40-interface.js` escala, menu, Como jogar · `41-lojinha.js` lojinha · `42-resultados.js` fim do dia, formulário, tela do ranking · `43-telas.js` troca de telas, botões, entrada, laço

## Economia de tokens
- **Leia só a parte que interessa** em `src/`, e não `lanchonete.html` (~200 KB, ~100 mil tokens pelo Read). `tests/mapa.sh [filtro]` mostra parte e linha de seções, classes e funções.
- **Buscas:** grep e Glob em `src/`, `tests/` e `docs/`; deixe de fora `lanchonete.html` (cópia montada), `versoes/` (versões antigas inteiras, ~1,4 MB) e `capturas/`.
- **Edições grandes:** use scripts Python com substituição exata (`assert s.count(a)==1`), em vez de reler o arquivo.
- **Testes:** `tests/run_all.sh` (só o resumo de cada teste); `--tudo` acrescenta `menu_fit` e `balance`. Não rode `node smokeN.js` sem `| tail`.
- **Capturas:** confira recortes ampliados (PIL `crop`) só do trecho alterado, em vez de várias telas inteiras.
- **Docs:** leia `docs/spec-vN.md` e `docs/HISTORICO.md` só quando o assunto pedir.

## Testes (`cd tests`)
- `./run_all.sh` monta `lanchonete.html` a partir de `src/`, roda `extract.sh` (gera `game.js` e confere a sintaxe), gera `botpage.js` e roda os smokes 1 a 12.
- `node balance.js [N]` roda o bot N vezes por dia, sem equipe (desde a v7, a meta é o lucro; alvo: ~40–70% das metas nos dias 3 a 7). `EQUIPE=auto` usa a equipe que o jogador já paga (alvo: ~85–95%); `EQUIPE='{...}'` usa uma equipe fixa; `DIV=boca|panfleto|redes` escolhe a divulgação. `BOT=afiado` usa o "jogador perfeito" (alvo da v7.1, com `EQUIPE=auto ORDEM=pratos,tenis,agua,cafeteira,bandeja,ventilador`: 0 perdidos em ≥ 80% dos dias 3 a 7). `INGRED='{...}'` e `CONTAS='{...}'` testam valores sem mexer em `src/` (também no `carreira.js`); `METAS='{"3":420}'` testa metas. Desde a v7.3 (Bia a 300 px/s), sem equipe fica em ~74%, um pouco acima do alvo, por escolha do usuário (metas mantidas). Mostra as perdas por causa.
- `node carreira.js [N]` joga a carreira com o dinheiro acumulado de verdade e mostra o dinheiro em cada lojinha (alvo da v7: pouca sobra no dia 5).
- `python3 menu_fit.py` confere que o menu não rola.
- `python3 shot_v7_2.py` gera as capturas da aba Caixa em `capturas/v7.2` e `python3 shot_v7_3.py` as dos selos da fila e dos Tênis de corrida em `capturas/v7.3` (precisam do pacote `playwright` do Python).
- O Playwright usa `/opt/pw-browsers/chromium` quando existe.
- `botpage.js` é gerado a partir de `bot.js` por `gera_botpage.sh` (o `run_all.sh` já chama).

## Git
- **Sem branches parados:** todo trabalho termina com PR para o `claude/main` (o branch padrão), merge e o branch apagado, para o `claude/main` ser sempre a versão mais nova (o GitHub Pages publica a partir dele, e o workflow confere `python3 montar.py --check`).

## Publicar (Artifact do claude.ai)
- Rode `python3 montar.py` antes; o que se publica é o `lanchonete.html` montado.
- **URL:** https://claude.ai/artifact/MJxrgDg8S4akvg47SoQAvj. Publique `lanchonete.html` nesse `url`.
- **Capacidades:** omita `capabilities`, para manter o db do ranking e o `user`.
- **Arquivos extras:** os já publicados continuam lá. Envie em `files` só o `versoes/vN.html` novo, porque o painel Versões tem um link para ele.
- **Nova versão:** guarde a atual em `versoes/`, atualize o selo `vtag`, a constante `VERSAO` (vai no resumo do Caixa) e a lista do painel `#ov-ver`, escreva `docs/spec-vN.md` e atualize `docs/RESUMO.md`.
