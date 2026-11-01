
/* ========== Sorte com semente ==========
   A lógica nunca usa Math.random: usa a sorte do jogo, cujo estado vai no save.
   Mesma semente e mesmas decisões = mesmo resultado (testes e lote.js dependem disso). */
function criaSorte(estado){
  let s = estado >>> 0;
  const prox = () => {            // mulberry32
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    num: prox,                                        // [0,1)
    int: (a, b) => a + Math.floor(prox() * (b - a + 1)),  // inteiro entre a e b
    chance: p => prox() < p,
    escolhe: arr => arr[Math.floor(prox() * arr.length)],
    estado: () => s,
  };
}
