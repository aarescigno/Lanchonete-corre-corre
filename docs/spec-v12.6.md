# v12.6 — As vozes da equipe: o tratamento e a revisão das conversas (etapa 15b)

**Situação:** entregue em 19/11
**Origem:** retorno do usuário de 19/11 em `docs/PROPOSTAS.md` ("revise todas as conversas com base nos perfis... veja se o tamanho dos arcos de cada personagem estão proporcionais ao tempo delas dentro da equipe"). Perfis e tratamento: `docs/ARCO.md` §2.1 e §2.2. Vem depois da v12.5 (o arco da Lia), que já entra com as falas novas da Lia no tratamento certo. Aprovada em 19/11 (os fregueses da `camiNome`: dona Lurdes e seu Jorge).

## Objetivo
Cada um fala do seu jeito e trata os outros como o perfil pede: a Dani chama a Bia de "Bi", o Joca de "dona Bia", o Anselmo de "senhora". A troca de tratamento passa a marcar a conquista de quem muda. A Cami, a mais curta das personagens que ficam, ganha a conquista em cena. E a roda antes da noite da estrela passa a ouvir a equipe inteira.

## Fora do escopo
- O arco da Lia: v12.5.
- Retrato, expressões e desenho: nada muda.
- A abertura (`ABERTURA`) e o final (`FINAL`): a revisão não achou nada fora dos perfis.

## Revisão (19/11): o que se achou
Corpus: 328 falas em 91 conversas (`HISTORIA`, `HIST_*`, `LIBERA`, `ARCO`, `ABERTURA`, `FINAL`).
1. **Tratamento:** a Dani chama a Bia de "Bia" (9 falas) e o Tonhão de "seu Tonhão". O Joca e o Anselmo nunca tratam a Bia com a formalidade do perfil. O Tonhão chama a Bia de "chefe" já no cap. 7, e isso tira a força do "chefe" do cap. 14, que é a conquista dela.
2. **A Cami indicada duas vezes:** no cap. 7, `antes`, o Tonhão sugere a Cami ("Tem a Cami, garçonete de rodízio"). Na `LIBERA` cami, o Joca a indica de novo ("do meu curso de barista"). O Tonhão não teria de onde conhecer a Cami.
3. **A conquista da Cami antes da dificuldade:** no cap. 7, `depois`, a Dani diz "A Cami já sabe o nome de todo freguês", e só depois a `camiPressa` mostra a Cami tratando mesa como número. Além disso, a conquista é contada pela Dani, e não acontece em cena.
4. **Bravata fora do perfil:** o Joca, calado e inseguro, diz "eu tiro o melhor espresso da Avenida" (`HIST_VONTADE_CAFE`). O Anselmo, encolhido, diz "Me dá um balcão e eu faço..." (`LIBERA` anselmo) num tom de quem manda. Os dois ficam mais neles com a hesitação e a cortesia do perfil, sem perder a faísca do talento.
5. **A roda (cap. 14) só com a Bia, a Dani e o Tonhão:** o momento "nunca mais abri sozinha" não ouve o Joca, a Cami, o Anselmo nem a Lia.

## Proporção dos arcos (tempo na equipe até o fim da história, pela `DEV_CAPS`: a história fecha no dia 64)
| Quem | Entra | Dias na equipe | Conversas próprias (hoje) | Falas (hoje) | Falas por 10 dias | Com a v12.5 e esta |
|---|---|---|---|---|---|---|
| Dani | dia 4 (cap. 2) | ~60 | 7 | 38 | 6,3 | 38 (só o tratamento) |
| Joca | dia 17 (cap. 5) | ~47 | 5 | 12 | 2,6 | 14 |
| Anselmo | dia 34 (cap. 7) | ~30 | 4 | 7 | 2,3 | 9 |
| Cami | dia 38 (cap. 7) | ~26 | 2 | 6 | 2,3 | ~17 (4 cenas da Lia, `camiNome`, roda) |
| Lia | dia 58 (cap. 10) | ~6 a 9 | 3 | 5 | ~7 | ~13 (v12.5) |
- A **Dani** é o coro da história: ela aparece em 30 conversas, quase todas de capítulo. É a mais antiga, então está proporcional.
- **Joca e Anselmo** estão proporcionais entre si e combinam com o perfil de pouca fala.
- A **Cami** era a mais curta: um tropeço (`camiPressa`) e uma promoção numa fala só. A v12.5 a põe em 4 cenas da Lia. Aqui ela ganha a conquista em cena (`camiNome`) e uma fala na roda.
- A **Lia**, com a v12.5, fica densa para o tempo que tem, e é curta por natureza, porque entra no arco final. Com 5 entradas da `ARCO` (uma por fim de dia) em ~9 dias de Terraço, disputando com a `anselmoRi`, a `jocaNome` e a `roda`, a `liaChef` podia ficar para depois do fim da história. Decidido em 19/11: a cena dos temperos vai para o cap. 10 `depois` (que não gasta a vez da `ARCO`), e a Lia fica com 4 entradas (já na `docs/spec-v12.5.md`).

