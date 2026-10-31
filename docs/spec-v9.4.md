# v9.4 — Sessão 3b-4: o fiscal da vigilância sanitária (31/10/2026)

## O que entrou
- **Sorteio** (`Game.sortear`, junto com o clima e as quebras; guardado em `save.manut.sorteio.fiscal = { f }`, `f` = fração do turno): só na Avenida (`FISCAL.nivel` 3), do 2º dia no ponto (`FISCAL.dia`, por `diaNoPonto`) e `FISCAL.chance` = 15% por dia; `f` entre 30% e 70% (`FISCAL.quando`). Rejogar o dia repete o mesmo sorteio. Nunca na Missão zero nem no Turno sem fim. `normManut` guarda o campo.
- **A visita** (`class Fiscal`, nova parte `src/15-fiscal.js`; não é grupo nem ocupa mesa): na hora `t`, aparece em `DOOR`, anda (pelo `findPath`) até o primeiro ponto livre de `FISCAL_PONTOS` (meio do salão) e fica `FISCAL.visita` = 20 s olhando; depois sai de volta para a rua. Desenho `drawFiscal` (`21-cenario.js`): colete azul-claro, etiqueta "VIGILÂNCIA", prancheta e caneta; homem ou mulher, pele e óculos sorteados.
- **Falhas** (cada uma conta uma vez; ícone e texto em cima dele): mesa suja por mais de `FISCAL.mesaSuja` = 8 s seguidos (só durante a visita; mesa limpa zera a conta), lixeira cheia em algum momento, pia com `FISCAL.pia` = 4 pilhas ou mais.
- **Resultado** (`Game.fiscalFim`, texto grande ao terminar a visita): 0 falhas, "Aprovado!" (`aprovado`, +30 pontos, selo); 1, "Advertência"; 2 ou 3, "Multa!" de `FISCAL.multa` = R$ 150 (`multaVig`, entra no `fixo` e no lucro do dia, e sai do dinheiro no fim do dia).
- **Selo:** `save.selo` = último dia do selo (dia aprovado + 6 = 7 dias contando hoje; `normSave` aceita save sem ele). `Game.seloOn` (aprovado hoje, ou `save.selo >= dia`, só na carreira) soma `AVAL.amb.selo` = +0,5 no Ambiente e mostra o selo na parede da Avenida (`drawSeloVig`, na meia-parede de azulejo). No dia aprovado, 30% dos clientes satisfeitos comentam "Vi o selo da vigilância: lugar limpinho!".
- **Telas:** a introdução do dia avisa "Dizem que a vigilância sanitária está rondando a Avenida." (sem a hora); o fim do dia ganha a linha "Vigilância" (resultado e falhas) e, com multa, "Multa da vigilância" nas contas; o livro-caixa soma a multa em Contas (`row.vig`, com a explicação no title; `normCaixa` guarda `vig`).

## Testes
- `tests/smoke46.js` (novo, 44): sorteio (Garagem, industrial e 1º dia na Avenida: 0 em 400; 3º dia: ~15%; mesmo sorteio ao rejogar; 30% a 70%; Missão zero e Turno sem fim), aviso na introdução, cada falha (mesa suja 7,5 s não, mais de 8 s sim, limpar no meio zera; lixeira; pia 3 e 4), 0/1/2/3 falhas (selo, advertência, multa), multa no fim do dia, no dinheiro, no livro-caixa e na tela, selo no save e +0,5 no Ambiente por 7 dias, comentário do Gurugol, desenho (inclusive com movimento reduzido). O `smoke45` passou a aceitar qualquer `v9.x` na `VERSAO`.
- `carreira.js` ganhou a linha `FISCAL` (visitas e resultados; só com `MANUT=com`, que liga os imprevistos). `bot.js` não mudou.
- Capturas: `tests/shot_v9_4.js` (`capturas/v9_4`): introdução, fiscal entrando, com as 3 falhas, aprovado com o selo na parede e o fim do dia com multa e aprovado; PC e celular deitado, `ERRORS: []`.

## Números medidos
- `MANUT=com DIAS=50 node carreira.js 8`: 6 visitas em 8 carreiras (só 6 chegaram à Avenida até o dia 50); todas aprovadas, 0 multas (0% das visitas, abaixo do teto de 1 em 3; a mesa suja não precisou subir para 12 s).
