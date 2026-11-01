# Log de propostas

Registro dos pedidos, ideias e retornos de quem usa, com o texto original, e de onde cada um foi parar (entrega feita, etapa do `docs/PLANO.md` ou ideia guardada). Entradas novas vão no topo, com `python3 ferramentas/anota.py docs/PROPOSTAS.md <<'EOF' ... EOF`, sem ler o arquivo. Aqui ficam só os em aberto; os entregues vão para o `docs/PROPOSTAS-FEITAS.md` (`python3 ferramentas/arquiva.py docs/PROPOSTAS.md docs/PROPOSTAS-FEITAS.md --topo "## dd/mm — quem: assunto"`).

Formato de cada entrada:

    ## dd/mm — quem: assunto
    > "texto original, sem corrigir"

    Destino: etapa X do PLANO.md / ideia guardada / entregue em (data, com o que mudou).

---
