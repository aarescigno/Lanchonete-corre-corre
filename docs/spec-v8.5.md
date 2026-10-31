# v8.5 — O sonho da Bia: abertura animada do Modo História (etapa 2d)

Pedido do usuário em 22/10, com o roteiro contado por ele em 26/10 (textos em `docs/PROPOSTAS.md`): uma animação de abertura do Modo História que conta de onde a Bia tirou a ideia e o desejo de ter um restaurante com a estrela do Michelzão. Nas etapas 5 e 6, ela vira o prólogo do Modo História jogável.

## Decisões do usuário
- **Roteiro:** o do usuário. A mãe da Bia, a **Rosa**, cozinhava com carinho e sonhava ser chef. Ela entra na Casa Aurora, onde o irmão mais velho, o **Tonhão** (Antônio), já cozinhava. A casa ganha a estrela do Michelzão com o tempero dos dois, mas a fama fica com o chef **Bráulio**. A Rosa adoece e morre. A Bia segue o caminho dela, o Tonhão sai da Casa Aurora para ajudar, e a Bia pega um empréstimo no banco para abrir a lanchonete na garagem.
- **Tom:** só emocionante, sem a piscadela do "universo paralelo em que a meritocracia é possível".
- **O segredo da Rosa** é uma pétala de rosa no molho, e o Bráulio nunca conseguiu repetir o molho. Fica guardado para um momento posterior da história. Na abertura, só aparece a pétala caindo na panela, sem explicação.
- **Toca sozinha uma vez:** na primeira vez que o jogo abre (também para quem já jogava antes da v8.5), antes do menu. Depois, só pelo botão História.

## As cenas (`ABERTURA.cenas`, ~68 s)
| # | Cena | s | Legenda e falas |
|---|---|---|---|
| 1 | `casa` | 7 | A Bia criança no banquinho prova o molho; a Rosa mexe a panela, e sobem coraçõezinhos. Rosa: "Comida boa é carinho que a gente põe no prato." |
| 2 | `aurora` | 7 | A Rosa caminha até a porta da Casa Aurora; o Tonhão acena da janela. Bia: "Vai, mãe!" · Tonhão: "Bem-vinda, maninha!" |
| 3 | `tempero` | 6,5 | A cozinha da Casa Aurora: a Rosa deixa cair uma pétala na panela, e o molho brilha. Tonhão: "Que molho é esse, Rosa?!" |
| 4 | `estrela` | 7,5 | O salão: o Bráulio ergue a plaquinha da estrela sob o foco, o público aplaude, e a Rosa e o Tonhão espiam da porta da cozinha. Bráulio: "O tempero? Receita minha!" |
| 5 | `hospital` | 8,5 | Cena calma: a Bia segura a mão da Rosa no leito; uma rosa no copo e uma estrela na janela. Rosa: "Cozinha sempre com carinho, filha." · Bia: "Prometo, mãe." |
| 6 | `promessa` | 8 | A Bia adulta na cozinha de casa, à noite, com o caderno "Receitas da Rosa" e o banquinho vazio. Bia: "Essa estrela vai ser nossa, mãe." |
| 7 | `tonhao` | 7,5 | O Tonhão, sem a toca, sai da Casa Aurora e vai até a garagem da Bia, onde arregaça as mangas. Tonhão: "Dinheiro eu não tenho, Bia. Mas braço pra cozinha tenho de sobra!" |
| 8 | `banco` | 7,5 | A Bia, com o pote de moedas, corre até o banco, e a papelada leva o carimbo APROVADO. Bia: "Vai dar certo!" (é a dívida de abertura do Modo História, na etapa 5) |
| 9 | `inauguracao` | 8,5 | À noite, a porta da garagem sobe, o letreiro "Lanchonete Corre-Corre" pisca e acende, uma estrela brilha no céu e entra o título "O sonho da Bia". |

A morte da Rosa não aparece em cena: fica só na legenda da cena 6 ("A Rosa partiu").

