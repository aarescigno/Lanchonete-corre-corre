# v9.0.2 — A divulgação chega com conversa (31/10/2026)

Retorno do usuário (`docs/PROPOSTAS.md`): quando a divulgação abre, falta um diálogo explicando que dá para divulgar para trazer mais gente; e o padrão devia ser o boca a boca.

## O que entrou
- **Divulgação no dia 4** (`DIVULGA_DIA` 3 → 4): os dias 1 a 3 são a inauguração (movimento cheio, sem custo).
- **Boca a boca por padrão:** `divulgaOf` cai no boca a boca (antes, panfletos) e o `normSave` põe `divulga:'boca'` enquanto o próximo dia é anterior ao `DIVULGA_DIA` (fora do modo dev). Quem já passou do dia 4 mantém a escolha.
- **Conversa da divulgação** (`HIST_DIVULGA`, `save.convDiv`: `'pend'` | 1), só no Modo História: fica pendente no fim do dia 3 (`DIVULGA_DIA − 1`, só esse dia: save antigo que já passou não vê). O Tonhão diz que a festa da inauguração acabou e agora é o boca a boca; a Bia propõe panfletos, o Tonhão lembra que custam e cita as redes sociais. No fim, a lojinha do dia 4 abre direto na Divulgação (`shopEntra = 'divulga'`). Vem depois das conversas de capítulo e da do cardápio (o `fluxoHistoria` agora segue depois da do cardápio).
- Como jogar: "Do dia 4 em diante… (de início, boca a boca: grátis, mas vem menos gente)". `VERSAO` 'v9.0.2'.

## Balanceamento
- O dia 3 fica um pouco mais fácil (sem os R$ 20 dos panfletos e com o movimento cheio). `balance.js` passa a usar panfletos por padrão (`DIV=boca` para o padrão do jogo); com 20 rodadas, o dia 3 passou 12/20 e os dias 4 a 7 de 9 a 14/20, dentro dos 40–70%.

## Testes
- `tests/smoke40.js` (11 checks): regras (dia 4, padrão boca a boca), a conversa no fim do dia 3 (lojinha na Divulgação, não repete) e sem História.
- Ajustados: `smoke9` (dia 4), `smoke11` (dia 3 sem divulgação; resumo "boca a boca"), `smoke17`, `smoke20`, `smoke25`, `smoke38` e `smoke.js` (fixam os panfletos onde o teste contava com eles).
- Já instáveis antes desta versão (rodando várias vezes): `smoke.js` (dia 8 em falência, ~10%), `smoke3` e `smoke38` (turmas).
