# v8.9.1 — Ajustes da lojinha (etapa 2c-r5)

Só a lojinha (`src/41-lojinha.js`, `src/01-estilo.css`) e os testes; nenhuma regra de jogo nem o balanceamento mudam.

- **TV e som** saiu da Divulgação e foi para Melhorias (`buildTvSom`); o couvert fica na Divulgação (`buildCouvert`).
- **Toalha xadrez em todas as mesas** saiu da Decoração (agora 6 cartões) e entrou no painel do Salão, abaixo de "Mesa de 4", com uma linha de contas explicando o efeito e quantas mesas têm.
- **Ícones da equipe:** Bia, Tonhão e Dani aparecem inteiros no cartão, sem corte. O Tonhão usa `abTonhao` (corpo inteiro, com touca) também no cartão da seção; `ctx2chef` foi apagada.
- **Cartão Manutenção:** amarelo (`alerta`) com algum equipamento abaixo de `MANUT.verde` (0,7), vermelho (`perigo`) abaixo de `MANUT.vermelho` (0,4), com `aria-label` ("precisa de revisão" / "risco de quebra").
- **Testes:** smoke9, 12, 15, 30 e 33 ajustados e ampliados (TV e som em Melhorias, Decoração com 6 cartões, toalha no Salão, cor da Manutenção). Capturas em `capturas/v8.9.1`.
