# Relatórios do Teste de habilidade

Os relatórios que os jogadores (e os beta testers) colam no chat depois de jogar o Teste de habilidade do modo dev (v12.2). Servem para a 14b: nivelar o bot humano com o jeito de jogar de gente. Quem lê é a ferramenta, não a sessão: **não leia este arquivo inteiro**; rode `python3 ferramentas/relatorios.py` (resumo por fase e por jogador; `--bot` roda junto o bot comum e o afiado nas mesmas fases, para comparar).

## Como anexar
Um bloco por relatório, como veio (sem mexer no texto), no fim do arquivo, sem reler:

```
cat >> docs/RELATORIOS.md <<'EOF'

LCC-TESTE 3 · v12.4 · Garagem · dia 7 · semente 7001
Jogador: Ana · tentativa 3 · celular · toque 412×915 · 18/11/2026 18:40
Equipe: Dani (recolher, lavar, água)
...
EOF
```

Uma linha em branco entre os blocos. A 1ª linha (`LCC-TESTE 3 · ...`) abre o bloco; o número depois de `LCC-TESTE` é o formato (3 desde a v12.4, com a linha `Equipe:` logo depois de `Jogador:`; 2 desde a v12.3.2, com o tipo do aparelho na linha `Jogador:`: celular, tablet, computador ou bot; os blocos do formato 1 seguem lidos, com o tipo `?`). Se o formato mudar, o número sobe e a ferramenta ganha o leitor novo, sem apagar os antigos.

## Os relatórios

LCC-TESTE 3 · v12.8.2 · Garagem · dia 7 · semente 7001
Jogador: Arthur · tentativa 3 · celular · toque 832×384 · 20/11/2026 15:51
Equipe: Dani (recolher, lavar, cafezinho)
Resultado: lucro R$ 516 · meta R$ 250 (206%) · ★★★ · servidos 22 de 32 · Gúgou 3,2
Perdidos: 0 · fila sem mesa 0 · fila com mesa 0 · pedido 0 · prato 0 · conta 0 · retirada 0 · esfriou 0
Reação em s (média / mediana / casos): sentar 6,4 / 6,7 / 19 · pedido 2,1 / 1,3 / 18 · prato 3,8 / 2,6 / 19 · conta 2,3 / 1,0 / 19 · mesa suja 1,1 / 1,1 / 2
Ritmo: 39,3 ações/min · 5 toques perdidos · fila média 1,4
Bia parada: 23% do turno com coisa à espera
