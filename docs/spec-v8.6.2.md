# v8.6.2 — Inconsistências da abertura

Pedido do usuário em 28/10 (texto em `docs/PROPOSTAS.md`): revisar a abertura em busca de inconsistências visuais ou interrupções que prejudiquem a estética, como a Rosa na cama sem corpo. As 10 cenas foram vistas em 4 andamentos (12%, 40%, 70% e 90%), com recortes ampliados nos trechos suspeitos.

## Achados e correções
- **Rosa deitada sem corpo** (`hospital`): o cobertor era uma faixa quase reta, rente ao colchão, e a cabeça parecia solta no travesseiro. Agora o pano tem o volume do corpo: os ombros logo abaixo do queixo (sob a dobra do lençol, mais fina), o peito, o quadril, os joelhos e os pés levantando o pano, que cai pela lateral do colchão, com a barra e duas dobras.
- **Rosa falando de olhos fechados** (`hospital`): os olhos abrem, olhando para a Bia, enquanto o balão dela está à vista (de 1,4 s a 5,2 s; ela pisca no ritmo dela) e voltam a fechar depois. Com movimento reduzido, o quadro parado (`pRM`) é o da fala, com os olhos abertos.
- **Cortina do leito curta** (`hospital`): parava 10 px acima do chão e deixava as pontas das pernas da cama e da cadeira à vista. Agora desce até o chão, e as pernas têm ponta reta.
- **Pote de moedas que sumia** (`banco`): quando a Bia chegava ao banco, o pote desaparecia de um quadro para o outro. Agora ela o põe no chão, ao lado dela, antes de erguer a mão para o papel, e ele fica lá até o fim da cena.

## Vistos e mantidos
- A Rosa passa na frente da porta da Casa Aurora antes de entrar (está na calçada) e só some lá dentro, recortada pelo vão.
- Na `estrela`, a folha da porta cobre metade da Rosa (ela está espiando), e o público, de costas, fica em parte sob a faixa da legenda.
- A colher da Rosa na `casa` e o braço erguido da Bia no `banco` seguem como na v8.6.1 (ajustados na revisão estética).

## Testes
- `run_all.sh`: todos passam (smokes 1 a 28).
- `python3 shot_v8_6_2.py` gera as capturas em `capturas/v8.6.2`: o hospital antes, durante e depois da fala e com a cortina fechada, e o banco com a Bia correndo e com o pote no chão.