## Regras (decisões tomadas)
As falas abaixo trocam o texto de hoje (só o que está listado; o resto fica como está). `e` e `nota` iguais aos de hoje, a não ser onde indicado.

**Tratamento da Dani** ("Bi" para a Bia, "tio Tonhão" para o Tonhão, "Joquinha" para o Joca):
- `HIST_CRITICO`: "Bia! Aquele freguês sozinho..." → "Bi! Aquele freguês sozinho... ele tinha um caderninho!"
- `HIST_TETO`: "Bia, olha o Gúgou! Nota 2,7!" → "Bi, olha o Gúgou! Nota 2,7!"
- `HIST_VONTADE_DOCE.curta`: "Pediram sobremesa de novo hoje, Bia..." → "Pediram sobremesa de novo hoje, Bi..."
- `LIBERA` confeitaria: "Bia, as famílias daqui..." → "Bi, as famílias daqui sempre perguntam se tem sobremesa."
- `LIBERA` joca: "O Joca, do meu colégio. Tá procurando serviço e é trabalhador." → "O Joquinha, do meu colégio. Tá procurando serviço e é trabalhador."
- `daniPrato`: "Quebrei dois pratos hoje, Bia. Desculpa..." → "Quebrei dois pratos hoje, Bi. Desculpa. Eu sou lenta e ainda estrago as coisas."
- `daniDoce`: "Devolveram meu pudim, Bia..." → "Devolveram meu pudim, Bi. Disseram que tava mole. Acho melhor eu voltar pra louça."
- `jocaCalado`: "O Joca não abre a boca, Bia..." → "O Joquinha não abre a boca, Bi. O freguês pergunta e ele aponta pra mim."
- `daniEnsina`: "Bia, me pediram pra ensinar..." → "Bi, me pediram pra ensinar o ponto do brigadeiro. Eu! Ensinando!"; "Lenta, não, seu Tonhão. Caprichosa." → "Lenta, não, tio Tonhão. Caprichosa."
- `roda`: "Ai, Bia, eu vou chorar em cima do doce!" → "Ai, Bi, eu vou chorar em cima do doce!"

**Tratamento do Joca** ("dona Bia" até a `jocaNome`, "Bia" depois; "seu Tonhão"):
- `LIBERA` joca: "Lixo, louça, mesa suja... pode deixar comigo." → "Lixo, louça, mesa suja... pode deixar comigo, dona Bia."
- `HIST_VONTADE_CAFE`: "Com o curso de barista, eu tiro o melhor espresso da Avenida." → "Se eu fizer o curso de barista... acho que eu tiro um espresso bom."
- `jocaEspresso`: "Você disse isso?" → "Você disse isso, dona Bia?"
- `jocaNome`: "Bia, a mesa da janela pediu..." → "Dona Bia, a mesa da janela pediu "o café do Joca". Pelo nome!". Ganha uma última fala: `joca [alegre]: Valeu, Bia.` (a 1ª vez sem o "dona").

