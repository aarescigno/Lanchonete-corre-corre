# v8.5.1 — A cortina do hospital e a saudade da Bia

Retorno do usuário sobre a v8.5 (texto em `docs/PROPOSTAS.md`): mostrar a Rosa no leito com a coberta. Depois da fala derradeira dela ("Cozinha sempre com carinho"), a cortina se fecha, e a cena muda para a Bia triste, sozinha, sem nada gráfico.

## O que mudou
- **Cena `hospital`:** a Rosa diz a fala dela (1,4 s), e a Bia responde "Prometo, mãe." (3,4 s). As falas somem (`ate`, novo nas falas) e a cortina do leito corre no trilho, da esquerda, cobrindo a cama e a Bia (de 66% a 88% da cena). A janela com a estrela e a rosa no copo continuam à vista.
- **Cena nova `saudade`** (6,5 s), depois do hospital: o corredor do hospital à noite, com chuva fina na janela e uma fileira de cadeiras vazias. A Bia criança está sentada sozinha, de rosto triste (`drawPerson` ganhou o `mood` 3, triste), com uma lágrima e a rosa da mãe no colo. Legenda: "A Rosa partiu." Trilha descendo, devagar.
- **Cena `promessa`:** a legenda passa a "A Bia guardou a lição da mãe: comida é afeto, é alegria. Em homenagem a ela, decidiu ter um restaurante com a estrela do Michelzão."
- **Movimento reduzido:** a cena pode dizer qual quadro mostrar (`pRM`). No hospital, é o de antes da cortina, com as duas falas, e a saudade vem no toque seguinte.
- **Total:** 10 cenas, ~75 s.

## Guardado para depois (Modo História)
A receita especial da Casa Aurora: o toque do Tonhão de **cominho com açafrão** e a **pétala de rosa** da Dona Rosa. Não entra na abertura (anotado no `docs/PLANO.md`).

## Testes
- `smoke26.js` (30): as 10 cenas, as falas do hospital somem antes da cortina, e o quadro do hospital com movimento reduzido é o de antes da cortina.
- `python3 shot_v8_5_1.py` gera as capturas em `capturas/v8.5.1` (as mesmas da v8.5, com o hospital e a saudade).
