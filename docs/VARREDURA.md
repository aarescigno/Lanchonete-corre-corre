# Varredura de sobreposições (iniciada em 17/11)

Pedido do usuário, 17/11: "Vai pesquisando por outras sobreposições etc e problemas similares a esses em outros níveis também. Provavelmente a sessão vai estourar, então deixa marcado pra recomeçar quando a sessão liberar".

**Como retomar:** leia só este arquivo. Siga a lista **Falta conferir** de cima para baixo; cada achado entra em **Achados** (ponto, o que encosta em quê, onde no código, sugestão), e o item sai da lista. No fim, os achados viram uma spec (planejar com o Opus: as decisões vão ao usuário), como as seções 6 e 7 da `docs/spec-v11.16.1.md`. A área industrial já está coberta por essa spec (seção 6); aqui só entra o que ela não cobre.

**Captura:** `node <scratchpad>/varre.js <pasta>` (o script está descrito abaixo; recrie se a pasta temporária tiver sido limpa). Monta o save no ponto com `L.DEV.on=true; g.devLuxoTudo(); L.DEV.on=false`, equipe cheia, `up.assento` e as TVs/som do ponto, `g.begin()` e uns 12 s de jogo para a fila e a retirada encherem; captura 960x600 em dsf 2 e recortes ampliados com PIL. Apague as capturas no fim.

## Falta conferir
Nada: a varredura terminou em 17/11. Os achados abaixo esperam virar spec (planejar com o Opus, esforço médio ou alto; as decisões de estilo, como T1, T2 e N5, vão ao usuário). Não vistos nas capturas, de baixa prioridade: os textos "Novo no Manual!" e "Pedido na Efood!" (saem só na 1ª vez de cada tipo e na chegada do entregador); conferir junto com a spec.

## Achados
**Reconferido na v11.18 (17/11, de madrugada), com chuva na Garagem, na Avenida e no Terraço.** Situação de cada achado abaixo:
- **Resolvidos pela v11.16.1:** na área industrial, as luminárias (menores, sem cone), a jarra fora do lugar 1, o antúrio no canto do salão, o poste, a foto da Rosa e a samambaia; as plaquinhas "eFood" (agora acima dos balões, em todo ponto). **A2** em parte: o selo VIP já não cobre o número do lugar (os corações ainda encostam no grupo de cima).
- **Continuam:** G1, G2, G3, G4, A1, A3, A4, A5, T1 a T10, I1 (vale também na Garagem, na Avenida e no Terraço: ver N6), I2 (só as TVs: a samambaia já saiu de perto), I3 e C1 (o "Lotado!" também no computador).
- **Novos (da v11.16.1 em diante ou só vistos agora):**
  - **N1** A muda na lata, que a v11.16.1 levou para o parapeito, fica em cima do vidro da janela (Garagem, área industrial e Avenida) e, no Terraço, **em cima do letreiro "Terraço Suíça"**. Sugestão: no Terraço a lata fica no chão do foyer, ao lado da espada; nos outros, no canto de baixo do parapeito, fora do vidro (ou de volta ao chão, ao lado da porta, se não couber).
  - **N2** Os fios de bandeirinhas do salão, agora de parede a parede, passam por cima da lousa "HOJE" (em todo ponto). Sugestão: a ponta da esquerda prende na lateral direita da lousa, ou os fios sobem acima dela.
  - **N3** Na chuva, as poças da calçada cobrem o número do lugar da espera (lugares 2 e 4 na Garagem). Sugestão: as poças não ficam em cima dos números nem das plaquinhas; sorteadas fora das caixas dos lugares.
  - **N4** Na Avenida com os sofás, as poças da chuva ficam em cima das almofadas do sofá. Sugestão: sem poça onde há sofá (a espera tem toldo) ou as poças só nas bordas da calçada.
  - **N5** No Terraço, a chuva (os riscos e as poças) cai **dentro do foyer**, que é por dentro do prédio. Sugestão: no Terraço, a chuva aparece só na janela panorâmica do salão.
  - **N6** A ponta da direita dos fios do salão passa por cima da prateleira das marmitas (Garagem, área industrial e Avenida) e da geladeira (Avenida e Terraço). Junta-se ao I1: a ponta prende antes deles.
Conferidos em 17/11 (Garagem, Avenida e Terraço com `devLuxoTudo`, equipe cheia, fila e retirada cheias). O que a seção 6 da `docs/spec-v11.16.1.md` já resolve em todo ponto (a plaquinha do eFood centrada, a muda na lata no parapeito, as luminárias menores e sem cone) não se repete aqui.