**Tratamento do Anselmo** ("senhora" até a `anselmoRi`, "Bia" depois):
- `LIBERA` anselmo: "Com licença... Lá no Bráulio não dava mais: era grito o dia inteiro." → "Com licença, senhora... Lá no Bráulio não dava mais: era grito o dia inteiro."; "Me dá um balcão e eu faço o drink mais bonito da Avenida." → "Se a senhora me der um balcão, eu faço o drink mais bonito da Avenida."
- `anselmoCopo`: "Desculpa, desculpa! Eu pago o copo, pode descontar..." → "Desculpa, senhora, desculpa! Eu pago o copo, pode descontar..."
- `anselmoRi`: ganha uma última fala: `anselmo [alegre]: Pode deixar, Bia.` (a 1ª vez sem o "senhora").

**Tratamento da Cami e do Tonhão** (a Cami chama a Bia de "chefe"; o Tonhão só diz "chefe" no cap. 14; a Cami é "moça" para ele até a `camiNome`):
- `LIBERA` cami: "Me mostra onde fica tudo que eu dou conta!" → "Me mostra onde fica tudo, chefe, que eu dou conta!"
- Cap. 12, `depois`: "Bia, deixa a porta comigo. Eu organizo a fila e as mesas." → "Chefe, deixa a porta comigo. Eu organizo a fila e as mesas."
- Cap. 7, `antes`: "Tem a Cami, garçonete de rodízio. Rápida que só ela." → "O rapaz do café falou de uma colega do curso dele. Garçonete de rodízio." (o Joca indica na `LIBERA`, e o Tonhão só repassa)
- Cap. 7, `depois`: "A Cami já sabe o nome de todo freguês." (dani) → "A Cami é um foguete!" (dani); "Salão redondo. E agora, chefe?" (tonhao [alegre]) → "Salão redondo. E agora, Bia?"

**A conquista da Cami em cena: `camiNome`** (nova, na `ARCO`, `nivel` 3, logo depois da `camiPressa`). `quando`: a `camiPressa` vista, `save.camiCursos.agil` feito e a Cami veio no dia.
- cami [alegre]: Chefe, a dona Lurdes da mesa dois faz aniversário hoje. E o seu Jorge voltou: o dele é sem cebola.
- bia [alegre]: Você sabe o nome de todo mundo, Cami?
- cami [firme]: De todo mundo. No rodízio eu contava mesa. Aqui eu conto gente.
- tonhao: Essa moça aprendeu rápido.
- cami [alegre]: Cami, Tonhão. Pode chamar de Cami.

**A roda** (cap. 14): entre a fala da Bia "Hoje eu não tenho medo. Porque nunca mais abri sozinha." e a da Dani, entram:
- joca [alegre]: Nem eu. (sem tratamento: a roda pode vir antes da `jocaNome`)
- cami: Girou, serviu... estrela!
- anselmo [alegre]: E sem ninguém gritar.
- lia: Na hora.

- **Modo dev:** a `camiNome` entra sozinha na lista de conversas (`Arco: camiNome`).
- **Save:** `arco.camiNome` nasce em `normSave` como as outras (save que já está no Terraço: nasce 1 e não toca).
- **Manual:** nada muda.

## Critérios de aceite
- **CA1** As falas trocadas desta spec estão no jogo com o texto, quem fala, o `e` e a `nota` de cada uma; as falas que não estão listadas continuam iguais às da v12.5 (comparação com uma cópia das listas) → `smoke107` (1)
- **CA2** Varredura do tratamento em todas as conversas: a Dani não diz "Bia" nem "seu Tonhão"; o Joca não diz "Bia" sem "dona" antes da última fala da `jocaNome`; o Anselmo não diz "Bia" antes da última fala da `anselmoRi`; o Tonhão só diz "chefe" no cap. 14; ninguém além da Bia diz "tio" sozinho → `smoke107` (2)
- **CA3** `camiNome` na `ARCO` logo depois da `camiPressa`, com o `quando` desta spec; marca uma por fim de dia, como as outras → `smoke107` (3)
- **CA4** A roda com as 9 falas, na ordem desta spec → `smoke107` (4)
- **CA5** Save antigo (v12.5) carrega com `arco.camiNome` (0 na Avenida, 1 no Terraço) → `smoke107` (5)
- **CA6** As conversas trocadas cabem no balão → captura `shot_v12_6.js`: `camiNome`, a roda, `jocaNome` e `LIBERA` anselmo em 844×390 e 568×320

