# Varredura de sobreposições (iniciada em 17/11)

Pedido do usuário, 17/11: "Vai pesquisando por outras sobreposições etc e problemas similares a esses em outros níveis também. Provavelmente a sessão vai estourar, então deixa marcado pra recomeçar quando a sessão liberar".

**Como retomar:** leia só este arquivo. Siga a lista **Falta conferir** de cima para baixo; cada achado entra em **Achados** (ponto, o que encosta em quê, onde no código, sugestão), e o item sai da lista. No fim, os achados viram uma spec (planejar com o Opus: as decisões vão ao usuário), como as seções 6 e 7 da `docs/spec-v11.16.1.md`. A área industrial já está coberta por essa spec (seção 6); aqui só entra o que ela não cobre.

**Captura:** `node <scratchpad>/varre.js <pasta>` (o script está descrito abaixo; recrie se a pasta temporária tiver sido limpa). Monta o save no ponto com `L.DEV.on=true; g.devLuxoTudo(); L.DEV.on=false`, equipe cheia, `up.assento` e as TVs/som do ponto, `g.begin()` e uns 12 s de jogo para a fila e a retirada encherem; captura 960x600 em dsf 2 e recortes ampliados com PIL. Apague as capturas no fim.

## Falta conferir
- [ ] Terraço com o trio (só o pianista foi visto) e a Avenida com os sofás da espera (`up.assento:'sofa'`; a 1ª captura foi sem)
- [ ] Confirmar no jogo de verdade (sem `devLuxoTudo`) os achados de equipe: a Cami e o Joca só vão a certos pontos, então G2 pode não acontecer na Garagem real
- [ ] Equipe andando no salão (Dani, Joca, Cami, Anselmo, Lia) em cada ponto: encostam em móvel ou enfeite?
- [ ] Festa junina e jogo do Brasil em cada ponto (bandeirinhas, telão, gol)
- [ ] Chuva, feriado e noite da estrela (Terraço)
- [ ] Balões e textos flutuantes (pedido, doce, bebida, "Novo no Manual!") por cima de enfeites ou fora da tela
- [ ] Celular deitado (844x390): o HUD e o salão

## Achados
Conferidos em 17/11 (Garagem, Avenida e Terraço com `devLuxoTudo`, equipe cheia, fila e retirada cheias). O que a seção 6 da `docs/spec-v11.16.1.md` já resolve em todo ponto (a plaquinha do eFood centrada, a muda na lata no parapeito, as luminárias menores e sem cone) não se repete aqui.

### Garagem
- **G1** A cortina de chita da janela encosta no letreiro "LANCHES" (a bandô passa da janela para a direita). `drawCortinaChita` com `LUXO_JAN[0]` (`src/21-cenario.js`). Sugestão: a bandô e o painel ficam dentro de `j.x1`, sem os `+ 6`.
- **G2** A equipe parada no canto de baixo (a Cami e o Joca, na casa deles) fica em cima das cadeiras da frente da mesa 4 quando a mesa de 4 está no canto de baixo à direita. `CAMI_HOME` e `JOCA_HOME` (`src/10-constantes.js` ou a parte de cada um). Sugestão: a casa da equipe vira lugar proibido para mesa no editor do salão (como o caminho), ou a casa muda para perto do lixo. Confirmar no jogo de verdade (ver Falta conferir).
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
