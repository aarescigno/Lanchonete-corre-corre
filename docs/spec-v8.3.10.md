# v8.3.10 — Triturador de lixo e lixeira que mostra que encheu

Pedido do usuário em 24/10 (texto e medição em `docs/PROPOSTAS.md`): "faz o triturador com 30 s e muda o ventilador para só fazer as pessoas comerem mais rápido. Também adicione mais evidência de que a lixeira está cheia, fazendo-a variar de cor entre a lata cinza e ela esverdeada, mude o sprite dela quando cheia para uma com saco de lixo preto ao lado com fumacinha verde saindo dele".

## O que mudou
- **Triturador de lixo** (melhoria nova, R$ 180, `UPGRADES`): com lixo na lixeira, mói 1 gominho a cada `TRASH.tritura` = 30 s (`Game.update`, relógio `g.trituraT`, que só anda com lixo na lixeira e zera quando ela esvazia). Ainda é preciso esvaziar: sem equipe, o bot esvazia de 0,3 a 1,1 vez por dia (contra 0,8 a 1,7 sem o triturador), porque entra 1 gominho a cada ~20 s.
- **Ventilador de teto:** só faz a freguesia comer 15% mais rápido. O cheiro da lixeira cheia (`TRASH.smell`, paciência 30% mais rápida) volta a valer com ele. O preço continua R$ 250.
- **Lixeira** (`drawTrash`, em `21-cenario.js`): a lata e a tampa vão do cinza (vazia) ao verde (cheia), conforme o lixo (`mixCor`, `TRASH_COR`). Cheia, a tampa fica levantada pelo lixo, aparece um saco de lixo preto amarrado à esquerda (à direita fica a parede da cozinha) e sobe fumacinha verde do saco e da lata (`drawFumacaVerde`, parada com `prefers-reduced-motion`). A plaquinha "CHEIO" e os tracinhos do nível continuam.
- Com o Triturador comprado, uma caixinha de inox aparece à direita da lata, com um anel verde que mostra o tempo até moer o próximo gominho.
- **Lojinha:** a aba Melhorias passa a ter 4 colunas (`.shopgrid.melhorias`), para os 7 cartões caberem em 2 fileiras; 2 colunas no celular em pé.

## Números
- `balance.js 30`: metas nos dias 3 a 7 com `EQUIPE=auto` em 89% e sem equipe em 73%, como na v8.3.9 (o cheiro de volta com o Ventilador quase não pesa: a Dani esvazia antes de encher, e sem equipe o bot já esvaziava).
- As ordens de compra do bot (`balance.js`, `carreira.js`, `emprestimo.js`) não incluem o Triturador.

## Testes
- `smoke6.js`: o Ventilador não tira mais o cheiro; o Triturador não mói sem ele, não anda o relógio com a lixeira vazia, tira 1 em 30 s e, com a lixeira cheia, ela continua quase cheia.
- `smoke5.js` (8 melhorias) e `smoke12.js` (7 cartões na grade).
- `python3 shot_v8_3_10.py` gera as capturas em `capturas/v8.3.10` (a lixeira com 0, 3, 5 e 6, com e sem o Triturador, e a aba Melhorias no PC e no celular).
