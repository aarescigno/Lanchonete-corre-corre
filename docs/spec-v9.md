# v9 — Etapa 3a: mudança de ponto e Lanchonete na área industrial (30/10/2026)

Implementa a sessão 3a do `docs/PLANO.md`. O que o plano decidiu está como pediu; as exceções (calibração) estão em **Calibração** abaixo.

## O que entrou
- **Mudança** (lojinha › Dinheiro › Mudança): aparece com `save.cap >= 4` (no modo dev, sempre) e enquanto houver ponto para onde ir. R$ 800 e nota do Gurugol ≥ `avalMinimo(ponto de agora)` (2,7); sem um dos dois o botão apaga e diz "Falta R$ x" / "Nota 2,7 (agora x,x)". Confirmação em 2 toques. Vai junto: mesas (arrumação automática), pratos, cursos, equipe, melhorias, empréstimo, decoração; saem sem devolução a TV, o som (`equipe.tv/som`) e a torneira (`up.maquina`). Não dá para voltar. O limite do banco sobe para R$ 2.000.
- **Ponto** `PONTOS[1]` (`industrial`): 20 lugares (a área é a da Garagem alargada de x0 196 para 160: 20 lugares não cabiam na arrumação automática), espera de 5, aluguel R$ 120 nas contas do dia (linha "Aluguel" no fim do dia), 5 vagas no balcão de pratos (`plateSlotsFor`) e prateleira de 4 marmitas, suco na espera, metas e expert ×1,25 (`diaPonto`).
- **Clientela** (`PONTOS[1].tipos`, pesos): estudante 1, executiva 1, família 0,5, vovós 0,7, entregador 2, turma 2, motorista 1. VIP ×0,3 (sem o VIP garantido do dia). Quem vem sozinho ou em dupla tem paciência ×0,85 (menos a turma, o motorista e a encomenda).
  - **Turma da fábrica**: 3 ou 4 pessoas de macacão e crachá. **Apito**: as primeiras 3 turmas do dia chegam juntas a partir de 45% do turno, uma a cada 8 a 12 s; "A fábrica vai apitar!" 10 s antes e "Apitou!" com o som na hora.
  - **Motorista de caminhão**: mais nas pontas do turno (×2) e menos no meio (×0,3); 80% pedem o cafezinho ao terminar de comer (balão de xícara; sem o café a paciência corre) e a gorjeta vai de 10% a 15% com ele.
  - **Encomenda do setor**: no máximo 1 por dia (60%), por volta de 30% do turno, avisada na introdução; 4 a 6 marmitas pedidas pelos gostos da turma, sem Efood; cada marmita paga o preço, o lote completo dá +10% de gorjeta e +20 pontos; parcial: paga as entregues, sai com 1 coração sem multa e não conta como perdida; nenhuma entregue: sai brava, com multa.
- **Itens** (só na área industrial): fogão industrial R$ 400 (4 bocas, metade do desgaste, conserto R$ 160; aba Manutenção), 3 TVs R$ 120 (desligadas / com anúncios R$ 9/dia, paciência −10% / sem anúncios R$ 29/dia, −15%; Ambiente do Gurugol 0,5 / 0,75), espera sentada (cadeirinhas R$ 60 ou banquinhos R$ 90; paciência na espera 15% mais devagar), Jarra de suco R$ 120 (a melhoria `maquina` do ponto; o suco vale R$ 12), violetas R$ 20, antúrio R$ 30 e samambaia pendurada R$ 40 (+0,1 no Ambiente cada).
- **História**: caps. 4 ("Ponto novo", 3 dias no azul pagando o aluguel) e 5 ("Hora do almoço", 6 marmitas e nota 3,4 no mesmo dia + R$ 2000 no caixa, `save.capFeito`). O cap. 4 só começa ao mudar (até lá `save.cap` fica em 4, "Garagem completa"); o cartão de fim do cap. 3 manda para a mudança na lojinha; o do cap. 5 diz "Continua na próxima versão: a Avenida Brasil".
- **Cenário**: cimento queimado cinza, parede de tijolinho, portão de enrolar em cima da porta, janela com galpões e chaminé, letreiro de metal com lâmpadas, TVs no alto da parede, calçada com faixa amarela de carga e descarga e poste, cadeirinhas/banquinhos na espera, jarra num caixote, violetas, antúrio e samambaia no toldo. Gente nova com roupa própria (macacão, boné, crachá, protetor de ouvido, chave, sacola térmica).
- O Turno sem fim e a Missão zero são sempre na Garagem (`Game.ponto`).

## Calibração (o que difere do plano, e por quê)
Medido com `node carreira.js` (bot comum, `DIAS=35`) e `balance.js` (`PONTO=industrial`):
- **`cardapio` 1,5** (o plano dizia 1,2): com 1,2 a mudança dava lucro **menor** que ficar na Garagem (−6 a −60 por dia: o aluguel de R$ 120 come o ganho do preço). Com 1,4 a diferença é +79; com 1,5, **+140 por dia** (volta em ~6 dias; o alvo do plano era 3 a 5). O plano só previa 1,25.
- **`grupos` 0,8** (conta nova em `PONTOS`): os 20 lugares já trazem +60% de movimento (`movimentoSalao`); sem o fator, nem o bot afiado fechava o dia sem perder alguém (3★ em 42% dos dias de 20 lugares; com 0,8, ~61%).
- Resultados com a calibração final: mudança no dia ~17 (nota e dinheiro), cap. 4 em 2 dias depois (12/12), cap. 5 ~10 dias depois (12/12), 0 dias no negativo (`MOVEIS=quatro` também); bot afiado com equipe: passa 85–90% das metas e 3★ em 40% (domingo) a 70% (segunda e terça); turmas do apito perdidas ≈ 0,6 por 3 dias; encomenda completa em ~70%; bot comum sem equipe: lucro ≈ 0 (Garagem ≈ +200), a mudança não compensa. `apito.max`, `lote`, `mudanca` e `metaF` ficaram como no plano.

## Testes
`tests/smoke38.js` (99 checks; o smoke37 já era o da Dani), `tests/shot_v9.py` (capturas em `capturas/v9`), `balance.js` com `PONTO=` e `PONTO_CFG=`, `carreira.js` com a mudança, os caps. 4 e 5 e `DBGF=1`, `bot.js` com o café do motorista e a encomenda (adianta PF). Testes antigos ajustados: smoke14 (suco R$ 12), smoke30 (9 enfeites), smoke33 (cartão Mudança), smoke34 (cartão de fim do cap. 3).

## Fica para depois
O Joca, a Avenida Brasil (3b), eventos de bairro (4c), o nível de luxo.
