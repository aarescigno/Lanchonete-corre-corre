# v12.10.1 — Os pratos de estrada, o prato que ele estranha e o suor (etapa 18b)

**Situação:** rascunho
**Origem:** a mesma entrevista da v12.10 (21 e 22/11): "Só 1 prato por técnica", "mais devagar", "+40% e só o curso resolve", "Ele suando no fogão", "Desenho próprio, no padrão", "Empratamento: nível 7, nota e luxo".

## Objetivo
Na chegada a um ponto novo, dá para ver e sentir que a cozinha é nova para o Tonhão: o prato que ele arrisca sai mais devagar, raramente caprichado, e ele sua no fogão até fazer o curso de lá. Os lanches de estrada da área industrial ganham desenho próprio. No Terraço, com o nível 7, os pratos caprichados que ele empratar para os VIPs valem mais.

## Fora do escopo
- As falas da chegada e o Caderno da Rosa: v12.10.2.
- Os preços, as metas e os alvos do bot: v12.10.3.
- O desenho dos outros pratos: nada muda.

## Regras (decisões tomadas)
- **Prato que ele estranha** (`pratoEstranho(k, cursos, ponto)`, novo em `src/10-constantes.js`): é o prato `lento:true` que é sabido só pela regra do estranho da v12.10 (sem o básico do degrau dele). Enquanto for estranho:
  - o preparo leva **40% a mais** (`ESTRANHO = { cook:1.4, crit:0.5 }`, multiplicando o tempo do nível do Tonhão);
  - a chance de caprichado é a do nível **×0,5** (o ×1,5 do avançado não vale, porque o estranho não tem o básico do degrau e o avançado vem depois dele);
  - com o básico do degrau, deixa de ser estranho na hora (inclusive no meio do dia, se for o caso do modo dev).
- **O suor** (desenho, `src/21-cenario.js`, no Tonhão da cozinha): enquanto ele prepara um prato estranho, uma gota cai da testa dele a cada 1,2 s, aparecendo na testa e escorrendo ~6 px até sumir. Com `prefers-reduced-motion`, a gota fica parada na testa.
- **O papelzinho da receita:** em todo dia com algum prato estranho no cardápio, um papel pequeno (fundo creme, 3 riscos de texto, uma tachinha vermelha) fica preso na parede ao lado do fogão. Durante o preparo de um prato estranho, a cabeça do Tonhão vira para o papel por 0,5 s a cada 3 s (com `prefers-reduced-motion`, não vira).
- **Os 6 pratos de estrada com desenho próprio** (`drawDish`, `src/20-desenho-base.js`, no padrão da v12.8: o mesmo tamanho e a mesma luz dos outros; o avançado e o caprichado como nos outros):
  - `pastelFrango`: pastel dourado e retangular, com a borda de garfo, e um pouco de catupiry branco saindo num canto;
  - `pastelCarneSeca`: pastel maior, mais escuro, com fiapos de carne-seca e queijo derretido na ponta;
  - `xSalada`: pão de hambúrguer com gergelim, hambúrguer, queijo, alface e tomate aparecendo na borda;
  - `xTudo`: mais alto que o x-salada, com ovo frito, bacon, presunto e milho saindo pelos lados;
  - `enroladinho`: 2 enroladinhos de massa dourada em espiral, com a ponta da salsicha aparecendo;
  - `bolinhoCarneSeca`: 3 bolinhas douradas e rugosas, uma aberta mostrando a carne-seca desfiada.
