/* ============================================================
   RENDER PRINCIPAL
   ============================================================ */
/* toque no vazio: anel fraco no ponto, que some em 0,4 s (sem crescer com movimento reduzido) */
function drawTouchFx(ctx,g){
  for (const f of g.fx){
    if (f.k !== 'tap') continue;
    const p = clamp(f.life / f.max, 0, 1), a = 1 - p*p;
    ctx.save();
    circ(ctx,f.x,f.y,RM ? 12 : 8 + p*10);
    ctx.strokeStyle = 'rgba(255,255,255,' + (0.45*a) + ')'; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.restore();
  }
}

/* o mundo (salão, calçada, gente e efeitos) começa em g.cam na tela larga (v7.6); o HUD fica na tela */
function render(g, ctx){
  COMIDA_CURSOS = g.cursos;   // v8.6.10: os pratos do curso avançado ganham o detalhe
  const tm = g.anim;
  CRACHA_A = (devLivre() || (g.state !== 'playing' && g.state !== 'paused') || g.elapsed < 17) ? 1 : g.elapsed >= 20 ? 0 : RM ? 0 : 1 - (g.elapsed - 17) / 3;   // v9.6.9
  const menu = g.state === 'menu' && !g.conversa;   // v8.7: na conversa, o salão aparece como no dia (com a Bia)
  ctx.save();
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.save();
  ctx.translate(g.cam, 0);
  drawFloor(ctx,g);
  drawWall(ctx,g,tm);
  drawCalcada(ctx,g,tm);
  drawMesinha(ctx,g,tm);   // v9.6.11: no lugar da geladeira (que sai da tela; a manutenção dela segue escondida)
  drawKitchen(ctx,g,tm);
  if (g.clima === 'chuva' && !menu) drawChuvaFundo(ctx,tm);
  if (g.clima === 'feriado' && !menu) drawBandeirinhas(ctx);
  if (g.evento === 'junina' && !menu) drawBandeirinhas(ctx,BAND_JUNINA,tm); else if (g.evento === 'jogo' && !menu) drawBandeirinhas(ctx,BAND_JOGO,tm);   // v10.6

  // destaque de mesa durante arrasto/seleção
  if (g.hover && (g.drag || g.sel)){
    const t = g.hover;
    ctx.save(); ctx.strokeStyle = g.hoverOk ? PAL.ok : PAL.perigo; ctx.lineWidth = 4; ctx.setLineDash([8,5]);
    rr(ctx,t.cx-t.hx-10,t.cy-60,t.hx*2+20,128,14); ctx.stroke();
    ctx.fillStyle = g.hoverOk ? 'rgba(62,155,90,.14)' : 'rgba(194,54,43,.12)'; ctx.fill(); ctx.restore();
  }
  if (g.sel && !g.drag){
    g.tables.forEach(t => { if (t.free && t.seats >= g.sel.size){ ctx.save(); ctx.strokeStyle = 'rgba(62,155,90,' + (0.35+0.25*Math.sin(tm*6)) + ')'; ctx.lineWidth = 3; ctx.setLineDash([6,5]); rr(ctx,t.cx-t.hx-10,t.cy-60,t.hx*2+20,128,14); ctx.stroke(); ctx.restore(); } });
  }

  if (g.noite && !menu){ ctx.fillStyle = 'rgba(14,20,52,.08)'; ctx.fillRect(0,92,W,H - 92); }   // v10.10: o véu da noite, por baixo das pessoas
  // lista de desenháveis ordenados por y
  const items = [];
  g.tables.forEach(t => items.push({ y:t.cy + 10, f:() => glowSprite(ctx,g,t,ctx => drawTable(ctx,g,t,tm,menu)) }));
  if (g.noite && !menu) g.tables.forEach(t => { if (t.open) items.push({ y:t.cy + 11, f:() => drawVela(ctx,t.cx,t.cy,tm) }); });   // v10.10: uma vela em cada mesa aberta
  g.groups.forEach(grp => {
    if (grp.state === 'queue'){
      const isDrag = g.drag && g.drag.moved && g.drag.g === grp;
      items.push({ y:grp.y, f:() => {
        if (grp === g.sel){
          ctx.save(); ctx.strokeStyle = PAL.mostarda; ctx.lineWidth = 3.5 + (RM?0:Math.sin(tm*8)*1.2); rr(ctx,grp.x-64,grp.y-74,128,88,14); ctx.stroke(); ctx.restore();
        }
        if (!isDrag) drawMoodRing(ctx,grp.hearts,grp.x,grp.y+2,Math.max(30,grp.people.length*12+16),9,tm);
        ctx.save();
        if (isDrag) ctx.globalAlpha = 0.35;
        const sq = grp.boing > 0 && !RM ? 1 + Math.sin(grp.boing*22)*0.08 : 1;
        ctx.translate(grp.x, grp.y); ctx.scale(1/sq, sq); ctx.translate(-grp.x, -grp.y);
        if (QUEUE.max >= 5){ ctx.translate(grp.x, grp.y); ctx.scale(0.85, 0.85); ctx.translate(-grp.x, -grp.y); }   // v9.6.9: a espera da Avenida (6 lugares) em escala menor
        const parado = !grp.path.length;   // no lugar: sentado ou de pé, conforme o ponto (na Garagem, de pé)
        glowSprite(ctx,g,grp,ctx => drawCluster(ctx,grp,grp.x,grp.y,tm,{ sit:parado && g.sentado, bebe:parado }));
        ctx.restore();
      }});
    } else if (grp.state === 'retirada'){   // v8.6: o entregador no balcão de retirada, de pé
      items.push({ y:grp.y, f:() => {
        if (!grp.path.length) drawMoodRing(ctx,grp.hearts,grp.x,grp.y+2,28,8,tm);
        drawCluster(ctx,grp,grp.x,grp.y,tm);
      }});
    } else if (grp.state === 'toTable' || grp.state === 'leaving'){
      items.push({ y:grp.y, f:() => drawCluster(ctx,grp,grp.x,grp.y,tm) });
    }
  });
  const b = g.bia;
  items.push({ y:b.y, f:() => {
    drawBia(ctx,b,b.x,b.y,{ moving:b.moving, ph:b.walkPh, flip:b.dir, t:tm, lava:b.washing && !RM });
    const lay = b.layout() || [b.hands.slice(0,1), b.hands.slice(1,2)];
    lay.forEach((its,i) => {
      const hx = b.x + (i ? 20 : -20);
      if (i === 0 && b.tray && its.length){ ell(ctx,hx,b.y-20,its.length > 1 ? 20 : 14,5); fs(ctx,PAL.inox,2); }
      if (its.length === 1) drawHandItem(ctx,its[0],hx,b.y - 28,0.75);
      else its.forEach((h,k) => drawHandItem(ctx,h,hx + (k-(its.length-1)/2)*13,b.y - 27 - (k%2)*3,0.6,true));
    });
  }});
  if (menu) items.pop();
  if (g.marmitaOk && !menu) items.push({ y:RETIRADA.balcao.y + 50, f:() => glowSprite(ctx,g,'retirada',ctx => drawRetirada(ctx,g,tm)) });
  const mus = !menu && terraco(g) ? g.save.equipe.musica : 0;   // v10.4: a música ao vivo (só nos dias de jogo)
  if (decorOn(g,'luminaria') && !edDesenho) g.tables.forEach(t => { if (t.open) items.push({ y:t.cy - 100, f:() => drawLuminaria(ctx,t.cx,Math.max(112,t.cy - 112)) }); });   // v10.7: as luminárias sobre as mesas e o lustre no centro do teto (atrás das pessoas)
  if (decorOn(g,'lustre') && !edDesenho) items.push({ y:LUXO_LUSTRE.y - 40, f:() => drawLustre(ctx,LUXO_LUSTRE.x,LUXO_LUSTRE.y,tm) });
  if (terraco(g)) items.push({ y:TERRACO.piano.y1, f:() => drawPiano(ctx,g,mus === 2) });   // v10: o piano de cauda (obstáculo fixo)
  if (g.maquinaOn) items.push({ y:STATIONS.maquina.rect.y + STATIONS.maquina.rect.h, f:() => glowSprite(ctx,g,'maquina',ctx => drawMaquina(ctx,g,tm,menu)) });
  if (g.save.equipe.couvert && !menu) items.push({ y:528, f:() => drawMusico(ctx,g,tm) });
  if (mus === 2) items.push({ y:TERRACO.piano.y1 + 2, f:() => drawPianista(ctx,g,tm) });
  if (mus === 1) items.push({ y:528, f:() => drawQuarteto(ctx,g,tm) });
  if ((g.save.equipe.tv || g.save.equipe.som) && !menu) items.push({ y:532, f:() => drawAmbiente(ctx,g,tm) });
  if (g.fiscal && g.fiscal.ativo && !menu) items.push({ y:g.fiscal.y, f:() => drawFiscal(ctx,g.fiscal,tm) });   // v9.4
  if (g.dani.active && !menu) items.push({ y:g.dani.y, f:() => drawDani(ctx,g.dani,tm) });
  if (g.joca.active && !menu) items.push({ y:g.joca.y, f:() => drawJoca(ctx,g.joca,tm) });   // v9.2
  if (g.cami.active && !menu) items.push({ y:g.cami.y, f:() => drawCami(ctx,g.cami,tm) });   // v9.3
  items.sort((a,c) => a.y - c.y).forEach(it => it.f());
  if (g.evento === 'junina' && !menu) drawBandeirinhasSalao(ctx,g,tm);   // v10.6
  if (g.clima === 'chuva' && !menu) drawChuvaPingos(ctx,tm);
  if (!menu) drawFumacaLixo(ctx,g,tm);   // v9.6.11
  if (!menu) drawConsertos(ctx,g,tm);
  if (!menu && g.setaMesinha) drawSetaMesinha(ctx,g,tm);   // v9.6.11

  // camada superior: balões, corações, fila
  g.tables.forEach(t => { if (t.open || menu) drawTableOverlay(ctx,g,t,tm,menu); });
  g.queue.forEach(grp => {
    if (grp.state !== 'queue') return;
    if (g.drag && g.drag.moved && g.drag.g === grp) return;
    if (QUEUE.max >= 5){   // v9.6.9: corações menores, à direita do grupo, na altura do balão do pedido
      drawHearts(ctx,grp,grp.x + 52,grp.y-64,tm,0.75);
      if (grp.vipAberto) drawVipBadge(ctx,grp.x-45,grp.y-63,tm,grp.exigente,grp.critico);
    } else if (grp.vipAberto){ drawHearts(ctx,grp,grp.x+14,grp.y-64,tm); drawVipBadge(ctx,grp.x-45,grp.y-63,tm,grp.exigente,grp.critico); }
    else drawHearts(ctx,grp,grp.x,grp.y-64,tm);
    if (grp.aguarda && !grp.path.length) drawWaitBadge(ctx,grp.x + (grp.vipAberto ? 63 : 50),grp.y-66,tm,grp.piso);
    if (!menu) drawPedidoEspera(ctx,g,grp,tm);
  });
  g.groups.forEach(grp => { if (grp.fala && !menu) drawFala(ctx,grp,grp.x,grp.table ? grp.y - 128 : grp.y - 100); });   // v10.10: o balão do Bráulio
  g.retirada.forEach(grp => { drawHearts(ctx,grp,grp.x,grp.y-62,tm,0.6); if (!menu) drawRetiradaBalao(ctx,g,grp,tm); });
  drawLugarNums(ctx,g);   // v9.6.9
  if (!menu) drawFilaMarcas(ctx,g,tm);
  // "?" sobre a Bia
  if (b.qT > 0 && !menu){
    ctx.save(); ctx.translate(b.x, b.y - 96); drawBubble(ctx,0,0,14,'#fff'); txt(ctx,'?',0,1,20,PAL.perigo,'center',FD); ctx.restore();
  }
  // grupo arrastado
  if (g.drag && g.drag.moved){
    const d = g.drag;
    ctx.save(); ctx.globalAlpha = 0.92;
    shadowEll(ctx,d.x,d.y+14,34,9,0.25);
    drawCluster(ctx,d.g,d.x,d.y+8,tm,{ s:1.05 });
    ctx.restore();
  }

  if (!menu) drawGol(ctx,g,tm);   // v10.6: o letreiro do gol

  // efeitos
  for (const f of g.fx){
    if (f.k === 'text'){
      const a = clamp(f.life / 0.5, 0, 1);
      ctx.globalAlpha = a;
      if (f.box){
        // a avaliação do Gurugol (v8.4): balão branco com a borda na cor da nota
        ctx.font = f.size + 'px ' + FB;
        const ls = String(f.text).split('\n'), lh = f.size + 5;   // v9.6.4: o balão pode ter várias linhas (\n)
        const w = Math.max.apply(null, ls.map(l => ctx.measureText(l).width)) + 18, x = clamp(f.x, w/2 + 4 - g.cam, W - w/2 - 4);
        rr(ctx,x - w/2,f.y - 13,w,26 + (ls.length - 1)*lh,9); ctx.fillStyle = '#FFFDF6'; ctx.fill(); ctx.lineWidth = 2.4; ctx.strokeStyle = f.color; ctx.stroke();
        ls.forEach((l, i) => txt(ctx,l,x,f.y + i*lh,f.size,PAL.tinta,'center',FB));
      } else
      txt(ctx,f.text,f.x,Math.max(f.y,170),f.size,f.color,'center',FD,4);   // v9.6.9: nunca acima de y 170
      ctx.globalAlpha = 1;
    } else if (f.k === 'coin'){
      if (f.delay > 0) continue;
      circ(ctx,f.x,f.y,7); fs(ctx,PAL.mostarda,2);
      txt(ctx,'$',f.x,f.y+0.5,9,PAL.tinta,'center',FD);
    } else if (f.k === 'puff'){
      const p = f.life / f.max;
      ctx.globalAlpha = (1-p)*0.8; circ(ctx,f.x,f.y,f.r*(0.6+p)); ctx.fillStyle = '#d9d7d0'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(34,32,28,.5)'; ctx.stroke(); ctx.globalAlpha = 1;
    } else if (f.k === 'spark'){
      const p = f.life / f.max;
      ctx.globalAlpha = 1-p; star(ctx,f.x,f.y,5*(1-p)+2,f.color); ctx.globalAlpha = 1;
    }
  }

  if (!menu) drawTouchFx(ctx,g);
  ctx.restore();

  if (menu){
    ctx.fillStyle = 'rgba(34,32,28,.18)'; ctx.fillRect(0,92,TW,448);
    drawBia(ctx,b,TW-170,520,{ s:2.3, wave:true, t:tm });
    ctx.fillStyle = '#2B2823'; ctx.fillRect(0,540,TW,60);
    ctx.fillStyle = PAL.mostarda; ctx.fillRect(0,540,TW,4);
  } else {
    drawHud(ctx,g,tm);
    if (g.ending && g.state === 'playing'){
      const msg = g.reason === 'time' ? 'Fim do expediente!' : (g.reason === 'stars' ? 'Sem estrelas!' : 'Todo mundo atendido!');
      ctx.fillStyle = 'rgba(34,32,28,.35)'; ctx.fillRect(0,230,TW,90);
      txt(ctx,msg,TW/2,275,46,PAL.mostarda,'center',FD,7);
    }
    if (g.treino && g.mode === 'treino') drawTreino(ctx,g,tm);
    if (g.dica && g.state === 'playing') drawDica(ctx,g,tm);   // v9.6.12: a dica na hora (dias 1 a 3 da carreira)
  }
  ctx.restore();
}