### Garagem
- **G1** A cortina de chita da janela encosta no letreiro "LANCHES" (a bandô passa da janela para a direita). `drawCortinaChita` com `LUXO_JAN[0]` (`src/21-cenario.js`). Sugestão: a bandô e o painel ficam dentro de `j.x1`, sem os `+ 6`.
- **G2** A equipe parada no canto de baixo (a Cami e o Joca, na casa deles) fica em cima das cadeiras da frente da mesa 4 quando a mesa de 4 está no canto de baixo à direita. Visto igual nos 4 pontos (a mesma arrumação de mesas). Confirmado no código: as casas são fixas (`CAMI_HOME` em `{590,515}` e `JOCA_HOME` em `{640,515}`, `src/10-constantes.js`; `DANI_HOME` em `src/15-dani.js`) e o editor do salão não impede mesa em cima delas, então acontece em qualquer ponto em que a equipe esteja. `CAMI_HOME` e `JOCA_HOME` (`src/10-constantes.js` ou a parte de cada um). Sugestão: a casa da equipe vira lugar proibido para mesa no editor do salão (como o caminho), ou a casa muda para perto do lixo. Confirmar no jogo de verdade (ver Falta conferir).
- **G3** A samambaia pendurada encosta na moldura da foto da Rosa (as folhas da direita). `DECOR_POS[0]` (`samambaia:[42,30,1]`, `foto:[88,36,1]`). Sugestão: foto 6 px para a direita ou samambaia em escala 0,9.

### Avenida Brasil
- **A1** Os entregadores no balcão de retirada ficam na frente do canteiro de tulipas, que some atrás deles; a samambaia pendurada encosta na espada-de-são-jorge na lata, no canto de cima. O canteiro e as plantas do alto da calçada estão no mesmo lugar da fila de retirada (`RETIRADA.fila`, y 160). Sugestão: o canteiro desce para a faixa entre a retirada e o lugar 6 da espera ou vai para o lado direito da porta; a samambaia pendurada vai para o toldo, longe da lata.
- **A2** Com 6 lugares de espera (mais juntos), o selo "VIP" cobre o número do lugar, e os corações de um grupo encostam nas cabeças do grupo de cima. `queueYsFor(6)` e o desenho do selo VIP e dos corações na fila (`src/22-salao-hud.js`). Sugestão: o selo VIP vai para o outro lado do grupo (ou para cima do número), e os corações do grupo na fila ficam menores (escala 0,8) quando a espera tiver 6 lugares.
- **A3** A samambaia (`DECOR_POS[2]`, `[630,78,.8]`) fica atrás da cabeça do Anselmo, no balcão de drinks, e passa da linha da parede. Sugestão: no ponto com o Anselmo, a samambaia vai para o outro lado do cardápio (perto da porta) ou sobe acima da linha da parede, longe do balcão.
- **A4** O antúrio encosta na mesinha das águas da espera (o mesmo caso da jarra da área industrial). Sugestão: o mesmo da seção 6 da spec (o antúrio no canto do salão), valendo também na Avenida.

### Terraço Suíça
- **T1** As luminárias de fábrica (enfeite da área industrial, `nivel:2`) continuam no Terraço junto com o lustre de cristal: duas luzes de estilos diferentes, e as de baixo encostam nas cadeiras (o que a spec já melhora). Sugestão: no Terraço, a luminária de fábrica não aparece (o lustre fica), como o linho e o mármore já trocam as mesas.
- **T2** A cortina de chita (enfeite da Garagem) aparece na janela panorâmica do Terraço, por cima da cortina de veludo vermelho; o mesmo vale para o pisca-pisca no alto. Sugestão: decisão de estilo para o usuário: no Terraço a chita não aparece (fica o veludo) e o pisca-pisca vira o fio de lâmpadas brancas.
- **T3** O vaso de flores em cima da geladeira encosta no relógio. Sugestão: o vaso desce 6 px ou vai para o canto esquerdo do tampo da geladeira.
- **T4** O canto de cima à esquerda do foyer fica amontoado: a espada na lata encosta na porta do elevador, a samambaia pendurada fica entre a espada e o canteiro de tulipas, e a orquídea na mesinha encosta em tudo. Sugestão: no Terraço, a espada vai para o canto de baixo (ao lado do antúrio) e a samambaia pendurada para o toldo do lado direito; o canteiro fica onde está.
- **T5** A Lia, na cozinha, aparece encostada na palavra "PEDIDOS" do painel. Sugestão: o rótulo "PEDIDOS" sobe 6 px ou a Lia anda 10 px para a direita na casa dela (`LIA_HOME`).
- **T6** O banco do pianista passa da borda de baixo do salão. `drawPianista` / `TERRACO.piano`. Sugestão: o piano sobe 8 px.
- **A3 também vale aqui** (a samambaia atrás do Anselmo).
- **T7** O trio de cordas (`drawTrio`, `items` com y 528) fica embaixo da cadeira da frente da mesa 3 e os banquinhos passam da borda de baixo do salão. Sugestão: o trio vira lugar proibido para mesa no editor (como o piano), ou sobe para a faixa livre entre o piano e a mesa 3.
- **T8** Na festa junina, os fios de bandeirinhas do salão passam pelo meio do lustre de cristal. Sugestão: no Terraço, os fios sobem acima do lustre (ou a ponta do meio desvia dele); conferir junto com a seção 3 da spec, que prende os fios nas paredes.
- **T9** No Terraço, o fio de bandeirinhas da calçada (festa junina, jogo e feriado) passa por cima do letreiro "Terraço Suíça" e das arandelas do foyer. Sugestão: no Terraço, o fio da calçada não aparece (o foyer é por dentro do prédio) e fica só o do salão.

