/* ============================================================
   RANKING (db compartilhado do artifact, com fallback local)
   ============================================================ */
/* v8.3: a carreira virou campanha e os pontos, o lucro acumulado (antes, o faturamento dos melhores dias): ranking novo,
   em outra coleção (e outra lista no aparelho), para não misturar as contas */
const RK = { carreira:{ col:'ranking-campanha', local:'campanha' }, semfim:{ col:'ranking-semfim', local:'semfim' } };
const REFUSED = { invalid_argument:1, not_granted:1, capability_disabled:1, capability_removed:1, revoked:1, permission_denied:1, transform_error:1 };
function cleanName(v){
  return String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,16).trim();
}
function normName(v){
  let n = cleanName(v);
  try { n = n.normalize('NFD').replace(/[̀-ͯ]/g,''); } catch(e) {}
  return n.toLowerCase();
}
function sortRows(rows, by, dir){
  const m = dir === 'asc' ? 1 : -1;
  const cn = (a,b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity:'base' });
  return rows.slice().sort((a,b) => by === 'nome' ? (m * cn(a,b) || b.pontos - a.pontos) : (m * (a.pontos - b.pontos) || cn(a,b)));
}
/* linhas vindas do db são dados não confiáveis: normaliza tudo */
function toRow(d, id, uid){
  if (!d || typeof d !== 'object') return null;
  const pontos = Math.round(Number(d.pontos));
  if (!isFinite(pontos)) return null;
  return {
    id: String(id), nome: cleanName(d.nome) || 'Anônimo', pontos,
    dia: Math.max(0, Math.round(Number(d.dia)) || 0), tempo: Math.max(0, Math.round(Number(d.tempo)) || 0),
    me: !!uid && id === uid
  };
}
const delay = ms => new Promise(r => setTimeout(r, ms));
const Rank = {
  db:null, user:null, uid:null, ready:null, done:false,
  init(){
    if (this.ready) return this.ready;
    this.ready = (async () => {
      try {
        const cl = window.claude;
        if (!cl || typeof cl.use !== 'function') return;
        const grab = n => { try { return Promise.resolve(cl.use(n)).then(v => v || null, () => null); } catch(e) { return Promise.resolve(null); } };
        const r = await Promise.all([grab('db'), grab('user')]);
        this.db = r[0]; this.user = r[1];
        if (this.user && typeof this.user.id === 'function'){
          try {
            const id = await this.user.id();
            this.uid = (typeof id === 'string' && /^[A-Za-z0-9_.~:@+-]{1,200}$/.test(id) && id !== '.' && id !== '..') ? id : null;
          } catch(e) { this.uid = null; }
        }
      } catch(e) {}
      this.done = true;
    })();
    return this.ready;
  },
  get shared(){ return !!(this.db && this.uid); },
  /* chamada ao db com limite de tempo e uma nova tentativa em caso de falha transitória */
  async call(fn){
    const once = () => Promise.race([ Promise.resolve().then(fn), new Promise((_, rej) => setTimeout(() => rej({ code:'unavailable', message:'tempo esgotado' }), 9000)) ]);
    try { return await once(); }
    catch(e){
      if (e && e.code === 'unavailable'){ await delay(300 + Math.random()*500); return await once(); }
      throw e;
    }
  },
  /* tudo o que está no aparelho (as listas antigas ficam guardadas como estão) */
  loadLocal(){
    let o = null;
    try { o = JSON.parse(lsGet(LS.rank) || 'null'); } catch(e) {}
    return (o && typeof o === 'object' && !Array.isArray(o)) ? o : {};
  },
  localList(all, kind){ const l = all[RK[kind].local]; return Array.isArray(l) ? l : []; },
  localRows(kind){
    return this.localList(this.loadLocal(), kind).map((r,i) => toRow(r, 'local' + i, null)).filter(Boolean);
  },
  saveLocal(kind, body){
    const all = this.loadLocal(), list = this.localList(all, kind), key = normName(body.nome);
    const i = list.findIndex(r => r && r.key === key);
    let improved = true, best = body.pontos;
    if (i >= 0){
      if (body.pontos > (+list[i].pontos || 0)) list[i] = Object.assign({ key }, body);
      else { improved = false; best = +list[i].pontos || 0; list[i].nome = body.nome; }
    } else list.push(Object.assign({ key }, body));
    list.sort((a,b) => (+b.pontos || 0) - (+a.pontos || 0));
    all[RK[kind].local] = list.slice(0, 50);
    lsSet(LS.rank, JSON.stringify(all));
    return { where:'local', improved, best };
  },
  async saveShared(kind, body){
    const ref = this.db.collection(RK[kind].col).doc(this.uid);
    const snap = await this.call(() => ref.get());
    const prev = snap && snap.exists ? snap.data() : null;
    const prevPts = prev && isFinite(Number(prev.pontos)) ? Number(prev.pontos) : -1;
    if (!prev || body.pontos > prevPts){
      await this.call(() => ref.set(body));
      return { where:'shared', improved:true, best:body.pontos };
    }
    if (prev.nome !== body.nome) await this.call(() => ref.update({ nome: body.nome }));
    return { where:'shared', improved:false, best:prevPts };
  },
  /* kind: 'carreira' | 'semfim'. Resolve {where, improved, best, refused?} ou rejeita com erro de rede */
  async saveScore(kind, nome, pontos, extra){
    nome = cleanName(nome);
    pontos = Math.max(0, Math.round(Number(pontos) || 0));
    const body = { nome, pontos };
    if (kind === 'carreira') body.dia = Math.max(0, Math.round((extra && extra.dia) || 0));
    else body.tempo = Math.max(0, Math.round((extra && extra.tempo) || 0));
    body.quando = new Date().toISOString();
    await Promise.race([ this.init(), delay(4000) ]);
    if (this.shared){
      try { return await this.saveShared(kind, body); }
      catch(e){
        if (e && REFUSED[e.code]){ const r = this.saveLocal(kind, body); r.refused = true; return r; }
        throw e;
      }
    }
    return this.saveLocal(kind, body);
  },
  /* assina a coleção da aba (uma vez); cb(rows, 'shared'|'local'); devolve a função de cancelar */
  subscribe(kind, cb){
    if (this.shared){
      let dead = false, unsub = null;
      try {
        unsub = this.db.collection(RK[kind].col).orderBy('pontos','desc').limit(50).onSnapshot(
          snap => {
            if (dead) return;
            const rows = [];
            snap.docs.forEach(dc => { let d; try { d = dc.data(); } catch(e) { return; } const r = toRow(d, dc.id, this.uid); if (r) rows.push(r); });
            cb(rows, 'shared');
          },
          () => { if (dead) return; dead = true; cb(this.localRows(kind), 'local'); }
        );
      } catch(e) { dead = true; cb(this.localRows(kind), 'local'); return () => {}; }
      return () => { dead = true; try { if (unsub) unsub(); } catch(e) {} };
    }
    cb(this.localRows(kind), 'local');
    return () => {};
  }
};

