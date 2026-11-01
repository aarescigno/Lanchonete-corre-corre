
/* ========== Simulação (classe Jogo) ==========
   Sem DOM: não toca em document nem em window. A interface lê jogo.estado e chama os métodos. */
class Jogo {
  constructor(estado){
    this.estado = estado;
    this.sorte = criaSorte(estado.sorte);
  }
  get acabou(){ return this.estado.semana >= CFG.semanas; }

  forca(){
    const eq = this.estado.equipe;
    return eq.reduce((s, m) => s + m.nivel, 0) / eq.length;
  }

  // Avança uma semana: uma rodada contra um rival, finanças e evolução da equipe.
  avancar(){
    const e = this.estado, s = this.sorte;
    if (this.acabou) return null;
    const rival = RIVAIS[e.semana % RIVAIS.length];
    const nos = this.forca() + s.num() * CFG.sorteJogo;
    const eles = rival.forca + s.num() * CFG.sorteJogo;
    const dif = nos - eles;
    const res = dif > 4 ? 'V' : dif < -4 ? 'D' : 'E';
    const receita = res === 'V' ? CFG.receitaVitoria : res === 'E' ? CFG.receitaEmpate : CFG.receitaDerrota;
    const salarios = Math.round(e.equipe.reduce((t, m) => t + m.nivel * CFG.salarioPorNivel, 0));
    e.caixa += receita - salarios;
    const nosLinha = e.tabela.find(t => t.nos), rivLinha = e.tabela.find(t => t.nome === rival.nome);
    if (res === 'V') nosLinha.pts += 3; else if (res === 'D') rivLinha.pts += 3; else { nosLinha.pts++; rivLinha.pts++; }
    // os outros rivais jogam entre si
    for (const t of e.tabela) if (!t.nos && t !== rivLinha) t.pts += s.escolhe([0, 1, 3]);
    for (const m of e.equipe) if (s.chance(CFG.evolucaoChance)) m.nivel = Math.min(99, m.nivel + 1);
    e.semana++;
    const r = { semana: e.semana, rival: rival.nome, res, receita, salarios };
    e.historico.push(r);
    e.sorte = s.estado();
    return r;
  }

  posicao(){
    const ord = this.estado.tabela.slice().sort((a, b) => b.pts - a.pts);
    return ord.findIndex(t => t.nos) + 1;
  }

  resumoTemporada(){
    const h = this.estado.historico;
    const conta = k => h.filter(r => r.res === k).length;
    return { temporada: this.estado.temporada, posicao: this.posicao(), V: conta('V'), E: conta('E'), D: conta('D'), caixa: this.estado.caixa };
  }

  novaTemporada(){
    const e = this.estado;
    e.temporada++; e.semana = 0; e.historico = [];
    for (const t of e.tabela) t.pts = 0;
  }
}
