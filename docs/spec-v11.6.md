# v11.6 — O Bráulio em cena (etapa 8f)

**Situação:** entregue em 15/11
**Origem:** `docs/ARCO.md` §9 e §12 (roteiro fechado na entrevista de 14/11; pedido em `docs/PROPOSTAS.md`); etapa 8f do `docs/PLANO.md`. Aprovada em 15/11.

## Objetivo
O chef Bráulio ganha rosto e voz no Modo História: o retrato dele no balão, a conversa `braulio1` na Avenida (com e sem o Anselmo na equipe) e o fim do cap. 14 com ele saindo pela porta.

## Fora do escopo
- A roupa da Bia por ponto (v11.7) e as reações da Bia no dia (v11.8). Do `docs/ARCO.md` §10 em diante: nada.
- Falas e gatilhos além dos desta seção: não mudam.

## Regras (decisões tomadas)
Copiadas de `docs/ARCO.md` §9, sem mudança de texto. Notação: `quem [expressão] (nota): texto`; a expressão vira o campo `e` da fala; a nota, o campo `nota`.
- `HIST_NOMES.braulio = 'Bráulio'`; cor do nome `#4A4A4A`; a cabeça dele para o balão fica na porta do salão (o ponto de entrada dos clientes), com o retrato: bigode, paletó e gravata `#F2C23D` (como o grupo `braulio` de `src/12-clientes.js`).
- **`braulio1`** — entrada da `ARCO`, `nivel` 3, a **primeira** da Avenida na ordem. `quando`: `save.cap` é 7 ou mais e é o 6º dia no ponto ou depois. `qualB`: o Anselmo não está contratado.
  - `falas` (com o Anselmo):
    - braulio (de braços cruzados, na porta): Então é esta a lanchonete da garagem. Vim buscar o meu coqueteleiro.
    - bia [insegura]: Ele... ele não é seu, chef. Pergunta pra ele.
    - anselmo [firme]: Eu fico aqui. Aqui ninguém grita.
    - braulio [brava]: Vocês não duram um ano nesta avenida.
    - bia [firme] (com a voz ainda tremendo): Pode ser. Mas a mesa do senhor fica do outro lado da rua.
    - tonhao [alegre]: A Rosa ia aplaudir de pé.
  - `falasB` (sem o Anselmo):
    - braulio (de braços cruzados, na porta): Então é esta a lanchonete da garagem. Sobrinha do Tonhão, não é?
    - bia [insegura]: Filha da Rosa. E dona da casa.
    - braulio [brava]: Vocês não duram um ano nesta avenida.
    - bia [firme] (com a voz ainda tremendo): Pode ser. Mas a mesa do senhor fica do outro lado da rua.
    - tonhao [alegre]: A Rosa ia aplaudir de pé.
- **Cap. 14, `depois`** (troca o da v11.2):
  - braulio [insegura] (parado na porta, de saída): Esse molho... é o da Rosa.
  - bia [firme]: É. E agora a cidade inteira sabe de quem é.
  - braulio: ...Ela cozinhava melhor que eu.
  - bia [firme]: A porta fica aberta, chef. Pra jantar.
  - tonhao: Saiu calado. Pela primeira vez na vida.
  - bia [firme]: Agora o guia liga. Vai dormir, tio. Amanhã o telefone toca, e eu atendo.
- **Manual:** a ficha `c-braulio` passa a aparecer depois de `braulio1` vista (hoje, só depois da noite da estrela).
- **Modo dev:** `Arco: braulio1` e `Arco: braulio1 (sem o Anselmo)` na lista de conversas.
- **Motor (`docs/ARCO.md` §6.1):** `falasB` e `qualB:(sv) => bool` na entrada da `ARCO`: no 'pend', toca `falasB` quando `qualB(sv)`, senão `falas`; o modo dev lista também a versão `falasB`.

