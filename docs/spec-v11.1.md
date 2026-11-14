# v11.1 — A voz da Bia na Garagem e na área industrial (etapa 8a)

**Situação:** aprovada (14/11)
**Origem:** `docs/ARCO.md` §4 (roteiro fechado na entrevista de 14/11; pedido em `docs/PROPOSTAS.md`); etapa 8a do `docs/PLANO.md`.

## Objetivo
A Bia deixa de falar como quem pede licença. Na Garagem ela hesita e se culpa, e na área industrial já propõe e cita o que fez antes. O jogador passa a ouvir a menina insegura virando dona da casa, só pelo texto das falas.

## Fora do escopo
- O retrato no balão e as expressões (`e` vira desenho): v11.5, sessão 8e. Aqui o `e` só é guardado no texto.
- As conversas novas do arco (`ARCO`, motor e entradas): v11.3 e v11.4. Aqui só se reescrevem as falas que já existem.
- Os capítulos 6 a 14 e as conversas da Avenida e do Terraço: v11.2 (sessão 8b). O `HIST_SOCORRO.firme` entra aqui, mas a 8b só faz as falas dos capítulos.
- Ajuste fino de texto depois do polimento: Etapa 7 (v11.9).

## Regras (decisões tomadas)
Copiadas de `docs/ARCO.md` §4, sem mudança. Notação: `quem [expressão] (nota): texto`; a expressão vira o campo `e` da fala (`{ q, s, nota?, e? }`); sem colchete, `neutra`.

Só texto: troca as falas abaixo em `src/10-constantes.js` e `src/18-abertura.js`. O que não está listado fica como está (ganha só o `e` indicado em 4.3).

### 4.1 Abertura (`ABERTURA`, cena `banco`)
- bia: `Vai dar certo!` → `Tem que dar certo...`

### 4.2 Capítulos 1 a 5 (`HISTORIA`)
**Cap. 1, antes**
- tonhao [alegre]: Panela no fogo, avental no lugar. Abre o portão, Bia!
- bia [insegura] (olhando a foto da mãe): Será que eu dou conta, mãe?
- bia [insegura]: E se não vier ninguém, tio?
- tonhao [firme]: Vem. E a gente fecha o dia no azul, que o banco não espera.

**Cap. 1, depois**
- bia [alegre]: Dois dias no azul, tio! Eu nem acreditei.
- tonhao: Pois acredite. Agora é aguentar a parcela todo dia.

**Cap. 2, antes**
- bia [insegura]: Deixei a pia encher de novo. Não dou conta da mesa e da louça...
- tonhao: Sozinha, ninguém dá. Pedi ajuda pra Dani, filha da vizinha.
- dani [insegura]: Sou meio lenta ainda, mas aprendo rápido!
- bia [alegre]: Então somos duas aprendendo.

**Cap. 2, depois**
- dani [alegre]: Ouvi um freguês dizer que aqui é tudo limpinho!
- bia [alegre]: O Gurugol subiu, tio! Já tá em 2,4.
- tonhao: Devagar e sempre.

**Cap. 3, antes**
- bia: O Gurugol tá cheio de comentário sobre a gente!
- dani: Tem freguês perguntando se a gente vai abrir num lugar maior.
- bia [insegura]: Lugar maior? A gente mal paga a reforma...
- tonhao: Primeiro quita a reforma. Depois junta pra mudança.

**Cap. 3, depois**
- bia [firme]: Reforma quitada e R$ 800 guardados. Fui eu que juntei, tio!
- tonhao (cheirando o pote de cominho): Cominho com açafrão... a Rosa ia rir de mim agora.
- bia: Por quê, tio?
- tonhao: Um dia eu te conto da Casa Aurora.
- bia [firme]: Vou cobrar.

**Cap. 4, antes**
- bia [alegre] (pondo a foto da mãe na parede): Olha só, mãe: vinte lugares!
- tonhao: E aluguel todo dia. O pessoal da fábrica tem hora pra voltar.
- bia [firme]: Então eu sirvo rápido e a gente fecha no azul. Já fiz isso na garagem.

**Cap. 4, depois**
- tonhao: Três dias no azul pagando aluguel. Tá provado, Bia.
- bia [alegre]: Tá provado mesmo. E a moto não para de pedir marmita!

**Cap. 5, antes**
- dani: Os motoqueiros já sabem o meu nome!
- tonhao: Marmita bem fechada e na hora. Quem sai da fábrica volta amanhã.
- bia [firme]: E eu tô de olho na nota. Subindo, a gente vai pra Avenida Brasil.

