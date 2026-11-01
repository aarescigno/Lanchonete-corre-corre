# Log de propostas

Registro das ideias e dos retornos de quem jogou, com o texto original, e de onde cada proposta foi parar (versão feita, etapa do `docs/PLANO.md` ou ideia guardada). Entradas novas vão no topo, com `python3 ferramentas/anota.py docs/PROPOSTAS.md <<'EOF' ... EOF`, sem ler o arquivo. Aqui ficam só os retornos em aberto; os entregues vão para o `docs/PROPOSTAS-FEITAS.md` (`python3 ferramentas/arquiva.py docs/PROPOSTAS.md docs/PROPOSTAS-FEITAS.md --topo "## data — quem: assunto"`).

Formato de cada entrada:

    ## dd/mm — quem: assunto
    > "texto original, sem corrigir"

    Destino: etapa X do PLANO.md / ideia guardada / feito na vN (com o que mudou).

---
