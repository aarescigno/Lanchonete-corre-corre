# v12.4.3 — O eFood só com as letras (etapa correção)

**Situação:** entregue em 19/11
**Origem:** conversa de 19/11, sobre a v12.4.2: "Muito opaco o efood, quero só as palavras, sem esse molde no fundo". Das três opções mostradas em captura, o usuário escolheu a C: "Gostei da C, implemente para eu testar".

## Objetivo
O letreiro do eFood fica só com a palavra, sem a faixa laranja de fundo.

## Fora do escopo
- O tempo (0,8 s), o acender e apagar, quem dispara (só o entregador) e o movimento reduzido: tudo como na v12.4.2.

## Regras (decisões tomadas)
- `drawEfoodFlash` (`src/23-render.js`): sai a faixa. Fica "eFood" no centro (x TW/2, y 150), letra do título tamanho 120, inclinada −0,06 rad, em três camadas: contorno escuro `#22201C` de 16 com um brilho laranja `#FFB36B` (shadowBlur 30), contorno branco de 7 e o recheio em `EFOOD_COR`.
- Modo dev, Manual e save: nada (o "Chegar entregador" já mostra).
- **Versão:** `VERSAO` e `vtag` em v12.4.3; linha no `#ov-ver`: **"O letreiro do eFood fica só com as letras, sem a faixa no fundo."**

## Critérios de aceite
- **CA1** O desenho escreve "eFood" com letra 120, no centro em y 150, e não pinta retângulo de fundo → `smoke105` (2)
- **CA2** O resto da v12.4.2 continua (o fx de 0,8 s, um de cada vez, a encomenda com o brilho, acende e apaga) → `smoke105` (5)

## Partes
- `src/23-render.js`: `drawEfoodFlash`. `src/10-constantes.js` e `src/02-telas.html`: `VERSAO`, `vtag`, `#ov-ver`.

## Tarefas
- [x] T1 `smoke105`: a checagem do desenho passa a letra 120, y 150 e sem fundo (falhando).
- [x] T2 O novo `drawEfoodFlash`.
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver` (`smoke86`, `menu_fit.py`), `docs/RESUMO.md`, spec entregue, `run_all.sh` verde.

## Testes
- `smoke105`: 8 checagens, no `run_all.sh`.
- `smoke86` e `menu_fit.py` (21 linhas no painel de Versões, o link da v9 nas linhas 12 e 13, o selo v12.4.3).
- `run_all.sh`: verde. Captura no pico e no meio do sumiço: a palavra some por igual.

## Decisões em aberto
Nenhuma.

## Desvios
- As três camadas vão inteiras numa tela à parte (`efoodCv`) e entram juntas com a opacidade: desenhadas direto, no meio do sumiço o contorno escuro aparecia através do laranja. Sem tela (nos testes), desenha direto.

**Modelo:** Sonnet, esforço baixo (troca de um desenho já escolhido em captura)
