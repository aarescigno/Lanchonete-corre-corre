# Plano de novidades (uma etapa por sessão)

Origem: retorno do Renan Martorelli e conversa com o Arthur (15/10/2026). Os textos originais e o destino de cada ideia estão em `docs/PROPOSTAS.md` (log de propostas). Os pedidos foram escassez de recursos, custos de manutenção, divulgação, aluguel em área nobre com VIPs exigentes e modo história ("o sonho da Bia de ter um restaurante estrelado, começando do zero"). A v7 (Contas) fez a primeira parte.

## Como usar
- Cada etapa cabe numa sessão e termina como as outras: versão nova (se mexe no jogo), testes verdes, `docs/spec-vN.md`, `RESUMO.md` atualizado, PR com merge no `claude/main` e publicação no artifact (ver `CLAUDE.md`).
- Para começar uma sessão, basta pedir: **"faça a próxima etapa do docs/PLANO.md"**. A sessão lê só a etapa da vez e as partes de `src/` citadas nela.
- Antes de programar, a sessão confirma com o usuário as **decisões em aberto** da etapa (cada uma já tem uma sugestão).
- No fim, a sessão marca a etapa como feita na tabela abaixo (com a versão e a data) e anota o que mudou no plano.
- Ordem: cada etapa depende só das anteriores. A 1a vem primeiro (mexe no equilíbrio de base). A 1b e a 2 podem trocar de lugar. A 3 vem antes da 4, e a 4 antes da 6.

## Situação
| # | Etapa | Versão | Situação |
|---|---|---|---|
| 0 | Contas: lucro, ingredientes, contas do dia, divulgação | v7 | feita (15/10) |
| 1a | Jogo justo: dá para não perder ninguém | v7.1 | feita (15/10) |
| 1b | Livro-caixa e ajuste fino com jogadores | v7.2 | a fazer |
| 2 | Manutenção e imprevistos | v8 | a fazer |
| 3 | Ponto: mudar para o Centro | v9 | a fazer |
| 4 | Área nobre e VIPs exigentes | v10 | a fazer |
| 5 | Modo História, parte 1: estrutura e primeiros capítulos | v11 | a fazer |
| 6 | Modo História, parte 2: subir de ponto, crítico do guia e final | v12 | a fazer |
| 7 | Polimento: celular, ranking da história, ajuste geral | v12.1 | a fazer |

---

## Etapa 1a — Jogo justo: dá para não perder ninguém (v7.1)
> **Feita em 15/10 (v7.1, `docs/spec-v7.1.md`).** Decisões: A + B; no Turno sem fim vale o ritmo da fila justa, sem o piso; ícone "aguardando mesa" sim. A medição mostrou que, com a equipe, a maior parte das perdas era a espera pelo prato, e não a fila. O que sobra é o limite de louça nos dias de 6 mesas: o bot afiado só chega ao alvo (0 perdidos em 94% dos dias) comprando o Jogo de pratos primeiro. A louça não mudou; se jogadores reclamarem da espera pelo prato, a etapa 1b pode rever `dishStock` ou a mecânica D. Metas sem mudança.

**Objetivo:** atender o retorno do Renan (áudio em `docs/PROPOSTAS.md`). Quem joga com perfeição pode terminar com menos corações, mas consegue não perder ninguém. Perder um cliente tem que ser culpa da velocidade ou da prioridade do jogador.

**Situação hoje (v7):** com a equipe completa, o bot ainda perde 0,6 a 2,6 grupos por dia nos dias 3 a 7, e a 3ª estrela exige zero perdas. O caso dele é a fila cheia com todas as mesas ocupadas: a fila perde a paciência sem que dê para fazer nada além de cafezinho e água.

**Passos:**
1. **Medir onde se perde.** `balance.js` passa a contar as perdas por causa:
   - na fila sem mesa livre que caiba o grupo;
   - na fila com mesa livre;
   - esperando pedido, prato ou conta;
   - VIP.

   Também conta quanto tempo o salão fica lotado com a fila cheia. Só assim dá para separar o que é impossível do que é falha do bot.
2. **Bot afiado:** melhorar a prioridade do bot (quem está para sair primeiro) para ele servir de "jogador perfeito". Se o bot afiado ainda perde gente, a conta do jogo está apertada demais.
3. **Mecânicas candidatas** (escolher na sessão; sugestão: A + B):
   - **A. Fila justa:** enquanto não há mesa livre que caiba o grupo, a paciência na fila cai bem mais devagar (ex.: 40%) e não passa de 1 coração. Ela volta ao ritmo normal quando abre uma mesa que serve. Um ícone "aguardando mesa" mostra isso.
   - **B. Porta que respeita a lotação:** com o salão cheio e a fila com 3 ou mais grupos, as próximas chegadas atrasam um pouco em vez de se empilhar. O total do dia não muda, só o ritmo.
   - C. Ajuste de corações e paciência por tipo (entregador e VIP são os mais apertados).
   - D. Mesas que esvaziam mais rápido ao final (a conta pedida mais cedo), se a medição mostrar que o gargalo é a mesa ocupada.
