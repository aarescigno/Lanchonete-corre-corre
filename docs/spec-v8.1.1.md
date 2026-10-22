# v8.1.1 — Menos balões nas mesas

Ajuste visual pedido pelo usuário em 22/10 (retorno de jogador; texto em `docs/PROPOSTAS.md`): as mesas mostravam balão em todos os estados. Agora só aparecem os três que pedem algo da Bia.

## Antes
`drawTableOverlay` (em `22-salao-hud.js`) desenhava um balão em cada estado do grupo sentado: cardápio com anel azul (`reading`), "!" vermelho (`wantOrder`), panela no fogo com o visto verde quando o prato estava no balcão (`ordered`, desde a v7.4.2), o prato com anel verde (`eating`) e "$" amarelo (`wantBill`).

## Agora
- Ficam só o **cardápio com anel** (escolhendo), o **"!"** (chamando para anotar) e o **"$"** (pedindo a conta).
- Esperando a comida (`ordered`) e comendo (`eating`), a mesa fica sem balão. Os corações, o selo VIP, o cafezinho e o copinho de suco com o número continuam; quem come continua com os pratos na mesa e o balanço de quem come.
- Saem junto o visto verde de "prato no balcão" (o balcão da cozinha já mostra o prato pronto) e o ícone `pot` de `drawIcon` (em `20-desenho-base.js`), que só servia para esse balão.

Sem mudança de regra, equilíbrio ou testes (smokes 1 a 17 ok).
