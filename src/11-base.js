/* ============================================================
   UTILIDADES
   ============================================================ */
const rand  = (a,b) => a + Math.random()*(b-a);
const randi = (a,b) => Math.floor(a + Math.random()*(b-a+1));
const pick  = arr => arr[Math.floor(Math.random()*arr.length)];
const clamp = (v,a,b) => v<a?a:(v>b?b:v);
const fmt   = n => (Math.round(n) < 0 ? '-R$ ' : 'R$ ') + Math.abs(Math.round(n));

/* ============================================================
   ÁUDIO (WebAudio sintetizado)
   ============================================================ */
const Sfx = {
  ctx:null, muted:false,
  init(){
    if (this.ctx) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
    } catch(e) { this.ctx = null; }
  },
  resume(){ try { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); } catch(e) {} },
  tone(f, dur, type, vol, delay, to){
    if (!this.ctx || this.muted) return;
    try {
      const c = this.ctx, t0 = c.currentTime + (delay||0);
      const o = c.createOscillator(), g = c.createGain();
      o.type = type || 'square';
      o.frequency.setValueAtTime(f, t0);
      if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol || 0.06, t0 + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(c.destination);
      o.start(t0); o.stop(t0 + dur + 0.03);
    } catch(e) {}
  },
  noise(dur, vol, delay, freq){
    if (!this.ctx || this.muted) return;
    try {
      const c = this.ctx, t0 = c.currentTime + (delay||0);
      const n = Math.max(1, Math.floor(c.sampleRate * dur));
      const buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
      for (let i=0;i<n;i++) d[i] = (Math.random()*2-1) * (1 - i/n);
      const s = c.createBufferSource(); s.buffer = buf;
      const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = freq || 800;
      const g = c.createGain(); g.gain.value = vol || 0.1;
      s.connect(f); f.connect(g); g.connect(c.destination);
      s.start(t0);
    } catch(e) {}
  },
  blip(){  this.tone(620, 0.07, 'square', 0.05); },
  tap(){   this.tone(420, 0.05, 'triangle', 0.07); },
  coin(){  this.tone(988, 0.07, 'square', 0.06); this.tone(1318, 0.2, 'square', 0.06, 0.07); },
  bell(){  this.tone(1568, 0.6, 'sine', 0.12); this.tone(2093, 0.5, 'sine', 0.05, 0.03); },
  huff(){  this.noise(0.4, 0.14, 0, 700); this.tone(200, 0.3, 'sawtooth', 0.04, 0, 90); },
  boing(){ this.tone(300, 0.25, 'sine', 0.1, 0, 120); this.tone(180, 0.2, 'sine', 0.06, 0.1, 360); },
  ok(){    this.tone(523, 0.08, 'square', 0.05); this.tone(784, 0.12, 'square', 0.05, 0.08); },
  win(){   [523,659,784,1046].forEach((f,i)=>this.tone(f, 0.16, 'square', 0.06, i*0.11)); },
  lose(){  [392,330,262].forEach((f,i)=>this.tone(f, 0.2, 'triangle', 0.08, i*0.15)); },
  wash(){  this.noise(0.25, 0.06, 0, 2500); }
};

/* ============================================================
   CAMINHOS (grafo de visibilidade em volta das mesas)
   ============================================================ */
const OBST = [];
/* obstáculos dos caminhos: refeitos quando o salão muda (mesas da lojinha e do editor) */
function setObst(defs){
  OBST.length = 0;
  defs.forEach(t => OBST.push(mesaBox(t.cx, t.cy, t.seats)));
}
function segHits(ax,ay,bx,by,r){
  let t0 = 0, t1 = 1;
  const dx = bx-ax, dy = by-ay;
  const p = [-dx, dx, -dy, dy];
  const q = [ax-r.x0, r.x1-ax, ay-r.y0, r.y1-ay];
  for (let i=0;i<4;i++){
    if (p[i] === 0) { if (q[i] <= 0) return false; }
    else {
      const t = q[i]/p[i];
      if (p[i] < 0) { if (t > t1) return false; if (t > t0) t0 = t; }
      else          { if (t < t0) return false; if (t < t1) t1 = t; }
    }
  }
  return (t1 - t0) > 1e-4;
}
function blocked(ax,ay,bx,by){
  for (let i=0;i<OBST.length;i++) if (segHits(ax,ay,bx,by,OBST[i])) return true;
  return false;
}
function inObst(x,y){
  for (let i=0;i<OBST.length;i++){ const r=OBST[i]; if (x>r.x0 && x<r.x1 && y>r.y0 && y<r.y1) return true; }
  return false;
}
function findPath(from, to){
  if (!blocked(from.x,from.y,to.x,to.y)) return [{x:to.x,y:to.y}];
  const nodes = [{x:from.x,y:from.y},{x:to.x,y:to.y}];
  const m = 12;
  for (const r of OBST){
    const cs = [[r.x0-m,r.y0-m],[r.x1+m,r.y0-m],[r.x0-m,r.y1+m],[r.x1+m,r.y1+m]];
    for (const c of cs){
      const x = clamp(c[0], BOUNDS.x0, BOUNDS.x1), y = clamp(c[1], BOUNDS.y0, BOUNDS.y1);
      if (!inObst(x,y)) nodes.push({x,y});
    }
  }
  const n = nodes.length, dist = new Array(n).fill(Infinity), prev = new Array(n).fill(-1), done = new Array(n).fill(false);
  dist[0] = 0;
  for (let it=0; it<n; it++){
    let u = -1;
    for (let i=0;i<n;i++) if (!done[i] && (u<0 || dist[i] < dist[u])) u = i;
    if (u < 0 || dist[u] === Infinity) break;
    done[u] = true;
    if (u === 1) break;
    for (let v=0; v<n; v++){
      if (done[v]) continue;
      const d = Math.hypot(nodes[u].x-nodes[v].x, nodes[u].y-nodes[v].y);
      if (dist[u] + d < dist[v] && !blocked(nodes[u].x,nodes[u].y,nodes[v].x,nodes[v].y)) { dist[v] = dist[u] + d; prev[v] = u; }
    }
  }
  if (prev[1] < 0) return [{x:to.x,y:to.y}];
  const path = [];
  for (let c = 1; c !== 0; c = prev[c]) path.push({x:nodes[c].x, y:nodes[c].y});
  return path.reverse();
}
/* há caminho de verdade? (sem caminho, findPath devolve a linha reta, que atravessa alguma mesa) */
function pathOk(from, to){
  let a = from;
  return findPath(from, to).every(p => { const ok = !blocked(a.x, a.y, p.x, p.y); a = p; return ok; });
}

