# v7.4.3 — TV e som na Garagem

Pedido do usuário em 21/10 (texto em `docs/PROPOSTAS.md`): o couvert artístico é só para o nível 3 do salão; no nível 1 (a Garagem) entram a televisão e o sistema de som, com o custo da luz na aba Equipe "por enquanto".

## Regras
- **Televisão** (`STAFF.tv`): TV de tubo passando a **Rede Esfera**. A paciência nas mesas cai **5%** mais devagar. Luz: **R$ 15/dia**.
- **Sistema de som** (`STAFF.som`): aparelho de som na rádio **Velha Brasil FM**. Mais **5%**, somado à TV (os dois: 10%). Luz: **R$ 10/dia**.
- Como o couvert, valem só nas mesas (não mexem na fila). `ambienteEffect(eq)` soma TV, som e couvert; `Group.patPer` divide o tempo por coração por `1 − efeito`.
- Não se compra nada: liga e desliga na aba Equipe da lojinha, e a luz do dia entra na folha (`payroll`), debitada ao abrir o dia (coluna "Equipe" do Caixa). Sem dinheiro para tudo, saem nesta ordem: divulgação, couvert, som, TV, Dani, aumento do Tonhão.
- **Couvert só do nível 3 em diante:** `PONTOS` ganhou `nivel` (Garagem = 1) e `STAFF.couvert.nivel = 3` (Restaurante na Avenida Brasil, etapa 3). Com `couvertOk(ponto)` falso, o card do couvert não aparece, `setStaff('couvert', true)` recusa e `normEquipe(e, ponto)` tira o couvert do save (o resto da equipe fica, inclusive a escolha da taxa). O código do couvert (músico, taxa) continua para a etapa 3.

## Desenho
- Estante de madeira no canto de baixo, à esquerda (embaixo de "Fila de espera", onde ficava o músico), só com o que estiver ligado (`drawAmbiente`, em `21-cenario.js`).
- `drawTv`: TV de tubo cinza com antena de duas varetas e botões. A tela alterna a cada 6 s entre o logo da Rede Esfera (esfera azul com anel), um jogo de futebol (bola andando) e uma novela (dois rostos e um coração); com `prefers-reduced-motion`, fica no logo, parada.
- `drawSom`: aparelho de som com duas caixas (os alto-falantes pulsam), visor verde com "VELHA BRASIL FM" correndo (parado com `prefers-reduced-motion`) e notas ♪ subindo.
- Na lojinha, um card só, "TV e som", com dois botões de ligar (aria-pressed) e o ícone dos dois aparelhos, para a aba Equipe continuar com 3 cards e o mesmo tamanho de antes.

## Equilíbrio
Sem equipe não muda. Com a equipe completa (Tonhão 3, Dani 3 em pratos, lavar e lixo), 60 rodadas por dia, dias 3 a 7 (`EQUIPE='{...}' DIAS=3,4,5,6,7 node balance.js 60`):

| Ambiente | Lucro médio por dia | Metas | Perdidos por dia |
|---|---|---|---|
| nada | R$ 1.017 | 290/300 | 3,2 |
| TV | R$ 1.031 | 291/300 | 2,9 |
| TV e som | R$ 1.050 | 293/300 | 2,8 |

Já descontada a luz, os dois se pagam com folga pequena: é uma escolha barata, não um salto. O `balance.js` e o `carreira.js` trocaram o couvert da equipe completa por TV e som.

## Testes
`smoke6` (105/105): folha com a luz, ordem de quem sai sem dinheiro, couvert fora da Garagem (save, `setStaff`, `couvertOk`), TV 5%, TV e som 10%, sem efeito na fila, só liga o que o dinheiro paga. O efeito do couvert (20%, 10% com a taxa) continua testado, ligado à mão.
