# v9.1.1 — Sessão 3b-1r: realinhamento depois da v9.1 (31/10/2026)

## O que entrou
- **`save.pontoDia`** (`12-clientes.js`, `pontoDiaDe`): o dia em que o save chegou ao ponto de agora. `mudarPonto` grava `sv.pontoDia = sv.dia`. Save sem ele: Garagem 1; ponto de nível >= 2, `dia - 1` (conta como o 2º dia no ponto); nunca passa do dia.
- **`diaNoPonto(sv, n)`** (`10-constantes.js`, no `window.__lcc`): `n` é o dia que terminou (padrão `sv.dia - 1`, porque o fim do dia já avançou o `save.dia`); o 1º dia no ponto vale 1.
- **`LIBERA` com `nivel`** (opcional) e `gatilho(st, av, g)` como campo (as 5 entradas antigas migraram; `liberaGatilho` só chama o campo). Com `nivel`: só vale com `ponto.nivel >= nivel`, `dia` e `ate` contam pelo `diaNoPonto`, em qualquer capítulo. Sem `nivel`: como antes (dia da carreira, só com `cap < 4`). O bloco do fim do dia (`16-jogo.js`) perdeu o `cap < 4` geral.
- **`cartaoAberto`**: com `nivel`, no modo dev aberto; fora da História, aberto com o nível do ponto; na História, com `libera >= 1`. Sem `nivel`, tudo como antes.
- **`normLibera`**: entrada com `nivel` que falta vira 0 (nunca 2).
- **Conversa**: `fluxoHistoria` já tocava a pendente em qualquer capítulo (uma por fim de dia); conferido no smoke. `shopGrupoDe` com id desconhecido cai em `lanchonete` (a 3b-2 manda `'joca'` para a Equipe, ao registrar o id no grupo).
- **Cantinho da Rosa nos pontos novos** (`21-cenario.js`): `drawDecorParede` desenha em todo ponto, com `DECOR_POS` por nível. Área industrial e Avenida: samambaia (630, 78, 0,8), foto da Rosa (330, 74, 0,8) na Avenida e **(308, 74, 0,8) na área industrial** (a 330 encostava na 1ª TV: deslocada 22 px, como o plano permitia), plaquinha (237, 68) na industrial e (242, 68) na Avenida, quadro de giz (62, 150). Descrições do `DECOR`: "garagem" virou "parede" e "portão" virou "porta". **O ajuste fino das posições é do usuário, no editor de desenhos.**
- **`smoke.js`**: o teste põe caixa de R$ 3000 no início de cada dia (a falência do dia 8 vinha do sorteio); 12 rodadas seguidas verdes.

## Testes
- `tests/smoke42b.js` (novo, 24; entra no `run_all.sh` depois do `smoke42`): `pontoDia` (normSave, mudança), entrada de teste com `nivel:2, dia:2, ate:4` empurrada no `LIBERA` (não vale na Garagem; 2º dia com gatilho; garantia no 4º dia com cap. 5; Avenida), conversa e `cartaoAberto`, as 5 antigas abertas do cap. 4 em diante, save antigo e parcial, fora da História e modo dev.
- `tests/shot_v9_1_1.py` virou `tests/shot_v9_1_1.js` (mesmo estilo do `shot_v9_1.js`): parede da área industrial e da Avenida, PC e celular deitado, `ERRORS: []`.
- Instáveis fora desta sessão (passam e falham sem a mudança, sorteio): `smoke3` ("0 estrelas => fim de turno") e `smoke38` ("entregador com peso 2 (~24%)").
