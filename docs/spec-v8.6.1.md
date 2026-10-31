# v8.6.1 — Revisão estética da abertura (etapa 2d-r)

Pedido do usuário em 28/10 (texto em `docs/PROPOSTAS.md`): corrigir o desenho e a animação da abertura. O exemplo dele foi a Rosa parecer mais baixa que o fogão e mexer a panela com uma "vareta" apontada para cima. O plano dividia a revisão em 5 partes, com a checagem do usuário em cada uma; a pedido dele, as 5 saíram juntas, com as sugestões do `docs/PLANO.md` nas decisões em aberto. A legenda da `promessa` não muda: o "Anos depois..." só entra com o sim do usuário.

## R1 — Proporções
- **Tabela de alturas** (`AB_ALT`, em px do chão ao alto da cabeça, sem a touca): Rosa e Bia adulta 210, Bia criança 130, Tonhão e Bráulio 230. `AB_BASE` tem a mesma altura no desenho em escala 1, e `abEsc(quem, k)` dá a escala (`k` < 1 para quem está mais longe: a janela da Casa Aurora, a porta da cozinha). A Bia adulta tem a mesma altura em `promessa`, `tonhao`, `banco` e `inauguracao`.
- **Fogão de casa** (`casa` e `promessa`): a boca desce de y 290 para y 356 (`AB_FOGAO`), ~55% da altura da Rosa, e a bancada desce junto. Em cima do banquinho, a cabeça da Bia criança fica um pouco acima da panela.
- **Rosa deitada** (`hospital`): a cabeça do tamanho dela em pé (r ≈ 37, com o coque e a flor), o corpo sob o cobertor com o comprimento dela; a cama encolheu de 440 para 272 px.

## R2 — Gestos e objetos
- **Colher de pau da Rosa** (`casa`): segurada por cima, a mão logo acima da borda, o cabo para fora e a ponta no molho, fazendo uma pequena roda (`abColher`; `drawPerson` aceita `bracoD`, o braço direito, como o `bracoE`).
- **Colherinha da Bia** (`casa`): o molho na boca, o cabo para fora e para baixo, na mão direita dela.
- **Tonhão mexendo** (`tempero`): colher de pau na panela, a mão acima da borda.
- **O segredo da Rosa** (`tempero`): a mão sobre a panela; a pétala, maior, de um rosa mais forte e com contorno, cai dela. O molho passa aos poucos do vermelho para um laranja-dourado (`AB_COR.segredo`), com um clarão e brilhos na superfície e as estrelinhas.
- **Caderno de receitas** (`promessa`): as mãos da Bia seguram o caderno pelas bordas (`drawBia` aceita `maos`).

## R3 — A cena conta a legenda
- **Casa Aurora** (`aurora`): a Rosa chega de roupa rosa, sem avental nem dólmã; a porta abre, ela entra (some lá dentro) e a porta fecha. O Tonhão acena da janela quando fala.
- **Bia sentada** (`hospital`, `saudade`): as pernas ficam penduradas para fora do assento. No hospital, a cadeira é mais baixa que a cama.
- **Corredor do hospital** (`saudade`): a porta com a plaquinha "Enfermaria" e o rodapé (sem cruz vermelha). A Bia segura a rosa com as duas mãos.
- **Tonhão** (`tonhao`): sobrancelhas tristes ao sair da Casa Aurora e de bem com a vida quando chega na Bia (antes pareciam bravas).
- **Banco** (`banco`): fachada desenhada no traço da cena (`abFachadaBanco`: frontão com o R$, placa "Banco", colunas, porta, escadinha). O papel sai da porta do banco, voa até a mão da Bia e ganha o carimbo de APROVADO lá. Sem a plaquinha "Em obras".

## R4 — Composição
- **Balões:** a cena pode deslocar o balão para o lado livre (3º número da cabeça, `abBalao(..., dx)`); a ponta continua na cabeça. Não cobrem mais a panela e os corações (`casa`) nem o lustre (`estrela`), e as duas falas do hospital não se encostam.
- **Vapor:** cinza-azulado com contorno, à vista na parede creme e no azulejo branco.
- **Inauguração:** a estrela que brilha foi para a esquerda do céu, longe do Voltar e do Pular; o telhado desceu e o título "O sonho da Bia" não encosta nele; as mesas ganharam banquinhos.
- **Plateia** (`estrela`): palmas no alto, braço erguido, braços parados e os dois braços para cima, cada um no seu ritmo. O bigode do Bráulio subiu e a boca ficou embaixo dele.

## R5 — Vida na animação
- **Andar:** quem anda olha para o lado em que vai (`olha` em `drawPerson`, `drawBia` e `abTonhao`): a Rosa na `aurora`, o Tonhão na `tonhao`, a Bia no `banco`.
- **Piscar e falar:** cada um pisca no seu ritmo (`abPisca`), e a boca de quem fala abre e fecha nos primeiros 1,8 s do balão (`AB_VIVO.fala`, de `drawAbertura`).
- **Gestos suaves:** os acenos (do Tonhão e da Bia) e o muque do Tonhão sobem com uma curva rápida (`g` em `abTonhao`, `wa` em `drawBia`).
- **Movimento reduzido:** nada disso acontece (o relógio fica parado).

## Testes
- `smoke26.js` (37): + a escala de cada um vem da tabela, a Bia adulta da altura da mãe, a boca mexe quando o balão aparece e para depois, e não mexe com movimento reduzido.
- `python3 shot_v8_6_1.py` gera as capturas em `capturas/v8.6.1` (cada cena em 3 andamentos, a cena 1 no celular e as 10 cenas com movimento reduzido).