4. **Recalibrar:** com menos perdas, o lucro sobe. Conferir as metas (`balance.js`) e a escassez (`carreira.js`, alvo da v7 no dia 5).

**Alvos:**
- Bot afiado com a equipe completa: **0 perdidos em ≥ 80% dos dias 3 a 7** (média < 0,3).
- 3 estrelas possíveis em todos os dias.
- Sem equipe, perder gente continua normal: a equipe segue valendo a pena.
- Turno sem fim: continua acabando um dia, mas por velocidade, não por conta impossível.

**Partes:** `12-clientes.js` (paciência na fila), `16-jogo.js` (chegadas, causa da perda), `22-salao-hud.js` (ícone "aguardando mesa"), `10-constantes.js`, `tests/bot.js` e `botpage.js`, `tests/balance.js`.

**Testes:** `smoke10` (paciência na fila com e sem mesa livre, piso de 1 coração, atraso das chegadas, contagem por causa). `balance` com as perdas por causa.

**Decisões em aberto:**
- Quais mecânicas (sugestão: A + B)?
- A fila justa vale também no Turno sem fim (sugestão: sim, com o ritmo apertando com o tempo como hoje)?
- Mostrar o ícone "aguardando mesa" na fila (sugestão: sim)?

---

## Etapa 1b — Livro-caixa e ajuste fino (v7.2)
**Objetivo:** ver a escassez com números de jogo real (não só do bot) e ajustar os botões da v7 antes de empilhar mais sistemas.

**Entra:**
- `save.caixa`: registro dos últimos 14 dias jogados na carreira, com dia, faturamento, ingredientes, contas, folha, divulgação, lucro, compras na lojinha e saldo ao fim.
- Aba **Caixa** na lojinha: tabela curta com os últimos dias e uma linha "para onde foi o dinheiro" (melhorias, salão, equipe, contas). Ajuda o jogador a sentir a escassez e o playtester a relatar.
- Botão "Copiar resumo" no Caixa: texto pronto para colar no WhatsApp (dias, lucro, saldo e compras). É o jeito mais simples de o Renan e o Arthur mandarem os números.
- Ajuste de `INGRED`, `CONTAS`, `DIVULGA` e das metas com o que chegar dos jogadores. Se ainda sobrar dinheiro no dia 5, comece por `INGRED.prato` 0,6 → 0,7.

**Fora:** sistemas novos.

**Partes:** `12-clientes.js` (save), `16-jogo.js` (`finishDay`, compras), `41-lojinha.js`, `02-telas.html`, `01-estilo.css`.

**Testes:** `smoke11` (registro, limite de 14, resumo em texto, save antigo sem `caixa`). `carreira.js` continua sendo a referência.

**Pronto quando:** o Caixa aparece desde o dia 2, o resumo copia, `carreira.js` e `balance.js` passam nos alvos, e houve pelo menos 1 rodada de retorno de jogador (ou o usuário dispensou).

**Decisões em aberto:**
- O Caixa fica numa aba da lojinha (sugestão) ou num painel do menu?
- Quantos dias guardar (sugestão: 14)?

---

## Etapa 2 — Manutenção e imprevistos (v8)
**Objetivo:** gastos recorrentes com escolha (a "manutenção do espaço" do Arthur), sem virar só um imposto.

**Entra:**
- **Desgaste:** fogão, geladeira e cafeteira (e a chapa, se for o caso) têm um estado de 100% a 0%, que cai um pouco por dia de uso e mais em dias cheios.
- **Manutenção preventiva** na lojinha: pagar R$ X para voltar a 100%. Sem manutenção, cresce a chance de **imprevisto** no dia:
  - geladeira quebrada: ingredientes +20% naquele dia;
  - fogão falhando: Tonhão 20% mais lento;
  - cafeteira parada: sem cafezinho.
- Conserto de emergência durante o dia, mais caro que a preventiva.
- Aviso na introdução do dia e um ícone no cenário (fumacinha, poça, "fora de serviço" na cafeteira).
- Imprevistos raros e sem culpa: **chuva** (menos gente, mais entregadores) e **feriado** (mais gente). Eles dão variedade e testam a reserva de dinheiro.

**Fora:** troca de equipamento por modelo melhor (fica para depois, se fizer falta).

