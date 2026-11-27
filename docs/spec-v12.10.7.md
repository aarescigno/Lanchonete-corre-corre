# v12.10.7 — O couvert sem a porcentagem (etapa correção)

**Situação:** entregue em 27/11
**Origem:** conversa de 27/11: "na avenida brasil, no couvert artístico não precisa aparecer que o efeito cai para 10% quando cobra, pode deixar mais vago que o efeito é menor se cobrar das pessoas, lembra do sdd para jogo sem estimular calculos, apenas escolhas".

## Objetivo
No cartão do Couvert artístico (Avenida), o botão de cobrar diz só que o efeito fica menor, sem a porcentagem: é uma escolha, não uma conta.

## Regras (decisões tomadas)
- **Botão** (`buildCouvert`, `src/41-lojinha.js`): o texto passa de `'Cobrar couvert: R$ X por pessoa (efeito cai para N%)'` a `'Cobrar couvert: ' + fmt(C.fee) + ' por pessoa (o efeito fica menor)'`; sai a conta do `ef`. O preço em R$ fica (a regra dos cartões: nome e preço).
- O efeito no jogo (`couvertEffect`), a ficha `l-couvert` do Manual e o save não mudam.
- **Versão:** `VERSAO` e `vtag` (texto e `aria-label`) em v12.10.7; linha nova no topo do `#ov-ver`, com o "versão atual" saindo da v12.10.6: **"O couvert artístico não mostra mais a porcentagem: só que o efeito fica menor se cobrar."**, data 27/11/2026.

## Critérios de aceite
- **CA1** No cartão do couvert da Avenida, o botão diz "(o efeito fica menor)" e não tem "%" → `smoke124` (1)
- **CA2** A `VERSAO` é v12.10.7 ou mais nova → `smoke124` (1)

## Testes
- Novo: `smoke124` (2 checagens).
- Mudam: `smoke86` e `menu_fit.py` (o `#ov-ver` com 40 linhas); `smoke123` (a `VERSAO` passa a aceitar a v12.10.6 ou mais nova).
- Sem balanceamento (nada muda na partida).

## Decisões em aberto
Nenhuma.

## Desvios
- `tests/run_all.sh` ganhou o `smoke124.js` na lista.
- Medido: o botão diz "Cobrar couvert: R$ 8 por pessoa (o efeito fica menor)".
- `smoke76`: a checagem do `versoes/v10.html` falha neste ambiente (clone raso, sem o commit da v10.10).

**Modelo:** Haiku, esforço baixo (um texto no cartão e a versão)