## Critérios de aceite
- **CA1** (`HIST_NOMES.braulio` é 'Bráulio'; o retrato dele desenha nas 5 expressões sem erro; a tela Retratos tem 8 colunas) → `smoke82` (CA1)
- **CA2** (`braulio1` é a 1ª entrada de `nivel` 3, com `falas`, `falasB` e `qualB`; textos exatos das duas versões; `e` válido; até 120 letras) → `smoke82` (CA2)
- **CA3** (o `quando`: cap. 7 ou mais e 6º dia no ponto ou depois; fica 'pend' com ele e não sem ele; vem antes de `anselmoCopo`) → `smoke82` (CA3)
- **CA4** (com o Anselmo contratado tocam as `falas`, sem ele as `falasB`) → `smoke82` (CA4)
- **CA5** (cap. 14 `depois`: 6 falas, a 1ª do Bráulio, textos exatos, `e` válido) → `smoke82` (CA5)
- **CA6** (ficha `c-braulio` do Manual depois de `braulio1` vista, e continua depois da noite da estrela) → `smoke82` (CA6)
- **CA7** (modo dev: `Arco: braulio1` e `Arco: braulio1 (sem o Anselmo)`) → `smoke82` (CA7)
- **CA8** (o que se vê) → captura `shot_v11_6.js`: a grade dos retratos; o balão da 1ª fala de `braulio1` e o da fala `[brava]`, na Avenida, em 844x390 e 568x320; o balão da 1ª fala do cap. 14 `depois`, no Terraço
- **CA9** (`node carreira.js` com a História chega ao Fim como antes) → `DIAS=120 node carreira.js 10`

## Partes
- `src/10-constantes.js`: `HIST_NOMES`, `ARCO` (`braulio1`), cap. 14 `depois`, regra do Manual (`c-braulio`), `VERSAO`.
- `src/43-telas.js`: a fila de conversas (`falasB`) e a lista do modo dev.
- `src/26-conversa.js`: `RETRATO_QUEM`, `RETRATO_POSE`, `drawRetrato`, cor do nome, `convCabeca`.
- `src/40-interface.js` e `src/42-resultados.js` só se um teste antigo pedir.

## Tarefas
- [x] T1 Smoke novo `tests/smoke82.js` (CA1 a CA7), visto falhar, incluído no `tests/run_all.sh`.
- [x] T2 Dados: `HIST_NOMES.braulio`, `braulio1`, cap. 14 `depois`, regra do Manual.
- [x] T3 `falasB`/`qualB` na fila de conversas e no modo dev.
- [x] T4 O retrato do Bráulio, a cor do nome e `convCabeca`.
- [x] T5 `tests/shot_v11_6.js`; capturas olhadas em recorte e ajustadas.
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, `docs/PLANO.md` (8f feita, texto arquivado), esta spec como entregue, `tests/run_all.sh` verde, commit local.

## Testes
- `tests/smoke82.js` (novo, 30 checagens, CA1 a CA7), visto falhar antes do código; `tests/shot_v11_6.js` (CA8).
- Smokes antigos atualizados sem mudar o que conferem: `smoke64` (conta as cenas do modo dev, agora com as versões B), `smoke75` e `smoke78` (o `depois` do cap. 14: 6 falas), `smoke80` (a `ARCO` tem 18 entradas; as dele filtram `braulio1`).
- Medido: `tests/run_all.sh` com saída 0; `DIAS=120 node carreira.js 10`: capítulos 1 a 14 e o Fim em 10 de 10, banco em 0 de 10.

## Decisões em aberto
Nenhuma.

## Desvios
- `falasB`/`qualB` (§6.1) ainda não existiam no motor: foram implementados agora, em `src/43-telas.js` (a fila escolhe `falasB` quando `qualB(sv)`) e na lista do modo dev (`Arco: <id> (sem o Anselmo)`). `qualB` é `!(sv.equipe.anselmo > 0)` ("não contratado").
- O `quando` usa `diaNoPonto(sv, g.day.n) >= 6` para o "6º dia no ponto ou depois".
- A cabeça do Bráulio para o balão: `[max(DOOR.x + cam, 48), DOOR.y + 70]` (a porta da Garagem e da Avenida fica fora da tela, em x = -300; ele fica no canto da calçada, no lado da fila; no Terraço, ao lado da porta do elevador).
- O boneco do Bráulio parado na porta foi desenhado (era opcional): aparece em toda conversa em que ele fala (`braulio1` e o cap. 14 `depois`), por baixo do balão. O cabelo grisalho (`#8C8C8C`) é escolha do desenho; bigode, paletó (`AB_COR.aurora`) e gravata `#F2C23D` seguem o grupo `braulio`.
- A ficha `c-braulio` abre ao fim de `braulio1` (`game.manualVer`), além do caminho antigo (`guia.ult`); `manualSemente` (save antigo) não mudou.
- Retrato do Bráulio em escala menor (1,9) que o dos outros, para o paletó e a gravata aparecerem sob o bigode.

**Modelo:** Sonnet, esforço médio