### Área industrial (o que a seção 6 da spec não cobre)
- **I1** Na festa junina, o fio de bandeirinhas do salão passa por cima da prateleira das marmitas do eFood (e, com a seção 3 da spec levando o fio até a parede da cozinha, vai continuar passando). Sugestão: a ponta da direita prende na lateral da prateleira quando ela existir (Garagem, área industrial e Avenida).
- **I2** As 3 TVs passam da linha da parede para o chão, e a samambaia encosta na TV da direita. Sugestão: as TVs sobem até a linha; a samambaia já muda de lugar na seção 6 (conferir lá que não encosta nas TVs).
- **I3** Na espera sentada, os corações do grupo ficam por cima do 4º banquinho. Sugestão: os corações vão para cima das cabeças, como nos outros pontos, ou ficam menores (ver A2).

### Garagem (eventos)
- **G4** No jogo do Brasil e na festa junina, o fio de bandeirinhas da calçada encosta na plaquinha "Nº 27" e passa por cima da janela. Sugestão: o fio sobe 6 px ou a barriga dele diminui (o `7*4*u*(1 - u)` de `drawBandeirinhas`).

### Avenida (eventos e sofás)
- **A5** Com os sofás da espera, as almofadas vermelhas do braço do sofá ficam embaixo dos corações dos grupos, e os balões de bebida encostam no braço do sofá. Pequeno; sugestão: os corações sobem 4 px quando a espera é no sofá.

### Terraço (noite da estrela)
- **T10** Na noite da estrela, a vela de cada mesa (`drawVela` em `t.cx + t.hx * 0.5`) encosta no porta-guardanapo do mármore e do linho. Sugestão: a vela vai para o meio da frente do tampo, ou o porta-guardanapo some na noite da estrela (a seção 5 da spec já tira o enfeite de vela nessa noite).

### Em todo ponto
- **C1** O aviso "Lotado!" (quando a espera enche) sai no alto da calçada, por cima dos entregadores do eFood, dos corações deles e do balão de bebida do lugar de cima. Visto no celular deitado (844x390), e o lugar é o mesmo no computador. Sugestão: o aviso sai no meio da faixa da espera (ou em cima do lugar 1), longe da retirada.
- **C2** No celular deitado (844x390), o resto cabe: é a mesma tela, só menor; nada a mais encosta.
- **C3** Com o bot servindo (o `tests/botpage.js`, `window.run(6,true)` a cada quadro), os textos que sobem de uma mesa se empilham uns sobre os outros e sobre os corações: "Suco entregue!", "Corrente ×3! +20 pts", a gorjeta e o "na conta" saem quase juntos no mesmo lugar. Sugestão: cada texto novo no mesmo lugar começa um pouco mais acima do anterior que ainda está subindo (uma fila por lugar), ou os de pontos e dinheiro vão juntos numa linha só.
- **C4** O "Mãos cheias!" sai por cima dos painéis da cozinha (PRONTOS e CAFEZINHO) quando a Bia está no passa-pratos. Sugestão: perto da Bia, mas do lado do salão.
- **C5** A equipe andando (Dani, Joca e Cami, vistos com o bot) não atravessou móvel nem enfeite nos quadros vistos; o problema da equipe é só a casa dela (G2).

