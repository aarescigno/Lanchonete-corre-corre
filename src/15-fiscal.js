/* ============================================================
   FISCAL DA VIGILÂNCIA SANITÁRIA (v9.4): só na Avenida, sorteado ao começar o dia (Game.sortear) e avisado na introdução.
   Num momento do turno (`t`), entra pela porta, anda até o meio do salão e fica FISCAL.visita s olhando, com a prancheta; confere
   mesa suja por mais de FISCAL.mesaSuja s seguidos, lixeira cheia e pia com FISCAL.pia pilhas ou mais (cada falha põe um ícone em cima
   dele). Ao terminar, o resultado sai em texto grande (Game.fiscalFim) e ele volta para a rua. Não é grupo e não ocupa mesa.
   ============================================================ */
const FISCAL_PONTOS = [{ x:430, y:330 }, { x:330, y:330 }, { x:530, y:330 }, { x:430, y:250 }, { x:430, y:420 }, { x:300, y:250 }, { x:560, y:420 }, { x:120, y:330 }];
class Fiscal {
  constructor(game, f){
    this.game = game;
    this.t = f * game.day.time;   // em que segundo de jogo ele entra
    this.st = 'espera';           // espera, entra, olha, sai, fim
    this.x = DOOR.x; this.y = DOOR.y; this.path = []; this.moving = false; this.walkPh = 0;
    this.resta = FISCAL.visita;
    this.falhas = { suja:false, lixo:false, pia:false };
    this.sujaT = {};
    this.res = '';                // aprovado, advertencia ou multa (ao fim da visita)
    const mulher = Math.random() < 0.5;
    this.look = { skin:randi(0, 5), hair:mulher ? 1 : 0, hairC:pick(HAIRC.slice(0, 3)), pants:'#2F3E5C', kid:false, elder:false, acc:null, glasses:Math.random() < 0.4 };
    this.alvo = FISCAL_PONTOS[FISCAL_PONTOS.length - 1];
  }
  get ativo(){ return this.st === 'entra' || this.st === 'olha' || this.st === 'sai'; }
  get nFalhas(){ return (this.falhas.suja ? 1 : 0) + (this.falhas.lixo ? 1 : 0) + (this.falhas.pia ? 1 : 0); }
  moveAlong(dt, sp){ Group.prototype.moveAlong.call(this, dt, sp); }
  falha(k, msg){
    const g = this.game;
    if (this.falhas[k]) return;
    this.falhas[k] = true;
    g.addText(this.x, this.y - 96, msg, PAL.perigo, 15);
    Sfx.boing();
  }
  update(dt){
    const g = this.game;
    if (this.st === 'espera'){
      if (g.elapsed < this.t) return;
      // o primeiro ponto livre e alcançável do salão (sem mesa em cima e com caminho)
      const de = { x:DOOR.x, y:DOOR.y };
      this.alvo = FISCAL_PONTOS.find(p => !inObst(p.x, p.y) && pathOk(de, p)) || FISCAL_PONTOS[FISCAL_PONTOS.length - 1];
      this.path = findPath(de, this.alvo);
      this.st = 'entra';
      g.addText(QUEUE.x, DOOR.y + 36, 'Vigilância sanitária!', PAL.alerta, 20);
      Sfx.tone(660, 0.12, 'triangle', 0.05); Sfx.tone(880, 0.18, 'triangle', 0.05, 0.14);
    } else if (this.st === 'entra'){
      this.moveAlong(dt, 70);
      if (!this.path.length) this.st = 'olha';
    } else if (this.st === 'olha'){
      this.moving = false;
      this.resta -= dt;
      g.tables.forEach(t => {
        if (!t.open) return;
        this.sujaT[t.id] = t.dirty ? (this.sujaT[t.id] || 0) + dt : 0;
        if (this.sujaT[t.id] > FISCAL.mesaSuja) this.falha('suja', 'Mesa suja!');
      });
      if (g.trashFull) this.falha('lixo', 'Lixeira cheia!');
      if (g.kitchen.sinkN >= FISCAL.pia) this.falha('pia', 'Pia lotada!');
      if (this.resta <= 0){
        const n = this.nFalhas;
        this.res = n === 0 ? 'aprovado' : n === 1 ? 'advertencia' : 'multa';
        this.path = findPath({ x:this.x, y:this.y }, { x:DOOR.x, y:DOOR.y });
        this.st = 'sai';
        g.fiscalFim(this);
      }
    } else if (this.st === 'sai'){
      this.moveAlong(dt, 80);
      if (!this.path.length) this.st = 'fim';
    }
  }
}
