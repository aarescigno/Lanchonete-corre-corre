// Carrega o jogo (tests/jogo.js, extraído do arquivo montado pelo run_all.sh) no Node, com um DOM falso.
// Uso: const load=require('./harness'); const {jogo, api, els, store}=load({store:{...}, novo:semente});
// opts.store: localStorage inicial (objeto); opts.semAcesso: localStorage lança erro; opts.novo: começa um jogo com essa semente.
// Para apertar um botão: els['bt-avancar'].fire('click').
const fs = require('fs'), vm = require('vm');

function mkCtx(){   // canvas 2D falso (caso o jogo desenhe gráficos)
  return new Proxy({}, { get:(o,k)=> k in o ? o[k] : k==='measureText' ? ()=>({width:10}) : /^create(Linear|Radial)Gradient$/.test(k) ? ()=>({addColorStop(){}}) : ()=>{},
    set:(o,k,v)=>{ o[k]=v; return true; } });
}

module.exports = function load(opts){
  opts = opts || {};
  const code = fs.readFileSync(__dirname + '/' + (process.env.JOGOJS || 'jogo.js'), 'utf8');
  const els = {};
  function mkEl(id){
    const e = { id, tagName:'DIV', listeners:{}, children:[], textContent:'', innerHTML:'', className:'', disabled:false, value:'', style:{setProperty(){}},
      classList:{ _s:new Set(), add(c){this._s.add(c)}, remove(c){this._s.delete(c)}, toggle(c,f){ (f===undefined?!this._s.has(c):f) ? this._s.add(c) : this._s.delete(c) }, contains(c){return this._s.has(c)} },
      appendChild(c){ this.children.push(c); return c; }, removeChild(c){ this.children = this.children.filter(x=>x!==c); },
      addEventListener(n,f){ (this.listeners[n] = this.listeners[n] || []).push(f); },
      fire(n,ev){ (this.listeners[n] || []).forEach(f => f(ev || {preventDefault(){}, stopPropagation(){}})); },
      setAttribute(k,v){ (this.attrs = this.attrs || {})[k] = v; }, getAttribute(k){ return (this.attrs || {})[k]; },
      querySelector(){ return null; }, querySelectorAll(){ return []; },
      getBoundingClientRect(){ return {left:0, top:0, width:960, height:600}; }, getContext(){ return mkCtx(); } };
    return e;
  }
  // as telas começam como no HTML: só o menu ativo
  const doc = { getElementById: id => els[id] || (els[id] = mkEl(id)), createElement: t => { const e = mkEl(t); e.tagName = String(t).toUpperCase(); return e; },
    querySelector(){ return null; }, querySelectorAll(){ return []; }, addEventListener(){}, hidden:false };
  doc.getElementById('tela-menu').classList.add('ativa');
  const win = { innerWidth:960, innerHeight:600, devicePixelRatio:1, addEventListener(){}, requestAnimationFrame(){}, matchMedia:()=>({matches:!!opts.rm, addEventListener(){}}) };
  const store = Object.assign({}, opts.store || {});
  const ls = { getItem:k => Object.prototype.hasOwnProperty.call(store,k) ? store[k] : null, setItem:(k,v) => { store[k] = String(v); }, removeItem:k => { delete store[k]; } };
  const sandbox = { window:win, document:doc, console, Math, Date, JSON, Object, Array, Set, Map, Number, String, Boolean, Infinity, NaN, isFinite, isNaN, parseInt, parseFloat,
    setTimeout:()=>0, clearTimeout:()=>{}, Promise, RegExp, Error, TypeError };
  if (opts.semAcesso) Object.defineProperty(sandbox, 'localStorage', { get(){ throw new Error('SecurityError'); } });
  else sandbox.localStorage = ls;
  win.window = win;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename:'jogo.js' });
  const api = win.__api;
  if (opts.novo !== undefined){   // começa um jogo com semente fixa, sem passar pelo botão (que usa a hora)
    const Jogo = api.Jogo;
    win.__jogo = new Jogo(api.novoEstado(opts.novo));
  }
  return { get jogo(){ return win.__jogo; }, api, els, store, win, doc };
};

// Contador de verificações para os smokes: const t=require('./harness').teste(); t.ok(cond,'nome'); t.fim();
module.exports.teste = function(){
  let n = 0, fails = 0;
  return {
    ok(cond, nome){ n++; if (!cond){ fails++; console.log('FAIL', nome); } },
    fim(){ console.log(`${n} verificações, fails = ${fails}`); process.exit(fails ? 1 : 0); },
  };
};
