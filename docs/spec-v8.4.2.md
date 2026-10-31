# v8.4.2 — Aba Gurugol na lojinha e critérios com nomes mais claros

Pedido do usuário em 26/10 (texto em `docs/PROPOSTAS.md`): trocar "Prato" por "Qualidade da comida" e "Cardápio" por "Diversidade do cardápio", e criar no menu entre os dias (a lojinha) uma aba só do Gurugol, com os últimos comentários.

## O que mudou
- **Critérios** (`AVAL_CRIT`): "Qualidade da comida" (era Prato) e "Diversidade do cardápio" (era Cardápio), na caixa do fim do dia, no `title`, no resumo do Caixa e no Como jogar. O elogio do cardápio virou "Cardápio bem variado!".
- **Comentários guardados:** no fim de cada dia completo, cada avaliação vai também para `save.avalCom` (os últimos `AVAL_COM` = 30): `{ d: o dia, n: a nota ×10, t: o comentário, k: o tipo do grupo, v: VIP }`; `normAvalCom` limpa o save. Os comentários de antes da v8.4.2 não foram guardados, então a lista começa vazia e enche a partir do próximo dia.
- **Aba Gurugol** (`buildGurugol`, em `41-lojinha.js`), entre Banco e Caixa:
  - à esquerda, a caixa do fim do dia (`gurugolCaixa`, que agora aceita o texto de baixo, "média das últimas N avaliações") e o efeito no movimento;
  - à direita, os comentários, do mais novo para o mais velho, em cartões com as estrelas (as vazias em cinza), a nota, quem escreveu ("Família", "Executiva (VIP)") e o dia. A lista rola dentro da aba quando não cabe;
  - sem nenhuma avaliação: "Ainda ninguém avaliou a lanchonete no Gurugol...".
- O bloco do Gurugol saiu da aba Caixa (ficou na aba nova); o resumo para o WhatsApp continua com a nota.
- O comentário decide entre elogio e reclamação pela nota que aparece, com uma casa (3,96 aparece como 4,0 e elogia).

## Testes
- `smoke25.js` (48): os nomes novos, os comentários no save (`normAvalCom`), a aba Gurugol (a caixa, o movimento, a ordem dos comentários com quem e o dia, a aba vazia) e o Gurugol fora do Caixa.
- `python3 shot_v8_4_2.py` gera as capturas em `capturas/v8.4.2` (a aba no PC e no celular deitado, e o fim do dia com os nomes novos).