## Partes
- `src/10-constantes.js`: `HISTORIA` (caps. 7, 12 e 14 pela `roda`), `HIST_CRITICO`, `HIST_TETO`, `HIST_VONTADE_DOCE`, `HIST_VONTADE_CAFE`, `LIBERA` (confeitaria, joca, anselmo, cami), `ARCO` (`daniPrato`, `daniDoce`, `jocaCalado`, `anselmoCopo`, `jocaEspresso`, `camiPressa`/`camiNome`, `daniEnsina`, `anselmoRi`, `jocaNome`, `roda`).
- `src/12-clientes.js`: `normSave` (só se o `arco` não nascer sozinho para ids novos).

## Tarefas
- [x] T1 `tests/smoke107.js` com CA1 a CA5 (falhando); entra no `run_all.sh`.
- [x] T2 As trocas de texto, por script com substituição exata (`assert s.count(a)==1`).
- [x] T3 `camiNome` e a roda.
- [x] T4 Os smokes antigos que conferem falas trocadas (procurar trechos das falas de hoje em `tests/`) passam a conferir as novas.
- [x] T5 Capturas (CA6): tirar, olhar ampliado e apagar.
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/ARCO.md` (uma linha em §2.2 dizendo que a v12.6 aplicou a tabela), esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Testes
- `tests/smoke107.js` (novo, CA1 a CA5). Nenhuma mudança no `balance.js` nem no `carreira.js` (só texto e uma conversa).

## Decisões em aberto
Nenhuma.

## Desvios
- **Números medidos:** `smoke107` 13 checagens (CA1 a CA5); `run_all.sh --tudo` verde (`menu_fit` 742 conferências, 0 falhas, com a lista das Versões em 23 linhas; `balance.js 40` igual ao da v12.5, porque só mudou texto). As falas somam 332 em 76 listas (a contagem de 328 da revisão não incluía as `HIST_CARDAPIO.fez`, as `HIST_SOCORRO.firme` e a `HIST_VONTADE_*.curta`); a v12.6 acrescenta 11 (a `camiNome` 5, a roda 4 e a última fala de `jocaNome` e de `anselmoRi`), e agora são 343 falas em 77 listas.
- **CA1:** a cópia da v12.5 é `tests/smoke107_base.json` (gerada do código de antes das trocas); o smoke aplica sobre ela só as trocas da spec e compara com o jogo.
- **Smokes antigos** que conferiam as falas de hoje passaram a conferir as novas: `smoke69`, `smoke70`, `smoke74`, `smoke77`, `smoke78`, `smoke79`, `smoke80` (e os totais de `smoke80` e `smoke82` de 20 para 21 entradas da `ARCO`, e de 21 para 22 cenas de arco no modo dev); o `smoke86` (selo, `VERSAO` e a lista do painel Versões, agora com 23 linhas) e o `menu_fit.py` (23 linhas).
- **CA3, `quando` da `camiNome`:** `sv.arco.camiPressa === 1 && !!sv.camiCursos.agil && sv.equipe.cami > 0 && !sv.equipe.camiFora`. O smoke confere o `camiFora` direto no `quando`, porque o `startDay` limpa o `camiFora` antes do fim do dia.
- **`normSave`:** nada a mudar (o `normArco` já nasce o id novo pelo `nivel`).
- **CA6 (capturas):** `tests/shot_v12_6.js` roda sem erro de página (844x390 e 568x320, as duas pontas das falas de `camiNome`, roda, `jocaNome` e `LIBERA` anselmo). A leitura das imagens estava bloqueada nesta sessão; conferiu-se por texto que nenhuma fala passa de 120 letras (o limite das conversas, como nos outros smokes). As capturas foram apagadas.

## Regras corrigidas
Nenhuma: as regras da spec foram aplicadas como estavam.

**Modelo:** Sonnet, esforço médio (só texto e uma conversa nova, mas em muitas listas e com smokes antigos que conferem as falas de hoje)