- **Empratamento (nível 7 e acima):** quando um prato caprichado do Tonhão chega a uma mesa VIP, o grupo ganha **+1 coração** (até o máximo), a gorjeta da mesa sai **×1,25** e a nota de prato dessa mesa no Gúgou conta com **peso 2** na média do dia (como o `EXIGENTE.peso`). Constante `EMPRATA = { nivel:7, coracao:1, gorjeta:1.25, peso:2 }`. Vale em todo ponto (só que só se chega ao nível 7 no Terraço).
- **Modo dev:** no painel, **"Prato estranho"** (liga e desliga: com ele ligado, todos os pratos `lento` do ponto que forem sabidos contam como estranhos, mesmo com o degrau) e **"Forçar suor"** (a gota e o papelzinho aparecem o dia todo, para ver o desenho sem esperar o preparo).
- **Manual:** ficha nova na aba Equipe, `e-estranho`, revelada no primeiro dia com um prato estranho no cardápio: **"Cozinha nova"** — **"No ponto novo, o Tonhão já arrisca um prato de cada coisa que sabe, mas devagar e sem tanto capricho. O curso de lá resolve."** Ficha nova `e-emprata`, revelada com o nível 7: **"Empratamento"** — **"Prato caprichado na mesa de VIP: o VIP fica mais contente, deixa mais gorjeta e conta mais na nota."**
- **Save:** nada novo.
- **Versão:** `VERSAO` e `vtag` em v12.10.1; linha no `#ov-ver`: **"No ponto novo, o Tonhão estranha a cozinha e sua no fogão até fazer o curso de lá. Os lanches de estrada ganham desenho, e o empratamento chega ao Terraço."**

## Critérios de aceite
- **CA1** Na Avenida, com só o pastel da Garagem, `pratoEstranho('panqueca')` é verdadeiro; com as Panquecas, falso → `smoke118` (1)
- **CA2** O preparo da `panqueca` estranha leva 1,4× o da mesma panqueca sem ser estranha, no mesmo nível → `smoke118` (2)
- **CA3** A chance de caprichado do prato estranho é a metade da do nível → `smoke118` (3)
- **CA4** Com o nível 7, prato caprichado em mesa VIP dá +1 coração e gorjeta ×1,25; com o nível 6, não → `smoke118` (4)
- **CA5** Modo dev: "Prato estranho" faz a `panqueca` estranha mesmo com as Panquecas; "Forçar suor" liga a gota sem preparo → `smoke118` (5)
- **CA6** As fichas `e-estranho` e `e-emprata` aparecem quando reveladas → `smoke118` (6)
- **CA7** Os 6 pratos de estrada têm desenho próprio (o `drawDish` não cai no desenho do parecido), no balcão e na mesa, com e sem avançado → captura `shot_v12_10_1.js`: recorte ampliado de cada prato ao lado dos parecidos (pastel, bauru, risoles, bolinho)
- **CA8** A gota na testa e o papelzinho ao lado do fogão aparecem durante o preparo estranho e somem depois do curso; com `reducedMotion`, a gota fica parada → captura `shot_v12_10_1.js`: recorte da cozinha com e sem o suor

## Partes
- `src/10-constantes.js`: `pratoEstranho`, `ESTRANHO`, `EMPRATA`, `MANUAL` (`e-estranho`, `e-emprata`).
- `src/13-cozinha.js`: o tempo de preparo e o caprichado (perto das linhas 72 e 107).
- `src/12-clientes.js`: corações e gorjeta na entrega a VIP; a nota de prato com peso.
- `src/20-desenho-base.js`: `drawDish` (os 6 pratos).
- `src/21-cenario.js`: `drawKitchen` (a gota, o papelzinho e a cabeça do Tonhão).
- `src/40-interface.js`: `buildDev` ("Prato estranho", "Forçar suor").

## Tarefas
- [ ] T1 `smoke118` com os critérios CA1 a CA6 (falhando).
- [ ] T2 `pratoEstranho`, `ESTRANHO` e o efeito na cozinha.
- [ ] T3 `EMPRATA` (coração, gorjeta e peso da nota).
- [ ] T4 Desenho dos 6 pratos de estrada; `shot_v12_10_1.js` e conferência dos recortes ampliados.
- [ ] T5 O suor, o papelzinho e a cabeça virando; conferência por captura (com e sem `reducedMotion`).
- [ ] T6 Modo dev e Manual.
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, `docs/PARTES.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Testes
- `smoke118` novo (6 checagens). `shot_v12_10_1.js` novo (os pratos e a cozinha; capturas olhadas e apagadas).

## Decisões em aberto
1. **A gota e o papelzinho** (desenho descrito em Regras): aprovar. Sugestão: como está.

## Desvios
(No fechamento.)

**Modelo:** planejar com o Opus antes (rascunho; na aprovação, vira "Sonnet, esforço médio": desenho no canvas e regras pequenas com plano detalhado)
