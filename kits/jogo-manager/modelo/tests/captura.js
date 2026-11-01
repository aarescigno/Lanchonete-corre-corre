// Capturas das telas no Chromium (computador 1280×800 e celular 360×740) para capturas/<pasta>.
// Uso: node captura.js [pasta]   (padrão: a VERSAO do jogo). Também avisa se alguma tela rola para o lado no celular.
// Confira depois só recortes ampliados (PIL crop) do trecho que mudou.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ARQ = path.join(__dirname, '..', '{{ARQ}}');

(async () => {
  const corpo = fs.readFileSync(ARQ, 'utf8');
  const html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"></head><body>' + corpo + '</body></html>';
  const navegador = await chromium.launch();
  let pasta = process.argv[2], problemas = 0;
  for (const [nome, vp] of [['pc', {width:1280, height:800}], ['cel', {width:360, height:740}]]){
    const p = await navegador.newPage({ viewport: vp, reducedMotion: 'reduce' });   // sem a animação de entrada, a foto sai nítida
    await p.setContent(html);
    pasta = pasta || await p.evaluate(() => window.__api.VERSAO);
    const dir = path.join(__dirname, '..', 'capturas', pasta); fs.mkdirSync(dir, { recursive:true });
    const foto = async (tela) => {
      const larga = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      if (larga){ problemas++; console.log(`FAIL ${nome}/${tela}: rola para o lado`); }
      await p.screenshot({ path: path.join(dir, `${tela}-${nome}.png`), fullPage: true });
    };
    await foto('menu');
    await p.click('#bt-novo'); await foto('painel');
    for (let i = 0; i < 20 && await p.isEnabled('#bt-avancar'); i++) await p.click('#bt-avancar');
    await foto('fim');
    await p.close();
  }
  await navegador.close();
  console.log(`capturas em capturas/${pasta}, fails = ${problemas}`);
  process.exit(problemas ? 1 : 0);
})();
