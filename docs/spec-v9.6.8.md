# v9.6.8 — Menos texto na tela (etapa 3f-2)

Pedido do usuário (01/11, `docs/PROPOSTAS.md`): o jogo é para sentir, não para calcular. A explicação vive no Manual (3f-1); a tela fica só com o que se usa na hora. Sem mudar números do jogo.

## O que mudou
1. **Lojinha, todos os cartões:** sai a descrição (`desc` de `UPGRADES`, dos níveis de `maquina`, `DECOR` e `DIVULGA` foi apagado de `10-constantes.js`, e os textos longos de `41-lojinha.js`). Ficam o desenho, o nome, o preço ou a diária em R$, a situação curta ("Você tem 2", "Guardado", "Em curso") e os botões.
2. **"?" em cada cartão** (`maisAjuda`, botão redondo de 26 px no canto, `aria-label="No Manual: <nome>"`, `data-ficha`): abre a ficha no Manual (`abrirManual(ficha, 'shop')`). Cursos de cardápio → `l-cardapio`; equipe → `e-<pessoa>`; decoração → `l-decor`; Divulgação → `l-divulga`; melhorias → `l-<id>`; os de TV, assento, couvert e fogão têm a deles; Banco e Mudança → `l-banco` e `l-mudanca`. Caixa e Gurugol ficam sem.
3. **Quadro "agora → próximo nível"** (`nivRows`): bolinhas por qualidade (Rapidez, Capricho, Pia, Tarefas) e a Diária em R$. Sai "Lava 1 pilha" e o "Prato caprichado ★".
4. **Experiência** (Tonhão, Dani, Joca): só a barra com o rótulo "Experiência" ("Pronto para o aumento!" quando dá). Sai o "Faltam N de experiência".
5. **Salão:** a dica vira "Arraste as mesas. Toque numa mesa para mais opções." **Mudança:** nome do ponto, mudança e aluguel. **Banco:** sai a prosa, ficam as tabelas.
6. **Abertura do dia** (`43-telas.js`): "Meta: R$ X · ★★ R$ Y · ★★★ R$ Z" (sem grupos, tempo e custos); notas novas dos dias 1 a 5 e 7 (`DAYS`); dia 4 sem Efood: "Dia de movimento!"; "Primeira vez? Faça a Missão zero, no menu."; textos curtos do dia largado, do caixa no negativo, da parcela atrasada, da carência e da parcela do dia; Turno sem fim curto.
7. **No jogo:** balão do 1º VIP "Chegou cliente VIP!\nFura a fila e quer tudo quentinho."; nota da pausa "Se sair agora, o dia não conta." (+ a multa de quem está no salão).
8. Não mudam: as falas do Modo História, a Missão zero, o Gurugol, o fim do dia e os `title` dos botões.

## Testes
`smoke54.js` (40 checagens): nos 3 pontos, nenhum `span` de cartão com mais de 40 caracteres (fora o Banco); todo cartão tem o "?" com ficha que existe; o "?" abre a ficha certa e o Voltar volta à lojinha; o quadro de Tonhão, Dani, Joca, Cami e Anselmo em bolinhas e em R$, sem % nem segundos; abertura do dia 3 sem os custos e as notas dos dias 1, 3 e 7. Smokes 9, 12, 15, 16, 19 a 23, 30, 31, 34, 35, 37 a 39, 42, 43, 45, 48 e 50 ajustados aos textos novos (e `.pop()`/índices de botão agora ignoram o "?"). Sem mudança de jogo: o `balance` não rodou.