**Partes:** `10-constantes.js` (`MANUT`), `16-jogo.js`, `13-cozinha.js`, `14-bia.js` (cafezinho), `21-cenario.js` (sinais visuais), `41-lojinha.js`, `43-telas.js` (introdução).

**Testes:** `smoke12` (desgaste, chance de quebra, conserto, efeitos e save). `balance` com e sem manutenção.

**Calibração:**
- Cuidar de tudo custa ~10–15% do lucro de um dia médio.
- Sem nenhuma manutenção, ~1 imprevisto a cada 3 dias a partir do dia 4.

**Decisões em aberto:**
- Quais equipamentos (sugestão: fogão, geladeira e cafeteira)?
- Conserto de emergência dentro do dia (sugestão: sim, com um toque no equipamento quebrado) ou só na lojinha?
- Chuva e feriado entram aqui ou numa etapa própria?

---

## Etapa 3 — Ponto: mudar para o Centro (v9)
**Objetivo:** primeira decisão grande de dinheiro, "alugar espaço maior e melhor", com mecânica genérica de **ponto** que a etapa 4 só preenche com mais um.

**Entra:**
- `PONTOS`: Bairro (o de hoje) e **Centro**, cada um com aluguel, multiplicador do preço do cardápio, mistura de clientes, chance de VIP, número de vagas de mesa e custo de mudança.
- O Centro tem aluguel ~2×, preços +20%, mais executivas e VIPs e espaço para 1 mesa a mais por fileira (ou fileiras mais largas).
- **Mudança** na lojinha (aba Salão ou aba nova "Ponto"): custo único (reforma + caução). O salão comprado vai junto (mesas e cadeiras), com ajuste se não couber.
- Visual do ponto: cor do piso, fachada/letreiro e vista da janela diferentes. Sem arte nova pesada: só paleta e detalhes.
- Metas por ponto: a mesma meta de lucro com multiplicador por ponto, ou metas próprias calibradas com o bot.

**Fora:** área nobre, VIP exigente e modo história.

**Partes:** `10-constantes.js`, `12-clientes.js` (save `ponto`, preço), `16-jogo.js` (agenda, contas), `20/21-*.js` (paleta e fachada), `41-lojinha.js`.

**Testes:** `smoke13` (mudança, custo, salão levado junto, contas e preços por ponto, save antigo = Bairro). `carreira.js` com mudança no dia 4 ou 5.

**Calibração:**
- Mudar para o Centro deve compensar em ~3 dias para quem atende bem e não compensar para quem perde muitos clientes.
- No dia 5, o jogador deve ter que escolher entre a mudança e (salão + melhorias).

**Decisões em aberto:**
- A mudança é permanente ou dá para voltar ao Bairro?
- As metas da carreira mudam com o ponto ou ficam fixas (aí o Centro vira atalho para estrelas)?
- Nome dos pontos (sugestão: "Bairro", "Centro", "Jardins" para a área nobre, sem nome de bairro real se preferir).

---

## Etapa 4 — Área nobre e VIPs exigentes (v10)
**Objetivo:** o topo da escada de pontos, com o cliente que o Arthur descreveu: "VIPs exigentes que entram e pedem pratos especiais".

**Entra:**
- 3º ponto, **área nobre**: aluguel alto, preços +45%, VIPs frequentes.
- **VIP exigente** (só na área nobre e no fim da história):
  - pede o **prato da casa**, que só sai caprichado ★ se o Tonhão tiver aumento (ou demora o dobro);
  - às vezes pede uma **bebida específica** (suco ou café) antes do prato;
  - não aceita mesa suja ao sentar;
  - paga muito bem (bônus grande com 5 corações) e, se sair bravo, deixa **avaliação ruim**: −10% de clientes no dia seguinte.
- **Reputação do ponto** (0 a 5 ★, média móvel dos últimos dias): na área nobre ela muda a freguesia do dia, e na etapa 6 vira a régua do guia.
- Um item de lojinha da área nobre, por exemplo "Louça fina": prato especial mais rápido.

**Partes:** `10-constantes.js`, `12-clientes.js` (tipo/modificador exigente), `13-cozinha.js` (prato da casa), `16-jogo.js` (reputação), `20-desenho-base.js` (visual do exigente, sem estereótipo: chapéu/lenço e plaquinha ★★), `22-salao-hud.js` (balão do pedido especial).

**Testes:** `smoke14` (pedido especial, regras de mesa, avaliação ruim, reputação e save). `balance` na área nobre com equipe completa.

**Calibração:**
- A área nobre dá mais lucro só com equipe completa + Tonhão nível 3 + salão bem montado.
- Para quem não está pronto, é um passo arriscado: lucro abaixo do Centro.

