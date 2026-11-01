
/* ========== Estado, save e migração ==========
   O estado é um objeto JSON puro: é ele que vai no save. */
function novoEstado(semente){
  const sorte = criaSorte(semente);
  const equipe = [];
  for (let i = 0; i < 6; i++) equipe.push({ nome: sorte.escolhe(NOMES), nivel: sorte.int(40, 60) });
  return {
    v: SAVE_V, versao: VERSAO, sorte: sorte.estado(),
    temporada: 1, semana: 0, caixa: CFG.caixaInicial,
    equipe,
    tabela: [{nome:'Nossa equipe', pts:0, nos:true}].concat(RIVAIS.map(r => ({nome:r.nome, pts:0}))),
    historico: [],               // resultado de cada rodada da temporada
  };
}

// MIGRA[n] leva um save da versão n para n+1. Ex.: MIGRA[1] = e => { e.moral = 50; return e; }
const MIGRA = {};

function migra(e){
  if (!e || typeof e !== 'object' || typeof e.v !== 'number') throw new Error('save inválido');
  while (e.v < SAVE_V){
    const f = MIGRA[e.v];
    if (!f) throw new Error('save sem migração da versão ' + e.v);
    e = f(e); e.v++;
  }
  return e;
}

const Save = {
  salvar(estado){ try { localStorage.setItem(CHAVE + '_save', JSON.stringify(estado)); return true; } catch (err) { return false; } },
  carregar(){
    let txt = null;
    try { txt = localStorage.getItem(CHAVE + '_save'); } catch (err) { return { erro: 'sem acesso ao armazenamento' }; }
    if (!txt) return null;
    try { return { estado: migra(JSON.parse(txt)) }; } catch (err) { return { erro: String(err.message || err) }; }
  },
  apagar(){ try { localStorage.removeItem(CHAVE + '_save'); } catch (err) {} },
};
