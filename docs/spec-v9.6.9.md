# v9.6.9 — A tela respira (etapa 3e-1)

Resposta ao "a UI não se expande de acordo com o gameplay" (Renan, 01/11); levantamento em `capturas/3e`. Sem mudar números do jogo.

## O que mudou
1. **Textos flutuantes:** nenhum é desenhado acima de y 170 (`render`, `Math.max(f.y,170)`); em `addText`, se já há um texto vivo (`life > 0.7`) a menos de 60 px em x e 22 px em y, o novo nasce 24 px abaixo (até 3 vezes). Os balões do Gurugol não mudam.
2. **Crachás** (Dani, Joca, Cami, Anselmo): só nos primeiros 20 s do dia, sumindo de 17 a 20 s (de uma vez com `prefers-reduced-motion`); no modo dev e fora do dia, sempre (`CRACHA_A`, ajustado em `render`).
3. **Selo "NOVO!" da vitrine de doces:** embaixo da vitrine, centrado, sem girar.
4. **Selo da fila** de doces, drinks e espresso (`filaPos`): à esquerda da estação, na metade da altura, empilhando para baixo.
5. **Espera da Avenida** (`QUEUE.max >= 5`): grupos em escala 0,85; corações em escala 0,75 à direita do grupo, na altura do balão do pedido. Em todos os pontos, os números dos lugares são desenhados depois das pessoas (`drawLugarNums`).
6. **Lojinha:** a linha do dinheiro perde a lista de reservados ("livre R$ X").

## Testes
`smoke55.js` (10 checagens): texto de y 120 desenhado em 170; empilhamento de 24 px; crachá aparece aos 5 s, some aos 25 s e volta no dia seguinte; `filaPos` das 3 estações à esquerda; lojinha sem "reservados para". `smoke17` ajustado (sem a lista). `exporta` `filaPos` e `STATIONS` em `__lcc`.
