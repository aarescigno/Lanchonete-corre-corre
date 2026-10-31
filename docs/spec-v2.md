# Lanchonete Corre-Corre — v2 (revisão com base no clone de referência)

Você vai EDITAR o jogo existente `/home/claude/lanchonete.html` (v1, ~2150 linhas, funcionando e testado). NÃO reescreva do zero: preserve arquitetura, visual, personagens e tudo que funciona. A spec original está em `/home/claude/spec.md` e continua valendo, exceto onde este documento muda algo. Uma cópia intocável da v1 está em `/home/claude/versoes/v1-fonte.html` — NÃO edite nada em `/home/claude/versoes/`.

Referência: um clone acadêmico em Java (`/home/claude/ref/Diner-Dash-Clone-master/`, enunciado em `Project_Description.pdf`, código em `SourceCode_flattended/src/`). Não copie código, nomes nem arte dele; use só as ideias de mecânica listadas abaixo. O jogo continua original (Bia, Chef Tonhão, lanchonete brasileira); não citar "Diner Dash" nem "Flo" em lugar nenhum da interface.

## 1. Comandas coloridas (do clone: cores de pedido)
- Pool de 6 cores de comanda, distintas das 4 cores de cadeira (vermelho/azul/amarelo/verde) para não confundir: roxo #7B4FB5, rosa #E0559A, turquesa #1FA6A0, laranja-queimado #C9671E, marrom-café #7A4A2A, lima #8DB531. Ao ANOTAR o pedido, a mesa recebe uma cor livre do pool (sem repetir entre pedidos ativos). A cor volta ao pool quando o grupo vai embora (servido ou bravo).
- A cor aparece em: toalhinha/descanso de prato sobre a mesa (retângulo arredondado colorido sob o lugar dos pratos, visível desde o pedido até o grupo sair), o ticket na mão da Bia e na janela de pedidos, a bandeja do prato pronto na janela de prontos e na mão da Bia, e o ícone correspondente na fila de ações do HUD. Manter o número da mesa junto (acessibilidade: cor nunca é a única pista).
- Prato de grupo que foi embora some (já existe `kitchen.purge`; confirme que a cor também é liberada).

