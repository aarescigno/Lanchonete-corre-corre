# Lanchonete Corre-Corre

Jogo de navegador de gerenciamento de restaurante, em um único arquivo HTML com canvas 2D, em português do Brasil. Versão atual: **v6**. O estado do projeto, o histórico e os detalhes do artifact e do ranking estão em `docs/RESUMO.md` (leia só quando precisar).

## Regras do projeto
- **Jogo original:** os personagens são a Bia (garçonete) e o Chef Tonhão. Não usar nomes, arte nem logos de jogos existentes, nem citar "Diner Dash" ou "Flo" na interface.
- **Arquivo único:** `lanchonete.html` tem HTML, CSS e JS inline; o único recurso externo é o Google Fonts.
- **Sem invólucro:** o arquivo não tem `<!doctype>`, `<html>`, `<head>` nem `<body>` (o publicador envolve) e começa com `<title>`.
- **Nome fixo:** o nome do arquivo não muda. Versões antigas vão para `versoes/vN-fonte.html` (exato) e `versoes/vN.html` (com a 1ª linha de `versoes/v1.html` como invólucro).
- **Diversidade e movimento:** clientes diversos, sem estereótipos; respeitar `prefers-reduced-motion`.
- **Código:** a lógica (`Game.update`) fica separada do desenho (`render`); `window.__game` e `window.__lcc` ficam expostos para os testes.

## Economia de tokens
- **Nunca leia `lanchonete.html` inteiro** (~145 KB, ~40 mil tokens). Use `tests/mapa.sh [filtro]` para achar a linha, depois Read com `offset` e `limit`, ou grep.
- **Edições grandes:** use scripts Python com substituição exata (`assert s.count(a)==1`), em vez de reler o arquivo.
- **Testes:** `tests/run_all.sh` (só o resumo de cada teste); `--tudo` acrescenta `menu_fit` e `balance`. Não rode `node smokeN.js` sem `| tail`.
- **Capturas:** confira recortes ampliados (PIL `crop`) só do trecho alterado, em vez de várias telas inteiras.
- **Docs:** leia `docs/spec-vN.md` e `docs/HISTORICO.md` só quando o assunto pedir.

## Testes (`cd tests`)
- `./run_all.sh` roda `extract.sh` (gera `game.js` e confere a sintaxe) e depois os smokes 1 a 8.
- `node balance.js [N]` roda o bot N vezes por dia, sem equipe (alvo: ~10% das metas nos dias 3 a 7). `EQUIPE=auto` usa a equipe que o jogador já paga (alvo: ~85%); `EQUIPE='{...}'` usa uma equipe fixa.
- `python3 menu_fit.py` confere que o menu não rola.
- `python3 shot_v6.py` gera as capturas em `capturas/v6`.
- O Playwright usa `/opt/pw-browsers/chromium` quando existe.
- `botpage.js` é gerado a partir de `bot.js`: ao mudar o bot, gere de novo.

## Publicar (Artifact do claude.ai)
- **URL:** https://claude.ai/artifact/MJxrgDg8S4akvg47SoQAvj. Publique `lanchonete.html` nesse `url`.
- **Capacidades:** omita `capabilities`, para manter o db do ranking e o `user`.
- **Arquivos extras:** os já publicados continuam lá. Envie em `files` só o `versoes/vN.html` novo, porque o painel Versões tem um link para ele.
- **Nova versão:** guarde a atual em `versoes/`, atualize o selo `vtag` e a lista do painel `#ov-ver`, escreva `docs/spec-vN.md` e atualize `docs/RESUMO.md`.