**Cap. 5, depois** (a 1ª discordância)
- bia [alegre]: R$ 2.000 guardados! Dá pra Avenida Brasil, tio.
- tonhao [insegura] (largando a colher): Lá fica a Casa Aurora, do Bráulio. Vamos pra outro bairro, Bia.
- tonhao: A estrela dele veio do molho da sua mãe. Eu não quero olhar pra aquela porta todo dia.
- bia [firme]: Eu quero. Não, tio: a gente não vai se esconder dele.
- tonhao [alegre] (pegando a colher de volta): ...Falou igual à Rosa.
- dani [alegre]: Então é lá que a gente vai abrir!

### 4.3 Conversas avulsas
**`HIST_CARDAPIO.falas`** (a `fez` não muda)
- bia [insegura]: Tio, um monte de gente perguntou se só tem PF e coxinha... Eu não soube o que dizer.
- tonhao: É... a Rosa fazia um pastel que era uma beleza. Eu nunca aprendi.
- bia: E se o senhor fizesse um curso? Tem uns baratinhos...
- tonhao: Tá bom, tá bom. Vê aí no Cardápio da lojinha o que cabe no bolso.

**`HIST_QUITOU`**: só a 1ª fala muda: bia [alegre]: `Última parcela da reforma paga, tio! Paguei uma por uma.`

**`HIST_TETO`**: só a última fala muda: bia [firme]: `Então eu junto pra mudança.`

**`HIST_SOCORRO`** (a discordância do banco; duas versões: `falas` na Garagem e na área industrial, `firme` na Avenida e no Terraço, escolhida pelo `nivel` do ponto, 3 ou mais = `firme`)
- `falas`:
  - tonhao: O banco ligou, Bia. Deixa que eu falo com o gerente.
  - bia [insegura]: Não, tio. A dívida tá no meu nome. Eu ligo.
  - bia [insegura] (desligando o telefone, com a mão tremendo): Ele segurou a parcela desta vez.
  - tonhao [alegre]: Tremeu, mas ligou. E é só desta vez: na próxima, ele toma a lanchonete. Olha o caixa antes de comprar.
- `firme`:
  - bia [firme] (desligando o telefone): Falei com o gerente, tio. Ele segurou a parcela desta vez.
  - tonhao: E na próxima?
  - bia [firme]: Na próxima ele toma a lanchonete. Não vai ter próxima: eu olho o caixa antes de comprar.

**`HIST_VONTADE_DOCE.falas`**: só a última fala muda: bia: `Boa, Dani. Vou ver o curso no Cardápio da lojinha.` (com a fala da Dani dada ao Tonhão, por ela não estar contratada: `Boa ideia. Vou ver o curso no Cardápio da lojinha.`)

**`LIBERA`, `confeitaria`**
- dani: Bia, as famílias daqui sempre perguntam se tem sobremesa.
- bia: E eu sempre digo que não tem... Você faz doce, Dani?
- dani [alegre]: Brigadeiro, desde pequena! Com um curso de confeitaria, dá pra vender na mesa e na marmita.
- tonhao: Doce bom segura freguês. Vê no Cardápio da lojinha.

**`LIBERA`, `joca`** (quem decide é a Bia; sai a fala do Tonhão)
- dani: Terminei o curso de confeitaria! Mas, se eu ficar nos doces, quem cuida da louça e do lixo?
- bia: Boa pergunta. Conhece alguém de confiança?
- dani: O Joca, do meu colégio. Tá procurando serviço e é trabalhador.
- joca [insegura]: Lixo, louça, mesa suja... pode deixar comigo.
- bia [firme]: Bem-vindo, Joca. Eu acerto tudo na lojinha, em Equipe.

**Só o `e` (texto igual):** `LIBERA` `bia` (1ª fala [insegura]), `melhorias`, `manut` (bia "Vai quebrar?" [insegura]), `salao`, `luxo` (bia "E se a gente pusesse mais?..." [alegre]); `HIST_DIVULGA` (bia "No boca a boca?..." [insegura]; "E se a gente fizer panfleto?..." [alegre]); `HIST_PLANTA` (bia [alegre]); `HIST_ENTREGA` (sem `e`).
- **Modo dev:** a lista de conversas do painel ganha "A 2ª chance do banco, na Avenida" (`HIST_SOCORRO.firme`), ao lado da versão `falas`; as demais falas aparecem nas listas que já existem.
- **Manual:** nenhuma ficha nova ou mudada; o texto do Manual não fala de falas.
- **Save:** nenhum campo novo. Save antigo continua com as mesmas conversas e as mesmas datas; só o texto que aparece muda.

