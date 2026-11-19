# v12.4.2 — O letreiro grande do eFood quando chega o entregador (etapa correção)

**Situação:** entregue em 19/11
**Origem:** conversa de 19/11: "o brilhinho do eFood que acontece ali é muito pequeno em cima só do entregador. Ele tinha que ser uma mensagem que pisca grande na tela, cobrindo quase todo o quarto superior do salão, e que seja rápido, que dure menos de um segundo, piscando fade in, fade out, eFood."

## Objetivo
Quando chega um entregador do eFood, pisca no alto do salão um letreiro grande "eFood", no lugar do brilho do entregador.

## Fora do escopo
- A encomenda do setor (é "sem Efood"): continua com o brilho de 1,2 s.
- A buzina e o texto "Pedido na Efood!", que continuam.

## Regras (decisões tomadas)
- `ENTREGA_CHEGA` (`src/10-constantes.js`) passa a `{ brilho:1.2, letreiro:0.8 }`: o brilho fica só para a encomenda; o letreiro dura 0,8 s.
- Em `spawn` (`src/16-jogo.js`): entregador (sem `lote`) → `this.addLetreiro()`, um fx `{ k:'efood', life:0, max:ENTREGA_CHEGA.letreiro }` (um só de cada vez: o novo substitui o anterior); encomenda → o brilho de antes.
- Desenho (`src/23-render.js`, na tela, por cima do salão e abaixo da dica): faixa arredondada na cor `EFOOD_COR`, de x 24 a TW−24 e y 96 a 200 (o quarto de cima do salão, que vai de y 92 a 540), borda branca, e "eFood" em branco, letra do título, tamanho 84, no centro. Opacidade `sin(π·p)` (p = life/max): sobe e desce. Com movimento reduzido, opacidade fixa de 0,9 durante os 0,8 s.
- Modo dev: o botão "Chegar entregador" já mostra o letreiro. Manual e save: nada.
- **Versão:** `VERSAO` e `vtag` em v12.4.2; linha no `#ov-ver`: **"Quando chega um entregador, pisca um letreiro grande do eFood no alto do salão."**

## Critérios de aceite
- **CA1** O entregador que chega cria um fx `efood` de 0,8 s e não ganha mais o brilho → `smoke105` (2)
- **CA2** A encomenda continua com o brilho de 1,2 s e sem letreiro → `smoke105` (1)
- **CA3** Dois entregadores seguidos deixam um só letreiro; o fx some depois de 0,8 s → `smoke105` (2)
- **CA4** O desenho do letreiro escreve "eFood" com letra 84 dentro de y 96–200, e a opacidade no meio passa de 0,9 e no começo e no fim fica abaixo de 0,2 → `smoke105` (2)

## Partes
- `src/10-constantes.js`: `ENTREGA_CHEGA`, `VERSAO`. `src/16-jogo.js`: `addLetreiro`, `spawn`. `src/23-render.js`: `drawEfoodFlash` (o letreiro na tela). `src/02-telas.html`: `vtag`, `#ov-ver`.

## Tarefas
- [x] T1 `tests/smoke105.js` com CA1 a CA4 (falhando), no `run_all.sh`.
- [x] T2 `addLetreiro`, a troca no `spawn` e o desenho.
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver` (`smoke86`, `menu_fit.py`, `smoke95` CA10), `docs/RESUMO.md`, spec entregue, `run_all.sh` verde.

## Testes
- `smoke105`: 7 checagens, no `run_all.sh`.
- `smoke86` e `menu_fit.py` (20 linhas no painel de Versões, o link da v9 nas linhas 11 e 12, o selo v12.4.2); `smoke95` CA10 (a chegada acende o letreiro, no lugar do brilho).
- `run_all.sh`: verde. Captura do salão da área industrial com o letreiro no meio do piscar: a faixa cobre o alto do salão, da calçada à cozinha.

## Decisões em aberto
Nenhuma.

## Desvios
- Planejada e executada na mesma sessão, a pedido direto do usuário (correção pequena).
- O `drawEfoodFlash` e o `efoodFlashA` foram expostos no `window.__lcc` para o `smoke105`.

**Modelo:** Sonnet, esforço médio (efeito de desenho pequeno, tudo decidido)
