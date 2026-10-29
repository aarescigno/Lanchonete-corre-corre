const fs=require('fs'), vm=require('vm');
function mkCtx(){
  const t={};
  return new Proxy(t,{get:(o,k)=>{
    if(k in o) return o[k];
    if(k==='measureText') return ()=>({width:10});
    if(/^create(Linear|Radial)Gradient$/.test(k)) return ()=>({addColorStop(){}});
    return ()=>{};
  }, set:(o,k,v)=>{o[k]=v;return true;}});
}
// opts: {claude: stub|undefined, online:bool (v8.3.3: liga o ranking compartilhado, que o jogo deixa desligado), store: initial localStorage object, noStorage:bool, rm:boolean, imprevistos:bool, saveAntigo:bool (v8.6.9: não marca o save injetado como do cardápio novo)}
module.exports=function load(opts){
  opts=opts||{};
  const code=fs.readFileSync(__dirname+'/'+(process.env.GAMEJS||'game.js'),'utf8');
  const ctx=mkCtx();
  const els={};
  function mkEl(id){
    const e={id, listeners:{}, style:{setProperty(){}}, children:[], textContent:'', disabled:false, className:'', width:960, height:600, value:'', tagName:'DIV', maxLength:0,
      classList:{_s:new Set(), add(c){this._s.add(c)}, remove(c){this._s.delete(c)}, contains(c){return this._s.has(c)}},
      appendChild(c){this.children.push(c);return c},
      removeChild(c){this.children=this.children.filter(x=>x!==c)},
      get firstChild(){return this.children[0]||null},
      addEventListener(n,f){(this.listeners[n]=this.listeners[n]||[]).push(f)},
      fire(n,ev){(this.listeners[n]||[]).forEach(f=>f(ev||{preventDefault(){}}))},
      setAttribute(k,v){(this.attrs=this.attrs||{})[k]=v}, getAttribute(k){return (this.attrs||{})[k]},
      querySelectorAll(){ return this.children.filter(c=>c.tagName==='BUTTON'); },
      getBoundingClientRect(){return{left:0,top:0,width:960,height:600}}, getContext(){return ctx}};
    return e;
  }
  const doc={getElementById:id=>els[id]||(els[id]=mkEl(id)), createElement:t=>{const e=mkEl(t); e.tagName=String(t).toUpperCase(); return e;}, addEventListener(){}, hidden:false};
  const win={innerWidth:960,innerHeight:600,devicePixelRatio:1,addEventListener(){},requestAnimationFrame(){},matchMedia:()=>({matches:!!opts.rm})};
  const store=Object.assign(opts.abertura?{}:{lcc2_abertura:'1'}, opts.store||{});
  // v8.6.9: um save injetado sem cardV valeria como antigo e recomeçaria do dia 1; os testes que não são do save antigo ganham o cardV (opts.saveAntigo: deixa como veio)
  if(!opts.saveAntigo&&store.lcc2_save){ try{ const o=JSON.parse(store.lcc2_save); if(o&&typeof o==='object'&&o.cardV==null){ o.cardV=1; store.lcc2_save=JSON.stringify(o); } }catch(e){} }   // v8.5: abertura já vista, a não ser que o teste peça (opts.abertura)
  const ls = opts.noStorage ? undefined : { getItem:k=>Object.prototype.hasOwnProperty.call(store,k)?store[k]:null, setItem:(k,v)=>{store[k]=String(v)}, removeItem:k=>{delete store[k]} };
  if (opts.throwStorage) { /* acessos lançam */ }
  const sandbox={window:win,document:doc,console,Math,Date,JSON,Object,Array,Set,Number,String,Infinity,isFinite,parseInt,parseFloat,setTimeout,clearTimeout,Promise,RegExp,Error,TypeError};
  if (ls) sandbox.localStorage=ls;
  if (opts.throwStorage) Object.defineProperty(sandbox,'localStorage',{get(){throw new Error('SecurityError');}});
  if (opts.claude!==undefined) win.claude=opts.claude;
  win.window=win;
  vm.createContext(sandbox);
  vm.runInContext(code,sandbox);
  // v8: sem quebras, chuva nem feriado, a não ser que o teste peça (opts.imprevistos)
  if (!opts.imprevistos && win.__lcc && win.__lcc.MANUT) win.__lcc.MANUT.on=false;
  if (opts.online && win.__lcc){ const R=win.__lcc.Rank; R.online=true; R.ready=null; R.done=false; }
  return { g:win.__game, L:win.__lcc, els, win, ctx, store, doc };
};