**Decisões em aberto:**
- A reputação aparece já na carreira ou só no modo história (sugestão: aparece só a partir da área nobre)?
- O que o exigente usa para se distinguir visualmente.

---

## Etapa 5 — Modo História, parte 1 (v11)
**Objetivo:** "o sonho da Bia de ter um restaurante estrelado, começando do zero". A estrutura do modo e os primeiros capítulos, usando só o que já existe (Bairro).

**Entra:**
- Botão **História** no menu, ao lado de Carreira e Turno sem fim. Save próprio (`save.historia`), sem mexer na carreira.
- **Começo do zero:** a Bia abre a lanchonete com pouco dinheiro, 3 mesas e sem equipe. O Tonhão aceita trabalhar "pelo prato do dia". Uma dívida pequena de abertura (empréstimo do Seu Zé) se paga aos poucos.
- **Capítulos:** cada um tem alguns dias, um objetivo (lucro acumulado, reputação, contratar alguém, quitar a dívida) e um cartão de conversa curto antes e depois (Bia, Tonhão, Seu Zé, Dani), com 2 a 4 falas em balões sobre o cenário.
  - Cap. 1, "A esquina": 3 dias, aprender o ciclo e fechar no azul.
  - Cap. 2, "A Dani chega": contratar a Dani e quitar metade da dívida.
  - Cap. 3, "Casa cheia": bater a meta com panfletos e um dia de redes sociais.
- Os dias da história reaproveitam `DAYS` com ajustes por capítulo: `HISTORIA = [{ cap, titulo, dias:[...], objetivo, falas }]`.
- Tom: leve e otimista. O "universo paralelo em que meritocracia é possível" pode ser uma piscadela no texto de abertura, se o usuário quiser.

**Fora:** troca de ponto na história, crítico do guia e final.

**Partes:** `02-telas.html` (menu e painel de conversa), `10-constantes.js` (`HISTORIA`), `16-jogo.js` (modo `historia`, objetivos), `40-interface.js`, `42-resultados.js`, `43-telas.js`.

**Testes:** `smoke15` (início do zero, objetivo cumprido e falhado, save separado, carreira intocada). O bot joga os capítulos 1 a 3.

**Decisões em aberto:**
- O texto de abertura e o tom do "universo paralelo".
- Quem é o Seu Zé na história (dono da lojinha e credor?).
- Falha num capítulo: repetir o dia (sugestão) ou o capítulo inteiro?

---

## Etapa 6 — Modo História, parte 2 (v12)
**Objetivo:** a escada até a estrela.

**Entra:**
- **Capítulos de mudança:** o Centro (cap. 4 e 5) e a área nobre (cap. 6), com objetivos de reputação e de lucro, usando os pontos das etapas 3 e 4.
- **O crítico do guia:** um guia gastronômico **inventado**, por exemplo "Guia Garfo de Ouro". Não usar "Michelin" nem outra marca real.
  - No capítulo final, um cliente disfarçado aparece em dia sorteado.
  - Atendê-lo com 5 corações, prato caprichado e mesa limpa conta para a avaliação.
- **Final:** a avaliação junta reputação, lucro e o atendimento do crítico, e dá de 0 a 3 garfos/estrelas, com cena final (falas) e créditos curtos. Rejogar o final para tentar mais estrelas.
- Selo do resultado no menu (ex.: "★★ no Garfo de Ouro").

**Partes:** as da etapa 5, mais `12-clientes.js` (crítico disfarçado, sem sinal óbvio, talvez um caderninho) e `22-salao-hud.js`.

**Testes:** `smoke16` (aparição do crítico, avaliação, finais). O bot termina a história.

**Decisões em aberto:**
- Nome do guia.
- O crítico pode ser reconhecido (pista sutil) ou é surpresa total?
- Quantas estrelas possíveis (sugestão: 3).

---

## Etapa 7 — Polimento (v12.1)
- Celular: "Como jogar" sem rolar no celular deitado; lojinha sem rolar no 568×320 (pendências antigas do `RESUMO.md`). Testar som e toque num aparelho real.
- **Ranking da história:** coleção nova (ex.: `ranking-historia`) exige mudar as capacidades do artifact (passar `capabilities` com a regra nova). Fazer só com o OK do usuário.
- Revisão geral de equilíbrio com `carreira.js` e com o retorno dos jogadores. Revisar textos do "Como jogar" para os sistemas novos.

---

## Ideias guardadas (sem etapa ainda)
- Cardápio com preço escolhido pelo jogador (o Arthur achou estranho só mexer em preço; talvez nunca).
- Equipamento melhor no lugar da manutenção (fogão industrial etc.).
- Mais funcionários: um segundo garçom, além da Dani.
- Eventos de bairro: festa junina, jogo do Brasil.
