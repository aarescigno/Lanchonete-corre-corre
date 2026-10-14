# Lanchonete Corre-Corre — v3 (clientes VIP)

## Regra
- VIP é um **modificador de grupo**, não um tipo novo: estudante, vovós, família ou executiva podem vir como VIP. O entregador nunca vem como VIP.
- Constante `VIP` em `lanchonete.html`:
  - paciência ×0,75;
  - gorjeta +50% sobre a conta;
  - bônus de R$ 40 se pagar com 5 corações;
  - multa extra de R$ 30 se sair bravo (total de −R$ 60).
- **Fura a fila:** entra na frente dos grupos comuns, mas atrás de outros VIPs que já estão esperando. Com a fila lotada, volta com "Lotado!" como qualquer grupo.
- **Carreira:** a partir do dia 5 (campo `vip` em `DAYS`, probabilidade de 0,15 por grupo). No dia 5 sempre aparece pelo menos um, entre os grupos 2 e 4.
- **Turno sem fim:** probabilidade de 0,12 por grupo, só depois do 1º minuto. Bravo tira 1 estrela, como os outros grupos.

## Visual
- Todos os membros usam óculos escuros (`p.shades`).
- Plaquinha dourada "★VIP" ao lado dos corações, na fila e na mesa. O texto acompanha a cor, por acessibilidade.
- Ao chegar, o grupo mostra "VIP chegou!" na porta e toca um som de dois tons. Ao sair com 5♥, aparece "VIP satisfeito! +40".
- O fim de dia mostra a linha "VIPs" (atendidos e bravos), só quando houve VIP. O fim do Turno sem fim mostra "VIPs atendidos".
- O "Como jogar" ganhou uma 6ª dica, a intro do dia 5 explica o VIP e o painel Versões tem a entrada da v3, com link para a v2.

## Balanceamento
- Bot com 80 rodadas: o dia 7 caiu de 74/80 para 62/80 metas batidas, por causa da multa dobrada no dia mais lotado. A meta do dia 7 baixou de R$ 1350 para R$ 1300, e o bot voltou a ~70/80. Os outros dias ficaram iguais.
- Save sem mudança de formato: continua `lcc2_save`.
