# v8.6.14 — Melhorias à vontade e fim do dia sem o "(n)"

Etapa 2c-r4a (`docs/PLANO.md`), pedido do usuário de 30/10.

## O que mudou
- **Sem o limite de 1 melhoria por dia.** O limite agora é o dinheiro. `buy` (`16-jogo.js`) só recusa melhoria já comprada, sem dinheiro ou sem o `req` (Tênis de corrida pedem os Tênis novos). Saíram `shopBought` e `boughtFor` do jogo. **Os cursos do Tonhão seguem 1 por lojinha** (`cursoTrava`).
- Textos: `#shop-limit` diz "Melhorias à vontade, se o dinheiro der. Cursos: 1 por dia." (o modo dev não mudou); sai "fora da melhoria do dia" da descrição do Jogo de pratos e dos comentários.
- **Fim do dia sem o "(n)":** `gurugolCaixa(a, sub, semCnt)` ganhou o 3º parâmetro; o fim do dia passa `true`. A aba Gurugol da lojinha, o `aria-label` e o `title` continuam com o número.

## Testes
- Ajustados: `smoke.js`, `smoke12.js`, `smoke13.js`, `smoke23.js`, `smoke29.js`, `smoke30.js` (passam a conferir que dá para comprar 2 melhorias na mesma lojinha).
- Novo `smoke32.js` (10 checagens): Tênis, Bandeja e Ventilador na mesma lojinha; recusa sem dinheiro e da mesma melhoria 2 vezes; Tênis de corrida antes dos novos recusado; 2º curso no dia recusado; caixa do fim do dia sem "(n)" e aba Gurugol com.
- `carreira.js`: o bot compra, na ordem de sempre, tudo o que o dinheiro der, guardando a reserva de R$ 300 (do dia 3 em diante).

## Números (só medir, sem reajustar preços)
- `balance.js` (dias soltos, compras fixas por dia) não muda: sem equipe, `EQUIPE=auto` e `BOT=afiado` ficam como na v8.6.13 (sem equipe dia 3 a 7: 16/20, 14/20, 14/20, 11/20 e 8/20 passam; auto: 20, 17, 19, 19 e 20 de 20; afiado: 3, 5, 7, 2 e 5 de 20).
- `carreira.js 20` (campanha de 14 dias): antes, 19/20 chegavam a R$ 800 (dia mediano 9); depois, 20/20 (dia mediano 9). Caixa na lojinha do dia 14: R$ 723 antes e R$ 918 depois. Passam as metas dos dias 12 a 14 em 16/20, 16/20 e 18/20 (antes 19, 18 e 20): o bot gasta mais cedo e chega com a cozinha mais gasta. Cursos: o pastel sai no dia 10 (antes 8) e os outros no mesmo dia; assados e PF avançado caem para 16/20 e 5/20 até o dia 14.
- **Leitura:** a regra deixa o jogo um pouco mais fácil na caixa e um pouco mais apertado nas metas do fim; se o usuário achar fácil demais, o reajuste de preços é outra conversa.