## Critérios de aceite
(Cada um é um fato que dá para conferir, com a prova depois da seta. É a lista que o smoke da versão segue, na mesma ordem.)
- **CA1** (cada fala trocada da abertura, `HISTORIA` cap. 1 a 5 e as conversas avulsas de §4.3 tem o texto exato de §4) → `smoke77` (1)
- **CA2** (a última fala de `HIST_VONTADE_DOCE` fica como está até o usuário confirmar a troca: ver Avisos) → `smoke77` (2)
- **CA3** (nenhuma fala trocada passa de 120 letras) → `smoke77` (3)
- **CA4** (toda conversa que apontava uma aba da lojinha continua com as mesmas palavras da aba: "Cardápio da lojinha", "lojinha, em Equipe", "Divulgação da lojinha", "Melhorias", "Manutenção", "Salão", "Luxo") → `smoke77` (4)
- **CA5** (o campo `e` de cada fala trocada é um de `neutra`, `insegura`, `firme`, `alegre`, `brava`) → `smoke77` (5)
- **CA6** (`HIST_SOCORRO` tem `falas` e `firme`; a versão escolhida é `falas` no `nivel` 1 e 2, e `firme` no `nivel` 3 ou mais) → `smoke77` (6)
- **CA7** (save antigo com as mesmas conversas continua com as mesmas datas e entradas) → `smoke77` (7)
- **CA8** (a Missão, o Manual e o Modo História carregam sem erro; `node carreira.js` com a História chega ao Fim, como antes) → `node carreira.js` (com a História chega ao Fim)
- **CA9** (smokes antigos que citam falas atualizam o texto esperado, sem mudar o que conferem) → `smoke77` (8)

## Partes
- `src/10-constantes.js`: `HISTORIA` (cap. 1 a 5), `HIST_CARDAPIO`, `HIST_QUITOU`, `HIST_TETO`, `HIST_SOCORRO` (ganha `firme`), `HIST_VONTADE_DOCE`, `LIBERA` (`confeitaria`, `joca`, `bia`, `melhorias`, `manut`, `salao`, `luxo`), `HIST_DIVULGA`, `HIST_PLANTA`, `HIST_ENTREGA` (só o `e`, se houver).
- `src/18-abertura.js`: `ABERTURA`, cena `banco`, fala da Bia.
- `src/43-telas.js`: só a escolha de `HIST_SOCORRO.firme` (linha 143, `sv.convSocorro`), pelo `nivel` do ponto (3 ou mais = `firme`).

## Tarefas
(Na ordem de fazer; a execução marca `[x]` ao terminar cada uma.)
- [ ] T1 Smoke novo `tests/smoke77.js` com os critérios CA1 a CA7 (falhando).
- [ ] T2 Trocar as falas de `src/10-constantes.js` e `src/18-abertura.js` (§4.1 a §4.3) e o `e` das falas listadas.
- [ ] T3 `HIST_SOCORRO.firme` e a escolha em `src/43-telas.js` (CA6).
- [ ] T4 Atualizar os smokes antigos que citam falas (CA9) e fazer `tests/run_all.sh` verde.
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, esta spec como entregue, `tests/run_all.sh` verde, commit e push no branch da sessão.

## Avisos para a execução
- Os textos são de `docs/ARCO.md` §4; o que não está listado nele fica como está. Não reescreva falas por conta própria.
- **Pendente, pergunta ao usuário:** a última fala de `HIST_VONTADE_DOCE` (§4.3, "com a fala da Dani dada ao Tonhão") ficou sem troca: o roteiro não diz claramente quem fala e qual linha troca. Fica como está até a resposta.
- **Pendente, pergunta ao usuário:** o `e` de `melhorias` e de `salao` (§4.3 diz só "texto igual", sem a fala). Sem `e` por enquanto (vira `neutra`).
- Escolha do socorro (`src/43-telas.js`): `pontoOf(sv.salao.ponto).nivel >= 3` usa `firme`, senão `falas`.

## Testes
- `tests/smoke77.js` (novo): 8 checagens, para CA1 a CA7 (a CA1 em duas: capítulos 1 a 5 e avulsas).
- Smokes que citam falas, atualizados sem mudar o que conferem: `smoke34` (4 toques no cap. 1), `smoke38` (cap. 5 depois com 6 falas), `smoke39` (1ª fala do cardápio), `smoke43` (confeitaria, joca com 5 falas), `smoke59` (`HIST_SOCORRO` com 4 falas), `smoke64` (`devCenas` +1 item do socorro na Avenida).
- `node carreira.js` (com a História): chega ao Fim como hoje.

## Decisões em aberto
Nenhuma.

## Desvios
(No fechamento.)

**Modelo:** Haiku, esforço médio (troca exata de textos e smoke de textos; roteiro já fechado em `docs/ARCO.md` §4).
