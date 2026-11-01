// Simulação em lote (o "balance" do jogo): joga N temporadas com sementes 1..N, com uma política de decisões,
// e compara as médias com os ALVOS. Uso: node lote.js [N]   (TEMPORADAS=3 joga 3 temporadas seguidas por semente)
// CFG='{"sorteJogo":30}' troca números do CFG só nesta rodada, para testar um ajuste antes de mudar src/.
const load = require('./harness');
const N = +process.argv[2] || 30;
const TEMPORADAS = +process.env.TEMPORADAS || 1;

// Faixas desejadas (decididas no plano; histórico em docs/TESTES.md)
const ALVOS = {
  vitorias: [0.35, 0.60],      // fração de vitórias
  caixaFinal: [20000, 120000], // caixa no fim da última temporada
  posicao: [1.8, 3.2],         // posição média
};

// Política do "jogador": por enquanto não decide nada (só avança). Quando o jogo tiver decisões,
// escreva aqui um jogador razoável (e, se quiser, um "afiado") para medir a faixa de dificuldade.
function politica(jogo){ }

const soma = { vitorias:0, caixaFinal:0, posicao:0 };
const quebras = [];
for (let s = 1; s <= N; s++){
  const { jogo, api } = load({ novo:s });
  if (process.env.CFG) Object.assign(api.CFG, JSON.parse(process.env.CFG));
  let V = 0, total = 0, pos = 0;
  for (let temp = 1; temp <= TEMPORADAS; temp++){
    while (!jogo.acabou){ politica(jogo); jogo.avancar(); }
    const r = jogo.resumoTemporada();
    V += r.V; total += r.V + r.E + r.D; pos = r.posicao;
    if (!Number.isFinite(jogo.estado.caixa)) quebras.push(`semente ${s}: caixa inválido`);
    if (temp < TEMPORADAS) jogo.novaTemporada();
  }
  soma.vitorias += V / total; soma.caixaFinal += jogo.estado.caixa; soma.posicao += pos;
}
let fora = 0;
for (const k in ALVOS){
  const m = soma[k] / N, [a, b] = ALVOS[k], ok = m >= a && m <= b;
  if (!ok) fora++;
  console.log(`${k.padEnd(12)} ${m.toFixed(2).padStart(10)}   alvo ${a}–${b}   ${ok ? 'ok' : 'FORA'}`);
}
quebras.slice(0, 5).forEach(q => console.log('FAIL', q));
console.log(`LOTE: ${N} sementes × ${TEMPORADAS} temporada(s), ${fora} métrica(s) fora do alvo, fails = ${quebras.length}`);
