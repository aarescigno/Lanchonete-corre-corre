/* ============================================================
   CONVERSAS DO MODO HISTÓRIA (v8.7)
   Falas (HISTORIA em 10-constantes.js) em balões sobre o salão parado; o desenho fica em 26-conversa.js. Um toque, clique,
   Enter ou espaço passa para a próxima fala, "Pular" fecha a conversa; no fim, fim() segue o fluxo (tela de 43-telas.js).
   Com movimento reduzido, o balão aparece direto, sem a entrada animada.
   ============================================================ */
class Conversa {
  constructor(falas, fim, rm){
    this.falas = falas; this.fim = fim; this.rm = !!rm;
    this.i = 0; this.t = 0; this.acabou = false;
    this.onFala = null;   // chamado a cada fala nova (o leitor de tela)
  }
  get fala(){ return this.falas[this.i]; }
  // quanto o balão já entrou, de 0 a 1 (com movimento reduzido, sempre 1)
  get entra(){ return this.rm ? 1 : clamp(this.t / 0.18, 0, 1); }
  // a fala para o leitor de tela
  texto(){ const f = this.fala; return f ? HIST_NOMES[f.q] + ': ' + (f.nota ? f.nota + '. ' : '') + f.s : ''; }
  update(dt){ if (!this.acabou) this.t += dt; }
  seguir(){
    if (this.acabou) return;
    if (this.i + 1 >= this.falas.length) return this.terminar();
    this.i++; this.t = 0;
    if (this.onFala) this.onFala(this);
  }
  pular(){ this.terminar(); }
  terminar(){ if (this.acabou) return; this.acabou = true; if (this.fim) this.fim(this); }
}