## 2. Humor por cor (do clone: verde → amarelo → vermelho)
- Mantenha os corações. Acrescente sob cada grupo (na fila e sentado) uma elipse/aro de humor: 5–4♥ verde (#3E9B5A), 3–2♥ amarelo (#F2B33D), 1♥ vermelho (#C2362B) piscando. Respeitar prefers-reduced-motion (sem piscar, só vermelho fixo).

## 3. Fila de espera cheia (do clone)
- Hoje, com a fila cheia, as chegadas ficam represadas. Mude: com a fila cheia (4 grupos), quem chega olha, mostra "Lotado!" na porta e vai embora SEM penalidade de dinheiro, mas conta em uma estatística "não couberam" mostrada no fim do dia. (No modo Turno sem fim, ver abaixo, conta como cliente perdido.)

## 4. Novo modo "Turno sem fim" (modo sobrevivência mencionado no enunciado)
- Botão no menu: "Turno sem fim" (ao lado de "Jogar", que passa a se chamar "Carreira").
- Todas as 6 mesas abertas, todos os tipos de cliente, upgrades comprados na carreira valem aqui. Sem relógio de fim: o relógio de parede vira um contador de tempo decorrido.
- Chegadas contínuas: intervalo começa em ~9 s e diminui gradualmente até ~3,5 s (ex.: intervalo = max(3.5, 9 - elapsed/30)). Cozinha fica 1% mais lenta por minuto até no máximo +25%.
- Reputação: 5 estrelas no HUD (no lugar da meta). Cada grupo que vai embora bravo OU que não coube na fila tira 1 estrela. A cada 8 grupos atendidos com 5♥ no pagamento, recupera 1 estrela (máx 5). Com 0 estrelas, fim de turno.
- Pontuação do modo = dinheiro ganho no turno (mesmas regras de pontos). Tela de fim: pontos, tempo sobrevivido, grupos atendidos, maior corrente; formulário de nome + "Salvar no ranking"; botões "Jogar de novo" / "Ranking" / "Menu".

## 5. Ranking (do clone: leaderboard com ordenação)
- Tela "Ranking" acessível pelo menu, com duas abas: "Carreira" e "Turno sem fim". Tabela Nome | Pontos (e coluna Dia para Carreira, Tempo para Turno sem fim). Controles de ordenação como no clone: ordenar por Nome ou Pontos, Crescente ou Decrescente (dois grupos de botões segmentados, aplicação imediata, sem botão "Ordenar"). Padrão: Pontos decrescente.
- Entrada no ranking: no fim do Turno sem fim (formulário de nome) e, na Carreira, na tela de fim de dia, um campo "Seu nome" + botão "Salvar no ranking" que registra o total acumulado da carreira (soma dos melhores resultados por dia) e o maior dia concluído. Lembrar o último nome digitado (localStorage, try/catch) e pré-preencher.
- Mesmo jogador mantém só a melhor pontuação (regra do clone).
- Armazenamento compartilhado via capacidade `db` do artifact (o ranking é visto por todos com quem o jogo for compartilhado):
  - Leia e siga estritamente as definições em `/tmp/claude-0/bundled-skills/2.1.299/4c94347bdfc5de03ddcfbc56131ffa13/artifact-capabilities/0.2.77/claude.d.ts`, `db.d.ts` e `user.d.ts` (leia com a ferramenta Read, inteiras).
  - A página obtém `const db = await claude.use("db")` e `const user = await claude.use("user")` SEM bloquear o jogo; acesse via `window.claude?.use` e trate `null`/ausência (fora do viewer, `window.claude` não existe).
  - Documentos: `ranking-carreira/<userId>` e `ranking-semfim/<userId>`, onde `userId = await user.id()`. Campos: `nome` (string, até 16 caracteres, limpar espaços), `pontos` (inteiro), `dia` (int, carreira) ou `tempo` (segundos, sem fim), `quando` (ISO). Antes de gravar, ler o doc do próprio usuário e só sobrescrever se `pontos` for maior (o nome pode ser atualizado sempre).
  - Leitura: `onSnapshot` na coleção da aba ativa enquanto a tela de Ranking estiver aberta (assinar uma vez por aba e cancelar ao sair), limite 50, ordenação feita no cliente conforme os controles.
  - Regras (vou declarar na publicação, não precisa estar no código): `ranking-carreira` e `ranking-semfim` read "view" write "owner"; `ranking-*/{self}` write "interact".
  - Fallback: se `db` for null, se `user.id()` vier null ou se a gravação for recusada (ex.: `permission_denied`/`not_granted`), usar ranking LOCAL em localStorage (chave `lcc2_ranking`, mesma lógica de melhor pontuação por nome normalizado) e mostrar um aviso discreto na tela de Ranking: "Ranking deste aparelho" vs "Ranking compartilhado". Nunca travar o jogo por erro de rede; mostrar mensagem curta se salvar falhar.
  - Textos vindos do db são não confiáveis: inserir com textContent, nunca innerHTML.

## 6. Versões e histórico
- Chaves de localStorage da v2 devem usar o prefixo `lcc2_` (a v1, publicada no mesmo endereço em `versoes/v1.html`, usa `lcc_save_v1`). Na primeira execução da v2, se não houver `lcc2_save` mas existir `lcc_save_v1`, importe o progresso (dia máximo, dinheiro, upgrades).
- No menu, link discreto "Versões" que abre um painel com o histórico:
  - v2 — 14/10/2026 — "Comandas coloridas, humor por cor, fila lotada, Turno sem fim e ranking compartilhado." (versão atual)
  - v1 — 13/10/2026 — "Primeira versão: carreira de 7 dias, lojinha, corrente e bônus de cor." com link `<a href="versoes/v1.html" target="_blank" rel="noopener">Abrir a v1</a>`.
- Mostre "v2" pequeno no canto do menu.

## 7. Correções visuais da v1 (vistas nas capturas)
- Placa "ABERTO" na porta extrapola a largura da porta: reduzir fonte/encaixar.
- Rótulo "PIA E LOUÇA" fica coberto pela torneira (aparece "PIA E ÇA"): reposicionar rótulo ou torneira.
- Conferir que nenhum outro rótulo do balcão é sobreposto.

## 8. Balanceamento
- Recalibre metas da carreira com o bot existente se as mudanças alterarem o ritmo (fila lotada agora faz perder clientes). Metas devem continuar alcançáveis pelo bot em todos os 7 dias.

## Entrega e testes
- Edite `/home/claude/lanchonete.html` no lugar (mesmo nome de arquivo). Continua sem doctype/html/head/body, começando com `<title>Lanchonete Corre-Corre</title>`.
- Os scripts de teste anteriores estão em `/tmp/claude-0/-home-claude/4c0b6264-5d96-5502-8112-41bb38fbb1d8/scratchpad/` (smoke.js, smoke2.js, shot.py). Atualize-os/adicione testes para: pool de cores (sem repetição entre pedidos ativos, devolução ao sair), fila lotada, Turno sem fim (estrelas caem, recuperam, fim com 0), ranking local (melhor por nome, ordenação nos 4 sentidos) e o caminho db com um stub de `window.claude.use` que simula db/user (inclusive `null` e gravação recusada).
- `node --check` no JS extraído; bot da carreira nos 7 dias; capturas Playwright do menu, painel de versões, jogo com comandas coloridas, Turno sem fim, tela de ranking e fim de turno. Confira visualmente as capturas você mesmo.
- Resposta final curta (até 15 linhas): o que mudou, o que ficou de fora, resultados dos testes, caminhos das capturas mais representativas (jogo com comandas, ranking, menu). Não cole código.