## Como funciona
- **Lógica** (`18-abertura.js`): `ABERTURA` (as cenas com tempo, legenda, falas, com o momento em que cada uma aparece, e a frase da trilha) e a classe `Abertura`: `i` (a cena), `t` (o tempo na cena), `p` (o andamento, de 0 a 1), `escuro` (o fade de 0,5 s na entrada e na saída), `falas()`, `texto()` (para o leitor de tela), `update(dt)`, `seguir()`, `pular()` e `terminar()`. A origem `auto` volta ao menu no fim; a origem `menu` termina no cartão "Em breve".
- **Desenho** (`25-abertura.js`): `drawAbertura(ctx, ab)` desenha a cena da vez (`AB_CENAS[id]`), os balões das falas, a faixa da legenda com as bolinhas das cenas e "toque para seguir", e o escuro por cima. As pessoas são as do jogo (`drawPerson`, `drawBia`) e desenhos novos no mesmo estilo: a Rosa (coque com uma rosa no cabelo), a Bia criança (laço laranja e vestido mostarda), o Tonhão de corpo inteiro (com e sem a toca, acenando, mexendo a panela e mostrando o muque) e o Bráulio (toca alta, bigodinho enrolado, nariz empinado e a plaquinha).
- **Telas** (`43-telas.js`): `abrirAbertura(origem)` grava `LS.abertura` (`lcc2_abertura` = '1'), mostra `#ov-abertura` (só o botão "Pular", no canto, transparente ao toque) e toca a frase da cena. No laço, enquanto a abertura roda, o jogo não atualiza e o canvas desenha só a abertura. O toque no canvas, Enter, espaço e a seta para a direita seguem; Esc pula. No fim, pelo botão História, aparece `#ov-historia` ("Em breve: o Modo História", com "Menu" e "Ver de novo"). O texto de cada cena vai para `#ab-live` (leitor de tela).
- **Toca sozinha** quando o `lcc2_abertura` não existe, fora do modo dev. Sem `localStorage` (janela privada que bloqueia), toca a cada abertura do jogo, mas o "Pular" está sempre à vista.
- **Trilha:** cada cena abre com uma frase curta em `Sfx.tone` (triângulo, baixinho), que respeita o botão de som. Na 1ª vez, o navegador só libera o som depois do 1º toque.
- **Movimento reduzido:** cada cena é o quadro final, parado, com todas as falas, sem o escuro, e só o toque avança.
- **Menu:** o botão "História" fica na 1ª linha, ao lado de Continuar e Missão zero. O painel do menu passou de 490 para 540 de largura, e os botões das linhas têm menos folga dos lados.
- Não mexe no save nem no estado do jogo.

## Testes
- `smoke26.js` (28): toca sozinha só na 1ª vez e fica marcada; 9 cenas na ordem, com ~1 min no total e de 5 a 10 s cada; as falas no tempo delas e o escuro; a cena seguinte sozinha; o desenho de todas as cenas; o toque segue; no fim, sozinha, volta ao menu; o save intacto; já vista, abre no menu; o botão História, o Pular, o cartão "Em breve", "Ver de novo" e "Menu"; o modo dev não toca sozinha; com movimento reduzido, quadros parados que só o toque avança.
- O `harness.js` marca a abertura como vista (`lcc2_abertura`), a não ser que o teste peça `load({abertura:true})`. O `menu_fit.py` também a marca antes de abrir.
- `python3 shot_v8_5.py` gera as capturas em `capturas/v8.5`: a 1ª abertura, cada cena no meio e no fim, o menu depois da abertura, o cartão "Em breve", o menu e a cena 1 no celular deitado e em pé, e as cenas 1 e 2 com movimento reduzido.
- Os `shot_*.py` antigos abrem o jogo sem o `lcc2_abertura` e caem na abertura. Para refazer as capturas deles, acrescente `pg.add_init_script("localStorage.setItem('lcc2_abertura','1')")`.
