#!/usr/bin/env bash
# Gera botpage.js (o bot para as capturas no navegador) a partir de bot.js. O run_all.sh já chama.
# Na página: botStep() (bot normal), botAfiado() e run(seg, bot), com bot = true (normal) ou 'afiado'.
cd "$(dirname "$0")"
{
  echo "// gerado por gera_botpage.sh a partir de bot.js: não edite à mão"
  echo "(function(){"
  printf ' const mk='; sed 's/^module\.exports\.moveis=/mk.moveis=/; s/^module\.exports=//' bot.js
  cat <<'JS'
 window.botStep=function(){ if(!window.__bot) window.__bot=mk(window.__game,window.__lcc); window.__bot(); };
 window.botAfiado=function(){ if(!window.__botA) window.__botA=mk(window.__game,window.__lcc,{afiado:true}); window.__botA(); };
 window.run=function(sec,bot){const g=window.__game;for(let i=0;i<sec*20;i++){if(bot==='afiado')window.botAfiado();else if(bot)window.botStep();g.update(0.05);}};
})();
JS
} > botpage.js
node --check botpage.js
